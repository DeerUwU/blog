var first_time_visit = true;

// default setting vars
var setting_volume_master = 0.2;
var setting_enable_music = true;
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



/**
   * Flexible sound effect system
   * @param   volume   volume
   * @param   rate_min minimum speed (and pitch)
   * @param   rate_max maximum speed (and pitch)
   * @return  void
   */
function PlaySound(snd_name, {
	volume = 1.0,
	rate_min = 1.0, // pitch (and speed)
	rate_max = 1.0 // pitch (and speed)
} = {}) {
	// TODO: implement options to pick sounds from array or Object (for chance weights)

	if (!setting_enable_sounds) return;

	var sound = new Howl({
		src: [snd_dir+snd_name]
	});

	sound.rate(getRandomFloat(rate_min, rate_max, 2));
	sound.volume(volume);
	sound.play();
	//console.log("played sound:"+snd_name);
}

function PlayMusic(value, fade = false, seek = 0) {
	if (value == true) {
		bgm.seek(seek);
		bgm.play();
		bgm.loop(true);
		if (fade || seek == 0) bgm.fade(0, 1, 1000);
	} else {
		// bgm.fade(1, 0, 1000);
		bgm.pause();
	}
}


function RegisterSounds() {
	$(".snd_blip1").on("mouseenter", () => {PlaySound("snd_blip1.wav")});
	$(".snd_mod_hover").on("mouseenter", () => {PlaySound("snd_mod_hover.wav")});
	$(".link").on("mouseenter", () => {PlaySound("snd_cmn_open.wav", {rate_min: 0.8, rate_max: 1.2})});
	$(".site-button").on("mouseenter", () => {PlaySound("snd_cmn_open.wav", {rate_min: 0.8, rate_max: 1.2})});

	$('body').click(function(e) {
		// console.log(e.target);
		if ($(e.target).is('body') || $(e.target).is('main')) { 
			PlaySound("snd_colby_droplet.wav", {rate_min: 0.7, rate_max: 1.3});
		};
	});

	$(".snd_click_open").on("click", () => {PlaySound("snd_open.wav", {volume: 0.5})});
	$(".snd_click_close").on("click", () => {PlaySound("snd_close.wav", {volume: 0.5})});
	$(".snd_click_blip1").on("click", () => {PlaySound("snd_blip1.wav")});
	console.log("registered sounds");
}


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

	PlayMusic(value, true);
	console.log("music: "+value);
}

function SetEnableSound(value) {
	setting_enable_sounds = value;
	localStorage.setItem("setting_enable_sounds", value);

	console.log("sounds: "+value);
}

function SettingChangeBgm() {
	if (toBool(localStorage.getItem("setting_enable_music")) == false) return;

	bgm_idx = parseInt(bgm_idx);
	bgm_idx = (bgm_idx+1) % (bgm_random.length);


	bgm.unload();

	bgm = new Howl({
	src: [bgm_random[bgm_idx]]
	});

	bgm.play();
	bgm.loop(true);
	bgm.fade(0, 1, 1000);
	console.log("new track: "+bgm_idx)
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
		OpenPopup("settings");
	} else {
		setting_volume_master 		= localStorage.getItem("setting_volume_master");
		setting_enable_music 		= toBool(localStorage.getItem("setting_enable_music"));
		setting_enable_sounds 		= toBool(localStorage.getItem("setting_enable_sounds"));
		setting_enable_particles 	= toBool(localStorage.getItem("setting_enable_particles"));


		Howler.autoUnlock = true;

		if (setting_enable_music) {
			if (sessionStorage.getItem("bgm_seek") != null) {
				PlayMusic(true, false, sessionStorage.getItem("bgm_seek"));
			} else {
				PlayMusic(true);
			}
			
			
			if (toBool(sessionStorage.getItem("info_music_seen")) != true) {$("#info-enabling-music").show()};
		}
	}

	Howler.volume(setting_volume_master);
	SetEnableParticles(setting_enable_particles);
	RegisterSounds();

	if (setting_enable_music && navigator.getAutoplayPolicy("mediaelement") != "allowed") {$("#info-enabling-music").show()};

	console.log("main.ts loaded.");
};


$(document).ready(function () {
	// window.addEventListener("onclick", SetCursor("grab"));
	// window.addEventListener("onclick", SetCursor("default"));


  var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
  console.log("ismobile = "+isMobile);
  
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