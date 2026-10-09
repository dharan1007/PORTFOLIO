import { useEffect, useRef, useState } from 'react';
import { editorialAssets, getPhotoUrl, type EditorialKey } from '../data/media';

/** Real editorial photography, with loading/error state and provenance. */
export function EditorialImage({ asset, className='', eager=false, label=false }: {
  asset:EditorialKey; className?:string; eager?:boolean; label?:boolean
}){
 const photo=editorialAssets[asset].photo;
 const [failed,setFailed]=useState(false);
 return <figure className={'editorial-media editorial-photo '+className} data-asset={asset} data-kind="photograph">
  {!failed?<img src={getPhotoUrl(asset,1080)} srcSet={[640,1080,1600,1920].map(width=>getPhotoUrl(asset,width)+" "+width+"w").join(", ")} sizes="(max-width: 560px) 100vw, (max-width: 900px) 75vw, 45vw" alt={photo.alt} loading={eager?'eager':'lazy'} decoding="async"
    fetchPriority={eager?'high':undefined} style={{objectPosition:photo.focal??'center'}} onError={()=>setFailed(true)}/>:
    <div className="editorial-media-unavailable" role="img" aria-label={photo.alt}><span>MEDIA CURRENTLY UNAVAILABLE</span></div>}
  {label&&<figcaption>{editorialAssets[asset].label} <span> / PEXELS</span></figcaption>}
 </figure>;
}

/** Lazy HTML5 footage. No animation on reduced motion or data saver, only the
 * real photographic poster. Pauses when outside the viewport. */
export function EditorialVideo({asset,className='',priority=false}:{
 asset:EditorialKey;className?:string;priority?:boolean
}){
 const record=editorialAssets[asset];
 const videoRef=useRef<HTMLVideoElement>(null);
 const hostRef=useRef<HTMLDivElement>(null);
 const [failed,setFailed]=useState(false);
 const [active,setActive]=useState(false);
 useEffect(()=>{
   const video=videoRef.current,host=hostRef.current,clip=record.video;
   if(!clip||!video||!host)return;
   const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
   const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;
   const allowed=()=>!motion.matches&&!connection?.saveData;
   let visible=false;
   const sync=()=>{
     if(visible&&allowed()&&!document.hidden){
       if(!video.querySelector('source'))return;
       try{const result=video.play();result?.catch?.(()=>{setActive(false);});}catch{setActive(false);}
     } else {video.pause();setActive(false);}
   };
   const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{
     visible=!!entries[0]?.isIntersecting;sync();
   },{rootMargin:priority?'300px 0px':'150px 0px',threshold:.01});
   if(observer)observer.observe(host);else{visible=true;sync();}
   document.addEventListener('visibilitychange',sync);
   motion.addEventListener?.('change',sync);
   return()=>{observer?.disconnect();document.removeEventListener('visibilitychange',sync);motion.removeEventListener?.('change',sync);video.pause();};
 },[asset,priority,record.video]);
 return <div className={'editorial-video editorial-media '+className} ref={hostRef} data-asset={asset} data-kind="licensed-video">
   <EditorialImage asset={asset} eager={priority} className="editorial-poster"/>
   {record.video&&!failed&&<video ref={videoRef} muted playsInline loop autoPlay={false} preload="metadata" poster={getPhotoUrl(asset,1280)}
      aria-hidden="true" className={active?'is-playing':''} onPlaying={()=>setActive(true)} onPause={()=>setActive(false)} onError={()=>{setActive(false);setFailed(true);}}>
      <source src={record.video.url} type="video/mp4"/>
   </video>}
   <span className="media-editorial-label" aria-hidden="true">{record.video&&!failed?'LICENSED MOTION FOOTAGE':'EDITORIAL PHOTOGRAPHY'}</span>
 </div>;
}
