$(document).ready(function () {

  var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
  console.log(`ismobile = ${isMobile}`);


  if (isMobile) {
    particlesJS.load("particles-js", "../../particles/particles_mobile.json", function(){
      console.log("particles_mobile.json loaded")
    });
  } else {
    particlesJS.load("particles-js", "../../particles/particles.json", function(){
      console.log("particles.json loaded")
    });
  }

});