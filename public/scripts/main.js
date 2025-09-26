var first_time_visit = true;
var is_mobile = null;

// default setting vars
var setting_volume_master = 0.2;
var setting_enable_music = true;
var setting_enable_sounds = true;
var setting_enable_particles = true;
var setting_enable_monospace = true;

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

/**
   * Remap one value range to another
   * @param   value   value to remap
   * @param   input_start minimum value
   * @param   input_end maximum value
   * @param   output_start new minimum value
   * @param   output_end new maximum value
   */
function RemapRange(value, input_start, input_end, output_start, output_end) {
	return output_start + ((output_end - output_start) / (input_end - input_start)) * (value - input_start);
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
	$(".snd_blip2").on("mouseenter", () => {PlaySound("snd_blip2.wav")});
	$(".snd_mod_hover").on("mouseenter", () => {PlaySound("snd_mod_hover.wav")});
	$(".link").on("mouseenter", () => {PlaySound("snd_cmn_open.wav", {rate_min: 0.8, rate_max: 1.2})});
	$(".site-button").on("mouseenter", () => {PlaySound("snd_cmn_open.wav", {rate_min: 0.8, rate_max: 1.2})});
	$(".snd_slider_drag").on("mouseenter", () => {PlaySound("snd_slider_drag.wav", {rate_min: 0.99, rate_max: 1.01})});

	$('body').on('click', function(e) {
		// console.log(e.target);
		if ($(e.target).is('body') || $(e.target).is('main')) { 
			PlaySound("snd_colby_droplet.wav", {rate_min: 0.7, rate_max: 1.3});
		};
	});

	$('#popup-container').on('click', function(e) {
		// console.log(e.target);
		if ($(e.target).is('#popup-container')) { 
			ClosePopup();
			PlaySound('snd_cmn_close.wav')
		};
	});

	$(".snd_click_open").on("click", () => {PlaySound("snd_open.wav", {volume: 0.5})});
	$(".snd_click_close").on("click", () => {PlaySound("snd_close.wav", {volume: 0.5})});
	$(".snd_effect_equip").on("click", () => {PlaySound("snd_effect_equip.wav")});
	$(".snd_click_blip1").on("click", () => {PlaySound("snd_blip1.wav")});
	$(".snd_click_blip2").on("click", () => {PlaySound("snd_blip2.wav")});
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
	$("#setting-volume-value").text(Math.round(setting_volume_master*100)+"%");
	$('#setting-volume').css({'backgroundSize': (setting_volume_master*100) + "% 100%"});
	
	$("#setting-showparticles").prop('checked', setting_enable_particles);
	$("#setting-enable-music").prop('checked', setting_enable_music);
	$("#setting-enable-sounds").prop('checked', setting_enable_sounds);
	$("#setting-enable-monospace").prop('checked', setting_enable_monospace);
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


function UpdateSliderFill(slider) {
	console.log('test');
	$(slider).css({'backgroundSize': (RemapRange(slider.value, slider.min, slider.max, 0, 100)) + "% 100%"});
}


// --------------------------------------------------------------

function RegisterSpoilers() {
	$('.spoiler').on('click', function(e) {
		console.log(e.target);
		if ($(e.target).hasClass('reveal')) { 
			$(e.target).removeClass('reveal');
		} else {
			$(e.target).addClass('reveal');
		};
	});
}

function ParseCustomEmotes() {
	// todo
	// should feature regex based search for strings starting and ending with :
	// and also manually parsing specific elements as emotes if i want to do it manually, for optimization reasons
}

// --------------------------------------------------------------

function SetVolume(volume) {
	setting_volume_master = volume/100;
	Howler.volume(setting_volume_master);
	localStorage.setItem("setting_volume_master", setting_volume_master)
	
	$('#setting-volume-value').text(Math.round(volume)+"%");
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

function SettingSetMonospace(value) {
	if (value == null) value == true;
	setting_enable_monospace = value;
	
	localStorage.setItem("setting_enable_monospace", value);

	if (value) {
		$('body').css('font-family', 'var(--font-DM-Mono)');
		$('p').css('letter-spacing', '-0.02rem');
	} else {
		$('body').css('font-family', 'var(--font-DM-Sans)');
		$('p').css('letter-spacing', '0rem');
	}
	console.log("monospace font: "+value);
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


function PlayCheckboxSound(value) {
	if (value) {
		PlaySound('snd_blip1.wav');
	} else {
		PlaySound('snd_blip2.wav');
	}
}

// --------------------------------------------------------------
// save bg music position before changing tabs
window.onbeforeunload = SaveBgmState;

function init() {
	var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
  	console.log("ismobile = "+isMobile);


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
		localStorage.setItem("setting_enable_monospace", setting_enable_monospace);
		
		$("#info-first-time").show();
		OpenPopup("settings");
	} else {
		setting_volume_master 		= localStorage.getItem("setting_volume_master");
		setting_enable_music 		= toBool(localStorage.getItem("setting_enable_music"));
		setting_enable_sounds 		= toBool(localStorage.getItem("setting_enable_sounds"));
		setting_enable_particles 	= toBool(localStorage.getItem("setting_enable_particles"));
		setting_enable_monospace 	= toBool(localStorage.getItem("setting_enable_monospace"));
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

		//TODO: create a function to actually unload particles.js
		if (is_mobile) {
			particlesJS.load("particles-js", "/particles/default_mobile.json", function(){
			console.log("particles_mobile.json loaded")
			});
		} else {
			particlesJS.load("particles-js", "/particles/default.json", function(){
			console.log("particles.json loaded")
			});
		}
	}

	Howler.volume(setting_volume_master);
	SetEnableParticles(setting_enable_particles);
	SettingSetMonospace(setting_enable_monospace);
	
	

	try {
		if (setting_enable_music && navigator.getAutoplayPolicy("mediaelement") != "allowed") {$("#info-enabling-music").show()};
	} catch(error) {
		console.warn(error);
	}
	

	console.log("main.ts loaded.");
};

document.addEventListener('astro:page-load', RegisterSounds);
document.addEventListener('astro:page-load', RegisterSpoilers);
init();