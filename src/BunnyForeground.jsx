import { useEffect, useRef, useState } from "react";

// The supplied film has a red backdrop; key its colour rather than clipping the moving figure.
export default function BunnyForeground({ videoRef }) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current, canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!video || !gl) { setFailed(true); return; }
    const shaders = [];
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      shaders.push(shader); return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}");
    const fragment = compile(gl.FRAGMENT_SHADER, `precision mediump float;
      varying vec2 uv;uniform sampler2D film;uniform vec2 cover;
      void main(){vec2 q=vec2(1.)-(vec2(1.)-uv)*cover;vec4 c=texture2D(film,q);
        float red=min(c.r-c.g,c.r-c.b);
        float alpha=1.-smoothstep(.018,.075,red);
        gl_FragColor=vec4(c.rgb,alpha);
      }`);
    const program = gl.createProgram();
    if (!vertex || !fragment) { shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); setFailed(true); return; }
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); setFailed(true); return; }
    const buffer = gl.createBuffer(), texture = gl.createTexture();
    gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    const cover = gl.getUniformLocation(program,"cover");
    let frame = 0, stopped = false;
    const draw = () => {
      if (stopped) return;
      if (video.readyState >= 2 && !document.hidden) {
        canvas.width = Math.max(1,Math.round(canvas.clientWidth));
        canvas.height = Math.max(1,Math.round(canvas.clientHeight));
        const screenAspect = canvas.width/canvas.height, filmAspect = video.videoWidth/video.videoHeight;
        gl.viewport(0,0,canvas.width,canvas.height);
        gl.uniform2f(cover,Math.min(1,screenAspect/filmAspect),Math.min(1,filmAspect/screenAspect));
        try { gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,video); gl.drawArrays(gl.TRIANGLES,0,6); }
        catch { setFailed(true); return; }
      }
      frame = video.requestVideoFrameCallback ? video.requestVideoFrameCallback(draw) : requestAnimationFrame(draw);
    };
    draw();
    return () => {
      stopped = true;
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frame); else cancelAnimationFrame(frame);
      gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s => gl.deleteShader(s));
    };
  }, [videoRef]);
  return <><canvas ref={canvasRef} className="contact-bunny-foreground" aria-hidden="true" />{failed && <span className="contact-foreground-status">The animated figure is unavailable in this browser.</span>}</>;
}
