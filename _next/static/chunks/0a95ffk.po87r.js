(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72934,e=>{"use strict";var a=e.i(43476),t=e.i(71645);let i=(0,e.i(75254).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);var o=e.i(19455);e.s(["CopyToTeamsButton",0,function({title:e,bullets:r}){let s=(0,t.useMemo)(()=>{let a=r.map(e=>`- ${e}`).join("\n");return`# ${e}

${a}

Key links:
- [Add offer link]
- [Add dashboard link]`},[e,r]);return(0,a.jsxs)(o.Button,{variant:"secondary",size:"sm",onClick:async()=>{await navigator.clipboard.writeText(s)},"aria-label":"Copy markdown summary for Teams",children:[(0,a.jsx)(i,{className:"mr-2 h-4 w-4"}),"Copy to Teams"]})}],72934)}]);