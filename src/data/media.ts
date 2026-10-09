/**
 * Editorial media register. Each entry points to a real, attributable asset:
 * Pexels photographs (Pexels License) and Mixkit Free License footage.
 * These are illustrative visuals, not screenshots or evidence of a project.
 * Live product screenshots are generated separately from project.liveUrl.
 * Replace sources here, not in JSX or CSS.
 */
export type EditorialKey =
  | 'hero'|'connection'|'intelligence'|'engineering'|'signals'|'applied'
  | 'laboratory'|'about'|'experience'|'contact'|'company'|'research'|'airadise';

type Photograph = {
  id: number; alt: string; creator: string; page: string; focal?: string;
};
type Footage = { url: string; page: string; title: string; provider: 'Mixkit' };
type EditorialAsset = { photo: Photograph; video?: Footage; label: string };

export const editorialAssets: Record<EditorialKey, EditorialAsset> = {
  hero: {
    label:'REAL FOOTAGE / COMPUTING',
    photo:{id:36169771,alt:'Macro photograph of microchips and components on a physical circuit board',creator:'Jakub Pabis',page:'https://www.pexels.com/photo/close-up-of-computer-circuit-board-components-36169771/',focal:'center'},
    video:{url:'https://assets.mixkit.co/videos/preview/mixkit-microchip-technology-close-up-1140-large.mp4',page:'https://mixkit.co/free-stock-video/microchip-technology-close-up-1140/',title:'Microchip technology close up',provider:'Mixkit'}
  },
  connection:{
    label:'HUMAN CONNECTION / EDITORIAL',
    photo:{id:3183136,alt:'People collaborating around laptops in a shared workspace',creator:'fauxels',page:'https://www.pexels.com/photo/people-using-laptops-3183136/',focal:'center'}
  },
  intelligence:{
    label:'PHYSICAL COMPUTATION / EDITORIAL',
    photo:{id:2182863,alt:'Macro detail of electronic circuitry and processor components',creator:'TimSon Foox',page:'https://www.pexels.com/photo/circuit-board-2182863/',focal:'center'}
  },
  engineering:{
    label:'SOFTWARE ENGINEERING / EDITORIAL',
    photo:{id:6424590,alt:'Close photograph of a laptop screen displaying code in a dark workspace',creator:'Nemuel Sereti',page:'https://www.pexels.com/photo/programming-code-on-laptop-screen-6424590/',focal:'center'}
  },
  signals:{
    label:'DATA AND MARKETS / EDITORIAL',
    photo:{id:6770609,alt:'Financial market data chart displayed on a laptop',creator:'Alesia Kozik',page:'https://www.pexels.com/photo/black-and-silver-laptop-with-stock-market-display-on-screen-6770609/',focal:'center'}
  },
  applied:{
    label:'APPLIED SYSTEMS / EDITORIAL',
    photo:{id:12387448,alt:'Overhead aerial photograph of green agricultural fields and their geometry',creator:'Quang Nguyen Vinh',page:'https://www.pexels.com/photo/drone-shot-of-green-field-12387448/',focal:'center'}
  },
  laboratory:{
    label:'DESIGN RESEARCH / EDITORIAL',
    photo:{id:16349286,alt:'Geometric concrete architectural structure against a bright sky',creator:'Lucas Mota',page:'https://www.pexels.com/photo/minimalistic-concrete-building-16349286/',focal:'center'}
  },
  about:{
    label:'STRUCTURE / EDITORIAL',
    photo:{id:11518786,alt:'Abstract rhythm of windows and concrete on a modernist building facade',creator:'Nothing Ahead',page:'https://www.pexels.com/photo/windows-and-dirty-wall-11518786/',focal:'center'}
  },
  experience:{
    label:'THE ENGINEERING PRACTICE / EDITORIAL',
    photo:{id:5496459,alt:'Hands typing on a laptop with a software editor in a dark studio',creator:'Pavel Danilyuk',page:'https://www.pexels.com/photo/a-person-typing-on-a-laptop-5496459/',focal:'center'}
  },
  contact:{
    label:'THE NEXT CONNECTION / EDITORIAL',
    photo:{id:35652416,alt:'Electronic components arranged on a dark background, photographed in close detail',creator:'Tanha Tamanna Syed',page:'https://www.pexels.com/photo/electronic-circuit-board-with-components-in-studio-setup-35652416/',focal:'center'}
  },
  company:{
    label:'INFRASTRUCTURE / EDITORIAL',
    photo:{id:17489163,alt:'Physical server equipment illuminated inside a data centre',creator:'panumas nikhomkhai',page:'https://www.pexels.com/photo/computer-server-in-data-center-room-17489163/',focal:'center'}
  },
  research:{
    label:'EVIDENCE AND UNCERTAINTY / EDITORIAL',
    photo:{id:35501997,alt:'Market analysis and financial charts visible on a tablet and laptop',creator:'Jakub Zerdzicki',page:'https://www.pexels.com/photo/stock-market-analysis-on-tablet-and-laptop-display-35501997/',focal:'center'}
  },
  airadise:{
    label:'ENGINEERING RESEARCH / EDITORIAL',
    photo:{id:6424588,alt:'A real software-development workspace with code displayed on a screen',creator:'Nemuel Sereti',page:'https://www.pexels.com/photo/computer-program-on-the-monitor-6424588/',focal:'center'},
    video:{url:'https://assets.mixkit.co/videos/preview/mixkit-striking-texture-of-the-liquid-from-a-lava-lamp-51737-large.mp4',page:'https://mixkit.co/free-stock-video/striking-texture-of-the-liquid-from-a-lava-lamp-51737/',title:'Striking texture of liquid from a lava lamp',provider:'Mixkit'}
  }
};

/** Structured, automatically derived media credits, not manual duplicated HTML. */
export const licensedMediaCredits = Object.values(editorialAssets).flatMap(asset=>
  [{kind:'Photo',title:asset.photo.alt,creator:asset.photo.creator,url:asset.photo.page},
   ...(asset.video?[{kind:'Video',title:asset.video.title,creator:asset.video.provider,url:asset.video.page}]:[])]
);
export function getPhotoUrl(key:EditorialKey,width=1600){
  const id=editorialAssets[key].photo.id;
  return 'https://images.pexels.com/photos/'+id+'/pexels-photo-'+id+'.jpeg?auto=compress&cs=tinysrgb&w='+width;
}
