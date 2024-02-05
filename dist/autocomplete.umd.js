(function(i,a){typeof exports=="object"&&typeof module<"u"?module.exports=a(require("vue")):typeof define=="function"&&define.amd?define(["vue"],a):(i=typeof globalThis<"u"?globalThis:i||self,i.autocomplete=a(i.Vue))})(this,function(i){"use strict";var v=Object.defineProperty;var T=(i,a,d)=>a in i?v(i,a,{enumerable:!0,configurable:!0,writable:!0,value:d}):i[a]=d;var r=(i,a,d)=>(T(i,typeof a!="symbol"?a+"":a,d),d);const a=(t,e)=>t.matches?t.matches(e):t.msMatchesSelector?t.msMatchesSelector(e):t.webkitMatchesSelector?t.webkitMatchesSelector(e):null,d=(t,e)=>{let s=t;for(;s&&s.nodeType===1;){if(a(s,e))return s;s=s.parentNode}return null},m=(t,e)=>t.closest?t.closest(e):d(t,e),g=t=>!!(t&&typeof t.then=="function");class w{constructor({search:e,autoSelect:s=!1,setValue:n=()=>{},setAttribute:l=()=>{},onUpdate:o=()=>{},onSubmit:u=()=>{},onShow:h=()=>{},autocorrect:b=!1,onHide:A=()=>{},onLoading:B=()=>{},onLoaded:D=()=>{},submitOnEnter:E=!1}={}){r(this,"value","");r(this,"searchCounter",0);r(this,"results",[]);r(this,"selectedIndex",-1);r(this,"selectedResult",null);r(this,"destroy",()=>{this.search=null,this.setValue=null,this.setAttribute=null,this.onUpdate=null,this.onSubmit=null,this.autocorrect=null,this.onShow=null,this.onHide=null,this.onLoading=null,this.onLoaded=null});r(this,"handleInput",e=>{const{value:s}=e.target;this.updateResults(s),this.value=s});r(this,"handleKeyDown",e=>{const{key:s}=e;switch(s){case"Up":case"Down":case"ArrowUp":case"ArrowDown":{const n=s==="ArrowUp"||s==="Up"?this.selectedIndex-1:this.selectedIndex+1;e.preventDefault(),this.handleArrows(n);break}case"Tab":{this.selectResult();break}case"Enter":{const n=e.target.getAttribute("aria-activedescendant").length>0;this.selectedResult=this.results[this.selectedIndex]||this.selectedResult,this.selectResult(),this.submitOnEnter?this.selectedResult&&this.onSubmit(this.selectedResult):n?e.preventDefault():(this.selectedResult&&this.onSubmit(this.selectedResult),this.selectedResult=null);break}case"Esc":case"Escape":{this.hideResults(),this.setValue();break}default:return}});r(this,"handleFocus",e=>{const{value:s}=e.target;this.updateResults(s),this.value=s});r(this,"handleBlur",()=>{this.hideResults()});r(this,"handleResultMouseDown",e=>{e.preventDefault()});r(this,"handleResultClick",e=>{const{target:s}=e,n=m(s,"[data-result-index]");if(n){this.selectedIndex=parseInt(n.dataset.resultIndex,10);const l=this.results[this.selectedIndex];this.selectResult(),this.onSubmit(l)}});r(this,"handleArrows",e=>{const s=this.results.length;this.selectedIndex=(e%s+s)%s,this.onUpdate(this.results,this.selectedIndex)});r(this,"selectResult",()=>{const e=this.results[this.selectedIndex];e&&this.setValue(e),this.hideResults()});r(this,"updateResults",e=>{const s=++this.searchCounter;this.onLoading(),this.search(e).then(n=>{if(s===this.searchCounter){if(this.results=n,this.onLoaded(),this.results.length===0){this.hideResults();return}this.selectedIndex=this.autoSelect?0:-1,this.onUpdate(this.results,this.selectedIndex),this.showResults()}})});r(this,"showResults",()=>{this.setAttribute("aria-expanded",!0),this.onShow()});r(this,"hideResults",()=>{this.selectedIndex=-1,this.results=[],this.setAttribute("aria-expanded",!1),this.setAttribute("aria-activedescendant",""),this.onUpdate(this.results,this.selectedIndex),this.onHide()});r(this,"checkSelectedResultVisible",e=>{const s=e.querySelector(`[data-result-index="${this.selectedIndex}"]`);if(!s)return;const n=e.getBoundingClientRect(),l=s.getBoundingClientRect();l.top<n.top?e.scrollTop-=n.top-l.top:l.bottom>n.bottom&&(e.scrollTop+=l.bottom-n.bottom)});this.search=g(e)?e:U=>Promise.resolve(e(U)),this.autoSelect=s,this.setValue=n,this.setAttribute=l,this.onUpdate=o,this.onSubmit=u,this.autocorrect=b,this.onShow=h,this.onHide=A,this.onLoading=B,this.onLoaded=D,this.submitOnEnter=E}}let L=0;const R=(t="")=>`${t}${++L}`,x=(t,e)=>{const s=t.getBoundingClientRect(),n=e.getBoundingClientRect();return s.bottom+n.height>window.innerHeight&&window.innerHeight-s.bottom<s.top&&window.pageYOffset+s.top-n.height>0?"above":"below"},I=(t,e,s)=>{let n;return function(){const o=this,u=arguments,h=function(){n=null,s||t.apply(o,u)},b=s&&!n;clearTimeout(n),n=setTimeout(h,e),b&&t.apply(o,u)}},y=t=>{if(t!=null&&t.length){const e=t.startsWith("#");return{attribute:e?"aria-labelledby":"aria-label",content:e?t.substring(1):t}}},P=(t,e)=>{const s=t.__vccOpts||t;for(const[n,l]of e)s[n]=l;return s},k={name:"AutoComplete",inheritAttrs:!1,props:{search:{type:Function,required:!0},baseClass:{type:String,default:"autocomplete"},autoSelect:{type:Boolean,default:!1},getResultValue:{type:Function,default:t=>t},defaultValue:{type:String,default:""},debounceTime:{type:Number,default:0},resultListLabel:{type:String,default:void 0},submitOnEnter:{type:Boolean,default:!1}},emits:["update","submit"],data(){const t=new w({search:this.search,autoSelect:this.autoSelect,setValue:this.setValue,onUpdate:this.handleUpdate,onSubmit:this.handleSubmit,onShow:this.handleShow,onHide:this.handleHide,onLoading:this.handleLoading,onLoaded:this.handleLoaded,submitOnEnter:this.submitOnEnter});return this.debounceTime>0&&(t.handleInput=I(t.handleInput,this.debounceTime)),{core:t,value:this.defaultValue,resultListId:R(`${this.baseClass}-result-list-`),results:[],selectedIndex:-1,expanded:!1,loading:!1,position:"below",resetPosition:!0}},computed:{rootProps(){return{class:this.baseClass,style:{position:"relative"},"data-expanded":this.expanded,"data-loading":this.loading?!0:null,"data-position":this.position}},inputProps(){return{class:`${this.baseClass}-input`,value:this.value,role:"combobox",autocomplete:"off",autocapitalize:"off",autocorrect:"off",spellcheck:!0,"aria-autocomplete":"list","aria-haspopup":"listbox","aria-owns":this.resultListId,"aria-expanded":this.expanded?!0:null,"aria-activedescendant":this.selectedIndex>-1?this.resultProps[this.selectedIndex].id:"",...this.$attrs}},inputListeners(){return{input:this.handleInput,keydown:this.core.handleKeyDown,focus:this.core.handleFocus,blur:this.core.handleBlur}},resultListProps(){const t=this.position==="below"?"top":"bottom",e=y(this.resultListLabel);return{id:this.resultListId,class:`${this.baseClass}-result-list`,role:"listbox",[e==null?void 0:e.attribute]:e==null?void 0:e.content,style:{position:"absolute",zIndex:1,width:"100%",visibility:this.expanded?"visible":"hidden",pointerEvents:this.expanded?"auto":"none",[t]:"100%"}}},resultListListeners(){return{mousedown:this.core.handleResultMouseDown,click:this.core.handleResultClick}},resultProps(){return this.results.map((t,e)=>({id:`${this.baseClass}-result-${e}`,class:`${this.baseClass}-result`,"data-result-index":e,role:"option",...this.selectedIndex===e?{"aria-selected":"true"}:{}}))}},mounted(){document.body.addEventListener("click",this.handleDocumentClick)},beforeUnmount(){document.body.removeEventListener("click",this.handleDocumentClick)},updated(){!this.$refs.input||!this.$refs.resultList||(this.resetPosition&&this.results.length>0&&(this.resetPosition=!1,this.position=x(this.$refs.input,this.$refs.resultList)),this.core.checkSelectedResultVisible(this.$refs.resultList))},methods:{setValue(t){this.value=t?this.getResultValue(t):""},handleUpdate(t,e){this.results=t,this.selectedIndex=e,this.$emit("update",t,e)},handleShow(){this.expanded=!0},handleHide(){this.expanded=!1,this.resetPosition=!0},handleLoading(){this.loading=!0},handleLoaded(){this.loading=!1},handleInput(t){this.value=t.target.value,this.core.handleInput(t)},handleSubmit(t){this.$emit("submit",t)},handleDocumentClick(t){this.$refs.root.contains(t.target)||this.core.hideResults()}}},S={ref:"root"};function C(t,e,s,n,l,o){return i.openBlock(),i.createElementBlock("div",S,[i.renderSlot(t.$slots,"default",{rootProps:o.rootProps,inputProps:o.inputProps,inputListeners:o.inputListeners,resultListProps:o.resultListProps,resultListListeners:o.resultListListeners,results:l.results,resultProps:o.resultProps},()=>[i.createElementVNode("div",i.normalizeProps(i.guardReactiveProps(o.rootProps)),[i.createElementVNode("input",i.mergeProps({ref:"input"},o.inputProps,{onInput:e[0]||(e[0]=(...u)=>o.handleInput&&o.handleInput(...u)),onKeydown:e[1]||(e[1]=(...u)=>l.core.handleKeyDown&&l.core.handleKeyDown(...u)),onFocus:e[2]||(e[2]=(...u)=>l.core.handleFocus&&l.core.handleFocus(...u)),onBlur:e[3]||(e[3]=(...u)=>l.core.handleBlur&&l.core.handleBlur(...u))}),null,16),i.createElementVNode("ul",i.mergeProps({ref:"resultList"},o.resultListProps,i.toHandlers(o.resultListListeners,!0)),[(i.openBlock(!0),i.createElementBlock(i.Fragment,null,i.renderList(l.results,(u,h)=>i.renderSlot(t.$slots,"result",{result:u,props:o.resultProps[h]},()=>[(i.openBlock(),i.createElementBlock("li",i.mergeProps({key:o.resultProps[h].id},o.resultProps[h]),i.toDisplayString(s.getResultValue(u)),17))])),256))],16)],16)])],512)}const f=P(k,[["render",C]]);function c(t){c.installed||(c.installed=!0,t.component("AutoComplete",f))}const V={install:c};let p;return typeof window<"u"?p=window.Vue:typeof global<"u"&&(p=global.Vue),p&&p.use(V),f.install=c,f});
