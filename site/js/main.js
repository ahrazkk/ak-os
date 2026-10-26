/* main: start-up order */
applySet('init');
applyTheme(SET.theme);
const heroOK=heroInit();
renderProjects();expInit();graph=Graph3D($('#graph'),$('#gpanel'));flapsInit();setupJD();labInit();wireGlobal();
if(!RM)requestAnimationFrame(loop);
if(root.classList.contains('preboot')&&heroOK&&SET.intro!=='off')boot();else{endBootQuick();if(RM)fontsReady.then(()=>setTimeout(staticAll,60));}
const deep=projectFromHash();if(deep)openProject(deep);
