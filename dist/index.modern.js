import e,{useRef as t,useEffect as o}from"react";import{Tween as a,Easing as n,update as i}from"es6-tween";import{PerspectiveCamera as r,Mesh as s,SphereGeometry as c,TextureLoader as l,MeshLambertMaterial as u,MeshBasicMaterial as d,BackSide as m,AmbientLight as h,PointLight as p,Color as k,Group as b,BoxGeometry as g,Vector3 as f,WebGLRenderer as w,Scene as M}from"three";import y from"resize-observer-polyfill";import{createGlowMesh as C}from"three-glow-mesh";import{scaleLinear as x}from"d3-scale";import{OrbitControls as R}from"three/examples/jsm/controls/OrbitControls";import{Interaction as v}from"three.interaction";import E from"tippy.js";const T={onClickMarker:(e,t,o)=>{},onTouchMarker:(e,t,o)=>{},onDefocus:e=>{},onGlobeBackgroundTextureLoaded:()=>{},onGlobeCloudsTextureLoaded:()=>{},onGlobeTextureLoaded:()=>{},onMouseOutMarker:(e,t,o)=>{},onMouseOverMarker:(e,t,o)=>{}},F="https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/background.png",S="https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/clouds.png",D="https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe.jpg",G=[1.29027,103.851959],O={ambientLightColor:"white",ambientLightIntensity:.8,cameraAutoRotateSpeed:.1,cameraDistanceRadiusScale:3,cameraMaxDistanceRadiusScale:100,cameraMaxPolarAngle:Math.PI,cameraMinPolarAngle:0,cameraRotateSpeed:.2,cameraZoomSpeed:1,enableCameraAutoRotate:!0,enableCameraRotate:!0,enableCameraZoom:!0,enableDefocus:!0,enableGlobeGlow:!0,enableMarkerGlow:!0,enableMarkerTooltip:!0,focusAnimationDuration:1e3,focusDistanceRadiusScale:1.5,focusEasingFunction:["Cubic","Out"],globeCloudsOpacity:.3,globeGlowCoefficient:.1,globeGlowColor:"#d1d1d1",globeGlowPower:3,globeGlowRadiusScale:.2,markerEnterAnimationDuration:1e3,markerEnterEasingFunction:["Linear","None"],markerExitAnimationDuration:500,markerExitEasingFunction:["Cubic","Out"],markerGlowCoefficient:0,markerGlowPower:3,markerGlowRadiusScale:2,markerOffsetRadiusScale:0,markerRadiusScaleRange:[.005,.02],markerRenderer:null,markerTooltipRenderer:e=>JSON.stringify(e.coordinates),markerType:"dot",pointLightColor:"white",pointLightIntensity:1,pointLightPositionRadiusScales:[-2,1,-1]},L={enableMarkerGlow:!0,markerRadiusScaleRange:[.005,.02],markerType:"dot"},A={enableMarkerGlow:!1,markerRadiusScaleRange:[.2,.5],markerType:"bar"};function z(){return(z=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var a in o)Object.prototype.hasOwnProperty.call(o,a)&&(e[a]=o[a])}return e}).apply(this,arguments)}function P(e,t){const[o,a]=e,n=o*Math.PI/180,i=(a-180)*Math.PI/180;return[-t*Math.cos(n)*Math.cos(i),t*Math.sin(n),t*Math.cos(n)*Math.sin(i)]}function j(e,t){const o=z({},t);return Object.keys(o).forEach(t=>{const a=e[t];o[t]=void 0===a?o[t]:a}),o}function B({from:e,to:t,animationDuration:o,easingFunction:i,onUpdate:r,onEnd:s=null,delay:c=0}){const[l,u]=i;new a(e).to(t,o).easing(n[l][u]).on("update",r).on("complete",s).delay(c).start()}class I{constructor(e){this.element=e,this.instance=E([e],{animation:"scale",arrow:!1})[0]}destroy(){this.instance.destroy()}hide(){document.body.style.cursor="inherit",this.element.style.position="fixed",this.element.style.left="0",this.element.style.top="0",this.instance.hide()}show(e,t,o){document.body.style.cursor="pointer",this.element.style.position="fixed",this.element.style.left=e+10+"px",this.element.style.top=t+10+"px",this.instance.setContent(o),this.instance.show()}}class U{constructor({canvasElement:e,initialCameraDistanceRadiusScale:t=O.cameraDistanceRadiusScale,initialCoordinates:o=G,textures:a={},tooltipElement:n}){this.callbacks=T,this.focus=null,this.isLocked=!1,this.markers=[],this.options=O,this.textures=a,this.previousFocus=null,this.tooltip=new I(n),this.renderer=new w({alpha:!0,antialias:!0,canvas:e}),this.camera=function(e,t){const o=new r;o.name="camera",o.far=3e5,o.fov=45,o.near=1;const[a,n,i]=P(e,300*t);return o.position.set(a,n,i),o}(o,t),this.earth=function(){const e=new s;e.geometry=new c(300,50,50),e.name="earth";const t=new s;t.geometry=new c(301,50,50),t.name="clouds";const o=new s;return o.name="background",o.geometry=new c(3e4,50,50),{clouds:t,globe:e,background:o}}(),this.lights=function(){const e=new h("white"),t=new p("white");return e.name="ambientLight",t.name="pointLight",{ambient:e,point:t}}(),this.markerObjects=function(){const e=new b;return e.name="markers",e}(),this.orbitControls=new R(this.camera,this.renderer.domElement),this.scene=function({camera:e,earth:t,lights:o,markerObjects:a,renderer:n,defocus:i}){const r=new M;return e.add(o.ambient),e.add(o.point),r.add(e),r.add(t.globe),r.add(a),new v(n,r,e),r.on("click",i),r.on("touchstart",i),r}({camera:this.camera,earth:this.earth,lights:this.lights,markerObjects:this.markerObjects,renderer:this.renderer,defocus:this.defocus.bind(this)}),this.updateOptions(),this.updateCallbacks(),this.updateMarkers()}animate(){this.render(),this.animationFrameId=requestAnimationFrame(this.animate.bind(this))}animateClouds(){["x","y","z"].forEach(e=>{this.earth.clouds.rotation[e]+=Math.random()/1e4})}applyAnimations(e){let t=0;const o=[];return e.forEach((a,n)=>{const{coordinates:i,focusAnimationDuration:r,focusDistanceRadiusScale:s,focusEasingFunction:c}=a,l={focusAnimationDuration:r,focusDistanceRadiusScale:s,focusEasingFunction:c},u=n===e.length-1,d=setTimeout(()=>{this.unlock(),this.updateFocus(i,l,u)},t);o.push(d),t+=r}),()=>{o.forEach(e=>{clearTimeout(e)})}}defocus(){!this.isLocked&&this.previousFocus&&this.options.enableDefocus&&(this.updateFocus(null),this.callbacks.onDefocus(this.previousFocus))}destroy(){cancelAnimationFrame(this.animationFrameId),this.tooltip.destroy(),this.renderer.domElement.remove()}lock(){this.isLocked=!0,this.orbitControls.enabled=!1,this.orbitControls.autoRotate=!1}render(){this.renderer.sortObjects=!1,this.renderer.render(this.scene,this.camera),this.orbitControls.update(),this.animateClouds(),i()}resize(e){const{height:t,width:o}=e;this.renderer.setSize(o,t),this.camera.aspect=o/t,this.camera.updateProjectionMatrix(),this.render()}saveFocus(e){this.previousFocus=e}unlock(){this.isLocked=!1,this.orbitControls.enabled=!0,this.orbitControls.autoRotate=!0}updateCallbacks(e={}){this.callbacks=j(e,T)}updateFocus(e,t={},o=!0){this.isLocked||(this.focus=e,function(e,t,{options:o,previousFocus:a,shouldUnlockAfterFocus:n,lock:i,unlock:r,saveFocus:s}){const{cameraDistanceRadiusScale:c,focusAnimationDuration:l,focusDistanceRadiusScale:u,focusEasingFunction:d}=o;if(e){const o=[t.position.x,t.position.y,t.position.z],a=P(e,300*u);s(e),i(),B({from:o,to:a,animationDuration:l,easingFunction:d,onUpdate:()=>{const[e,a,n]=o;t.position.set(e,a,n)},onEnd:()=>{n&&r()}})}else if(a){const e=[t.position.x,t.position.y,t.position.z],o=P(a,300*c);i(),B({from:e,to:o,animationDuration:l,easingFunction:d,onUpdate:()=>{const[o,a,n]=e;t.position.set(o,a,n)},onEnd:()=>{s(null),r()}})}}(this.focus,this.camera,{shouldUnlockAfterFocus:o,options:j(t,this.options),previousFocus:this.previousFocus,lock:this.lock.bind(this),unlock:this.unlock.bind(this),saveFocus:this.saveFocus.bind(this)}))}updateMarkers(e=[]){this.markers=e,function(e,{callbacks:t,markers:o,options:a}){const{markerExitAnimationDuration:n,markerExitEasingFunction:i,markerRadiusScaleRange:r}=a,l=o.map(e=>e.value),m=new Set(o.map(e=>e.id)),[h,p]=r,k=x().domain([Math.min.apply(null,l),Math.max.apply(null,l)]).range([300*h,300*p]);o.forEach(t=>{const{id:o,value:n}=t,i=k(n);let r=e.children.find(e=>e.marker.id===t.id);r||(r=function(e,t,o){const{enableMarkerGlow:a,markerEnterAnimationDuration:n,markerEnterEasingFunction:i,markerGlowCoefficient:r,markerGlowPower:l,markerGlowRadiusScale:m,markerOffsetRadiusScale:h,markerRenderer:p,markerType:k}=t;let b;if(p)b=p(e);else{const t=e.color||"gold",h={size:0},p={size:o},f=new s;B({from:h,to:p,animationDuration:n,easingFunction:i,onUpdate:()=>{switch(k){case"bar":f.geometry=new g(3,3,h.size),f.material=new u({color:t});break;case"dot":default:if(f.geometry=new c(h.size,10,10),f.material=new d({color:t}),a){const e=C(f.geometry,{backside:!1,coefficient:r,color:t,power:l,size:h.size*m});f.children=[],f.add(e)}}}}),b=f}let w=0;w=h?300*h:"dot"===k?o*(1+m)/2:0;const M=P(e.coordinates,300+w);return b.position.set(...M),b.lookAt(new f(0,0,0)),b.name=e.id,b}(t,a,i),r.name=o,e.add(r)),r.marker=t}),e.children.forEach(o=>{if(!m.has(o.marker.id)){const t=o.scale.toArray();B({from:t,to:[0,0,0],animationDuration:n,easingFunction:i,onUpdate:()=>{o&&o.scale.set(...t)},onEnd:()=>{e.remove(o)}})}!function(e,t){const{marker:o}=e;e._listeners={},e.on("click",a=>{t.onClickMarker(o,e,a.data.originalEvent)}),e.on("touchstart",a=>{t.onTouchMarker(o,e,a.data.originalEvent)}),e.on("mousemove",a=>{t.onMouseOverMarker(o,e,a.data.originalEvent)}),e.on("mouseout",a=>{t.onMouseOutMarker(o,e,a.data.originalEvent)})}(o,t)})}(this.markerObjects,{options:this.options,markers:e,callbacks:{onClickMarker:(e,t,o)=>{this.updateFocus(e.coordinates),this.callbacks.onClickMarker(e,t,o)},onTouchMarker:(e,t,o)=>{this.updateFocus(e.coordinates),this.options.enableMarkerTooltip&&this.tooltip.show(o.clientX,o.clientY,this.options.markerTooltipRenderer(t.marker)),this.callbacks.onTouchMarker(e,t,o)},onMouseOutMarker:(e,t,o)=>{this.tooltip.hide(),this.callbacks.onMouseOutMarker(e,t,o)},onMouseOverMarker:(e,t,o)=>{this.options.enableMarkerTooltip&&this.tooltip.show(o.clientX,o.clientY,this.options.markerTooltipRenderer(t.marker)),this.callbacks.onMouseOverMarker(e,t,o)}}})}updateOptions(e={}){this.options=j(e,O),function(e,{callbacks:t,options:o,textures:a}){const{enableGlobeGlow:n,globeCloudsOpacity:i,globeGlowColor:r,globeGlowCoefficient:s,globeGlowPower:c,globeGlowRadiusScale:h}=o,{onGlobeBackgroundTextureLoaded:p,onGlobeCloudsTextureLoaded:k,onGlobeTextureLoaded:b}=t,{globeBackgroundTexture:g=F,globeCloudsTexture:f=S,globeTexture:w=D}=a;let{clouds:M,globe:y,glow:x,background:R}=e;n&&(x=C(y.geometry,{backside:!0,coefficient:s,color:r,power:c,size:300*h}),x.name="glow"),w&&(new l).load(w,e=>{y.material=new u({map:e}),y.remove(y.getObjectByName("glow")),y.add(x),b()},()=>{},b),g&&((new l).load(g,e=>{R.material=new d({map:e,side:m}),p()},()=>{},p),y.remove(y.getObjectByName("background")),y.add(R)),f&&((new l).load(f,e=>{M.material=new u({map:e,transparent:!0}),M.material.opacity=i,k()},()=>{},k),y.remove(y.getObjectByName("clouds")),y.add(M))}(this.earth,{callbacks:this.callbacks,options:this.options,textures:this.textures}),function(e,t){const{ambientLightColor:o,ambientLightIntensity:a,pointLightColor:n,pointLightIntensity:i,pointLightPositionRadiusScales:r}=t,{ambient:s,point:c}=e,[l,u,d]=r;s.color=new k(o),s.intensity=a,c.color=new k(n),c.intensity=i,c.position.set(300*l,300*u,300*d)}(this.lights,this.options),function(e,t){const{cameraAutoRotateSpeed:o,cameraMaxDistanceRadiusScale:a,cameraMaxPolarAngle:n,cameraMinPolarAngle:i,cameraRotateSpeed:r,cameraZoomSpeed:s,enableCameraAutoRotate:c,enableCameraRotate:l,enableCameraZoom:u}=t;e.autoRotate=c,e.autoRotateSpeed=o,e.dampingFactor=.1,e.enableDamping=!0,e.enablePan=!1,e.enableRotate=l,e.enableZoom=u,e.maxDistance=300*a,e.maxPolarAngle=n,e.minDistance=330,e.minPolarAngle=i,e.rotateSpeed=r,e.zoomSpeed=s}(this.orbitControls,this.options),this.updateFocus.bind(this,this.focus),this.updateMarkers.bind(this,this.markers)}}export default function({animations:a=[],focus:n,height:i="100%",globeBackgroundTexture:r,globeCloudsTexture:s,globeTexture:c,initialCameraDistanceRadiusScale:l,initialCoordinates:u,markers:d,options:m=O,width:h="100%",onClickMarker:p,onTouchMarker:k,onDefocus:b,onGetGlobe:g,onGlobeBackgroundTextureLoaded:f,onGlobeCloudsTextureLoaded:w,onGlobeTextureLoaded:M,onMouseOutMarker:C,onMouseOverMarker:x}){const R=t(null),v=t(null),E=t(null),T=t(null);return o(()=>{const e=new U({canvasElement:R.current,initialCameraDistanceRadiusScale:l||m.cameraDistanceRadiusScale,initialCoordinates:u,textures:{globeBackgroundTexture:r,globeCloudsTexture:s,globeTexture:c},tooltipElement:E.current});return e.animate(),T.current=e,g&&g(e),()=>e.destroy()},[r,s,c,l,m.cameraDistanceRadiusScale,u,g]),o(()=>{const e=T.current;return function(e,t){const o=new y(e=>{if(!e||0===e.length)return;const{height:o,width:a}=e[0].contentRect;t({height:o,width:a})});return o.observe(e),()=>o.unobserve(e)}(v.current,e.resize.bind(e))},[]),o(()=>{T.current.updateCallbacks({onClickMarker:p,onTouchMarker:k,onDefocus:b,onGlobeBackgroundTextureLoaded:f,onGlobeCloudsTextureLoaded:w,onGlobeTextureLoaded:M,onMouseOutMarker:C,onMouseOverMarker:x})},[p,k,b,f,w,M,C,x]),o(()=>{T.current.updateOptions(m)},[m]),o(()=>{T.current.updateMarkers(d)},[d]),o(()=>{T.current.updateFocus(n)},[n]),o(()=>T.current.applyAnimations(a),[a]),e.createElement("div",{ref:v,style:{height:i,width:h}},e.createElement("canvas",{ref:R}),e.createElement("div",{ref:E}))}export{U as Globe,A as defaultBarMarkerOptions,T as defaultCallbacks,L as defaultDotMarkerOptions,F as defaultGlobeBackgroundTexture,S as defaultGlobeCloudsTexture,D as defaultGlobeTexture,G as defaultInitialCoordinates,O as defaultOptions,B as tween};
//# sourceMappingURL=index.modern.js.map
