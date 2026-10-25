/* main: start-up order */
applySet('init');
applyTheme(SET.theme==='light'||SET.theme==='dark'?SET.theme:'auto');
const heroOK=heroInit();
renderProjects();expInit();graph=Graph3D($('#graph'),$('#gpanel'));flapsInit();setupJD();labInit();wireGlobal();
if(!RM)requestAnimationFrame(loop);
if(root.classList.contains('preboot')&&heroOK&&SET.intro!=='off')boot();else{endBootQuick();if(RM)fontsReady.then(()=>setTimeout(staticAll,60));}
