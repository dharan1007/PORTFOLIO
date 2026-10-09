import { useEffect, useState, type CSSProperties } from 'react';
import type { Project } from '../data/projects';

export type PreviewView = 'desktop'|'detail'|'mobile';

/** All preview images are actual captures of project.liveUrl. We never use an
 * editorial photo, a fabricated browser screenshot, or another website as
 * a substitute. An unavailable capture degrades to an honest URL/status card.
 */
export function captureUrl(url:string, view:PreviewView='desktop', provider:0|1=0){
 const sizes={desktop:{w:1200,h:800},detail:{w:1200,h:570},mobile:{w:450,h:860}};
 const {w,h}=sizes[view];
 if(provider===0)return 'https://image.thum.io/get/width/'+w+'/crop/'+h+'/noanimate/'+url;
 return 'https://s.wordpress.com/mshots/v1/'+encodeURIComponent(url)+'?w='+w+'&h='+h;
}

export function ProjectPreview({project,large=false,view='desktop',bare=false}:{
  project:Project;large?:boolean;view?:PreviewView;bare?:boolean
}){
 const [provider,setProvider]=useState<0|1|2>(0);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{setProvider(0);setLoaded(false);},[project.liveUrl,view]);
 if(!project.liveUrl||!/^https?:\/\//i.test(project.liveUrl))return null;
 const label=project.liveUrl.replace(/^https?:\/\//,'').replace(/\/$/,'');
 return <div className={'live-preview real-site-preview '+(large?'live-preview-large ':'')+(bare?'bare-site-preview ':'')+(loaded?'is-captured ':'')+(provider===2?'capture-unavailable ':'')} data-site={project.id} data-preview-view={view}
    style={{'--accent':project.accent} as CSSProperties}>
    <div className="live-preview-fallback" aria-label={'Preview of '+label}>
      <span className="mono">{provider===2?'WEBSITE CAPTURE UNAVAILABLE':'CAPTURING ACTUAL WEBSITE'}</span>
      <strong>{project.name}</strong>
      <small>{label}</small>
      <span className="capture-fallback-prompt">{provider===2?'OPEN THE LIVE WEBSITE TO VIEW THE ACTUAL PAGE ↗':'LIVE PAGE / '+project.year}</span>
    </div>
    {provider!==2&&<img
      key={view+'-'+provider+'-'+project.id}
      data-project-snapshot={project.id}
      data-capture-provider={provider===0?'thum':'mshots'}
      src={captureUrl(project.liveUrl,view,provider)}
      alt={project.name + ' current public project preview — actual website capture at ' + label}
      loading={large?'eager':'lazy'} decoding="async"
      referrerPolicy="no-referrer"
      onLoad={()=>setLoaded(true)}
      onError={()=>{setLoaded(false);setProvider(current=>current===0?1:2);}}
    />}
    {!bare&&<div className="live-preview-topbar">
      <span className="live-dot"/><span>{project.name}</span>
      <span>{provider===2?'SURFACE ↗':'LIVE SNAPSHOT ↗'}</span>
    </div>}
  </div>;
}
