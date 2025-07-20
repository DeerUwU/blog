$(document).ready(function () {

  var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
  console.log(`ismobile = ${isMobile}`);
  
  var enable_particles = localStorage.getItem("setting_enable_particles");
  
  //TODO: create a function to unload particles.js
  //if (enable_particles == "false") return; // stupid value is stored as string not bool.

  if (isMobile) {
    particlesJS.load("particles-js", "/particles/particles_mobile.json", function(){
      console.log("particles_mobile.json loaded")
    });
  } else {
    particlesJS.load("particles-js", "/particles/particles.json", function(){
      console.log("particles.json loaded")
    });
  }

});