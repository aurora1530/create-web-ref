javascript:(()=>{"use strict";"use strict";var A=a=>typeof a=='string',d=()=>{const _a=[...document.querySelectorAll('script[type="application/ld+json"]')].map(_A=>_A.textContent),_B={};for(const aA of _a){if(!aA)continue;const aB=JSON.parse(aA);if(!aB)continue;if(_B.author==void 0){const aC=c(aB,'author');aC&&(_B.author=A(aC)?aC:typeof aC=='object'&&'name' in aC?aC.name:void 0)}if(_B.organization==void 0){const aD=c(aB,'organization')??c(aB,'Organization')??c(aB,'ORGANIZATION')??c(aB,'publisher')??c(aB,'Publisher')??c(aB,'PUBLISHER');aD&&(_B.organization=A(aD)?aD:typeof aD=='object'&&'name' in aD?aD.name:void 0)}}return _B},e=()=>(document.title||document.getElementsByTagName('title')[0].textContent||b.hostname),f=()=>{const aE=(document.querySelector('meta[name="author" i]')??document.querySelector('meta[property="author" i]')??document.querySelector('meta[name="article:author" i]'))?.getAttribute('content');return aE??b.hostname},g=()=>(document.querySelector('meta[property="og:site_name" i]')?.getAttribute('content')??b.hostname),h=()=>{const aF=(document.querySelector('meta[name="last-modified" i]')??document.querySelector('meta[property="article:modified_time" i]'))?.getAttribute('content');return new Date(aF??document.lastModified).toLocaleDateString()},i=()=>new Date().toLocaleDateString(),j=()=>((document.querySelector('meta[name="description" i]')??document.querySelector('meta[property="og:description" i]'))?.getAttribute('content')??void 0),_=()=>({author:f(),siteName:g(),title:e(),lastModified:h(),lastVisited:i(),url:b.href,description:j()});var b=new URL(document.URL);function c(B,C){let _c;let D=Infinity;function E(o,_b){if(_b>=D)return;if(typeof o=='object'&&o!==null){if(C in o&&_b<D){_c=o[C];D=_b;return}for(const k in o)E(o[k],_b+1)}}E(B,0);return _c}(()=>{var aG=d(),aH=_();aH.address=aG.address;aH.organization=aG.organization;aH.author=aG.author??aH.author;navigator.clipboard.writeText(JSON.stringify(aH,null,2)).then(()=>alert('Reference copied to clipboard'),aI=>{console.error('Error copying to clipboard',aI);alert('Error copying to clipboard')})})();})()