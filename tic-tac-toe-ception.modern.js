var t=0;function e(e){return"__private_"+t+++"_"+e}function n(t,e){if(!Object.prototype.hasOwnProperty.call(t,e))throw new TypeError("attempted to use private field on non-instance");return t}function i(t,e,n){const i=3*(e/3|0),r=[];for(let e=0;e<3;e++){if(!t[i+e].isOwnedBy(n))return!1;r.push(i+e)}return r}function r(t,e,n){const i=e%3,r=[];for(let e=0;e<3;e++){if(!t[i+3*e].isOwnedBy(n))return!1;r.push(i+3*e)}return r}function o(t,e,n){return!(e%1)&&(s(...arguments)||a(...arguments))}function s(t,e,n){if(e%4==2)return!1;const i=[];for(let e=0;e<3;e++){if(!t[4*e].isOwnedBy(n))return!1;i.push(4*e)}return i}function a(t,e,n){if(e%8==0)return!1;const i=[];for(let e=1;e<4;e++){if(!t[2*e].isOwnedBy(n))return!1;i.push(2*e)}return i}function l(t,e,n){return r(...arguments)||i(...arguments)||o(...arguments)}function c(t,e){this.x=t||0,this.y=e||0}c.prototype={add(...t){for(const e of t)this.x+=e.x,this.y+=e.y},multiply(t){return"number"!=typeof t?(this.x*=t.x,this.y*=t.y):(this.x*=t,this.y*=t),this},divide(t){return"number"!=typeof t?(0!=t.x&&(this.x/=t.x),0!=t.y&&(this.y/=t.y)):0!=t&&(this.x/=t,this.y/=t),this},equals(t){return this.x==t.x&&this.y==t.y},dot(t){return this.x*t.x+this.y*t.y},cross(t){return this.x*t.y-this.y*t.x},get length(){return Math.sqrt(this.dot(this))},normalize(){return this.divide(this.length)},clone(){return new c(this.x,this.y)}},c.NUL=Object.freeze({x:0,y:0,clone:()=>new c});const h=["#b3312c","#eb8844","#decf2a","#41cd34","#3b511a","#6689d3","#287697","#253192","#7b2fbe","#c354cd","#d88198","#f0f0f0","#ababab","#434343","#1e1b1b","#51301a"],m=new c(0,-.981);async function d(t,e){return new Promise(n=>{const i=function*(t){const e=t.initialAcceleration.clone(),n=t.initialVelocity.clone(),i=t.initialPosition.clone();yield i;for(let r=0;r<t.lifeExpectancy;r++){const o=r<t.fuelAutonomy?n.clone().normalize().multiply(t.motorThrust*(1-Math.exp(-r))):c.NUL,s=n.clone().multiply(-t.frictionCoefficient);e.add(m,o,s),n.add(e),i.add(n),yield i}return{position:i,velocity:n,acceleration:e}}(e);let r;requestAnimationFrame(function o(s){for(let o=r||s;o<s;o++){const{value:r,done:o}=i.next();if(o)return n(r);t.fillStyle=e.color,t.beginPath(),t.rect(r.x>>20,r.y>>20,e.thickness,1),t.fill()}requestAnimationFrame(o),r=s})})}function u(t=5,e=200,n=1){const i=1e3*n,r=1e3*n,o=document.createElement("canvas");o.height=r,o.width=i;const s=o.getContext("2d");return s.setTransform(n,0,0,-n,i/2,r),requestAnimationFrame(function(t,e,n=null){const{width:i,height:r}=t;let o,s;return null==n&&(n=t.getContext("2d")),e.then(()=>{t.addEventListener("transitionend",()=>{cancelAnimationFrame(s),t.remove()}),t.style.transformOrigin="top",t.style.transition="all 3s ease-in",t.style.transitionProperty="opacity,transform",t.style.opacity=0,t.style.transform="scaleY(1.5)"}),function t(e){const a=n.getImageData(0,0,i,r),l=(e-o)/16;for(let t=3;t<a.data.length;t+=4){const e=a.data[t];e>16&&(a.data[t]=e-(e>>3)*l)}n.putImageData(a,0,0),s=requestAnimationFrame(t),o=e}}(o,Promise.all(Array.from({length:t},(t,n)=>{return(i=50*Math.random()+n*e,new Promise(t=>setTimeout(t,i))).then(()=>function(t,e=c.NUL,n){const i={initialPosition:e,initialVelocity:c.NUL,initialAcceleration:new c((Math.random()+1.5)%2-1,-7*m.y),lifeExpectancy:900+300*Math.random(),fuelAutonomy:600,motorThrust:-5*m.y,frictionCoefficient:15e-6*Math.random()+5e-6,thickness:7,color:n||h[Math.random()*h.length|0]};return d(t,i).then(e=>Promise.all(Array.from({length:10*Math.random()},()=>d(t,function({position:t,velocity:e},n){return{initialPosition:t,initialVelocity:new c(0,e.y),initialAcceleration:new c(2e3*(Math.random()-.5),1e3*-m.y),lifeExpectancy:800,fuelAutonomy:0,motorThrust:0,frictionCoefficient:15e-6*Math.random()+5e-6,thickness:3,color:n}}(e,i.color))))).catch(console.error)}(s));var i})),s)),o}const y=new WeakMap;function f(t){y.get(t.target).makeMove()}class p{constructor(t,e){Object.defineProperty(this,b,{writable:!0,value:void 0}),Object.defineProperty(this,g,{writable:!0,value:void 0}),Object.defineProperty(this,v,{writable:!0,value:void 0}),Object.defineProperty(this,w,{writable:!0,value:this.createHTMLElement()}),n(this,b)[b]=t,n(this,v)[v]=e}createHTMLElement(){const t=document.createElement("button");return t.addEventListener("click",f),t.className="cell",t.setAttribute("aria-label","Empty cell"),y.set(t,this),t}makeMove(){n(this,v)[v].makeMove(this)}get htmlElement(){return n(this,w)[w]}isOwnedBy(t){return n(this,g)[g]===t}setFoot(t){n(this,g)[g]=t,this.htmlElement.removeAttribute("aria-label"),this.htmlElement.dataset.player=t.symbol}setWinningFlag(){this.htmlElement.classList.add("win")}isEmpty(){return!n(this,g)[g]}get id(){return n(this,b)[b]}enable(){this.htmlElement.disabled=!1}disable(){this.htmlElement.disabled=!0}}var b=e("id"),g=e("owner"),v=e("game"),w=e("htmlElement");class E extends p{constructor(t,e){super(t),Object.defineProperty(this,x,{writable:!0,value:void 0}),n(this,x)[x]=Array.from({length:9},(t,n)=>new p(n,e)),this.htmlElement.append(...n(this,x)[x].map(t=>t.htmlElement))}createHTMLElement(){const t=document.createElement("div");return t.className="tic-tac-toe",t}has(t){return n(this,x)[x].includes(t)}isLegal(t){return this.has(t)&&(t.isEmpty()||n(this,x)[x].every(t=>!t.isEmpty()))}makeMove(t,e){if(!this.isLegal(e))throw new Error("Illegal move");e.isEmpty()&&(e.setFoot(t),this.checkForWinner(t,e))}checkForWinner(t,e){if(!this.isEmpty())return;const i=l(n(this,x)[x],e.id,t);if(i){const e=this.htmlElement.getBoundingClientRect(),r=u(9,200,e.height/1e3);for(const t of i)n(this,x)[x][t].setWinningFlag();this.setFoot(t),r.style.top=e.top-e.height/6+"px",r.style.left=e.left+"px",document.body.append(r)}}enable(){const t=n(this,x)[x].filter(t=>t.isEmpty());(t.length?t:n(this,x)[x]).forEach(t=>t.enable())}disable(){n(this,x)[x].forEach(t=>t.disable())}}var x=e("cells");class M{constructor(t){Object.defineProperty(this,P,{writable:!0,value:void 0}),n(this,P)[P]=t}get symbol(){return n(this,P)[P]}}var P=e("symbol");class k{constructor(){Object.defineProperty(this,O,{writable:!0,value:Array.from({length:9},(t,e)=>new E(e,this))}),Object.defineProperty(this,A,{writable:!0,value:void 0}),Object.defineProperty(this,F,{writable:!0,value:[new M("❌"),new M("⭕")]}),Object.defineProperty(this,L,{writable:!0,value:n(this,F)[F][0]})}makeMove(t){n(this,A)[A]?n(this,A)[A].disable():(n(this,A)[A]=n(this,O)[O].find(e=>e.has(t)),n(this,O)[O].forEach(t=>t.disable())),n(this,A)[A].makeMove(n(this,L)[L],t),this.checkForWinner()||(n(this,L)[L]=n(this,F)[F][(n(this,F)[F].indexOf(n(this,L)[L])+1)%n(this,F)[F].length],n(this,A)[A]=n(this,O)[O][t.id],n(this,A)[A].enable())}checkForWinner(){const t=l(n(this,O)[O],n(this,A)[A].id,n(this,L)[L]);if(t){for(const e of t){const t=n(this,O)[O][e],i=t.htmlElement.getBoundingClientRect(),r=u(9,200,i.height/1e3);r.style.top=i.top-i.height/6+"px",r.style.left=i.left+"px",document.body.append(r),t.setWinningFlag()}return k.showDialog(n(this,L)[L]).append(u(20,150)),!1}}get htmlElement(){const t=document.createDocumentFragment();return t.append(...n(this,O)[O].map(t=>t.htmlElement)),t}static startNewGame(){const t=new k,e=document.querySelector("main");for(;e.firstChild;)e.removeChild(e.firstChild);e.append(t.htmlElement)}static showDialog(t){if(this.dialogElement)this.dialogElement.winnerSymbol=t.symbol;else{const e=document.createElement("dialog"),n=document.createElement("h2");e.winnerSymbol=document.createTextNode(t.symbol),n.append(e.winnerSymbol," wins!");const i=document.createElement("form");i.method="dialog";const r=document.createElement("input");r.type="submit",r.value="New Game",i.append(r),i.addEventListener("submit",k.startNewGame),e.append(n,i),document.body.append(e),this.dialogElement=e}return this.dialogElement.showModal(),this.dialogElement}}var O=e("grids"),A=e("currentGrid"),F=e("players"),L=e("currentPlayer");k.startNewGame(),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js",{scope:"./"}).then(()=>{const t=document.createElement("div"),e=()=>t.remove();t.style.position="fixed",t.style.bottom="1rem",t.style.right="50vw",t.style.transform="translateX(50%)",t.style.backgroundColor="#888A",t.style.color="#fff",t.style.padding="1rem",t.style.borderRadius="3px",t.style.cursor="pointer",t.textContent="Ready to work offline",t.addEventListener("click",e),setTimeout(e,2999),document.body.append(t)}).catch(t=>{console.warn(t)});
//# sourceMappingURL=tic-tac-toe-ception.modern.js.map
