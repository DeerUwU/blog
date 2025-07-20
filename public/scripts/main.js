var first_time_visit = true;

// default setting vars
var setting_volume_master = 0.2;
var setting_enable_music = false;
var setting_enable_sounds = true;
var setting_enable_particles = true;

// ----------------------------------------------------------
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
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

var bgm_idx = getRandomInt(bgm_random.length-1)

var bgm = new Howl({
  src: [bgm_random[bgm_idx]]
});


function PlaySound() {
	var sound = new Howl({
		src: [snd_dir+'blip.wav']
	});

	sound.play();
}

function PlayMusic(value) {
	if (value == true) {
		bgm.play();
		bgm.loop(true);
	} else {
		bgm.pause();
	}
}


function LoadSettingsToMenu() {
	$("#setting-volume").val(setting_volume_master*100);
	$("#setting-volume-value").text(setting_volume_master*100+"%");
	
	$("#setting-showparticles").prop('checked', setting_enable_particles);
	$("#setting-enable-music").prop('checked', setting_enable_music);
	$("#setting-enable-sounds").prop('checked', setting_enable_sounds);
}

function OpenSettingsMenu() {
	LoadSettingsToMenu();
	$('#settings-menu').show();
	$('#popup-container').show();
}
function CloseSettingsMenu() {
	$('#settings-menu').hide();
	$('#popup-container').hide();
}

// --------------------------------------------------------------

function SetVolume(volume) {
	setting_volume_master = volume/100;
	Howler.volume(setting_volume_master);
	localStorage.setItem("setting_volume_master", setting_volume_master)
	$('#setting-volume-value').text(volume+"%");
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


window.onload = () => {

	$("#settings-close").on("click", CloseSettingsMenu);
	$("#settings-open").on("click", OpenSettingsMenu);

	CloseSettingsMenu();

	if (localStorage.getItem("first_time_visit") == null || 
		localStorage.getItem("first_time_visit") == "true") 
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
			bgm.play();
			bgm.loop(true);

			$("#info-enabling-music").show();
		}
	}
	Howler.volume(setting_volume_master);
	SetEnableParticles(setting_enable_particles);
	
	console.log("main.ts loaded.");
};




