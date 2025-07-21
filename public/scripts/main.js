var first_time_visit = true;

// default setting vars
var setting_volume_master = 0.2;
var setting_enable_music = false;
var setting_enable_sounds = true;
var setting_enable_particles = true;

// ----------------------------------------------------------
// utility

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(
    decimals,
  );

  return parseFloat(str);
}

function toBool(value) {
	if (typeof value === "boolean") return value;
	if (typeof value != "string") return null;
	if (value.toLowerCase() == "true") return true;
	if (value.toLowerCase() == "false") return false;
	return null;
}

// ----------------------------------------------------------

var snd_dir = "../../sounds/"
var mus_dir = "../../music/"

var bgm_random = [
	mus_dir+'BGM_001.wav',
	mus_dir+'BGM_002.wav',
	mus_dir+'BGM_005.wav',
	mus_dir+'BGM_008.wav',
	mus_dir+'BGM_011.wav',
	mus_dir+'BGM_012.wav',
	mus_dir+'BGM_014.wav',
	mus_dir+'BGM_023.mp3',
	mus_dir+'BGM_033.wav',
	mus_dir+'BGM_034.wav',
];

var bgm;
var bgm_idx = 0;


function PlaySound(snd_name, pitch_random = false) {

	if (!setting_enable_sounds) return;

	var sound = new Howl({
		src: [snd_dir+snd_name]
	});

	sound.rate(1.0);
	if (pitch_random) {
		sound.rate(getRandomFloat(0.8,1.2,2));
	}

	sound.play();
	//console.log("played sound:"+snd_name);
}

function PlayMusic(value, seek = 0) {
	if (value == true) {
		bgm.seek(seek);
		bgm.play();
		bgm.loop(true);
	} else {
		bgm.pause();
	}
}


function RegisterSounds() {
	$(".snd_blip1").on("mouseenter", () => {PlaySound("snd_blip1.wav")});
	$(".snd_mod_hover").on("mouseenter", () => {PlaySound("snd_mod_hover.wav")});
	$(".link").on("mouseenter", () => {PlaySound("snd_cmn_open.wav", true)});

	$('body').click(function(e) {
		// console.log(e.target);
		if ($(e.target).is('body') || $(e.target).is('main')) { 
			PlaySound("snd_colby_droplet.wav", true);
		};
	});

	$(".snd_open").on("click", () => {PlaySound("snd_open.wav")});
	$(".snd_close").on("click", () => {PlaySound("snd_close.wav")});
	console.log("registered sounds");
}

// function SetCursor(state) {
// 	if (state == "grab") {
// 		$('body').css({'cursor': 'url(/cursor/Wii Pointer Grab.cur), grab'});
// 		console.log("cursor grab");
// 	} else {
// 		$('body').css({'cursor': 'url(/cursor/Wii Pointer Open Hand.cur), default'});
// 		console.log("cursor default");
// 	}
// }



function SaveBgmState() {
	console.log("saving music state");
	// if (!setting_enable_music) return;
	
	sessionStorage.setItem("bgm_idx", bgm_idx);
	sessionStorage.setItem("bgm_seek", bgm.seek());
	sessionStorage.setItem("info_music_seen", true);
}


function LoadSettingsToMenu() {
	$("#setting-volume").val(setting_volume_master*100);
	$("#setting-volume-value").text(setting_volume_master*100+"%");
	$('#setting-volume').css({'backgroundSize': (setting_volume_master*100) + "% 100%"});
	
	$("#setting-showparticles").prop('checked', setting_enable_particles);
	$("#setting-enable-music").prop('checked', setting_enable_music);
	$("#setting-enable-sounds").prop('checked', setting_enable_sounds);
}

function OpenSettingsMenu() {
	LoadSettingsToMenu();
	$('#popup-settings').show();
	$('#popup-container').show();
}
function CloseSettingsMenu() {
	$('#popup-settings').hide();
	$('#popup-container').hide();
}

function OpenPopup(name) {
	$('#popup-container').children().hide();
	switch(name) {
		case "settings":
			LoadSettingsToMenu();
			$('#popup-container').show();
			$('#popup-settings').show();
			break;
		case "info":
			$('#popup-container').show();
			$('#popup-info').show();
			break;
	}	
}
function ClosePopup() {
	$('#popup-container').hide();
}

// --------------------------------------------------------------

function SetVolume(volume) {
	setting_volume_master = volume/100;
	Howler.volume(setting_volume_master);
	localStorage.setItem("setting_volume_master", setting_volume_master)
	
	$('#setting-volume-value').text(volume+"%");
	$('#setting-volume').css({'backgroundSize': (volume) + "% 100%"});

	PlaySound("snd_slider_drag.wav");
}

function SetEnableParticles(value) {
	setting_enable_particles = value;
	localStorage.setItem("setting_enable_particles", value);

	if (value) {
		$("#particles-js").show();
	} else {
		$("#particles-js").hide();
	}
	console.log("particles: "+value);
}

function SetEnableMusic(value) {
	setting_enable_music = value;
	localStorage.setItem("setting_enable_music", value);

	PlayMusic(value);
	console.log("music: "+value);
}

function SetEnableSound(value) {
	setting_enable_sounds = value;
	localStorage.setItem("setting_enable_sounds", value);

	console.log("sounds: "+value);
}

// --------------------------------------------------------------
// save bg music position before changing tabs
window.onbeforeunload = SaveBgmState;

window.onload = () => {
	$('#popup-container').click(function(e) {
		// console.log(e.target);
		if ($(e.target).is('#popup-container')) { 
			ClosePopup();
			PlaySound('snd_cmn_close.wav')
		};
	});



	if (sessionStorage.getItem("bgm_idx") == null) {
		bgm_idx = getRandomInt(bgm_random.length-1)
	} else {
		bgm_idx = sessionStorage.getItem("bgm_idx");
	}

	bgm = new Howl({
	src: [bgm_random[bgm_idx]]
	});

	// if viewing website for the first time:
	if (localStorage.getItem("first_time_visit") == null || localStorage.getItem("first_time_visit") == "true") 
	{
		localStorage.setItem("first_time_visit", false);
		localStorage.setItem("setting_volume_master", setting_volume_master);
		localStorage.setItem("setting_enable_music", setting_enable_music);
		localStorage.setItem("setting_enable_sounds", setting_enable_sounds);
		localStorage.setItem("setting_enable_particles", setting_enable_particles);
		
		$("#info-first-time").show();
		OpenSettingsMenu();
	} else {
		setting_volume_master 		= localStorage.getItem("setting_volume_master");
		setting_enable_music 		= toBool(localStorage.getItem("setting_enable_music"));
		setting_enable_sounds 		= toBool(localStorage.getItem("setting_enable_sounds"));
		setting_enable_particles 	= toBool(localStorage.getItem("setting_enable_particles"));


		Howler.autoUnlock = true;

		if (setting_enable_music) {
			if (sessionStorage.getItem("bgm_seek") != null) {
				PlayMusic(true, sessionStorage.getItem("bgm_seek"));
			} else {
				PlayMusic(true);
			}
			
			
			if (toBool(sessionStorage.getItem("info_music_seen")) != true) {$("#info-enabling-music").show()};
		}
	}
	Howler.volume(setting_volume_master);
	SetEnableParticles(setting_enable_particles);
	RegisterSounds();

	console.log("main.ts loaded.");
};


$(document).ready(function () {
	// window.addEventListener("onclick", SetCursor("grab"));
	// window.addEventListener("onclick", SetCursor("default"));


  var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
  console.log('ismobile = ${isMobile}');
  
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