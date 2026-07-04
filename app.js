var PWD  = "tkd399";

// CINEMATIC SPLASH — SWELL + MIST
// ═══════════════════════════════════════
(function () {
	var audioStarted = false;
	function startSwell() {
		if (audioStarted) return;
		audioStarted = true;
		var hint = document.getElementById("spl-tap-hint");
		if (hint) hint.style.opacity = "0";
		try {
			var AC = window.AudioContext || window.webkitAudioContext;
			if (!AC) return;
			var c = new AC();
			console.log("Audio state:", c.state);
			if (c.state === "suspended") c.resume();
			var now = c.currentTime;
			var sr = c.sampleRate;
			var dur = 6.5;
			var master = c.createGain();
			master.connect(c.destination);
			master.gain.setValueAtTime(0.1, now);
			master.gain.linearRampToValueAtTime(0.4, now + 0.5);
			master.gain.linearRampToValueAtTime(0.6, now + 2.0);
			master.gain.linearRampToValueAtTime(0.8, now + 4.0);
			master.gain.linearRampToValueAtTime(0.9, now + 6.0);
			master.gain.linearRampToValueAtTime(0.7, now + 8.5);
			master.gain.linearRampToValueAtTime(0.001, now + 10.5);
			var revLen = Math.floor(sr * 3.5);
			var revBuf = c.createBuffer(2, revLen, sr);
			for (var rc = 0; rc < 2; rc++) {
				var rv = revBuf.getChannelData(rc);
				for (var ri = 0; ri < revLen; ri++)
					rv[ri] = (Math.random() * 2 - 1) * Math.pow(1 - ri / revLen, 1.6);
			}
			var rev = c.createConvolver();
			rev.buffer = revBuf;
			var revSend = c.createGain();
			revSend.gain.setValueAtTime(0.5, now);
			rev.connect(revSend);
			revSend.connect(master);
			function pad(freq, t0, durT, vol, detuneCents) {
				var o = c.createOscillator(),
					o2 = c.createOscillator(),
					g = c.createGain();
				o.type = "sine";
				o2.type = "sine";
				o.frequency.value = freq;
				o2.frequency.value = freq * Math.pow(2, (detuneCents || 6) / 1200);
				var atk = 0.1,
					rel = durT * 0.25;
				g.gain.setValueAtTime(0.001, t0);
				g.gain.linearRampToValueAtTime(vol, t0 + atk);
				g.gain.setValueAtTime(vol, t0 + durT - rel);
				g.gain.linearRampToValueAtTime(0.001, t0 + durT);
				o.connect(g);
				o2.connect(g);
				g.connect(master);
				g.connect(rev);
				o.start(t0);
				o.stop(t0 + durT + 0.1);
				o2.start(t0);
				o2.stop(t0 + durT + 0.1);
			}
			function warm(freq, t0, durT, vol) {
				var o = c.createOscillator(),
					f = c.createBiquadFilter(),
					g = c.createGain();
				o.type = "sawtooth";
				o.frequency.value = freq;
				f.type = "lowpass";
				f.frequency.setValueAtTime(600, t0);
				f.Q.value = 0.8;
				var atk = 0.2;
				g.gain.setValueAtTime(0.001, t0);
				g.gain.linearRampToValueAtTime(vol, t0 + atk);
				g.gain.linearRampToValueAtTime(0.001, t0 + durT);
				o.connect(f);
				f.connect(g);
				g.connect(master);
				g.connect(rev);
				o.start(t0);
				o.stop(t0 + durT + 0.1);
			}
			pad(55, now, 10, 0.25);
			pad(55, now, 10, 0.15, -8);
			pad(110, now + 0.5, 9.5, 0.22);
			warm(110, now + 0.5, 9.5, 0.1);
			pad(165, now + 1.5, 8.5, 0.25);
			warm(165, now + 1.5, 8.5, 0.12);
			pad(220, now + 3.0, 7.0, 0.28);
			pad(262, now + 3.0, 7.0, 0.14);
			warm(220, now + 3.0, 7.0, 0.1);
			pad(330, now + 5.0, 5.5, 0.22);
			pad(440, now + 5.0, 5.5, 0.12);
			warm(330, now + 5.0, 5.0, 0.08);
			pad(554, now + 7.0, 3.5, 0.1);
			pad(659, now + 7.0, 3.5, 0.08);
			var impT = now + 7.0;
			var impOsc = c.createOscillator(),
				impG = c.createGain();
			impOsc.type = "sine";
			impOsc.frequency.setValueAtTime(85, impT);
			impOsc.frequency.exponentialRampToValueAtTime(22, impT + 0.6);
			impG.gain.setValueAtTime(0, impT);
			impG.gain.linearRampToValueAtTime(1.6, impT + 0.012);
			impG.gain.exponentialRampToValueAtTime(0.001, impT + 1.5);
			impOsc.connect(impG);
			impG.connect(c.destination);
			impG.connect(rev);
			impOsc.start(impT);
			impOsc.stop(impT + 1.6);
		} catch (ex) {
			console.log("swell err:", ex);
		}
	}
	window._startSwell = startSwell;
	function onFirstInteraction() {
		document.removeEventListener("click", onFirstInteraction);
		document.removeEventListener("touchstart", onFirstInteraction);
		document.removeEventListener("mousedown", onFirstInteraction);
		document.removeEventListener("pointerdown", onFirstInteraction);
		startSwell();
	}
	document.addEventListener("click", onFirstInteraction);
	document.addEventListener("touchstart", onFirstInteraction);
	document.addEventListener("mousedown", onFirstInteraction);
	document.addEventListener("pointerdown", onFirstInteraction);
	setTimeout(function () {
		if (!audioStarted) {
			try {
				var t = new (window.AudioContext || window.webkitAudioContext)();
				var state = t.state;
				t.close();
				if (state === "running") startSwell();
			} catch (e) {}
		}
	}, 10);
	function initMist() {
		var canvas = document.getElementById("spl-canvas");
		if (!canvas) return;
		var W = canvas.offsetWidth || window.innerWidth;
		var H = canvas.offsetHeight || window.innerHeight;
		canvas.width = W;
		canvas.height = H;
		var ctx = canvas.getContext("2d");
		var particles = [];
		for (var i = 0; i < 55; i++) {
			particles.push({
				x: W * 0.1 + Math.random() * W * 0.8,
				y: H * 0.55 + Math.random() * H * 0.5,
				r: 60 + Math.random() * 120,
				vx: (Math.random() - 0.5) * 0.4,
				vy: -(0.15 + Math.random() * 0.5),
				alpha: 0,
				maxAlpha: 0.04 + Math.random() * 0.1,
				grow: 0.0008 + Math.random() * 0.001,
				phase: Math.random() * Math.PI * 2,
				hue: Math.random() < 0.7 ? 43 : 38,
			});
		}
		var frame = 0,
			alive = true;
		function draw() {
			if (!alive) return;
			ctx.clearRect(0, 0, W, H);
			var vg = ctx.createRadialGradient(
				W / 2,
				H / 2,
				H * 0.1,
				W / 2,
				H / 2,
				H * 0.85,
			);
			vg.addColorStop(0, "rgba(0,0,0,0)");
			vg.addColorStop(1, "rgba(0,0,0,0.72)");
			ctx.fillStyle = vg;
			ctx.fillRect(0, 0, W, H);
			frame++;
			for (var i = 0; i < particles.length; i++) {
				var p = particles[i];
				p.x += p.vx + Math.sin(frame * 0.01 + p.phase) * 0.3;
				p.y += p.vy;
				p.r += p.r * p.grow;
				if (p.alpha < p.maxAlpha) p.alpha += 0.0015;
				if (p.y + p.r < -50) {
					p.y = H * 0.6 + Math.random() * H * 0.4;
					p.x = W * 0.05 + Math.random() * W * 0.9;
					p.alpha = 0;
					p.r = 60 + Math.random() * 80;
				}
				var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
				grad.addColorStop(0, "hsla(" + p.hue + ",80%,55%," + p.alpha + ")");
				grad.addColorStop(
					0.5,
					"hsla(" + p.hue + ",60%,35%," + p.alpha * 0.5 + ")",
				);
				grad.addColorStop(1, "hsla(" + p.hue + ",50%,20%,0)");
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = grad;
				ctx.fill();
			}
			requestAnimationFrame(draw);
		}
		draw();
		setTimeout(function () {
			alive = false;
		}, 11000);
	}
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initMist);
	} else {
		setTimeout(initMist, 50);
	}
})();
window.addEventListener("load", function () {
	if (localStorage.getItem("tkd-auth") === PWD) {
		var ps = document.getElementById("pwd-screen");
		if (ps) ps.style.display = "none";
	}
});
function checkPwd() {
	var val = document.getElementById("pwd-input").value.trim().toLowerCase();
	if (val === PWD) {
		localStorage.setItem("tkd-auth", PWD);
		document.getElementById("pwd-screen").style.display = "none";
	} else {
		document.getElementById("pwd-err").textContent = "Wrong code — try again";
		document.getElementById("pwd-input").value = "";
		document.getElementById("pwd-input").focus();
	}
}
document.addEventListener("keydown", function (e) {
	if (
		e.key === "Enter" &&
		document.getElementById("pwd-screen").style.display !== "none"
	)
		checkPwd();
});

var PH = "./images/dutton-hero.png";
var TB = "./images/top-banner.png";

var CT = "home",
	BELT = localStorage.getItem("tkd-belt") || "White Belt",
	PF = "All",
	SP = null,
	MV = false,
	OM = null,
	BI = 0,
	BC = {},
	QL = null,
	QI = 0,
	QS = null,
	QSC = 0,
	QA = 0,
	QF = false,
	QH = [],
	GS = "",
	GO = "Commands",
	TC = "menu",
	TL = "All",
	TO = null;

var PATS = [
	{
		id: "",
		name: "Saju Jirugi",
		moves: 14,
		belt: "10th Kup (White)",
		diff: "Beginner",
		meaning: "4-Direction Punch. The first exercise taught to all beginners.",
		video: "https://www.youtube.com/embed/5xmCn4MLohg",
	},
	{
		id: "",
		name: "Saju Makgi",
		moves: 16,
		belt: "10th Kup (White)",
		diff: "Beginner",
		meaning: "4-Direction Block. Foundational blocking exercise for beginners.",
		video:"https://www.youtube.com/embed/SkpZZhiNAMI",
	},
	{
		id: 1,
		name: "Chon-Ji",
		moves: 19,
		belt: "10th Kup (White)",
		diff: "Beginner",
		meaning:
			"Chon-Ji means literally Heaven and Earth. It is interpreted in the Orient as the creation of the world or the beginning of human history. Therefore, it is the initial pattern performed by the beginner. This pattern consists of two similar parts; one represents Heaven and the other Earth.",
		video: "https://www.youtube.com/embed/ZZSeWxi-fU0",
	},
	{
		id: 2,
		name: "Dan-Gun",
		moves: 21,
		belt: "9th Kup (White/Yellow)",
		diff: "Beginner",
		meaning:
			"Named after the holy Dan-Gun, legendary founder of Korea in 2,333 BC.",
		video: "https://www.youtube.com/embed/CTgd1FYPQN8",
	},
	{
		id: 3,
		name: "Do-San",
		moves: 24,
		belt: "8th Kup (Yellow)",
		diff: "Beginner",
		meaning: "Do-San was the pseudonym of the patriot Ahn Chang-Ho (1876–1938). The 24 movements represent his entire life, which he devoted to furthering the education of Korea and its independence movement.",
	video: "https://www.youtube.com/embed/rBB9vaPT4rI",
	},
	{
		id: 4,
		name: "Won-Hyo",
		moves: 28,
		belt: "7th Kup (Yellow/Green)",
		diff: "Beginner",
		meaning: "Won-Hyo was the noted monk who introduced Buddhism to the Silla Dynasty in the year 686 AD.",
		video: "https://www.youtube.com/embed/VB1nXWXg91w",
	},
	{
		id: 5,
		name: "Yul-Gok",
		moves: 38,
		belt: "6th Kup (Green)",
		diff: "Intermediate",
		meaning: "Yul-Gok was the pseudonym of the great philosopher and scholar Yi I (1536-1584), nicknamed the Confucius of Korea. The 38 movements of this pattern refer to his birthplace on the 38th degree latitude and the diagram represents a scholar.",
		video: "https://www.youtube.com/embed/iEy4NGfGx3k",
	},
	{
		id: 6,
		name: "Joong-Gun",
		moves: 32,
		belt: "5th Kup (Green/Blue)",
		diff: "Intermediate",
		meaning: "Joong-Gun is named after the patriot Ahn Joong-Gun, who assassinated Hirobumi Ito, the first Japanese Governor-General of Korea, known as the man who played the leading part in the Korea-Japan merger. The 32 movements represent Mr. Ahn's age when he was executed at Lui-Shung Prison in 1910.",
		video: "https://www.youtube.com/embed/C0wbvHc_odU",
	},
	{
		id: 7,
		name: "Toi-Gye",
		moves: 37,
		belt: "4th Kup (Blue)",
		diff: "Intermediate",
		meaning: "Toi-Gye was the pen name of the noted scholar Yi Hwang (16th century), an authority on Neo-Confucianism. The 37 movements refer to his birthplace on the 37th degree latitude and the diagram represents a scholar.",
		video: "https://www.youtube.com/embed/lLfLNbrb6jk",
	},
	{
		id: 8,
		name: "Hwa-Rang",
		moves: 29,
		belt: "3rd Kup (Blue/Red)",
		diff: "Intermediate",
		meaning: "Hwa-Rang is named after the Hwa-Rang youth group which originated in the Silla Dynasty about 1,350 years ago. The 29 movements refer to the 29th Infantry Division, where Taekwon-Do developed into maturity.",
		video: "https://www.youtube.com/embed/hb5wMTcvPXY",
	},
	{
		id: 9,
		name: "Choong-Moo",
		moves: 30,
		belt: "2nd Kup (Red)",
		diff: "Intermediate",
		meaning: "Choong-Moo was the given name of the great Admiral Yi Soon-Sin of the Yi Dynasty. He was reputed to have invented the first armoured battleship, known as the Turtle Ship, in 1592, which is said to be the precursor of the present-day submarine. The reason this pattern ends with a left-hand attack is to symbolise his regrettable death, having no chance to show his unrestrained potential checked by the forced reservation of his loyalty to the King.",
		video: "https://www.youtube.com/embed/VYq1B9ETdbQ",
	},
	{
		id: 10,
		name: "Kwang-Gae",
		moves: 39,
		belt: "1st Dan",
		diff: "Advanced",
		meaning: "Kwang-Gae is named after the famous Kwang-Gae-Toh-Wang, the 19th King of the Koguryo Dynasty, who regained all the lost territories including the greater part of Manchuria. The diagram represents the expansion and recovery of lost territory. The 39 movements refer to the first two figures of 391 AD, the year he came to the throne.",
		video: "https://www.youtube.com/embed/Jr-yMMaL7cg",
	},
	{
		id: 11,
		name: "Po-Eun",
		moves: 36,
		belt: "1st Dan",
		diff: "Advanced",
		meaning: "Po-Eun was the pseudonym of the loyal subject Chong Mong-Chu (1400), who was a famous poet and whose poem 'I would not serve a second master though I might be crucified a hundred times' is known to every Korean. The diagram represents his unerring loyalty to the king and country towards the end of the Koryo Dynasty.",
		video: "https://www.youtube.com/embed/yE2ed-mf-6k",
	},
	{
		id: 12,
		name: "Ge-Baek",
		moves: 44,
		belt: "1st Dan",
		diff: "Advanced",
		meaning: "Ge-Baek is named after General Ge-Baek of the Baek Je Dynasty (660 AD). The diagram represents his severe and strict military discipline.",
		video: "https://www.youtube.com/embed/m8h3AmL_v58",
	},
	{
		id: 13,
		name: "Eui-Am",
		moves: 45,
		belt: "2nd Dan",
		diff: "Advanced",
		meaning: "Eui-Am was the pseudonym of Son Byong Hi, leader of the Korean independence movement on March 1st, 1919. The 45 movements refer to his age when he changed the name of Dong Hak (Eastern Learning) to Chondo Kyo (Heavenly Way Religion) in 1905.",
		video: "https://www.youtube.com/embed/zdAQNNOKZY4",
	},
	{
		id: 14,
		name: "Choong-Jang",
		moves: 52,
		belt: "2nd Dan",
		diff: "Advanced",
		meaning: "Choong-Jang is the pseudonym given to General Kim Duk Ryang, who lived during the Yi Dynasty in the 14th century. This pattern ends with a left-hand attack to symbolise the tragedy of his death at the age of 27 in prison before he was able to reach full maturity.",
		video: "",
	},
	{
		id: 15,
		name: "Juche",
		moves: 45,
		belt: "3rd Dan",
		diff: "Advanced",
		meaning: "Juche is a philosophical idea that man is the master of everything and decides everything. In other words, the idea that man is the master of the world and of his own destiny. It is said that this idea was rooted on Baekdu Mountain, which symbolises the spirit of the Korean people. The diagram represents Baekdu Mountain.",
		video: "",
	},
	{
		id: 16,
		name: "Sam-Il",
		moves: 33,
		belt: "3rd Dan",
		diff: "Advanced",
	meaning: "Sam-Il denotes the historical date of the Korean independence movement which began throughout Korea on March 1st, 1919. The 33 movements represent the 33 patriots who planned the movement.",
		video: "https://www.youtube.com/embed/hxtaIBf6CMQ",
	},
	{
		id: 17,
		name: "Yoo-Sin",
		moves: 68,
		belt: "4th Dan",
		diff: "Advanced",
		meaning: "Yoo-Sin is named after General Kim Yoo-Sin, the commanding general during the Silla Dynasty who unified the three kingdoms of Korea. The 68 movements refer to the last two figures of 668 AD, the year Korea was unified.",
		video: "https://www.youtube.com/embed/Jm6qw45R1ho",
	},
	{
		id: 18,
		name: "Choi-Yong",
		moves: 46,
		belt: "4th Dan",
		diff: "Advanced",
		meaning: "Choi-Yong is named after General Choi Yong, Premier and Commander-in-Chief of the Armed Forces during the 14th century Koryo Dynasty. He was greatly respected for his loyalty, patriotism and humility. The pattern has 46 movements representing the last two figures of 1046 AD, the year he was born.",
		video: "https://www.youtube.com/embed/hxtaIBf6CMQ",
	},
	{
		id: 19,
		name: "Yon-Gae",
		moves: 49,
		belt: "4th Dan",
		diff: "Advanced",
		meaning: "Yon-Gae is named after the famous general Yon Gae Somoon during the Koguryo Dynasty. The 49 movements refer to the last two figures of 649 AD, the year he forced the Tang Dynasty to quit Korea after destroying nearly 300,000 Chinese troops at Ansi Sung.",
		video: "",
	},
	{
		id: 20,
		name: "Ul-Ji",
		moves: 42,
		belt: "5th Dan",
		diff: "Advanced",
		meaning: "Ul-Ji is named after General Ul-Ji Moon Dok, who successfully defended Korea against a Tang invasion force of nearly one million soldiers led by Yang Je in 612 AD. The pattern has 42 movements representing the author's age when he designed it.",
		video: "",
	},
	{
		id: 21,
		name: "Moon-Moo",
		moves: 61,
		belt: "5th Dan",
		diff: "Advanced",
		meaning: "Moon-Moo was the name of the 30th king of the Silla Dynasty. His body was buried near Dae Wang Am (Great King's Rock). According to his will, the body was placed in the sea where 'my soul shall forever defend my land against the Japanese'. The 61 movements in this pattern symbolise the last two figures of 661 AD when Moon-Moo came to the throne.",
		video: "https://www.youtube.com/embed/eTw7Gf92Dac",
	},
	{
		id: 22,
		name: "So-San",
		moves: 72,
		belt: "6th Dan",
		diff: "Advanced",
		meaning: "So-San was the pseudonym of the great monk Choi Hyong Ung (1520-1604) during the Yi Dynasty. The 72 movements refer to his age when he organised a corps of monk soldiers with the assistance of his pupil Sa Myung Dang. The monk soldiers helped repel the Japanese pirates who overran most of the Korean peninsula in 1592.",
		video: "",
	},
	{
		id: 23,
		name: "Se-Jong",
		moves: 24,
		belt: "6th Dan",
		diff: "Advanced",
		meaning: "Se-Jong is named after the greatest Korean king, Se-Jong, who invented the Korean alphabet in 1443 and was also a noted meteorologist. The diagram represents the King, while the 24 movements refer to the 24 letters of the Korean alphabet.",
		video: "",
	},
	{
		id: 24,
		name: "Tong-Il",
		moves: 56,
		belt: "7th Dan",
		diff: "Advanced",
		meaning: "Tong-Il denotes the resolution of the unification of Korea which has been divided since 1945. The diagram symbolises the homogeneous race.",
		video: "",
	},
];
var PM = {
	"Saju Jirugi": [
		{
			n: 1,
			t: "Right Walking Stance · Middle Punch",
			s: "",
			d: "Move the right foot to D forming a right walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 2,
			t: "Left Walking Stance · Low Block",
			s: "",
			d: "Move the right foot to A forming a left walking stance toward B while executing a low block to B with the left outer forearm.",
		},
		{
			n: 3,
			t: "Right Walking Stance · Middle Punch",
			s: "",
			d: "Move the right foot to B forming a right walking stance toward B while executing a middle punch to B with the right fist.",
		},
		{
			n: 4,
			t: "Left Walking Stance · Low Block",
			s: "",
			d: "Move the right foot to D forming a left walking stance toward C while executing a low block to C with the left outer forearm.",
		},
		{
			n: 5,
			t: "Right Walking Stance · Middle Punch",
			s: "",
			d: "Move the right foot to C forming a right walking stance toward C while executing a middle punch to C with the right fist.",
		},
		{
			n: 6,
			t: "Left Walking Stance · Low Block",
			s: "",
			d: "Move the right foot to B forming a left walking stance toward A while executing a low block to A with the left outer forearm.",
		},
		{
			n: 7,
			t: "Right Walking Stance · Middle Punch",
			s: "",
			d: "Move the right foot to A forming a right walking stance toward A while executing a middle punch to A with the right fist.\n\nMove the right foot to X forming Parallel Ready Stance to D.",
		},

		{
			n: 8,
			t: "Left Walking Stance · Middle Punch",
			s: "",
			d: "Move the left foot to D forming a left walking stance toward D while executing a middle punch to D with the left fist.",
		},
		{
			n: 9,
			t: "Right Walking Stance · Low Block",
			s: "",
			d: "Move the left foot to B forming a right walking stance toward A while executing a low block to A with the right outer forearm.",
		},
		{
			n: 10,
			t: "Left Walking Stance · Middle Punch",
			s: "",
			d: "Move the left foot to A forming a left walking stance toward A while executing a middle punch to A with the left fist.",
		},
		{
			n: 11,
			t: "Right Walking Stance · Low Block",
			s: "",
			d: "Move the left foot to D forming a right walking stance toward C while executing a low block to C with the right outer forearm.",
		},
		{
			n: 12,
			t: "Left Walking Stance · Middle Punch",
			s: "",
			d: "Move the left foot to C forming a left walking stance toward C while executing a middle punch to C with the left fist.",
		},
		{
			n: 13,
			t: "Right Walking Stance · Low Block",
			s: "",
			d: "Move the left foot to A forming a right walking stance toward B while executing a low block to B with the right outer forearm.",
		},
		{
			n: 14,
			t: "Left Walking Stance · Middle Punch",
			s: "",
			d: "Move the left foot to B forming a left walking stance toward B while executing a middle punch to B with the left fist.\n\nEnd: Bring the left foot back to the starting ready position.",
		},
	],

	"Saju Makgi": [
		{
			n: 1,
			t: "Left Walking Stance · Low Knifehand Block",
			s: "",
			d: "Move the right foot to C forming a left walking stance toward D while executing a low knifehand block to D with the left hand.",
		},
		{
			n: 2,
			t: "Right Walking Stance · Middle Block",
			s: "",
			d: "Move the right foot to D forming a right walking stance toward D while executing a middle block to D with the right inner forearm.",
		},
		{
			n: 3,
			t: "Left Walking Stance · Low Knifehand Block",
			s: "",
			d: "Move the right foot to A forming a left walking stance toward B while executing a low knifehand block to B with the left hand.",
		},
		{
			n: 4,
			t: "Right Walking Stance · Middle Block",
			s: "",
			d: "Move the right foot to B forming a right walking stance toward B while executing a middle block to B with the right inner forearm.",
		},
		{
			n: 5,
			t: "Left Walking Stance · Low Knifehand Block",
			s: "",
			d: "Move the right foot to D forming a left walking stance toward C while executing a low knifehand block to C with the left hand.",
		},
		{
			n: 6,
			t: "Right Walking Stance · Middle Block",
			s: "",
			d: "Move the right foot to C forming a right walking stance toward C while executing a middle block to C with the right inner forearm.",
		},
		{
			n: 7,
			t: "Left Walking Stance · Low Knifehand Block",
			s: "",
			d: "Move the right foot to B forming a left walking stance toward A while executing a low knifehand block to A with the left hand.",
		},
		{
			n: 8,
			t: "Right Walking Stance · Middle Block",
			s: "",
			d: "Move the right foot to A forming a right walking stance toward A while executing a middle block to A with the right inner forearm.\n\nMove the right foot to X forming Parallel Ready Stance to D.",
		},

		{
			n: 9,
			t: "Right Walking Stance · Low Knifehand Block",
			s: "",
			d: "Move the left foot to C forming a right walking stance toward D while executing a low knifehand block to D with the right hand.",
		},
		{
			n: 10,
			t: "Left Walking Stance · Middle Block",
			s: "",
			d: "Move the left foot to D forming a left walking stance toward D while executing a middle block to D with the left inner forearm.",
		},
		{
			n: 11,
			t: "Right Walking Stance · Low Knifehand Block",
			s: "",
			d: "Move the left foot to B forming a right walking stance toward A while executing a low knifehand block to A with the right hand.",
		},
		{
			n: 12,
			t: "Left Walking Stance · Middle Block",
			s: "",
			d: "Move the left foot to A forming a left walking stance toward A while executing a middle block to A with the left inner forearm.",
		},
		{
			n: 13,
			t: "Right Walking Stance · Low Knifehand Block",
			s: "",
			d: "Move the left foot to D forming a right walking stance toward C while executing a low knifehand block to C with the right hand.",
		},
		{
			n: 14,
			t: "Left Walking Stance · Middle Block",
			s: "",
			d: "Move the left foot to C forming a left walking stance toward C while executing a middle block to C with the left inner forearm.",
		},
		{
			n: 15,
			t: "Right Walking Stance · Low Knifehand Block",
			s: "",
			d: "Move the left foot to A forming a right walking stance toward B while executing a low knifehand block to B with the right hand.",
		},
		{
			n: 16,
			t: "Left Walking Stance · Middle Block",
			s: "",
			d: "Move the left foot to B forming a left walking stance toward B while executing a middle block to B with the left inner forearm.\n\nEnd: Bring the left foot back to the starting ready position.",
		},
	],

	"Chon-Ji": [
		{
			n: 1,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Move the left foot to B forming a left walking stance toward B while executing a low block to B with the left forearm.",
		},
		{
			n: 2,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to B forming a right walking stance toward B while executing a middle punch to B with the right fist.",
		},
		{
			n: 3,
			t: "Right Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Move the right foot to A, turning clockwise to form a right walking stance toward A while executing a low block to A with the right forearm.",
		},
		{
			n: 4,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the left foot to A forming a left walking stance toward A while executing a middle punch to A with the left fist.",
		},
		{
			n: 5,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a low block to D with the left forearm.",
		},
		{
			n: 6,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 7,
			t: "Right Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Move the right foot to C turning clockwise to form a right walking stance toward C while executing a low block to C with the right forearm.",
		},
		{
			n: 8,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the left foot to C forming a left walking stance toward C while executing a middle punch to C with the left fist.",
		},
		{
			n: 9,
			t: "Right L-Stance · Middle Block",
			s: "Niunja So Anpalmok Kaunde Yop Makgi",
			d: "Move the left foot to A forming a right L-stance toward A while executing a middle block to A with the left inner forearm.",
		},
		{
			n: 10,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to A forming a right walking stance toward A while executing a middle punch to A with the right fist.",
		},
		{
			n: 11,
			t: "Left L-Stance · Middle Block",
			s: "Niunja So Anpalmok Kaunde Yop Makgi",
			d: "Move the right foot to B turning clockwise to form a left L-stance toward B while executing a middle block to B with the right inner forearm.",
		},
		{
			n: 12,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the left foot to B forming a left walking stance toward B while executing a middle punch to B with the left fist.",
		},
		{
			n: 13,
			t: "Right L-Stance · Middle Block",
			s: "Niunja So Anpalmok Kaunde Yop Makgi",
			d: "Move the left foot to C forming a right L-stance toward C while executing a middle block to C with the left inner forearm.",
		},
		{
			n: 14,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to C forming a right walking stance toward C while executing a middle punch to C with the right fist.",
		},
		{
			n: 15,
			t: "Left L-Stance · Middle Block",
			s: "Niunja So Anpalmok Kaunde Yop Makgi",
			d: "Move the right foot to D turning clockwise to form a left L-stance toward D while executing a middle block to D with the right inner forearm.",
		},
		{
			n: 16,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a middle punch to D with the left fist.",
		},
		{
			n: 17,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 18,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to C forming a left walking stance toward D while executing a middle punch to D with the left fist.",
		},
		{
			n: 19,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the left foot to C forming a right walking stance toward D while executing a middle punch to D with the right fist.\n\nEnd: Bring the left foot back to a ready posture.",
		},
	],
	"Dan-Gun": [
		{
			n: 1,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to B forming a right L-stance toward B, at the same time executing a middle guarding block to B with a knife-hand.",
		},
		{
			n: 2,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the right foot to B forming a right walking stance toward B while executing a high punch to B with the right fist.",
		},
		{
			n: 3,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot to A turning clockwise to form a left L-stance toward A, at the same time executing a middle guarding block to A with a knife-hand.",
		},
		{
			n: 4,
			t: "Left Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the left foot to A forming a left walking stance toward A while executing a high punch to A with the left fist.",
		},
		{
			n: 5,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a low block to D with the left forearm.",
		},
		{
			n: 6,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a high punch to D with the right fist.",
		},
		{
			n: 7,
			t: "Left Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a high punch to D with the left fist.",
		},
		{
			n: 8,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a high punch to D with the right fist.",
		},
		{
			n: 9,
			t: "Right L-Stance · Twin Forearm Block",
			s: "Niunja So Sang Palmok Makgi",
			d: "Move the left foot to E, turning counter clockwise to form a right L-stance toward E while executing a twin forearm block to E.",
		},
		{
			n: 10,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the right foot to E forming a right walking stance toward E while executing a high punch to E with the right fist.",
		},
		{
			n: 11,
			t: "Left L-Stance · Twin Forearm Block",
			s: "Niunja So Sang Palmok Makgi",
			d: "Move the right foot to F turning clockwise to form a left L-stance toward F while executing a twin forearm block to F.",
		},
		{
			n: 12,
			t: "Left Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the left foot to F forming a left walking stance toward F while executing a high punch to F with the left fist.",
		},
		{
			n: 13,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Move the left foot to C forming a left walking stance toward C while executing a low block to C with the left forearm.",
		},
		{
			n: 14,
			t: "Left Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Execute a rising block with the left forearm, maintaining the left walking stance toward C.\n\nPerform 13 and 14 in a continuous motion.",
		},
		{
			n: 15,
			t: "Right Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the right foot to C forming a right walking stance toward C, at the same time executing a rising block with the right forearm.",
		},
		{
			n: 16,
			t: "Left Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the left foot to C forming a left walking stance toward C, at the same time executing a rising block with the left forearm.",
		},
		{
			n: 17,
			t: "Right Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the right foot to C forming a right walking stance toward C, at the same time executing a rising block with the right forearm.",
		},
		{
			n: 18,
			t: "Right L-Stance · Middle Outward Strike",
			s: "Niunja So Sonkal Kaunde Bakuro Taerigi",
			d: "Move the left foot to B turning counter clockwise to form a right L-stance toward B while executing a middle outward strike to B with the left knife-hand.",
		},
		{
			n: 19,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the right foot to B forming a right walking stance toward B while executing a high punch to B with the right fist.",
		},
		{
			n: 20,
			t: "Left L-Stance · Middle Outward Strike",
			s: "Niunja So Sonkal Kaunde Bakuro Taerigi",
			d: "Move the right foot to A turning clockwise to form a left L-stance toward A while executing a middle outward strike to A with the right knife-hand.",
		},
		{
			n: 21,
			t: "Left Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Move the left foot to A forming a left walking stance toward A while executing a high punch to A with the left fist.\n\nEnd: Bring the left foot back to a ready posture.",
		},
	],
	"Do-San": [
		{
			n: 1,
			t: "Left Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Yop Makgi",
			d: "Move the left foot to B, forming a left walking stance toward B while executing a high side block to B with the left outer forearm.",
		},
		{
			n: 2,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to B with the right fist while maintaining a left walking stance toward B.",
		},
		{
			n: 3,
			t: "Right Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Yop Makgi",
			d: "Move the left foot on line AB, and then turn clockwise to form a right walking stance toward A while executing a high side block to A with the right outer forearm.",
		},
		{
			n: 4,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to A with the left fist while maintaining a right walking stance toward A.",
		},
		{
			n: 5,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to D, forming a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 6,
			t: "Right Walking Stance · Middle Thrust",
			s: "Gunnun So Sun Sonkut Kaunde Tulgi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a middle thrust to D with the right straight fingertip.",
		},
		{
			n: 7,
			t: "Left Walking Stance · High Side Strike",
			s: "Jappyosul Tae, Gunnun So Dung Joomuk Nopunde Yop Taerigi",
			d: "Twist the right knife-hand together with the body counter clockwise until its palm faces downward and then move the left foot to D, turning counter clockwise to form a left walking stance toward D while executing a high side strike to D with the left back fist.",
		},
		{
			n: 8,
			t: "Right Walking Stance · High Side Strike",
			s: "Gunnun So Dung Joomuk Nopunde Yop Taerigi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a high side strike to D with the right back fist.",
		},
		{
			n: 9,
			t: "Left Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Yop Makgi",
			d: "Move the left foot to E, turning counter clockwise to form a left walking stance toward E while executing a high side block to E with the left outer forearm.",
		},
		{
			n: 10,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to E with the right fist while maintaining a left walking stance toward E.",
		},
		{
			n: 11,
			t: "Right Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Yop Makgi",
			d: "Move the left foot on line EF, and then turn clockwise to form a right walking stance toward F while executing a high side block to F with the right outer forearm.",
		},
		{
			n: 12,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to F with the left fist while maintaining a right walking stance toward F.",
		},
		{
			n: 13,
			t: "Left Walking Stance · High Wedging Block",
			s: "Gunnun So Bakat Palmok Nopunde Hechyo Makgi",
			d: "Move the left foot to CE forming a left walking stance toward CE, at the same time executing a high wedging block to CE with the outer forearm.",
		},
		{
			n: 14,
			t: "Middle Front Snap Kick",
			s: "Kaunde Apcha Busigi",
			d: "Execute a middle front snap kick to CE with the right foot, keeping the position of the hands as they were in 13.",
		},
		{
			n: 15,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Lower the right foot to CE forming a right walking stance toward CE while executing a middle punch to CE with the right fist.",
		},
		{
			n: 16,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to CE with the left fist while maintaining a right walking stance toward CE.\n\nPerform 15 and 16 in a fast motion.",
		},
		{
			n: 17,
			t: "Right Walking Stance · High Wedging Block",
			s: "Gunnun So Bakat Palmok Nopunde Hechyo Makgi",
			d: "Move the right foot to CF forming a right walking stance toward CF while executing a high wedging block to CF with the outer forearm.",
		},
		{
			n: 18,
			t: "Middle Front Snap Kick",
			s: "Kaunde Apcha Busigi",
			d: "Execute a middle front snap kick to CF with the left foot, keeping the position of the hands as they were in 17.",
		},
		{
			n: 19,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Lower the left foot to CF forming a left walking stance toward CF while executing a middle punch to CF with the left fist.",
		},
		{
			n: 20,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to CF with the right fist while maintaining a left walking stance toward CF.\n\nPerform 19 and 20 in a fast motion.",
		},
		{
			n: 21,
			t: "Left Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the left foot to C forming a left walking stance toward C, at the same time executing a rising block with the left forearm.",
		},
		{
			n: 22,
			t: "Right Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the right foot to C forming a right walking stance toward C while executing a rising block with the right forearm.",
		},
		{
			n: 23,
			t: "Sitting Stance · Middle Side Strike",
			s: "Annun So Wen Sonkal Kaunde Yop Taerigi",
			d: "Move the left foot to B, turning counter clockwise to form a sitting stance toward D while executing a middle side strike to B with the left knife-hand.",
		},
		{
			n: 24,
			t: "Sitting Stance · Middle Side Strike",
			s: "Annun So Orun Sonkal Kaunde Yop Taerigi",
			d: "Bring the left foot to the right foot and then move the right foot to A forming a sitting stance toward D while executing a middle side strike to A with the right knife-hand.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Won-Hyo": [
		{
			n: 1,
			t: "Right L-Stance · Twin Forearm Block",
			s: "Niunja So Sang Palmok Makgi",
			d: "Move the left foot to B forming a right L-stance toward B while executing a twin forearm block.",
		},
		{
			n: 2,
			t: "Right L-Stance · High Inward Strike",
			s: "Niunja So Sonkal Nopunde Anuro Taerigi",
			d: "Execute a high inward strike to B with the right knife-hand while bringing the left side fist in front of the right shoulder, maintaining a right L-stance toward B.",
		},
		{
			n: 3,
			t: "Left Fixed Stance · Middle Punch",
			s: "Gojung So Kaunde Yop Jirugi",
			d: "Execute a middle punch to B with the left fist while forming a left fixed stance toward B, slipping the left foot to B.",
		},
		{
			n: 4,
			t: "Left L-Stance · Twin Forearm Block",
			s: "Niunja So Sang Palmok Makgi",
			d: "Bring the left foot to the right foot and then move the right foot to A, forming a left L-stance toward A while executing a twin forearm block.",
		},
		{
			n: 5,
			t: "Left L-Stance · High Inward Strike",
			s: "Niunja So Sonkal Nopunde Anuro Taerigi",
			d: "Execute a high inward strike to A with the left knife-hand while bringing the right side fist in front of the left shoulder, maintaining a left L-stance toward A.",
		},
		{
			n: 6,
			t: "Right Fixed Stance · Middle Punch",
			s: "Gojung So Kaunde Yop Jirugi",
			d: "Execute a middle punch to A with the right fist while forming a right fixed stance toward A, slipping the right foot to A.",
		},
		{
			n: 7,
			t: "Right Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Bring the right foot to the left foot and then turn the face toward D while forming a right bending ready stance A toward D.",
		},
		{
			n: 8,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to D with the left foot.",
		},
		{
			n: 9,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Lower the left foot to D forming a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 10,
			t: "Left L-Stance · Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot to D forming a left L-stance toward D while executing a guarding block to D with a knife-hand.",
		},
		{
			n: 11,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to D forming a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 12,
			t: "Right Walking Stance · Middle Thrust",
			s: "Gunnun So Sun Sonkut Kaunde Tulgi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a middle thrust to D with the right straight finger tip.",
		},
		{
			n: 13,
			t: "Right L-Stance · Twin Forearm Block",
			s: "Niunja So Sang Palmok Makgi",
			d: "Move the left foot to E turning counter clockwise to form a right L-stance toward E, at the same time executing a twin forearm block.",
		},
		{
			n: 14,
			t: "Right L-Stance · High Inward Strike",
			s: "Niunja So Sonkal Nopunde Anuro Taerigi",
			d: "Execute a high inward strike to E with the right knife-hand while bringing the left side fist in front of the right shoulder, maintaining a right L-stance toward E.",
		},
		{
			n: 15,
			t: "Left Fixed Stance · Middle Punch",
			s: "Gojung So Kaunde Yop Jirugi",
			d: "Execute a middle punch to E with the left fist while forming a left fixed stance toward E, slipping the left foot to E.",
		},
		{
			n: 16,
			t: "Left L-Stance · Twin Forearm Block",
			s: "Niunja So Sang Palmok Makgi",
			d: "Bring the left foot to the right foot and then move the right foot to F, forming a left L-stance toward F while executing a twin forearm block.",
		},
		{
			n: 17,
			t: "Left L-Stance · High Inward Strike",
			s: "Niunja So Sonkal Nopunde Anuro Taerigi",
			d: "Execute a high inward strike to F with the left knife-hand while bringing the right side fist in front of the left shoulder, maintaining a left L-stance toward F.",
		},
		{
			n: 18,
			t: "Right Fixed Stance · Middle Punch",
			s: "Gojung So Kaunde Yop Jirugi",
			d: "Execute a middle punch to F with the right fist while forming a right fixed stance toward F, slipping the right foot to F.",
		},
		{
			n: 19,
			t: "Left Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Bring the right foot to the left foot and then move the left foot to C forming a left walking stance toward C while executing a circular block to CF with the right inner forearm.",
		},
		{
			n: 20,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to C with the right foot, keeping the position of the hands as they were in 19.",
		},
		{
			n: 21,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Lower the right foot to C forming a right walking stance toward C while executing a middle punch to C with the left fist.",
		},
		{
			n: 22,
			t: "Right Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to CE with the left inner forearm while maintaining a right walking stance toward C.",
		},
		{
			n: 23,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to C with the left foot, keeping the position of the hands as they were in 22.",
		},
		{
			n: 24,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Lower the left foot to C forming a left walking stance toward C while executing a middle punch to C with the right fist.",
		},
		{
			n: 25,
			t: "Left Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn the face toward C forming a left bending ready stance A toward C.",
		},
		{
			n: 26,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the right foot.",
		},
		{
			n: 27,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Lower the right foot on line CD and then move the left foot to B, turning counter clockwise to form a right L-stance toward B, at the same time executing a middle guarding block to B with the forearm.",
		},
		{
			n: 28,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Bring the left foot to the right foot and then move the right foot to A forming a left L-stance toward A while executing a middle guarding block to A with the forearm.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Yul-Gok": [
		{
			n: 1,
			t: "Sitting Stance · Left Fist Extended",
			s: "Annun Sogi",
			d: "Move the left foot to B forming a sitting stance toward D while extending the left fist to D horizontally.",
		},
		{
			n: 2,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Ap Jirugi",
			d: "Execute a middle punch to D with the right fist while maintaining a sitting stance toward D.",
		},
		{
			n: 3,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Ap Jirugi",
			d: "Execute a middle punch to D with the left fist while maintaining a sitting stance toward D.\n\nPerform 2 and 3 in a fast motion.",
		},
		{
			n: 4,
			t: "Sitting Stance · Right Fist Extended",
			s: "Annun Sogi",
			d: "Bring the left foot to the right foot and then move the right foot to A forming a sitting stance toward D while extending the right fist to D horizontally.",
		},
		{
			n: 5,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Ap Jirugi",
			d: "Execute a middle punch to D with the left fist while maintaining a sitting stance toward D.",
		},
		{
			n: 6,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Ap Jirugi",
			d: "Execute a middle punch to D with the right fist while maintaining a sitting stance toward D.\n\nPerform 5 and 6 in a fast motion.",
		},
		{
			n: 7,
			t: "Right Walking Stance · Middle Side Block",
			s: "Gunnun So Anpalmok Kaunde Yop Makgi",
			d: "Move the right foot to AD forming a right walking stance toward AD while executing a middle side block to AD with the right inner forearm.",
		},
		{
			n: 8,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to AD with the left foot keeping the position of the hands as they were in 7.",
		},
		{
			n: 9,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Lower the left foot to AD forming a left walking stance toward AD while executing a middle punch to AD with the left fist.",
		},
		{
			n: 10,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to AD with the right fist while maintaining a left walking stance toward AD.\n\nPerform 9 and 10 in a fast motion.",
		},
		{
			n: 11,
			t: "Left Walking Stance · Middle Side Block",
			s: "Gunnun So Anpalmok Kaunde Yop Makgi",
			d: "Move the left foot to BD forming a left walking stance toward BD at the same time executing a middle side block to BD with the left inner forearm.",
		},
		{
			n: 12,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to BD with the right foot keeping the position of the hands as they were in 11.",
		},
		{
			n: 13,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Lower the right foot to BD forming a right walking stance toward BD while executing a middle punch to BD with the right fist.",
		},
		{
			n: 14,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to BD with the left fist while maintaining a right walking stance toward BD.\n\nPerform 13 and 14 in a fast motion.",
		},
		{
			n: 15,
			t: "Right Walking Stance · Middle Hooking Block",
			s: "Gunnun So Sonbadak Kaunde Golcho Makgi",
			d: "Execute a middle hooking block to D with the right palm while forming a right walking stance toward D, pivoting with the left foot.",
		},
		{
			n: 16,
			t: "Right Walking Stance · Middle Hooking Block",
			s: "Gunnun So Sonbadak Kaunde Bandae Golcho Makgi",
			d: "Execute a middle hooking block to D with the left palm while maintaining a right walking stance toward D.",
		},
		{
			n: 17,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Execute a middle punch to D with the right fist while maintaining a right walking stance toward D.\n\nPerform 16 and 17 in a connecting motion.",
		},
		{
			n: 18,
			t: "Left Walking Stance · Middle Hooking Block",
			s: "Gunnun So Sonbadak Kaunde Golcho Makgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a middle hooking block to D with the left palm.",
		},
		{
			n: 19,
			t: "Left Walking Stance · Middle Hooking Block",
			s: "Gunnun So Sonbadak Kaunde Bandae Golcho Makgi",
			d: "Execute a middle hooking block to D with the right palm while maintaining a left walking stance toward D.",
		},
		{
			n: 20,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Execute a middle punch to D with the left fist while maintaining a left walking stance toward D.\n\nPerform 19 and 20 in a connecting motion.",
		},
		{
			n: 21,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to D forming a right walking stance toward D at the same time executing a middle punch to D with the right fist.",
		},
		{
			n: 22,
			t: "Right Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn the face toward D forming a right bending ready stance A toward D.",
		},
		{
			n: 23,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to D with the left foot.",
		},
		{
			n: 24,
			t: "Left Walking Stance · Front Elbow Strike",
			s: "Gunnun So Ap Palkup Bandae Taerigi",
			d: "Lower the left foot to D forming a left walking stance toward D while striking the left palm with the right front elbow.",
		},
		{
			n: 25,
			t: "Left Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn the face toward C forming a left bending ready stance A toward C.",
		},
		{
			n: 26,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the right foot.",
		},
		{
			n: 27,
			t: "Right Walking Stance · Front Elbow Strike",
			s: "Gunnun So Ap Palkup Bandae Taerigi",
			d: "Lower the right foot to C forming a right walking stance toward C while striking the right palm with the left front elbow.",
		},
		{
			n: 28,
			t: "Right L-Stance · Twin Knife-Hand Block",
			s: "Niunja So Sang Sonkal Makgi",
			d: "Move the left foot to E forming a right L-stance toward E while executing a twin knife-hand block.",
		},
		{
			n: 29,
			t: "Right Walking Stance · Middle Thrust",
			s: "Gunnun So Sun Sonkut Kaunde Tulgi",
			d: "Move the right foot to E forming a right walking stance toward E while executing a middle thrust to E with the right straight finger tip.",
		},
		{
			n: 30,
			t: "Left L-Stance · Twin Knife-Hand Block",
			s: "Niunja So Sang Sonkal Makgi",
			d: "Move the right foot to F turning clockwise to form a left L-stance toward F while executing a twin knife-hand block.",
		},
		{
			n: 31,
			t: "Left Walking Stance · Middle Thrust",
			s: "Gunnun So Sun Sonkut Kaunde Tulgi",
			d: "Move the left foot to F forming a left walking stance toward F while executing a middle thrust to F with the left straight finger tip.",
		},
		{
			n: 32,
			t: "Left Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Yop Makgi",
			d: "Move the left foot to C forming a left walking stance toward C while executing a high side block to C with the left outer forearm.",
		},
		{
			n: 33,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to C with the right fist while maintaining a left walking stance toward C.",
		},
		{
			n: 34,
			t: "Right Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Yop Makgi",
			d: "Move the right foot to C forming a right walking stance toward C while executing a high side block to C with the right outer forearm.",
		},
		{
			n: 35,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to C with the left fist while maintaining a right walking stance toward C.",
		},
		{
			n: 36,
			t: "Left X-Stance · High Side Strike",
			s: "Twigi, Wen Kyocha So Dung Joomuk Nopunde Yop Taerigi",
			d: "Jump to C forming a left X-stance toward B while executing a high side strike to C with the left back fist.",
		},
		{
			n: 37,
			t: "Right Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Move the right foot to A forming a right walking stance toward A at the same time executing a high block to A with the right double forearm.",
		},
		{
			n: 38,
			t: "Left Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Bring the right foot to the left foot and then move the left foot to B forming a left walking stance toward B while executing a high block to B with the left double forearm.\n\nEnd: Bring the left foot back to a ready posture.",
		},
	],
	"Joong-Gun": [
		{
			n: 1,
			t: "Right L-Stance · Middle Block",
			s: "Niunja So Sonkal Dung Kaunde Makgi",
			d: "Move the left foot to B forming a right L-stance toward B while executing a middle block to B with the left reverse knife-hand.",
		},
		{
			n: 2,
			t: "Low Side Front Snap Kick",
			s: "Najunde Yobap Cha Busigi",
			d: "Execute a low side front snap kick to B with the left foot, keeping the position of the hands as they were in 1.",
		},
		{
			n: 3,
			t: "Left Rear Foot Stance · Upward Block",
			s: "Dwitbal So Sonbadak Bandae Ollyo Makgi",
			d: "Lower the left foot to B and then move the right foot to B forming a left rear foot stance toward B while executing an upward block with a right palm.",
		},
		{
			n: 4,
			t: "Left L-Stance · Middle Block",
			s: "Niunja So Sonkal Dung Kaunde Makgi",
			d: "Move the right foot to A forming a left L-stance toward A, at the same time executing a middle block to A with a right reverse knife-hand.",
		},
		{
			n: 5,
			t: "Low Side Front Snap Kick",
			s: "Najunde Yobap Cha Busigi",
			d: "Execute a low side front snap kick to A with the right foot, keeping the position of the hands as they were in 4.",
		},
		{
			n: 6,
			t: "Right Rear Foot Stance · Upward Block",
			s: "Dwitbal So Sonbadak Bandae Ollyo Makgi",
			d: "Lower the right foot to A and then move the left foot to A forming a right rear foot stance toward A while executing an upward block with a left palm.",
		},
		{
			n: 7,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to D forming a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 8,
			t: "Left Walking Stance · Upper Elbow Strike",
			s: "Gunnun So Wi Palkup Bandae Taerigi",
			d: "Execute a right upper elbow strike while forming a left walking stance toward D, slipping the left foot to D.",
		},
		{
			n: 9,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot to D forming a left L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 10,
			t: "Right Walking Stance · Upper Elbow Strike",
			s: "Gunnun So Wi Palkup Bandae Taerigi",
			d: "Execute a left upper elbow strike while forming a right walking stance toward D, slipping the right foot to D.",
		},
		{
			n: 11,
			t: "Left Walking Stance · High Vertical Punch",
			s: "Gunnun So Sang Joomuk Nopunde Sewo Jirugi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a high vertical punch to D with a twin fist.",
		},
		{
			n: 12,
			t: "Right Walking Stance · Upset Punch",
			s: "Gunnun So Sang Joomuk Dwijibo Jirugi",
			d: "Move the right foot to D forming a right walking stance toward D while executing an upset punch to D with a twin fist.",
		},
		{
			n: 13,
			t: "Left Walking Stance · Rising Block",
			s: "Gunnun So Kyocha Joomuk Chookyo Makgi",
			d: "Move the right foot on line CD and then turn counter clockwise to form a left walking stance toward C while executing a rising block with an X-fist.",
		},
		{
			n: 14,
			t: "Right L-Stance · High Side Strike",
			s: "Niunja So Dung Joomuk Nopunde Yop Taerigi",
			d: "Move the left foot to E forming a right L-stance toward E while executing a high side strike to E with the left back fist.",
		},
		{
			n: 15,
			t: "Left Walking Stance · Release Motion",
			s: "Gunnun So Jappyosul Tae",
			d: "Twist the left fist counter clockwise until the back fist faces downward, at the same time forming a left walking stance toward E, slipping the left foot to E.",
		},
		{
			n: 16,
			t: "Left Walking Stance · High Punch",
			s: "Gunnun So Nopunde Bandae Jirugi",
			d: "Execute a high punch to E with the right fist while maintaining a left walking stance toward E.\n\nPerform 15 and 16 in a fast motion.",
		},
		{
			n: 17,
			t: "Left L-Stance · High Side Strike",
			s: "Niunja So Dung Joomuk Nopunde Yop Taerigi",
			d: "Bring the left foot to the right foot and then move the right foot to F, forming a left L-stance toward F while executing a high side strike to F with a right back fist.",
		},
		{
			n: 18,
			t: "Right Walking Stance · Release Motion",
			s: "Gunnun So Jappyosul Tae",
			d: "Twist the right fist clockwise until the back fist faces downward, at the same time forming a right walking stance toward F, slipping the right foot to F.",
		},
		{
			n: 19,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Nopunde Bandae Jirugi",
			d: "Execute a high punch to F with the left fist while maintaining a right walking stance toward F.\n\nPerform 18 and 19 in a fast motion.",
		},
		{
			n: 20,
			t: "Left Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Bring the right foot to the left foot and then move the left foot to C forming a left walking stance toward C while executing a high block to C with a left double forearm.",
		},
		{
			n: 21,
			t: "Right L-Stance · Middle Punch",
			s: "Niunja So Kaunde Yop Jirugi",
			d: "Execute a middle punch to C with the left fist while forming a right L-stance toward C, pulling the left foot.",
		},
		{
			n: 22,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the right foot.",
		},
		{
			n: 23,
			t: "Right Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Lower the right foot to C forming a right walking stance toward C while executing a high block to C with the right double forearm.",
		},
		{
			n: 24,
			t: "Left L-Stance · Middle Punch",
			s: "Niunja So Kaunde Yop Jirugi",
			d: "Execute a middle punch to C with the right fist while forming a left L-stance toward C, pulling the right foot.",
		},
		{
			n: 25,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the left foot.",
		},
		{
			n: 26,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Lower the left foot to C forming a right L-stance toward C while executing a middle guarding block to C with the forearm.",
		},
		{
			n: 27,
			t: "Left Low Stance · Pressing Block",
			s: "Nachuo So Sonbadak Bandae Noollo Makgi",
			d: "Execute a pressing block with the right palm while forming a left low stance toward C, slipping the left foot to C.\n\nPerform in slow motion.",
		},
		{
			n: 28,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the right foot to C forming a left L-stance toward C while executing a middle guarding block to C with the forearm.",
		},
		{
			n: 29,
			t: "Right Low Stance · Pressing Block",
			s: "Nachuo So Sonbadak Bandae Noollo Makgi",
			d: "Execute a pressing block with the left palm while forming a right low stance toward C, slipping the right foot to C.\n\nPerform in a slow motion.",
		},
		{
			n: 30,
			t: "Close Stance · Angle Punch",
			s: "Moa So Orun Giokja Jirugi",
			d: "Bring the left foot to the right foot forming a close stance toward A while executing an angle punch with the right fist.\n\nPerform in slow motion.",
		},
		{
			n: 31,
			t: "Right Fixed Stance · U-Shape Block",
			s: "Gojung So Digutja Makgi",
			d: "Move the right foot to A forming a right fixed stance toward A while executing a U-shape block to A.",
		},
		{
			n: 32,
			t: "Left Fixed Stance · U-Shape Block",
			s: "Gojung So Digutja Makgi",
			d: "Bring the right foot to the left foot and then move the left foot to B forming a left fixed stance toward B, at the same time executing a U-shape block to B.\n\nEnd: Bring the left foot back to a ready posture.",
		},
	],
	"Toi-Gye": [
		{
			n: 1,
			t: "Right L-Stance · Middle Block",
			s: "Niunja So Anpalmok Kaunde Makgi",
			d: "Move the left foot to B forming a right L-stance toward B while executing a middle block to B with the left inner forearm.",
		},
		{
			n: 2,
			t: "Left Walking Stance · Low Thrust",
			s: "Gunnun So Dwijibun Sonkut Najunde Tulgi",
			d: "Execute a low thrust to B with the right upset finger tip while forming a left walking stance toward B, slipping the left foot to B.",
		},
		{
			n: 3,
			t: "Close Stance · Side Back Strike",
			s: "Moa So Orun Dung Joomuk Yopdwi Taerigi",
			d: "Bring the left foot to the right foot to form a close stance toward D while executing a side back strike to C with the right back fist, extending the left arm to the side downward.\n\nPerform in slow motion.",
		},
		{
			n: 4,
			t: "Left L-Stance · Middle Block",
			s: "Niunja So Anpalmok Kaunde Makgi",
			d: "Move the right foot to A forming a left L-stance toward A while executing a middle block to A with the right inner forearm.",
		},
		{
			n: 5,
			t: "Right Walking Stance · Low Thrust",
			s: "Gunnun So Dwijibun Sonkut Najunde Tulgi",
			d: "Execute a low thrust to A with the left upset finger tip while forming a right walking stance toward A, slipping the right foot to A.",
		},
		{
			n: 6,
			t: "Close Stance · Side Back Strike",
			s: "Moa So Wen Dung Joomuk Yopdwi Taerigi",
			d: "Bring the right foot to the left foot to form a close stance toward D while executing a side back strike to C with the left back fist, extending the right arm to the side downward.\n\nPerform in slow motion.",
		},
		{
			n: 7,
			t: "Left Walking Stance · Pressing Block",
			s: "Gunnun So Kyocha Joomuk Noollo Makgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a pressing block with an X-fist.",
		},
		{
			n: 8,
			t: "Left Walking Stance · High Vertical Punch",
			s: "Gunnun So Sang Joomuk Nopunde Sewo Jirugi",
			d: "Execute a high vertical punch to D with a twin fist while maintaining a left walking stance toward D.\n\nPerform 7 and 8 in a continuous motion.",
		},
		{
			n: 9,
			t: "Middle Front Snap Kick",
			s: "Kaunde Apcha Busigi",
			d: "Execute a middle front snap kick to D with the right foot, keeping the position of the hands as they were in 8.",
		},
		{
			n: 10,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Lower the right foot to D forming a right walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 11,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to D with the left fist while maintaining a right walking stance toward D.",
		},
		{
			n: 12,
			t: "Close Stance · Twin Side Elbow Thrust",
			s: "Moa So Sang Yop Palkup Tulgi",
			d: "Bring the left foot to the right foot forming a close stance toward F while executing a twin side elbow thrust.\n\nPerform in slow motion.",
		},
		{
			n: 13,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Bakat Palmok San Makgi",
			d: "Move the right foot to F in a stamping motion forming a sitting stance toward C while executing a W-shape block to C with the right outer forearm.",
		},
		{
			n: 14,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Bakat Palmok San Makgi",
			d: "Move the left foot to F in a stamping motion turning clockwise to form a sitting stance toward D while executing a W-shape block to D with the left outer forearm.",
		},
		{
			n: 15,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Bakat Palmok San Makgi",
			d: "Move the left foot to E in a stamping motion turning clockwise to form a sitting stance toward C while executing a W-shape block to C with the left outer forearm.",
		},
		{
			n: 16,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Bakat Palmok San Makgi",
			d: "Move the right foot to E in a stamping motion turning counter clockwise to form a sitting stance toward D while executing a W-shape block to D with the right outer forearm.",
		},
		{
			n: 17,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Bakat Palmok San Makgi",
			d: "Move the left foot to E in a stamping motion turning clockwise to form a sitting stance toward C while executing a W-shape block to C with the left outer forearm.",
		},
		{
			n: 18,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Bakat Palmok San Makgi",
			d: "Move the left foot to F in a stamping motion turning clockwise to form a sitting stance toward D while executing a W-shape block to D with the left outer forearm.",
		},
		{
			n: 19,
			t: "Right L-Stance · Low Pushing Block",
			s: "Niunja So Doo Palmok Najunde Miro Makgi",
			d: "Bring the right foot to the left foot and then move the left foot to D forming a right L-stance toward D while executing a low pushing block to D with the left double forearm.",
		},
		{
			n: 20,
			t: "Left Walking Stance · Grab Motion",
			s: "Gunnun Sogi",
			d: "Extend both hands upward as if to grab the opponent’s head while forming a left walking stance toward D, slipping the left foot to D.",
		},
		{
			n: 21,
			t: "Upward Kick",
			s: "Moorup Ollyo Chagi",
			d: "Execute an upward kick with the right knee while pulling both hands downward.",
		},
		{
			n: 22,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Lower the right foot to the left foot and then move the left foot to C forming a right L-stance toward C while executing a middle guarding block to C with a knife-hand.",
		},
		{
			n: 23,
			t: "Low Side Front Snap Kick",
			s: "Najunde Yobap Cha Busigi",
			d: "Execute a low side front snap kick to C with the left foot, keeping the position of the hands as they were in 22.",
		},
		{
			n: 24,
			t: "Left Walking Stance · High Thrust",
			s: "Gunnun So Opun Sonkut Nopunde Tulgi",
			d: "Lower the left foot to C forming a left walking stance toward C while executing a high thrust to C with the left flat finger tip.",
		},
		{
			n: 25,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot to C forming a left L-stance toward C while executing a middle guarding block to C with a knife-hand.",
		},
		{
			n: 26,
			t: "Low Side Front Snap Kick",
			s: "Najunde Yobap Cha Busigi",
			d: "Execute a low side front snap kick to C with the right foot, keeping the position of the hands as they were in 25.",
		},
		{
			n: 27,
			t: "Right Walking Stance · High Thrust",
			s: "Gunnun So Opun Sonkut Nopunde Tulgi",
			d: "Lower the right foot to C forming a right walking stance toward C while executing a high thrust to C with the right flat finger tip.",
		},
		{
			n: 28,
			t: "Right L-Stance · Side Back Strike and Low Block",
			s: "Niunja So Dung Joomuk Baro Yopdwi Taerigi Wa Palmok Najunde Bandae Makgi",
			d: "Move the right foot to D forming a right L-stance toward C while executing a side back strike to D with the right back fist and a low block to C with the left forearm.",
		},
		{
			n: 29,
			t: "Right X-Stance · Pressing Block",
			s: "Twigi, Orun Kyocha So Kyocha Joomuk Noollo Makgi",
			d: "Jump to C forming a right X-stance toward A while executing a pressing block with an X-fist.",
		},
		{
			n: 30,
			t: "Right Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Move the right foot to C forming a right walking stance toward C while executing a high block to C with the right double forearm.",
		},
		{
			n: 31,
			t: "Right L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Najunde Daebi Makgi",
			d: "Move the left foot to B forming a right L-stance toward B while executing a low guarding block to B with a knife-hand.",
		},
		{
			n: 32,
			t: "Left Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to BD with the right inner forearm while forming a left walking stance toward B, slipping the left foot to B.",
		},
		{
			n: 33,
			t: "Left L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Najunde Daebi Makgi",
			d: "Bring the left foot to the right foot and then move the right foot to A forming a left L-stance toward A, at the same time executing a low guarding block to A with a knife-hand.",
		},
		{
			n: 34,
			t: "Right Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to AD with the left inner forearm while forming a right walking stance toward A, slipping the right foot to A.",
		},
		{
			n: 35,
			t: "Left Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to CE with the right inner forearm while forming a left walking stance toward CE.",
		},
		{
			n: 36,
			t: "Right Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to AD with the left inner forearm while forming a right walking stance toward A.",
		},
		{
			n: 37,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Jirugi",
			d: "Move the right foot on line AB to form a sitting stance toward D while executing a middle punch to D with the right fist.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Hwa-Rang": [
		{
			n: 1,
			t: "Sitting Stance · Middle Pushing Block",
			s: "Annun So Wen Sonbadak Kaunde Yobap Miro Makgi",
			d: "Move the left foot to B to form a sitting stance toward D while executing a middle pushing block to D with the left palm.",
		},
		{
			n: 2,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Ap Jirugi",
			d: "Execute a middle punch to D with the right fist while maintaining a sitting stance toward D.",
		},
		{
			n: 3,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Ap Jirugi",
			d: "Execute a middle punch to D with the left fist while maintaining a sitting stance toward D.",
		},
		{
			n: 4,
			t: "Left L-Stance · Twin Forearm Block",
			s: "Niunja So Sang Palmok Makgi",
			d: "Execute a twin forearm block while forming a left L-stance toward A, pivoting with the left foot.",
		},
		{
			n: 5,
			t: "Left L-Stance · Upward Punch",
			s: "Niunja So Baro Ollyo Jirugi",
			d: "Execute an upward punch with the left fist while pulling the right side fist in front of the left shoulder, maintaining a left L-stance toward A.",
		},
		{
			n: 6,
			t: "Right Fixed Stance · Middle Punch",
			s: "Gojung So Kaunde Yop Jirugi",
			d: "Execute a middle punch to A with the right fist while forming a right fixed stance toward A in a sliding motion.",
		},
		{
			n: 7,
			t: "Left Vertical Stance · Downward Strike",
			s: "Soojik So Sonkal Bandae Naeryo Taerigi",
			d: "Execute a downward strike with the right knife-hand while forming a left vertical stance toward A, pulling the right foot.",
		},
		{
			n: 8,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the left foot to A forming a left walking stance toward A while executing a middle punch to A with the left fist.",
		},
		{
			n: 9,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a low block to D with the left forearm.",
		},
		{
			n: 10,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 11,
			t: "Preparation",
			s: "",
			d: "Pull the left foot toward the right foot while bringing the left palm to the right forefist, at the same time bending the right elbow about 45 degrees outward.",
		},
		{
			n: 12,
			t: "Middle Side Piercing Kick and Middle Outward Strike",
			s: "Kaunde Yopcha Jirugi, Niunja So Sonkal Kaunde Bakuro Taerigi",
			d: "Execute a middle side piercing kick to D with the right foot while pulling both hands in the opposite direction and then lower it to D forming a left L-stance toward D, at the same time executing a middle outward strike to D with the right knife-hand.",
		},
		{
			n: 13,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a middle punch to D with the left fist.",
		},
		{
			n: 14,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to D forming a right walking stance toward D at the same time executing a middle punch to D with the right fist.",
		},
		{
			n: 15,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to E turning counter clockwise to form a right L-stance toward E while executing a middle guarding block to E with a knife-hand.",
		},
		{
			n: 16,
			t: "Right Walking Stance · Middle Thrust",
			s: "Gunnun So Sun Sonkut Kaunde Tulgi",
			d: "Move the right foot to E forming a right walking stance toward E while executing a middle thrust to E with the right straight finger tip.",
		},
		{
			n: 17,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot on line EF forming a right L-stance toward F while executing a middle guarding block to F with a knife-hand.",
		},
		{
			n: 18,
			t: "High Turning Kick",
			s: "Nopunde Dollyo Chagi",
			d: "Execute a high turning kick to DF with the right foot and then lower it to F.",
		},
		{
			n: 19,
			t: "High Turning Kick and Middle Guarding Block",
			s: "Nopunde Dollyo Chagi, Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Execute a high turning kick to CF with the left foot and then lower it to F forming a right L-stance toward F while executing a middle guarding block to F with a knife-hand.\n\nPerform 18 and 19 in a fast motion.",
		},
		{
			n: 20,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Move the left foot to C forming a left walking stance toward C while executing a low block to C with the left forearm.",
		},
		{
			n: 21,
			t: "Right L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Execute a middle punch to C with the right fist while forming a right L-stance toward C, pulling the left foot.",
		},
		{
			n: 22,
			t: "Left L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Move the right foot to C forming a left L-stance toward C while executing a middle punch to C with the left fist.",
		},
		{
			n: 23,
			t: "Right L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Move the left foot to C forming a right L-stance toward C while executing a middle punch to C with the right fist.",
		},
		{
			n: 24,
			t: "Left Walking Stance · Pressing Block",
			s: "Gunnun So Kyocha Joomuk Noollo Makgi",
			d: "Execute a pressing block with an X-fist while forming a left walking stance toward C, slipping the left foot to C.",
		},
		{
			n: 25,
			t: "Right L-Stance · Side Elbow Thrust",
			s: "Niunja So Yop Palkup Tulgi",
			d: "Move the right foot to C in a sliding motion forming a right L-stance toward D while thrusting to C with the right side elbow.",
		},
		{
			n: 26,
			t: "Close Stance · Side Front Block",
			s: "Moa So Orun Anpalmok Yobap Makgi",
			d: "Bring the left foot to the right foot, turning counter clockwise to form a close stance toward B while executing a side front block with the right inner forearm while extending the left forearm to the side downward.",
		},
		{
			n: 27,
			t: "Close Stance · Side Front Block",
			s: "Moa So Wen Anpalmok Yobap Makgi",
			d: "Execute a side front block with the left inner forearm, extending the right forearm to the side downward while maintaining a close stance toward B.",
		},
		{
			n: 28,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to B forming a right L-stance toward B at the same time executing a middle guarding block to B with a knife-hand.",
		},
		{
			n: 29,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Bring the left foot to the right foot and then move the right foot to A forming a left L-stance toward A while executing a middle guarding block to A with a knife-hand.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Choong-Moo": [
		{
			n: 1,
			t: "Right L-Stance · Twin Knife-Hand Block",
			s: "Niunja So Sang Sonkal Makgi",
			d: "Move the left foot to B forming a right L-stance toward B while executing a twin knife-hand block.",
		},
		{
			n: 2,
			t: "Right Walking Stance · High Front Strike",
			s: "Gunnun So Sonkal Nopunde Ap Taerigi",
			d: "Move the right foot to B forming a right walking stance toward B while executing a high front strike to B with the right knife-hand and bring the left back hand in front of the forehead.",
		},
		{
			n: 3,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot to A turning clockwise to form a left L-stance toward A while executing a middle guarding block to A with a knife-hand.",
		},
		{
			n: 4,
			t: "Left Walking Stance · High Thrust",
			s: "Gunnun So Opun Sonkut Nopunde Tulgi",
			d: "Move the left foot to A forming a left walking stance toward A while executing a high thrust to A with the left flat finger tip.",
		},
		{
			n: 5,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to D forming a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 6,
			t: "Left Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn the face to C forming a left bending ready stance A toward C.",
		},
		{
			n: 7,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the right foot.",
		},
		{
			n: 8,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Lower the right foot to C forming a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 9,
			t: "Flying Side Piercing Kick and Middle Guarding Block",
			s: "Twimyo Yopcha Jirugi, Wen Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Execute a flying side piercing kick to D with the right foot soon after moving it to D and then land to D forming a left L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 10,
			t: "Right L-Stance · Low Block",
			s: "Niunja So Palmok Najunde Yop Makgi",
			d: "Move the left foot to E turning counter clockwise to form a right L-stance toward E at the same time executing a low block to E with the left forearm.",
		},
		{
			n: 11,
			t: "Left Walking Stance · Grab Motion",
			s: "",
			d: "Extend both hands upward as if to grab the opponent’s head while forming a left walking stance toward E, slipping the left foot.",
		},
		{
			n: 12,
			t: "Upward Kick",
			s: "Moorup Ollyo Chagi",
			d: "Execute an upward kick to E with the right knee pulling both hands downward.",
		},
		{
			n: 13,
			t: "Left Walking Stance · High Front Strike",
			s: "Gunnun So Sonkal Dung Nopunde Bandae Ap Taerigi",
			d: "Lower the right foot to the left foot and then move the left foot to F forming a left walking stance toward F while executing a high front strike to F with the right reverse knife-hand, bringing the left back hand under the right elbow joint.",
		},
		{
			n: 14,
			t: "High Turning Kick",
			s: "Nopunde Dollyo Chagi",
			d: "Execute a high turning kick to DF with the right foot and then lower it to the left foot.",
		},
		{
			n: 15,
			t: "Middle Back Piercing Kick",
			s: "Kaunde Dwitcha Jirugi",
			d: "Execute a middle back piercing kick to F with the left foot.\n\nPerform 14 and 15 in a fast motion.",
		},
		{
			n: 16,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Lower the left foot to F forming a left L-stance toward E while executing a middle guarding block to E with the forearm.",
		},
		{
			n: 17,
			t: "Middle Turning Kick",
			s: "Kaunde Dollyo Chagi",
			d: "Execute a middle turning kick to DE with the left foot.",
		},
		{
			n: 18,
			t: "Right Fixed Stance · U-Shape Block",
			s: "Gojung So Digutja Makgi",
			d: "Lower the left foot to the right foot and then move the right foot to C forming a right fixed stance toward C while executing a U-shape block toward C.",
		},
		{
			n: 19,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Twigi, Wen Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Jump and spin around counter clockwise, landing on the same spot to form a left L-stance toward C while executing a middle guarding block to C with a knife-hand.",
		},
		{
			n: 20,
			t: "Left Walking Stance · Low Thrust",
			s: "Gunnun So Dwijibun Sonkut Najunde Tulgi",
			d: "Move the left foot to C forming a left walking stance toward C at the same time executing a low thrust to C with the right upset fingertip.",
		},
		{
			n: 21,
			t: "Right L-Stance · Side Back Strike and Low Block",
			s: "Niunja So Dung Joomuk Baro Yopdwi Taerigi Wa Palmok Najunde Bandae Makgi",
			d: "Execute a side back strike to D with the right back fist and a low block to C with the left forearm while forming a right L-stance toward C, pulling the left foot.",
		},
		{
			n: 22,
			t: "Right Walking Stance · Middle Thrust",
			s: "Gunnun So Sun Sonkut Kaunde Tulgi",
			d: "Move the right foot to C forming a right walking stance toward C while executing a middle thrust to C with the right straight finger tip.",
		},
		{
			n: 23,
			t: "Left Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Move the left foot to B turning counter clockwise to form a left walking stance toward B while executing a high block to B with the left double forearm.",
		},
		{
			n: 24,
			t: "Sitting Stance · Middle Front Block and High Side Strike",
			s: "Annun So Orun Palmok Kaunde Ap Makgi, Orun Dung Joomuk Nopunde Yop Taerigi",
			d: "Move the right foot to B forming a sitting stance toward C while executing a middle front block to C with the right forearm and then a high side strike to B with the right back fist.",
		},
		{
			n: 25,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to A with the right foot turning counter clockwise and then lower it to A.",
		},
		{
			n: 26,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to A with the left foot turning clockwise.",
		},
		{
			n: 27,
			t: "Left L-Stance · Checking Block",
			s: "Niunja So Kyocha Sonkal Momchau Makgi",
			d: "Lower the left foot to A and then execute a checking block to B with an X-knife-hand while forming a left L-stance toward B pivoting with the left foot.",
		},
		{
			n: 28,
			t: "Left Walking Stance · Upward Block",
			s: "Gunnun So Sang Sonbadak Ollyo Makgi",
			d: "Move the left foot to B forming a left walking stance toward B while executing an upward block to B with a twin palm.",
		},
		{
			n: 29,
			t: "Right Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the left foot on line AB and then execute a rising block with the right forearm while forming a right walking stance toward A.",
		},
		{
			n: 30,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to A with the left fist while maintaining a right walking stance toward A.\n\nEnd: Bring the left foot back to a ready posture.",
		},
	],
	"Kwang-Gae": [
		{
			n: 1,
			t: "Close Ready Stance B · Circular Motion",
			d: "Bring the left foot to the right foot forming a close ready stance B toward D while bringing both hands in a circular motion.",
		},
		{
			n: 2,
			t: "Left Walking Stance · Upset Punch",
			d: "Move the left foot to D forming a left walking stance toward D while executing an upset punch to D with the right fist.\n\nPerform in slow motion.",
		},
		{
			n: 3,
			t: "Right Walking Stance · Upset Punch",
			d: "Move the right foot to D forming a right walking stance toward D while executing an upset punch to D with the left fist.\n\nPerform in slow motion.",
		},
		{
			n: 4,
			t: "Right Walking Stance · High Hooking Block",
			d: "Move the left foot to the side front of the right foot, then move the right foot to D forming a right walking stance toward D while executing a high hooking block with the right palm.\n\nPerform in a double stepping motion.",
		},
		{
			n: 5,
			t: "Right L-Stance · Low Guarding Block",
			d: "Move the right foot to C in a sliding motion forming a right L-stance toward D while executing a low guarding block with a knife-hand.",
		},
		{
			n: 6,
			t: "Left Walking Stance · High Hooking Block",
			d: "Move the right foot to the side front of the left foot, then move the left foot to D forming a left walking stance toward D while executing a high hooking block with the left palm.\n\nPerform in a double stepping motion.",
		},
		{
			n: 7,
			t: "Left L-Stance · Low Guarding Block",
			d: "Move the left foot to C in a sliding motion forming a left L-stance toward D while executing a low guarding block with a knife-hand.",
		},
		{
			n: 8,
			t: "Right Rear Foot Stance · High Guarding Block",
			d: "Move the left foot to D forming a right rear foot stance toward D while executing a high guarding block with a knife-hand.",
		},
		{
			n: 9,
			t: "Left Rear Foot Stance · High Guarding Block",
			d: "Move the right foot to D forming a left rear foot stance toward D while executing a high guarding block with a knife-hand.",
		},
		{
			n: 10,
			t: "Left Walking Stance · Upward Palm Block",
			d: "Move the left foot to the side front of the right foot, then turn counter-clockwise to form a left walking stance toward C while executing an upward block with the right palm.\n\nPerform in slow motion.",
		},
		{
			n: 11,
			t: "Right Walking Stance · Upward Palm Block",
			d: "Move the right foot to C forming a right walking stance toward C while executing an upward block with the left palm.\n\nPerform in slow motion.",
		},
		{
			n: 12,
			t: "Close Stance · Low Knife-Hand Block",
			d: "Execute a low front block with the right knife-hand in a circular motion striking the left palm while bringing the left foot to the right foot forming a close stance toward C.",
		},
		{
			n: 13,
			t: "Pressing Kick",
			d: "Execute a pressing kick to E with the left foot while keeping the position of the hands as in movement 12.",
		},
		{
			n: 14,
			t: "Side Piercing Kick",
			d: "Execute a middle side piercing kick to E with the left foot.\n\nPerform movements 13 and 14 consecutively.",
		},
		{
			n: 15,
			t: "Right L-Stance · High Inward Knife-Hand Strike",
			d: "Lower the left foot to E forming a right L-stance toward E while executing a high inward strike with the right knife-hand.",
		},
		{
			n: 16,
			t: "Close Stance · Downward Strike",
			d: "Execute a downward strike with the left side fist while forming a close stance toward C.",
		},
		{
			n: 17,
			t: "Pressing Kick",
			d: "Execute a pressing kick to F with the right foot while keeping the position of the hands as in movement 16.",
		},
		{
			n: 18,
			t: "Side Piercing Kick",
			d: "Execute a middle side piercing kick to F with the right foot.\n\nPerform movements 17 and 18 consecutively.",
		},
		{
			n: 19,
			t: "Left L-Stance · High Inward Knife-Hand Strike",
			d: "Lower the right foot to F forming a left L-stance toward F while executing a high inward strike with the knife-hand.",
		},
		{
			n: 20,
			t: "Close Stance · Downward Strike",
			d: "Execute a downward strike with the right side fist while forming a close stance toward C.",
		},
		{
			n: 21,
			t: "Left Low Stance · Pressing Block",
			d: "Move the left foot to C forming a left low stance toward C while executing a pressing block with the right palm.\n\nPerform in slow motion.",
		},
		{
			n: 22,
			t: "Right Low Stance · Pressing Block",
			d: "Move the right foot to C forming a right low stance toward C while executing a pressing block with the left palm.\n\nPerform in slow motion.",
		},
		{
			n: 23,
			t: "Sitting Stance · Back Fist Strike",
			d: "Move the right foot to D in a stamping motion forming a sitting stance toward F while executing a high side strike with the right back fist.",
		},
		{
			n: 24,
			t: "Right Walking Stance · Double Forearm Block",
			d: "Execute a middle block with the right double forearm while forming a right walking stance toward D.",
		},
		{
			n: 25,
			t: "Right Walking Stance · Low Reverse Block",
			d: "Execute a low reverse block with the left forearm while maintaining a right walking stance toward D.",
		},
		{
			n: 26,
			t: "Right Low Stance · Fingertip Thrust",
			d: "Execute a high thrust with the right flat fingertip while forming a right low stance toward D.\n\nPerform in slow motion.",
		},
		{
			n: 27,
			t: "Sitting Stance · Back Fist Strike",
			d: "Move the left foot on line CD in a stamping motion forming a sitting stance toward F while executing a high side strike with the left back fist.",
		},
		{
			n: 28,
			t: "Left Walking Stance · Double Forearm Block",
			d: "Execute a middle block with the left double forearm while forming a left walking stance toward C.",
		},
		{
			n: 29,
			t: "Left Walking Stance · Low Reverse Block",
			d: "Execute a low reverse block with the right forearm while maintaining a left walking stance toward C.",
		},
		{
			n: 30,
			t: "Left Low Stance · Fingertip Thrust",
			d: "Execute a high thrust with the left flat fingertip while forming a left low stance toward C.\n\nPerform in slow motion.",
		},
		{
			n: 31,
			t: "Right Walking Stance · Twin Vertical Punch",
			d: "Move the right foot to C forming a right walking stance toward C while executing a high vertical punch with twin fists.",
		},
		{
			n: 32,
			t: "Left Walking Stance · Twin Upset Punch",
			d: "Move the left foot to A forming a left walking stance toward A while executing an upset punch with twin fists.",
		},
		{
			n: 33,
			t: "Front Snap Kick",
			d: "Execute a middle front snap kick to A with the right foot.",
		},
		{
			n: 34,
			t: "Left L-Stance · Guarding Block",
			d: "Lower the right foot to the left foot, and then move the left foot to A to form a left L-stance toward B while executing a middle guarding block to B with a knife-hand.",
		},
		{
			n: 35,
			t: "Left Walking Stance · High Punch",
			d: "Move the left foot to B forming a left walking stance toward B while executing a high punch to B with the left fist.",
		},
		{
			n: 36,
			t: "Right Walking Stance · Twin Upset Punch",
			d: "Move the right foot to B in stamping motion, forming a right walking stance toward B while executing an upset punch to B with a twin fist.",
		},
		{
			n: 37,
			t: "Front Snap Kick",
			d: "Execute a middle front snap kick to B with the left foot, keeping the position of the hands as they were in 36.",
		},
		{
			n: 38,
			t: "Right L-Stance · Guarding Block",
			d: "Lower the left foot to the right foot, and then move the right foot to B to form a right L-stance toward A at the same time executing a middle guarding block to A with a knife-hand.",
		},
		{
			n: 39,
			t: "Right Walking Stance · High Punch",
			d: "Move the right foot to A, forming a right walking stance toward A while executing a high punch to A with the right fist.\n\nEnd: Bring the left foot back to a ready posture.",
		},
	],
	"Po-Eun": [
		{
			n: 1,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the left foot to B, forming a right L-stance toward B while executing a middle guarding block to B with the forearm.",
		},
		{
			n: 2,
			t: "Left One-Leg Stance",
			s: "Waebal Sogi",
			d: "Pull the right foot to the left knee joint to form a left one-leg stance toward D, at the same time lifting both fists while turning the face toward A.",
		},
		{
			n: 3,
			t: "Pressing Kick",
			s: "Bakuro Noollo Chagi",
			d: "Execute a pressing kick to A with the right foot keeping the position of the hands as they were in 2.",
		},
		{
			n: 4,
			t: "Sitting Stance · Middle Side Strike",
			s: "Annun So Orun Sonkal Kaunde Yop Taerigi",
			d: "Lower the right foot to A to form a sitting stance toward D while executing a middle side strike to A with the right knife-hand.",
		},
		{
			n: 5,
			t: "Sitting Stance · Angle Punch",
			s: "Annun So Wen Joomuk Giokja Jirugi",
			d: "Execute an angle punch with the left fist while maintaining a sitting stance toward D.",
		},
		{
			n: 6,
			t: "Sitting Stance · Pressing Block and Side Front Block",
			s: "Annun So Wen Ap Joomuk Noollo Makgi Wa Orun Anpalmok Yobap Makgi",
			d: "Execute a pressing block with the left forefist while executing a side front block with the right inner forearm, maintaining a sitting stance toward D.",
		},
		{
			n: 7,
			t: "Sitting Stance · Pressing Block and Side Front Block",
			s: "Annun So Orun Ap Joomuk Noollo Makgi Wa Wen Anpalmok Yobap Makgi",
			d: "Execute a pressing block with the right forefist and a side front block with the left inner forearm while maintaining a sitting stance toward D.",
		},
		{
			n: 8,
			t: "Sitting Stance · Middle Wedging Block",
			s: "Annun So Anpalmok Kaunde Hechyo Makgi",
			d: "Execute a middle wedging block with the inner forearm while maintaining a sitting stance toward D.",
		},
		{
			n: 9,
			t: "Sitting Stance · Back Elbow Thrust",
			s: "Annun So Orun Dwit Palkup Tulgi",
			d: "Thrust to C with the right back elbow supporting the right forefist with the left palm keeping the face as it was in 8 while maintaining a sitting stance toward D.",
		},
		{
			n: 10,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the right fist slipping the left palm up to the right elbow joint while maintaining a sitting stance toward D.",
		},
		{
			n: 11,
			t: "Sitting Stance · Back Elbow Thrust",
			s: "Annun So Wen Dwit Palkup Tulgi",
			d: "Thrust to C with the left back elbow supporting the left forefist with the right palm, keeping the face as it was in 10 while maintaining a sitting stance toward D.",
		},
		{
			n: 12,
			t: "Sitting Stance · Right Horizontal Punch",
			s: "Annun So Orun Soopyong Jirugi",
			d: "Execute a right horizontal punch to A while maintaining a sitting stance toward D.\n\nPerform 6 through 12 in a continuous motion.",
		},
		{
			n: 13,
			t: "Right X-Stance · Low Front Block",
			s: "Kyocha So Bakat Palmok Najunde Baro Ap Makgi",
			d: "Cross the left foot over the right foot forming a right X-stance toward D while executing a low front block to D with the right outer forearm and bringing the left finger belly on the right under forearm.",
		},
		{
			n: 14,
			t: "Left L-Stance · U-Shape Grasp",
			s: "Niunja So Digutja Japgi",
			d: "Move the right foot to A forming a left L-stance toward A at the same time executing a U-shape grasp to A.",
		},
		{
			n: 15,
			t: "Close Stance · Horizontal Twin Elbow Thrust",
			s: "Moa So Sang Palkup Soopyong Tulgi",
			d: "Bring the left foot to the right foot forming a close stance toward D while executing a horizontal thrust with a twin elbow, turning the face toward B.\n\nPerform in slow motion.",
		},
		{
			n: 16,
			t: "Sitting Stance · Side Back Strike",
			s: "Annun So Orun Dung Joomuk Yopdwi Taerigi",
			d: "Move the left foot to B to form a sitting stance toward D while executing a side back strike to C with the right back fist and extending the left arm to the side downward.",
		},
		{
			n: 17,
			t: "Left X-Stance · Low Front Block",
			s: "Kyocha So Bakat Palmok Najunde Baro Ap Makgi",
			d: "Cross the right foot over the left foot forming a left X-stance toward D while executing a low front block with the left outer forearm and bringing the right finger belly to the left side fist.",
		},
		{
			n: 18,
			t: "Sitting Stance · Low Guarding Block",
			s: "Annun So Sonkal Najunde B-Bang Daebi Makgi",
			d: "Move the left foot to B to form a sitting stance toward D while executing a low guarding block to B with a reverse knife-hand.",
		},
		{
			n: 19,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Execute a forearm middle guarding block to A while forming a left L-stance toward A pivoting with left foot.",
		},
		{
			n: 20,
			t: "Right One-Leg Stance",
			s: "Waebal Sogi",
			d: "Pull the left foot to the right knee joint to form a right one-leg stance toward D, at the same time lifting both fists while turning the face toward B.",
		},
		{
			n: 21,
			t: "Pressing Kick",
			s: "Bakuro Noollo Chagi",
			d: "Execute a pressing kick to B with the left foot keeping the position of the hands as they were in 20.",
		},
		{
			n: 22,
			t: "Sitting Stance · Middle Side Strike",
			s: "Annun So Wen Sonkal Kaunde Yop Taerigi",
			d: "Lower the left foot to B to form a sitting stance toward D while executing a middle side strike to B with the left knife-hand.",
		},
		{
			n: 23,
			t: "Sitting Stance · Angle Punch",
			s: "Annun So Orun Joomuk Giokja Jirugi",
			d: "Execute an angle punch with the right fist while maintaining a sitting stance toward D.",
		},
		{
			n: 24,
			t: "Sitting Stance · Pressing Block and Side Front Block",
			s: "Annun So Orun Ap Joomuk Noollo Makgi Wa Wen Anpalmok Yobap Makgi",
			d: "Execute a pressing block with the right forefist while executing a side front block with the left inner forearm, maintaining a sitting stance toward D.",
		},
		{
			n: 25,
			t: "Sitting Stance · Pressing Block and Side Front Block",
			s: "Annun So Wen Ap Joomuk Noollo Makgi Wa Orun Anpalmok Yobap Makgi",
			d: "Execute a pressing block with the left forefist and a side front block with the right inner forearm while maintaining a sitting stance toward D.",
		},
		{
			n: 26,
			t: "Sitting Stance · Middle Wedging Block",
			s: "Annun So Anpalmok Kaunde Hechyo Makgi",
			d: "Execute a middle wedging block with the inner forearm while maintaining a sitting stance toward D.",
		},
		{
			n: 27,
			t: "Sitting Stance · Back Elbow Thrust",
			s: "Annun So Wen Dwit Palkup Tulgi",
			d: "Thrust to C with the left back elbow supporting the left forefist with the right palm keeping the face as it was in 26 while maintaining a sitting stance toward D.",
		},
		{
			n: 28,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the left fist slipping the right palm up to the left elbow joint while maintaining a sitting stance toward D.",
		},
		{
			n: 29,
			t: "Sitting Stance · Back Elbow Thrust",
			s: "Annun So Orun Dwit Palkup Tulgi",
			d: "Thrust to C with the right back elbow supporting the right forefist with left palm, keeping the face as it was in 28 while maintaining a sitting stance toward D.",
		},
		{
			n: 30,
			t: "Sitting Stance · Left Horizontal Punch",
			s: "Annun So Left Soopyong Jirugi",
			d: "Execute a left horizontal punch to B while maintaining a sitting stance toward D.\n\nPerform 24 through 30 in a continuous motion.",
		},
		{
			n: 31,
			t: "Left X-Stance · Low Front Block",
			s: "Kyocha So Bakat Palmok Najunde Baro Ap Makgi",
			d: "Cross the right foot over the left foot forming a left X-stance toward D while executing a low front block to D with the left outer forearm and bringing the right finger belly on the left under forearm.",
		},
		{
			n: 32,
			t: "Right L-Stance · U-Shape Grasp",
			s: "Niunja So Digutja Japgi",
			d: "Move the left foot to B forming a right L-stance toward B at the same time executing a U-shape grasp to B.",
		},
		{
			n: 33,
			t: "Close Stance · Horizontal Twin Elbow Thrust",
			s: "Moa So Sang Palkup Soopyong Tulgi",
			d: "Bring the right foot to the left foot forming a close stance toward D while executing a horizontal thrust with a twin elbow, turning the face toward A.\n\nPerform in slow motion.",
		},
		{
			n: 34,
			t: "Sitting Stance · Side Back Strike",
			s: "Annun So Wen Dung Joomuk Yopdwi Taerigi",
			d: "Move the right foot to A to form a sitting stance toward D while executing a side back strike to C with the left back fist and extending the right arm to the side downward.",
		},
		{
			n: 35,
			t: "Right X-Stance · Low Front Block",
			s: "Kyocha So Bakat Palmok Najunde Baro Ap Makgi",
			d: "Cross the left foot over the right foot forming a right X-stance toward D while executing a low front block with the right outer forearm and bringing the left finger belly to the right side fist.",
		},
		{
			n: 36,
			t: "Sitting Stance · Low Guarding Block",
			s: "Annun So Sonkal Najunde A-Bang Daebi Makgi",
			d: "Move the right foot to A to form a sitting stance toward D while executing a low guarding block to A with a reverse knife-hand.\n\nEnd: Bring the left foot back to a ready posture.",
		},
	],
	"Ge-Baek": [
		{
			n: 1,
			t: "Right L-Stance · Checking Block",
			s: "Niunja So Kyocha Sonkal Momchau Makgi",
			d: "Move the right foot to C forming a right L-stance toward D while executing a checking block to D with an X-knife-hand.",
		},
		{
			n: 2,
			t: "Low Twisting Kick",
			s: "Najunde Bituro Chagi",
			d: "Execute a low twisting kick to D with the right foot keeping the position of the hands as they were in 1.",
		},
		{
			n: 3,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Lower the right foot to D forming a right walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 4,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to D with the left fist while maintaining a right walking stance toward D.\n\nPerform 3 and 4 in a fast motion.",
		},
		{
			n: 5,
			t: "Left Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the right foot to C forming a left walking stance toward D while executing a rising block with the left forearm.",
		},
		{
			n: 6,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Makgi",
			d: "Execute a low block to D with the left forearm while maintaining a left walking stance toward D.\n\nPerform 5 and 6 in a continuous motion.",
		},
		{
			n: 7,
			t: "Left Walking Stance · High Double Arc-Hand Block",
			s: "Gunnun So Nopunde Doo Bandalson Makgi",
			d: "Execute a high block to AD with a double arc-hand while looking through it maintaining a left walking stance toward D.",
		},
		{
			n: 8,
			t: "Right Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn the face toward D while forming a right bending ready stance A toward D.",
		},
		{
			n: 9,
			t: "Sitting Stance · Scooping Block",
			s: "Annun So Wen Sonbadak Duro Makgi",
			d: "Lower the left foot to AD to form a sitting stance toward AC while executing a scooping block to AC with the left palm.",
		},
		{
			n: 10,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to AC with the right fist while maintaining a sitting stance toward AC.\n\nPerform 9 and 10 in a connecting motion.",
		},
		{
			n: 11,
			t: "Sitting Stance · Front Strike",
			s: "Annun So Wen Dung Joomuk Ap Taerigi",
			d: "Execute a front strike to AC with the left back fist while maintaining a sitting stance toward AC.",
		},
		{
			n: 12,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot on line AB and then move the left foot to C forming a right L-stance toward C while executing a middle guarding block to C with a knife-hand.",
		},
		{
			n: 13,
			t: "Low Side Front Snap Kick",
			s: "Najunde Yobap Cha Busigi",
			d: "Execute a low side front snap kick to C with the left foot keeping the position of the hands as they were in 12.",
		},
		{
			n: 14,
			t: "Left Low Stance · High Thrust",
			s: "Nachuo So Opun Sonkut Nopunde Tulgi",
			d: "Lower the left foot to C forming a left low stance toward C while executing a high thrust to C with the left flat finger tip.",
		},
		{
			n: 15,
			t: "Left Low Stance · High Thrust",
			s: "Nachuo So Opun Sonkut Nopunde Bandae Tulgi",
			d: "Execute a high thrust to C with the right flat finger tip while maintaining a left low stance toward C.",
		},
		{
			n: 16,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the right foot while pulling both hands in the opposite direction.",
		},
		{
			n: 17,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Lower the right foot to C forming a right L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 18,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the right foot to D turning counter clockwise to form a right L-stance toward C while executing a middle guarding block to C with the forearm.",
		},
		{
			n: 19,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to D turning counter clockwise to form a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 20,
			t: "Sitting Stance · Right 9-Shape Block",
			s: "Annun So Orun Gutja Makgi",
			d: "Move the left foot on line CD to form a sitting stance toward A while executing a right 9-shape block.",
		},
		{
			n: 21,
			t: "Left Walking Stance · Low Knife-Hand Block",
			s: "Gunnun So Sonkal Najunde Makgi",
			d: "Move the right foot to D, turning counter-clockwise to form a left walking stance toward C while executing a low block to C with the left knife-hand.",
		},
		{
			n: 22,
			t: "Middle Turning Kick",
			s: "Kaunde Dollyo Chagi",
			d: "Execute a middle turning kick to BC with the right foot and then lower it to C.",
		},
		{
			n: 23,
			t: "Flying Side Piercing Kick",
			s: "Twimyo Yopcha Jirugi",
			d: "Execute a flying side piercing kick to C with the right foot.\n\nPerform 22 and 23 in a fast motion.",
		},
		{
			n: 24,
			t: "Right Walking Stance · High Vertical Punch",
			s: "Gunnun So Sang Joomuk Nopunde Sewo Jirugi",
			d: "Land to C to form a right walking stance toward C while executing a high vertical punch to C with a twin fist.",
		},
		{
			n: 25,
			t: "Right Walking Stance · High Double Arc-Hand Block",
			s: "Gunnun So Nopunde Doo Bandalson Makgi",
			d: "Execute a high block to AC with a double arc-hand while looking through it maintaining a right walking stance toward C.",
		},
		{
			n: 26,
			t: "Right Walking Stance · Upset Punch",
			s: "Gunnun So Bandae Dwijibo Jirugi",
			d: "Execute an upset punch to C with the left fist while maintaining a right walking stance toward C.",
		},
		{
			n: 27,
			t: "Left Walking Stance · Front Elbow Strike",
			s: "Gunnun So Ap Palkup Bandae Taerigi",
			d: "Move the right foot on line CD, forming a left walking stance toward D while striking the left palm with the right front elbow.",
		},
		{
			n: 28,
			t: "Right X-Stance · High Block",
			s: "Twigi, Orun Kyocha So Doo Palmok Nopunde Makgi",
			d: "Jump to D, forming a right X-stance toward BD while executing a high block to D with the right double forearm.",
		},
		{
			n: 29,
			t: "Sitting Stance · Scooping Block",
			s: "Annun So Orun Sonbadak Duro Makgi",
			d: "Move the left foot to BC to form a sitting stance toward BD, at the same time executing a scooping block to BD with the right palm.",
		},
		{
			n: 30,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Ap Jirugi",
			d: "Execute a middle punch to BD with the left fist while maintaining a sitting stance toward BD.\n\nPerform 29 and 30 in a connecting motion.",
		},
		{
			n: 31,
			t: "Sitting Stance · Front Strike",
			s: "Annun So Orun Dung Joomuk Ap Taerigi",
			d: "Execute a front strike to BD with the right back fist while maintaining a sitting stance toward BD.",
		},
		{
			n: 32,
			t: "Left Walking Stance · High Front Strike",
			s: "Gunnun So Sonkal Dung Nopunde Bandae Ap Taerigi",
			d: "Move the left foot to C, forming a left walking stance toward C, at the same time executing a high front strike to C with the right reverse knife-hand.",
		},
		{
			n: 33,
			t: "Middle Turning Kick",
			s: "Kaunde Dollyo Chagi",
			d: "Move the left foot to A about half a shoulder width while executing a middle turning kick to C with the right foot.",
		},
		{
			n: 34,
			t: "Left Walking Stance · High Vertical Punch",
			s: "Gunnun So Sang Joomuk Nopunde Sewo Jirugi",
			d: "Lower the right foot to C, and then turn counter-clockwise to form a left walking stance toward D, pivoting with the right foot while executing a high vertical punch to D with a twin fist.",
		},
		{
			n: 35,
			t: "Right L-Stance · Middle Middle-Knuckle Punch",
			s: "Niunja So Joongji Joomuk Kaunde Baro Jirugi",
			d: "Execute a middle punch to D with the right middle knuckle fist, bringing the left side fist in front of the right shoulder while forming a right L-stance toward D pulling the left foot.",
		},
		{
			n: 36,
			t: "Sitting Stance · Left 9-Shape Block",
			s: "Annun So Wen Gutja Makgi",
			d: "Move the right foot to D to form a sitting stance toward B, at the same time executing a left 9-shape block.",
		},
		{
			n: 37,
			t: "Sitting Stance · Low Guarding Block",
			s: "Annun So Sonkal Dung Najunde C-Bang Daebi Makgi",
			d: "Execute a low guarding block to C with a reverse knife-hand while maintaining a sitting stance toward B.",
		},
		{
			n: 38,
			t: "Sitting Stance · Low Guarding Block",
			s: "Annun So Sonkal Najunde D-Bang Daebi Makgi",
			d: "Execute a low guarding block to D with a knife-hand while maintaining a sitting stance toward B.\n\nPerform 37 and 38 in a continuous motion.",
		},
		{
			n: 39,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Wen Bakat Palmok San Makgi",
			d: "Move the left foot to D in a stamping motion to form a sitting stance toward A while executing a W-shape block with the outer forearm.",
		},
		{
			n: 40,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Wen Bakat Palmok San Makgi",
			d: "Move the left foot to C in a stamping motion to form a sitting stance toward B while executing a W-shape block with the outer forearm.",
		},
		{
			n: 41,
			t: "Right Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the right foot to C forming a right walking stance toward C while executing a rising block with the right forearm.",
		},
		{
			n: 42,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to C with the left fist while maintaining a right walking stance toward C.",
		},
		{
			n: 43,
			t: "Left Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the right foot on line CD forming a left walking stance toward D while executing a rising block with the left forearm.",
		},
		{
			n: 44,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to D with the right fist while maintaining a left walking stance toward D.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Eui-Am": [
		{
			n: 1,
			t: "Left Walking Stance · Low Inward Block",
			s: "Gunnun So Sonkal Najunde Bandae Anuro Makgi",
			d: "Move the right foot to C forming a left walking stance toward D while executing a low inward block to D with the right knife-hand.",
		},
		{
			n: 2,
			t: "Right Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Bandae Yop Makgi",
			d: "Move the left foot to C forming a right walking stance toward D while executing a high side block to D with the left outer forearm.",
		},
		{
			n: 3,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Execute a middle punch to D with the right fist while maintaining a right walking stance toward D.",
		},
		{
			n: 4,
			t: "Low Twisting Kick",
			s: "Najunde Bituro Chagi",
			d: "Execute a low twisting kick to D with the left foot keeping the position of the hands as they were in 3.",
		},
		{
			n: 5,
			t: "Left Walking Stance · Downward X-Fist Block",
			s: "Gunnun So Kyocha Joomuk Naeryo Makgi",
			d: "Lower the left foot to D forming a left walking stance toward D while executing a downward block with an x-fist.",
		},
		{
			n: 6,
			t: "Left Walking Stance · Rising Knife-Hand Block",
			s: "Gunnun So Sonkal Bandae Chookyo Makgi",
			d: "Execute a rising block with the right knife-hand, maintaining a left walking stance toward D.\n\nPerform 5 and 6 in a continuous motion.",
		},
		{
			n: 7,
			t: "Right X-Stance · High Side Strike",
			s: "Twigi, Orun Kyocha So Dung Joomuk Nopunde Yop Taerigi",
			d: "Jump to D, forming a right X-stance toward BD while executing a high side strike to D with the right back fist bringing the left finger belly to the right side fist.",
		},
		{
			n: 8,
			t: "Right L-Stance · Middle Punch",
			s: "Niunja So Kaunde Yop Jirugi",
			d: "Move the left foot to C forming a right L-stance toward C while executing a middle punch to C with the left fist.",
		},
		{
			n: 9,
			t: "Reverse Turning Kick",
			s: "Kaunde Bandae Dollyo Chagi",
			d: "Execute a middle reverse turning kick to AC with the right foot.",
		},
		{
			n: 10,
			t: "Sitting Stance · Middle Side Strike",
			s: "Annun So Orun Sonkal Kaunde Yop Taerigi",
			d: "Lower the right foot to C in a stamping motion to form a sitting stance toward A while executing a middle side strike to C with the right knife-hand.",
		},
		{
			n: 11,
			t: "Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the left foot while turning clockwise pulling both hands in the opposite direction.",
		},
		{
			n: 12,
			t: "Left Walking Stance · High Crescent Punch",
			s: "Gunnun So Nopunde Bandae Bandal Jirugi",
			d: "Lower the left foot to C forming a left walking stance toward C while executing a high crescent punch with the right fist.",
		},
		{
			n: 13,
			t: "Parallel Stance · Turning Punch",
			s: "Narani So Wen Joomuk Kaunde Dollyo Jirugi",
			d: "Execute a middle turning punch with the left fist while forming a parallel stance toward C pulling the right foot.\n\nPerform in slow motion.",
		},

		{
			n: 14,
			t: "Right Walking Stance · Low Inward Block",
			s: "Gunnun So Sonkal Najunde Bandae Anuro Makgi",
			d: "Move the left foot to D forming a right walking stance toward C while executing a low inward block with the left knife-hand.",
		},
		{
			n: 15,
			t: "Left Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Bandae Yop Makgi",
			d: "Move the right foot to D forming a left walking stance toward C while executing a high side block to C with the right outer forearm.",
		},
		{
			n: 16,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Execute a middle punch to C with the left fist while maintaining a left walking stance toward C.",
		},
		{
			n: 17,
			t: "Low Twisting Kick",
			s: "Najunde Bituro Chagi",
			d: "Execute a low twisting kick to C with the right foot, keeping the position of the hands as they were in 16.",
		},
		{
			n: 18,
			t: "Right Walking Stance · Downward X-Fist Block",
			s: "Gunnun So Kyocha Joomuk Naeryo Makgi",
			d: "Lower the right foot to C forming a right walking stance toward C while executing a downward block with an x-fist.",
		},
		{
			n: 19,
			t: "Right Walking Stance · Rising Knife-Hand Block",
			s: "Gunnun So Sonkal Bandae Chookyo Makgi",
			d: "Execute a rising block with the left knife-hand while maintaining a right walking stance toward C.\n\nPerform 18 and 19 in a continuous motion.",
		},

		{
			n: 20,
			t: "Left X-Stance · High Side Strike",
			s: "Twigi, Wen Kyocha So Dung Joomuk Nopunde Yop Taerigi",
			d: "Jump to C forming a left X-stance toward BC while executing a high side strike to C with the left back fist and bringing the right finger belly to the left side fist.",
		},
		{
			n: 21,
			t: "Left L-Stance · Middle Punch",
			s: "Niunja So Kaunde Yop Jirugi",
			d: "Move the right foot to D, forming a left L-stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 22,
			t: "Reverse Turning Kick",
			s: "Kaunde Bandae Dollyo Chagi",
			d: "Execute a middle reverse turning kick to AD with the left foot.",
		},
		{
			n: 23,
			t: "Sitting Stance · Middle Side Strike",
			s: "Annun So Wen Sonkal Kaunde Yop Taerigi",
			d: "Lower the left foot to D in a stamping motion to form a sitting stance toward A at the same time executing a middle side strike to D with a left knife-hand.",
		},
		{
			n: 24,
			t: "Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to D with the right foot while turning counter-clockwise pulling both hands in the opposite direction.",
		},
		{
			n: 25,
			t: "Right Walking Stance · High Crescent Punch",
			s: "Gunnun So Nopunde Bandae Bandal Jirugi",
			d: "Lower the right foot to D forming a right walking stance toward D while executing a high crescent punch with the left fist.",
		},
		{
			n: 26,
			t: "Parallel Stance · Turning Punch",
			s: "Narani So Orun Joomuk Kaunde Dollyo Jirugi",
			d: "Execute a middle turning punch with the right fist while forming a parallel stance toward D pulling the left foot.\n\nPerform in slow motion.",
		},

		{
			n: 27,
			t: "Right Walking Stance · Wedging Block",
			s: "Gunnun So Sonkal Kaunde Hechyo Makgi",
			d: "Move the right foot to D forming a right walking stance toward D at the same time executing a middle wedging block with a knife-hand.",
		},
		{
			n: 28,
			t: "Right Walking Stance · Circular Block",
			s: "Gunnun So Sonkal Dung Dollimyo Makgi",
			d: "Execute a circular block to BD with the left reverse knife-hand while maintaining a right walking stance toward D.",
		},
		{
			n: 29,
			t: "Rear Foot Stance · Downward Block",
			s: "Dwitbal So Euhkallin Sonbadak Naeryo Makgi",
			d: "Execute a downward block with an alternate palm while forming a left rear foot stance toward D pulling the right foot.",
		},
		{
			n: 30,
			t: "Left L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Execute a middle punch to D with the left fist while forming a left L-stance toward D slipping the right foot.",
		},
		{
			n: 31,
			t: "Left L-Stance · Low Inward Block",
			s: "Niunja So Sonkal Dung Najunde Bandae Anuro Makgi",
			d: "Execute a low inward block to D with the right reverse knife-hand while shifting to C maintaining a left L-stance toward D.",
		},

		{
			n: 32,
			t: "Left Walking Stance · Wedging Block",
			s: "Gunnun So Sonkal Kaunde Hechyo Makgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a middle wedging block with a knife-hand.",
		},
		{
			n: 33,
			t: "Left Walking Stance · Circular Block",
			s: "Gunnun So Sonkal Dung Dollimyo Makgi",
			d: "Execute a circular block to AD with the right reverse knife-hand while maintaining a left walking stance toward D.",
		},
		{
			n: 34,
			t: "Rear Foot Stance · Downward Block",
			s: "Dwitbal So Euhkallin Sonbadak Naeryo Makgi",
			d: "Execute a downward block with an alternate palm while forming a right rear foot stance toward D pulling left foot.",
		},
		{
			n: 35,
			t: "Right L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Execute a middle punch to D with the right fist while forming a right L-stance toward D slipping the left foot.",
		},
		{
			n: 36,
			t: "Right L-Stance · Low Inward Block",
			s: "Niunja So Sonkal Dung Najunde Bandae Anuro Makgi",
			d: "Execute a low inward block to D with the left reverse knife-hand while shifting to C maintaining a right L-stance toward D.",
		},

		{
			n: 37,
			t: "High Reverse Turning Kick",
			s: "Nopunde Bandae Dollyo Chagi",
			d: "Execute a high reverse turning kick to BD with the right foot.",
		},
		{
			n: 38,
			t: "Rear Foot Stance · Guarding Block",
			s: "Dwitbal So Palmok Kaunde Daebi Makgi",
			d: "Lower the right foot to D forming a left rear foot stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 39,
			t: "High Reverse Turning Kick",
			s: "Nopunde Bandae Dollyo Chagi",
			d: "Execute a high reverse turning kick to AD with the left foot.",
		},
		{
			n: 40,
			t: "Rear Foot Stance · Guarding Block",
			s: "Dwitbal So Palmok Kaunde Daebi Makgi",
			d: "Lower the left foot to D forming a right rear foot stance toward D while executing a middle guarding block to D with the forearm.",
		},

		{
			n: 41,
			t: "Right L-Stance · Low Outward Block",
			s: "Niunja So Sonkal Najunde Bandae Makgi",
			d: "Move the left foot to the side rear of the right foot and then the right foot to C forming a right L-stance toward D while executing a low outward block to D with the left knife-hand.",
		},
		{
			n: 42,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to D with the right fist while forming a left walking stance toward D slipping the right foot.",
		},
		{
			n: 43,
			t: "Left L-Stance · Low Block",
			s: "Niunja So Sonkal Najunde Bandae Makgi",
			d: "Move the left foot to C forming a left L-stance toward D while executing a low block to D with the right knife-hand.",
		},
		{
			n: 44,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to D with the left fist while forming a right walking stance toward D slipping the left foot.",
		},
		{
			n: 45,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Execute a high punch to D with the right fist while maintaining a right walking stance toward D.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Choong-Jang": [
		{
			n: 1,
			t: "Sitting Stance · Side Front Block",
			s: "Annun So Orun Anpalmok Yobap Makgi",
			d: "Move the right foot to A to form a sitting stance toward D while executing a side front block with the right inner forearm and extending the left forearm side-downward.",
		},
		{
			n: 2,
			t: "Sitting Stance · Side Front Block",
			s: "Annun So Wen Anpalmok Yobap Makgi",
			d: "Execute a side front block with the left inner forearm extending the right forearm side downward while maintaining a sitting stance toward D.",
		},
		{
			n: 3,
			t: "Close Stance · Angle Punch",
			s: "Moa So Wen Joomuk Giokja Jirugi",
			d: "Bring the right foot to the left foot forming a close stance toward D while executing an angle punch with the left fist.\n\nPerform in slow motion.",
		},
		{
			n: 4,
			t: "Left Walking Stance · High Double Finger Thrust",
			s: "Gunnun So Doo Songarak Nopunde Bandae Tulgi",
			d: "Move the left foot to D to form a left walking stance toward D while executing a high thrust to D with the right double finger.",
		},
		{
			n: 5,
			t: "Right Walking Stance · High Double Finger Thrust",
			s: "Gunnun So Doo Songarak Nopunde Bandae Tulgi",
			d: "Move the right foot to D to form a right walking stance toward D while executing a high thrust to D with the left double finger.",
		},
		{
			n: 6,
			t: "Right Walking Stance · Front Strike",
			s: "Gunnun So Dung Joomuk Ap Taerigi",
			d: "Execute a front strike to D with the right back fist while maintaining a right walking stance toward D.",
		},
		{
			n: 7,
			t: "Left Walking Stance · Rising Block",
			s: "Gunnun So Palmok Chookyo Makgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a rising block with the left forearm.",
		},
		{
			n: 8,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to D to form a right walking stance toward D at the same time executing a middle punch to D with the right fist.",
		},
		{
			n: 9,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the right foot to C turning counter clockwise and then slide to C to form a right L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 10,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to D with the right foot keeping the position of the hands as they were in 9.",
		},
		{
			n: 11,
			t: "Right Low Stance · High Thrust",
			s: "Nachuo So Opun Sonkut Nopunde Tulgi",
			d: "Lower the right foot to D forming a right low stance toward D while executing a high thrust to D with the right flat finger tip.",
		},
		{
			n: 12,
			t: "High Turning Kick",
			s: "Nopunde Dollyo Chagi",
			d: "Execute a high turning kick to D with the right foot supporting the body with both hands and the left knee.",
		},
		{
			n: 13,
			t: "High Punch",
			s: "Joomuk Nopunde Jirugi",
			d: "Lower the right foot to D and then execute a high punch to D with the right fist while pressing the ground with the left palm.",
		},
		{
			n: 14,
			t: "Left L-Stance · Side Elbow Thrust",
			s: "Niunja So Yop Palkup Tulgi",
			d: "Move the left foot to D turning clockwise to form a left L-stance toward C while thrusting to D with the left side elbow.",
		},
		{
			n: 15,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the left foot to C turning clockwise to form a left L-stance toward D at the same time executing a middle guarding block to D with the forearm.",
		},
		{
			n: 16,
			t: "Right L-Stance · Scooping Block",
			s: "Niunja So Sonbadak Bandae Duro Makgi",
			d: "Move the right foot to C forming a right L-stance toward D while executing a scooping block with the left palm.",
		},
		{
			n: 17,
			t: "Left L-Stance · Middle Outward Strike",
			s: "Niunja So Sonkal Kaunde Bakuro Taerigi",
			d: "Move the left foot to C forming a left L-stance toward D while executing a middle outward strike to D with the right knife-hand.",
		},
		{
			n: 18,
			t: "Left Walking Stance · Pressing Block",
			s: "Gunnun So Kyocha Joomuk Noollo Makgi",
			d: "Execute a pressing block with an X-fist while forming a left walking stance toward C pivoting with the right foot.",
		},
		{
			n: 19,
			t: "Low Front Snap Kick",
			s: "Moorup Najunde Apcha Busigi",
			d: "Execute a low front snap kick to C with the right knee while pulling both hands in the opposite direction as if grabbing the opponent’s leg.",
		},
		{
			n: 20,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Lower the right foot to C forming a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 21,
			t: "Right L-Stance · Side Elbow Thrust",
			s: "Niunja So Yop Palkup Tulgi",
			d: "Move the right foot to D in a sliding motion to form a right L-stance toward C while thrusting to D with the right side elbow.",
		},
		{
			n: 22,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Execute a middle guarding block to D with a knife-hand while forming a left L-stance toward D pivoting with the left foot.",
		},
		{
			n: 23,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to D with the right foot while pulling both hands in the opposite direction.",
		},
		{
			n: 24,
			t: "Right Rear Foot Stance · Pressing Block",
			s: "Dwitbal So Sang Sonbadak Noollo Makgi",
			d: "Lower the right foot to D and then execute a pressing block with a twin palm while forming a right rear foot stance toward C pivoting with the right foot.",
		},
		{
			n: 25,
			t: "Right Walking Stance · High Front Block and High Side Strike",
			s: "Gunnun So Bakat Palmok Nopunde Ap Makgi, Dung Joomuk Nopunde Yop Taerigi",
			d: "Move the right foot to C to form a right walking stance toward C while executing a high front block to C with the right outer forearm and then a high side strike to C with the right back fist, maintaining a right walking stance toward C.",
		},
		{
			n: 26,
			t: "Right L-Stance · High Thrust",
			s: "Niunja So Opun Sonkut Nopunde Bandae Tulgi",
			d: "Execute a high thrust to D with the left flat finger tip while forming a right L-stance toward D pivoting with the right foot.",
		},
		{
			n: 27,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to D with the right foot while bringing the right palm on the left back hand.",
		},
		{
			n: 28,
			t: "Left Walking Stance · Back Elbow Thrust",
			s: "Gunnun So Dwit Palkup Bandae Tulgi",
			d: "Lower the right foot to D to form a left walking stance toward C pivoting with the left foot while thrusting to D with the right back elbow, placing the left side fist on the right fist.\n\nPerform in slow motion.",
		},
		{
			n: 29,
			t: "Right L-Stance · Downward Strike",
			s: "Niunja So Sondung Bandae Naeryo Taerigi",
			d: "Execute a downward strike with the left back hand while forming a right L-stance toward C, pivoting with the right foot.\n\nPerform in a stamping motion.",
		},
		{
			n: 30,
			t: "Right L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Punch the left palm with the right fist while maintaining a right L-stance toward C.",
		},
		{
			n: 31,
			t: "Left L-Stance · Downward Strike",
			s: "Niunja So Sondung Bandae Naeryo Taerigi",
			d: "Move the right foot to C in a stamping motion to form a left L-stance toward C while executing a downward strike with the right back hand.",
		},
		{
			n: 32,
			t: "Left L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Punch the right palm with the left fist while maintaining a left L-stance toward C.",
		},
		{
			n: 33,
			t: "Right L-Stance · Middle Outward Strike",
			s: "Niunja So Sonkal Kaunde Bakuro Taerigi",
			d: "Execute a middle outward strike to D with the left knife-hand while forming a right L-stance toward D, pivoting with the right foot.\n\nPerform in a stamping motion.",
		},
		{
			n: 34,
			t: "Left Walking Stance · High Side Front Strike",
			s: "Gunnun So Dung Joomuk Nopunde Bandae Yobap Taerigi",
			d: "Execute a high side front strike to D with the right back fist striking the left palm with the right elbow while forming a left walking stance toward D, slipping the left foot.",
		},
		{
			n: 35,
			t: "Left L-Stance · Middle Outward Strike",
			s: "Niunja So Sonkal Kaunde Bakuro Taerigi",
			d: "Move the right foot to D forming a left L-stance toward D while executing a middle outward strike to D with the right knife-hand.\n\nPerform in a stamping motion.",
		},
		{
			n: 36,
			t: "Right Walking Stance · High Side Front Strike",
			s: "Gunnun So Dung Joomuk Nopunde Bandae Yobap Taerigi",
			d: "Execute a high side front strike to D with the left back fist striking the right palm with the left elbow while forming a right walking stance toward D, slipping the right foot.",
		},
		{
			n: 37,
			t: "Right L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Dung Najunde Daebi Makgi",
			d: "Execute a low guarding block to C with a reverse knife-hand while forming a right L-stance toward C pivoting with the right foot.",
		},
		{
			n: 38,
			t: "Left Walking Stance · Right 9-Shape Block",
			s: "Gunnun So Bandae Gutja Makgi",
			d: "Execute a right 9-shape block while forming a left walking stance toward C slipping the left foot.",
		},
		{
			n: 39,
			t: "Left L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Dung Najunde Daebi Makgi",
			d: "Move the right foot to C forming a left L-stance toward C while executing a low guarding block to C with a reverse knife-hand.",
		},
		{
			n: 40,
			t: "Right Walking Stance · Left 9-Shape Block",
			s: "Gunnun So Bandae Gutja Makgi",
			d: "Execute a left 9-shape block while forming a right walking stance toward C slipping the right foot.",
		},
		{
			n: 41,
			t: "Left Walking Stance · Horizontal Twin Knife-Hand Strike",
			s: "Gunnun So Sang Sonkal Soopyong Taerigi",
			d: "Move the right foot to D forming a left walking stance toward C while executing a horizontal strike with a twin knife-hand.",
		},
		{
			n: 42,
			t: "Left Walking Stance · High Arc-Hand Strike",
			s: "Gunnun So Bandal Son Nopunde Bandae Taerigi",
			d: "Execute a high strike to C with the right arc-hand while maintaining a left walking stance toward C.",
		},
		{
			n: 43,
			t: "Middle Front Snap Kick",
			s: "Kaunde Apcha Busigi",
			d: "Execute a middle front snap kick to C with the right foot keeping the position of the hands as they were in 42.",
		},
		{
			n: 44,
			t: "Right Walking Stance · High Arc-Hand Strike",
			s: "Gunnun So Bandal Son Nopunde Bandae Taerigi",
			d: "Lower the right foot to C forming a right walking stance toward C while executing a high strike to C with the left arc-hand.",
		},
		{
			n: 45,
			t: "Middle Front Snap Kick",
			s: "Kaunde Apcha Busigi",
			d: "Execute a middle front snap kick to C with the left foot keeping the position of the hands as they were in 44.",
		},
		{
			n: 46,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Lower the left foot to C forming a left walking stance toward C while executing a middle punch to C with the right fist.",
		},
		{
			n: 47,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Execute a middle punch to C with the left fist while maintaining a left walking stance toward C.\n\nPerform 46 and 47 in a fast motion.",
		},
		{
			n: 48,
			t: "Close Stance · High Crescent Punch",
			s: "Moa So Sang Inji Joomuk Nopunde Bandal Jirugi",
			d: "Bring the right foot to the left foot to form a close stance toward C while executing a high crescent punch with a twin fore-knuckle fist.",
		},
		{
			n: 49,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Sonkal Najunde Makgi",
			d: "Move the left foot to B turning counter-clockwise to form a left walking stance toward B while executing a low block to B with the left knife-hand.",
		},
		{
			n: 50,
			t: "Left Walking Stance · High Punch",
			s: "Gunnun So Pyon Joomuk Nopunde Bandae Jirugi",
			d: "Execute a high punch to B with the right open fist while maintaining a left walking stance toward B.",
		},
		{
			n: 51,
			t: "Right Walking Stance · Low Block",
			s: "Gunnun So Sonkal Najunde Makgi",
			d: "Move the left foot on line AB forming a right walking stance toward A while executing a low block to A with the right knife-hand.",
		},
		{
			n: 52,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Pyon Joomuk Nopunde Bandae Jirugi",
			d: "Execute a high punch to A with the left open fist while maintaining a right walking stance toward A.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	Juche: [
		{
			n: 1,
			t: "Sitting Stance · Parallel Block",
			s: "Annun So Anpalmok Narani Makgi",
			d: "Move the left foot to B forming a sitting stance toward D while executing a parallel block with the inner forearm.",
		},
		{
			n: 2,
			t: "Middle Hooking Block",
			s: "Sonbadak Kaunde Golcho Makgi",
			d: "Execute a middle hooking block to D with the right palm while standing up toward D.",
		},
		{
			n: 3,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the left fist while forming a sitting stance toward D.",
		},
		{
			n: 4,
			t: "Left One-Leg Stance · Parallel Block",
			s: "Waebal So Bakat Palmok Narani Makgi",
			d: "Pull the right reverse footsword to the left knee joint forming a left one-leg stance toward D while executing a parallel block with the outer forearm.",
		},
		{
			n: 5,
			t: "Middle Side Piercing Kick and High Reverse Hooking Kick",
			s: "Kaunde Yopcha Jirugi, Orun Nopunde Bandae Dollyo Gorochagi",
			d: "Execute a middle side piercing kick to A and then a high reverse hooking kick to B consecutively with the right foot keeping the position of the hands as they were in 4.\n\nPerform in slow motion.",
		},
		{
			n: 6,
			t: "Right X-Stance · Downward Strike",
			s: "Twigi, Orun Kyocha So Dung Joomuk Baro Naeryo Taerigi",
			d: "Lower the right foot to B in a jumping motion to form a right X-stance toward F while executing a downward strike to B with the right back fist.",
		},
		{
			n: 7,
			t: "Middle Hooking Kick and High Side Piercing Kick",
			s: "Kaunde Golcho Chagi, Wen Nopunde Yopcha Jirugi",
			d: "Execute a middle hooking kick and then a high side piercing kick to F consecutively with the left foot while pulling both fists in front of the chest.",
		},
		{
			n: 8,
			t: "Sitting Stance · High Outward Cross-Cut",
			s: "Annun So Wen Opun Sonkut Nopunde Bakuro Ghutgi",
			d: "Lower the left foot to F in a stamping motion to form a sitting stance toward B while executing a high outward cross-cut to F with the left flat finger tip.",
		},
		{
			n: 9,
			t: "Left Walking Stance · High Elbow Strike",
			s: "Gunnun So Nopun Palkup Bandae Taerigi",
			d: "Execute a right high elbow strike to BF pressing the right side fist with the left palm while forming a left walking stance toward BF.",
		},
		{
			n: 10,
			t: "Right X-Stance · Low Front Block",
			s: "Kyocha So Sonkal Dung Najunde Bandae Ap Makgi",
			d: "Cross the left foot over the right foot to form a right X-stance toward B while executing a low front block to B with the left reverse knife-hand, bringing the right finger belly on the left back forearm.",
		},
		{
			n: 11,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot to A forming a left L-stance toward A while executing a middle guarding block to A with a knife-hand.",
		},
		{
			n: 12,
			t: "Mid-Air Knife-Hand Strike",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Execute a mid-air strike to A with a left knife-hand while spinning counter clockwise and then land to A forming a right L-stance toward A with the left arm extended.",
		},
		{
			n: 13,
			t: "Sitting Stance · Parallel Block",
			s: "Annun So Anpalmok Narani Makgi",
			d: "Move the right foot to A to form a sitting stance toward D while executing a parallel block with the inner forearm.",
		},
		{
			n: 14,
			t: "Middle Hooking Block",
			s: "Sonbadak Kaunde Golcho Makgi",
			d: "Execute a middle hooking block to D with the left palm while standing up toward D.",
		},
		{
			n: 15,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the right fist while forming a sitting stance toward D.",
		},
		{
			n: 16,
			t: "Right One-Leg Stance · Parallel Block",
			s: "Waebal So Bakat Palmok Narani Makgi",
			d: "Pull the left reverse footsword to the right knee joint forming a right one-leg stance toward D while executing a parallel block with the outer forearm.",
		},
		{
			n: 17,
			t: "Middle Side Piercing Kick and High Reverse Hooking Kick",
			s: "Kaunde Yopcha Jirugi, Wen Nopunde Bandae Dollyo Gorochagi",
			d: "Execute a middle side piercing kick to B and then a high reverse hooking kick to A consecutively with the left foot keeping the position of the hands as they were in 16.\n\nPerform in slow motion.",
		},
		{
			n: 18,
			t: "Left X-Stance · Downward Strike",
			s: "Twigi, Wen Kyocha So Dung Joomuk Baro Naeryo Taerigi",
			d: "Lower the left foot to A in a jumping motion to form a left X-stance toward E while executing a downward strike to A with the left back fist.",
		},
		{
			n: 19,
			t: "Middle Hooking Kick and High Side Piercing Kick",
			s: "Kaunde Golcho Chagi, Orun Nopunde Yopcha Jirugi",
			d: "Execute a middle hooking kick and then a high side piercing kick to E consecutively with the right foot while pulling both fists in front of the chest.",
		},
		{
			n: 20,
			t: "Sitting Stance · High Outward Cross-Cut",
			s: "Annun So Orun Opun Sonkut Nopunde Bakuro Ghutgi",
			d: "Lower the right foot to E in a stamping motion to form a sitting stance toward A while executing a high outward cross-cut to E with the right flat finger tip.",
		},
		{
			n: 21,
			t: "Right Walking Stance · High Elbow Strike",
			s: "Gunnun So Nopun Palkup Bandae Taerigi",
			d: "Execute a left high elbow strike to AE pressing the left side fist with the right palm while forming a right walking stance toward AE.",
		},
		{
			n: 22,
			t: "Left X-Stance · Low Front Block",
			s: "Kyocha So Sonkal Dung Najunde Bandae Ap Makgi",
			d: "Cross the right foot over the left foot to form a left X-stance toward A while executing a low front block to A with the right reverse knife-hand, bringing the left finger belly on the right back forearm.",
		},
		{
			n: 23,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to B forming a right L-stance toward B while executing a middle guarding block to B with a knife-hand.",
		},
		{
			n: 24,
			t: "Mid-Air Knife-Hand Strike",
			s: "Sonkal Twio Dolmyo Taerigi",
			d: "Execute a mid-air strike to B with a right knife-hand while spinning clockwise and then land to B forming a left L-stance toward B with the right arm extended.",
		},
		{
			n: 25,
			t: "Pick-Shape Kick and Guarding Block",
			s: "Gokaeng-i Chagi, Orun Dwitbal So Palmok Kaunde Daebi Makgi",
			d: "Execute a pick-shape kick to B with the left foot and then lower it to B forming a right rear foot stance toward B while executing a middle guarding block with the forearm.",
		},
		{
			n: 26,
			t: "Close Stance with Heaven Hand",
			s: "Moa So Hanulson",
			d: "Bring the right foot to the left foot forming a close stance with a heaven hand toward D.\n\nPerform in slow motion.",
		},
		{
			n: 27,
			t: "Left Rear Foot Stance · Downward Straight Elbow Thrust",
			s: "Dwitbal So Sun Palkup Bandae Naeryo Tulgi",
			d: "Slide to C to form a left rear foot stance toward D while executing a downward thrust with the right straight elbow.",
		},
		{
			n: 28,
			t: "Right Walking Stance · High Crescent Strike",
			s: "Gunnun So Bandal Son Nopunde Bandae Bandal Taerigi",
			d: "Execute a high crescent strike with the left arc-hand while forming a right walking stance toward D, slipping the right foot.",
		},
		{
			n: 29,
			t: "Right Rear Foot Stance · Downward Straight Elbow Thrust",
			s: "Dwitbal So Sun Palkup Bandae Naeryo Tulgi",
			d: "Slide to C to form a right rear foot stance toward D while executing a downward thrust with the left straight elbow.",
		},
		{
			n: 30,
			t: "Left Walking Stance · High Crescent Strike",
			s: "Gunnun So Bandal Son Nopunde Bandae Bandal Taerigi",
			d: "Execute a high crescent strike with the right arc-hand while forming a left walking stance toward D, slipping the left foot.",
		},
		{
			n: 31,
			t: "Right Walking Stance · High Inward Twin Knife-Hand Strike",
			s: "Gunnun So Sang Sonkal Nopunde Anuro Taerigi",
			d: "Move the left foot to C forming a right walking stance toward D while executing a high inward strike to D with a twin knife-hand.",
		},
		{
			n: 32,
			t: "Left Walking Stance · Downward Punch",
			s: "Gunnun So Bandae Naeryo Jirugi",
			d: "Move the right foot to C forming a left walking stance toward D while executing a downward punch with the right fist.",
		},
		{
			n: 33,
			t: "Right L-Stance · Downward Outer Forearm Block",
			s: "Niunja So Bakat Palmok Bandae Naeryo Makgi",
			d: "Move the left foot to the side rear of the right foot and then slide to C forming a right L-stance toward D while executing a downward block with the left outer forearm.",
		},
		{
			n: 34,
			t: "Dodging Reverse Turning Kick and Guarding Block",
			s: "Pihamyo Bandae Dollyo Chagi, Wen Niunja So Palmok Kaunde Daebi Makgi",
			d: "Execute a dodging reverse turning kick to D with the right foot while flying away from D and then land to C to form a left L-stance toward D at the same time executing a middle guarding block to D with the forearm.",
		},
		{
			n: 35,
			t: "Left L-Stance · Downward Outer Forearm Block",
			s: "Niunja So Bakat Palmok Bandae Naeryo Makgi",
			d: "Move the right foot to the side rear of the left foot and then slide to C forming a left L-stance toward D while executing a downward block with the right outer forearm.",
		},
		{
			n: 36,
			t: "Dodging Reverse Turning Kick and Guarding Block",
			s: "Pihamyo Bandae Dollyo Chagi, Orun Niunja So Palmok Kaunde Daebi Makgi",
			d: "Execute a dodging reverse turning kick to D with the left foot while flying away from D and then land to C to form a right L-stance toward D at the same time executing a middle guarding block to D with the forearm.",
		},
		{
			n: 37,
			t: "Flying Two Direction Kick",
			s: "Twimyo Sangbang Chagi, Yop Bituro Chagi",
			d: "Move the right foot to D and then the left foot to D then execute a flying two direction kick (twisting kick with the left foot, side piercing with the right foot) while flying to D.",
		},
		{
			n: 38,
			t: "Left Diagonal Stance · Rising Twin Palm Block",
			s: "Sasun So Sang Sonbadak Chookyo Makgi",
			d: "Land to D to form a left diagonal stance toward D while executing a rising block with a twin palm.",
		},
		{
			n: 39,
			t: "Right Rear Foot Stance · Side Elbow Thrust",
			s: "Dwitbal So Yop Palkup Tulgi",
			d: "Slide to D forming a right rear foot stance toward C while executing a side thrust to D with the right elbow.",
		},
		{
			n: 40,
			t: "Right Bending Ready Stance B and Middle Back Piercing Kick",
			s: "Guburyo Junbi Sogi B, Wen Kaunde Dwitcha Jirugi",
			d: "Turn the face to D while forming a right bending ready stance B toward C and then execute a middle back piercing kick to D with the left foot.\n\nPerform in slow motion.",
		},
		{
			n: 41,
			t: "Right L-Stance · Horizontal Back Fist Strike",
			s: "Niunja So Dung Joomuk Bandae Soopyong Taerigi",
			d: "Lower the left foot to D in a stamping motion forming a right L-stance toward D at the same time executing a horizontal strike to D with the left back fist.",
		},
		{
			n: 42,
			t: "Parallel Stance · High Inward Cross-Cut",
			s: "Narani So Orun Opun Sonkut Nopunde Anuro Ghutgi",
			d: "Execute a high inward cross-cut to D with the right flat finger tip while forming a parallel stance toward D, pulling the right foot.",
		},
		{
			n: 43,
			t: "Flying Front Punch and Upset Punch",
			s: "Twimyo Orun Joomuk Ap Jirugi, Orun Joomuk Dwijibo Jirigi",
			d: "Execute a front punch and an upset punch to D consecutively with the right fist while flying to D and then land to D forming a close stance toward D with the right fist extended.",
		},
		{
			n: 44,
			t: "Right Walking Stance · Front Downward Strike",
			s: "Gunnun So Sonkal Bandae Ap Naeryo Taerigi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a front downward strike with the left knife-hand.",
		},
		{
			n: 45,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a middle punch to D with the right fist.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Sam-Il": [
		{
			n: 1,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Slide to D forming a right L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 2,
			t: "Right Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Move the right foot to D forming a right walking stance toward D while executing a high block to D with the right double forearm.",
		},
		{
			n: 3,
			t: "Left Walking Stance · High Side Block",
			s: "Gunnun So Sonkal Nopunde Bandae Yop Makgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a high side block to D with the right knife-hand and bringing the left palm on the right back forearm.",
		},
		{
			n: 4,
			t: "Middle Twisting Kick",
			s: "Kaunde Bituro Chagi",
			d: "Execute a middle twisting kick to A with the right foot keeping the position of the hands as they were in 3.",
		},
		{
			n: 5,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Lower the right foot to D forming a right walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 6,
			t: "Sitting Stance · Middle Wedging Block",
			s: "Annun So Sonkal Dung Kaunde Hechyo Makgi",
			d: "Move the right foot on line CD to form a sitting stance toward B while executing a middle wedging block with a reverse knife-hand.",
		},
		{
			n: 7,
			t: "Left Walking Stance · Low Thrust",
			s: "Gunnun So Dwijibun Sonkut Bandae Najunde Tulgi",
			d: "Execute a low thrust to C with a right upset finger tip while forming a left walking stance toward C, pivoting with the right foot.",
		},
		{
			n: 8,
			t: "Right L-Stance · High Outward Block and Low Block",
			s: "Niunja So Bakat Palmok Nopunde Baro Bakuro Makgi Wa Palmok Najunde Bandae Makgi",
			d: "Execute a high outward block to D with the right outer forearm and a low block to C with the left forearm while forming a right L-stance toward C pulling the left foot.",
		},
		{
			n: 9,
			t: "Sitting Stance · Middle Wedging Block",
			s: "Annun So Sonkal Dung Kaunde Hechyo Makgi",
			d: "Move the right foot to C to form a sitting stance toward A while executing a middle wedging block with a reverse knife-hand.",
		},
		{
			n: 10,
			t: "Left L-Stance · Low Punch",
			s: "Niunja So Doo Joomuk Najunde Jirugi",
			d: "Execute a low punch to C with the right double fist while forming a left L-stance toward C, pulling the right foot.",
		},
		{
			n: 11,
			t: "Left Walking Stance · High Double Arc-Hand Block",
			s: "Gunnun So Nopunde Doo Bandalson Makgi",
			d: "Move the left foot to C forming a left walking stance toward C while executing a high block to BC with a double arc-hand and looking through it.",
		},
		{
			n: 12,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Move the right foot to C forming a right walking stance toward C while executing a middle punch to C with the left fist.",
		},
		{
			n: 13,
			t: "Right L-Stance · Low Punch",
			s: "Niunja So Doo Joomuk Najunde Jirugi",
			d: "Move the right foot on line CD to form a right L-stance toward D while executing a low punch to D with the left double fist.",
		},
		{
			n: 14,
			t: "Right L-Stance · High Guarding Block",
			s: "Niunja So Sonkal Dung Nopunde Daebi Makgi",
			d: "Move the left foot to B forming a right L-stance toward B while executing a high guarding block to B with a reverse knife-hand.",
		},
		{
			n: 15,
			t: "Left Fixed Stance · U-Shape Block",
			s: "Gojung So Digutja Makgi",
			d: "Execute a U-shape block to B while forming a left fixed stance toward B, slipping the left foot.",
		},
		{
			n: 16,
			t: "Right Fixed Stance · Sweeping Kick and U-Shape Block",
			s: "Yop Bal Badak Suroh Chagi, Orun Gojung So Digutja Makgi",
			d: "Execute a sweeping kick to B with the right side sole and then lower it to B forming a right fixed stance toward B while executing a U-shape block to B.",
		},
		{
			n: 17,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Twigi, Wen Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Jump and spin counter clockwise, landing on the same spot to form a left L-stance toward B while executing a middle guarding block to B with a knife-hand.",
		},
		{
			n: 18,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to B with the right foot while forming a knife-hand guarding block.",
		},
		{
			n: 19,
			t: "Left Walking Stance · Front Elbow Strike",
			s: "Gunnun So Ap Palkup Bandae Taerigi",
			d: "Lower the right foot to the left foot and then move the left foot to A forming a left walking stance toward A while striking the left palm with the right front elbow.",
		},
		{
			n: 20,
			t: "Left Diagonal Stance · Back Elbow Thrust",
			s: "Sasun So Dwit Palkup Tulgi",
			d: "Move the right foot to A turning counter clockwise to form a left diagonal stance toward D at the same time thrusting to C with the left back elbow supporting the left forefist with the right palm and turning the face to C.",
		},
		{
			n: 21,
			t: "Right Walking Stance · Pressing Block",
			s: "Gunnun So Kyocha Joomuk Noollo Makgi",
			d: "Execute a pressing block with an X-fist while forming a right walking stance toward AD.",
		},
		{
			n: 22,
			t: "Sitting Stance · W-Shape Block",
			s: "Annun So Wen Bakat Palmok San Makgi",
			d: "Move the left foot to A in a stamping motion to form a sitting stance toward C while executing a W-shape block with the outer forearm.",
		},
		{
			n: 23,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to A with the left foot while forming a forearm guarding block.",
		},
		{
			n: 24,
			t: "Left L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Najunde Daebi Makgi",
			d: "Lower the left foot on line A and then execute a low guarding block to B with a knife-hand while forming a left L-stance toward B, pivoting the left foot.",
		},
		{
			n: 25,
			t: "Right Rear Foot Stance · Upward Block",
			s: "Dwitbal So Sonbadak Bandae Ollyo Makgi",
			d: "Move the left foot to B forming a right rear stance toward B while executing an upward block with a left palm.",
		},
		{
			n: 26,
			t: "Left Rear Foot Stance · Pressing Block",
			s: "Dwitbal So Sang Sonbadak Noollo Makgi",
			d: "Move the right foot to B forming a left rear foot stance toward B while executing a pressing block with a twin palm.",
		},
		{
			n: 27,
			t: "Left Walking Stance · Upset Punch",
			s: "Gunnun So Sang Joomuk Dwijibo Jirugi",
			d: "Move the left foot to C in a stamping motion to form a left walking stance toward C while executing an upset punch to C with a twin fist.",
		},
		{
			n: 28,
			t: "Left L-Stance · Low Block",
			s: "Niunja So Palmok Najunde Bandae Makgi",
			d: "Move the right foot to C forming a left L-stance toward C while executing a low block to C with the right forearm, pulling the left fist under the left armpit.",
		},
		{
			n: 29,
			t: "Left L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Execute a middle punch to C with the left fist while maintaining a left L-stance toward C bringing the right fist over the left shoulder.",
		},
		{
			n: 30,
			t: "Left Walking Stance · Middle Front Block",
			s: "Gunnun So Palmok Kaunde Bandae Ap Makgi",
			d: "Execute a middle front block with the right forearm while forming a left walking stance toward D, pivoting with the right foot.",
		},
		{
			n: 31,
			t: "Left Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "Execute a high punch to D with the left fist while maintaining a left walking stance toward D.\n\nPerform 30 and 31 in a continuous motion.",
		},
		{
			n: 32,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to D with the left foot keeping the position of the hands as they were in 31.",
		},
		{
			n: 33,
			t: "Right Walking Stance · High Vertical Punch",
			s: "Gunnun So Sang Joomuk Nopunde Sewo Jirugi",
			d: "Lower the left foot to D and then move the right foot to D in a stamping motion forming a right walking stance toward D while executing a high vertical punch to D with a twin fist.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Yoo-Sin": [
		{
			n: 1,
			t: "Sitting Stance · Elbows Extended",
			s: "Annun Sogi",
			d: "Move the left foot to B to form a sitting stance toward D while extending both elbows to the sides horizontally.",
		},
		{
			n: 2,
			t: "Sitting Stance · Angle Punch",
			s: "Annun So Wen Joomuk C-Bang Giokja Jirugi",
			d: "Execute an angle punch to C with the left fist while sliding to A, maintaining a sitting stance toward D.",
		},
		{
			n: 3,
			t: "Sitting Stance · Angle Punch",
			s: "Annun So Orun Joomuk C-Bang Giokja Jirugi",
			d: "Execute an angle punch to C with the right fist while sliding to B, maintaining a sitting stance toward D.\n\nPerform 2 and 3 in a fast motion.",
		},
		{
			n: 4,
			t: "Middle Hooking Block",
			s: "Sonbadak Kaunde Golcho Makgi",
			d: "Execute a middle hooking block to D with the right palm while standing up toward D.",
		},
		{
			n: 5,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the left fist while forming a sitting stance toward D.",
		},
		{
			n: 6,
			t: "Middle Hooking Block",
			s: "Sonbadak Kaunde Golcho Makgi",
			d: "Execute a middle hooking block to D with the left palm while standing up toward D.",
		},
		{
			n: 7,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the right fist while forming a sitting stance toward D.",
		},
		{
			n: 8,
			t: "Left Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Yop Makgi",
			d: "Move the left foot to BD to form a left walking stance toward BD while executing a high side block to BD with the left outer forearm.",
		},
		{
			n: 9,
			t: "Left Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to D with the right inner forearm while maintaining a left walking stance toward BD.",
		},
		{
			n: 10,
			t: "Sitting Stance · Scooping Block",
			s: "Annun So Wen Sonbadak Duro Makgi",
			d: "Execute a scooping block with the left palm while forming a sitting stance toward AD.",
		},
		{
			n: 11,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to AD with the right fist while maintaining a sitting stance toward AD.\n\nPerform 10 and 11 in a connecting motion.",
		},
		{
			n: 12,
			t: "Right Walking Stance · High Side Block",
			s: "Gunnun So Bakat Palmok Nopunde Yop Makgi",
			d: "Bring the left foot to the right foot, and then move the right foot to AD to form a right walking stance toward AD while executing a high side block to AD with the right outer forearm.",
		},
		{
			n: 13,
			t: "Right Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to D with the left inner forearm while maintaining a right walking stance toward AD.",
		},
		{
			n: 14,
			t: "Sitting Stance · Scooping Block",
			s: "Annun So Orun Sonbadak Duro Makgi",
			d: "Execute a scooping block with the right palm while forming a sitting stance toward BD.",
		},
		{
			n: 15,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to BD with the left fist while maintaining a right walking stance toward BD.\n\nPerform 14 and 15 in a connecting motion.",
		},
		{
			n: 16,
			t: "Left Walking Stance · High Hooking Block",
			s: "Gunnun So Sonbadak Nopunde Bandae Golcho Makgi",
			d: "Execute a high hooking block to BC with the right palm while forming a left walking stance toward BC.",
		},
		{
			n: 17,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to BD with the left fist while forming a sitting stance toward BD.",
		},
		{
			n: 18,
			t: "Right Walking Stance · High Hooking Block",
			s: "Gunnun So Sonbadak Nopunde Bandae Golcho Makgi",
			d: "Execute a high hooking block to AD with the left palm while forming a right walking stance toward AD.",
		},
		{
			n: 19,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to BD with the right fist while forming sitting stance toward BD.\n\nPerform 16, 17, 18 and 19 in a continuous motion.",
		},
		{
			n: 20,
			t: "Left Walking Stance · Pressing Block",
			s: "Gunnun So Kyocha Joomuk Noollo Makgi",
			d: "Move the right foot to C, forming a left walking stance toward D at the same time executing a pressing block with an X-fist.",
		},
		{
			n: 21,
			t: "Left Walking Stance · Rising X-Knife-Hand Block",
			s: "Gunnun So Kyocha Sonkal Chookyo Makgi",
			d: "Execute a rising block with an X-knife-hand while maintaining a left walking stance toward D.\n\nPerform 20 and 21 in a continuous motion.",
		},
		{
			n: 22,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to D with the right fist, slipping the left palm up to the right elbow joint while maintaining a left walking stance toward D.",
		},
		{
			n: 23,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to D with the right foot, keeping the position of the hands as they were in 22.",
		},
		{
			n: 24,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Lower the right foot to D, forming a right walking stance toward D while executing a middle punch to D with the left fist.",
		},
		{
			n: 25,
			t: "Right Walking Stance · Pressing Block",
			s: "Gunnun So Kyocha Joomuk Noollo Makgi",
			d: "Execute a pressing block with an X-fist while maintaining a right walking stance toward D.",
		},
		{
			n: 26,
			t: "Right Walking Stance · Rising X-Knife-Hand Block",
			s: "Gunnun So Kyocha Sonkal Chookyo Makgi",
			d: "Execute a rising block with an X-knife-hand while maintaining a right walking stance toward D.\n\nPerform 25 and 26 in a continuous motion.",
		},
		{
			n: 27,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Execute a middle punch to D with the left fist slipping the right palm up to the left elbow joint while maintaining a right walking stance toward D.",
		},
		{
			n: 28,
			t: "Low Front Snap Kick",
			s: "Najunde Apcha Busigi",
			d: "Execute a low front snap kick to D with the left foot, keeping the position of the hands as they were in 27.",
		},
		{
			n: 29,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Bandae Jirugi",
			d: "Lower the left foot to D to form a left walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 30,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot to D, forming a left L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 31,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to D to form a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 32,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the left foot to C, forming a left L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 33,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Move the right foot to C to form a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 34,
			t: "Right Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Move the right foot to D, forming a right walking stance toward D while executing a high block to D with the right double forearm.",
		},
		{
			n: 35,
			t: "Right Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Bandae Makgi",
			d: "Execute a low block to D with the left forearm, keeping the right forearm as it was in 34 while maintaining a right walking stance toward D.\n\nPerform 34 and 35 in a fast motion.",
		},
		{
			n: 36,
			t: "Left Walking Stance · High Block",
			s: "Gunnun So Doo Palmok Nopunde Makgi",
			d: "Move the left foot to D to form a left walking stance toward D while executing a high block to D with the left double forearm.",
		},
		{
			n: 37,
			t: "Left Walking Stance · Low Block",
			s: "Gunnun So Palmok Najunde Bandae Makgi",
			d: "Execute a low block to D with the right forearm, keeping the left forearm as it was in 36 while maintaining a left walking stance toward D.\n\nPerform 36 and 37 in a fast motion.",
		},
		{
			n: 38,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Move the right foot to D, forming a right walking stance toward D while executing a middle punch to D with the right fist.",
		},
		{
			n: 39,
			t: "Right L-Stance · High Block",
			s: "Niunja So Sonkal Dung Nopunde Yop Makgi",
			d: "Move the left foot on line CD, and then turn counter-clockwise, pivoting with the left foot to form a right L-stance toward C while executing a high block to C with the left reverse knife-hand.",
		},
		{
			n: 40,
			t: "Close Ready Stance C",
			s: "Moa Junbi Sogi C",
			d: "Bring the right foot to the left foot to form a close ready stance C toward C.",
		},
		{
			n: 41,
			t: "Right Walking Stance · Upset Punch",
			s: "Gunnun So Sang Joomuk Dwijibo Jirugi",
			d: "Move the right foot to CF in a stamping motion to form a right walking stance toward CG at the same time executing an upset punch to CF with a twin fist.",
		},
		{
			n: 42,
			t: "Left Walking Stance · Upset Punch",
			s: "Gunnun So Sang Joomuk Dwijibo Jirugi",
			d: "Bring the right foot to the left foot, and then move the left foot to CE in a stamping motion, forming a left walking stance toward CE while executing an upset punch to CE with a twin fist.",
		},
		{
			n: 43,
			t: "Left L-Stance · Middle Block",
			s: "Niunja So Anpalmok Kaunde Yop Makgi",
			d: "Bring the left foot to the right foot, and then move the right foot to F to form a left L-stance toward F while executing a middle block to F with the right inner forearm.",
		},
		{
			n: 44,
			t: "Left L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Execute a middle punch to F with the left fist while maintaining a left L-stance toward F.",
		},
		{
			n: 45,
			t: "Close Stance · Angle Punch",
			s: "Moa So Orun Joomuk Giokja Jirugi",
			d: "Bring the left foot to the right foot to form a close stance toward C while executing an angle punch with the right fist.\n\nPerform in a slow motion.",
		},
		{
			n: 46,
			t: "Right L-Stance · Middle Block",
			s: "Niunja So Anpalmok Kaunde Yop Makgi",
			d: "Move the left foot to E to form a right L-stance toward E while executing a middle block to E with the left inner forearm.",
		},
		{
			n: 47,
			t: "Right L-Stance · Middle Punch",
			s: "Niunja So Kaunde Baro Jirugi",
			d: "Execute a middle punch to E with the right fist while maintaining a right L-stance toward E.",
		},
		{
			n: 48,
			t: "Close Stance · Angle Punch",
			s: "Moa So Wen Joomuk Giokja Jirugi",
			d: "Bring the right foot to the left foot to form a close stance toward C while executing an angle punch with the left fist.\n\nPerform in a slow motion.",
		},
		{
			n: 49,
			t: "Left Fixed Stance · U-Shape Punch",
			s: "Gojung So Digutja Jirugi",
			d: "Move the left foot to E to form a left fixed stance toward E while executing a U-shape punch to E.",
		},
		{
			n: 50,
			t: "Right Fixed Stance · U-Shape Punch",
			s: "Gojung So Digutja Jirugi",
			d: "Bring the left foot to the right foot, and then move the right foot to E, forming a right fixed stance toward E while executing a U-shape punch to E.",
		},
		{
			n: 51,
			t: "Sitting Stance · Front Strike",
			s: "Annun So Orun Dung Joomuk Ap Taerigi",
			d: "Move the right foot on line CD in a stamping motion to form a sitting stance toward E while executing a front strike to E with the right back fist.",
		},
		{
			n: 52,
			t: "Waving Kick and High Outward Block",
			s: "Doro Chagi, Annun So Orun Bakat Palmok Nopunde Bakuro Makgi",
			d: "Execute a waving kick to D with the right foot, and then a high outward block to AC with the right outer forearm, keeping the position of the hands as they were in 51 while forming a sitting stance toward E.",
		},
		{
			n: 53,
			t: "Waving Kick and High Front Block",
			s: "Doro Chagi, Annun So Orun Bakat Palmok Nopunde Ap Makgi",
			d: "Execute a waving kick to C with the left foot, and then a high front block to ED with the right outer forearm, keeping the position of the hands as they were in 52 while forming a sitting stance toward E.",
		},
		{
			n: 54,
			t: "Sitting Stance · Horizontal Strike",
			s: "Annun So Orun Sondung Soopyong Taerigi",
			d: "Execute a horizontal strike to C with the right back hand while maintaining a sitting stance toward E.",
		},
		{
			n: 55,
			t: "Middle Crescent Kick",
			s: "Kaunde Bandal Chagi",
			d: "Execute a middle crescent kick to the right palm with the left foot.",
		},
		{
			n: 56,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the left foot forming a forearm guarding block.\n\nPerform 55 and 56 in a consecutive kick.",
		},
		{
			n: 57,
			t: "Sitting Stance · Horizontal Strike",
			s: "Annun So Wen Sondung Soopyong Taerigi",
			d: "Lower the left foot to C to form a sitting stance toward B while executing a horizontal strike to C with the left back hand.",
		},
		{
			n: 58,
			t: "Middle Crescent Kick",
			s: "Kaunde Bandal Chagi",
			d: "Execute a middle crescent kick to the left palm with the right foot.",
		},
		{
			n: 59,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the right foot, forming a forearm guarding block.\n\nPerform 58 and 59 in a consecutive kick.",
		},
		{
			n: 60,
			t: "Sitting Stance · Right 9-Shape Block",
			s: "Annun So Orun Gutja Makgi",
			d: "Lower the right foot to C, forming a sitting stance toward A while executing a right 9-shape block.",
		},
		{
			n: 61,
			t: "Sitting Stance · Change Hand Position",
			s: "Annun Sogi",
			d: "Change the position of the hands while maintaining a sitting stance toward A.",
		},
		{
			n: 62,
			t: "Sitting Stance · Right 9-Shape Block",
			s: "Annun So Orun Gutja Makgi",
			d: "Move the left foot to C, turning clockwise to form a sitting stance toward B while executing a right 9-shape block.",
		},
		{
			n: 63,
			t: "Sitting Stance · Change Hand Position",
			s: "Annun Sogi",
			d: "Change the position of the hands while maintaining a sitting stance toward B.",
		},
		{
			n: 64,
			t: "Left Vertical Stance · Downward Strike",
			s: "Soojik So Yop Joomuk Bandae Naeryo Taerigi",
			d: "Execute a downward strike to D with the right side fist while forming a left vertical stance, pulling the left foot.",
		},
		{
			n: 65,
			t: "Left Walking Stance · High Vertical Punch",
			s: "Gunnun So Sang Joomuk Nopunde Sewo Jirugi",
			d: "Move the right foot to A to form a left walking stance toward B while executing a high vertical punch to B with a twin fist.",
		},
		{
			n: 66,
			t: "Left Walking Stance · High Vertical Punch",
			s: "Gunnun So Sang Joomuk Nopunde Sewo Jirugi",
			d: "Move the right foot to B, turning counter-clockwise to form a left walking stance toward A while executing a high vertical punch to A with a twin fist.",
		},
		{
			n: 67,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Bring the right foot to the left foot, and then move the left foot to BD to form a right L-stance toward BD while executing a middle guarding block to BD with a knife-hand.",
		},
		{
			n: 68,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Bring the left foot to the right foot, and then move the right foot to AD to form a left L-stance toward AD while executing a middle guarding block to AD with a knife-hand.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Choi-Yong": [
		{
			n: 1,
			t: "Right Rear Foot Stance · Middle Guarding Block",
			s: "Dwitbal So Palmok Kaunde Daebi Makgi",
			d: "Move the left foot to D to form a right rear foot stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 2,
			t: "Right Rear Foot Stance · High Middle-Knuckle Punch",
			s: "Dwitbal So Joongji Joomuk Nopunde Bandae Jirugi",
			d: "Execute a high punch to D with the left middle knuckle fist while maintaining a right rear foot stance toward D.",
		},
		{
			n: 3,
			t: "Left Rear Foot Stance · Middle Guarding Block",
			s: "Dwitbal So Palmok Kaunde Daebi Makgi",
			d: "Move the left foot on line CD to form a left rear foot stance toward C while executing a middle guarding block to C with the forearm.",
		},
		{
			n: 4,
			t: "Left Rear Foot Stance · High Middle-Knuckle Punch",
			s: "Dwitbal So Joongji Joomuk Nopunde Bandae Jirugi",
			d: "Execute a high punch to C with the right middle knuckle fist while maintaining a left rear foot stance toward C.",
		},
		{
			n: 5,
			t: "Left Walking Stance · Rising Knife-Hand Block",
			s: "Gunnun So Sonkal Chookyo Makgi",
			d: "Move the right foot on line CD to form a left walking stance toward D while executing a rising block with the left knife-hand.",
		},
		{
			n: 6,
			t: "Left Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to AD with the right inner forearm while maintaining a left walking stance toward D.",
		},
		{
			n: 7,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Execute a middle punch to D with the left fist while maintaining a left walking stance toward D.",
		},
		{
			n: 8,
			t: "Right Walking Stance · Rising Knife-Hand Block",
			s: "Gunnun So Sonkal Chookyo Makgi",
			d: "Move the left foot on line CD to form a right walking stance toward C while executing a rising block with the right knife-hand.",
		},
		{
			n: 9,
			t: "Right Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to AC with the left inner forearm while maintaining a right walking stance toward C.",
		},
		{
			n: 10,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Execute a middle punch to C with the right fist while maintaining a right walking stance toward C.",
		},
		{
			n: 11,
			t: "Right L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Najunde Daebi Makgi",
			d: "Move the right foot on line CD to form a right L-stance toward D while executing a low guarding block to D with a knife-hand.",
		},
		{
			n: 12,
			t: "Middle Turning Kick",
			s: "Kaunde Dollyo Chagi",
			d: "Execute a middle turning kick to AD with the right foot and then lower it to the side front of the left foot.",
		},
		{
			n: 13,
			t: "High Reverse Hooking Kick",
			s: "Nopunde Bandae Dollyo Gorochagi",
			d: "Execute a high reverse hooking kick to D with the left foot.",
		},
		{
			n: 14,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to D with the left foot, pulling both hands in the opposite direction.\n\nPerform 13 and 14 in a consecutive kick.",
		},
		{
			n: 15,
			t: "Left Walking Stance · Front Elbow Strike",
			s: "Gunnun So Ap Palkup Bandae Taerigi",
			d: "Lower the left foot to D forming a left walking stance toward D while striking the left palm with the right front elbow.",
		},
		{
			n: 16,
			t: "Left L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Najunde Daebi Makgi",
			d: "Move the left foot on line CD to form a left L-stance toward C while executing a low guarding block to C with a knife-hand.",
		},
		{
			n: 17,
			t: "Middle Turning Kick",
			s: "Kaunde Dollyo Chagi",
			d: "Execute a middle turning kick to AC with the left foot and then lower it to the side front of the right foot.",
		},
		{
			n: 18,
			t: "High Reverse Hooking Kick",
			s: "Nopunde Bandae Dollyo Gorochagi",
			d: "Execute a high reverse hooking kick to C with the right foot.",
		},
		{
			n: 19,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to C with the right foot, pulling both hands in the opposite direction.\n\nPerform 18 and 19 in a consecutive kick.",
		},
		{
			n: 20,
			t: "Right Walking Stance · Front Elbow Strike",
			s: "Gunnun So Ap Palkup Bandae Taerigi",
			d: "Lower the right foot to C forming a right walking stance toward C while striking the right palm with the left front elbow.",
		},
		{
			n: 21,
			t: "Left Walking Stance · Pressing Block",
			s: "Gunnun So Sonbadak Bandae Noollo Makgi",
			d: "Move the left foot to C to form a left walking stance toward C while executing a pressing block with the right palm.",
		},
		{
			n: 22,
			t: "Right Walking Stance · Pressing Block",
			s: "Gunnun So Sonbadak Bandae Noollo Makgi",
			d: "Move the right foot to C forming a right walking stance toward C while executing a pressing block with the left palm.\n\nPerform 21 and 22 in a fast motion.",
		},
		{
			n: 23,
			t: "Left Walking Stance · W-Shape Knife-Hand Block",
			s: "Gunnun So Sonkal San Makgi",
			d: "Move the right foot to D and then the left foot to D, turning counter clockwise to form a left walking stance toward D while executing a W-shape block with a knife-hand.",
		},
		{
			n: 24,
			t: "Middle Front Snap Kick",
			s: "Kaunde Apcha Busigi",
			d: "Execute a middle front snap kick to D with the right foot keeping the position of the hands as they were in 23.",
		},
		{
			n: 25,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Lower the right foot to C forming a right L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 26,
			t: "Right Walking Stance · W-Shape Knife-Hand Block",
			s: "Gunnun So Sonkal San Makgi",
			d: "Move the right foot to D to form a right walking stance toward D while executing a W-shape block with a knife-hand.",
		},
		{
			n: 27,
			t: "Middle Front Snap Kick",
			s: "Kaunde Apcha Busigi",
			d: "Execute a middle front snap kick to D with the left foot keeping the position of the hands as they were in 26.",
		},
		{
			n: 28,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Lower the left foot to D forming a left L-stance toward C while executing a middle guarding block to C with the forearm.",
		},
		{
			n: 29,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the left foot to C and the right foot to C then slide to C turning clockwise to form a left L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 30,
			t: "Left Walking Stance · High Thrust",
			s: "Gunnun So Opun Sonkut Nopunde Tulgi",
			d: "Move the left foot to D forming a left walking stance toward D while executing a high thrust to D with the left flat fingertip.",
		},
		{
			n: 31,
			t: "Right Walking Stance · High Thrust",
			s: "Gunnun So Opun Sonkut Nopunde Tulgi",
			d: "Move the left foot on line CD forming a right walking stance toward C while executing a high thrust to C with the right flat fingertip.",
		},
		{
			n: 32,
			t: "Parallel Stance · Middle Hooking Block",
			s: "Narani So Orun Sonbadak Kaunde Golcho Makgi",
			d: "Move the right foot to D turning clockwise to form a parallel stance toward B while executing a middle hooking block to B with the right palm.",
		},
		{
			n: 33,
			t: "Parallel Stance · Middle Punch",
			s: "Narani So Wen Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to B with the left fist while maintaining a parallel stance toward B.",
		},
		{
			n: 34,
			t: "Left Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn the face toward A while forming a left bending ready stance A toward A.",
		},
		{
			n: 35,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to A with the right foot forming a forearm guarding block.",
		},
		{
			n: 36,
			t: "Right X-Stance · High Side Strike",
			s: "Twigi, Orun Kyocha So Dung Joomuk Nopunde Yop Taerigi",
			d: "Lower the right foot to A in a jumping motion to form a right X-stance toward AD while executing a high side strike to A with the right back fist and bringing the left finger belly to the right side fist.",
		},
		{
			n: 37,
			t: "High Reverse Hooking Kick",
			s: "Nopunde Bandae Dollyo Gorochagi",
			d: "Execute a high reverse hooking kick to B with the right foot.",
		},
		{
			n: 38,
			t: "Left L-Stance · Middle Outward Strike",
			s: "Niunja So Sonkal Kaunde Bakuro Taerigi",
			d: "Lower the right foot to B in a stamping motion to form a left L-stance toward B while executing a middle outward strike to B with the right knife-hand.",
		},
		{
			n: 39,
			t: "Parallel Stance · Middle Hooking Block",
			s: "Narani So Wen Sonbadak Kaunde Golcho Makgi",
			d: "Move the left foot to D turning counter clockwise to form a parallel stance toward A at the same time executing a middle hooking block to A with the left palm.",
		},
		{
			n: 40,
			t: "Parallel Stance · Middle Punch",
			s: "Narani So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to A with the right fist while maintaining a parallel stance toward A.",
		},
		{
			n: 41,
			t: "Right Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn the face to B while forming a right bending ready stance A toward B.",
		},
		{
			n: 42,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to B with the left foot forming a forearm guarding block.",
		},
		{
			n: 43,
			t: "Left X-Stance · High Side Strike",
			s: "Twigi, Wen Kyocha So Dung Joomuk Nopunde Yop Taerigi",
			d: "Lower the left foot to B in a jumping motion forming a left X-stance toward BD while executing a high side strike to B with the left back fist and bringing the right finger belly to the left side fist.",
		},
		{
			n: 44,
			t: "High Reverse Hooking Kick",
			s: "Nopunde Bandae Dollyo Gorochagi",
			d: "Execute a high reverse hooking kick to A with the left foot.",
		},
		{
			n: 45,
			t: "Right L-Stance · Middle Outward Strike",
			s: "Niunja So Sonkal Kaunde Bakuro Taerigi",
			d: "Lower the left foot to A in a stamping motion to form a right L-stance toward A while executing a middle outward strike to A with the left knife-hand.",
		},
		{
			n: 46,
			t: "Right Fixed Stance · Middle Punch",
			s: "Gojung So Kaunde Yop Jirugi",
			d: "Slide to A to form a right fixed stance toward A while executing a middle punch to A with the right fist.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Yon-Gae": [
		{
			n: 1,
			t: "Right L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Dung Najunde Daebi Makgi",
			d: "Slide to C to form a right L-stance toward D while executing a low guarding block to D with a reverse knife-hand.\n\nPerform in a circular motion.",
		},
		{
			n: 2,
			t: "Left Walking Stance · High Long-Fist Punch",
			s: "Gunnun So Ghin Joomuk Nopunde Bandae Jirugi",
			d: "Execute a high punch to D with the right long fist while forming a left walking stance toward D pivoting with the left foot.\n\nPerform in slow motion.",
		},
		{
			n: 3,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Slide to C forming a left L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 4,
			t: "Left L-Stance · Middle Outward Strike",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Execute a middle outward strike to D with the right knife-hand while flying to D and then land to D forming a left L-stance toward D with the right knife-hand extended to D.",
		},
		{
			n: 5,
			t: "Left L-Stance · Checking Block",
			s: "Niunja So Kyocha Joomuk Momchau Makgi",
			d: "Shift to C maintaining a left L-stance toward D while executing a checking block to D with an X-fist.",
		},
		{
			n: 6,
			t: "Right Walking Stance · High Outward Cross-Cut",
			s: "Gunnun So Opun Sonkut Nopunde Bakuro Ghutgi",
			d: "Execute a high outward cross-cut to D with the right flat finger tip while forming a right walking stance toward D, slipping the right foot.",
		},
		{
			n: 7,
			t: "Left Rear Foot Stance · Downward Straight Elbow Thrust",
			s: "Dwitbal So Sun Palkup Bandae Naeryo Tulgi",
			d: "Execute a downward thrust with the right straight elbow while forming a left rear foot stance toward D, pulling the right foot.",
		},
		{
			n: 8,
			t: "Left X-Stance · High Side Strike",
			s: "Twigi, Wen Kyocha So Dung Joomuk Nopunde Yop Taerigi",
			d: "Jump to D forming a left X-stance toward AD while executing a high side strike to D with the left back fist.",
		},
		{
			n: 9,
			t: "Left Walking Stance · Low Outward Block",
			s: "Gunnun So Sonkal Najunde Bandae Bakuro Makgi",
			d: "Move the right foot to C to form a left walking stance toward D while executing a low outward block to D with the right knife-hand.",
		},
		{
			n: 10,
			t: "Parallel Stance · Middle Hooking Block",
			s: "Narani So Wen Sonbadak Kaunde Golcho Makgi",
			d: "Move the right foot on line AB to form a parallel stance toward D while executing a middle hooking block to D with the left palm.",
		},
		{
			n: 11,
			t: "Parallel Stance · Middle Punch",
			s: "Narani So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the right fist while maintaining a parallel stance toward D.",
		},
		{
			n: 12,
			t: "Left L-Stance · Low Guarding Block",
			s: "Niunja So Sonkal Dung Najunde Daebi Makgi",
			d: "Slide to C forming a left L-stance toward D while executing a low guarding block to D with a reverse knife-hand.\n\nPerform in a circular motion.",
		},
		{
			n: 13,
			t: "Right Walking Stance · High Long-Fist Punch",
			s: "Gunnun So Ghin Joomuk Nopunde Bandae Jirugi",
			d: "Execute a high punch to D with the left long fist while forming a right walking stance toward D, pivoting with the right foot.\n\nPerform in slow motion.",
		},
		{
			n: 14,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Slide to C forming a right L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 15,
			t: "Right L-Stance · Middle Outward Strike",
			s: "Twimyo Wen Sonkal Kaunde Bakuro Taerigi",
			d: "Execute a middle outward strike to D with the left knife-hand while flying to D and then land to D forming a right L-stance toward D with the left knife-hand extended to D.",
		},
		{
			n: 16,
			t: "Right L-Stance · Checking Block",
			s: "Niunja So Kyocha Joomuk Momchau Makgi",
			d: "Shift to C maintaining a right L-stance toward D while executing a checking block to D with an X-fist.",
		},
		{
			n: 17,
			t: "Left Walking Stance · High Outward Cross-Cut",
			s: "Gunnun So Opun Sonkut Nopunde Bakuro Ghutgi",
			d: "Execute a high outward cross-cut to D with the left flat finger tip while forming a left walking stance toward D, slipping the left foot.",
		},
		{
			n: 18,
			t: "Right Rear Foot Stance · Downward Straight Elbow Thrust",
			s: "Dwitbal So Sun Palkup Bandae Naeryo Tulgi",
			d: "Execute a downward thrust with the left straight elbow while forming a right rear foot stance toward D, pulling the left foot.",
		},
		{
			n: 19,
			t: "Right X-Stance · High Side Strike",
			s: "Twigi, Orun Kyocha So Dung Joomuk Nopunde Yop Taerigi",
			d: "Jump to D forming a right X-stance toward BD while executing a high side strike to D with the right back fist.",
		},
		{
			n: 20,
			t: "Right Walking Stance · Low Outward Block",
			s: "Gunnun So Sonkal Najunde Bandae Bakuro Makgi",
			d: "Move the left foot to C to form a right walking stance toward D while executing a low outward block to D with the left knife-hand.",
		},
		{
			n: 21,
			t: "Parallel Stance · Middle Hooking Block",
			s: "Narani So Orun Sonbadak Kaunde Golcho Makgi",
			d: "Move the left foot on line AB to form a parallel stance toward D while executing a middle hooking block to D with the right palm.",
		},
		{
			n: 22,
			t: "Parallel Stance · Middle Punch",
			s: "Narani So Wen Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the left fist while maintaining a parallel stance toward D.",
		},
		{
			n: 23,
			t: "Sitting Stance · W-Shape Reverse Knife-Hand Block",
			s: "Annun So Sonkal Dung San Makgi",
			d: "Move the right foot to A to form a sitting stance toward D while executing a W-shape block with the reverse knife-hand.",
		},
		{
			n: 24,
			t: "Right X-Stance · Horizontal Twin Elbow Thrust",
			s: "Kyocha So Sang Palkup Soopyong Tulgi",
			d: "Cross the left foot over the right foot to form a right X-stance toward D while executing a horizontal thrust with a twin elbow.",
		},
		{
			n: 25,
			t: "Sitting Stance · Checking Block",
			s: "Annun So Sang Sun Palmok Momchau Makgi",
			d: "Move the right foot to A forming a sitting stance toward D while executing a checking block to D with a twin straight forearm.",
		},
		{
			n: 26,
			t: "Right X-Stance · Upward Punch",
			s: "Kyocha So Baro Ollyo Jirugi",
			d: "Cross the left foot over the right foot to form a right X-stance toward D while executing an upward punch with the right fist, pulling the left side fist in front of the right shoulder.",
		},
		{
			n: 27,
			t: "High Reverse Hooking Kick",
			s: "Nopunde Bandae Dollyo Gorochagi",
			d: "Execute a high reverse hooking kick to B with the right foot.",
		},
		{
			n: 28,
			t: "High Side Piercing Kick",
			s: "Nopunde Yopcha Jirugi",
			d: "Lower the right foot to B and then execute a high side piercing kick to B with the left foot pulling both hands in front of the chest while turning clockwise.",
		},
		{
			n: 29,
			t: "Left X-Stance · Downward Strike",
			s: "Twigi, Wen Kyocha So Dung Joomuk Baro Naeryo Taerigi",
			d: "Lower the left foot to B in a jumping motion to form a left X-stance toward BD while executing a downward strike to B with the left back fist.",
		},
		{
			n: 30,
			t: "Sitting Stance · W-Shape Reverse Knife-Hand Block",
			s: "Annun So Sonkal Dung San Makgi",
			d: "Move the left foot to B to form a sitting stance toward D while executing a W-shape block with the reverse knife-hand.",
		},
		{
			n: 31,
			t: "Left X-Stance · Horizontal Twin Elbow Thrust",
			s: "Kyocha So Sang Palkup Soopyong Tulgi",
			d: "Cross the right foot over the left foot to form a left X-stance toward D while executing a horizontal thrust with a twin elbow.",
		},
		{
			n: 32,
			t: "Sitting Stance · Checking Block",
			s: "Annun So Sang Sun Palmok Momchau Makgi",
			d: "Move the left foot to B forming a sitting stance toward D while executing a checking block to D with a twin straight forearm.",
		},
		{
			n: 33,
			t: "Left X-Stance · Upward Punch",
			s: "Kyocha So Baro Ollyo Jirugi",
			d: "Cross the right foot over the left foot to form a left X-stance toward D while executing an upward punch with the left fist, pulling the right side fist in front of the left shoulder.",
		},
		{
			n: 34,
			t: "High Reverse Hooking Kick",
			s: "Nopunde Bandae Dollyo Gorochagi",
			d: "Execute a high reverse hooking kick to A with the left foot.",
		},
		{
			n: 35,
			t: "High Side Piercing Kick",
			s: "Nopunde Yopcha Jirugi",
			d: "Lower the left foot to A and then execute a high side piercing kick to A with the right foot pulling both hands in front of the chest while turning counter clockwise.",
		},
		{
			n: 36,
			t: "Right X-Stance · Downward Strike",
			s: "Twigi, Orun Kyocha So Dung Joomuk Baro Naeryo Taerigi",
			d: "Lower the right foot to A in a jumping motion to form a right X-stance toward AD while executing a downward strike to A with the right back fist.",
		},
		{
			n: 37,
			t: "Left L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the left foot to C forming a left L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 38,
			t: "Left Rear Foot Stance · Waist Block",
			s: "Dwitbal So Anpalmok Bandae Hori Makgi",
			d: "Move the left foot to D turning counter clockwise to form a left rear foot stance toward C while executing a waist block to C with the right inner forearm.",
		},
		{
			n: 39,
			t: "Right L-Stance · High Outward Strike",
			s: "Niunja So Sonkal Nopunde Bakuro Taerigi",
			d: "Move the right foot to C slightly and then the left foot to D in a stamping motion to form a right L-stance toward D while executing a high outward strike to D with the left knife-hand.",
		},
		{
			n: 40,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Shift to C maintaining a right L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 41,
			t: "Right Rear Foot Stance · Waist Block",
			s: "Dwitbal So Anpalmok Bandae Hori Makgi",
			d: "Move the right foot to D turning clockwise to form a right rear foot stance toward C while executing a waist block to C with the left inner forearm.",
		},
		{
			n: 42,
			t: "Left L-Stance · High Outward Strike",
			s: "Niunja So Sonkal Nopunde Bakuro Taerigi",
			d: "Move the left foot to C slightly and then the right foot to D in a stamping motion to form a left L-stance toward D while executing a high outward strike to D with the right knife-hand.",
		},
		{
			n: 43,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the right foot to C turning counter clockwise to form a right L-stance toward D while executing a middle guarding block to D with the forearm.",
		},
		{
			n: 44,
			t: "Mid-Air Kick and Guarding Block",
			s: "Twio Dolmyo Chagi, Wen Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Jump to execute a mid-air kick to D with the right foot while spinning clockwise and then land to D to form a left L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 45,
			t: "Mid-Air Kick and Guarding Block",
			s: "Twio Dolmyo Chagi, Orun Niunja So Sonkal Kaunde Daebi Makgi",
			d: "Jump to execute a mid-air kick to D with the left foot while spinning counter clockwise and then land to D to form a right L-stance toward D while executing a middle guarding block to D with a knife-hand.",
		},
		{
			n: 46,
			t: "Left Walking Stance · Low Inward Block",
			s: "Gunnun So Sonkal Dung Najunde Bandae Anuro Makgi",
			d: "Execute a low inward block to D with the right reverse knife-hand pulling the left side fist in front of the right shoulder while forming a left walking stance toward D, slipping the right foot to C.",
		},
		{
			n: 47,
			t: "Left L-Stance · Side Elbow Thrust",
			s: "Niunja So Yop Palkup Tulgi",
			d: "Slide to C to form a left L-stance toward D while thrusting to C with the left side elbow.",
		},
		{
			n: 48,
			t: "Right Walking Stance · Low Inward Block",
			s: "Gunnun So Sonkal Dung Najunde Bandae Anuro Makgi",
			d: "Execute a low inward block to D with the left reverse knife-hand pulling the right side fist in front of the left shoulder while forming a right walking stance toward D, slipping the left foot to C.",
		},
		{
			n: 49,
			t: "Right L-Stance · Side Elbow Thrust",
			s: "Niunja So Yop Palkup Tulgi",
			d: "Slide to C forming a right L-stance toward D while thrusting to C with the right side elbow.\n\nEnd: Bring the right foot back to a ready posture.",
		},
	],
	"Ul-Ji": [
		{
			n: 1,
			t: "Right Walking Stance · Horizontal Strike",
			s: "Gunnun So Sang Yop Joomuk Soopyong Taerigi",
			d: "Move the left foot to C forming a right walking stance toward D while executing a horizontal strike with twin side fists.",
		},
		{
			n: 2,
			t: "Left Walking Stance · Pressing Block",
			s: "Gunnun So Kyocha Joomuk Noollo Makgi",
			d: "Move the right foot to C to form a left walking stance toward D while executing a pressing block with an X-fist.",
		},
		{
			n: 3,
			t: "Left Walking Stance · Rising X-Knife-Hand Block",
			s: "Gunnun So Kyocha Sonkal Chookyo Makgi",
			d: "Execute a rising block with an X-knife-hand while maintaining a left walking stance toward D.\n\nPerform 2 and 3 in a continuous motion.",
		},
		{
			n: 4,
			t: "Left Walking Stance · High Front Strike",
			s: "Gunnun So Sonkal Nopunde Bandae Ap Taerigi",
			d: "Execute a high front strike to D with the right knife-hand bringing the left palm on the right elbow joint while maintaining a left walking stance toward D.",
		},
		{
			n: 5,
			t: "Sitting Stance · Horizontal Strike",
			s: "Annun So Wen Sondung Soopyong Taerigi",
			d: "Move the left foot to C to form a sitting stance toward B while executing a horizontal strike to C with the left back hand.",
		},
		{
			n: 6,
			t: "Middle Crescent Kick",
			s: "Kaunde Bandal Chagi",
			d: "Execute a middle crescent kick to the left palm with the right foot.",
		},
		{
			n: 7,
			t: "Sitting Stance · Front Elbow Strike",
			s: "Annun So Orun Ap Palkup Taerigi",
			d: "Lower the right foot to C, forming a sitting stance toward A while striking the left palm with the right front elbow.",
		},
		{
			n: 8,
			t: "Sitting Stance · Back Elbow Thrust",
			s: "Annun So Wen Dwit Palkup Tulgi",
			d: "Thrust to B with the left back elbow placing the right side fist on the left fist while maintaining a sitting stance toward A.",
		},
		{
			n: 9,
			t: "Sitting Stance · Side Back Strike",
			s: "Annun So Orun Dung Joomuk Yopdwi Taerigi",
			d: "Execute a side back strike to B with the right back fist and extending the left arm to the side-downward while maintaining a sitting stance toward A.",
		},
		{
			n: 10,
			t: "Close Stance · Twin Side Elbow Thrust",
			s: "Moa So Sang Yop Palkup Tulgi",
			d: "Bring the left foot to the right foot, forming a close stance toward D, at the same time thrusting with a twin side elbow.",
		},
		{
			n: 11,
			t: "Right X-Stance",
			s: "Kyocha Sogi",
			d: "Cross the left foot over the right foot, forming a right X-stance toward D while turning the face to A, keeping the position of the hands as they were in 10.\n\nPerform in a fast motion.",
		},
		{
			n: 12,
			t: "Middle Side Piercing Kick",
			s: "Kaunde Yopcha Jirugi",
			d: "Execute a middle side piercing kick to A with the right foot keeping the position of the hands as they were in 11.",
		},
		{
			n: 13,
			t: "Right X-Stance · Horizontal Twin Elbow Thrust",
			s: "Kyocha So Sang Palkup Soopyong Tulgi",
			d: "Lower the right foot to A, and then cross the left foot over the right foot, forming a right X-stance toward D while executing a horizontal thrust with a twin elbow.",
		},
		{
			n: 14,
			t: "Sitting Stance · Right Horizontal Punch",
			s: "Annun So Orun Soopyong Jirugi",
			d: "Move the right foot to A to form the sitting stance toward D while executing a right horizontal punch to A.",
		},
		{
			n: 15,
			t: "High Front Strike",
			s: "Sonkal Nopunde Ap Taerigi",
			d: "Execute a high front strike to D with right knife-hand, bringing the left back hand in front of the forehead while standing up toward D.",
		},
		{
			n: 16,
			t: "Right L-Stance · Twin Knife-Hand Block",
			s: "Niunja So Sang Sonkal Makgi",
			d: "Execute a twin knife-hand block to B while forming a right L-stance toward B, pivoting with the right foot.",
		},
		{
			n: 17,
			t: "Mid-Air Kick",
			s: "Twio Dolmyo Chagi",
			d: "Jump to execute a mid-air kick to B with the right foot while spinning clockwise.",
		},
		{
			n: 18,
			t: "Right Walking Stance · Middle Block",
			s: "Gunnun So Doo Palmok Kaunde Makgi",
			d: "Land to B forming a right walking stance toward B while executing a middle block to B with the right double forearm.",
		},
		{
			n: 19,
			t: "Close Ready Stance B",
			s: "Moa Junbi Sogi B",
			d: "Bring the left foot to the right foot to form a close ready stance B toward D.",
		},
		{
			n: 20,
			t: "Right X-Stance · High Side Strike",
			s: "Twigi, Orun Kyocha So Dung Joomuk Nopunde Baro Yop Taerigi",
			d: "Jump to D forming a right X-stance toward BD while executing a high side strike to B with the right back fist bringing the left finger belly to the right side fist.",
		},
		{
			n: 21,
			t: "Right Walking Stance · Rising Block",
			s: "Gunnun So Palmok Bandae Chookyo Makgi",
			d: "Move the left foot to C to form a right walking stance toward D while executing a rising block with the left forearm.",
		},
		{
			n: 22,
			t: "Middle Front Snap Kick",
			s: "Kaunde Apcha Busigi",
			d: "Execute a middle front snap kick to D with the left foot keeping the position of the hands as they were in 21.",
		},
		{
			n: 23,
			t: "Left Walking Stance · High Punch",
			s: "Gunnun So Nopunde Bandae Jirugi",
			d: "Lower the left foot to D forming a left walking stance toward D while executing a high punch to D with the right fist.",
		},
		{
			n: 24,
			t: "Right Walking Stance · Middle Thrust",
			s: "Gunnun So Sun Sonkut Kaunde Tulgi",
			d: "Move the right foot to D to form a right walking stance toward D while executing a middle thrust to D with the right straight fingertip.",
		},
		{
			n: 25,
			t: "Sitting Stance · High Side Strike",
			s: "Annun So Wen Dung Joomuk Nopunde Yop Taerigi",
			d: "Move the left foot to D turning counter-clockwise to form a sitting stance toward A while executing a high side strike to D with the left back fist.",
		},
		{
			n: 26,
			t: "Right Walking Ready Stance",
			s: "Gunnun Junbi Sogi",
			d: "Move the right foot to F turning counter-clockwise to form a right walking ready stance toward F.",
		},
		{
			n: 27,
			t: "Flying High Kick",
			s: "Twimyo Nopi Chagi",
			d: "Jump to execute a flying high kick to F with the right foot.",
		},
		{
			n: 28,
			t: "Right Fixed Stance · Checking Block",
			s: "Dwitbal So Kyocha Sonkal Momchau Makgi",
			d: "Land to F to form a right fixed stance toward F while executing a checking block to F with an X-knife-hand.",
		},
		{
			n: 29,
			t: "Right L-Stance · Pressing Block",
			s: "Niunja So Kyocha Joomuk Noollo Makgi",
			d: "Move the left foot to F forming a right L-stance toward F while executing a pressing block with an X-fist.",
		},
		{
			n: 30,
			t: "Middle Side Front Snap Kick and Middle Wedging Block",
			s: "Kaunde Yobap Cha Busigi Wa Anpalmok Kaunde Hechyo Makgi",
			d: "Execute a middle side front snap kick to F with the left foot while executing a middle wedging block with the inner forearm.",
		},
		{
			n: 31,
			t: "Left Walking Stance · High Vertical Punch",
			s: "Gunnun So Sang Joomuk Nopunde Sewo Jirugi",
			d: "Lower the left foot to F forming a left walking stance toward F while executing a high vertical punch to F with a twin fist.",
		},
		{
			n: 32,
			t: "Right Fixed Stance · Middle Outward Block and Middle Pushing Block",
			s: "Gojung So Sonkal Kaunde Bakuro Baro Makgi Wa Sonbadak Kaunde Bandae Miro Makgi",
			d: "Move the right foot to F to form a right fixed stance toward F while executing a middle outward block with the right knife-hand and a middle pushing block with the left palm.",
		},
		{
			n: 33,
			t: "Right L-Stance · Middle Punch",
			s: "Niunja So Kaunde Yop Jirugi",
			d: "Slide to F forming a right L-stance toward F while executing a middle punch to F with the left fist.",
		},
		{
			n: 34,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja Sogi, Twigi, Orun Niunja So Palmok Kaunde Daebi Makgi",
			d: "Move the left foot to the side rear of the right foot and the right foot to E to form a right L-stance toward F and then jump to E maintaining a right L-stance towards F while executing a middle guarding block to F with the forearm.",
		},
		{
			n: 35,
			t: "Middle Turning Kick",
			s: "Kaunde Dollyo Chagi",
			d: "Execute a middle turning kick to DF with the right foot.",
		},
		{
			n: 36,
			t: "Middle Back Piercing Kick",
			s: "Kaunde Dwitcha Jirugi",
			d: "Lower the right foot to F and then execute a middle back piercing kick to F with the left foot.",
		},
		{
			n: 37,
			t: "Right L-Stance · Middle Guarding Block",
			s: "Niunja So Palmok Kaunde Daebi Makgi",
			d: "Lower the left foot to F to form a right L-stance toward F while executing a middle guarding block to F with the forearm.",
		},
		{
			n: 38,
			t: "Left L-Stance · Upward Block",
			s: "Niunja So Sonbadak Bandae Ollyo Makgi",
			d: "Move the left foot to E forming a left L-stance toward F while executing an upward block to F with the right palm.",
		},
		{
			n: 39,
			t: "Right Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Move the right foot to E forming a right walking stance to E while executing a circular block to ED with the left inner forearm.",
		},
		{
			n: 40,
			t: "Right Walking Stance · Circular Block",
			s: "Gunnun So Anpalmok Dollimyo Makgi",
			d: "Execute a circular block to DE with the right inner forearm while forming a right walking stance toward DF.",
		},
		{
			n: 41,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Wen Joomuk Kaunde Jirugi",
			d: "Move the left foot on line EF to form a sitting stance toward D while executing a middle punch to D with the left fist.",
		},
		{
			n: 42,
			t: "Sitting Stance · Middle Punch",
			s: "Annun So Orun Joomuk Kaunde Jirugi",
			d: "Execute a middle punch to D with the right fist while maintaining a sitting stance toward D.\n\nEnd: Bring the left foot back to a ready posture.",
		},
	],
	"Moon-Moo": [
		{
			n: 1,
			t: "Right Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn to B forming bending ready stance.\n\nSlow motion.",
		},
		{
			n: 2,
			t: "High Side Piercing Kick",
			s: "Nopunde Yopcha Jirugi",
			d: "Kick to B with left foot.\n\nSlow motion.",
		},
		{
			n: 3,
			t: "High Side Piercing Kick",
			s: "Nopunde Yopcha Jirugi",
			d: "Repeat high side kick.\n\nDouble kick.",
		},
		{
			n: 4,
			t: "Sitting Stance · Middle Thrust",
			s: "Annun So Opun Sonkut Kaunde Tulgi",
			d: "Lower to sitting stance, middle fingertip thrust.",
		},
		{
			n: 5,
			t: "High Reverse Hooking Kick",
			s: "Nopunde Bandae Dollyo Gorochagi",
			d: "Reverse hook kick.\n\nSlow motion.",
		},
		{
			n: 6,
			t: "Right X-Stance · Side Strike",
			s: "Twigi Kyocha So Sonkal Taerigi",
			d: "Jump to X-stance, knife-hand strike.",
		},
		{
			n: 7,
			t: "Left Walking Stance · Pressing Block",
			s: "Gunnun So Sonbadak Noollo Makgi",
			d: "Step to A, pressing block.",
		},
		{
			n: 8,
			t: "Right Walking Stance · Pressing Block",
			s: "Gunnun So Sonbadak Noollo Makgi",
			d: "Step to A, opposite pressing block.",
		},
		{
			n: 9,
			t: "One-Leg Stance · High/Low Block",
			s: "Waebal So Sonkal Makgi",
			d: "High and low side block.\n\nSlow motion.",
		},

		{
			n: 10,
			t: "Left Bending Ready Stance A",
			s: "Guburyo Junbi Sogi A",
			d: "Turn to A, bending ready stance.\n\nSlow motion.",
		},
		{
			n: 11,
			t: "High Side Piercing Kick",
			s: "Nopunde Yopcha Jirugi",
			d: "Kick to A.\n\nSlow motion.",
		},
		{
			n: 12,
			t: "High Side Piercing Kick",
			s: "Nopunde Yopcha Jirugi",
			d: "Repeat.\n\nDouble kick.",
		},
		{
			n: 13,
			t: "Sitting Stance · Middle Thrust",
			s: "Annun So Opun Sonkut Kaunde Tulgi",
			d: "Lower, middle fingertip thrust.",
		},
		{
			n: 14,
			t: "High Reverse Hooking Kick",
			s: "Nopunde Bandae Dollyo Gorochagi",
			d: "Reverse hook kick.\n\nSlow motion.",
		},
		{
			n: 15,
			t: "Left X-Stance · Side Strike",
			s: "Twigi Kyocha So Sonkal Taerigi",
			d: "Jump, knife-hand strike.",
		},
		{
			n: 16,
			t: "Right Walking Stance · Pressing Block",
			s: "Gunnun So Sonbadak Noollo Makgi",
			d: "Step to B, pressing block.",
		},
		{
			n: 17,
			t: "Left Walking Stance · Pressing Block",
			s: "Gunnun So Sonbadak Noollo Makgi",
			d: "Opposite pressing block.",
		},
		{
			n: 18,
			t: "One-Leg Stance · High/Low Block",
			s: "Waebal So Sonkal Makgi",
			d: "High and low block.\n\nSlow motion.",
		},

		{
			n: 19,
			t: "Left Bending Ready Stance B",
			s: "Guburyo Junbi Sogi B",
			d: "Turn to C.",
		},
		{
			n: 20,
			t: "High Back Piercing Kick",
			s: "Nopunde Dwitcha Jirugi",
			d: "Back kick.\n\nSlow motion.",
		},
		{
			n: 21,
			t: "Left Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Step, middle punch.",
		},
		{
			n: 22,
			t: "Right Bending Ready Stance B",
			s: "Guburyo Junbi Sogi B",
			d: "Turn to C.",
		},
		{
			n: 23,
			t: "High Back Piercing Kick",
			s: "Nopunde Dwitcha Jirugi",
			d: "Back kick.\n\nSlow motion.",
		},
		{
			n: 24,
			t: "Right Walking Stance · Middle Punch",
			s: "Gunnun So Kaunde Jirugi",
			d: "Step, middle punch.",
		},

		{
			n: 25,
			t: "Rear Foot Stance · Downward Block",
			s: "Dwitbal So Sonbadak Naeryo Makgi",
			d: "Downward block.",
		},
		{
			n: 26,
			t: "Side Front Snap Kick",
			s: "Kaunde Yobap Cha Busigi",
			d: "Side front snap kick.",
		},
		{
			n: 27,
			t: "Sitting Stance · Side Strike",
			s: "Annun So Yop Joomuk Taerigi",
			d: "Side strike.",
		},
		{
			n: 28,
			t: "Sitting Stance · Scooping Block",
			s: "Annun So Sonbadak Duro Makgi",
			d: "Scooping block.",
		},
		{
			n: 29,
			t: "Sitting Stance · Punch",
			s: "Annun So Jirugi",
			d: "Middle punch.\n\nContinuous motion.",
		},
		{
			n: 30,
			t: "Sitting Stance · Low Side Block",
			s: "Annun So Sonkal Makgi",
			d: "Low side block.",
		},

		{ n: 31, t: "Side Pushing Kick", s: "Yopcha Milgi", d: "Push kick." },
		{
			n: 32,
			t: "Reverse Turning Kick",
			s: "Bandae Dollyo Chagi",
			d: "Reverse turning kick.",
		},
		{
			n: 33,
			t: "Walking Stance · High Side Block",
			s: "Gunnun So Sonkal Makgi",
			d: "High side block.",
		},

		{
			n: 34,
			t: "Rear Foot Stance · Downward Block",
			s: "Dwitbal So Sonbadak Naeryo Makgi",
			d: "Downward block.",
		},
		{
			n: 35,
			t: "Side Front Snap Kick",
			s: "Kaunde Yobap Cha Busigi",
			d: "Snap kick.",
		},
		{
			n: 36,
			t: "Sitting Stance · Side Strike",
			s: "Annun So Yop Joomuk Taerigi",
			d: "Side strike.",
		},
		{
			n: 37,
			t: "Sitting Stance · Scooping Block",
			s: "Annun So Sonbadak Duro Makgi",
			d: "Scooping block.",
		},
		{
			n: 38,
			t: "Sitting Stance · Punch",
			s: "Annun So Jirugi",
			d: "Punch.\n\nContinuous motion.",
		},
		{
			n: 39,
			t: "Sitting Stance · Low Side Block",
			s: "Annun So Sonkal Makgi",
			d: "Low side block.",
		},

		{ n: 40, t: "Side Pushing Kick", s: "Yopcha Milgi", d: "Push kick." },
		{
			n: 41,
			t: "Reverse Turning Kick",
			s: "Bandae Dollyo Chagi",
			d: "Reverse turning kick.",
		},
		{
			n: 42,
			t: "Walking Stance · High Side Block",
			s: "Gunnun So Sonkal Makgi",
			d: "High side block.",
		},

		{ n: 43, t: "Twisting Kick", s: "Bituro Chagi", d: "Twisting kick." },
		{
			n: 44,
			t: "Walking Stance · Back Strike",
			s: "Dung Joomuk Taerigi",
			d: "Back fist strike.",
		},
		{
			n: 45,
			t: "Walking Stance · Front Strike",
			s: "Dung Joomuk Ap Taerigi",
			d: "Front strike.",
		},
		{ n: 46, t: "Twisting Kick", s: "Bituro Chagi", d: "Twisting kick." },
		{
			n: 47,
			t: "Walking Stance · Back Strike",
			s: "Dung Joomuk Taerigi",
			d: "Back strike.",
		},
		{
			n: 48,
			t: "Walking Stance · Front Strike",
			s: "Dung Joomuk Ap Taerigi",
			d: "Front strike.",
		},

		{
			n: 49,
			t: "Sweep Kick · L-Stance Block",
			s: "Yop Bal Badak Suroh Chagi",
			d: "Sweep and guard block.",
		},
		{
			n: 50,
			t: "Consecutive Side Kicks",
			s: "Yopcha Tulgi",
			d: "Check then thrust kick.",
		},
		{
			n: 51,
			t: "L-Stance · Outward Strike",
			s: "Sonkal Taerigi",
			d: "Knife-hand strike.",
		},

		{
			n: 52,
			t: "Sweep Kick · L-Stance Block",
			s: "Yop Bal Badak Suroh Chagi",
			d: "Sweep and guard block.",
		},
		{
			n: 53,
			t: "Consecutive Side Kicks",
			s: "Yopcha Tulgi",
			d: "Check then thrust kick.",
		},
		{
			n: 54,
			t: "L-Stance · Outward Strike",
			s: "Sonkal Taerigi",
			d: "Knife-hand strike.",
		},

		{
			n: 55,
			t: "Walking Stance · Middle Punch",
			s: "Gunnun So Jirugi",
			d: "Middle punch.",
		},
		{
			n: 56,
			t: "Right X-Stance · Low Punch",
			s: "Kyocha So Najunde Jirugi",
			d: "Low punch.",
		},
		{
			n: 57,
			t: "Left X-Stance · Low Punch",
			s: "Kyocha So Najunde Jirugi",
			d: "Low punch.",
		},
		{
			n: 58,
			t: "Mid-Air Kick",
			s: "Twio Dolmyo Chagi",
			d: "Jump spinning kick.",
		},
		{
			n: 59,
			t: "Left L-Stance · Guarding Block",
			s: "Niunja So Daebi Makgi",
			d: "Guarding block.",
		},
		{
			n: 60,
			t: "Right Walking Stance · Rising Block",
			s: "Bandal Son Chookyo Makgi",
			d: "Rising block.",
		},
		{
			n: 61,
			t: "Right Walking Stance · High Punch",
			s: "Gunnun So Nopunde Jirugi",
			d: "High punch.\n\nEnd: Return to ready stance.",
		},
	],
	"So-San": [
		{
			n: 1,
			t: "Right Rear Foot Stance · Middle Guarding Block",
			d: "Slide to C forming right dwitbal sogi toward D, execute middle forearm guarding block. (Dwitbal so palmok kaunde daebi makgi)",
		},
		{
			n: 2,
			t: "Left Walking Stance · Middle Vertical Punch",
			d: "Slip left foot to form gunnun sogi toward D, execute vertical punch with right fist. (Gunnun so kaunde bandae sewo jirugi)",
		},
		{
			n: 3,
			t: "Left Rear Foot Stance · Middle Guarding Block",
			d: "Slide to C forming left dwitbal sogi toward D, execute middle guarding block. (Dwitbal so palmok kaunde daebi makgi)",
		},
		{
			n: 4,
			t: "Right Walking Stance · Middle Vertical Punch",
			d: "Slip right foot to form gunnun sogi toward D, execute vertical punch with left fist. (Gunnun so kaunde bandae sewo jirugi)",
		},

		{
			n: 5,
			t: "Left Walking Stance · High Knife-Hand Side Block",
			d: "Form gunnun sogi toward BC, execute high knife-hand side block. (Gunnun so sonkal nopunde bandae yop makgi)",
		},
		{
			n: 6,
			t: "Sitting Stance · Middle Punch",
			d: "Form annun sogi toward BD, execute middle punch with left fist. Perform 5–6 fast. (Annun so wen joomuk kaunde jirugi)",
		},
		{
			n: 7,
			t: "Right Walking Stance · High Knife-Hand Side Block",
			d: "Form gunnun sogi toward BD, execute high knife-hand side block. (Gunnun so sonkal nopunde bandae yop makgi)",
		},
		{
			n: 8,
			t: "Sitting Stance · Middle Punch",
			d: "Form annun sogi toward BD, execute middle punch with right fist. Perform 7–8 fast. (Annun so orun joomuk kaunde jirugi)",
		},

		{
			n: 9,
			t: "Parallel Stance · Twin Knife-Hand Strike",
			d: "Move right foot to C turning clockwise, form narani sogi toward A, execute twin knife-hand horizontal strike. (Narani so sang sonkal soopyong taerigi)",
		},
		{
			n: 10,
			t: "High Side Piercing Kick",
			d: "Execute high side piercing kick to C maintaining hand position. (Nopunde yopcha jirugi)",
		},
		{
			n: 11,
			t: "High Turning Kick",
			d: "Execute high turning kick to D. Perform 10–11 continuously. (Nopunde dollyo chagi)",
		},

		{
			n: 12,
			t: "Right X-Stance · High Back Fist Strike",
			d: "Jump, land in right kyocha sogi toward BD, execute high back fist side strike. (Twigi, orun kyocha so dung joomuk nopunde baro yop taerigi)",
		},

		{
			n: 13,
			t: "Parallel Stance · Twin Knife-Hand Strike",
			d: "Move left foot to C, form narani sogi toward B, execute twin knife-hand strike.",
		},
		{
			n: 14,
			t: "High Side Piercing Kick",
			d: "Execute high side piercing kick to C. (Nopunde yopcha jirugi)",
		},
		{
			n: 15,
			t: "High Turning Kick",
			d: "Execute high turning kick to D. Perform 14–15 continuously. (Nopunde dollyo chagi)",
		},
		{
			n: 16,
			t: "Left X-Stance · High Back Fist Strike",
			d: "Jump, land in left kyocha sogi toward AD, execute high back fist strike.",
		},

		{
			n: 17,
			t: "Right L-Stance · Low Double Punch",
			d: "Move left foot to A forming niunja sogi, execute low double fist punch. (Niuja so doo joomuk najunde jirugi)",
		},
		{
			n: 18,
			t: "Left Walking Stance · Release Motion",
			d: "Slip left foot, twist fists to release hold. (Gunnun so jappyosul tae)",
		},
		{
			n: 19,
			t: "Left Walking Stance · High Punch",
			d: "Execute high punch with right fist.",
		},

		{
			n: 20,
			t: "Left L-Stance · Low Double Punch",
			d: "Move to B, form niunja sogi, execute low double punch.",
		},
		{
			n: 21,
			t: "Right Walking Stance · Release Motion",
			d: "Slip right foot, twist fists to release hold.",
		},
		{
			n: 22,
			t: "Right Walking Stance · High Punch",
			d: "Execute high punch with left fist.",
		},

		{
			n: 23,
			t: "Right L-Stance · Upset Punch",
			d: "Slide to B, execute upset punch with middle knuckle fist. (Joongji joomuk)",
		},
		{
			n: 24,
			t: "Left Walking Stance · Back Fist Strike",
			d: "Slip right foot, execute back fist strike.",
		},
		{
			n: 25,
			t: "Left L-Stance · Upset Punch",
			d: "Slide to A, execute upset punch.",
		},
		{
			n: 26,
			t: "Right Walking Stance · Back Fist Strike",
			d: "Slip left foot, execute back fist strike.",
		},

		{
			n: 27,
			t: "Walking Ready Stance",
			d: "Move to D forming gunnun junbi sogi.",
		},
		{
			n: 28,
			t: "Flying Front Snap Kick",
			d: "Jump and execute front snap kick to C. (Twimyo apcha busigi)",
		},
		{
			n: 29,
			t: "Left L-Stance · Middle Guarding Block",
			d: "Land forming niunja sogi, execute knife-hand guarding block.",
		},

		{
			n: 30,
			t: "Left Walking Stance · High Front Block",
			d: "Move right foot, execute high front block.",
		},
		{
			n: 31,
			t: "Left Walking Stance · Middle Punch",
			d: "Shift forward, execute middle punch.",
		},
		{
			n: 32,
			t: "Right Walking Stance · High Front Block",
			d: "Turn clockwise, execute high front block.",
		},
		{
			n: 33,
			t: "Right Walking Stance · Middle Punch",
			d: "Shift forward, execute middle punch.",
		},

		{
			n: 34,
			t: "Left Walking Stance · Double Arc-Hand Block",
			d: "Execute middle double arc-hand block, look through hands.",
		},
		{
			n: 35,
			t: "Left Walking Stance · Knife-Hand Strike",
			d: "Execute high inward knife-hand strike.",
		},
		{
			n: 36,
			t: "Right Walking Stance · Circular Block",
			d: "Execute circular block with inner forearm.",
		},
		{ n: 37, t: "Right Walking Stance · High Punch", d: "Execute high punch." },

		{ n: 38, t: "Low Front Snap Kick", d: "Execute low front snap kick." },
		{ n: 39, t: "Left Walking Stance · Middle Punch", d: "Lower and punch." },
		{ n: 40, t: "Left Walking Stance · Middle Punch", d: "Second punch fast." },

		{
			n: 41,
			t: "X Knife-Hand Rising Block",
			d: "Execute rising X knife-hand block.",
		},

		{
			n: 42,
			t: "Right Walking Stance · Double Arc-Hand Block",
			d: "Execute double arc-hand block.",
		},
		{
			n: 43,
			t: "Right Walking Stance · Knife-Hand Strike",
			d: "Execute inward strike.",
		},
		{
			n: 44,
			t: "Left Walking Stance · Circular Block",
			d: "Execute circular block.",
		},
		{ n: 45, t: "Left Walking Stance · High Punch", d: "Execute high punch." },

		{ n: 46, t: "Low Front Snap Kick", d: "Execute low front snap kick." },
		{ n: 47, t: "Right Walking Stance · Middle Punch", d: "Lower and punch." },
		{
			n: 48,
			t: "Right Walking Stance · Middle Punch",
			d: "Second punch fast.",
		},

		{
			n: 49,
			t: "X Knife-Hand Rising Block",
			d: "Execute rising X knife-hand block.",
		},

		{
			n: 50,
			t: "Right L-Stance · Low Guarding Block",
			d: "Slide and turn counter-clockwise, execute low guarding block.",
		},
		{
			n: 51,
			t: "Right L-Stance · Middle Guarding Block",
			d: "Jump spin, execute middle guarding block.",
		},
		{
			n: 52,
			t: "Left Walking Stance · Double Block",
			d: "Execute low knife-hand + middle outward block.",
		},
		{
			n: 53,
			t: "Left Walking Stance · High Punch",
			d: "Execute high punch (continuous).",
		},

		{ n: 54, t: "Right L-Stance · Middle Punch", d: "Execute middle punch." },

		{
			n: 55,
			t: "Left L-Stance · Low Guarding Block",
			d: "Slide and turn clockwise.",
		},
		{
			n: 56,
			t: "Left L-Stance · Middle Guarding Block",
			d: "Jump spin, execute guarding block.",
		},
		{
			n: 57,
			t: "Right Walking Stance · Double Block",
			d: "Execute double block.",
		},
		{ n: 58, t: "Right Walking Stance · High Punch", d: "Execute high punch." },

		{ n: 59, t: "Left L-Stance · Middle Punch", d: "Execute middle punch." },

		{
			n: 60,
			t: "Left L-Stance · Scooping Block",
			d: "Slide to C, execute palm scooping block.",
		},
		{ n: 61, t: "Left L-Stance · Middle Punch", d: "Shift and punch." },

		{
			n: 62,
			t: "Left Bending Ready Stance A",
			d: "Turn clockwise to guburyo sogi.",
		},
		{ n: 63, t: "High Side Piercing Kick", d: "Execute side kick." },
		{ n: 64, t: "Right Walking Stance · Middle Punch", d: "Lower and punch." },

		{
			n: 65,
			t: "Right L-Stance · Guarding Block",
			d: "Execute knife-hand guarding block.",
		},
		{
			n: 66,
			t: "Right L-Stance · Scooping Block",
			d: "Slide and execute scooping block.",
		},
		{ n: 67, t: "Right L-Stance · Middle Punch", d: "Shift and punch." },

		{ n: 68, t: "Right Bending Ready Stance A", d: "Turn counter-clockwise." },
		{ n: 69, t: "High Side Piercing Kick", d: "Execute side kick." },
		{ n: 70, t: "Left Walking Stance · Middle Punch", d: "Lower and punch." },

		{
			n: 71,
			t: "Left L-Stance · Guarding Block",
			d: "Execute guarding block.",
		},
		{
			n: 72,
			t: "Right Walking Stance · High Punch",
			d: "Execute high punch. Perform 71–72 continuous.",
		},
	],
	"Se-Jong": [
		{
			n: 1,
			t: "Left Walking Stance · Low Block",
			d: "Move to B forming gunnun sogi, execute low forearm block. (Gunnun so palmok najunde makgi)",
		},
		{
			n: 2,
			t: "Left L-Stance · Twin Forearm Block",
			d: "Move to A forming niunja sogi, execute twin forearm block. (Niunja so sang palmok makgi)",
		},
		{
			n: 3,
			t: "Middle Side Piercing Kick",
			d: "Execute middle side piercing kick to D. (Kaunde yopcha jirugi)",
		},
		{
			n: 4,
			t: "Left Walking Stance · Rising Block",
			d: "Move to F forming gunnun sogi, execute rising block. (Gunnun so palmok chookyo makgi)",
		},
		{
			n: 5,
			t: "Sitting Stance · Knife-Hand Strike",
			d: "Move to E forming annun sogi, execute middle knife-hand strike. (Annun so sonkal kaunde yop taerigi)",
		},

		{ n: 6, t: "Close Ready Stance B", d: "Return to moa junbi sogi B." },
		{
			n: 7,
			t: "Left X-Stance · Back Fist Strike",
			d: "Jump to D forming kyocha sogi, execute high back fist strike. (Twigi kyocha so dung joomuk nopunde baro yop taerigi)",
		},
		{
			n: 8,
			t: "Right Walking Stance · High Punch",
			d: "Move to G forming gunnun sogi, execute high punch. (Gunnun so nopunde jirugi)",
		},
		{
			n: 9,
			t: "Left Fixed Stance · Guarding Block",
			d: "Move along GH forming gojung sogi, execute high guarding block. (Gojung so palmok nopunde daebi makgi)",
		},
		{
			n: 10,
			t: "Right Walking Stance · Fingertip Thrust",
			d: "Move to H forming gunnun sogi, execute middle fingertip thrust. (Gunnun so sun sonkut kaunde tulgi)",
		},

		{
			n: 11,
			t: "Left Walking Stance · Back Fist Strike",
			d: "Move to G forming gunnun sogi, execute high back fist strike. (Gunnun so dung joomuk nopunde yop taerigi)",
		},
		{
			n: 12,
			t: "Sitting Stance · Scooping Block",
			d: "Move along GH forming annun sogi, execute scooping block. (Annun so sonbadak duro makgi)",
		},
		{
			n: 13,
			t: "Middle Turning Kick",
			d: "Execute middle turning kick to C. (Kaunde dollyo chagi)",
		},
		{
			n: 14,
			t: "Left X-Stance · Double Forearm Block",
			d: "Jump to C forming kyocha sogi, execute high double forearm block. (Twigi doo palmok nopunde makgi)",
		},
		{
			n: 15,
			t: "Sitting Stance · Horizontal Extension",
			d: "Move to F forming annun sogi, extend right fist slowly. (Slow motion)",
		},

		{
			n: 16,
			t: "Sitting Stance · Back Fist Strike",
			d: "Execute front strike with left back fist. (Annun so dung joomuk ap taerigi)",
		},
		{
			n: 17,
			t: "Left Diagonal Stance · Pressing Block",
			d: "Move to E forming sasun sogi, execute twin palm pressing block. (Sang sonbadak noollo makgi)",
		},
		{
			n: 18,
			t: "Left Walking Stance · Double Arc-Hand Block",
			d: "Form gunnun sogi toward CE, execute double arc-hand block. (Doo bandalson makgi)",
		},

		{
			n: 19,
			t: "Right One-Leg Stance · Double Block",
			d: "Form waebal sogi, execute high outer forearm block and low forearm block simultaneously.",
		},
		{
			n: 20,
			t: "Right Walking Stance · Pressing Block",
			d: "Lower to D forming gunnun sogi, execute pressing block slowly. (Sonbadak noollo makgi)",
		},
		{
			n: 21,
			t: "Right One-Leg Stance · Back Forearm Strike",
			d: "Form waebal sogi, strike left palm with right back forearm.",
		},
		{
			n: 22,
			t: "Right Fixed Stance · Elbow Thrust",
			d: "Turn clockwise forming gojung sogi, execute side elbow thrust. (Yop palkup tulgi)",
		},

		{
			n: 23,
			t: "Left L-Stance · Guarding Block",
			d: "Move to A forming niunja sogi, execute high knife-hand guarding block. (Sonkal nopunde daebi makgi)",
		},
		{
			n: 24,
			t: "Right L-Stance · Middle Punch",
			d: "Move to B forming niunja sogi, execute middle punch. (Niunja so kaunde baro jirugi)",
		},
	],
	"Tong-Il": [
		{
			n: 1,
			t: "Left Walking Stance · Twin Fist Punch",
			d: "Move to C forming gunnun sogi toward D, execute twin fist middle punch. Perform slowly. (Sang joomuk kaunde jirugi)",
		},
		{
			n: 2,
			t: "Right Walking Stance · Twin Knife-Hand Strike",
			d: "Move to C forming gunnun sogi, execute twin knife-hand horizontal strike. Perform slowly.",
		},

		{
			n: 3,
			t: "Right Rear Foot Stance · Inward Block",
			d: "Form dwitbal sogi, execute middle inward block with outer forearm.",
		},
		{
			n: 4,
			t: "Left Walking Stance · Low Palm Block",
			d: "Slip forward forming gunnun sogi, execute low inward palm block.",
		},

		{
			n: 5,
			t: "Left L-Stance · Middle Punch",
			d: "Form niunja sogi, execute middle punch.",
		},
		{
			n: 6,
			t: "Left L-Stance · Middle Punch",
			d: "Execute second punch fast. Perform 5–6 in fast motion.",
		},

		{
			n: 7,
			t: "Right L-Stance · Back Hand Strike",
			d: "Stamp to form niunja sogi, execute high outward back hand strike.",
		},
		{
			n: 8,
			t: "Inward Vertical Kick",
			d: "Execute inward vertical kick with reverse footsword.",
		},
		{
			n: 9,
			t: "Left L-Stance · Back Hand Strike",
			d: "Stamp and execute high outward back hand strike.",
		},
		{
			n: 10,
			t: "Inward Vertical Kick",
			d: "Execute inward vertical kick with reverse footsword.",
		},

		{
			n: 11,
			t: "Right L-Stance · Twin Palm Block",
			d: "Execute horizontal twin palm block. Perform slowly.",
		},
		{
			n: 12,
			t: "Right Walking Stance · Reverse Knife-Hand Block",
			d: "Execute high side block. Perform slowly.",
		},
		{
			n: 13,
			t: "Right Walking Stance · Reverse Knife-Hand Block",
			d: "Execute middle side block. Perform slowly.",
		},

		{
			n: 14,
			t: "Right Walking Stance · Middle Punch",
			d: "Execute middle punch.",
		},
		{
			n: 15,
			t: "Right Walking Stance · Middle Punch",
			d: "Execute second punch fast.",
		},

		{ n: 16, t: "Downward Kick", d: "Execute downward kick." },
		{
			n: 17,
			t: "Left L-Stance · Downward Strike",
			d: "Lower and execute downward back fist strike.",
		},
		{ n: 18, t: "Outward Vertical Kick", d: "Execute outward vertical kick." },
		{
			n: 19,
			t: "Right L-Stance · Downward Strike",
			d: "Lower and execute downward back fist strike.",
		},

		{
			n: 20,
			t: "Right Walking Stance · High Punch",
			d: "Pivot and execute high punch.",
		},
		{ n: 21, t: "Right Walking Stance · High Punch", d: "Second punch fast." },

		{
			n: 22,
			t: "Right Rear Foot Stance · Upward Block",
			d: "Execute upward block with bow wrist.",
		},
		{
			n: 23,
			t: "Left Rear Foot Stance · Upward Block",
			d: "Execute upward block.",
		},

		{
			n: 24,
			t: "Left Walking Stance · Pressing Block",
			d: "Execute pressing palm block.",
		},
		{
			n: 25,
			t: "Right Walking Stance · Pressing Block",
			d: "Execute pressing palm block. Perform slowly.",
		},

		{
			n: 26,
			t: "Close Stance · Circular Motion",
			d: "Form close stance, circular motion striking palm.",
		},

		{
			n: 27,
			t: "Left Walking Stance · Rising Knife-Hand Block",
			d: "Execute rising knife-hand block.",
		},
		{ n: 28, t: "Left Walking Stance · High Punch", d: "Execute high punch." },

		{ n: 29, t: "Left L-Stance · Upset Punch", d: "Execute upset punch." },
		{
			n: 30,
			t: "Left Walking Stance · Fingertip Thrust",
			d: "Execute angle fingertip thrust.",
		},

		{
			n: 31,
			t: "Right Walking Stance · Rising Knife-Hand Block",
			d: "Execute rising block.",
		},
		{ n: 32, t: "Right Walking Stance · High Punch", d: "Execute high punch." },

		{ n: 33, t: "Right L-Stance · Upset Punch", d: "Execute upset punch." },
		{
			n: 34,
			t: "Right Walking Stance · Fingertip Thrust",
			d: "Execute fingertip thrust.",
		},

		{
			n: 35,
			t: "Left L-Stance · Guarding Block",
			d: "Execute low guarding block with reverse knife-hand.",
		},
		{
			n: 36,
			t: "Right L-Stance · Guarding Block",
			d: "Execute low guarding block.",
		},

		{
			n: 37,
			t: "Left Walking Stance · Double Block",
			d: "Execute low forearm + middle knife-hand block.",
		},
		{
			n: 38,
			t: "Right Walking Stance · Twin Vertical Punch",
			d: "Execute twin vertical punch.",
		},

		{
			n: 39,
			t: "Left One-Leg Stance · Back Forearm Strike",
			d: "Execute strike in one-leg stance.",
		},
		{ n: 40, t: "Back Piercing Kick", d: "Execute middle back piercing kick." },

		{ n: 41, t: "Sitting Stance · W-Block", d: "Execute W-shape block." },
		{ n: 42, t: "Sitting Stance · W-Block", d: "Slide and repeat block." },
		{ n: 43, t: "Sitting Stance · W-Block", d: "Turn and execute block." },
		{ n: 44, t: "Sitting Stance · W-Block", d: "Slide and repeat block." },

		{
			n: 45,
			t: "Right One-Leg Stance · Back Forearm Strike",
			d: "Execute strike.",
		},
		{ n: 46, t: "High Back Piercing Kick", d: "Execute high back kick." },

		{
			n: 47,
			t: "Left X-Stance · X-Fist Pressing Block",
			d: "Execute pressing block.",
		},
		{
			n: 48,
			t: "Left Walking Stance · Under Fist Strike",
			d: "Execute front strike.",
		},
		{
			n: 49,
			t: "Right Walking Stance · Under Fist Strike",
			d: "Execute front strike.",
		},

		{
			n: 50,
			t: "Right Walking Stance · Pushing Block",
			d: "Execute pushing block.",
		},
		{
			n: 51,
			t: "Left Walking Stance · Circular Block",
			d: "Execute circular knife-hand block.",
		},
		{
			n: 52,
			t: "Left Walking Stance · Pushing Block",
			d: "Execute pushing block.",
		},
		{
			n: 53,
			t: "Right Walking Stance · Circular Block",
			d: "Execute circular knife-hand block.",
		},

		{
			n: 54,
			t: "High Side Kick + Elbow Strike",
			d: "Execute high side kick, land into twin back elbow thrust.",
		},

		{
			n: 55,
			t: "Sitting Stance · Side Punch",
			d: "Execute middle side punch.",
		},
		{
			n: 56,
			t: "Left Walking Stance · Middle Punch",
			d: "Pivot and execute middle punch.",
		},
	],
};

var BREQS = [
	{
		grade: "White → White/Yellow",
		from: "White",
		to: "White/Yellow",
		meaning:
			"Signifies innocence, as that of a beginner student who has no previous knowledge of Taekwon-Do.",
		reqs: [
			"PATTERNS: Saju Jirugi, Saju Makgi",
			"BASICS: Sitting stance middle punch",
			"BASICS: Walking stance middle punch",
			"BASICS: Inner forearm middle block",
			"BASICS: Outer forearm low block",
			"BASICS: Front snap kick",
			"BASICS: Walking stance punch",
			"BASICS: Basic coordination drills",
			"THEORY: What does Taekwon-Do mean?",
			"THEORY: Who founded Taekwon-Do?",
			"THEORY: Name the 5 tenets",
			"THEORY: What does a white belt signify?",
			"NOTE: Everyone starts here. Just turning up is a win. Relax, listen, and enjoy learning something new.",
		],
	},

	{
		grade: "White/Yellow → Yellow",
		from: "White/Yellow",
		to: "Yellow",
		meaning:
			"Signifies the earth from which a plant sprouts and takes root, as the Taekwon-Do foundation is being laid.",
		reqs: [
			"PATTERNS: Chon-Ji (19 moves)",
			"BASICS: L-stance middle block",
			"BASICS: Walking stance rising block",
			"BASICS: Walking stance double punch",
			"BASICS: Front kick and walking stance double punch",
			"BASICS: Turning kick",
			"BASICS: Side kick",
			"BASICS: Outer forearm low block",
			"BASICS: Inner forearm middle block",
			"BASICS: Walking stance middle punch",
			"BASICS: Basic combination work",
			"SPARRING: 1 vs 1 sparring",
			"THEORY: What does Chon-Ji mean?",
			"THEORY: How many moves are in Chon-Ji?",
			"THEORY: What are the Korean terms for high, middle, and low section?",
			"THEORY: What is the Korean term for L-stance?",
			"THEORY: What does Chagi mean?",
			"NOTE: You’re no longer a complete beginner. Keep showing up, keep learning, and trust the process.",
		],
	},

	{
		grade: "Yellow → Yellow/Green",
		from: "Yellow",
		to: "Yellow/Green",
		meaning: "Signifies the earth from which a plant sprouts and takes root.",
		reqs: [
			"PATTERNS: Dan-Gun (21 moves)",
			"BASICS: L-stance knife-hand guarding block",
			"BASICS: Walking stance high punch",
			"BASICS: Turning kick and punch",
			"BASICS: Side kick",
			"BASICS: Front kick",
			"BASICS: Walking stance double punch",
			"BASICS: Outer forearm block variations",
			"BASICS: Basic hand combinations",
			"SPARRING: 1 vs 1 sparring",
			"THEORY: Who is Dan-Gun?",
			"THEORY: How many moves are in Dan-Gun?",
			"THEORY: What is the Korean term for knife-hand?",
			"THEORY: What is the Korean term for turning kick?",
			"THEORY: What does Makgi mean?",
			"NOTE: You’re starting to understand the basics now. Stay consistent and don’t rush your progress.",
		],
	},

	{
		grade: "Yellow/Green → Green",
		from: "Yellow/Green",
		to: "Green",
		meaning:
			"Signifies the plant’s growth, as Taekwon-Do skills begin to develop.",
		reqs: [
			"PATTERNS: Do-San (24 moves)",
			"BASICS: Outer forearm high block",
			"BASICS: Side piercing kick and punch",
			"BASICS: Turning kick",
			"BASICS: Front kick combinations",
			"BASICS: Walking stance hand combinations",
			"BASICS: L-stance guarding block",
			"BASICS: Basic combination work",
			"SPARRING: 1-step sparring (2 attacks)",
			"THEORY: Who is Do-San?",
			"THEORY: How many moves are in Do-San?",
			"THEORY: What is the Korean term for side kick?",
			"THEORY: What does Sogi mean?",
			"THEORY: What is the Korean term for outer forearm?",
			"NOTE: This is where things start to feel real. Focus on control, not speed. You’re doing well.",
		],
	},

	{
		grade: "Green → Green/Blue",
		from: "Green",
		to: "Green/Blue",
		meaning: "Signifies the plant’s continued growth.",
		reqs: [
			"PATTERNS: Won-Hyo (28 moves)",
			"BASICS: Inner forearm guarding block",
			"BASICS: Low front snap kick and punch",
			"BASICS: Turning kick",
			"BASICS: Side kick",
			"BASICS: Walking stance combinations",
			"BASICS: L-stance middle block",
			"BASICS: Basic combination work",
			"SPARRING: 1 vs 1 sparring",
			"THEORY: Who is Won-Hyo?",
			"THEORY: How many moves are in Won-Hyo?",
			"THEORY: What is the Korean term for guarding block?",
			"THEORY: What does Ap mean?",
			"THEORY: What is the Korean term for front kick?",
			"NOTE: You’ve come a long way already. Keep building your confidence and believe in your ability.",
		],
	},

	{
		grade: "Green/Blue → Blue",
		from: "Green/Blue",
		to: "Blue",
		meaning: "Signifies the sky, towards which the plant matures into a tree.",
		reqs: [
			"PATTERNS: Yul-Gok (38 moves)",
			"BASICS: Outer forearm guarding block",
			"BASICS: Side piercing kick and punch",
			"BASICS: Turning kick",
			"BASICS: Back kick introduction",
			"BASICS: Walking stance combinations",
			"BASICS: L-stance guarding block",
			"BASICS: Advanced combination work",
			"SPARRING: 1 vs 1 sparring",
			"POWER TEST: Hand or foot",
			"THEORY: Who is Yul-Gok?",
			"THEORY: How many moves are in Yul-Gok?",
			"THEORY: What does Yul-Gok represent?",
			"THEORY: What is the Korean term for turning kick?",
			"THEORY: What does Jirugi mean?",
			"NOTE: Your techniques are improving. Now focus on sharpening them and staying disciplined.",
		],
	},

	{
		grade: "Blue → Blue/Red",
		from: "Blue",
		to: "Blue/Red",
		meaning: "Signifies the continued growth towards maturity.",
		reqs: [
			"PATTERNS: Joong-Gun (32 moves)",
			"BASICS: Pressing block",
			"BASICS: Back kick and punch",
			"BASICS: Turning kick",
			"BASICS: Side piercing kick",
			"BASICS: Reverse turning kick introduction",
			"BASICS: Walking stance combinations",
			"BASICS: L-stance guarding block",
			"SPARRING: 1 vs 1 sparring",
			"POWER TEST: Hand and foot",
			"THEORY: Who is Joong-Gun?",
			"THEORY: How many moves are in Joong-Gun?",
			"THEORY: What do the 32 movements represent?",
			"THEORY: What is the Korean term for back kick?",
			"THEORY: What does Bandae mean?",
			"NOTE: This is a step up. Stay focused, stay calm, and show the control you’ve been developing.",
		],
	},

	{
		grade: "Blue/Red → Red",
		from: "Blue/Red",
		to: "Red",
		meaning: "Signifies danger, requiring control and discipline.",
		reqs: [
			"PATTERNS: Toi-Gye (37 moves)",
			"BASICS: Twin forearm block",
			"BASICS: Reverse turning kick",
			"BASICS: Side piercing kick",
			"BASICS: Back kick",
			"BASICS: Turning kick combinations",
			"BASICS: L-stance guarding block",
			"BASICS: Advanced combination work",
			"SPARRING: 1 vs 1 sparring",
			"POWER TEST: Hand and foot",
			"THEORY: Who is Toi-Gye?",
			"THEORY: How many moves are in Toi-Gye?",
			"THEORY: What does Toi-Gye represent?",
			"THEORY: What is the Korean term for reverse turning kick?",
			"THEORY: What does Dwit mean?",
			"NOTE: You’re getting close now. Stay sharp, stay disciplined, and trust your training.",
		],
	},

	{
		grade: "Red → Red/Black",
		from: "Red",
		to: "Red/Black",
		meaning: "Signifies danger, cautioning the student to exercise control.",
		reqs: [
			"PATTERNS: Hwa-Rang (29 moves)",
			"BASICS: Wedging block",
			"BASICS: Hook kick combinations",
			"BASICS: Reverse turning kick",
			"BASICS: Back kick",
			"BASICS: Side piercing kick",
			"BASICS: L-stance guarding block",
			"BASICS: Advanced combination work",
			"SPARRING: 1 vs 1 sparring",
			"SPARRING: 2 vs 1 sparring",
			"POWER TEST: Hand and foot",
			"POWER TEST: Reverse turning kick",
			"THEORY: Who is Hwa-Rang?",
			"THEORY: How many moves are in Hwa-Rang?",
			"THEORY: What do the 29 movements represent?",
			"THEORY: What is the Korean term for hook kick?",
			"THEORY: What does Dollyo mean?",
			"NOTE: You’ve worked hard to get here. Stay composed and show the standard you’re capable of.",
		],
	},
	{
		grade: "1st Degree",
		from: "1st Dan",
		to: "2nd Dan",
		meaning:
			"Black belt training develops maturity, control and deeper understanding.",
		reqs: [
			"PATTERNS: Kwang-Gae, Po-Eun, Ge-Baek",
			"BASICS: Line work up and down the hall using various hand and foot techniques",
			"SPARRING: 1-step sparring",
			"SPARRING: 1 vs 1 sparring",
			"SPARRING: 1 vs 2 sparring",
			"POWER TEST: Side kick",
			"POWER TEST: Reverse turning kick",
			"THEORY: Meaning of Kwang-Gae",
			"THEORY: Meaning of Po-Eun",
			"THEORY: Meaning of Ge-Baek",
			"THEORY: Number of movements in Kwang-Gae",
			"THEORY: Number of movements in Po-Eun",
			"THEORY: Number of movements in Ge-Baek",
		],
	},
	{
		grade: "2nd Degree",
		from: "2nd Dan",
		to: "3rd Dan",
		meaning:
			"Continued development of technical skill, confidence and understanding.",
		reqs: [
			"PATTERNS: Eui-Am, Choong-Jang, Juche",
			"BASICS: Line work up and down the hall using various hand and foot techniques",
			"SPARRING: 1-step sparring",
			"SPARRING: 1 vs 1 sparring",
			"SPARRING: 1 vs 2 sparring",
			"POWER TEST: Side kick",
			"POWER TEST: Reverse turning kick",
			"THEORY: Meaning of Eui-Am",
			"THEORY: Meaning of Choong-Jang",
			"THEORY: Meaning of Juche",
			"THEORY: Number of movements in Eui-Am",
			"THEORY: Number of movements in Choong-Jang",
			"THEORY: Number of movements in Juche",
		],
	},
	{
		grade: "3rd Degree",
		from: "3rd Dan",
		to: "4th Dan",
		meaning:
			"Preparation for senior responsibility and instructor-level standards.",
		reqs: [
			"PATTERNS: Sam-Il, Yoo-Sin, Choi-Yong",
			"BASICS: Line work up and down the hall using various hand and foot techniques",
			"SPARRING: 1-step sparring",
			"SPARRING: 1 vs 1 sparring",
			"SPARRING: 1 vs 2 sparring",
			"POWER TEST: Side kick",
			"POWER TEST: Reverse turning kick",
			"THEORY: Meaning of Sam-Il",
			"THEORY: Meaning of Yoo-Sin",
			"THEORY: Meaning of Choi-Yong",
			"THEORY: Number of movements in Sam-Il",
			"THEORY: Number of movements in Yoo-Sin",
			"THEORY: Number of movements in Choi-Yong",
		],
	},
	{
		grade: "4th Degree",
		from: "4th Dan",
		to: "5th Dan",
		meaning:
			"Senior grade development with higher technical and teaching expectations.",
		reqs: [
			"PATTERNS: Yon-Gae, Ul-Ji, Moon-Moo",
			"BASICS: Line work up and down the hall using various hand and foot techniques",
			"SPARRING: 1-step sparring",
			"SPARRING: 1 vs 1 sparring",
			"SPARRING: 1 vs 2 sparring",
			"POWER TEST: Side kick",
			"POWER TEST: Reverse turning kick",
			"THEORY: Meaning of Yon-Gae",
			"THEORY: Meaning of Ul-Ji",
			"THEORY: Meaning of Moon-Moo",
			"THEORY: Number of movements in Yon-Gae",
			"THEORY: Number of movements in Ul-Ji",
			"THEORY: Number of movements in Moon-Moo",
		],
	},
	{
		grade: "5th Degree",
		from: "5th Dan",
		to: "6th Dan",
		meaning:
			"Advanced senior grade development with deeper technical understanding.",
		reqs: [
			"PATTERNS: So-San, Se-Jong",
			"BASICS: Line work up and down the hall using various hand and foot techniques",
			"SPARRING: 1-step sparring",
			"SPARRING: 1 vs 1 sparring",
			"SPARRING: 1 vs 2 sparring",
			"POWER TEST: Side kick",
			"POWER TEST: Reverse turning kick",
			"THEORY: Meaning of So-San",
			"THEORY: Meaning of Se-Jong",
			"THEORY: Number of movements in So-San",
			"THEORY: Number of movements in Se-Jong",
		],
	},
	{
		grade: "6th Degree",
		from: "6th Dan",
		to: "7th Dan",
		meaning:
			"Preparation for Master level, with strong technical knowledge and leadership.",
		reqs: [
			"PATTERNS: Tong-Il",
			"BASICS: Line work up and down the hall using various hand and foot techniques",
			"SPARRING: 1-step sparring",
			"SPARRING: 1 vs 1 sparring",
			"SPARRING: 1 vs 2 sparring",
			"POWER TEST: Side kick",
			"POWER TEST: Reverse turning kick",
			"THEORY: Meaning of Tong-Il",
			"THEORY: Number of movements in Tong-Il",
		],
	},
];
var QLEV = [
	{
		label: "White to Yellow Stripe",
		grades: "10th-9th Gup",
		emoji: "White",
		color: "#ffffff",
		qs: [
			{ q: "Who founded ITF Taekwon-Do?", o: ["Master Kim", "General Choi Hong Hi", "Grand Master Park", "Admiral Yi Soon-Sin"], a: 1 },
			{ q: "What does Taekwon-Do literally mean?", o: ["Art of Hand and Foot", "Way of the Empty Hand", "Korean Martial Art", "Art of Kicking"], a: 0 },
			{ q: "How many tenets of Taekwon-Do are there?", o: ["3", "4", "5", "6"], a: 2 },
			{ q: "What does a white belt signify?", o: ["Danger", "Innocence or lack of knowledge", "Growth", "Maturity"], a: 1 },
			{ q: "What is the Korean word for pattern?", o: ["Matsogi", "Tul", "Makgi", "Jirugi"], a: 1 },
			{ q: "What is the Korean word for uniform?", o: ["Dobok", "Sabum", "Tul", "Dan"], a: 0 },
			{ q: "What does Junbi mean?", o: ["Attention", "Ready", "Begin", "Stop"], a: 1 },
			{ q: "What does Sijak mean?", o: ["Attention", "Ready", "Begin", "Stop"], a: 2 },
			{ q: "What does Charyot mean?", o: ["Attention", "Ready", "Begin", "Bow"], a: 0 },
			{ q: "What does Kyong-ye mean?", o: ["Attention", "Ready", "Bow", "Stop"], a: 2 },
			{ q: "What does Gomman mean?", o: ["Begin", "Bow", "Stop", "Relax"], a: 2 },
			{ q: "What does Haesan mean?", o: ["Stop", "Begin", "Class dismissed", "Relax"], a: 2 },
			{ q: "What is the Korean for the training hall?", o: ["Dobok", "Dojang", "Sabum", "Tul"], a: 1 },
			{ q: "What does Kaunde mean?", o: ["High", "Low", "Middle", "Outer"], a: 2 },
			{ q: "What does Nopunde mean?", o: ["Middle", "Low", "Inner", "High"], a: 3 },
			{ q: "What does Najunde mean?", o: ["High", "Middle", "Low", "Outer"], a: 2 },
			{ q: "What does Makgi mean?", o: ["Punch", "Block", "Kick", "Strike"], a: 1 },
			{ q: "What does Chagi mean?", o: ["Block", "Punch", "Strike", "Kick"], a: 3 },
			{ q: "What does Jirugi mean?", o: ["Block", "Kick", "Punch", "Strike"], a: 2 },
			{ q: "Korean term for walking stance?", o: ["Annun Sogi", "Niunja Sogi", "Gunnun Sogi", "Moa Sogi"], a: 2 },
			{ q: "What are the pre-pattern exercises for white belt called?", o: ["Chon-Ji and Dan-Gun", "Saju Jirugi and Saju Makgi", "Tul and Matsogi", "Jirugi and Makgi"], a: 1 },
			{ q: "What does Saju mean?", o: ["Two directional", "Three directional", "Four directional", "Eight directional"], a: 2 },
			{ q: "What does Saju Jirugi mean?", o: ["Four directional block", "Four directional kick", "Four directional punch", "Four directional strike"], a: 2 },
			{ q: "What does Saju Makgi mean?", o: ["Four directional punch", "Four directional block", "Four directional kick", "Four directional strike"], a: 1 },
			{ q: "Which tenet means never giving up?", o: ["Courtesy", "Integrity", "Perseverance", "Indomitable Spirit"], a: 2 },
			{ q: "Which tenet means being honest and having strong moral principles?", o: ["Courtesy", "Integrity", "Perseverance", "Self Control"], a: 1 },
			{ q: "What does Ap Joomuk mean?", o: ["Knifehand", "Forefist", "Palm", "Back fist"], a: 1 },
			{ q: "When was the name Taekwon-Do officially recognised?", o: ["1945", "1950", "1955", "1966"], a: 2 },
			{ q: "What is the Korean for a colour belt grade?", o: ["Dan", "Kup", "Sabum", "Tul"], a: 1 },
			{ q: "What is the Korean for a black belt degree?", o: ["Kup", "Dan", "Sabum", "Dobok"], a: 1 },
			{ q: "What does Swiyo mean?", o: ["Attention", "Ready", "Begin", "Relax / at ease"], a: 3 },
			{ q: "What does Taerigi mean?", o: ["Kick", "Block", "Punch", "Strike"], a: 3 },
			{ q: "What is the Korean for the instructor?", o: ["Jeja", "Dan", "Sabum", "Kup"], a: 2 },
			{ q: "What is the Korean for a student?", o: ["Sabum", "Jeja", "Dan", "Dobok"], a: 1 },
			{ q: "Which tenet means showing respect and good manners?", o: ["Integrity", "Perseverance", "Courtesy", "Self Control"], a: 2 },
			{ q: "Which tenet means controlling your actions and emotions?", o: ["Integrity", "Perseverance", "Courtesy", "Self Control"], a: 3 },
			{ q: "Which tenet means having unconquerable spirit?", o: ["Integrity", "Perseverance", "Courtesy", "Indomitable Spirit"], a: 3 },
			{ q: "What does Pa-ro mean?", o: ["Stop", "Begin", "Return to starting position", "Bow"], a: 2 },
			{ q: "What does Tulgi mean?", o: ["Punch", "Strike", "Thrust", "Kick"], a: 2 },
			{ q: "What foot tool is used for a front snap kick?", o: ["Heel", "Instep", "Ball of the foot", "Footsword"], a: 2 },
			{ q: "What is the Korean for the footsword?", o: ["Apkumchi", "Baldung", "Balkal", "Dwitchook"], a: 2 },
			{ q: "What is the Korean for the instep?", o: ["Apkumchi", "Baldung", "Balkal", "Dwitchook"], a: 1 },
			{ q: "What is the Korean for the ball of the foot?", o: ["Baldung", "Balkal", "Apkumchi", "Dwitchook"], a: 2 },
			{ q: "What does Sonkal mean?", o: ["Fist", "Palm", "Knifehand", "Forearm"], a: 2 },
			{ q: "What does Sonbadak mean?", o: ["Knifehand", "Forefist", "Palm", "Back fist"], a: 2 },
			{ q: "What does Dung Joomuk mean?", o: ["Forefist", "Palm", "Back fist", "Knifehand"], a: 2 },
			{ q: "What does Palkup mean?", o: ["Knee", "Elbow", "Shoulder", "Wrist"], a: 1 },
			{ q: "What does Moorup mean?", o: ["Elbow", "Wrist", "Knee", "Shoulder"], a: 2 },
			{ q: "Korean for sitting stance?", o: ["Niunja Sogi", "Gunnun Sogi", "Annun Sogi", "Moa Sogi"], a: 2 },
			{ q: "Korean term for L-stance?", o: ["Gunnun Sogi", "Niunja Sogi", "Annun Sogi", "Gojung Sogi"], a: 1 },
			{ q: "What does Naeryo mean?", o: ["Upward", "Inward", "Downward", "Outward"], a: 2 },
			{ q: "What does Dollyo Chagi mean?", o: ["Side kick", "Turning kick", "Back kick", "Hook kick"], a: 1 },
			{ q: "What does Ap mean?", o: ["Back", "Side", "Front", "Inner"], a: 2 },
			{ q: "What does Dwit mean?", o: ["Front", "Side", "Back / rear", "Inner"], a: 2 },
			{ q: "What does Yop mean?", o: ["Front", "Back", "Inner", "Side"], a: 3 },
			{ q: "What does Baro mean?", o: ["Reverse", "Obverse / Return to ready", "High", "Outer"], a: 1 },
			{ q: "What does Bandae mean?", o: ["Obverse", "Low", "Reverse", "Inner"], a: 2 },
			{ q: "How many patterns are in the ITF Chang-Hon system?", o: ["20", "22", "24", "26"], a: 2 },
			{ q: "What is the Korean for the inner forearm?", o: ["Bakat Palmok", "An Palmok", "Dung Palmok", "Sonkal"], a: 1 },
			{ q: "What is the Korean for the outer forearm?", o: ["An Palmok", "Bakat Palmok", "Sonbadak", "Palkup"], a: 1 },
			{ q: "In which year was the ITF founded?", o: ["1955", "1960", "1966", "1972"], a: 2 },
			{ q: "What does An mean?", o: ["Outer", "Side", "Back", "Inner"], a: 3 },
			{ q: "What does Bakat mean?", o: ["Inner", "Side", "Outer", "Back"], a: 2 },
		],
	},
	{
		label: "Yellow Stripe to Yellow Belt",
		grades: "9th-8th Gup",
		emoji: "Yellow",
		color: "#f5c518",
		qs: [
			{ q: "What does Chon-Ji mean?", o: ["Holy warrior", "Heaven and Earth", "The patriot", "Great general"], a: 1 },
			{ q: "How many moves does Chon-Ji have?", o: ["16", "17", "19", "21"], a: 2 },
			{ q: "Which belt requires Chon-Ji?", o: ["White belt", "Yellow stripe", "Yellow belt", "Green stripe"], a: 1 },
			{ q: "What does a yellow belt signify?", o: ["Danger", "Innocence", "Earth from which a plant sprouts", "Maturity"], a: 2 },
			{ q: "Who is Dan-Gun named after?", o: ["A general", "A monk", "The legendary founder of Korea", "A scholar"], a: 2 },
			{ q: "How many moves does Dan-Gun have?", o: ["19", "21", "24", "28"], a: 1 },
			{ q: "Which belt requires Dan-Gun?", o: ["Yellow stripe", "Yellow belt", "Green stripe", "Green belt"], a: 1 },
			{ q: "What does the ITF stand for?", o: ["International Taekwondo Foundation", "International Taekwon-Do Federation", "International Training Federation", "International Tae-Kwon-Do Forum"], a: 1 },
			{ q: "What foot tool is used for a turning kick?", o: ["Heel", "Instep", "Ball of the foot", "Footsword"], a: 2 },
			{ q: "What foot tool is used for a side kick?", o: ["Ball of foot", "Instep", "Heel or footsword", "Toes"], a: 2 },
			{ q: "What foot tool is used for a back kick?", o: ["Ball of foot", "Instep", "Heel", "Footsword"], a: 2 },
			{ q: "What does Twimyo mean?", o: ["Spinning", "Flying or jumping", "Reverse", "Double"], a: 1 },
			{ q: "Korean for fixed stance?", o: ["Niunja Sogi", "Gojung Sogi", "Annun Sogi", "Nachuo Sogi"], a: 1 },
			{ q: "What does Dollyo Chagi mean?", o: ["Side kick", "Turning kick", "Back kick", "Hook kick"], a: 1 },
			{ q: "What is the Korean for the back heel?", o: ["Baldung", "Balkal", "Apkumchi", "Dwitchook"], a: 3 },
			{ q: "What does Niunja Sogi mean?", o: ["Walking stance", "Sitting stance", "L-stance", "Fixed stance"], a: 2 },
			{ q: "What does Sang mean?", o: ["Single", "Double or twin", "Triple", "Alternate"], a: 1 },
			{ q: "What does Wen mean?", o: ["Right", "Left", "Front", "Back"], a: 1 },
			{ q: "What does Orun mean?", o: ["Left", "Right", "Front", "Back"], a: 1 },
			{ q: "What does Naeryo mean?", o: ["Upward", "Inward", "Downward", "Outward"], a: 2 },
			{ q: "What is the Korean for the knee?", o: ["Palkup", "Moorup", "Dwitchook", "Apkumchi"], a: 1 },
			{ q: "What does Chookyo Makgi mean?", o: ["Low block", "Outward block", "Rising block", "Guarding block"], a: 2 },
			{ q: "What does Hechyo Makgi mean?", o: ["Rising block", "Wedging block", "Guarding block", "Low block"], a: 1 },
			{ q: "What does Daebi Makgi mean?", o: ["Rising block", "Wedging block", "Guarding block", "Twin block"], a: 2 },
			{ q: "What is a Kyong-go in ITF sparring?", o: ["A point", "A warning", "A half point deduction", "Disqualification"], a: 1 },
			{ q: "What is a Gam-jeom in ITF sparring?", o: ["A warning", "A full point", "A half point deduction", "Disqualification"], a: 2 },
			{ q: "How many Kyong-go equal one Gam-jeom?", o: ["1", "2", "3", "4"], a: 1 },
			{ q: "What does Hosinsul mean?", o: ["Sparring", "Pattern", "Self defence techniques", "Destruction"], a: 2 },
			{ q: "What does Kyokpa mean?", o: ["Sparring", "Pattern", "Self defence", "Destruction or breaking"], a: 3 },
			{ q: "What is the Korean command to stop sparring?", o: ["Sijak", "Junbi", "Kalyo", "Gomman"], a: 2 },
			{ q: "What does Gibon mean?", o: ["Advanced", "Basic or fundamental", "Intermediate", "Special"], a: 1 },
			{ q: "What does Sine Wave mean in ITF Taekwon-Do?", o: ["A type of kick", "The natural up-down motion used to generate power", "A blocking method", "A pattern diagram"], a: 1 },
			{ q: "What is the Korean for a release motion?", o: ["Baro", "Dollyo", "Jappyosul Tae", "Bandae"], a: 2 },
			{ q: "What does Moa Sogi mean?", o: ["One-leg stance", "Closed stance", "Fixed stance", "Parallel stance"], a: 1 },
			{ q: "What does Waebal Sogi mean?", o: ["Fixed stance", "Closed stance", "One-leg stance", "Diagonal stance"], a: 2 },
			{ q: "3-step sparring in Korean?", o: ["Ilbo Matsogi", "Ibo Matsogi", "Sambo Matsogi", "Jayu Matsogi"], a: 2 },
			{ q: "2-step sparring in Korean?", o: ["Ilbo Matsogi", "Ibo Matsogi", "Sambo Matsogi", "Jayu Matsogi"], a: 1 },
			{ q: "1-step sparring in Korean?", o: ["Ilbo Matsogi", "Ibo Matsogi", "Sambo Matsogi", "Jayu Matsogi"], a: 0 },
			{ q: "Free sparring in Korean?", o: ["Ilbo Matsogi", "Sambo Matsogi", "Jayu Matsogi", "Ibo Matsogi"], a: 2 },
			{ q: "What does Narani Sogi mean?", o: ["Walking stance", "L-stance", "Parallel stance", "Sitting stance"], a: 2 },
			{ q: "1 point is awarded in ITF sparring for?", o: ["Head kick", "Jumping head kick", "Body punch or body kick", "Takedown"], a: 2 },
			{ q: "2 points are awarded in ITF sparring for?", o: ["Body kick", "Head kick", "Jumping body kick", "Jumping head kick"], a: 1 },
			{ q: "3 points are awarded in ITF sparring for?", o: ["Head kick", "Jumping body kick", "Jumping or flying head kick", "Takedown"], a: 2 },
			{ q: "What does Dollimyo mean?", o: ["Jumping", "Spinning or rotating", "Downward", "Pressing"], a: 1 },
			{ q: "What does Yonsok mean?", o: ["Slow", "Continuous or combination", "Reverse", "Single"], a: 1 },
			{ q: "What does Bandal Chagi mean?", o: ["Turning kick", "Crescent kick", "Side kick", "Hook kick"], a: 1 },
			{ q: "What does Dwit Chagi mean?", o: ["Side kick", "Turning kick", "Back kick", "Reverse kick"], a: 2 },
			{ q: "What is the Korean for the sole of the foot?", o: ["Apkumchi", "Baldung", "Balkal", "Balbadak"], a: 3 },
			{ q: "What does Balk Kut mean?", o: ["Ball of the foot", "Heel", "Toes", "Instep"], a: 2 },
			{ q: "What does Kyocha Sogi mean?", o: ["L-stance", "Cross stance", "One-leg stance", "Closed stance"], a: 1 },
			{ q: "What does Nopunde Dollyo Chagi mean?", o: ["Low turning kick", "Middle turning kick", "High turning kick", "Jumping turning kick"], a: 2 },
			{ q: "How many Dan grades are there in ITF Taekwon-Do?", o: ["7", "8", "9", "10"], a: 2 },
			{ q: "What does Ap Chagi mean?", o: ["Side kick", "Turning kick", "Front kick", "Back kick"], a: 2 },
			{ q: "What does Yop Chagi mean?", o: ["Front kick", "Turning kick", "Side kick", "Back kick"], a: 2 },
			{ q: "What does Nachuo Sogi mean?", o: ["Fixed stance", "Low stance", "Walking stance", "Rear foot stance"], a: 1 },
			{ q: "What does Sonkal Dung mean?", o: ["Knifehand", "Ridge hand / reverse knifehand", "Palm", "Back fist"], a: 1 },
			{ q: "What does Kyocha Joomuk mean?", o: ["Twin fist", "Cross fist", "Double punch", "Hammer fist"], a: 1 },
			{ q: "General Choi Hong Hi was born in which year?", o: ["1915", "1918", "1920", "1922"], a: 1 },
			{ q: "What does Opun Sonkut Tulgi mean?", o: ["Knifehand strike", "Four-finger thrust", "Palm strike", "Back fist strike"], a: 1 },
			{ q: "What does Miro Makgi mean?", o: ["Rising block", "Pushing block", "Hooking block", "Pressing block"], a: 1 },
			{ q: "What does An Palmok mean?", o: ["Outer forearm", "Back forearm", "Inner forearm", "Side forearm"], a: 2 },
			{ q: "What does Bakat Palmok mean?", o: ["Inner forearm", "Back forearm", "Outer forearm", "Side forearm"], a: 2 },
		],
	},
	{
		label: "Yellow Belt to Green Belt",
		grades: "7th-6th Gup",
		emoji: "Green",
		color: "#2ea84a",
		qs: [
			{ q: "Who is Do-San named after?", o: ["Ahn Joong-Gun", "Yi Soon-Sin", "Ahn Chang-Ho", "Won-Hyo"], a: 2 },
			{ q: "How many moves does Do-San have?", o: ["21", "24", "28", "32"], a: 1 },
			{ q: "What does a green belt signify?", o: ["Innocence", "Growth of the plant", "Danger", "The sky"], a: 1 },
			{ q: "Won-Hyo introduced which religion to Korea?", o: ["Christianity", "Islam", "Confucianism", "Buddhism"], a: 3 },
			{ q: "How many moves does Won-Hyo have?", o: ["24", "26", "28", "30"], a: 2 },
			{ q: "Which belt requires Do-San?", o: ["Yellow belt", "Green stripe", "Green belt", "Blue stripe"], a: 1 },
			{ q: "Which belt requires Won-Hyo?", o: ["Green stripe", "Green belt", "Blue stripe", "Blue belt"], a: 1 },
			{ q: "What was Won-Hyo's role?", o: ["A general", "A king", "A Buddhist monk who spread Buddhism in Korea", "A Confucian scholar"], a: 2 },
			{ q: "Ahn Chang-Ho (Do-San) was known as?", o: ["A great general", "A Korean independence movement leader", "A Buddhist monk", "A Confucian scholar"], a: 1 },
			{ q: "What does Sang Palmok Makgi mean?", o: ["Rising block", "Twin forearm block", "Wedging block", "Low block"], a: 1 },
			{ q: "What is Jappyosul Tae?", o: ["A sparring drill", "A release motion", "A pattern", "A stance"], a: 1 },
			{ q: "How many Gam-jeom result in disqualification in ITF sparring?", o: ["2", "3", "4", "5"], a: 2 },
			{ q: "What does Yop Baldung mean?", o: ["Footsword", "Back heel", "Side instep", "Ball of foot"], a: 2 },
			{ q: "What is the Korean for the back sole of the foot?", o: ["Balbadak", "Dwitchook", "Dwit Kumchi", "Apkumchi"], a: 2 },
			{ q: "What does Naeryo Chagi mean?", o: ["Turning kick", "Side kick", "Downward kick", "Hook kick"], a: 2 },
			{ q: "What does Twimyo Dollyo Chagi mean?", o: ["Spinning turning kick", "Flying turning kick", "High turning kick", "Double turning kick"], a: 1 },
			{ q: "What does Balbadak mean?", o: ["Back heel", "Ball of the foot", "Sole of the foot", "Instep"], a: 2 },
			{ q: "What does Twimyo Bandae Dollyo Chagi mean?", o: ["Jumping turning kick", "Flying reverse turning kick", "Spinning hook kick", "Flying side kick"], a: 1 },
			{ q: "What is the Korean for the toes as a foot tool?", o: ["Apkumchi", "Balk Kut", "Baldung", "Dwitchook"], a: 1 },
			{ q: "What does Eui-Am represent?", o: ["A general", "Pen name of Son Byong-Hi, leader of the 1919 independence movement", "A Buddhist monk", "A Confucian scholar"], a: 1 },
			{ q: "What does the pattern Ge-Baek diagram represent?", o: ["Military discipline and honour", "A scholar", "Reunification", "Loyalty to the king"], a: 0 },
			{ q: "What does Moon-Moo represent?", o: ["A great battle", "The 30th King of Silla who unified Korea", "A famous scholar", "The Korean alphabet"], a: 1 },
			{ q: "Ul-Ji is named after a general famous for defeating which invaders?", o: ["Japanese", "Mongol", "Chinese Sui dynasty forces", "Manchurian"], a: 2 },
			{ q: "What does the diagram of Po-Eun represent?", o: ["Expansion", "Loyalty", "Scholar", "Reunification"], a: 1 },
			{ q: "Choi-Yong is named after a general from which dynasty?", o: ["Silla", "Baekje", "Koryo", "Joseon"], a: 2 },
			{ q: "General Choi Hong Hi held which rank at the time of his passing?", o: ["8th Dan", "9th Dan", "10th Dan", "7th Dan"], a: 2 },
			{ q: "What does Dollimyo mean?", o: ["Jumping", "Spinning or rotating", "Downward", "Pressing"], a: 1 },
			{ q: "What does An mean?", o: ["Outer", "Side", "Back", "Inner"], a: 3 },
			{ q: "What does Bakat mean?", o: ["Inner", "Side", "Outer", "Back"], a: 2 },
			{ q: "A high section attack reaches?", o: ["Shoulder", "Chest", "Eye level and above", "Top of head only"], a: 2 },
			{ q: "A middle section attack reaches?", o: ["Head", "Between shoulder and waist", "Below the waist", "Chest to chin"], a: 1 },
			{ q: "A low section attack reaches?", o: ["Waist and above", "Below the waist", "The legs only", "The feet only"], a: 1 },
			{ q: "Title for a 1st-3rd Dan black belt?", o: ["Sabum", "Sahyun", "Boosabum", "Saseong"], a: 2 },
			{ q: "Title for a 4th-6th Dan black belt?", o: ["Boosabum", "Sahyun", "Sabum", "Saseong"], a: 2 },
			{ q: "Title for a 7th-8th Dan?", o: ["Sabum", "Boosabum", "Saseong", "Sahyun"], a: 3 },
			{ q: "Title for a 9th Dan?", o: ["Sabum", "Sahyun", "Boosabum", "Saseong"], a: 3 },
			{ q: "What does Nopunde Bakat Palmok Makgi mean?", o: ["High inner forearm block", "High outer forearm block", "High knifehand block", "High palm block"], a: 1 },
			{ q: "What does Baro Jirugi mean?", o: ["Reverse punch", "Obverse punch", "High punch", "Low punch"], a: 1 },
			{ q: "What does Bandae Jirugi mean?", o: ["Obverse punch", "Reverse punch", "High punch", "Double punch"], a: 1 },
			{ q: "In which year did General Choi Hong Hi pass away?", o: ["1999", "2002", "2005", "2008"], a: 1 },
			{ q: "What does Kyocha Makgi mean?", o: ["Twin block", "Cross block", "Guarding block", "Rising block"], a: 1 },
			{ q: "What does Sang Joomuk mean?", o: ["Single fist", "Twin fist", "Cross fist", "Back fist"], a: 1 },
			{ q: "What does Nopunde Ap Joomuk Jirugi mean?", o: ["Middle forefist punch", "High forefist punch", "Low forefist punch", "Reverse high punch"], a: 1 },
			{ q: "What does Kaunde Sonkal Taerigi mean?", o: ["High knifehand strike", "Middle knifehand strike", "Low knifehand strike", "Reverse knifehand strike"], a: 1 },
			{ q: "Sam-Il commemorates which event?", o: ["1st March 1919 Korean independence movement", "15th August 1945 liberation", "1st January 1919", "1st April 1919"], a: 0 },
			{ q: "What does Dollyo mean?", o: ["Jumping", "Turning", "Reverse", "Double"], a: 1 },
			{ q: "What does Bandal mean?", o: ["Full circle", "Half moon or crescent", "Reverse", "Double"], a: 1 },
			{ q: "What does Twimyo mean?", o: ["Spinning", "Flying or jumping", "Reverse", "Fast"], a: 1 },
			{ q: "What does Dung mean?", o: ["Front", "Back or reverse side", "Side", "Inner"], a: 1 },
			{ q: "What does Nopunde mean?", o: ["Middle", "Low", "Inner", "High"], a: 3 },
			{ q: "What does Najunde mean?", o: ["High", "Middle", "Low", "Outer"], a: 2 },
			{ q: "What does Kaunde mean?", o: ["High", "Low", "Middle", "Outer"], a: 2 },
			{ q: "What does Opun mean?", o: ["Closed", "Twin", "Open", "Reverse"], a: 2 },
			{ q: "What is Kyocha Joomuk?", o: ["A twin fist", "A cross fist", "A forefist", "A back fist"], a: 1 },
			{ q: "What does Dwit Kumchi mean?", o: ["Back heel", "Back sole", "Ball of foot", "Instep"], a: 1 },
			{ q: "What is Moa Sogi used for?", o: ["Power generation", "Closed stance for bowing or attention", "Sparring stance", "Pattern ending"], a: 1 },
			{ q: "What does Dollyo Chagi use as the striking tool?", o: ["Heel", "Footsword", "Ball of the foot or instep", "Toes"], a: 2 },
			{ q: "What does Twimyo Ap Chagi mean?", o: ["Spinning front kick", "Flying front kick", "High front kick", "Double front kick"], a: 1 },
			{ q: "What does Sonkut Tulgi mean?", o: ["Knifehand strike", "Fingertip thrust", "Palm thrust", "Back fist strike"], a: 1 },
			{ q: "What does Batang Son mean?", o: ["Knifehand", "Palm heel", "Ridge hand", "Back hand"], a: 1 },
			{ q: "How many moves does Chon-Ji have?", o: ["16", "17", "19", "21"], a: 2 },
			{ q: "How many moves does Dan-Gun have?", o: ["19", "21", "24", "28"], a: 1 },
			{ q: "How many moves does Do-San have?", o: ["21", "24", "28", "32"], a: 1 },
		],
	},
	{
		label: "Green Belt to Blue Belt",
		grades: "5th-3rd Gup",
		emoji: "Blue",
		color: "#3b82f6",
		qs: [
			{ q: "Yul-Gok is the Confucius of which country?", o: ["China", "Japan", "Korea", "Vietnam"], a: 2 },
			{ q: "How many moves does Yul-Gok have?", o: ["32", "36", "38", "40"], a: 2 },
			{ q: "Who is Yul-Gok named after?", o: ["A great general", "Yi I - a great Korean Confucian scholar", "A monk", "A king"], a: 1 },
			{ q: "How many moves does Joong-Gun have?", o: ["28", "30", "32", "37"], a: 2 },
			{ q: "Who is Joong-Gun named after?", o: ["Ahn Chang-Ho", "Yi Soon-Sin", "Ahn Joong-Gun", "Won-Hyo"], a: 2 },
			{ q: "The 32 moves of Joong-Gun represent?", o: ["His rank", "His age at execution", "The year", "His battles"], a: 1 },
			{ q: "How many moves does Toi-Gye have?", o: ["32", "35", "37", "38"], a: 2 },
			{ q: "Toi-Gye is the pen name of which type of person?", o: ["A general", "A monk", "A scholar of neo-Confucianism", "A king"], a: 2 },
			{ q: "What does a blue belt signify?", o: ["Danger", "The sky towards which the plant grows", "Innocence", "Maturity"], a: 1 },
			{ q: "Which belt requires Yul-Gok?", o: ["Green belt", "Blue stripe", "Blue belt", "Red stripe"], a: 1 },
			{ q: "Which belt requires Joong-Gun?", o: ["Blue stripe", "Blue belt", "Red stripe", "Red belt"], a: 1 },
			{ q: "Which belt requires Toi-Gye?", o: ["Blue belt", "Red stripe", "Red belt", "Black stripe"], a: 1 },
			{ q: "What does the 37 moves of Toi-Gye represent?", o: ["His age", "His birthplace on the 37th latitude of Korea", "His battles", "His rank"], a: 1 },
			{ q: "What does the diagram of Yul-Gok represent?", o: ["A scholar", "Expansion of territory", "Loyalty", "The Chinese character for scholar (士)"], a: 3 },
			{ q: "Ahn Joong-Gun assassinated which Japanese figure?", o: ["The Japanese Emperor", "Ito Hirobumi - first Japanese Resident-General of Korea", "A Japanese general", "The Japanese Prime Minister"], a: 1 },
			{ q: "What does Nopunde Dollyo Chagi mean?", o: ["Low turning kick", "Middle turning kick", "High turning kick", "Jumping turning kick"], a: 2 },
			{ q: "What does Twimyo Yop Chagi mean?", o: ["Spinning side kick", "Flying side kick", "High side kick", "Double side kick"], a: 1 },
			{ q: "What does Twimyo Dwit Chagi mean?", o: ["Spinning back kick", "Flying back kick", "High back kick", "Double back kick"], a: 1 },
			{ q: "What does Nopunde Ap Joomuk Jirugi mean?", o: ["Middle forefist punch", "High forefist punch", "Low forefist punch", "Reverse high punch"], a: 1 },
			{ q: "What is the correct ready posture for Yul-Gok?", o: ["Closed Ready Stance A", "Parallel Ready Stance B", "Closed Ready Stance B", "Warrior Ready Stance"], a: 1 },
			{ q: "What does Kaunde Sonkal Taerigi mean?", o: ["High knifehand strike", "Middle knifehand strike", "Low knifehand strike", "Reverse knifehand strike"], a: 1 },
			{ q: "How many moves does Yul-Gok have and what do they represent?", o: ["38 moves - his 38th latitude birthplace", "36 moves - his 36 year career", "32 moves - his age at death", "40 moves - his battles"], a: 0 },
			{ q: "What does Nopunde Bakat Palmok Makgi mean?", o: ["High inner forearm block", "High outer forearm block", "High knifehand block", "High palm block"], a: 1 },
			{ q: "What does Batang Son Kaunde Makgi mean?", o: ["Knifehand middle block", "Palm heel middle block", "Ridge hand middle block", "Back hand middle block"], a: 1 },
			{ q: "What does Sonkal Daebi Makgi mean?", o: ["Knifehand rising block", "Knifehand guarding block", "Knifehand wedging block", "Knifehand low block"], a: 1 },
			{ q: "What does Sang Sonkal Makgi mean?", o: ["Twin knifehand block", "Twin forearm block", "Twin palm block", "Twin rising block"], a: 0 },
			{ q: "What does Kaunde Bakat Palmok Makgi mean?", o: ["High outer forearm block", "Middle outer forearm block", "Low outer forearm block", "Reverse outer forearm block"], a: 1 },
			{ q: "In which country was the ITF officially founded?", o: ["South Korea", "Canada", "USA", "North Korea"], a: 1 },
			{ q: "General Choi Hong Hi was born in which year?", o: ["1915", "1918", "1920", "1922"], a: 1 },
			{ q: "What does Dollyo mean?", o: ["Jumping", "Turning", "Reverse", "Double"], a: 1 },
			{ q: "What does Bandal Chagi mean?", o: ["Turning kick", "Crescent kick", "Side kick", "Hook kick"], a: 1 },
			{ q: "What does Naeryo Chagi mean?", o: ["Turning kick", "Side kick", "Downward kick", "Hook kick"], a: 2 },
			{ q: "What does Moorup Chagi mean?", o: ["Elbow strike", "Knee kick", "Side kick", "Turning kick"], a: 1 },
			{ q: "What does Dung Joomuk Taerigi mean?", o: ["Forefist strike", "Back fist strike", "Palm strike", "Knifehand strike"], a: 1 },
			{ q: "What does Sonkal Naerio Taerigi mean?", o: ["Knifehand rising strike", "Knifehand downward strike", "Knifehand side strike", "Knifehand reverse strike"], a: 1 },
			{ q: "What does Palkup Dollyo Taerigi mean?", o: ["Elbow turning strike", "Elbow side strike", "Elbow upward strike", "Elbow downward strike"], a: 0 },
			{ q: "What does Kaunde Sonkut Tulgi mean?", o: ["High fingertip thrust", "Middle fingertip thrust", "Low fingertip thrust", "Reverse fingertip thrust"], a: 1 },
			{ q: "What does Najunde An Palmok Makgi mean?", o: ["High inner forearm block", "Low inner forearm block", "Middle inner forearm block", "Reverse low block"], a: 1 },
			{ q: "What does Sang Palmok mean?", o: ["Single forearm", "Twin forearm", "Cross forearm", "Reverse forearm"], a: 1 },
			{ q: "What is the Korean for a combination technique?", o: ["Yonsok", "Dollimyo", "Bandae", "Baro"], a: 0 },
			{ q: "What does Twimyo Bandae Dollyo Chagi mean?", o: ["Jumping turning kick", "Flying reverse turning kick", "Spinning hook kick", "Flying side kick"], a: 1 },
			{ q: "What is the correct foot tool for a crescent kick?", o: ["Ball of foot", "Instep", "Sole of foot", "Heel"], a: 2 },
			{ q: "What does Baro mean in the context of a pattern?", o: ["Reverse technique", "Return to ready position", "Obverse technique", "High technique"], a: 1 },
			{ q: "General Choi published how many volumes in his Encyclopaedia of Taekwon-Do?", o: ["9", "12", "15", "24"], a: 2 },
			{ q: "The 24 patterns represent what?", o: ["24 hours in one day or General Choi's lifespan", "24 letters of the Korean alphabet", "24 students of General Choi", "24 battles"], a: 0 },
			{ q: "How many points should be considered when performing a pattern?", o: ["7", "8", "9", "10"], a: 2 },
			{ q: "What does Sang Sonkut Tulgi mean?", o: ["Single fingertip thrust", "Twin fingertip thrust", "Cross fingertip thrust", "Reverse fingertip thrust"], a: 1 },
			{ q: "What does Nopunde Sonkal Taerigi mean?", o: ["High knifehand block", "High knifehand strike", "Middle knifehand strike", "Low knifehand strike"], a: 1 },
			{ q: "What does Dwit Kumchi Jirugi mean?", o: ["Back heel kick", "Back heel punch", "Back sole strike", "Reverse heel strike"], a: 1 },
			{ q: "What does Opun Sonkut mean?", o: ["Closed fingertips", "Open fingertips", "Twin fingertips", "Reverse fingertips"], a: 1 },
			{ q: "What does Miro Makgi mean?", o: ["Rising block", "Pushing block", "Hooking block", "Pressing block"], a: 1 },
			{ q: "What does Golcho Makgi mean?", o: ["Pushing block", "Hooking block", "Rising block", "Pressing block"], a: 1 },
			{ q: "What does Noollo Makgi mean?", o: ["Pushing block", "Hooking block", "Pressing block", "Rising block"], a: 2 },
			{ q: "What does Hecho Makgi mean?", o: ["Rising block", "Wedging block", "Scooping block", "Circular block"], a: 1 },
			{ q: "What does Dung Palmok mean?", o: ["Inner forearm", "Outer forearm", "Back forearm", "Side forearm"], a: 2 },
			{ q: "What does Ap Kumchi mean?", o: ["Ball of foot", "Heel", "Toes", "Instep"], a: 0 },
			{ q: "What does Jok-Gi mean?", o: ["Hand technique", "Foot technique", "Pattern", "Stance"], a: 1 },
			{ q: "How many moves does Won-Hyo have?", o: ["24", "26", "28", "30"], a: 2 },
			{ q: "How many moves does Yul-Gok have?", o: ["32", "36", "38", "40"], a: 2 },
			{ q: "How many moves does Joong-Gun have?", o: ["28", "30", "32", "37"], a: 2 },
			{ q: "How many moves does Toi-Gye have?", o: ["32", "35", "37", "38"], a: 2 },
		],
	},
	{
		label: "Blue Belt to Black Stripe",
		grades: "2nd-1st Gup",
		emoji: "Red",
		color: "#e8193c",
		qs: [
			{ q: "Hwa-Rang warriors were from which dynasty?", o: ["Koryo", "Joseon", "Silla", "Baekje"], a: 2 },
			{ q: "How many moves does Hwa-Rang have?", o: ["27", "28", "29", "30"], a: 2 },
			{ q: "The 29 moves of Hwa-Rang represent?", o: ["His age", "29th infantry division that helped develop TKD", "The year", "His rank"], a: 1 },
			{ q: "How many moves does Choong-Moo have?", o: ["28", "29", "30", "32"], a: 2 },
			{ q: "Who is Choong-Moo named after?", o: ["General Kim", "Admiral Yi Soon-Sin", "General Choi", "Ahn Joong-Gun"], a: 1 },
			{ q: "Why does Choong-Moo end with a left hand attack?", o: ["He was left-handed", "Symbolise his regrettable death before fully showing loyalty", "Tradition", "It is stronger"], a: 1 },
			{ q: "What does a red belt signify?", o: ["Maturity", "Danger - control and caution required", "Innocence", "The sky"], a: 1 },
			{ q: "Which belt requires Hwa-Rang?", o: ["Red stripe", "Red belt", "Black stripe", "1st Dan"], a: 1 },
			{ q: "Which belt requires Choong-Moo?", o: ["Red belt", "Black stripe", "1st Dan", "2nd Dan"], a: 1 },
			{ q: "Who were the Hwa-Rang?", o: ["A royal family", "Elite Silla dynasty youth warriors", "A group of scholars", "Buddhist monks"], a: 1 },
			{ q: "Admiral Yi Soon-Sin is famous for inventing what?", o: ["The Korean alphabet", "The armoured turtle ship (Geobukseon)", "Gunpowder", "The compass"], a: 1 },
			{ q: "How many battles did Admiral Yi Soon-Sin fight without a single defeat?", o: ["16", "20", "23", "28"], a: 2 },
			{ q: "What does Choong-Moo's name translate to?", o: ["Loyal warrior", "The posthumous title given to Admiral Yi Soon-Sin", "Great general", "Holy warrior"], a: 1 },
			{ q: "What does Twimyo Dollyo Chagi mean?", o: ["Spinning turning kick", "Flying turning kick", "High turning kick", "Double turning kick"], a: 1 },
			{ q: "What does Twimyo Bandae Dollyo Chagi mean?", o: ["Jumping turning kick", "Flying reverse turning kick", "Spinning hook kick", "Flying side kick"], a: 1 },
			{ q: "What does Naeryo Chagi mean?", o: ["Turning kick", "Side kick", "Downward kick", "Hook kick"], a: 2 },
			{ q: "What does Bandal Chagi mean?", o: ["Turning kick", "Crescent kick", "Side kick", "Hook kick"], a: 1 },
			{ q: "What is the Korean for the back sole of the foot?", o: ["Balbadak", "Dwitchook", "Dwit Kumchi", "Apkumchi"], a: 2 },
			{ q: "What does Yop Baldung mean?", o: ["Footsword", "Back heel", "Side instep", "Ball of foot"], a: 2 },
			{ q: "What does Noollo Makgi mean?", o: ["Pushing block", "Hooking block", "Pressing block", "Rising block"], a: 2 },
			{ q: "What does Golcho Makgi mean?", o: ["Pushing block", "Hooking block", "Rising block", "Pressing block"], a: 1 },
			{ q: "What does Sonkal Daebi Makgi mean?", o: ["Knifehand rising block", "Knifehand guarding block", "Knifehand wedging block", "Knifehand low block"], a: 1 },
			{ q: "What does Palkup Dollyo Taerigi mean?", o: ["Elbow turning strike", "Elbow side strike", "Elbow upward strike", "Elbow downward strike"], a: 0 },
			{ q: "What does Moorup Chagi mean?", o: ["Elbow strike", "Knee kick", "Side kick", "Turning kick"], a: 1 },
			{ q: "What does Dung Joomuk Taerigi mean?", o: ["Forefist strike", "Back fist strike", "Palm strike", "Knifehand strike"], a: 1 },
			{ q: "What does Sonkal Naerio Taerigi mean?", o: ["Knifehand rising strike", "Knifehand downward strike", "Knifehand side strike", "Knifehand reverse strike"], a: 1 },
			{ q: "What does Batang Son Kaunde Makgi mean?", o: ["Knifehand middle block", "Palm heel middle block", "Ridge hand middle block", "Back hand middle block"], a: 1 },
			{ q: "What does Sang Sonkal Makgi mean?", o: ["Twin knifehand block", "Twin forearm block", "Twin palm block", "Twin rising block"], a: 0 },
			{ q: "What does Kaunde Bakat Palmok Makgi mean?", o: ["High outer forearm block", "Middle outer forearm block", "Low outer forearm block", "Reverse outer forearm block"], a: 1 },
			{ q: "What does Jok-Gi mean?", o: ["Hand technique", "Foot technique", "Pattern", "Stance"], a: 1 },
			{ q: "What does Kyocha Makgi mean?", o: ["Twin block", "Cross block", "Guarding block", "Rising block"], a: 1 },
			{ q: "What does An Palmok Makgi mean?", o: ["Outer forearm block", "Inner forearm block", "Knifehand block", "Palm block"], a: 1 },
			{ q: "What does Najunde Bakat Palmok Makgi mean?", o: ["High outer forearm block", "Middle outer forearm block", "Low outer forearm block", "Inner forearm low block"], a: 2 },
			{ q: "What does Hecho Makgi mean?", o: ["Rising block", "Wedging block", "Scooping block", "Circular block"], a: 1 },
			{ q: "What does Dung Palmok mean?", o: ["Inner forearm", "Outer forearm", "Back forearm", "Side forearm"], a: 2 },
			{ q: "1 point is awarded in ITF sparring for?", o: ["Head kick", "Jumping head kick", "Body punch or body kick", "Takedown"], a: 2 },
			{ q: "2 points are awarded in ITF sparring for?", o: ["Body kick", "Head kick", "Jumping body kick", "Jumping head kick"], a: 1 },
			{ q: "3 points are awarded in ITF sparring for?", o: ["Head kick", "Jumping body kick", "Jumping or flying head kick", "Takedown"], a: 2 },
			{ q: "How many Gam-jeom result in disqualification?", o: ["2", "3", "4", "5"], a: 2 },
			{ q: "What does Kyong-go mean?", o: ["Half point deduction", "Warning", "Disqualification", "Point scored"], a: 1 },
			{ q: "What does Gam-jeom mean?", o: ["Warning", "Half point deduction", "Disqualification", "Full point deduction"], a: 1 },
			{ q: "What does Kalyo mean?", o: ["Begin", "Stop sparring", "Ready", "Bow"], a: 1 },
			{ q: "What does Shijak mean?", o: ["Stop", "Ready", "Begin sparring", "Bow"], a: 2 },
			{ q: "Title for 1st-3rd Dan?", o: ["Sabum", "Sahyun", "Boosabum", "Saseong"], a: 2 },
			{ q: "Title for 4th-6th Dan?", o: ["Boosabum", "Sahyun", "Sabum", "Saseong"], a: 2 },
			{ q: "Title for 7th-8th Dan?", o: ["Sabum", "Boosabum", "Saseong", "Sahyun"], a: 3 },
			{ q: "Title for 9th Dan?", o: ["Sabum", "Sahyun", "Boosabum", "Saseong"], a: 3 },
			{ q: "What does Hosinsul mean?", o: ["Sparring", "Pattern", "Self defence techniques", "Destruction"], a: 2 },
			{ q: "What does Kyokpa mean?", o: ["Sparring", "Pattern", "Self defence", "Destruction or breaking"], a: 3 },
			{ q: "What does Gibon mean?", o: ["Advanced", "Basic or fundamental", "Intermediate", "Special"], a: 1 },
			{ q: "What is Jappyosul Tae?", o: ["A sparring drill", "A release motion", "A pattern", "A stance"], a: 1 },
			{ q: "What does Sang Palmok Makgi mean?", o: ["Rising block", "Twin forearm block", "Wedging block", "Low block"], a: 1 },
			{ q: "General Choi Hong Hi passed away in which year?", o: ["1999", "2002", "2005", "2008"], a: 1 },
			{ q: "In which country was the ITF officially founded?", o: ["South Korea", "Canada", "USA", "North Korea"], a: 1 },
			{ q: "The 24 patterns represent what?", o: ["24 hours in one day or General Choi's lifespan", "24 letters of the Korean alphabet", "24 students of General Choi", "24 battles"], a: 0 },
			{ q: "What does the diagram of Tong-Il symbolise?", o: ["The homogenous race", "The unification of Korea", "Baekdu Mountain", "The Korean alphabet"], a: 1 },
			{ q: "How many patterns are in the ITF Chang-Hon system?", o: ["20", "22", "24", "26"], a: 2 },
			{ q: "What does Sine Wave mean in ITF Taekwon-Do?", o: ["A type of kick", "The natural up-down motion used to generate power", "A blocking method", "A pattern diagram"], a: 1 },
			{ q: "What does Dollimyo mean?", o: ["Jumping", "Spinning or rotating", "Downward", "Pressing"], a: 1 },
			{ q: "What does Nopunde Sonkal Taerigi mean?", o: ["High knifehand block", "High knifehand strike", "Middle knifehand strike", "Low knifehand strike"], a: 1 },
			{ q: "What does Kaunde Sonkut Tulgi mean?", o: ["High fingertip thrust", "Middle fingertip thrust", "Low fingertip thrust", "Reverse fingertip thrust"], a: 1 },
			{ q: "How many moves does Hwa-Rang have?", o: ["27", "28", "29", "30"], a: 2 },
			{ q: "How many moves does Choong-Moo have?", o: ["28", "29", "30", "32"], a: 2 },
		],
	},
	{
		label: "Black Belt Theory",
		grades: "1st Dan+",
		emoji: "Black",
		color: "#555",
		qs: [
			{ q: "How many moves does Kwang-Gae have?", o: ["36", "38", "39", "44"], a: 2 },
			{ q: "The 39 moves of Kwang-Gae represent?", o: ["His age", "First two figures of 391 AD", "His battles", "His rank"], a: 1 },
			{ q: "How many moves does Po-Eun have?", o: ["33", "36", "39", "44"], a: 1 },
			{ q: "Po-Eun is the pen name of which scholar-poet?", o: ["Yi I", "Chong Mong-Chu", "Ahn Chang-Ho", "So-San"], a: 1 },
			{ q: "How many moves does Ge-Baek have?", o: ["39", "42", "44", "45"], a: 2 },
			{ q: "Ge-Baek is named after a general from which kingdom?", o: ["Silla", "Koryo", "Baekje", "Joseon"], a: 2 },
			{ q: "How many moves does Eui-Am have?", o: ["42", "44", "45", "52"], a: 2 },
			{ q: "How many moves does Choong-Jang have?", o: ["45", "50", "52", "56"], a: 2 },
			{ q: "Why does Choong-Jang end with a left hand attack?", o: ["His left-handed style", "His tragic death at age 27 in prison", "Respect for the king", "His final battle"], a: 1 },
			{ q: "How many moves does Juche have?", o: ["32", "38", "44", "45"], a: 2 },
			{ q: "What does Juche mean?", o: ["Self reliance - a Korean philosophical concept", "A great battle", "The Korean people", "National unity"], a: 0 },
			{ q: "How many moves does Yoo-Sin have?", o: ["56", "61", "68", "72"], a: 2 },
			{ q: "Yoo-Sin is named after a general from which dynasty?", o: ["Baekje", "Joseon", "Silla", "Koryo"], a: 2 },
			{ q: "How many moves does Moon-Moo have?", o: ["56", "61", "68", "72"], a: 1 },
			{ q: "How many moves does So-San have?", o: ["61", "68", "72", "75"], a: 2 },
			{ q: "The 72 moves of So-San represent?", o: ["His battles", "His age when he entered the priesthood", "His rank", "The year"], a: 1 },
			{ q: "How many moves does Se-Jong have?", o: ["20", "22", "24", "28"], a: 2 },
			{ q: "King Se-Jong invented what in 1443?", o: ["The compass", "The Korean alphabet (Hangul)", "Gunpowder", "The armoured battleship"], a: 1 },
			{ q: "How many moves does Tong-Il have?", o: ["49", "52", "56", "61"], a: 2 },
			{ q: "What does Tong-Il represent?", o: ["A great battle", "The reunification of Korea", "A famous king", "The Korean alphabet"], a: 1 },
			{ q: "How many moves does Sam-Il have?", o: ["29", "30", "33", "36"], a: 2 },
			{ q: "The 33 moves of Sam-Il represent?", o: ["The 33 patriot signatories of the March 1st independence movement", "His age", "His battles", "The 33rd infantry"], a: 0 },
			{ q: "The 49 moves of Yon-Gae represent?", o: ["His age", "Last two figures of 649 AD", "His battles", "The year Korea united"], a: 1 },
			{ q: "How many moves does Ul-Ji have?", o: ["36", "40", "42", "44"], a: 2 },
			{ q: "How many moves does Choi-Yong have?", o: ["40", "44", "46", "49"], a: 2 },
			{ q: "What ready posture does Kwang-Gae begin with?", o: ["Parallel Stance with Heaven Hand", "Closed Ready Stance B", "Warrior Ready Stance A", "Parallel Ready Stance"], a: 0 },
			{ q: "The 24 patterns represent what?", o: ["24 hours in one day or General Choi's lifespan", "24 letters of the Korean alphabet", "24 students of General Choi", "24 battles"], a: 0 },
			{ q: "How many points should be considered when performing a pattern?", o: ["7", "8", "9", "10"], a: 2 },
			{ q: "General Choi Hong Hi was born in which year?", o: ["1915", "1918", "1920", "1922"], a: 1 },
			{ q: "How many volumes in General Choi's Encyclopaedia of Taekwon-Do?", o: ["9", "12", "15", "24"], a: 2 },
			{ q: "How many moves does Yon-Gae have?", o: ["44", "49", "52", "56"], a: 1 },
			{ q: "Which pattern has the most movements?", o: ["So-San with 72", "Yoo-Sin with 68", "Moon-Moo with 61", "Tong-Il with 56"], a: 0 },
			{ q: "What does the diagram of Kwang-Gae represent?", o: ["Expansion and recovery of lost territory", "The kings throne", "Military discipline", "Loyalty to the king"], a: 0 },
			{ q: "What does the diagram of Tong-Il symbolise?", o: ["The homogenous race", "The unification of Korea", "Baekdu Mountain", "The Korean alphabet"], a: 1 },
			{ q: "Kwang-Gae was a king who recovered how many square miles of territory?", o: ["Lost territory in the north", "Most of Korea and Manchuria", "Southern Korea only", "The islands off Korea"], a: 1 },
			{ q: "Sam-Il commemorates which event?", o: ["1st March 1919 Korean independence movement", "15th August 1945 liberation", "1st January 1919", "1st April 1919"], a: 0 },
			{ q: "In which year did General Choi pass away?", o: ["1999", "2002", "2005", "2000"], a: 1 },
			{ q: "What title is given to a 4th Dan black belt?", o: ["Boosabum", "Sabum", "Sahyun", "Saseong"], a: 1 },
			{ q: "At what Dan grade does Sahyun (Master) begin?", o: ["6th Dan", "7th Dan", "8th Dan", "5th Dan"], a: 1 },
			{ q: "What ready posture does Juche begin with?", o: ["Parallel Stance with Twin Side Elbow", "Closed Ready Stance A", "Warrior Ready Stance B", "Parallel Stance with Heaven Hand"], a: 0 },
			{ q: "What does Eui-Am represent?", o: ["A general", "Pen name of Son Byong-Hi, leader of the 1919 independence movement", "A Buddhist monk", "A Confucian scholar"], a: 1 },
			{ q: "Choi-Yong is named after a general from which dynasty?", o: ["Silla", "Baekje", "Koryo", "Joseon"], a: 2 },
			{ q: "Ul-Ji is named after a general famous for defeating which invaders?", o: ["Japanese", "Mongol", "Chinese Sui dynasty forces", "Manchurian"], a: 2 },
			{ q: "What does the diagram of Po-Eun represent?", o: ["Expansion", "Loyalty", "Scholar", "Reunification"], a: 1 },
			{ q: "What does the pattern Ge-Baek diagram represent?", o: ["Military discipline and honour", "A scholar", "Reunification", "Loyalty to the king"], a: 0 },
			{ q: "Moon-Moo is named after which King of Silla?", o: ["Se-Jong", "Kwang-Gae", "The 30th King of Silla who unified Korea at sea", "Yoo-Sin"], a: 2 },
			{ q: "General Choi Hong Hi held which rank at the time of his passing?", o: ["8th Dan", "9th Dan", "10th Dan", "7th Dan"], a: 2 },
			{ q: "In which year was the ITF officially founded?", o: ["1955", "1960", "1966", "1972"], a: 2 },
			{ q: "In which country was the ITF officially founded?", o: ["South Korea", "Canada", "USA", "North Korea"], a: 1 },
			{ q: "The name Taekwon-Do was officially recognised on which date?", o: ["11th April 1955", "1st March 1945", "15th August 1955", "11th April 1965"], a: 0 },
			{ q: "How many patterns are in the ITF Chang-Hon system?", o: ["20", "22", "24", "26"], a: 2 },
			{ q: "How many Dan grades are there in ITF Taekwon-Do?", o: ["7", "8", "9", "10"], a: 2 },
			{ q: "Which pattern was originally called Ko-Dang in some ITF organisations?", o: ["Eui-Am", "Juche", "Choong-Jang", "Ul-Ji"], a: 1 },
			{ q: "What does Choong-Jang's name represent?", o: ["His military rank", "The posthumous title given to General Kim Duk Ryang", "His birthplace", "His age at death"], a: 1 },
			{ q: "Ge-Baek was a general of which kingdom who defended against Silla and Tang forces?", o: ["Koryo", "Joseon", "Baekje", "Goryeo"], a: 2 },
			{ q: "What does the diagram of the pattern Eui-Am represent?", o: ["A straight line", "The Chinese character for three", "The initial letter of Son Byong-Hi's pen name", "A cross"], a: 2 },
			{ q: "Yoo-Sin's 68 moves represent?", o: ["His age at death", "The last two figures of 668 AD when Korea was unified", "His rank", "His battles"], a: 1 },
			{ q: "What does Choong-Jang end with and what is the reason?", o: ["A left kick - his fighting style", "A left hand attack - his tragic death at 27 in prison before he could complete his duty", "A right punch - respect for the king", "A block - his defensive strategy"], a: 1 },
			{ q: "Which two patterns are required for 2nd Dan?", o: ["Kwang-Gae and Po-Eun", "Po-Eun and Ge-Baek", "Ge-Baek and Eui-Am", "Kwang-Gae and Ge-Baek"], a: 1 },
			{ q: "Which three patterns are required for 3rd Dan?", o: ["Eui-Am, Choong-Jang, Juche", "Sam-Il, Yoo-Sin, Choi-Yong", "Yon-Gae, Ul-Ji, Moon-Moo", "Po-Eun, Ge-Baek, Eui-Am"], a: 0 },
			{ q: "Which three patterns are required for 4th Dan?", o: ["Eui-Am, Choong-Jang, Juche", "Sam-Il, Yoo-Sin, Choi-Yong", "Yon-Gae, Ul-Ji, Moon-Moo", "Po-Eun, Ge-Baek, Eui-Am"], a: 1 },
			{ q: "Which two patterns are required for 5th Dan?", o: ["Kwang-Gae and Po-Eun", "Sam-Il and Yoo-Sin", "Yon-Gae and Ul-Ji", "Moon-Moo and So-San"], a: 2 },
		],
	},
	{
		label: "Instructor Level",
		grades: "Instructors & Senior Dans",
		emoji: "Gold",
		color: "#c9a84c",
		qs: [
			{ q: "What rank did General Choi Hong Hi hold when he founded the ITF?", o: ["9th Dan", "7th Dan", "8th Dan", "10th Dan"], a: 0 },
			{ q: "In which country was the ITF officially founded in 1966?", o: ["South Korea", "Canada", "USA", "North Korea"], a: 1 },
			{ q: "What military unit did General Choi use to develop early Taekwon-Do?", o: ["29th Infantry Division", "1st Infantry Division", "Hwa-Rang Corps", "Oh Do Kwan"], a: 0 },
			{ q: "General Choi published the first TKD encyclopaedia in which year?", o: ["1959", "1965", "1972", "1983"], a: 1 },
			{ q: "The name Taekwon-Do was officially recognised on which date?", o: ["11th April 1955", "1st March 1945", "15th August 1955", "11th April 1965"], a: 0 },
			{ q: "Which pattern has the most movements?", o: ["So-San with 72", "Yoo-Sin with 68", "Moon-Moo with 61", "Tong-Il with 56"], a: 0 },
			{ q: "What ready posture does Juche begin with?", o: ["Parallel Stance with Twin Side Elbow", "Closed Ready Stance A", "Warrior Ready Stance B", "Parallel Stance with Heaven Hand"], a: 0 },
			{ q: "The diagram of Yul-Gok represents what?", o: ["The Chinese character for scholar (士)", "Expansion of territory", "Loyalty", "Homogenous race"], a: 0 },
			{ q: "The diagram of Tong-Il symbolises what?", o: ["The homogenous race", "The unification of Korea", "Baekdu Mountain", "The Korean alphabet"], a: 0 },
			{ q: "What does the diagram of Kwang-Gae represent?", o: ["Expansion and recovery of lost territory", "The kings throne", "Military discipline", "Loyalty to the king"], a: 0 },
			{ q: "Which of these is NOT one of the 5 tenets?", o: ["Respect", "Courtesy", "Integrity", "Perseverance"], a: 0 },
			{ q: "What are the 5 tenets in correct order?", o: ["Courtesy, Integrity, Perseverance, Self Control, Indomitable Spirit", "Integrity, Courtesy, Perseverance, Self Control, Indomitable Spirit", "Courtesy, Perseverance, Integrity, Self Control, Indomitable Spirit", "Self Control, Courtesy, Integrity, Perseverance, Indomitable Spirit"], a: 0 },
			{ q: "What are the 5 tenets in correct Korean?", o: ["Ye Ui, Yom Chi, In Nae, Guk Gi, Baekjool Boolgool", "Ye Ui, Yom Chi, Guk Gi, In Nae, Baekjool Boolgool", "Guk Gi, Ye Ui, Yom Chi, In Nae, Baekjool Boolgool", "In Nae, Ye Ui, Yom Chi, Guk Gi, Baekjool Boolgool"], a: 0 },
			{ q: "Which pattern ready posture signifies a sword drawn on the right side?", o: ["Yoo-Sin", "Sam-Il", "Choi-Yong", "Juche"], a: 0 },
			{ q: "Sam-Il commemorates which event?", o: ["1st March 1919 Korean independence movement", "15th August 1945 liberation", "1st January 1919", "1st April 1919"], a: 0 },
			{ q: "How many points should be considered when performing a pattern?", o: ["9", "7", "8", "10"], a: 0 },
			{ q: "What are the 9 points to consider when performing patterns?", o: ["Correctness, Power, Speed, Balance, Rhythm, Timing, Coordination, Breath Control, Focus", "Correctness, Power, Speed, Balance, Rhythm, Breath Control, Focus, Relaxation, Stances", "Power, Speed, Balance, Rhythm, Timing, Coordination, Breath Control, Focus, Stances", "Correctness, Power, Speed, Sine Wave, Rhythm, Timing, Coordination, Breath Control, Focus"], a: 0 },
			{ q: "What does Narani Sogi mean?", o: ["Walking stance", "L-stance", "Parallel stance", "Sitting stance"], a: 2 },
			{ q: "What does Waebal Sogi mean?", o: ["Fixed stance", "Closed stance", "One-leg stance", "Diagonal stance"], a: 2 },
			{ q: "What does Moa Sogi mean?", o: ["One-leg stance", "Closed stance", "Fixed stance", "Parallel stance"], a: 1 },
			{ q: "What does Nachuo Sogi mean?", o: ["Fixed stance", "Low stance", "Walking stance", "Rear foot stance"], a: 1 },
			{ q: "What does Twimyo Bandae Dollyo Chagi mean?", o: ["Jumping turning kick", "Flying reverse turning kick", "Spinning hook kick", "Flying side kick"], a: 1 },
			{ q: "What is the Korean for the toes as a foot tool?", o: ["Apkumchi", "Balk Kut", "Baldung", "Dwitchook"], a: 1 },
			{ q: "What does Eui-Am represent?", o: ["A general", "The pen name of Son Byong-Hi, leader of the 1919 independence movement", "A Buddhist monk", "A Confucian scholar"], a: 1 },
			{ q: "Choi-Yong is named after a general from which dynasty?", o: ["Silla", "Baekje", "Koryo", "Joseon"], a: 2 },
			{ q: "Ul-Ji is named after a general famous for defeating which invaders?", o: ["Japanese", "Mongol", "Chinese Sui dynasty forces", "Manchurian"], a: 2 },
			{ q: "What does the diagram of Po-Eun represent?", o: ["Expansion", "Loyalty", "Scholar", "Reunification"], a: 1 },
			{ q: "General Choi Hong Hi held which rank at the time of his passing?", o: ["8th Dan", "9th Dan", "10th Dan", "7th Dan"], a: 2 },
			{ q: "What does the pattern Ge-Baek diagram represent?", o: ["Military discipline and honour", "A scholar", "Reunification", "Loyalty to the king"], a: 0 },
			{ q: "Yoo-Sin's 68 moves represent?", o: ["His age at death", "The last two figures of 668 AD when Korea was unified", "His rank", "His battles"], a: 1 },
			{ q: "What does Choong-Jang's name represent?", o: ["His military rank", "The posthumous title given to General Kim Duk Ryang", "His birthplace", "His age at death"], a: 1 },
			{ q: "Which pattern was originally called Ko-Dang?", o: ["Eui-Am", "Juche", "Choong-Jang", "Ul-Ji"], a: 1 },
			{ q: "What does the diagram of the pattern Eui-Am represent?", o: ["A straight line", "The Chinese character for three", "The initial letter of Son Byong-Hi's pen name in Hangul", "A cross"], a: 2 },
			{ q: "Ge-Baek defended Baekje against combined forces of which two?", o: ["Japan and China", "Silla and Tang China", "Mongols and Japan", "Goryeo and Tang China"], a: 1 },
			{ q: "What does Moon-Moo represent in terms of his burial wish?", o: ["To be buried in the mountains", "To be buried in the sea to protect Korea from Japanese invasion", "To be buried in the palace grounds", "To be buried near Silla's capital"], a: 1 },
			{ q: "General Choi learned Taekkyeon and calligraphy from which master?", o: ["Master Kim", "Mr Han Il Dong", "Grand Master Park", "Master Yoon"], a: 1 },
			{ q: "What does the pattern So-San represent?", o: ["A great general", "The pen name of the monk Choi Hyong Ung who defended Korea against Japanese pirates", "A Confucian scholar", "A Korean king"], a: 1 },
			{ q: "In which year did General Choi first demonstrate TKD to South Korean President Syngman Rhee?", o: ["1952", "1954", "1958", "1960"], a: 1 },
			{ q: "What is the ITF competition area size?", o: ["8m x 8m", "9m x 9m", "10m x 10m", "12m x 12m"], a: 1 },
			{ q: "How long is an ITF sparring match round?", o: ["1 minute", "2 minutes", "3 minutes", "90 seconds"], a: 1 },
			{ q: "How many officials officiate in an ITF sparring match?", o: ["A referee and 2 corner judges", "A referee and 3 corner judges", "A referee and 4 corner judges", "2 referees and 2 judges"], a: 1 },
			{ q: "What does Dollyo mean?", o: ["Jumping", "Turning", "Reverse", "Double"], a: 1 },
			{ q: "What does Twimyo mean?", o: ["Spinning", "Flying or jumping", "Reverse", "Fast"], a: 1 },
			{ q: "What does Bandae mean?", o: ["Obverse", "Low", "Reverse", "Inner"], a: 2 },
			{ q: "What does Baro mean?", o: ["Reverse technique", "Return to ready position / obverse", "High technique", "Low technique"], a: 1 },
			{ q: "What does Yonsok mean?", o: ["Slow", "Continuous or combination", "Reverse", "Single"], a: 1 },
			{ q: "What does Kyocha mean?", o: ["Single", "Twin", "Cross", "Alternate"], a: 2 },
			{ q: "What does Sang mean?", o: ["Single", "Double or twin", "Triple", "Alternate"], a: 1 },
			{ q: "What does Nopunde mean?", o: ["Middle", "Low", "Inner", "High"], a: 3 },
			{ q: "What does Najunde mean?", o: ["High", "Middle", "Low", "Outer"], a: 2 },
			{ q: "What does Kaunde mean?", o: ["High", "Low", "Middle", "Outer"], a: 2 },
			{ q: "Which patterns does 6th Dan require?", o: ["Yon-Gae and Ul-Ji", "Moon-Moo only", "So-San only", "Moon-Moo and Se-Jong"], a: 1 },
			{ q: "Which pattern does 7th Dan require?", o: ["Moon-Moo", "Se-Jong", "So-San", "Tong-Il"], a: 2 },
			{ q: "Which pattern does 8th Dan require?", o: ["So-San", "Tong-Il", "Se-Jong", "Moon-Moo"], a: 2 },
			{ q: "Which pattern does 9th Dan require?", o: ["Se-Jong", "So-San", "Moon-Moo", "Tong-Il"], a: 3 },
			{ q: "What does the diagram of the pattern Hwa-Rang represent?", o: ["The Silla dynasty symbol", "The shape of a shield", "The Hwa-Rang warriors formation", "Not a special diagram - it is a straight line"], a: 3 },
			{ q: "What does Wen mean?", o: ["Right", "Left", "Front", "Back"], a: 1 },
			{ q: "What does Orun mean?", o: ["Left", "Right", "Front", "Back"], a: 1 },
			{ q: "What does the term Gibon refer to in ITF?", o: ["Advanced training", "Fundamental or basic exercises", "Pattern training", "Sparring drills"], a: 1 },
			{ q: "What does Hosinsul refer to?", o: ["Free sparring", "Self defence techniques against grabs and holds", "Destruction training", "Step sparring"], a: 1 },
			{ q: "What does Kyokpa refer to in ITF?", o: ["Sparring", "Pattern performance", "Destruction or breaking techniques", "Self defence"], a: 2 },
		],
	},
	{
		label: "Dutton's Gauntlet 💀",
		grades: "Think you know it all?",
		emoji: "💀",
		color: "#8b0000",
		qs: [
			{ q: "What is the exact diagram shape of Toi-Gye?", o: ["A straight line", "A cross", "The Chinese character for scholar (士)", "A square"], a: 2 },
			{ q: "What is the correct sine wave timing for a middle section punch in walking stance moving forward?", o: ["Up-down only", "Down only on the step", "Up as the rear foot passes, down on execution", "No sine wave required"], a: 2 },
			{ q: "Which of these patterns does NOT contain a jumping technique?", o: ["Hwa-Rang", "Choong-Moo", "Toi-Gye", "Won-Hyo"], a: 3 },
			{ q: "In ITF patterns, what does the diagram of Chon-Ji represent?", o: ["A cross representing the four directions", "Heaven and Earth represented as a plus sign (+)", "Two parallel lines", "A circle"], a: 1 },
			{ q: "What ready posture is used for Chon-Ji?", o: ["Closed Ready Stance A", "Parallel Ready Stance B", "Parallel Ready Stance A", "Warrior Ready Stance"], a: 2 },
			{ q: "General Choi Hong Hi was imprisoned by the Japanese in which city?", o: ["Seoul", "Pyongyang", "Tokyo", "Beijing"], a: 1 },
			{ q: "Which pattern was General Choi developing at the time of his death that was never fully completed?", o: ["Ko-Dang", "Juche", "Tong-Il", "Se-Jong"], a: 0 },
			{ q: "What is the Korean for an obverse punch?", o: ["Bandae Jirugi", "Baro Jirugi", "Nopunde Jirugi", "Dollyo Jirugi"], a: 1 },
			{ q: "The ready posture for Won-Hyo is?", o: ["Parallel Ready Stance A", "Closed Ready Stance A", "Warrior Ready Stance B", "Parallel Stance with Heaven Hand"], a: 1 },
			{ q: "What is the first move of Chon-Ji?", o: ["High block", "Low block in walking stance turning left", "Middle punch", "Inner forearm block"], a: 1 },
			{ q: "What does the term Yonsok mean in ITF?", o: ["Slow", "Continuous or combination technique", "Reverse", "Single"], a: 1 },
			{ q: "What does Kyocha Joomuk mean?", o: ["Twin fist", "Cross fist", "Double punch", "Hammer fist"], a: 1 },
			{ q: "What is the correct foot position during a side kick chamber?", o: ["Toes pointing down", "Foot parallel to floor", "Knee raised to the side with foot pulled sharply back", "Heel leading from the hip"], a: 2 },
			{ q: "What does Kyocha Sogi mean?", o: ["L-stance", "Cross stance", "One-leg stance", "Closed stance"], a: 1 },
			{ q: "What is Nopunde Bakat Palmok Bandae Dollyo Makgi?", o: ["High inner forearm reverse turning block", "High outer forearm reverse turning block", "High knifehand turning block", "High palm reverse block"], a: 1 },
			{ q: "What does Opun Sonkut Tulgi mean?", o: ["Knifehand strike", "Open fingertip thrust", "Palm strike", "Back fist strike"], a: 1 },
			{ q: "General Choi learned calligraphy and Taekkyeon from which master in Pyongyang?", o: ["Master Kim Hyun Su", "Mr Han Il Dong", "Grand Master Park Jong Soo", "Master Yoon Kwe Byong"], a: 1 },
			{ q: "What does Nopunde Bakat Palmok Makgi mean?", o: ["High inner forearm block", "High outer forearm block", "High knifehand block", "High palm block"], a: 1 },
			{ q: "How many moves does Kwang-Gae have and what do they represent?", o: ["39 moves - first two figures of 391 AD when he recovered lost territory", "44 moves - his age at death", "36 moves - years of his reign", "42 moves - the year he became king"], a: 0 },
			{ q: "What does Miro Makgi mean?", o: ["Rising block", "Pushing block", "Hooking block", "Pressing block"], a: 1 },
			{ q: "What does Golcho Makgi mean?", o: ["Pushing block", "Hooking block", "Rising block", "Pressing block"], a: 1 },
			{ q: "What does Noollo Makgi mean?", o: ["Pushing block", "Hooking block", "Pressing block", "Rising block"], a: 2 },
			{ q: "In ITF competition, how many Kyong-go equal a Gam-jeom?", o: ["1", "2", "3", "4"], a: 1 },
			{ q: "What is the name and location of the ITF first World Championships?", o: ["1st World TKD Championships Montreal 1974", "1st ITF World Championships Montreal 1974", "1st ITF World Championships Seoul 1972", "1st World TKD Championships New York 1970"], a: 1 },
			{ q: "What does Sang Sonkut Tulgi mean?", o: ["Single fingertip thrust", "Twin fingertip thrust", "Cross fingertip thrust", "Reverse fingertip thrust"], a: 1 },
			{ q: "What does Batang Son mean?", o: ["Knifehand", "Palm heel", "Ridge hand", "Back hand"], a: 1 },
			{ q: "What does Sonkal Dung mean?", o: ["Knifehand", "Ridge hand (reverse knifehand)", "Palm", "Back fist"], a: 1 },
			{ q: "Which pattern diagram looks like the Korean letter for King (王)?", o: ["Yul-Gok", "Toi-Gye", "Joong-Gun", "Hwa-Rang"], a: 0 },
			{ q: "What does Dung Palmok mean?", o: ["Inner forearm", "Outer forearm", "Back forearm", "Side forearm"], a: 2 },
			{ q: "What is the weight of General Choi's complete Encyclopaedia of Taekwon-Do (15 volumes)?", o: ["Around 5kg", "Around 10kg", "Around 15kg", "Around 20kg"], a: 2 },
			{ q: "What is the Korean for the sole of the foot?", o: ["Apkumchi", "Baldung", "Balkal", "Balbadak"], a: 3 },
			{ q: "What does Dwit Kumchi mean?", o: ["Back heel", "Back sole", "Ball of foot", "Instep"], a: 1 },
			{ q: "Which of these patterns begins with a move to the LEFT?", o: ["Dan-Gun", "Do-San", "Chon-Ji", "Won-Hyo"], a: 2 },
			{ q: "What is the correct breath control during a Taekwon-Do technique according to General Choi?", o: ["Breathe in on execution", "Exhale sharply on execution, inhale on the return", "Hold breath throughout the technique", "Breathe continuously without holding"], a: 1 },
			{ q: "How many moves does Sam-Il have and what specifically do they represent?", o: ["33 moves - the 33 patriot signatories of the March 1st 1919 independence declaration", "30 moves - the 30th anniversary of independence", "36 moves - 36 years of Japanese occupation", "29 moves - the 29th infantry division"], a: 0 },
			{ q: "In what year did General Choi Hong Hi retire from the Korean Army?", o: ["1959", "1962", "1965", "1968"], a: 1 },
			{ q: "What does Dwitbal Sogi mean?", o: ["Fixed stance", "Rear foot stance", "One-leg stance", "Cross stance"], a: 1 },
			{ q: "What does Gyokcha Sogi mean?", o: ["Parallel stance", "Cross-legged stance", "L-stance", "One-leg stance"], a: 1 },
			{ q: "What does Gunnan Sogi literally translate to?", o: ["Long walking stance", "Stepping or walking stance", "Power stance", "Forward stance"], a: 1 },
			{ q: "What is the correct width of a walking stance (Gunnun Sogi) in terms of shoulder width?", o: ["Same as shoulder width", "Shoulder width plus one foot length", "Shoulder width plus half a foot length", "1.5 times shoulder width"], a: 1 },
			{ q: "In ITF patterns, how should the eyes move as you turn?", o: ["Eyes follow the turning body", "Eyes lead the body - look in the new direction before the body turns", "Eyes remain forward throughout", "Eyes look down to check stance"], a: 1 },
			{ q: "What does Hyong mean?", o: ["A kick", "An older term for pattern or form", "A stance", "A block"], a: 1 },
			{ q: "What was General Choi Hong Hi's rank in the South Korean Army when he retired?", o: ["Colonel", "Brigadier General", "Major General", "Lieutenant General"], a: 1 },
			{ q: "What does Ap Kumchi mean in strict translation?", o: ["Front heel", "Front ball of foot", "Front toes", "Front instep"], a: 1 },
			{ q: "In the ITF sine wave, when is the body at its highest point during a technique?", o: ["At the moment of impact", "As the rear foot passes the front foot during a step", "At the start of the movement", "After the technique is complete"], a: 1 },
			{ q: "What does the pattern Joong-Gun's diagram represent?", o: ["A straight line", "The shape of a shield", "The first letter of Joong-Gun's name in Hangul", "A cross"], a: 2 },
			{ q: "Which ITF pattern has both a left AND a right jumping kick?", o: ["Hwa-Rang", "Choong-Moo", "Yul-Gok", "Toi-Gye"], a: 1 },
			{ q: "What does the term Makgi literally mean in Korean?", o: ["To block or defend", "To punch", "To strike", "To deflect"], a: 0 },
			{ q: "In what year did General Choi Hong Hi establish the Oh Do Kwan?", o: ["1953", "1955", "1959", "1963"], a: 0 },
			{ q: "What is Palkup Naerio Taerigi?", o: ["Elbow turning strike", "Elbow downward strike", "Elbow side strike", "Elbow upward strike"], a: 1 },
			{ q: "What does Sonkal Daebi Makgi mean?", o: ["Knifehand rising block", "Knifehand guarding block", "Knifehand wedging block", "Knifehand low block"], a: 1 },
			{ q: "How many Gam-jeom before disqualification in ITF competition?", o: ["2", "3", "4", "5"], a: 2 },
			{ q: "What does the ready posture Moa Junbi Sogi A (Closed Ready Stance A) signify?", o: ["Readiness to attack", "Concentration of energy and inner strength", "Submission to the opponent", "Balance and stability"], a: 1 },
			{ q: "In which year did General Choi Hong Hi promote Taekwon-Do to US military forces stationed in Korea?", o: ["1953", "1954", "1959", "1962"], a: 1 },
			{ q: "What is the Korean term for the Taekwon-Do oath?", o: ["Tul", "Manse", "Chamsayong", "Gyomyong"], a: 2 },
			{ q: "What is Nopunde Sonkut Tulgi?", o: ["Middle fingertip thrust", "High fingertip thrust", "Low fingertip thrust", "Reverse fingertip thrust"], a: 1 },
			{ q: "In strict ITF terminology, what is the difference between Taerigi and Jirugi?", o: ["There is no difference", "Taerigi is a strike using a tool other than the fist; Jirugi is a punch with twisting motion", "Taerigi is a kick; Jirugi is a hand technique", "Taerigi is a block; Jirugi is an attack"], a: 1 },
			{ q: "What was the name of General Choi's first martial arts instructor in Korea before he went to Japan?", o: ["Master Kim Hyun Su", "Mr Han Il Dong", "Mr Chong Kyo", "Master Park Jong Soo"], a: 1 },
			{ q: "In what year was the first ITF World Championships held and where?", o: ["1972 in Seoul", "1974 in Montreal", "1976 in Oslo", "1980 in Birmingham"], a: 1 },
			{ q: "What does the term Kyocha literally mean?", o: ["Twin", "Cross or X-shape", "Alternate", "Double"], a: 1 },
			{ q: "What does Niunja Sogi literally translate to?", o: ["Long step stance", "Sitting on a chair stance", "L-shaped stance", "Cat stance"], a: 1 },
		],
	},
];
var GLOSS = [
	{
		cat: "Commands",
		terms: [
			["Charyot", "Attention"],
			["Junbi", "Ready"],
			["Sijak", "Begin"],
			["Gomman", "Stop"],
			["Pa-ro", "Return to starting position"],
			["Kyong-ye", "Bow"],
			["Haesan", "Class dismissed"],
			["Swiyo", "Relax / at ease"],
		],
	},
	{
		cat: "Sections",
		terms: [
			["Nopunde", "High section"],
			["Kaunde", "Middle section"],
			["Najunde", "Low section"],
			["Orun", "Right"],
			["Wen", "Left"],
			["Ap", "Front"],
			["Dwit", "Back / rear"],
			["Yop", "Side"],
			["An", "Inner"],
			["Bakat", "Outer"],
		],
	},
	{
		cat: "Stances",
		terms: [
			["Narani Sogi", "Parallel stance"],
			["Gunnun Sogi", "Walking stance"],
			["Niunja Sogi", "L-stance"],
			["Annun Sogi", "Sitting stance"],
			["Gojung Sogi", "Fixed stance"],
			["Moa Sogi", "Closed stance"],
			["Waebal Sogi", "One-leg stance"],
		],
	},
	{
		cat: "Attacks",
		terms: [
			["Jirugi", "Punch / twist"],
			["Taerigi", "Strike"],
			["Tulgi", "Thrust"],
			["Chagi", "Kick"],
			["Baro", "Obverse (same side)"],
			["Bandae", "Reverse (opposite side)"],
		],
	},
	{
		cat: "Blocks",
		terms: [
			["Makgi", "Block"],
			["Chookyo Makgi", "Rising block"],
			["Daebi Makgi", "Guarding block"],
			["Hechyo Makgi", "Wedging block"],
			["Sang Palmok Makgi", "Twin forearm block"],
		],
	},
	{
		cat: "Hand Tools",
		terms: [
			["Ap Joomuk", "Forefist"],
			["Dung Joomuk", "Back fist"],
			["Sonkal", "Knifehand"],
			["Sonbadak", "Palm"],
			["An Palmok", "Inner forearm"],
			["Bakat Palmok", "Outer forearm"],
			["Palkup", "Elbow"],
		],
	},
	{
		cat: "Foot Tools",
		terms: [
			["Apkumchi", "Ball of the foot"],
			["Baldung", "Instep"],
			["Balkal", "Footsword (outer edge of foot)"],
			["Balk Kut", "Toes"],
			["Dwitchook", "Back heel"],
			["Moorup", "Knee"],
			["Balbadak", "Sole of foot"],
			["Dwit Kumchi", "Back sole"],
			["Yop Baldung", "Side instep"],
			["Twimyo Chagi", "Flying kick"],
			["Jok-Gi", "Foot technique"],
		],
	},
	{
		cat: "Rank & Title",
		terms: [
			["Kup", "Grade (colour belt)"],
			["Dan", "Degree (black belt)"],
			["Jeja", "Student"],
			["Sabum", "Instructor"],
			["Boosabum", "Assistant instructor (1st-3rd Dan)"],
			["Sahyun", "Master (7th-8th Dan)"],
			["Saseong", "Grand Master (9th Dan)"],
		],
	},
	{
		cat: "Sparring",
		terms: [
			["Matsogi", "Sparring"],
			["Jayu Matsogi", "Free sparring"],
			["Ilbo Matsogi", "One-step sparring"],
			["Sambo Matsogi", "Three-step sparring"],
		],
	},
];

var KICKS = [
	{
		name: "Front Rising Kick",
		k: "Ap Cha Olligi",
		lv: "Basic",
		desc: "A rising kick using the ball of the foot, swinging the leg upward to the front to stretch and loosen the legs.",
		tgt: "High section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Side Rising Kick",
		k: "Yop Cha Olligi",
		lv: "Basic",
		desc: "A rising kick to the side using the footsword, swinging the leg upward in a lateral arc.",
		tgt: "High section",
		tool: "Footsword (Balkal)",
	},
	{
		name: "Front Snap Kick",
		k: "Ap Cha Busigi",
		lv: "Basic",
		desc: "A fast snapping kick to the front using the ball of the foot. Chamber the knee first, then snap the lower leg out and retract sharply.",
		tgt: "Middle or high section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Side Piercing Kick",
		k: "Yop Cha Jirugi",
		lv: "Basic",
		desc: "A powerful kick delivered directly to the side using the footsword or heel. The hips turn fully to face the target.",
		tgt: "Middle section",
		tool: "Footsword (Balkal) or heel",
		video: "https://www.youtube.com/embed/BGKUBRK-umg",
	},
	{
		name: "Turning Kick",
		k: "Dollyo Chagi",
		lv: "Basic",
		desc: "A circular kick using the ball of the foot. The supporting foot pivots fully and the hips rotate to generate power through the circular arc.",
		tgt: "Middle or high section",
		tool: "Ball of foot (Apkumchi)",
		video: "https://www.youtube.com/embed/HLOVitPaXMY",
	},
	{
		name: "Back Piercing Kick",
		k: "Dwit Cha Jirugi",
		lv: "Basic",
		desc: "A powerful kick delivered backwards using the footsword or heel. Look over the shoulder before driving the heel straight back into the target.",
		tgt: "Middle section",
		tool: "Footsword (Balkal) or heel",
	},
	{
		name: "Inward Crescent Kick",
		k: "Anuro Bandal Chagi",
		lv: "Basic",
		desc: "A sweeping kick that travels in an inward crescent arc across the body, using the sole of the foot.",
		tgt: "High section",
		tool: "Sole of foot (Balbadak)",
	},
	{
		name: "Outward Crescent Kick",
		k: "Bakuro Bandal Chagi",
		lv: "Basic",
		desc: "A sweeping kick that travels in an outward crescent arc away from the body, using the footsword.",
		tgt: "High section",
		tool: "Footsword (Balkal)",
	},
	{
		name: "Knee Kick",
		k: "Moorup Chagi",
		lv: "Basic",
		desc: "A short-range kick using the knee. Drives the knee upward or forward into the target at close quarters.",
		tgt: "Low or middle section",
		tool: "Knee (Moorup)",
	},
	{
		name: "Stamping Kick",
		k: "Cha Busigi",
		lv: "Basic",
		desc: "A downward stamping kick using the footsword, usually directed at a fallen opponent or the instep.",
		tgt: "Low section",
		tool: "Footsword (Balkal)",
	},
	{
		name: "Low Front Snap Kick",
		k: "Moorup Ap Cha Busigi",
		lv: "Basic",
		desc: "A low front snap kick using the ball of the foot. Similar to the front snap kick but directed at the low section.",
		tgt: "Low section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Side Thrusting Kick",
		k: "Yop Cha Tulgi",
		lv: "Intermediate",
		desc: "A thrusting side kick that drives through the target using the ball of the foot. Longer reach than the side piercing kick.",
		tgt: "Middle section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Reverse Turning Kick",
		k: "Bandae Dollyo Chagi",
		lv: "Intermediate",
		desc: "A turning kick delivered in the reverse direction using the back heel. The body spins before the kick is launched.",
		tgt: "High section",
		tool: "Back heel (Dwitchook)",
	},
	{
		name: "Hooking Kick",
		k: "Golcha Chagi",
		lv: "Intermediate",
		desc: "A kick that hooks inward at the target using the back heel. The leg swings out then hooks back into the target.",
		tgt: "High section",
		tool: "Back heel (Dwitchook)",
	},
	{
		name: "Reverse Hooking Kick",
		k: "Bandae Golcha Chagi",
		lv: "Intermediate",
		desc: "A hooking kick delivered in the reverse direction using the back heel. Spins before hooking back into the target.",
		tgt: "High section",
		tool: "Back heel (Dwitchook)",
	},
	{
		name: "Downward Kick",
		k: "Naeryo Chagi",
		lv: "Intermediate",
		desc: "A kick that rises high then comes down with force onto the target like an axe, using the back heel.",
		tgt: "Head or shoulder",
		tool: "Back heel (Dwitchook)",
	},
	{
		name: "Sweeping Kick",
		k: "Goro Chagi",
		lv: "Intermediate",
		desc: "A sweeping kick that takes the opponent's supporting leg away. Executed low along the ground.",
		tgt: "Low section",
		tool: "Sole of foot (Balbadak)",
	},
	{
		name: "Twisting Kick",
		k: "Bituro Chagi",
		lv: "Intermediate",
		desc: "A kick with a twisting motion of the foot on impact using the ball of the foot. The foot twists inward as it contacts the target.",
		tgt: "Middle or high section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Vertical Kick",
		k: "Sewo Chagi",
		lv: "Intermediate",
		desc: "A kick in which the foot is held vertically using the ball of the foot, driving straight up through the target.",
		tgt: "High section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Checking Kick",
		k: "Cha Mum Chagi",
		lv: "Intermediate",
		desc: "A kick used to check or intercept an opponent's attack or movement. Stops the opponent in their tracks.",
		tgt: "Middle section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Consecutive Kick",
		k: "Yonsok Chagi",
		lv: "Advanced",
		desc: "Two or more kicks delivered in rapid succession without putting the foot down between them, e.g. turning kick followed by back kick.",
		tgt: "Multiple sections",
		tool: "Varies by kick combination",
	},
	{
		name: "Pick-shape Kick",
		k: "Gokgaeng-i Chagi",
		lv: "Advanced",
		desc: "A kick shaped like a pick or hook, targeting the opponent with a downward hooking motion.",
		tgt: "High section",
		tool: "Back heel (Dwitchook)",
	},
	{
		name: "Flying Front Kick",
		k: "Twimyo Ap Chagi",
		lv: "Flying",
		desc: "A jumping front kick using the ball of the foot. Jump and drive the leading knee up before extending the kick at the peak of the jump.",
		tgt: "High section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Flying Turning Kick",
		k: "Twimyo Dollyo Chagi",
		lv: "Flying",
		desc: "A jumping turning kick using the ball of the foot. Jump and rotate in the air before releasing the circular kick.",
		tgt: "High section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Flying Reverse Turning Kick",
		k: "Twimyo Bandae Dollyo Chagi",
		lv: "Flying",
		desc: "A jumping reverse turning kick. Jump, spin in the air and deliver the kick at the peak of the rotation.",
		tgt: "High section",
		tool: "Back heel (Dwitchook)",
	},
	{
		name: "Flying Side Piercing Kick",
		k: "Twimyo Yop Cha Jirugi",
		lv: "Flying",
		desc: "A jumping side kick using the footsword. One of the most powerful kicks in Taekwon-Do when executed correctly.",
		tgt: "Middle or high",
		tool: "Footsword (Balkal)",
	},
	{
		name: "Flying Side Thrusting Kick",
		k: "Twimyo Yop Cha Tulgi",
		lv: "Flying",
		desc: "A jumping side thrusting kick using the ball of the foot. Drives through the target with full body weight behind it.",
		tgt: "Middle section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Flying High Kick",
		k: "Twimyo Nopi Chagi",
		lv: "Flying",
		desc: "A jumping kick aimed at maximum height using the ball of the foot. Tests flexibility and jumping ability.",
		tgt: "High section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Flying Twisting Kick",
		k: "Twimyo Bituro Chagi",
		lv: "Flying",
		desc: "A jumping twisting kick using the ball of the foot. Combines the jump with the twisting foot motion.",
		tgt: "High section",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Flying Two Direction Kick",
		k: "Twimyo Sangbang Chagi",
		lv: "Flying",
		desc: "A split kick in the air — both legs kick in opposite directions simultaneously at the peak of the jump.",
		tgt: "Two opponents",
		tool: "Ball of foot (Apkumchi)",
	},
	{
		name: "Dodging Reverse Turning Kick",
		k: "Pihamyo Bandae Dollyo Chagi",
		lv: "Flying",
		desc: "A reverse turning kick that incorporates a dodge or evasion before the kick is launched.",
		tgt: "High section",
		tool: "Back heel (Dwitchook)",
	},
];

var BLOCKS = [
	{
		name: "Low Block",
		k: "Najunde Makgi",
		desc: "Blocks attacks to the low section using the outer forearm.",
	},
	{
		name: "Inner Forearm Block",
		k: "An Palmok Makgi",
		desc: "Blocks to the middle section using the inner forearm.",
	},
	{
		name: "Outer Forearm Block",
		k: "Bakat Palmok Makgi",
		desc: "Blocks using the outer forearm to the middle section.",
	},
	{
		name: "Rising Block",
		k: "Chookyo Makgi",
		desc: "Blocks attacks to the head using the forearm in an upward motion.",
	},
	{
		name: "Knifehand Guarding Block",
		k: "Sonkal Daebi Makgi",
		desc: "A guarding block using both knifehands simultaneously.",
	},
	{
		name: "Twin Forearm Block",
		k: "Sang Palmok Makgi",
		desc: "Uses both forearms simultaneously to block.",
	},
	{
		name: "Double Forearm Block",
		k: "Doo Palmok Makgi",
		desc: "One forearm blocks while the other supports at the elbow for extra power.",
	},
	{
		name: "Circular Block",
		k: "Dollimyo Makgi",
		desc: "A sweeping circular block that redirects the opponent's attack.",
	},
	{
		name: "Wedging Block",
		k: "Hechyo Makgi",
		desc: "Splits an attack outward with both forearms simultaneously in a wedging motion.",
	},
	{
		name: "Hooking Block",
		k: "Golcho Makgi",
		desc: "A hooking motion that traps and redirects the opponent's attacking limb.",
	},
	{
		name: "W-Shape Block",
		k: "San Makgi",
		desc: "Both arms form a W shape to block simultaneous attacks to the head and body.",
	},
	{
		name: "Low Pushing Block",
		k: "Najunde Miro Makgi",
		desc: "A pushing block directed downward to deflect low attacks.",
	},
	{
		name: "Pressing Block",
		k: "Noollo Makgi",
		desc: "A downward pressing motion to trap or deflect an attack from above.",
	},
	{
		name: "Waist Block",
		k: "Hori Makgi",
		desc: "A block at waist height used in specific patterns.",
	},
];

var STANCE_SVGS = {};

var STANCES = [
	{
		name: "Attention Stance",
		k: "Charyot Sogi",
		width: "Feet form 45° angle, heels together",
		length: "N/A",
		weight: "50% / 50%",
		feet: "Heels together, toes angled 45° apart",
		desc: "Heels together with feet forming a 45 degree angle. Weight distributed evenly, legs straight. Arms held slightly out and in front of the waist, elbows bent, fists lightly clenched facing downward. Always say Taekwon when bowing.",
	},
	{
		name: "Parallel Ready Stance",
		k: "Narani Junbi Sogi",
		width: "1 shoulder width measured from footswords",
		length: "N/A — feet level",
		weight: "50% / 50%",
		feet: "Both feet parallel, pointing forward",
		desc: "1 shoulder width wide measured from the footswords. Feet parallel. Weight evenly distributed, legs straight. Fists clenched slightly, 5cm apart, approximately 7cm from the abdomen. Upper arms forward at 30 degrees, lower arms bent upward at 40 degrees.",
	},
	{
		name: "Closed Ready Stance",
		k: "Moa Junbi Sogi",
		width: "Feet together — no width",
		length: "N/A — feet level",
		weight: "50% / 50%",
		feet: "Both feet together and parallel",
		desc: "Both feet together and parallel — no length or width. Weight distributed evenly, legs straight. Performed either full or side facing. Variations A, B, C and D differ in hand position.",
	},
	{
		name: "Walking Stance",
		k: "Gunnun Sogi",
		width: "1 shoulder width — measured between centre of insteps",
		length:
			"1.5 shoulder widths — from big toe of rear foot to big toe of front foot",
		weight: "50% / 50%",
		feet: "Front foot points straight forward. Rear foot points outward up to 25°.",
		desc: "1 shoulder width wide measured between the centre of the insteps. 1.5 shoulder widths long from big toe to big toe. Weight evenly distributed. Back leg straight and locked, back foot pointed outward up to 25 degrees. Front leg bent with kneecap directly over the heel, front foot pointing straight forward. Foot muscles tensed as if pulling the feet together.",
	},
	{
		name: "L-Stance",
		k: "Niunja Sogi",
		width: "2.5cm — from inside heel of front foot to back heel of rear foot",
		length:
			"1.5 shoulder widths — from footsword of rear foot to toes of front foot",
		weight: "70% rear / 30% front",
		feet: "Both feet turned inward 15°",
		desc: "Width is 2.5cm from inside heel of front foot to back heel of rear foot. 1.5 shoulder widths long from footsword of rear to toes of front. 70% weight on rear foot, 30% on front. Both feet turned inward 15 degrees. Rear knee bent so kneecap is over toes of rear foot. Rear hip aligned with inner knee of rear leg. Always performed half facing. Primary defensive stance.",
	},
	{
		name: "Fixed Stance",
		k: "Gojung Sogi",
		width: "2.5cm — from inside heel of front foot to back heel of rear foot",
		length:
			"1.5 shoulder widths — from big toe of rear foot to big toe of front foot (1 foot width longer than L-Stance)",
		weight: "50% / 50%",
		feet: "Both feet turned inward 15°",
		desc: "Same width as L-Stance (2.5cm) but 1 foot width longer. 1.5 shoulder widths long from big toe to big toe. Weight 50/50. Both feet turned inward 15 degrees. Rear knee over toes, rear hip aligned with inner knee. Always performed half facing.",
	},
	{
		name: "Sitting Stance",
		k: "Annun Sogi",
		width: "1.5 shoulder widths measured from big toes",
		length: "N/A — feet level",
		weight: "50% / 50%",
		feet: "Feet even and parallel, pointing forward",
		desc: "1.5 shoulder widths wide measured from the big toes. Feet even and parallel. Weight evenly distributed, knees bent over the balls of the feet. Chest and abdomen pushed out, hips pulled back. Performed full or side facing. Used for strong lateral strikes.",
	},
	{
		name: "Rear Foot Stance",
		k: "Dwit Bal Sogi",
		width: "No width — heel of rear foot slightly beyond heel of front",
		length:
			"1 shoulder width — from small toes of rear foot to small toes of front foot",
		weight: "90% rear / 10% front",
		feet: "Rear foot 15° inward. Front foot 25° inward, ball barely touching floor.",
		desc: "No width — heel of rear foot extends just past outside edge of heel of front foot. 1 shoulder width long. 90% weight on rear foot. Rear leg bent, kneecap over toes, rear foot turned in 15 degrees. Front leg bent, ball of front foot barely touching floor, heel slightly raised, foot pointing in 25 degrees. Always performed half facing.",
	},
	{
		name: "Bending Ready Stance",
		k: "Guburyo Junbi Sogi",
		width: "N/A — standing on one leg",
		length: "N/A — standing on one leg",
		weight: "100% on supporting leg",
		feet: "Supporting foot flat. Non-supporting foot sole placed on knee joint of supporting leg, footsword parallel to floor.",
		desc: "Standing on one bent supporting leg — no length or width. All weight on the bent supporting leg. Non-supporting foot placed on the knee joint of the supporting leg with footsword parallel to the floor. Type A: non-supporting knee faces 45° inward, fists in guarding block. Type B: knee faces front as if preparing for back kick.",
	},
	{
		name: "X-Stance",
		k: "Kyocha Sogi",
		width: "Virtually no width",
		length: "Virtually no length",
		weight: "Almost 100% on stationary leg",
		feet: "Ball of non-supporting foot barely touching floor beside stationary foot, both legs bent. Cross in front when stepping, behind when jumping.",
		desc: "Standing on one leg with ball of other foot barely touching the floor beside it. Virtually no length or width. Almost all weight on the stationary leg. Non-supporting leg crosses in front when stepping, behind when jumping. Both legs bent. Performed full, side or half facing.",
	},
	{
		name: "Low Stance",
		k: "Nachuo Sogi",
		width: "1 shoulder width — measured between centre of insteps",
		length:
			"1.5 shoulder widths — from big toe of rear foot to heel of front foot",
		weight: "50% / 50%",
		feet: "Front foot straight forward. Rear foot outward up to 25°.",
		desc: "Same width as Walking Stance but measured from big toe of rear foot to heel of front foot. 1 shoulder width wide, 1.5 shoulder widths long. Weight evenly distributed. Back leg straight and locked, back foot pointed outward up to 25 degrees. Front leg bent with kneecap over heel. Similar to Walking Stance but longer and lower.",
	},
	{
		name: "Vertical Stance",
		k: "Soojik Sogi",
		width: "No width — heel of rear slightly beyond heel of front",
		length: "1 shoulder width — from big toe of rear to big toe of front",
		weight: "60% rear / 40% front",
		feet: "Both feet turned inward 15°. Both legs straight.",
		desc: "No width — similar to Rear Foot Stance in positioning. 1 shoulder width long from big toe to big toe. 60% weight on rear foot, 40% on front. Both feet turned inward 15 degrees. Both legs straight. Always performed half facing.",
	},
	{
		name: "Diagonal Stance",
		k: "Sasun Sogi",
		width: "1.5 shoulder widths measured from balls of feet",
		length: "Heel of front foot level with toes of rear foot",
		weight: "50% / 50%",
		feet: "Feet parallel, both angled diagonally",
		desc: "1.5 shoulder widths wide measured from the balls of the feet. Feet parallel with heel of front foot even with toes of rear foot. Weight evenly distributed, knees bent over balls of feet. Hips pulled back. Named for the more advanced foot, performed full or side facing.",
	},
	{
		name: "One-Leg Stance",
		k: "Waebal Sogi",
		width: "N/A — standing on one leg",
		length: "N/A — standing on one leg",
		weight: "100% on stationary leg",
		feet: "Stationary leg straight. Non-supporting foot placed on side of knee joint (reverse footsword flat, toes pulled back) OR instep placed in hollow at rear of supporting knee.",
		desc: "Standing on one straight stationary leg — no length or width. All weight on the stationary leg. Non-supporting foot placed either with reverse footsword on the side of the knee joint (flat, toes pulled back), or with the instep in the hollow at the rear of the supporting knee. Named for the stationary leg, performed full or side facing.",
	},
	{
		name: "Warrior Ready Stance",
		k: "Soo Sogi",
		width: "Slightly wider than shoulder width",
		length: "N/A — feet level",
		weight: "50% / 50%",
		feet: "Both feet parallel, pointing forward",
		desc: "Similar to Parallel Ready Stance but slightly wider. Feet parallel with toes pointing forward. Used as a ready stance in higher Dan patterns. The specific hand position distinguishes it from the Parallel Ready Stance.",
	},
];

var BELTS = [
	{ name: "White Belt", color: "#f0f0f0", title: "", strip: "#f0f0f0" },
	{
		name: "White Belt - Yellow Stripe",
		color: "#f0f0f0",
		stripe: "#e8c800",
		title: "",
		strip: "linear-gradient(90deg,#f0f0f0 50%,#e8c800 50%)",
	},
	{ name: "Yellow Belt", color: "#e8c800", title: "", strip: "#e8c800" },
	{
		name: "Yellow Belt - Green Stripe",
		color: "#e8c800",
		stripe: "#28a840",
		title: "",
		strip: "linear-gradient(90deg,#e8c800 50%,#28a840 50%)",
	},
	{ name: "Green Belt", color: "#28a840", title: "", strip: "#28a840" },
	{
		name: "Green Belt - Blue Stripe",
		color: "#28a840",
		stripe: "#1848a0",
		title: "",
		strip: "linear-gradient(90deg,#28a840 50%,#1848a0 50%)",
	},
	{ name: "Blue Belt", color: "#1848a0", title: "", strip: "#1848a0" },
	{
		name: "Blue Belt - Red Stripe",
		color: "#1848a0",
		stripe: "#e81028",
		title: "",
		strip: "linear-gradient(90deg,#1848a0 50%,#e81028 50%)",
	},
	{ name: "Red Belt", color: "#e81028", title: "", strip: "#e81028" },
	{
		name: "Red Belt - Black Stripe",
		color: "#e81028",
		stripe: "#181818",
		title: "",
		strip: "linear-gradient(90deg,#e81028 50%,#181818 50%)",
	},
	{
		name: "1st Dan - Boo Sabum",
		color: "#181818",
		title: "Boo Sabum (Assistant Instructor)",
		strip: "linear-gradient(90deg,#181818 70%,#c9a84c 70%)",
	},
	{
		name: "2nd Dan - Boo Sabum",
		color: "#181818",
		title: "Boo Sabum (Assistant Instructor)",
		strip: "linear-gradient(90deg,#181818 70%,#c9a84c 70%)",
	},
	{
		name: "3rd Dan - Boo Sabum",
		color: "#181818",
		title: "Boo Sabum (Assistant Instructor)",
		strip: "linear-gradient(90deg,#181818 70%,#c9a84c 70%)",
	},
	{
		name: "4th Dan - Sabum",
		color: "#181818",
		title: "Sabum (Instructor)",
		strip: "linear-gradient(90deg,#181818 60%,#c9a84c 60%)",
	},
	{
		name: "5th Dan - Sabum",
		color: "#181818",
		title: "Sabum (Instructor)",
		strip: "linear-gradient(90deg,#181818 60%,#c9a84c 60%)",
	},
	{
		name: "6th Dan - Sabum",
		color: "#181818",
		title: "Sabum (Instructor)",
		strip: "linear-gradient(90deg,#181818 60%,#c9a84c 60%)",
	},
	{
		name: "7th Dan - Sahyun",
		color: "#181818",
		title: "Sahyun (Master)",
		strip: "linear-gradient(90deg,#181818 50%,#c9a84c 50%)",
	},
	{
		name: "8th Dan - Sahyun",
		color: "#181818",
		title: "Sahyun (Master)",
		strip: "linear-gradient(90deg,#181818 50%,#c9a84c 50%)",
	},
	{
		name: "9th Dan - Saseong",
		color: "#181818",
		title: "Saseong (Grand Master)",
		strip: "#c9a84c",
	},
];

function showBeltPicker() {
	var existing = document.getElementById("belt-modal");

	if (existing) {
		existing.remove();
		return;
	}

	var m = document.createElement("div");
	m.className = "belt-modal";
	m.id = "belt-modal";

	var s = document.createElement("div");
	s.className = "belt-sheet belt-sheet-scroll";

	s.innerHTML = '<div class="belt-picker-title">Select Your Belt</div>';

	BELTS.forEach(function (b, idx) {
		var d = document.createElement("div");

		var isSelected = BELT === b.name;

		var beltHtml;

		if (b.name.indexOf("Dan") >= 0 || b.name === "Black Belt") {
			var romans = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

			var dan = parseInt(b.name) || 1;

			var numeral = romans[Math.min(dan, 9)];

			beltHtml =
				'<div class="belt-preview belt-preview-black">' +
				'<span class="belt-preview-black-text">' +
				numeral +
				"</span>" +
				"</div>";
		} else if (b.stripe) {
			beltHtml =
				'<div class="belt-preview belt-preview-striped" style="background:' +
				b.color +
				'">' +
				'<div class="belt-stripe-top" style="background:' +
				b.color +
				'"></div>' +
				'<div class="belt-stripe-middle" style="background:' +
				b.stripe +
				'"></div>' +
				'<div class="belt-stripe-bottom" style="background:' +
				b.color +
				'"></div>' +
				"</div>";
		} else {
			beltHtml =
				'<div class="belt-preview belt-preview-solid" style="background:' +
				b.color +
				'"></div>';
		}

		var sub = b.title
			? '<div class="belt-item-subtitle">' + b.title + "</div>"
			: "";

		d.className = "belt-item";

		if (isSelected) {
			d.classList.add("belt-item-selected");
		}

		d.innerHTML =
			beltHtml +
			'<div class="belt-item-content">' +
			'<div class="belt-item-title">' +
			b.name +
			"</div>" +
			sub +
			"</div>" +
			(isSelected
				? '<span class="belt-item-check">' +
					'<svg fill="currentColor" viewBox="0 0 20 20" style="width: 14px; height: 14px; color: #000;">' +
					'<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>' +
					"</svg>" +
					"</span>"
				: "");
		d.onclick = function () {
			BELT = b.name;
			BI = idx;

			localStorage.setItem("tkd-belt", b.name);

			var badge =
				document.getElementById("belt-badge") ||
				document.querySelector(".badge");

			if (badge) {
				badge.textContent = b.name + " ▾";
			}

			var strip = document.getElementById("belt-strip");

			if (strip) {
				strip.style.background = b.strip;
			}

			m.remove();

			// Refresh content immediately
			render();
		};

		s.appendChild(d);
	});

	m.appendChild(s);

	m.onclick = function (e) {
		if (e.target === m) {
			m.remove();
		}
	};

	document.body.appendChild(m);
}
var MD_QUOTES = [
	"You showed up. That alone puts you ahead of the people on the sofa judging you.",
	"Pain is temporary. Embarrassing yourself in patterns is forever.",
	"If your kick isn't head height, it's a foot massage. Try again.",
	"I've seen better stances from people falling down stairs.",
	"Confidence is not optional. Fake it until your kicks prove it.",
	"You don't need to be perfect. You just need to be better than yesterday. Low bar. Meet it.",
	"If it's easy, you're doing it wrong. This isn't yoga.",
	"I don't do sympathy. I do results. Crack on.",
	"Your patterns looked great. Said no one. Yet. Keep going.",
	"I've trained people older, slower and less flexible than you. They're all black belts now. No excuses.",
	"Three things improve your kicks: flexibility, flexibility and flexibility. Go stretch. Now.",
	"If you quit every time it gets hard, enjoy being a white belt forever.",
	"A black belt is just a white belt who refused to give up. Simple. Not easy.",
	"Your technique is a work in progress. Your effort should not be.",
	"There is only one target height. Head height. Everything else is warming up.",
	"You're not tired. You're comfortable. Big difference. Keep moving.",
	"I don't care how it looks. I care how hard you try. Look terrible. Try hard.",
	"If you practiced as much as you made excuses, you'd be a Dan grade by now.",
	"Sweat now. Impress me later.",
	"You came to class. Brilliant. Now actually do something in it.",
	"The person who trains when they don't want to beats the person who only trains when they feel like it. Every time.",
	"I have literally never once been impressed by someone giving up. Funny that.",
	"Your body can do more than your brain thinks. Your brain is a liar. Don't listen to it.",
	"Stop thinking. Start kicking. You can overthink it from the floor.",
	"If you're not sweating, I'm not watching.",
	"Train hard or go home. Actually — train hard OR go home and train harder.",
	"Mediocre effort gets mediocre results. Shocking news, I know.",
	"There is no bad training session. There is only training and skipping training.",
	"I once saw someone cry during warm-up. They're a black belt now. What's your excuse.",
	"Kick higher. No, higher than that. Higher. There. Was that so hard.",
	"You can rest when you're a Grand Master. You're not a Grand Master.",
	"Rules? What rules? There is only one height — head height.",
	"Stretching begins at 180 degrees. Everything before that is just sitting on the floor.",
	"I don't sweat. I leak excellence. You should try it.",
	"Fall down seven times, get up eight. Ideally without being asked twice.",
	"Your sparring partner isn't your enemy. Your laziness is.",
	"If found unconscious on the mat, please inform the examiner I gave everything.",
	"Some people want a trophy. Some people want to be good. Only one of those requires actual work.",
	"The difference between a good student and a great student is what they do when no one is watching.",
	"I believe in you. Prove me right. Or prove me wrong. Either way, kick something.",
	"Low kick is an insult. To me and to your leg. Raise it.",
	"You will get out of this exactly what you put in. Currently you're putting in... something. Aim higher.",
	"Patterns done slowly with precision are worth ten done fast with nonsense.",
	"I have never once handed out a belt to someone who didn't earn it. I'm not starting today.",
	"Confidence first. Skill catches up. It always does.",
	"Be the student your instructor brags about. Not the one they use as a cautionary tale.",
	"Every black belt in this club was once standing exactly where you are. Most of them were worse.",
	"If it looks like Taekwon-Do, feels like Taekwon-Do and hurts like Taekwon-Do — you're doing it right.",
	"Train like the grading examiner is always watching. Because one day, they will be.",
];

function getMDQuote() {
	return MD_QUOTES[Math.floor(Math.random() * MD_QUOTES.length)];
}
function getStats() {
	var s = JSON.parse(localStorage.getItem("tkd-sessions") || "[]");
	var now = new Date(),
		wk = new Date(now - 604800000);
	var tw = s.filter(function (x) {
		return new Date(x) > wk;
	}).length;
	var streak = 0,
		c = new Date();
	c.setHours(0, 0, 0, 0);
	for (var i = 0; i < 365; i++) {
		var ds = c.toDateString();
		if (
			s.some(function (x) {
				return new Date(x).toDateString() === ds;
			})
		) {
			streak++;
			c.setDate(c.getDate() - 1);
		} else if (i === 0) {
			c.setDate(c.getDate() - 1);
		} else break;
	}
	return { total: s.length, week: tw, streak: streak };
}
function logSession() {
	var s = JSON.parse(localStorage.getItem("tkd-sessions") || "[]");
	var td = new Date().toDateString();
	if (
		s.some(function (x) {
			return new Date(x).toDateString() === td;
		})
	) {
		alert("Already logged today! Great work!");
		return;
	}
	s.push(new Date().toISOString());
	localStorage.setItem("tkd-sessions", JSON.stringify(s));
	render();

	setTimeout(function () {
		var img = document.querySelector(".hero-img");
		if (img) {
			img.style.animation = "kickMove 0.8s ease-out";
		}
	}, 100);
}

var WORKOUTS = {
	beginner: [
		{
			title: "First Steps",
			duration: "15 min",
			type: "Beginner",
			emoji: "&#127919;",
			desc: "Perfect for new students. Short, simple and confidence-building.",
			exercises: [
				{
					name: "Jumping Jacks",
					reps: "3 x 20",
					note: "Warm up the whole body",
				},
				{
					name: "Press Ups (on knees OK)",
					reps: "3 x 8",
					note: "Focus on form not speed",
				},
				{
					name: "Squats",
					reps: "3 x 15",
					note: "Feet shoulder width, toes forward",
				},
				{
					name: "Walking Stance punches",
					reps: "20 each side",
					note: "Slow and controlled",
				},
				{
					name: "Front Snap Kicks",
					reps: "10 each leg",
					note: "Hold something for balance if needed",
				},
			],
			tip: "Everyone starts somewhere. These 15 minutes matter more than you think.",
		},

		{
			title: "Foundations Builder",
			duration: "20 min",
			type: "Beginner",
			emoji: "&#127775;",
			desc: "Building the base. Simple exercises done well beat hard ones done badly.",
			exercises: [
				{ name: "Star Jumps", reps: "3 x 20", note: "Get the heart going" },
				{
					name: "Wall Sit",
					reps: "2 x 30 seconds",
					note: "Back flat against the wall",
				},
				{ name: "Press Ups", reps: "3 x 10", note: "On knees is fine" },
				{ name: "Sit Ups", reps: "3 x 15", note: "Slow and controlled" },
				{
					name: "Pattern x3",
					reps: "Your current belt pattern",
					note: "Take your time, no rush",
				},
			],
			tip: "Consistency beats intensity every time. Show up every day.",
		},

		{
			title: "Kick Starter",
			duration: "20 min",
			type: "Beginner",
			emoji: "&#129354;",
			desc: "Introduction to kicking. Building the movement patterns your kicks need.",
			exercises: [
				{
					name: "Knee raises",
					reps: "20 each leg",
					note: "Bring knee to hip height",
				},
				{
					name: "Front kick practice",
					reps: "15 each leg",
					note: "Slow motion, feel the chamber",
				},
				{
					name: "Side kick practice",
					reps: "10 each leg",
					note: "Turn hips fully",
				},
				{ name: "Squats", reps: "3 x 15", note: "Build the leg strength" },
				{
					name: "Stretch — hamstrings",
					reps: "Hold 45 sec x2 each",
					note: "Sit on floor, reach for toes",
				},
			],
			tip: "Kick height comes from flexibility, not strength. Stretch every single day.",
		},

		{
			title: "Easy Active Session",
			duration: "15 min",
			type: "Beginner",
			emoji: "&#128994;",
			desc: "A lighter day. Still moving, still training, still making progress.",
			exercises: [
				{
					name: "Gentle jog on spot",
					reps: "3 minutes",
					note: "Easy pace, warm the body",
				},
				{
					name: "Arm circles",
					reps: "20 each direction",
					note: "Full range of motion",
				},
				{ name: "Squats", reps: "2 x 12", note: "Controlled pace" },
				{
					name: "Walking Stance practice",
					reps: "Across the room x5",
					note: "Focus on correct foot angles",
				},
				{
					name: "Full body stretch",
					reps: "5 minutes",
					note: "Hold each stretch 30 seconds",
				},
			],
			tip: "A light session is still a session. Never skip — just scale it back.",
		},

		{
			title: "Core for Beginners",
			duration: "15 min",
			type: "Beginner",
			emoji: "&#128170;",
			desc: "A gentle introduction to core work. Essential for every technique you will ever do.",
			exercises: [
				{
					name: "Plank hold",
					reps: "3 x 20 seconds",
					note: "Build up the time gradually",
				},
				{ name: "Sit Ups", reps: "3 x 12", note: "Slow on the way down" },
				{
					name: "Leg raises (lying)",
					reps: "3 x 10",
					note: "Keep lower back on floor",
				},
				{ name: "Hip bridges", reps: "3 x 15", note: "Squeeze glutes at top" },
				{
					name: "Pattern x2",
					reps: "Your current pattern",
					note: "Core engaged throughout",
				},
			],
			tip: "A strong core makes every kick higher, every block stronger, every pattern better.",
		},
	],

	intermediate: [
		{
			title: "The Mandatory 50s",
			duration: "30 min",
			type: "Intermediate",
			emoji: "&#128293;",
			desc: "Non-stop bodyweight grind. No rest until each set is done.",
			exercises: [
				{
					name: "Press Ups",
					reps: "50 total",
					note: "Chest to floor every rep",
				},
				{ name: "Squats", reps: "50 total", note: "Parallel or below" },
				{ name: "Sit Ups", reps: "50 total", note: "Full range of motion" },
				{
					name: "Burpees",
					reps: "50 total",
					note: "Chest to floor, jump at top",
				},
				{ name: "Lunges", reps: "25 each leg", note: "Keep torso upright" },
			],
			tip: "Rest only when you need to. Track your time and beat it next session.",
		},

		{
			title: "Kicking Combinations",
			duration: "30 min",
			type: "Intermediate",
			emoji: "&#9889;",
			desc: "Chain kicks together. Builds coordination, speed and fitness.",
			exercises: [
				{
					name: "Front kick + Turning kick",
					reps: "15 combos each leg",
					note: "Same leg, chamber between",
				},
				{
					name: "Side kick + Back kick",
					reps: "12 combos each leg",
					note: "Pivot smoothly",
				},
				{
					name: "Turning kick x30",
					reps: "Each leg",
					note: "Full hip rotation every rep",
				},
				{
					name: "Back kicks",
					reps: "20 each leg",
					note: "Drive the heel straight back",
				},
				{
					name: "High kicks",
					reps: "10 max height each leg",
					note: "Push your limit",
				},
			],
			tip: "Combination kicking separates coloured belts from black belts. Drill it daily.",
		},

		{
			title: "Pattern Fitness Circuit",
			duration: "35 min",
			type: "Intermediate",
			emoji: "&#129353;",
			desc: "Mix pattern work with conditioning. Train like grading day is tomorrow.",
			exercises: [
				{
					name: "Full pattern x5",
					reps: "Full power",
					note: "Your current grading pattern",
				},
				{ name: "Press Ups", reps: "20", note: "After each pattern run" },
				{ name: "Jump Squats", reps: "15", note: "Explosive — land soft" },
				{
					name: "Knifehand strikes",
					reps: "30 each arm",
					note: "Full extension",
				},
				{
					name: "Full pattern x5 more",
					reps: "Full power",
					note: "Tired now? Good.",
				},
			],
			tip: "Patterns done when you are tired reveal your real technique level.",
		},

		{
			title: "Upper Body Grind",
			duration: "25 min",
			type: "Intermediate",
			emoji: "&#129354;",
			desc: "Build the arm and shoulder strength behind every block and strike.",
			exercises: [
				{ name: "Press Ups", reps: "4 x 20", note: "Slow down, explosive up" },
				{
					name: "Diamond Press Ups",
					reps: "3 x 12",
					note: "Triceps and chest",
				},
				{
					name: "Pike Press Ups",
					reps: "3 x 10",
					note: "Hips high, head toward floor",
				},
				{ name: "Plank hold", reps: "3 x 45 seconds", note: "Full body tight" },
				{ name: "Tricep Dips (chair)", reps: "3 x 15", note: "Elbows back" },
			],
			tip: "Strong arms mean faster retractions, more powerful blocks, better patterns.",
		},

		{
			title: "Explosive Leg Day",
			duration: "30 min",
			type: "Intermediate",
			emoji: "&#9889;",
			desc: "Build the leg power behind your kicks. Pure bodyweight, maximum output.",
			exercises: [
				{ name: "Jump Squats", reps: "4 x 12", note: "Full squat, explode up" },
				{
					name: "Split Lunges",
					reps: "3 x 10 each leg",
					note: "Jump and switch in the air",
				},
				{
					name: "Wall Sit",
					reps: "3 x 45 seconds",
					note: "Thighs parallel to floor",
				},
				{
					name: "Step-Up Knee Raises",
					reps: "3 x 12 each leg",
					note: "Drive knee to chest",
				},
				{ name: "Calf Raises", reps: "60 total", note: "Slow and controlled" },
			],
			tip: "Strong legs = higher kicks, better stances, more power. Simple.",
		},

		{
			title: "The Stretching Blueprint",
			duration: "30 min",
			type: "Intermediate",
			emoji: "&#129496;",
			desc: "The session your kicks depend on. Do this 3 times a week minimum.",
			exercises: [
				{
					name: "Standing side stretch",
					reps: "Hold 45 sec x3 each",
					note: "Reach arm over",
				},
				{
					name: "Seated hamstring stretch",
					reps: "Hold 60 sec x3 each",
					note: "Keep back flat",
				},
				{
					name: "Butterfly stretch",
					reps: "Hold 90 sec x2",
					note: "Elbows push knees gently",
				},
				{
					name: "Standing quad stretch",
					reps: "Hold 45 sec x3 each",
					note: "Pull heel to glute",
				},
				{
					name: "Hip flexor lunge stretch",
					reps: "Hold 60 sec x3 each",
					note: "Pelvis tucked under",
				},
			],
			tip: "You cannot kick high with tight hamstrings. This session is not optional.",
		},

		{
			title: "The Recovery Session",
			duration: "20 min",
			type: "Intermediate",
			emoji: "&#127774;",
			desc: "Sore from yesterday? Do this instead of nothing.",
			exercises: [
				{
					name: "Walking in stances",
					reps: "5 minutes",
					note: "Walking stance forward and back, slow",
				},
				{
					name: "Gentle arm circles",
					reps: "2 min each direction",
					note: "Full range, no jerking",
				},
				{
					name: "Hip rotations",
					reps: "30 each direction",
					note: "Loosen up hip flexors",
				},
				{
					name: "Pattern x3",
					reps: "50% power",
					note: "Focus on accuracy not speed",
				},
				{
					name: "Full body stretch",
					reps: "8 minutes",
					note: "Hold each stretch 45 seconds",
				},
			],
			tip: "Recovery sessions are training sessions. The body adapts during rest.",
		},
	],

	advanced: [
		{
			title: "The Black Belt Grind",
			duration: "45 min",
			type: "Advanced",
			emoji: "&#127941;",
			desc: "This is not comfortable. It is not supposed to be.",
			exercises: [
				{ name: "Burpees", reps: "5 x 20", note: "Chest to floor. Every rep." },
				{
					name: "Turning kicks",
					reps: "80 each leg",
					note: "No stopping. Height maintained.",
				},
				{ name: "Press Ups", reps: "5 x 25", note: "Between kick sets" },
				{
					name: "Pattern x10",
					reps: "Full power",
					note: "Your highest grading pattern",
				},
				{
					name: "Jump squats",
					reps: "5 x 15",
					note: "Explode every single rep",
				},
			],
			tip: "Black belt is not a destination. It is a standard you maintain every day.",
		},

		{
			title: "The 100 Rep Warrior",
			duration: "35 min",
			type: "Advanced",
			emoji: "&#128293;",
			desc: "100 reps of everything. Simple. Brutal. Effective.",
			exercises: [
				{
					name: "Press Ups",
					reps: "100 total",
					note: "Break into sets as needed",
				},
				{ name: "Squats", reps: "100 total", note: "Deep and controlled" },
				{ name: "Sit Ups", reps: "100 total", note: "Full range" },
				{
					name: "Turning kicks",
					reps: "100 total",
					note: "50 each leg, full power",
				},
				{ name: "Burpees", reps: "50 total", note: "Finish strong" },
			],
			tip: "The 100s build mental toughness as much as physical strength.",
		},

		{
			title: "The AMRAP Challenge",
			duration: "20 min",
			type: "Advanced",
			emoji: "&#127987;",
			desc: "As Many Rounds As Possible in 20 minutes. Keep moving. No excuses.",
			exercises: [
				{ name: "10 Burpees", reps: "Every round", note: "Chest to floor" },
				{ name: "15 Press Ups", reps: "Every round", note: "Full range" },
				{ name: "20 Squats", reps: "Every round", note: "Below parallel" },
				{ name: "10 Tuck Jumps", reps: "Every round", note: "Knees to chest" },
				{ name: "30 sec Plank", reps: "Every round", note: "Full body tight" },
			],
			tip: "Write down your rounds. Next time — beat it by at least one.",
		},

		{
			title: "The Mental Toughness Test",
			duration: "40 min",
			type: "Advanced",
			emoji: "&#129504;",
			desc: "When your body says stop, your mind decides. Train the mind.",
			exercises: [
				{
					name: "Wall sit hold",
					reps: "As long as possible x3",
					note: "When it burns, stay.",
				},
				{
					name: "Plank hold",
					reps: "As long as possible x3",
					note: "No sagging.",
				},
				{ name: "Burpees", reps: "100 total", note: "Do not stop." },
				{
					name: "One-leg balance",
					reps: "3 min each leg eyes closed",
					note: "Stay still",
				},
				{
					name: "Pattern x5 when exhausted",
					reps: "Full power",
					note: "This is what grading feels like.",
				},
			],
			tip: "Champions are made when they want to stop and choose not to.",
		},

		{
			title: "Bag Work Substitute",
			duration: "30 min",
			type: "Advanced",
			emoji: "&#128293;",
			desc: "No bag? No problem. Shadow work with full power and intention.",
			exercises: [
				{
					name: "Shadow boxing",
					reps: "5 x 2 min rounds",
					note: "Full power, visualise the target",
				},
				{
					name: "Power turning kicks",
					reps: "40 each leg",
					note: "Drive through the target",
				},
				{
					name: "Knifehand strikes",
					reps: "50 each arm",
					note: "Full extension, snap",
				},
				{
					name: "Back fist strikes",
					reps: "40 each arm",
					note: "Explode from the elbow",
				},
				{
					name: "Flying kicks x10",
					reps: "Each leg",
					note: "Max height, max power",
				},
			],
			tip: "Shadow training with real intent builds real power. Lazy shadows build lazy technique.",
		},
	],
};

var CW = null;
var CWLEVEL = "beginner";
try {
	var _cw = localStorage.getItem("tkd-workout");
	var _cwl = localStorage.getItem("tkd-workout-level");
	if (_cw) CW = JSON.parse(_cw);
	if (_cwl) CWLEVEL = _cwl;
} catch (e) {}

function clearWorkout() {
	CW = null;
	try {
		localStorage.removeItem("tkd-workout");
	} catch (e) {}
	CT = "workouts";
	render();
}
function newWorkout(level) {
	if (level) CWLEVEL = level;
	if (!CWLEVEL || !WORKOUTS[CWLEVEL]) CWLEVEL = "beginner";
	var pool = WORKOUTS[CWLEVEL];
	if (!pool || !pool.length) pool = WORKOUTS["beginner"];
	CW = pool[Math.floor(Math.random() * pool.length)];
	try {
		localStorage.setItem("tkd-workout", JSON.stringify(CW));
		localStorage.setItem("tkd-workout-level", CWLEVEL);
	} catch (e) {}
	CT = "workouts";
	render();
}

var CHALLENGES = [
	{
		id: "tc60",
		name: "Turning Kick Challenge",
		desc: "How many turning kicks can you do in 60 seconds?",
		duration: 60,
		unit: "kicks",
		tip: "Alternate legs or one leg — your choice. Full technique counts.",
	},
	{
		id: "fk60",
		name: "Front Kick Blitz",
		desc: "How many front snap kicks in 60 seconds?",
		duration: 60,
		unit: "kicks",
		tip: "Chamber properly every rep. Sloppy ones don't count.",
	},
	{
		id: "sk60",
		name: "Side Kick Power",
		desc: "How many side kicks in 60 seconds?",
		duration: 60,
		unit: "kicks",
		tip: "Drive through fully. Half-hearted side kicks are not side kicks.",
	},
	{
		id: "bk60",
		name: "Back Kick Burn",
		desc: "How many back kicks in 60 seconds?",
		duration: 60,
		unit: "kicks",
		tip: "Look over your shoulder every rep. Drive the heel straight back.",
	},
	{
		id: "pu60",
		name: "Press Up Test",
		desc: "How many press ups in 60 seconds?",
		duration: 60,
		unit: "reps",
		tip: "Chest to floor every rep. Chin-ups don't count as press ups.",
	},
	{
		id: "sq60",
		name: "Squat Challenge",
		desc: "How many squats in 60 seconds?",
		duration: 60,
		unit: "squats",
		tip: "Below parallel every rep. Your knees will hate you. Good.",
	},
	{
		id: "hk60",
		name: "High Kick Challenge",
		desc: "How many head-height kicks in 60 seconds?",
		duration: 60,
		unit: "kicks",
		tip: "Head height only. Chest height is not head height. Be honest.",
	},
	{
		id: "bj60",
		name: "Burpee Challenge",
		desc: "How many burpees in 60 seconds?",
		duration: 60,
		unit: "burpees",
		tip: "Chest to floor, jump at top. No shortcuts. Master Dutton is watching.",
	},
	{
		id: "rk60",
		name: "Reverse Turning Kick",
		desc: "How many reverse turning kicks in 60 seconds?",
		duration: 60,
		unit: "kicks",
		tip: "Spin fast, kick clean. Speed and technique together.",
	},
	{
		id: "lunge60",
		name: "Lunge Challenge",
		desc: "How many walking lunges in 60 seconds?",
		duration: 60,
		unit: "lunges",
		tip: "Full depth, upright torso. Count each leg separately.",
	},
];

var CC = null; // current challenge
var CT_RUNNING = false; // timer running
var CT_TIME = 0; // time remaining
var CT_INTERVAL = null; // interval ref
var CC_SCORE = 0; // current score being entered

function getChallengePB(id) {
	try {
		var s = localStorage.getItem("tkd-pb-" + id);
		return s ? parseInt(s) : null;
	} catch (e) {
		return null;
	}
}
function saveChallengePB(id, score) {
	try {
		var pb = getChallengePB(id);
		if (!pb || score > pb) localStorage.setItem("tkd-pb-" + id, score);
	} catch (e) {}
}
function startChallenge(idx) {
	CC = CHALLENGES[idx];
	CT_RUNNING = false;
	CT_TIME = CC.duration;
	CC_SCORE = 0;
	if (CT_INTERVAL) clearInterval(CT_INTERVAL);
	render();
}
function startTimer() {
	if (CT_RUNNING) return;
	CT_RUNNING = true;
	CT_TIME = CC.duration;
	render();
	CT_INTERVAL = setInterval(function () {
		CT_TIME--;
		var el = document.getElementById("ct-time");
		if (el) el.textContent = CT_TIME;
		var bar = document.getElementById("ct-bar");
		if (bar) bar.style.width = (CT_TIME / CC.duration) * 100 + "%";
		if (CT_TIME <= 0) {
			clearInterval(CT_INTERVAL);
			CT_INTERVAL = null;
			CT_RUNNING = false;
			render();
		}
	}, 1000);
}
function submitScore(score) {
	var s = parseInt(score);
	if (isNaN(s) || s < 0) return;
	saveChallengePB(CC.id, s);
	var cName = localStorage.getItem("tkd-name") || "";
if (!cName) {
  cName = prompt("Enter your name for the leaderboard:") || "Anonymous";
  localStorage.setItem("tkd-name", cName);
}
if (window.saveScore) {
  window.saveScore(cName, s, CC.id);
}
	CC = null;
	CT_RUNNING = false;
	CT_TIME = 0;
	if (CT_INTERVAL) {
		clearInterval(CT_INTERVAL);
		CT_INTERVAL = null;}
}
function clearChallenge() {
	CC = null;
	CT_RUNNING = false;
	CT_TIME = 0;
	if (CT_INTERVAL) {
		clearInterval(CT_INTERVAL);
		CT_INTERVAL = null;
	}
	render();
}
function randomChallenge() {
	var idx = Math.floor(Math.random() * CHALLENGES.length);
	startChallenge(idx);
}

function rChallengeBox() {
	var h = '<div id="challenge-box">';

	if (!CC) {
		// Show challenge picker

		h +=
			'<div class="challenge-title"><img class="lighting-icon" src="./images/lighting.svg" alt="Lighting Icon"> Kicking Challenges</div>';

		h +=
			'<div onclick="randomChallenge()" class="challenge-random-card">' +
			'<div class="challenge-random-icon"><img class="lighting-icon" src="./images/lighting.svg" alt="Lighting Icon"></div>' +
			'<div class="challenge-random-heading">Random Challenge</div>' +
			'<div class="challenge-random-subtext">Tap for a random 60-second challenge</div>' +
			"</div>";

		h += '<div class="challenge-grid">';

		CHALLENGES.forEach(function (c, i) {
			var pb = getChallengePB(c.id);

			h +=
				'<div onclick="startChallenge(' +
				i +
				')" class="challenge-card">' +
				'<div class="challenge-card-time"><span>60</span>sec</div>' +
				'<div class="challenge-card-name">' +
				c.name +
				"</div>" +
				(pb
					? '<div class="challenge-card-pb">&#11088; PB: ' +
						pb +
						" " +
						c.unit +
						"</div>"
					: '<div class="challenge-card-empty">No record yet</div>') +
				"</div>";
		});

		h += "</div>";
	} else if (CT_TIME === 0 && !CT_RUNNING) {
		// Time up - enter score

		h +=
			'<div class="challenge-panel">' +
			'<div class="challenge-panel-header challenge-panel-header-red">' +
			'<div class="challenge-panel-topbar">' +
			'<button onclick="clearChallenge()" class="challenge-back-btn"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Back</button>' +
			'<span class="challenge-timeup">TIME UP!</span>' +
			"</div>" +
			'<div class="challenge-main-title"><img class="lighting-icon" src="./images/lighting.svg" alt="Lighting Icon"> ' +
			CC.name +
			"</div>" +
			"</div>" +
			'<div class="challenge-panel-body">' +
			'<div class="challenge-score-label">How many did you get?</div>' +
			'<input id="score-input" type="number" min="0" placeholder="Enter your score" class="challenge-score-input"/>';

		var pb = getChallengePB(CC.id);

		if (pb) {
			h +=
				'<div class="challenge-user-pb">&#11088; Your PB: ' +
				pb +
				" " +
				CC.unit +
				"</div>";
		}

		h +=
			'<button onclick="submitScore(document.getElementById(\'score-input\').value)" class="challenge-save-btn">SAVE SCORE</button>' +
			"</div></div>";
	} else {
		// Challenge active - show timer

		var pb = getChallengePB(CC.id);

		h +=
			'<div class="challenge-panel">' +
			'<div class="challenge-panel-header challenge-panel-header-red">' +
			'<div class="challenge-panel-topbar">' +
			'<button onclick="clearChallenge()" class="challenge-back-btn"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Back</button>' +
			(pb
				? '<span class="challenge-header-pb">&#11088; PB: ' +
					pb +
					" " +
					CC.unit +
					"</span>"
				: "") +
			"</div>" +
			'<div class="challenge-main-title"><img class="lighting-icon" src="./images/lighting.svg" alt="Lighting Icon"> ' +
			CC.name +
			"</div>" +
			'<div class="challenge-description">' +
			CC.desc +
			"</div>" +
			"</div>" +
			'<div class="challenge-panel-body challenge-panel-body-center">' +
			'<div class="challenge-timer ' +
			(CT_TIME <= 10 ? "challenge-timer-warning" : "") +
			'" id="ct-time">' +
			CT_TIME +
			"</div>" +
			'<div class="challenge-timer-label">seconds remaining</div>' +
			'<div class="challenge-progress-track">' +
			'<div id="ct-bar" class="challenge-progress-fill" style="width:' +
			(CT_TIME / CC.duration) * 100 +
			'%"></div>' +
			"</div>" +
			(CT_RUNNING
				? '<div class="challenge-running-text">GO! GO! GO!</div>'
				: '<button onclick="startTimer()" class="challenge-start-btn"><svg id="fi_727245" enable-background="new 0 0 320.001 320.001" viewBox="0 0 320.001 320.001" xmlns="http://www.w3.org/2000/svg"><path d="m295.84 146.049-256-144c-4.96-2.784-11.008-2.72-15.904.128-4.928 2.88-7.936 8.128-7.936 13.824v288c0 5.696 3.008 10.944 7.936 13.824 2.496 1.44 5.28 2.176 8.064 2.176 2.688 0 5.408-.672 7.84-2.048l256-144c5.024-2.848 8.16-8.16 8.16-13.952s-3.136-11.104-8.16-13.952z"></path><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg> START</button>') +
			'<div class="challenge-tip-box">' +
			'<div class="challenge-tip-text">' +
			CC.tip +
			"</div>" +
			"</div>" +
			"</div></div>";
	}

	h += "</div>";

	return h;
}

function rHomeMenu() {
	var items = [
		{
			id: "patterns",
			title: "PATTERNS",
			desc: "Learn and perfect all ITF Patterns",
			action: "sT('patterns')",
			icon: '<img src="./images/patterns-active.svg" alt="Patterns" />',
		},
		{
			id: "workouts",
			title: "WORKOUTS",
			desc: "Train strength, fitness & endurance",
			action: "sT('workouts')",
			icon: '<img src="./images/workout-active.svg" alt="Workouts" />',
		},
		{
			id: "techniques",
			title: "TECHNIQUES",
			desc: "Step by step guides & breakdowns",
			action: "sT('techniques')",
			icon: '<img src="./images/technique-active.svg" alt="Techniques" />',
		},
		{
			id: "sparring",
			title: "SPARRING",
			desc: "Drills, strategies & sparring skills",
			action: "sT('sparring')",
			icon: '<img src="./images/sparring-active.svg" alt="Sparring" />',
		},
		{
			id: "grading",
			title: "GRADING",
			desc: "Theory, requirements & guides",
			action: "sT('belt')",
			icon: '<img src="./images/grading-active.svg" alt="Grading" />',
		},
	];

	var h = '<div class="home-menu-container">';
	items.forEach(function (item) {
		h += '<div class="home-menu-card" onclick="' + item.action + '">';
		h += '<div class="home-menu-icon-wrap">' + item.icon + "</div>";
		h += '<div class="home-menu-details">';
		h += '<div class="home-menu-title">' + item.title + "</div>";
		h += '<div class="home-menu-desc">' + item.desc + "</div>";
		h += "</div>";
		h +=
			'<div class="home-menu-chevron"><img src="./images/chevron.svg" alt="Chevron" class="icon-lt"></div>';
		h += "</div>";
	});
	h += "</div>";
	return h;
}

function scrollToWorkouts() {
	sT("workouts");
}

var STRETCHES = [
	{
		name: "Static Stretching",
		icon: "&#129496;",
		color: "#6366f1",
		intro:
			"Holding a stretch for a sustained period without movement. This is the most common and safest form of stretching for improving overall flexibility.",
		when: "Best done after training when muscles are warm. Ideal for cool-down and long-term flexibility gains.",
		understand:
			"Static stretching involves slowly moving into a stretch position and holding it for 20–60 seconds. It helps lengthen muscles and increase range of motion. In Taekwon-Do, it improves kick height, deeper stances, and reduces injury risk by keeping muscles supple and joints mobile.",
		routines: {
			10: [
				"Standing Hamstring Stretch",
				"Seated Forward Fold",
				"Butterfly Stretch",
				"Hip Flexor Lunge Stretch",
				"Calf Wall Stretch",
				"Quad Stretch (Standing)",
			],
			15: [
				"Standing Hamstring Stretch",
				"Seated Forward Fold",
				"Butterfly Stretch",
				"Hip Flexor Lunge Stretch",
				"Calf Wall Stretch",
				"Quad Stretch (Standing)",
				"Figure-4 Glute Stretch",
				"Side Lunge Stretch",
			],
			30: [
				"Standing Hamstring Stretch",
				"Seated Forward Fold",
				"Butterfly Stretch",
				"Hip Flexor Lunge Stretch",
				"Calf Wall Stretch",
				"Quad Stretch (Standing)",
				"Figure-4 Glute Stretch",
				"Side Lunge Stretch",
				"Wide Leg Forward Fold",
				"Lying Spinal Twist",
				"Shoulder & Chest Opener",
				"Full Body Cool Down Hold",
			],
		},
		advice:
			"Consistency beats intensity. A short routine done regularly will outperform occasional long sessions.",
	},
	{
		name: "Dynamic Stretching",
		icon: "&#9889;",
		color: "#f97316",
		intro:
			"Controlled, active movements that take your joints and muscles through their full range of motion. Excellent as part of a warm-up.",
		when: "Always before training or competition. Never do dynamic stretching when cold.",
		understand:
			"Dynamic stretching uses gentle swinging or controlled movements to prepare the body for action. It increases blood flow, warms up muscles, and improves functional mobility. For Taekwon-Do, it helps prepare your hips, legs and core for powerful, fast kicks without reducing strength.",
		routines: {
			10: [
				"Leg Swings (Front to Back)",
				"Leg Swings (Side to Side)",
				"Hip Circles",
				"Walking Lunges with Twist",
				"Arm Circles",
				"High Knees",
			],
			15: [
				"Leg Swings (Front to Back)",
				"Leg Swings (Side to Side)",
				"Hip Circles",
				"Walking Lunges with Twist",
				"Arm Circles",
				"High Knees",
				"Butt Kicks",
				"Torso Rotations",
			],
			30: [
				"Leg Swings (Front to Back)",
				"Leg Swings (Side to Side)",
				"Hip Circles",
				"Walking Lunges with Twist",
				"Arm Circles",
				"High Knees",
				"Butt Kicks",
				"Torso Rotations",
				"Inch Worms",
				"World's Greatest Stretch",
				"Dynamic Cossack Squats",
				"Full Dynamic Warm-up Sequence",
			],
		},
		advice:
			"Dynamic stretching should feel smooth and controlled. Never bounce or force the movement.",
	},
	{
		name: "PNF Stretching",
		icon: "&#129533;",
		color: "#2ea84a",
		intro:
			"Proprioceptive Neuromuscular Facilitation — Contract-relax method that tricks your nervous system into allowing a deeper stretch.",
		when: "After a good warm-up or at the end of training. Best done 2–3 times per week.",
		understand:
			"PNF uses a 6-second contraction followed by a deep relaxation to increase flexibility faster than static stretching alone. It is very effective for martial artists wanting higher kicks and better side splits.",
		routines: {
			10: [
				"PNF Hamstring Stretch",
				"PNF Hip Flexor Stretch",
				"PNF Adductor (Butterfly)",
				"PNF Calf Stretch",
			],
			15: [
				"PNF Hamstring Stretch",
				"PNF Hip Flexor Stretch",
				"PNF Adductor (Butterfly)",
				"PNF Calf Stretch",
				"PNF Glute / Piriformis",
				"PNF Quad Stretch",
			],
			30: [
				"PNF Hamstring Stretch",
				"PNF Hip Flexor Stretch",
				"PNF Adductor (Butterfly)",
				"PNF Calf Stretch",
				"PNF Glute / Piriformis",
				"PNF Quad Stretch",
				"PNF Inner Thigh Standing",
				"Full Lower Body PNF Sequence",
			],
		},
		advice:
			"The key to PNF is full relaxation after the contraction. Breathe out slowly as you go deeper.",
	},
	{
		name: "Ballistic Stretching",
		icon: "&#128293;",
		color: "#f97316",
		intro:
			"Uses momentum and gentle bouncing to push muscles beyond their normal range. Advanced method only.",
		when: "Only when muscles are thoroughly warm. Advanced students only.",
		understand:
			"Ballistic stretching uses rhythmic bouncing movements. It trains the nervous system to accept higher ranges of motion — very useful for high kicks in Taekwon-Do, but must be done carefully to avoid injury.",
		routines: {
			10: [
				"Ballistic Hamstring Bounce",
				"Standing Leg Swings (High Kick)",
				"Ballistic Butterfly Pulses",
				"High Side Kick Swings",
			],
			15: [
				"Ballistic Hamstring Bounce",
				"Standing Leg Swings (High Kick)",
				"Ballistic Butterfly Pulses",
				"High Side Kick Swings",
				"Ballistic Hip Flexor Lunge",
				"Forward Fold Bounce",
			],
			30: [
				"Ballistic Hamstring Bounce",
				"Standing Leg Swings (High Kick)",
				"Ballistic Butterfly Pulses",
				"High Side Kick Swings",
				"Ballistic Hip Flexor Lunge",
				"Forward Fold Bounce",
				"Full Ballistic Kick Sequence",
			],
		},
		advice:
			"Only use small, controlled pulses. Stop immediately if you feel sharp pain.",
	},
	{
		name: "Isometric Stretching",
		icon: "&#128170;",
		color: "#a855f7",
		intro:
			"Contracting the muscle while it is already in a stretched position. Builds strength at your end range.",
		when: "After training or as a standalone session.",
		understand:
			"Isometric stretching builds strength in the lengthened position. This is extremely useful in Taekwon-Do because it improves both flexibility and the ability to hold high kicks with control and power.",
		routines: {
			10: [
				"Isometric Hamstring Hold",
				"Isometric Side Kick Hold",
				"Isometric Wide Stance",
				"Isometric Hip Flexor Hold",
			],
			15: [
				"Isometric Hamstring Hold",
				"Isometric Side Kick Hold",
				"Isometric Wide Stance",
				"Isometric Hip Flexor Hold",
				"Isometric Glute Bridge Hold",
				"Isometric Calf Hold",
			],
			30: [
				"Isometric Hamstring Hold",
				"Isometric Side Kick Hold",
				"Isometric Wide Stance",
				"Isometric Hip Flexor Hold",
				"Isometric Glute Bridge Hold",
				"Isometric Calf Hold",
				"Isometric Squat Hold",
				"Full Isometric Lower Body",
			],
		},
		advice:
			"The stronger you become at your maximum range, the higher and more controlled your kicks will be.",
	},
	{
		name: "Active Stretching",
		icon: "&#129354;",
		color: "#a9caff",
		intro:
			"Using your own muscle strength to stretch the opposing muscle group. Builds functional flexibility.",
		when: "Before or after training. Excellent for warm-up and cool-down.",
		understand:
			"Active stretching uses muscle contraction to create the stretch. The range you can actively achieve is your true usable flexibility — critical for powerful, controlled Taekwon-Do kicks.",
		routines: {
			10: [
				"Active Leg Raise (Front)",
				"Active Leg Raise (Side)",
				"Active Hip Flexor Stretch",
				"Active Quad Stretch",
			],
			15: [
				"Active Leg Raise (Front)",
				"Active Leg Raise (Side)",
				"Active Hip Flexor Stretch",
				"Active Quad Stretch",
				"Active Thoracic Rotation",
				"Active Butterfly",
			],
			30: [
				"Active Leg Raise (Front)",
				"Active Leg Raise (Side)",
				"Active Hip Flexor Stretch",
				"Active Quad Stretch",
				"Active Thoracic Rotation",
				"Active Butterfly",
				"Active Calf Raise & Hold",
				"Full Active Flexibility Flow",
			],
		},
		advice:
			"What you can actively hold is what you can actually use in your kicks.",
	},
	{
		name: "Passive Stretching",
		icon: "&#127774;",
		color: "#6366f1",
		intro:
			"Using gravity, bodyweight, or a partner to hold a stretch. Excellent for deep relaxation and maximum range.",
		when: "After training when muscles are warm.",
		understand:
			"Passive stretching allows your muscles to fully relax while an external force deepens the stretch. It’s perfect for recovery and long-term flexibility development in Taekwon-Do.",
		routines: {
			10: [
				"Gravity Hamstring Stretch",
				"Gravity Butterfly Stretch",
				"Passive Hip Flexor Stretch",
				"Wall Hamstring Stretch",
			],
			15: [
				"Gravity Hamstring Stretch",
				"Gravity Butterfly Stretch",
				"Passive Hip Flexor Stretch",
				"Wall Hamstring Stretch",
				"Strap Hamstring Stretch",
				"Partner Inner Thigh Stretch",
			],
			30: [
				"Gravity Hamstring Stretch",
				"Gravity Butterfly Stretch",
				"Passive Hip Flexor Stretch",
				"Wall Hamstring Stretch",
				"Strap Hamstring Stretch",
				"Partner Inner Thigh Stretch",
				"Gravity Side Split Progression",
				"Full Passive Cool Down",
			],
		},
		advice:
			"The more you relax, the deeper gravity can take you. Breathe slowly and stay patient.",
	},
];

var ST_OPEN = null;
var ST_CAT = 0;
var ST_MIN = null; // Currently selected routine time
function showLeaderboard() { sT('leaderboard'); }

async function rLeaderboard() {
  var h = '<div class="top-image-section">' +
    '<button class="bk" onclick="sT(\'home\')"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home</button>' +
    '</div>';
  h += '<div class="stitle">🏆 QUIZ LEADERBOARD</div>';
  h += '<div class="stretch-intro" style="text-align:center;margin-bottom:16px;">Master Dutton\'s Elite Rankings</div>';
  h += '<div id="lb-loading" class="stretch-intro" style="text-align:center;">Loading scores...</div>';
  h += '<div id="lb-table" style="padding:0 12px 24px"></div>';
  setTimeout(async function() {
    if (window.getLeaderboard) {
      var scores = await window.getLeaderboard();
      var medals = ["🥇","🥈","🥉"];
      var t = '';
      scores.forEach(function(s, i) {
        var rank = i < 3 ? medals[i] : (i+1)+'.';
        var isTop = i === 0;
        t += '<div style="margin:8px 0;padding:14px 16px;border-radius:10px;background:' +
          (isTop ? 'linear-gradient(135deg,#2a1f00,#3d2e00)' : 'var(--card)') + ';' +
          'border:1px solid ' + (isTop ? '#c9a84c' : 'var(--border)') + ';' +
          'display:flex;align-items:center;gap:12px;">' +
          '<span style="font-size:' + (isTop?'26px':'20px') + ';min-width:32px;text-align:center">' + rank + '</span>' +
          '<div style="flex:1">' +
          '<div style="font-weight:700;color:' + (isTop?'#c9a84c':'var(--white)') + ';font-size:' + (isTop?'16px':'14px') + '">' + s.name + '</div>' +
          '<div style="font-size:11px;color:var(--muted);margin-top:2px">' + s.belt + '</div>' +
          '</div>' +
          '<div style="text-align:right">' +
          '<div style="font-size:20px;font-weight:700;color:' + (isTop?'#c9a84c':'var(--white)') + '">' + s.score + '</div>' +
          '<div style="font-size:10px;color:var(--muted)">/ 20</div>' +
          '</div></div>';
      });
      document.getElementById('lb-loading').style.display = 'none';
      document.getElementById('lb-table').innerHTML = t || '<div class="stretch-intro" style="text-align:center">No scores yet — be the first! 🥋</div>';
    }
  }, 500);
  return h;
}
function rSpar() {
  var h = '<div class="top-image-section">' +
    '<button class="bk" onclick="sT(\'home\')"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home</button>' +
    '</div>';
  h += '<div class="stitle">SPARRING</div>';
  h += '<div class="stretch-intro">Sparring drills, combinations and strategies — coming soon. Content is being added by Master Dutton.</div>';
  return h;
}
function rStretch() {
	var h =
		'<div class="top-image-section stretch-page">' +
		'<button class="bk" onclick="sT(\'home\')"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home</button>';

	h += '<div class="stitle">FLEXIBILITY & STRETCHING</div>';

	h +=
		'<div class="stretch-intro">The most underrated part of Taekwon-Do training. Flexibility directly determines kick height, stance depth and injury prevention.</div>';

	h += "</div>";

	h += '<div class="patterns-video-note">';

	h += '<img src="./images/video-icon.svg" alt="Video Icon">';

	h += "<div class='patterns-video-note-text'>";

	h += '<h3 class="stretch-video-title">Video Tutorials Coming Soon</h3>';

	h +=
		'<p class="stretch-video-text">Step-by-step stretching video guides will be added to YouTube and linked here.</p>';

	h += "</div></div>";

	// Category pills (keep as is)

	h += '<div class="pills stretch-pills">';

	STRETCHES.forEach(function (s, i) {
		h +=
			'<span class="pill' +
			(ST_CAT === i ? " a" : "") +
			'" onclick="sST(' +
			i +
			')" style="' +
			(ST_CAT === i
				? "border-color:" +
					s.color +
					";color:" +
					s.color +
					";background:" +
					s.color +
					"22"
				: "") +
			'">';

		h += s.icon + " " + s.name + "</span>";
	});

	h += "</div>";

	var cat = STRETCHES[ST_CAT];

	// Header + Intro + When to use

	h +=
		'<div class="stretch-category-card" style="border-left-color:' +
		cat.color +
		'">';

	h += '<div class="stretch-category-label" style="color:' + cat.color + '">';

	h += cat.icon + " " + cat.name + "</div>";

	h += '<div class="stretch-category-intro">' + cat.intro + "</div>";

	h += '<div class="stretch-when-box">';

	h += '<div class="stretch-when-title">When to use</div>';

	h += '<div class="stretch-when-text">' + cat.when + "</div>";

	h += "</div></div>";

	// Understand This Method

	h += '<div class="card stretch-understand-card">';

	h += '<div class="stretch-understand-title">UNDERSTAND THIS METHOD</div>';

	h += '<div class="stretch-understand-text">' + cat.understand + "</div>";

	h += "</div>";

	// Video placeholder

	h += '<div class="card1">';

	h += '<div class="stretch-watch-title">Watch the workout</div>';

	h += '<div class="stretch-video-placeholder">';

	h +=
		'<div class="stretch-placeholder-icon"><img src="./images/video-icon.svg" alt="Video Icon"></div>';

	h += '<div class="stretch-placeholder-title">VIDEO COMING SOON</div>';

	h +=
		'<div class="stretch-placeholder-text">YouTube tutorial for this stretching method will be added here.</div>';

	h += "</div>";

	h += "</div>";

	return h;
}

function sST(i) {
	ST_CAT = i;
	ST_OPEN = null;
	render();
}
function sSTOpen(k) {
	ST_OPEN = ST_OPEN === k ? null : k;
	render();
}
function selectRoutine(mins) {
	ST_MIN = mins;
	render();
}
function getGradingCountdown() {
	try {
		var p = JSON.parse(localStorage.getItem("tkd-profile") || "{}");
		if (p.gradingDate) {
			var d = new Date(p.gradingDate);
			var now = new Date();
			var days = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
			if (days > 0) return days + "d";
			if (days === 0) return "TODAY!";
			return "Done ✓";
		}
	} catch (e) {}
	return "Set date";
}
function getBeltGrade() {
	var grades = {
		"White Belt": "10th Kup",
		"White Belt - Yellow Stripe": "9th Kup",
		"Yellow Belt": "8th Kup",
		"Yellow Belt - Green Stripe": "7th Kup",
		"Green Belt": "6th Kup",
		"Green Belt - Blue Stripe": "5th Kup",
		"Blue Belt": "4th Kup",
		"Blue Belt - Red Stripe": "3rd Kup",
		"Red Belt": "2nd Kup",
		"Red Belt - Black Stripe": "1st Kup",
		"1st Dan - Boo Sabum": "1st Dan",
		"2nd Dan - Boo Sabum": "2nd Dan",
		"3rd Dan - Boo Sabum": "3rd Dan",
		"4th Dan - Sabum": "4th Dan",
		"5th Dan - Sabum": "5th Dan",
		"6th Dan - Sabum": "6th Dan",
		"7th Dan - Sahyun": "7th Dan",
		"8th Dan - Sahyun": "8th Dan",
		"9th Dan - Saseong": "9th Dan",
	};
	return grades[BELT] || BELT;
}
function rHome() {
	var st = getStats();

	var lvl =
		st.total === 0
			? "New!"
			: st.total < 10
				? "Beginner"
				: st.total < 50
					? "Student"
					: st.total < 100
						? "Warrior"
						: "Master";

	var sm =
		st.streak === 0
			? "Start your streak!"
			: st.streak + " day" + (st.streak > 1 ? "s" : "") + " - keep it up!";

	var h = "";

	h +=
		'<div class="home-brand-hero">' +
		'<div class="home-hero-content">' +
		'<div class="streak"><span class="sn">' +
		st.streak +
		"</span><div>" +
		'<div style="font-size:10px;color:var(--gold);font-weight:700;letter-spacing:1px">DAY STREAK</div>' +
		'<div style="font-size:9px;color:var(--muted)">' +
		sm +
		"</div></div></div>" +
		"</div>" +
		'<img src="' +
		TB +
		'" alt="Master Dutton" class="top-img"/>' +
		"</div>";

	h +=
		'<div class="srow">' +
		'<div class="sc"><div class="scn">' +
		st.streak +
		'</div><div class="scl">Streak</div></div>' +
		'<div class="sc"><div class="scn">' +
		st.total +
		'</div><div class="scl">Sessions</div></div>' +
		'<div class="sc"><div class="scn">' +
		st.week +
		'</div><div class="scl">This Week</div></div>' +
		'<div class="sc home-more-card" onclick="toggleHomeMenu()" id="home-menu-btn"><div class="scn home-more-icon">&#9776;</div><div class="scl">More</div></div>' +
		"</div>";

	h +=
		'<div id="home-menu-dropdown" class="home-menu-dropdown">' +
		'<div onclick="CT=\'timetable\';closeHomeMenu();render()" class="home-menu-item">' +
		'<span class="home-menu-item-icon"><svg width="427" height="427" viewBox="0 0 427 427" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M362.667 64H341.333V21.3333C341.333 15.6754 339.086 10.2492 335.085 6.24839C331.084 2.24761 325.658 0 320 0C314.342 0 308.916 2.24761 304.915 6.24839C300.914 10.2492 298.667 15.6754 298.667 21.3333V64H128V21.3333C128 15.6754 125.752 10.2492 121.752 6.24839C117.751 2.24761 112.325 0 106.667 0C101.009 0 95.5825 2.24761 91.5817 6.24839C87.5809 10.2492 85.3333 15.6754 85.3333 21.3333V64H64C47.0261 64 30.7475 70.7428 18.7452 82.7452C6.74284 94.7475 0 111.026 0 128V149.333H426.667V128C426.667 111.026 419.924 94.7475 407.922 82.7452C395.919 70.7428 379.641 64 362.667 64Z" fill="url(#paint0_linear_4238_58)"/><path d="M0 362.667C0 379.641 6.74284 395.919 18.7452 407.922C30.7475 419.924 47.0261 426.667 64 426.667H362.667C379.641 426.667 395.919 419.924 407.922 407.922C419.924 395.919 426.667 379.641 426.667 362.667V192H0V362.667Z" fill="url(#paint1_linear_4238_58)"/><defs><linearGradient id="paint0_linear_4238_58" x1="213.333" y1="0" x2="213.333" y2="426.667" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient><linearGradient id="paint1_linear_4238_58" x1="213.333" y1="0" x2="213.333" y2="426.667" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient></defs></svg></span>' +
		'<div class="home-menu-item-content"><div class="home-menu-item-title">Class Timetable</div>' +
		'<div class="home-menu-item-subtitle">All locations &amp; times</div></div>' +
		'<span class="home-menu-arrow"><img src="./images/chevron.svg" alt="arrow-icon"></span></div>' +
		'<div class="home-menu-divider"></div>' +
		"<div onclick=\"sT('techniques');sTC('korean');closeHomeMenu()\" class=\"home-menu-item\">" +
		'<span class="home-menu-item-icon kr-icon">&#127472;&#127479;</span>' +
		'<div class="home-menu-item-content"><div class="home-menu-item-title">Korean Pronunciation</div>' +
		'<div class="home-menu-item-subtitle">Listen &amp; learn Korean terms</div></div>' +
		'<span class="home-menu-arrow"><img src="./images/chevron.svg" alt="arrow-icon"></span></div>' +
		'<div class="home-menu-divider"></div>' +
		'<div onclick="CT=\'books\';closeHomeMenu();render()" class="home-menu-item">' +
		'<span class="home-menu-item-icon"><svg width="81" height="95" viewBox="0 0 81 95" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M78.4053 14.3009C77.2891 14.3009 76.3841 15.206 76.3841 16.3222V90.9574H9.17662C6.34616 90.9574 4.0428 88.6541 4.04255 85.8236V85.8236C4.04255 84.4492 4.57816 83.1654 5.54839 82.1952C6.50852 81.2351 7.8021 80.6994 9.17655 80.6994H68.6122C69.7239 80.6994 70.6335 79.7899 70.6335 78.6782V2.02128C70.6335 0.909538 69.7239 0 68.6122 0H9.17655C4.11331 0 0 4.11331 0 9.17655V85.8227V85.8227C0 90.8828 4.11651 95 9.17662 95H78.4053C79.5216 95 80.4266 94.095 80.4266 92.9787V16.3222C80.4266 15.206 79.5216 14.3009 78.4053 14.3009Z" fill="url(#paint0_linear_4238_63)"/><path d="M68.6148 83.807H12.326C11.2097 83.807 10.3047 84.712 10.3047 85.8283C10.3047 86.9445 11.2097 87.8495 12.326 87.8495H68.6148C69.731 87.8495 70.636 86.9445 70.636 85.8283C70.636 84.712 69.731 83.807 68.6148 83.807Z" fill="url(#paint1_linear_4238_63)"/><defs><linearGradient id="paint0_linear_4238_63" x1="40.2133" y1="0" x2="40.2133" y2="95" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient><linearGradient id="paint1_linear_4238_63" x1="40.2133" y1="0" x2="40.2133" y2="95" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient></defs></svg></span>' +
		'<div class="home-menu-item-content"><div class="home-menu-item-title">Taekwon-Do Books</div>' +
		'<div class="home-menu-item-subtitle">Books by Master Dutton on Amazon</div></div>' +
		'<span class="home-menu-arrow"><img src="./images/chevron.svg" alt="arrow-icon"></span></div>' +
		"</div>";

	h += rHomeMenu();

	h +=
		'<div onclick="sT(\'ask\')" class="home-menu-card mb-10">' +
		'<div class="home-menu-icon-wrap">' +
		'<img src="./images/quiz-active.svg" >' +
		"</div>" +
		'<div class="home-menu-details">' +
		'<div class="ask-master-header">' +
		'<div class="home-menu-title">Ask Master Dutton</div>' +
		"</div>" +
		'<div class="home-menu-desc">Pattern help &middot; Technique &middot; Grading &middot; Theory</div>' +
		"</div>" +
		'<span class="home-menu-chevron"><img src="./images/chevron.svg" alt="Chevron" class="icon-lt"></span>' +
		"</div>";

	h +=
		'<button onclick="logSession()" class="home-log-btn"> LOG TRAINING SESSION</button>';

	h +=
		'<div class="home-quote-card"><div class="home-quote-label">Master Dutton</div><div class="home-quote-text">' +
		getMDQuote() +
		"</div></div>";

	// h +=
	// 	'<div id="workout-box"><div class="home-workout-level-wrap"><div class="home-workout-level-label">Training Level</div><div class="home-workout-levels">' +
	// 	'<button onclick="setWorkoutLevel(this, \'beginner\')" class="home-level-btn ' +
	// 	(CWLEVEL === "beginner" ? "active beginner" : "") +
	// 	'">Beginner</button>' +
	// 	'<button onclick="setWorkoutLevel(this, \'intermediate\')" class="home-level-btn ' +
	// 	(CWLEVEL === "intermediate" ? "active intermediate" : "") +
	// 	'">Intermediate</button>' +
	// 	'<button onclick="setWorkoutLevel(this, \'advanced\')" class="home-level-btn ' +
	// 	(CWLEVEL === "advanced" ? "active advanced" : "") +
	// 	'">Advanced</button>' +
	// 	"</div></div>";

	// if (!CW) {
	// 	h +=
	// 		'<div onclick="newWorkout()" class="home-workout-empty">' +
	// 		'<div class="home-workout-empty-icon"><img src="./images/dart.svg" alt="dart-icon"></div>' +
	// 		'<div class="home-workout-empty-title">Get Your Workout</div>' +
	// 		'<div class="home-workout-empty-text">Tap for a random bodyweight session — no equipment needed</div>' +
	// 		'<div class="home-workout-empty-btn">HIT ME</div>' +
	// 		"</div>";
	// } else {
	// 	h +=
	// 		'<div class="home-workout-card">' +
	// 		'<div class="home-workout-header">' +
	// 		'<div class="home-workout-topbar">' +
	// 		'<button onclick="clearWorkout()" class="home-workout-back-btn"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Back</button>' +
	// 		'<span class="tag">' +
	// 		CW.duration +
	// 		"</span>" +
	// 		"</div>" +
	// 		'<div class="home-workout-type">' +
	// 		CW.type +
	// 		"</div>" +
	// 		'<div class="home-workout-title">' +
	// 		CW.emoji +
	// 		" " +
	// 		CW.title +
	// 		"</div>" +
	// 		'<div class="home-workout-desc">' +
	// 		CW.desc +
	// 		"</div>" +
	// 		"</div>" +
	// 		'<div class="home-workout-body">';

	// 	CW.exercises.forEach(function (ex, i) {
	// 		h +=
	// 			'<div class="home-exercise-item">' +
	// 			'<div class="home-exercise-number">' +
	// 			(i + 1) +
	// 			"</div>" +
	// 			'<div class="home-exercise-content">' +
	// 			'<div class="home-exercise-title">' +
	// 			ex.name +
	// 			(ex.reps
	// 				? '<span class="home-exercise-reps">' + ex.reps + "</span>"
	// 				: "") +
	// 			"</div>" +
	// 			(ex.note
	// 				? '<div class="home-exercise-note">' + ex.note + "</div>"
	// 				: "") +
	// 			"</div></div>";
	// 	});

	// 	h +=
	// 		'<div class="home-workout-tip">' +
	// 		'<div class="home-workout-tip-label">Master Dutton</div>' +
	// 		'<div class="home-workout-tip-text">' +
	// 		CW.tip +
	// 		"</div>" +
	// 		"</div>" +
	// 		'<button onclick="newWorkout(CWLEVEL)" class="home-workout-refresh-btn">Give Me Another One</button>' +
	// 		"</div></div>";
	// }

	// h += "</div>";

	h += rChallengeBox();

	return h;
}

function rWorkouts() {
	var h = "";

	// Top banner section (like patterns/belt pages)
	h +=
		'<div class="top-image-section workout-page">' +
		'<button class="bk" onclick="sT(\'home\')"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home</button>' +
		'<div class="stitle">WORKOUTS</div>' +
		'<div class="patterns-list-subtitle">BODYWEIGHT TRAINING &middot; NO EQUIPMENT NEEDED</div>' +
		"</div>";

	h +=
		'<div class="patterns-video-note">' +
		'<img src="./images/workout-active.svg" alt="Workout Icon">' +
		"<div class='patterns-video-note-text'>" +
		'<h3 class="stretch-video-title">Random Session Generator</h3>' +
		'<p class="stretch-video-text">Pick your level and get a random bodyweight session — no equipment needed. Fresh workout every time.</p>' +
		"</div></div>";

	// Level selector
	h +=
		'<div id="workout-box"><div class="home-workout-level-wrap"><div class="home-workout-level-label">Training Level</div><div class="home-workout-levels">' +
		'<button onclick="setWorkoutLevel(this, \'beginner\')" class="home-level-btn ' +
		(CWLEVEL === "beginner" ? "active beginner" : "") +
		'">Beginner</button>' +
		'<button onclick="setWorkoutLevel(this, \'intermediate\')" class="home-level-btn ' +
		(CWLEVEL === "intermediate" ? "active intermediate" : "") +
		'">Intermediate</button>' +
		'<button onclick="setWorkoutLevel(this, \'advanced\')" class="home-level-btn ' +
		(CWLEVEL === "advanced" ? "active advanced" : "") +
		'">Advanced</button>' +
		"</div></div>";

	if (!CW) {
		h +=
			'<div onclick="newWorkout()" class="home-workout-empty">' +
			'<div class="home-workout-empty-icon"><img src="./images/dart.svg" alt="dart-icon"></div>' +
			'<div class="home-workout-empty-title">Get Your Workout</div>' +
			'<div class="home-workout-empty-text">Tap for a random bodyweight session \u2014 no equipment needed</div>' +
			'<div class="home-workout-empty-btn">HIT ME</div>' +
			"</div>";
	} else {
		h +=
			'<div class="home-workout-card">' +
			'<div class="home-workout-header">' +
			'<div class="home-workout-topbar">' +
			'<button onclick="clearWorkout()" class="home-workout-back-btn"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Back</button>' +
			'<span class="tag">' +
			CW.duration +
			"</span>" +
			"</div>" +
			'<div class="home-workout-type">' +
			CW.type +
			"</div>" +
			'<div class="home-workout-title">' +
			CW.emoji +
			" " +
			CW.title +
			"</div>" +
			'<div class="home-workout-desc">' +
			CW.desc +
			"</div>" +
			"</div>" +
			'<div class="home-workout-body">';

		CW.exercises.forEach(function (ex, i) {
			h +=
				'<div class="home-exercise-item">' +
				'<div class="home-exercise-number">' +
				(i + 1) +
				"</div>" +
				'<div class="home-exercise-content">' +
				'<div class="home-exercise-title">' +
				ex.name +
				(ex.reps
					? '<span class="home-exercise-reps">' + ex.reps + "</span>"
					: "") +
				"</div>" +
				(ex.note
					? '<div class="home-exercise-note">' + ex.note + "</div>"
					: "") +
				"</div></div>";
		});

		h +=
			'<div class="home-workout-tip">' +
			'<div class="home-workout-tip-label">Master Dutton</div>' +
			'<div class="home-workout-tip-text">' +
			CW.tip +
			"</div>" +
			"</div>" +
			'<button onclick="newWorkout(CWLEVEL)" class="home-workout-refresh-btn">Give Me Another One</button>' +
			"</div></div>";
	}

	h += "</div>";

	return h;
}

function setWorkoutLevel(btn, level) {
	document.querySelectorAll(".home-level-btn").forEach((b) => {
		b.classList.remove("active", "beginner", "intermediate", "advanced");
	});

	btn.classList.add("active", level);

	newWorkout(level);
}

function e(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
function h1(s) {
	return '<div class="stitle">' + s + "</div>";
}
function yt(url, lbl) {
	if (!url) return "";
	return (
		'<div class="yt-wrap">' +
		'<div class="yt-label">' +
		(lbl || "Video") +
		"</div>" +
		'<div class="yt-frame-wrap">' +
		'<iframe src="' +
		url +
		'" ' +
		'class="yt-frame" ' +
		'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
		"allowfullscreen></iframe>" +
		"</div>" +
		"</div>"
	);
}

function rPats() {
	// MOVES VIEW
	if (SP && MV) {
		var mvs = PM[SP.name] || [];

		var h =
			'<button class="bk" onclick="bkMv()">' +
			'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon">  Back to ' +
			e(SP.name) +
			"</button>" +
			'<div class="patterns-moves-title">' +
			e(SP.name) +
			" - Moves" +
			"</div>" +
			'<div class="patterns-moves-subtitle">' +
			mvs.length +
			" OF " +
			SP.moves +
			" MOVES LOADED" +
			"</div>";

		if (!mvs.length) {
			h +=
				'<div class="card patterns-empty">' +
				'<div class="patterns-empty-icon">' +
				"<img src='./images/karate-icon.png' alt='Icon'>" +
				"</div>" +
				'<div class="patterns-empty-text">' +
				"No moves loaded yet" +
				"</div>" +
				"</div>";
		}

		mvs.forEach(function (m, i) {
			var hasBody = m.s && m.s.trim().length > 0;
			var accordionId = "move_" + i;

			h +=
				'<div class="card mb-10 accordion-card technique-page pattern-page">' +
				'<div class="' +
				(hasBody ? "accordion-header" : "static-move-header") +
				'" ' +
				(hasBody ? 'data-target="' + accordionId + '"' : "") +
				">" +
				'<div style="display:flex; align-items:center; gap:12px;">' +
				'<div class="mcn">' +
				m.n +
				"</div>" +
				'<div class="patterns-move-content">' +
				'<div class="mct">' +
				e(m.t) +
				"</div>" +
				'<div class="mcd">' +
				e(m.d) +
				"</div>" +
				"</div>" +
				"</div>" +
				(hasBody
					? '<span class="accordion-icon"><img src="./images/chevron.svg" alt="Down Arrow"></span>'
					: "") +
				"</div>" +
				(hasBody
					? '<div class="accordion-body" id="' +
						accordionId +
						'">' +
						'<div class="mcb" style="border-top:none; padding-top:0;">' +
						'<div class="fs">' +
						e(m.s) +
						"</div></div>" +
						"</div>"
					: "") +
				"</div>";
		});

		return h;
	}

	// SINGLE PATTERN VIEW
	if (SP) {
		var dc =
			SP.diff === "Beginner"
				? "var(--gold)"
				: SP.diff === "Intermediate"
					? "var(--green)"
					: "var(--red)";

		return (
			"" +
			'<button class="patterns-back-btn" onclick="bkPat()">' +
			'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon">' +
			" Back to All Patterns" +
			"</button>" +
			'<div class="pd">' +
			'<div class="patterns-detail-count">' +
			"Pattern " +
			SP.id +
			" of 24" +
			"</div>" +
			'<div class="patterns-detail-title">' +
			e(SP.name) +
			"</div>" +
			'<div class="patterns-detail-description">' +
			e(SP.meaning) +
			"</div>" +
			'<div class="patterns-detail-tags">' +
			'<span class="tag">' +
			SP.moves +
			" moves" +
			"</span>" +
			'<span class="tag patterns-detail-difficulty" style="color:' +
			dc +
			";border-color:" +
			dc +
			'44">' +
			e(SP.diff) +
			"</span>" +
			"</div>" +
			'<div class="patterns-detail-requirement">' +
			'<div class="patterns-detail-requirement-label">' +
			"Required for" +
			"</div>" +
			'<div class="patterns-detail-requirement-value">' +
			e(SP.belt) +
			"</div>" +
			"</div>" +
			"</div>" +
			(PM[SP.name]
				? '<button class="primary-btn" onclick="opMv()">VIEW STEP-BY-STEP MOVES</button>'
				: "") +
			yt(SP.video, SP.name + " - Full Pattern")
		);
	}

	// LIST VIEW
	var fs = ["All", "Beginner", "Intermediate", "Advanced"];

	var vis =
		PF === "All"
			? PATS
			: PATS.filter(function (p) {
					return p.diff === PF;
				});

	var h =
		"<div class='top-image-section pattern-page '>" +
		'<button class="bk" onclick="sT(\'home\')"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home</button>' +
		h1("ITF PATTERNS") +
		'<div class="patterns-list-subtitle">' +
		"CHON-JI THROUGH TONG-IL &middot; " +
		PATS.length +
		" PATTERNS" +
		"</div>" +
		"</div>";

	h +=
		'<div class="patterns-video-note">' +
		"<img src='./images/video-icon.svg' alt='Video Icon'>" +
		"<p>" +
		'<strong class="patterns-video-note-strong">' +
		"Videos:" +
		"</strong> " +
		"Current links are temporary. Dedicated ITF tutorial videos for each pattern will be added over time. This app updates regularly with new content." +
		"</p>" +
		"</div>";

	h +=
		'<div class="pills">' +
		fs
			.map(function (f) {
				return (
					"" +
					'<span class="pill' +
					(PF === f ? " a" : "") +
					'" onclick="sPF(\'' +
					f +
					"')\">" +
					f +
					"</span>"
				);
			})
			.join("") +
		"</div>";

	vis.forEach(function (p, idx) {
		var ri = PATS.indexOf(p);

		h +=
			'<div class="pr" onclick="sPat(' +
			ri +
			')">' +
			'<div class="pn">' +
			p.id +
			"</div>" +
			'<div class="patterns-card-content">' +
			'<div class="patterns-card-title">' +
			e(p.name) +
			"</div>" +
			'<div class="patterns-card-belt">' +
			e(p.belt) +
			"</div>" +
			"</div>" +
			'<div class="patterns-card-moves">' +
			'<div class="pm">' +
			p.moves +
			"</div>" +
			'<div class="patterns-card-moves-label">' +
			"moves" +
			"</div>" +
			"</div>" +
			'<span class="patterns-card-status" style="color:' +
			(PM[p.name] ? "var(--green)" : "var(--border)") +
			'">' +
			(PM[p.name] ? "&#10003;" : "&#9675;") +
			"</span>" +
			"</div>";
	});

	return h;
}
function rTechKorean() {
	var raw = rGloss();
	var backBtn =
		'<button class="bk" onclick="sTC(\'menu\')"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Back to Skills sefawer</button>';
	raw = raw.replace(/<button[^>]*class="bk"[^>]*>[\s\S]*?<\/button>/, "");
	return backBtn + raw;
}

function rTechKorean() {
	var raw = rGloss();

	var backBtn =
		'<button class="bk" onclick="sTC(\'menu\')">' +
		'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon">' +
		" Back to Skills" +
		"</button>";

	raw = raw.replace(/<button[^>]*class="bk"[^>]*>[\s\S]*?<\/button>/, "");

	return backBtn + raw;
}
function rBelt() {
	var g = BREQS[BI];
	var catColors = {
		PATTERNS: "#e8193c",
		BASICS: "#a9caff",
		SPARRING: "#f97316",
		"POWER TEST": "#c9a84c",
		"SELF-DEFENCE": "#a855f7",
		THEORY: "#2ea84a",
	};
	var grps = {};
	g.reqs.forEach(function (req, i) {
		var m = req.match(/^([A-Z][A-Z\s\-]*):/);
		var cat = m ? m[1].trim() : "OTHER";
		if (!grps[cat]) grps[cat] = [];
		grps[cat].push({ req: req, i: i });
	});
	var profile = JSON.parse(localStorage.getItem("tkd-profile") || "{}");
	var studentName = profile.name || "";
	var gradingDate = profile.gradingDate || "";
	var notes = profile.notes || "";
	var countdown = "";
	if (gradingDate) {
		var gd = new Date(gradingDate);
		var now = new Date();
		var days = Math.ceil((gd - now) / (1000 * 60 * 60 * 24));
		if (days > 0)
			countdown =
				'<div class="banner-gold-gradient"><div class="belt-grading-countdown-title">Next Grading</div><div class="belt-grading-countdown-days">' +
				days +
				'</div><div class="belt-grading-countdown-date">days to go &middot; ' +
				gd.toLocaleDateString("en-GB", {
					day: "numeric",
					month: "long",
					year: "numeric",
				}) +
				"</div></div>";
		else if (days === 0)
			countdown =
				'<div class="banner-red-light"><div class="title-lg-red"><img src="./images/karate-icon.png" alt="Icon" class="kt-icon"> GRADING DAY TODAY! Good luck!</div></div>';
		else
			countdown =
				'<div class="banner-green-light"><div class="title-sm-green">&#10003; Grading completed!</div></div>';
	}
	var h =
		'<div class="top-image-section grading-page">' +
		'<button class="bk" onclick="sT(\'home\')"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home</button>' +
		'<div class="stitle">BELT GRADING</div>' +
		"</div>";
	h +=
		'<div class="card mb-12"><div class="belt-profile-header"><img src="./images/user.svg" alt="User Icon"> My Profile</div><div class="mb-10"><div class="label-muted-sm">Your Name</div><input id="st-name" value="' +
		e(studentName) +
		'" placeholder="Enter your name" oninput="saveProfile()" class="input-field-surface"/></div><div class="mb-10"><div class="label-muted-sm">Next Grading Date</div><input id="st-date" type="date" value="' +
		e(gradingDate) +
		'" oninput="saveProfile()" class="input-field-surface"/></div><div><div class="label-muted-sm">Personal Notes</div><textarea id="st-notes" placeholder="Add your own training notes..." oninput="saveProfile()" class="textarea-surface">' +
		e(notes) +
		"</textarea></div></div>";
	h += countdown;
	h += '<div class="stitle title-xl-mb8">GRADING REQUIREMENTS</div>';
	h +=
		'<div class="bsc">' +
		BREQS.map(function (gr, i) {
			return (
				'<div class="bc' +
				(BI === i ? " a" : "") +
				'" onclick="sBI(' +
				i +
				')">' +
				e(gr.from) +
				"</div>"
			);
		}).join("") +
		"</div>";
	h +=
		'<div class="card mb-10"><div class="flex-between-mb8"><div><div class="title-xxl-white">' +
		e(g.from.toUpperCase()) +
		" &#8594; " +
		e(g.to.toUpperCase()) +
		'</div></div><button onclick="rBI()" class="btn-outline-muted">Reset</button></div><div class="text-sm-gold-italic"><img src="./images/karate-icon.png" alt="Icon" class="kt-icon"> ' +
		e(g.meaning) +
		"</div></div>";
	var catIcons = {
		PATTERNS: "<img src='./images/patterns-active.svg'>",
		BASICS: "<img src='./images/technique.svg'>",
		SPARRING: "<img src='./images/sparring-active.svg'>",
		"POWER TEST": "<img src='./images/workout-active.svg'>",
		"SELF-DEFENCE": "<img src='./images/stance.svg'>",
		THEORY: "<img src='./images/book.svg'>",
		NOTE: "<img src='./images/star.svg'>",
		Default: "📂",
	};

	Object.keys(grps).forEach(function (cat) {
		var col = catColors[cat] || "var(--muted)";
		var icon = catIcons[cat] || catIcons.Default;

		h +=
			'<div class="card box-padded-mb10">' +
			'<div class="grading-card-head">' +
			'<span style="font-size:16px;">' +
			icon +
			"</span>" +
			cat +
			"</div>";

		grps[cat].forEach(function (item) {
			var done = !!BC[BI + "_" + item.i];
			var clean = item.req.replace(/^[A-Z][A-Z\s\-]*:\s*/, "");

			h +=
				'<div class="rr ' +
				(done ? "checked" : "") +
				'" onclick="tReq(' +
				item.i +
				')"><span class="rc" style="color:' +
				(done ? "var(--green)" : "var(--border)") +
				'">' +
				(done
					? "<svg fill='currentColor' viewBox='0 0 20 20' style='width: 14px; height: 14px; color:#fff;'><path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'></path></svg>"
					: "&#9675;") +
				'</span><div class="rt' +
				(done ? " dn" : "") +
				'">' +
				e(clean) +
				"</div></div>";
		});

		h += "</div>";
	});
	h +=
		'<div class="card mb-10"><div class="label-red-sm-mb12"><img src="./images/bulb.svg" alt="Bulb"> Grading Advice</div>';
	var gradingTips = [
		{
			grade: "10th Kup (Beginner)",
			tips: [
				"Arrive early and take your time settling in",
				"Dobok clean and tidy — look ready",
				"Listen carefully to instructions",
				"Do your best — effort matters most here",
				"Stay calm — nerves are normal",
			],
			note: "Everyone starts here. Just show up and give me your best.",
		},
		{
			grade: "9th Kup",
			tips: [
				"Be more aware of your stances and balance",
				"Start showing control, not just movement",
				"Take your time — don\'t rush techniques",
				"If you make a mistake, carry on",
				"Show that you\'ve been practising",
			],
			note: "I\'m looking for improvement — not perfection.",
		},
		{
			grade: "8th Kup",
			tips: [
				"Technique should now look clearer and more deliberate",
				"Focus on control over speed",
				"Stay composed throughout",
				"Listen and react quickly to instructions",
				"Show growing confidence in what you do",
			],
			note: "You know more than you think — trust it.",
		},
		{
			grade: "7th Kup",
			tips: [
				"Movements should now be consistent and controlled",
				"Avoid rushing — precision matters",
				"Stay focused from start to finish",
				"Show confidence in your patterns",
				"Begin to show real understanding of your techniques",
			],
			note: "This is where things start to take shape — show me that.",
		},
		{
			grade: "6th Kup (Mid Level)",
			tips: [
				"Your basics should now be solid — show them clearly",
				"Control, balance, and timing are key",
				"No wasted movement — be sharp",
				"Stay relaxed under pressure",
				"Show that you belong at this level",
			],
			note: "This isn\'t beginner level anymore — raise your standard.",
		},
		{
			grade: "5th Kup",
			tips: [
				"Technique must now be clean and controlled throughout",
				"Every movement should have purpose",
				"Stay focused — no lapses in concentration",
				"Show confidence without rushing",
				"Mistakes happen — don\'t let them affect the rest",
			],
			note: "Small details matter now — don\'t ignore them.",
		},
		{
			grade: "4th Kup",
			tips: [
				"Precision becomes more important than ever",
				"Strong, controlled technique — no shortcuts",
				"Maintain focus across the full grading",
				"Show maturity in how you perform",
				"Commit fully to every movement",
			],
			note: "I expect consistency now — not occasional quality.",
		},
		{
			grade: "2nd Kup",
			tips: [
				"Your performance should now look composed and confident",
				"Movements must be sharp, controlled, and consistent",
				"Stay calm — pressure is expected at this level",
				"Show clear understanding, not just repetition",
				"Set a strong example in how you carry yourself",
			],
			note: "You\'re being watched differently now — act like it.",
		},
		{
			grade: "1st Kup (Pre-Black – Elite Level)",
			tips: [
				"A high standard is expected — details must be sharp",
				"Every technique must be precise, controlled, and intentional",
				"No hesitation — movements should flow with confidence",
				"Maintain composure under pressure at all times",
				"Show authority in your performance — not just ability",
			],
			note: "At this level, I\'m not looking for effort — I\'m looking for standard.",
		},
		{
			grade: "Grade 10 (Black Belt Preparation – Elite Level)",
			tips: [
				"Perform with complete control, precision, and confidence",
				"Every movement must be deliberate and technically correct",
				"No visible nerves — composure is part of the grading",
				"Show leadership through your performance",
				"Deliver a level worthy of black belt — nothing less",
			],
			note: "This is not about passing. This is about proving you are ready.",
		},
	];
	var currentGradeIdx = BI;
	var gt = gradingTips[Math.min(currentGradeIdx, gradingTips.length - 1)];
	h += '<div class="box-red-tint">';
	h += '<div class="title-sm-white-mb10">' + gt.grade + "</div>";
	gt.tips.forEach(function (tip) {
		h +=
			'<div class="list-item-border"><span class="icon-red-shrink">&#9642;</span><div class="text-sm-normal">' +
			tip +
			"</div></div>";
	});
	h += '<div class="box-gold-tint">';
	h += '<div class="title-xs-gold-mb4">Note</div>';
	h += '<div class="text-sm-italic">&ldquo;' + gt.note + "&rdquo;</div>";
	h += "</div></div></div>";
	return h;
}
function rTech() {
	if (TC === "menu") {
		var h =
			'<div class="top-image-section skills-page">' +
			'<button class="bk" onclick="sT(\'home\')">' +
			'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home' +
			"</button>";

		h += '<div class="stitle">SKILLS</div>';

		h +=
			'<div class="text-md-muted-mb16">' +
			"Select a section to explore techniques, terminology and stances." +
			"</div>";

		h += "</div>";
		var sections = [
			{
				id: "kicks",
				icon: "<img src='./images/kicks.svg' alt='Kicks Icon' class='tech-icon'>",
				title: "Kicks",
				sub: "32 techniques &middot; Basic to Flying",
				color: "var(--red)",
			},
			{
				id: "blocks",
				icon: "<img src='./images/blocks.svg' alt='Blocks Icon' class='tech-icon'>",
				title: "Blocks",
				sub: "14 blocking techniques explained",
				color: "#a9caff",
			},
			{
				id: "stances",
				icon: "<img src='./images/stance.svg' alt='Stances Icon' class='tech-icon'>",
				title: "Stances",
				sub: "14 stances &middot; Width, length &amp; weight",
				color: "#a855f7",
			},
			{
				id: "korean",
				icon: "&#127472;&#127479;",
				title: "Korean Glossary",
				sub: "Commands, attacks, stances &amp; more",
				color: "var(--gold)",
			},
		];
		h += '<div class="home-menu-container">';

		sections.forEach(function (s) {
			h +=
				'<div class="home-menu-card skills-card section-card section-' +
				s.id +
				'" onclick="sTC(\'' +
				s.id +
				'\')" style="border-left-color:' +
				s.color +
				'">' +
				'<div class="home-menu-icon-wrap section-icon-' +
				s.id +
				'" style="background:' +
				s.color +
				'22">' +
				"<span>" +
				s.icon +
				"</span>" +
				"</div>" +
				'<div class="home-menu-details">' +
				'<div class="home-menu-title">' +
				s.title +
				"</div>" +
				'<div class="home-menu-desc">' +
				s.sub +
				"</div>" +
				"</div>" +
				'<span class="home-menu-chevron"><img src="./images/chevron.svg" alt="Chevron" class="icon-lt"></span>' +
				"</div>";
		});

		h += "</div>";
		return h;
	}
	if (TC === "korean") return rTechKorean();
	var items = TC === "kicks" ? KICKS : TC === "blocks" ? BLOCKS : STANCES;
	var lvls =
		TC === "kicks"
			? ["All", "Basic", "Intermediate", "Advanced", "Flying"]
			: null;
	var vis =
		TC === "kicks" && TL !== "All"
			? items.filter(function (k) {
					return k.lv === TL;
				})
			: items;
	var titles = {
		kicks:
			'<img src="./images/kicks.svg" alt="Kicks Icon" class="tech-icon"> KICKS',
		blocks:
			'<img src="./images/blocks.svg" alt="Blocks Icon" class="tech-icon"> BLOCKS',
		stances:
			'<img src="./images/stance.svg" alt="Stances Icon" class="tech-icon"> STANCES',
	};

	var dynamicClass = TC;
	var h =
		'<div class="top-image-section ' +
		dynamicClass +
		'">' +
		'<button class="bk" onclick="sTC(\'menu\')">' +
		'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Back to Skills' +
		"</button>" +
		'<div class="stitle tech-inner-page-heading">' +
		titles[TC] +
		"</div>" +
		"</div>";
	if (lvls)
		h +=
			'<div class="pills">' +
			lvls
				.map(function (l) {
					return (
						'<span class="pill' +
						(TL === l ? " a" : "") +
						'" onclick="sTL(\'' +
						l +
						"')\">" +
						l +
						"</span>"
					);
				})
				.join("") +
			"</div>";
	vis.forEach(function (item, i) {
		var accordionId = "tech-acc-" + i;
		var stanceInfo = "";
		if (TC === "stances" && item.width) {
			stanceInfo =
				'<div class="grid-2col-gap8">' +
				'<div class="surface-box">' +
				'<div class="label-red-xs">WIDTH</div>' +
				'<div class="text-xs-white">' +
				e(item.width) +
				"</div></div>" +
				'<div class="surface-box">' +
				'<div class="label-red-xs">LENGTH</div>' +
				'<div class="text-xs-white">' +
				e(item.length) +
				"</div></div>" +
				'<div class="surface-box">' +
				'<div class="label-red-xs">WEIGHT</div>' +
				'<div class="text-xs-white">' +
				e(item.weight) +
				"</div></div>" +
				'<div class="surface-box">' +
				'<div class="label-red-xs">FEET</div>' +
				'<div class="text-xs-white">' +
				e(item.feet) +
				"</div></div>" +
				"</div>";
		}
		h +=
			'<div class="card mb-10 accordion-card technique-page">' +
			'<div class="title-sm-white-mb10 accordion-header" data-target="' +
			accordionId +
			'">' +
			'<div><div class="title-md-white">' +
			e(item.name) +
			"</div>" +
			'<div class="text-sm-gold-mt2">' +
			e(item.k) +
			"</div></div>" +
			'<span class="accordion-icon"><img src="./images/chevron.svg" alt="Down Arrow"></span>' +
			"</div>" +
			'<div class="accordion-body" id="' +
			accordionId +
			'">' +
			stanceInfo +
			'<div class="text-md-mt10">' +
			e(item.desc) +
			"</div>" +
			(item.tgt
				? '<div class="text-sm-muted-mt6">&#127919; Target: ' +
					e(item.tgt) +
					"</div>"
				: "") +
			(item.tool
				? '<div class="text-sm-gold-mt4">&#9757; Foot tool: ' +
					e(item.tool) +
					"</div>"
				: "") +
			(item.video
				? '<div class="video-container yt-frame-wrap"><iframe class="yt-frame"  src="' +
					item.video +
					'?playsinline=1" frameborder="0" allowfullscreen class="d-block"></iframe></div>'
				: "") +
			"</div>" +
			"</div>";
	});
	return h;
}

function saveProfile() {
	var name = document.getElementById("st-name");
	var date = document.getElementById("st-date");
	var notes = document.getElementById("st-notes");
	var profile = {};
	if (name) profile.name = name.value;
	if (date) profile.gradingDate = date.value;
	if (notes) profile.notes = notes.value;
	localStorage.setItem("tkd-profile", JSON.stringify(profile));
}

function rQuiz() {
	if (QL === null) {
		var h =
			'<div class="top-image-section quiz-page">' +
			'<button class="bk" onclick="sT(\'home\')">' +
			'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home' +
			"</button>" +
			h1("THEORY QUIZ") +
			'<div class="text-sm-muted-mb16">' +
			"Choose your level. Each has 30 questions on patterns, theory and Korean." +
			"</div>" +
			"</div>";
		QLEV.forEach(function (lv, i) {
			h +=
				'<div onclick="sQL(' +
				i +
				')" class="card-action-box"><div class="card-action-badge" style="background:' +
				lv.color +
				";border:2px solid " +
				lv.color +
				'66;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:var(--white)">' +
				e(lv.emoji) +
				'</div><div class="flex-fill"><div class="title-xl-white">' +
				e(lv.label) +
				'</div><div class="text-xs-muted-mt2">' +
				e(lv.grades) +
				' &middot; 30 questions</div></div><span class="icon-muted-lg"><img src="./images/chevron.svg" alt="Chevron" class="icon-lt"></span></div>';
		});
		return h;
	}
	if (QF) {
		var pct = Math.round((QSC / 20) * 100);
		var gr =
			pct >= 90
				? "&#129351; Excellent!"
				: pct >= 70
					? "&#129352; Good Pass"
					: pct >= 50
						? "&#129353; Keep Practising"
						: "&#128218; More Study Needed";
		var h =
			'<div class="top-image-section result-page">' +
			'<button class="bk" onclick="bkQ()">' +
			'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Back to Levels' +
			"</button>" +
			h1("QUIZ RESULTS") +
			"</div>" +
			'<div class="card text-center-mb14"><div class="icon-xxl-mb8">' +
			(pct >= 70
				? "<img src='./images/compete-active.svg' alt='Trophy Icon'>"
				: "<img src='./images/book.svg' alt='Book Icon'>") +
			'</div><div class="score-huge-gold">' +
			QSC +
			'/20</div><div class="text-md-mt4">' +
			gr +
			'</div><div class="progress-bar-bg"><div style="width:' +
			pct +
			"%;height:100%;background:" +
			(pct >= 70 ? "var(--green)" : "var(--red)") +
			';border-radius:3px"></div></div><div class="text-sm-muted">' +
			pct +
			"% &middot; " +
			e(QLEV[QL].label) +
			"</div></div>";
		QH.forEach(function (item) {
			h +=
				'<div style="background:var(--card);border:1px solid ' +
				(item.c ? "rgba(46,168,74,.3)" : "rgba(242,201,76,.2)") +
				';border-radius:12px;padding:10px 14px;margin-bottom:8px"><div style="font-size:12px;color:' +
				(item.c ? "var(--green)" : "var(--red-main)") +
				';font-weight:700;margin-bottom:4px">' +
				(item.c ? "&#10003; Correct" : "&#10007; Wrong") +
				'</div><div class="text-sm-mb4">' +
				e(item.q) +
				"</div>" +
				(!item.c
					? '<div class="text-xs-green">&#10003; Answer: ' +
						e(item.ans) +
						"</div>"
					: "") +
				"</div>";
		});
		h +=
			'<div class="flex-gap10-mt8"><button class="btn-p flex-fill" onclick="rsQ()">TRY AGAIN</button><button onclick="bkQ()" class="btn-card-fill">ALL LEVELS</button></div>';
		h += '<div class="flex-gap10-mt8"><button class="btn-p flex-fill" onclick="showLeaderboard()">🏆 LEADERBOARD</button></div>';
if (window.saveScore) {
  var sName = localStorage.getItem("tkd-name") || "";
  if (!sName) {
    sName = prompt("Enter your name for the leaderboard:") || "Anonymous";
    localStorage.setItem("tkd-name", sName);
  }
  window.saveScore(sName, QSC, BELT);
}
		return h;
	}
	var lv = QLEV[QL],
		q = lv._qslv._qs,
		pct2 = (QA / 30) * 100;
	var h =
		'<div class="flex-between-sm-muted"><button class="bk new" onclick="bkQ()"><img class="back-icon" src="./images/chevron.svg" alt="Back Icon"> Back to ' +
		e(lv.label) +
		"</button> <span>Question " +
		Math.min(QA + 1, 30) +
		' of 30</span><span class="text-gold-bold"><img src="./images/star.svg" alt="Star Icon"> Score: ' +
		QSC +
		'</span></div><div class="progress-bar-sm-bg"><div class="progress-bar-inner" style="width:' +
		pct2 +
		"%;height:100%;background:" +
		lv.color +
		';border-radius:2px"></div></div>';
	h += '<div id="q-timer" style="color:var(--gold);font-weight:700;font-size:14px;text-align:right;padding:4px 0 8px">00:00</div>';
	h +=
		'<div class="card-box-mb10"><div class="title-md-white-mb14">' +
		e(q.q) +
		"</div>";
	q.o.forEach(function (opt, i) {
		var cls = "qo";

		if (QS !== null) {
			if (i === q.a) cls += " cor";
			else if (i === QS) cls += " wrg";
		}

		h +=
			'<button class="' +
			cls +
			'" onclick="aQ(' +
			i +
			')" ' +
			(QS !== null ? "disabled" : "") +
			">" +
			'<span class="opt-label">' +
			String.fromCharCode(65 + i) +
			"</span> " +
			e(opt) +
			"</button>";
	});

	h += "</div>";
	return h;
}

function rGloss() {
	var total = GLOSS.reduce(function (n, g) {
		return n + g.terms.length;
	}, 0);
	var filt =
		GS.length > 1
			? GLOSS.map(function (g) {
					return {
						cat: g.cat,
						terms: g.terms.filter(function (t) {
							return (
								t[0].toLowerCase().indexOf(GS.toLowerCase()) >= 0 ||
								t[1].toLowerCase().indexOf(GS.toLowerCase()) >= 0
							);
						}),
					};
				}).filter(function (g) {
					return g.terms.length > 0;
				})
			: GLOSS;
	var h =
		'<div class="top-image-section kg-section">' +
		'<div class="top-image-actions">' +
		// '<button class="bk top-bk" onclick="sT(\'home\')">' +
		// '<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home' +
		// "</button>" +
		"</div>" +
		'<div class="stitle">KOREAN GLOSSARY</div>' +
		'<div class="glossary-header-info">' +
		total +
		" TERMS &middot; TAP TO EXPAND &middot; &#128264; to hear" +
		"</div>" +
		"</div>";
	var vlist = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
	if (vlist.length > 0) {
		h +=
			'<div class="card-flex-mb12"><span class="text-sm-muted-shrink0">Voice:</span><select id="voiceSel" onchange="setVoice(this.value)" class="select-surface">';
		vlist.forEach(function (v, i) {
			h += '<option value="' + i + '">' + v.name + " (" + v.lang + ")</option>";
		});
		h += "</select></div>";
	}
	h +=
		'<div class="search-box-card"><span class="text-muted"><svg width="270" height="270" viewBox="0 0 270 270" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4238_77)"><path d="M258.55 205.117C251.105 197.673 227.637 180.344 204.336 166.928C204.084 167.306 203.831 167.685 203.579 168.105C229.865 125.752 224.692 69.3512 187.891 32.5497C144.991 -10.3082 75.4674 -10.3082 32.5674 32.5497C-10.3326 75.4918 -10.2905 144.973 32.5674 187.873C69.0324 224.296 124.676 229.806 166.903 204.318C179.058 225.432 196.765 250.205 205.135 258.574C219.855 273.295 243.829 273.253 258.549 258.532C273.27 243.769 273.27 219.88 258.55 205.117ZM158.955 158.936C132.037 185.812 88.464 185.812 61.5464 158.894C34.6708 132.019 34.6287 88.4459 61.5464 61.5282C88.422 34.6526 132.037 34.6526 158.913 61.5282C185.83 88.4459 185.83 132.061 158.955 158.936Z" fill="url(#paint0_linear_4238_77)"/></g><defs><linearGradient id="paint0_linear_4238_77" x1="134.999" y1="0.40625" x2="134.999" y2="269.594" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient><clipPath id="clip0_4238_77"><rect width="270" height="270" fill="white"/></clipPath></defs></svg></span><input id="gls" class="input-transparent" placeholder="Search Korean or English..." value="' +
		e(GS) +
		'" oninput="sGS(this.value)"/>' +
		(GS
			? '<span class="icon-close-muted" onclick="clrG()">&#10005;</span>'
			: "") +
		"</div>";
	filt.forEach(function (g, idx) {
		var isO = GS.length > 1;
		var accId = "gloss-acc-" + idx;
		h +=
			'<div class="card mb-8 accordion-card kr-page">' +
			'<div class="title-sm-white-mb10 accordion-header' +
			(isO ? " active" : "") +
			'" data-target="' +
			accId +
			'">' +
			"<div>" +
			'<span class="instructor-name">' +
			e(g.cat) +
			"</span>" +
			'<span class="text-xs-muted-ml8">' +
			g.terms.length +
			" terms</span>" +
			"</div>" +
			'<span class="accordion-icon"><img src="./images/chevron.svg" alt="Down Arrow"></span>' +
			"</div>" +
			'<div class="accordion-body' +
			(isO ? " open" : "") +
			'" id="' +
			accId +
			'" style="' +
			(isO ? "max-height: 2000px;" : "") +
			'">' +
			'<div class="surface-dropdown-box">';
		g.terms.forEach(function (t, i) {
			var word = t[0].replace(/"/g, "&quot;");
			h +=
				'<div class="glr" style="border-bottom:' +
				(i < g.terms.length - 1 ? "1px solid var(--border)" : "none") +
				'"><div class="title-sm-red-fill">' +
				e(t[0]) +
				'</div><div class="text-md-mr8">' +
				e(t[1]) +
				'</div><button onclick="spk(this.dataset.w)" data-w="' +
				word +
				'" class="btn-red-tint"><svg width="363" height="362" viewBox="0 0 363 362" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4238_50)"><path d="M104.633 266.333H21.6673C16.0093 266.333 10.5832 264.084 6.58231 260.084C2.58167 256.084 0.333984 250.657 0.333984 244.999V116.999C0.333984 111.341 2.58167 105.915 6.58231 101.914C10.5832 97.9135 16.0093 95.6659 21.6673 95.6659H104.633L217.571 3.24985C219.135 1.96878 221.029 1.1579 223.035 0.911502C225.04 0.665316 227.073 0.993854 228.899 1.85892C230.725 2.72399 232.27 4.08996 233.349 5.79769C234.429 7.50564 235.003 9.48515 235.001 11.5058V350.493C235.003 352.513 234.429 354.493 233.349 356.202C232.27 357.908 230.725 359.274 228.899 360.14C227.073 361.004 225.04 361.332 223.035 361.087C221.029 360.842 219.135 360.029 217.571 358.749L104.654 266.333H104.633ZM317.411 278.941L287.075 248.605C297.433 240.641 305.819 230.401 311.585 218.678C317.352 206.956 320.347 194.064 320.334 180.999C320.334 150.493 304.334 123.719 280.227 108.637L310.926 77.9379C327.086 89.8246 340.219 105.348 349.266 123.252C358.312 141.157 363.018 160.94 363.001 180.999C363.001 220.295 345.294 255.453 317.411 278.941Z" fill="#F2CA50"/></g><defs><clipPath id="clip0_4238_50"><rect width="363.001" height="362" fill="white"/></clipPath></defs></svg></button></div>';
		});
		h += "</div></div></div>";
	});
	return h;
}

function rAsk() {
	var waBase = "https://wa.me/447407030077?text=";

	var policies = [
		{
			title: "Mon - Fri",
			desc: "Standard queries",
			badge: "WITHIN 24H",
			icon: "./images/calendar.svg",
		},
		{
			title: "Weekends",
			desc: "Training days",
			badge: "CHECK SCHEDULE",
			icon: "./images/calendar.svg",
		},
		{
			title: "Urgent",
			desc: "Immediate matters",
			badge: "CLASS HOURS ONLY",
			icon: "./images/warning.svg",
			isUrgent: true,
		},
	];

	var categories = [
		{
			title: "Pattern Question",
			desc: "Theory, movement, and philosophy of your current grade forms.",
			icon: "./images/patterns-active.svg",
			text: "Hi Master Dutton, I have a question about a pattern: ",
		},
		{
			title: "Technique Help",
			desc: "Blocks, strikes, and sparring tips to refine your physical mastery.",
			icon: "./images/technique.svg",
			text: "Hi Master Dutton, I need help with my technique: ",
		},
		{
			title: "Grading Inquiry",
			desc: "Requirements and readiness check for your next promotional exam.",
			icon: "./images/grading-active.svg",
			text: "Hi Master Dutton, I have a question about grading: ",
		},
		{
			title: "Korean / Theory",
			desc: "Questions about terminology or history.",
			icon: "<span class='kr-tech'>&#127472;&#127479;</span>",
			text: "Hi Master Dutton, I have a theory question: ",
		},
		{
			title: "General Question",
			desc: "Any other questions for Master Dutton.",
			icon: '<span><img src="./images/quiz-active.svg"></span>',
			text: "Hi Master Dutton, I have a question: ",
		},
	];

	var h = "";

	// Hero Section
	h +=
		'<div class="top-image-section ask-hero">' +
		'<button class="bk" onclick="sT(\'home\')">' +
		'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home' +
		"</button>" +
		'<div class="ask-hero-content">' +
		'<div class="stitle">Ask Master Dutton</div>' +
		'<div class="ask-hero-subtitle">Direct access to your instructor.</div>' +
		'<div class="ask-hero-desc">Tap a question type to open WhatsApp.</div>' +
		"</div>" +
		"</div>";

	// Master Card
	h +=
		'<div class="ask-master-card">' +
		'<div class="ask-master-avatar-wrap">' +
		'<img src="./images/1master-dutton.jpg" class="ask-master-avatar">' +
		'<div class="avatar-status-dot"></div>' +
		"</div>" +
		'<div class="ask-master-info">' +
		'<div class="ask-master-header">' +
		'<div class="ask-master-name">Master Dutton</div>' +
		'<div class="badge-online">ONLINE</div>' +
		"</div>" +
		'<div class="ask-master-role">ITF Taekwon-Do Instructor</div>' +
		'<div class="ask-master-replies">' +
		'<span><svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4241_6)"><path d="M25 0C11.2152 0 0 11.2152 0 25C0 38.7848 11.2152 50 25 50C38.7848 50 50 38.7848 50 25C50 11.2152 38.7848 0 25 0ZM25 46.875C12.9379 46.875 3.12501 37.0621 3.12501 25C3.12501 12.9379 12.9379 3.12501 25 3.12501C37.0621 3.12501 46.875 12.9379 46.875 25C46.875 37.0621 37.0621 46.875 25 46.875Z" fill="#F4CD79"/><path d="M26.5625 9.375H23.4375V25.6469L33.2703 35.4797L35.4797 33.2702L26.5625 24.353V9.375Z" fill="#F4CD79"/></g><defs><clipPath id="clip0_4241_6"><rect width="50" height="50" fill="white"/></clipPath></defs></svg></span> Usually replies within 24 hours' +
		"</div>" +
		"</div>" +
		"</div>";
	// Response Policy Section
	h +=
		'<div class="section-divider"><span class="section-divider-text">RESPONSE POLICY</span></div>';
	h += '<div class="policy-list">';
	policies.forEach(function (p) {
		h +=
			'<div class="policy-item">' +
			'<div class="policy-icon-wrap"><img src="' +
			p.icon +
			'"></div>' +
			'<div class="policy-content">' +
			'<div class="policy-title">' +
			p.title +
			"</div>" +
			'<div class="policy-desc">' +
			p.desc +
			"</div>" +
			"</div>" +
			'<div class="policy-badge' +
			(p.isUrgent ? " urgent" : "") +
			'">' +
			p.badge +
			"</div>" +
			"</div>";
	});
	h += "</div>";

	// Select Category Section
	h +=
		'<div class="section-divider"><span class="section-divider-text">Choose your question type:</span></div>';
	h += '<div class="category-list">';
	categories.forEach(function (cat) {
		var url = waBase + encodeURIComponent(cat.text);
		h +=
			'<a href="' +
			url +
			'" target="_blank" class="category-card">' +
			'<div class="category-card-icon">' +
			(cat.icon.indexOf("<") === 0
				? cat.icon
				: '<img src="' + cat.icon + '">') +
			"</div>" +
			'<div class="category-card-content">' +
			'<div class="category-card-title">' +
			cat.title +
			"</div>" +
			'<div class="category-card-desc">' +
			cat.desc +
			"</div>" +
			"</div>" +
			'<span class="home-ask-arrow"><img src="./images/chevron.svg" alt="Chevron" class="icon-lt"></span>' +
			"</a>";
	});

	h += "</div>";

	// Action Buttons & Support Info
	h +=
		'<div class="ask-action-section">' +
		'<a href="' +
		waBase +
		encodeURIComponent("Hi Master Dutton, I have a general question: ") +
		'" target="_blank" class="whatsapp-btn-premium">' +
		'<svg id="fi_4701537" enable-background="new 0 0 32 32" height="512" viewBox="0 0 32 32" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m9.22754 28.24744c2.01074 1.11395 4.32019 1.75256 6.77923 1.75256 7.73022 0 13.99329-6.27655 13.99329-14.00684 0-7.73022-6.26306-13.99316-13.99329-13.99316s-14.00683 6.26294-14.00683 13.99316c0 2.48621.65216 4.79572 1.77972 6.82007l-1.77972 7.18677zm.77441-18.43573c.32599-.3125.80157-.43475 1.23633-.3396l.44824.09509c.44836.09503.81519.39398.99182.80151l.883 1.95636c.21741.47546.13593 1.04608-.21735 1.44006l-.54346.63855c-.17657.20374-.21729.51617-.08148.7608 1.60309 2.88013 3.70886 3.81757 4.64624 4.10278.27173.09515.58429-.0271.7337-.27173l.39398-.61127c.38043-.58417 1.12762-.78802 1.9563-.38043l1.63031.81519c.62494.29883.91022 1.03241.67926 1.68457-.82867 2.4046-2.94806 2.10577-2.94806 2.10577-4.70062-.12231-8.38239-4.45612-9.97186-6.68408-.73364-1.04614-1.18195-2.30957-1.04614-3.60022.13593-1.27709.73371-2.0786 1.20917-2.51335z"></path></g></svg>OPEN WHATSAPP' +
		"</a>" +
		'<div class="notice-box-gold">' +
		"<img src='./images/warning.svg' alt='Warning Icon'> For adult students only" +
		"</div>" +
		'<div class="ask-footer-info">' +
		"This feature is exclusive to app members.<br>Your question goes directly to Master Dutton." +
		"</div>" +
		"</div>";

	// Books Section Header (Redesigned)
	h +=
		'<div class="section-divider"><span class="section-divider-text">BOOKS BY MASTER DUTTON</span></div>' +
		'<div class="text-center-muted-mb16">Available on Amazon. Perfect companions to your training.</div>';

	var books = [
		{
			title: "TaekwonDo: Unleash Your Potential",
			desc: "Complete guide from first class to black belt. ITF patterns explained step by step.",
			url: "https://www.amazon.co.uk/s?k=taekwondo+unleash+your+potential+dutton",
		},
		{
			title: "ITF Colour Belt Patterns",
			desc: "Complete step by step guide to all ITF colour belt patterns with detailed photos.",
			url: "https://www.amazon.co.uk/s?k=itf+colour+belt+patterns+dutton",
		},
		{
			title: "ITF Black Belt Patterns I-III Degree",
			desc: "Covering all moves from 1st to 3rd degree black belt with step by step photos.",
			url: "https://www.amazon.co.uk/s?k=itf+black+belt+patterns+dutton",
		},
	];

	books.forEach(function (b) {
		h +=
			'<a href="' +
			b.url +
			'" target="_blank" class="card-link-box">' +
			'<div class="icon-xl-shrink"><svg width="81" height="95" viewBox="0 0 81 95" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M78.4053 14.3009C77.2891 14.3009 76.3841 15.206 76.3841 16.3222V90.9574H9.17662C6.34616 90.9574 4.0428 88.6541 4.04255 85.8236V85.8236C4.04255 84.4492 4.57816 83.1654 5.54839 82.1952C6.50852 81.2351 7.8021 80.6994 9.17655 80.6994H68.6122C69.7239 80.6994 70.6335 79.7899 70.6335 78.6782V2.02128C70.6335 0.909538 69.7239 0 68.6122 0H9.17655C4.11331 0 0 4.11331 0 9.17655V85.8227V85.8227C0 90.8828 4.11651 95 9.17662 95H78.4053C79.5216 95 80.4266 94.095 80.4266 92.9787V16.3222C80.4266 15.206 79.5216 14.3009 78.4053 14.3009Z" fill="url(#paint0_linear_4238_63)"/><path d="M68.6148 83.807H12.326C11.2097 83.807 10.3047 84.712 10.3047 85.8283C10.3047 86.9445 11.2097 87.8495 12.326 87.8495H68.6148C69.731 87.8495 70.636 86.9445 70.636 85.8283C70.636 84.712 69.731 83.807 68.6148 83.807Z" fill="url(#paint1_linear_4238_63)"/><defs><linearGradient id="paint0_linear_4238_63" x1="40.2133" y1="0" x2="40.2133" y2="95" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient><linearGradient id="paint1_linear_4238_63" x1="40.2133" y1="0" x2="40.2133" y2="95" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient></defs></svg></div>' +
			'<div class="flex-fill"><div class="title-sm-white-mb4">' +
			b.title +
			"</div>" +
			'<div class="text-sm-muted-mb6">' +
			b.desc +
			"</div>" +
			'<div class="text-xs-gold-bold">View on Amazon</div>' +
			"</div></a>";
	});
	h +=
		'<a href="https://www.amazon.co.uk/stores/author/B0BGHSH7D7" target="_blank" class="card-center-link">' +
		'<span class="book-store-link">See all books by Master Dutton</span></a>';

	h += "</div>";

	return h;
}

function sGS(v) {
	GS = v;
	render();
}
function clrG() {
	GS = "";
	render();
}
function sGO(c) {
	GO = GO === c ? null : c;
	render();
}

function rComp() {
	return (
		'<div class="top-image-section rules-page">' +
		'<button class="bk" onclick="sT(\'home\')">' +
		'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home' +
		"</button>" +
		'<div class="stitle">COMPETITION RULES</div>' +
		"</div>" +
		'<div class="notice-gold-box"><img src="./images/warning.svg" alt="warning icon"> These rules are based on original ITF guidelines. Rules may vary between organisations and events.</div>' +
		rCompSection(
			'<img class="icon-sm" src="./images/area.svg" alt="Area Icon"> AREA & FORMAT',
			[
				"Competition area: 9m x 9m matted surface (may differ)",
				"Competitors bow on entering and leaving the area",
				"Matches consist of 1 round of 2 minutes. Finals: 2 x 2 minutes",
				"1 minute rest between rounds (Finals)",
				"A referee and at least 3 corner judges officiate each match",
			],
		) +
		rCompSection(
			'<img class="icon-sm" src="./images/technique.svg" alt="PERMITTED TECHNIQUES"> PERMITTED TECHNIQUES',
			[
				"Hand attacks: Punch to the body (trunk protector area only)",
				"Foot attacks: Kicks to the body and head",
				"No attacks to the spine, back of the head, or groin",
				"No grabbing, holding, or wrestling",
				"Attacks must be delivered with controlled power and correct technique",
			],
		) +
		rCompSection(
			'<img class="icon-sm" src="./images/compete-active.svg" alt="SCORING"> SCORING',
			[
				"1 point - Valid punch to the body",
				"1 point - Valid kick to the body",
				"2 points - Valid kick to the head",
				"3 points - Valid jumping/flying kick to the head",
				"Techniques must be accurate, powerful and controlled to score",
			],
		) +
		rCompSection(
			'<img class="icon-sm" src="./images/warning.svg" alt="FOULS"> FOULS (KYong-go - Warning)',
			[
				"Falling down without being knocked down",
				"Deliberately avoiding combat or running away",
				"Grabbing or holding the opponent",
				"Attacking after Kalyo (stop) is called",
				"Attacking the back, spine or back of the head",
				"Head butting or using the knee",
				"2 Kyong-go = 1 Gam-jeom (half point deduction)",
			],
		) +
		rCompSection(
			'<img class="icon-sm" src="./images/point-deduct.svg" alt="GAM-JEOM (Half Point Deduction)"> GAM-JEOM (Half Point Deduction)',
			[
				"Knocking the opponent down",
				"Attacking a fallen opponent",
				"Intentional attack after Kalyo",
				"Severe or repeated fouls",
				"Unsportsmanlike conduct",
				"4 Gam-jeom = disqualification",
			],
		) +
		rCompSection(
			'<img class="icon-sm" src="./images/match-decesion.svg" alt="MATCH DECISIONS"> MATCH DECISIONS',
			[
				"The Jury President oversees all final decisions regarding match outcomes",
				"A competitor who is knocked down or cannot continue may be assessed by the Jury President",
				"The decision to continue, stop the match, or disqualify a competitor is at the discretion of the Jury President",
				"Factors considered include: injury, inability to continue, repeated fouls, conduct, and overall safety",
				"The Jury President's decision is final and may result in: continuation of match, stoppage, disqualification, or progression to next round",
				"3 knockdowns in one round may result in automatic win for the opponent at the Jury President's discretion",
			],
		) +
		rCompSection(
			'<img class="icon-sm" src="./images/patterns-active.svg" alt="PATTERNS COMPETITION"> PATTERNS COMPETITION',
			[
				"Competitors perform their pattern individually",
				"Judged on accuracy, power, balance, rhythm and control",
				"Scores given by a panel of judges",
				"Deductions for wrong movements, loss of balance, or poor technique",
				"Pattern must begin and end at the same spot",
			],
		) +
		rCompSection(
			'<img class="icon-sm" src="./images/weight.svg" alt="WEIGHT CATEGORIES (Adult)"> WEIGHT CATEGORIES (Adult)',
			[
				"Fin: under 50kg (female) / under 54kg (male)",
				"Fly: 50-54kg (female) / 54-58kg (male)",
				"Bantam: 54-59kg (female) / 58-64kg (male)",
				"Feather: 59-65kg (female) / 64-71kg (male)",
				"Light: 65-72kg (female) / 71-78kg (male)",
				"Welter: 72-80kg (female) / 78-86kg (male)",
				"Middle: over 80kg (female) / 86-95kg (male)",
				"Heavy: over 95kg (male)",
			],
		) +
		rCompSection(
			'<img class="icon-sm" src="./images/protection.svg" alt="PROTECTIVE EQUIPMENT"> PROTECTIVE EQUIPMENT',
			[
				"Head guard (mandatory)",
				"Body armour / trunk protector (mandatory)",
				"Groin guard (mandatory for males)",
				"Forearm guards (mandatory)",
				"Shin guards (mandatory)",
				"Foot protectors (mandatory)",
				"Gum shield recommended",
				"All equipment must be ITF approved",
			],
		) +
		'<div class="card">' +
		'<h3 class="referee-title"><img src="./images/scoring.svg" alt="REFEREE COMMANDS"> REFEREE COMMANDS</h3>' +
		'<p class="muted referee-text">Common commands used by referees during ITF competition sparring.</p>' +
		'<div class="cmd"><b>Charyot</b><span>Char-ee-ot</span><em>Attention</em></div>' +
		'<div class="cmd"><b>Kyong-Ye</b><span>Kyung-Yay</span><em>Bow</em></div>' +
		'<div class="cmd"><b>Junbi</b><span>Jun-Bee</span><em>Ready</em></div>' +
		'<div class="cmd"><b>Shi-Jak</b><span>Shee-Jack</span><em>Begin</em></div>' +
		'<div class="cmd"><b>Haechyo</b><span>Hai-Cho</span><em>Separate</em></div>' +
		'<div class="cmd"><b>Gaesok</b><span>Gae-Sock</span><em>Continue</em></div>' +
		'<div class="cmd"><b>Goman</b><span>Go-Man</span><em>Stop</em></div>' +
		'<div class="cmd"><b>Hong</b><span>Hong</span><em>Red competitor</em></div>' +
		'<div class="cmd"><b>Chong</b><span>Chong</span><em>Blue competitor</em></div>' +
		'<div class="cmd"><b>Ju Ui</b><span>Joo-Wee</span><em>Warning</em></div>' +
		'<div class="cmd"><b>Gam Jeom</b><span>Gam-Jom</span><em>Deduction</em></div>' +
		'<div class="cmd"><b>Sil Kyuk</b><span>Sil-Kyook</span><em>Disqualification</em></div>' +
		"</div>" +
		'<div class="notice-card-box">For full and current ITF competition rules always refer to your official ITF organisation documentation.</div>' +
		'<button onclick="document.getElementById(\'content\').scrollTop=0" class="btn-scroll-top" ><svg id="fi_3838680" clip-rule="evenodd" fill-rule="evenodd" height="512" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><path id="path2" d="m11 5.414-5.293 5.293c-.39.39-1.024.39-1.414 0s-.39-1.024 0-1.414l7-7c.39-.391 1.024-.391 1.414 0l7 7c.39.39.39 1.024 0 1.414s-1.024.39-1.414 0l-5.293-5.293v15.586c0 .552-.448 1-1 1s-1-.448-1-1z"></path></svg> Back to Top</button>'
	);
}

function rCompSection(title, items, id) {
	// Auto-generate unique ID
	id = id || "accordion_" + Math.random().toString(36).substr(2, 9);

	var h =
		'<div class="card mb-10 accordion-card">' +
		// Header
		'<div class="title-sm-white-mb10 accordion-header" data-target="' +
		id +
		'">' +
		title +
		'<span class="accordion-icon"><img src="./images/chevron.svg" alt="Down Arrow"></span>' +
		"</div>" +
		// Body
		'<div class="accordion-body" id="' +
		id +
		'">';

	items.forEach(function (item) {
		h +=
			'<div class="list-item-border">' +
			'<span class="icon-red-shrink">&#9642;</span>' +
			'<div class="text-sm-normal">' +
			item +
			"</div>" +
			"</div>";
	});

	h += "</div></div>";

	return h;
}

document.addEventListener("click", function (e) {
	const header = e.target.closest(".accordion-header");

	if (!header) return;

	const targetId = header.dataset.target;
	const body = document.getElementById(targetId);

	const isOpen = body.classList.contains("open");

	// CLOSE ALL (optional)
	document.querySelectorAll(".accordion-body").forEach((el) => {
		el.style.maxHeight = null;
		el.classList.remove("open");
	});

	document.querySelectorAll(".accordion-header").forEach((el) => {
		el.classList.remove("active");
	});

	// OPEN CURRENT
	if (!isOpen) {
		body.classList.add("open");
		body.style.maxHeight = body.scrollHeight + "px";

		header.classList.add("active");
	}
});

function updateClock() {
	var now = new Date();
	var h = now.getHours().toString().padStart(2, "0");
	var m = now.getMinutes().toString().padStart(2, "0");
	var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	var el = document.getElementById("clock");
	var del = document.getElementById("datebar");
	if (el) el.textContent = h + ":" + m;
	if (del)
		del.textContent =
			days[now.getDay()] + " " + now.getDate() + " " + months[now.getMonth()];
}
updateClock();
setInterval(updateClock, 1000);

var selectedVoiceIdx = -1;
function setVoice(idx) {
	selectedVoiceIdx = parseInt(idx);
}

function spk(word) {
	try {
		var ss = window.speechSynthesis;
		ss.cancel();
		var u = new SpeechSynthesisUtterance(word);
		var voices = ss.getVoices();
		var v = null;
		if (selectedVoiceIdx >= 0 && voices[selectedVoiceIdx])
			v = voices[selectedVoiceIdx];
		else
			v =
				voices.find(function (v) {
					return v.lang.indexOf("ko") === 0;
				}) ||
				voices.find(function (v) {
					return v.name.toLowerCase().indexOf("male") >= 0;
				}) ||
				voices[0];
		if (v) {
			u.voice = v;
			u.lang = v.lang;
		}
		u.rate = 0.8;
		u.pitch = 0.9;
		u.volume = 1;
		ss.speak(u);
	} catch (ex) {}
}
if (window.speechSynthesis) {
	window.speechSynthesis.getVoices();
	if (window.speechSynthesis.onvoiceschanged !== undefined) {
		window.speechSynthesis.onvoiceschanged = function () {
			window.speechSynthesis.getVoices();
		};
	}
}

function rTimetable() {
	var h =
		'<div class="top-image-section timetable-page">' +
		'<button class="bk" onclick="closeHomeMenu();CT=\'home\';render()">' +
		'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home' +
		"</button>" +
		'<div class="stitle">CLASS TIMETABLE</div>' +
		'<div class="text-sm-muted-mb14">' +
		"All Elite Taekwon-Do classes across Scotland. Tap a location for directions." +
		"</div>" +
		"</div>";

	var days = [
		{
			day: "Monday",
			icon: "&#128337;",
			classes: [
				{
					area: "East Lothian",
					venue: "The Hollies",
					addr: "183 High St, Musselburgh EH21 7DE",
					times: [{ t: "7.30 - 8.30pm", who: "8yrs+" }],
					maps: "https://maps.google.com/?q=183+High+St+Musselburgh+EH21+7DE",
				},
			],
		},
		{
			day: "Tuesday",
			icon: "&#128337;",
			classes: [
				{
					area: "Midlothian",
					venue: "Danderhall Community Hub",
					addr: "9A Edmonstone Road, Danderhall EH22 1QL",
					times: [
						{ t: "5.30 - 6.30pm", who: "Ninja Kickers 3-7yrs" },
						{ t: "6.30 - 7.30pm", who: "8yrs+ & Adults" },
					],
					maps: "https://maps.google.com/?q=9A+Edmonstone+Road+Danderhall+EH22+1QL",
				},
				{
					area: "Midlothian",
					venue: "Lasswade High School",
					addr: "9A Eskdale Dr, Bonnyrigg EH19 2LA",
					times: [
						{ t: "6.30 - 7.30pm", who: "5-11yrs" },
						{ t: "7.30 - 8.30pm", who: "12yrs+" },
					],
					maps: "https://maps.google.com/?q=9A+Eskdale+Dr+Bonnyrigg+EH19+2LA",
				},
			],
		},
		{
			day: "Wednesday",
			icon: "&#128337;",
			classes: [
				{
					area: "Edinburgh",
					venue: "Broughton Primary School",
					addr: "132 Broughton Rd, Edinburgh EH7 4LD",
					times: [{ t: "6.30 - 7.30pm", who: "Kids & Adults" }],
					maps: "https://maps.google.com/?q=132+Broughton+Rd+Edinburgh+EH7+4LD",
				},
				{
					area: "Edinburgh",
					venue: "Craigmount High School",
					addr: "Craigs Road, Edinburgh EH12 8NH",
					times: [{ t: "6.00 - 7.00pm", who: "8yrs to Adult" }],
					maps: "https://maps.google.com/?q=Craigs+Road+Edinburgh+EH12+8NH",
				},
				{
					area: "East Lothian",
					venue: "Gullane Recreation Hall",
					addr: "Hamilton Road, Gullane EH31 2HP",
					times: [{ t: "6.00 - 7.00pm", who: "5yrs+ & Adults" }],
					maps: "https://maps.google.com/?q=Hamilton+Road+Gullane+EH31+2HP",
				},
			],
		},
		{
			day: "Thursday",
			icon: "&#128337;",
			classes: [
				{
					area: "Midlothian",
					venue: "Dalkeith Community Campus",
					addr: "2 Cousland Road, Dalkeith EH22 2PS",
					times: [
						{ t: "6.00 - 7.00pm", who: "5-11yrs" },
						{ t: "7.00 - 8.00pm", who: "12yrs+" },
					],
					maps: "https://maps.google.com/?q=2+Cousland+Road+Dalkeith+EH22+2PS",
				},
			],
		},
		{
			day: "Friday",
			icon: "&#128337;",
			classes: [
				{
					area: "Midlothian",
					venue: "Millerhill Community Hub",
					addr: "6 Cocklerow Loan, Millerhill EH22 1RY",
					times: [
						{ t: "5.30 - 6.30pm", who: "Ninja Kickers 3-7yrs" },
						{ t: "6.30 - 7.30pm", who: "8yrs+ & Adults" },
					],
					maps: "https://maps.google.com/?q=6+Cocklerow+Loan+Millerhill+EH22+1RY",
				},
			],
		},
		{
			day: "Saturday",
			icon: "&#128337;",
			classes: [
				{
					area: "Edinburgh",
					venue: "Juniper Green Scout Hall",
					addr: "45 Lanark Road West, Currie EH14 5JX",
					times: [{ t: "9.30 - 10.30am", who: "Ninja Kickers 5+" }],
					maps: "https://maps.google.com/?q=45+Lanark+Road+West+Currie+EH14+5JX",
				},
				{
					area: "Edinburgh",
					venue: "Davidson Mains Scout Hall",
					addr: "Quality Street Lane, Edinburgh EH4 5BU",
					times: [
						{ t: "9.30 - 10.30am", who: "5-11yrs" },
						{ t: "10.30 - 11.30am", who: "12yrs+" },
					],
					maps: "https://maps.google.com/?q=Quality+Street+Lane+Edinburgh+EH4+5BU",
				},
			],
		},
	];

	var areaColors = {
		Edinburgh: "var(--red)",
		Midlothian: "#a9caff",
		"East Lothian": "#2ea84a",
	};

	days.forEach(function (d) {
		h += '<div class="mb-20">';
		h += '<div class="day-header-gold">' + d.day + "</div>";
		d.classes.forEach(function (cls) {
			var col = areaColors[cls.area] || "var(--muted)";
			h +=
				'<a href="' +
				cls.maps +
				'" target="_blank" class="timetable-card" style="--area-color:' +
				col +
				'">';

			// Header with Area and Map Icon
			h += '<div class="timetable-area-label">' + cls.area + "</div>";

			h += '<div class="timetable-venue">' + cls.venue + "</div>";
			h +=
				'<div class="timetable-address"><span><svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4238_84)"><path d="M15 0C11.0234 0.00527509 7.21113 1.58732 4.39922 4.39922C1.58732 7.21112 0.00527509 11.0234 0 15C0 25.7687 13.975 39.2562 14.5687 39.825C14.6842 39.9372 14.8389 40 15 40C15.1611 40 15.3158 39.9372 15.4312 39.825C16.025 39.2562 30 25.7687 30 15C29.9947 11.0234 28.4127 7.21112 25.6008 4.39922C22.7889 1.58732 18.9766 0.00527509 15 0ZM15 21.875C13.6403 21.875 12.311 21.4718 11.1805 20.7163C10.0499 19.9609 9.16868 18.8872 8.64833 17.6309C8.12798 16.3747 7.99183 14.9924 8.2571 13.6587C8.52238 12.3251 9.17715 11.1001 10.1386 10.1386C11.1001 9.17714 12.3251 8.52237 13.6588 8.25709C14.9924 7.99182 16.3747 8.12797 17.6309 8.64832C18.8872 9.16867 19.9609 10.0499 20.7164 11.1804C21.4718 12.311 21.875 13.6402 21.875 15C21.8739 16.823 21.1492 18.5711 19.8602 19.8601C18.5711 21.1492 16.823 21.8739 15 21.875Z" fill="url(#paint0_linear_4238_84)"/></g><defs><linearGradient id="paint0_linear_4238_84" x1="15" y1="0" x2="15" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient><clipPath id="clip0_4238_84"><rect width="30" height="40" fill="white"/></clipPath></defs></svg></span> ' +
				cls.addr +
				"</div>";

			// Sessions Box
			h += '<div class="timetable-sessions-box">';
			h += '<div class="timetable-sessions-label">Today\'s Sessions</div>';
			h += '<div class="timetable-time-grid">';
			cls.times.forEach(function (tm) {
				h += '<div class="timetable-time-badge">';
				h += '<div class="timetable-time-text">' + tm.t + "</div>";
				h += '<div class="timetable-who-text">' + tm.who + "</div>";
				h += "</div>";
			});
			h += "</div>"; // end time-grid
			h += "</div>"; // end sessions-box

			h += "</a>";
		});
		h += "</div>";
	});

	h += `
<div class="contact-wrapper">

    <div class="contact-card-box">
        

        <div class="contact-row">
            <span class="contact-icon"><svg width="512" height="402" viewBox="0 0 512 402" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M49.106 123.909C55.578 128.476 75.087 142.04 107.634 164.594C140.182 187.148 165.116 204.514 182.437 216.693C184.34 218.028 188.383 220.93 194.568 225.403C200.754 229.879 205.894 233.496 209.984 236.255C214.077 239.013 219.025 242.107 224.833 245.532C230.639 248.954 236.112 251.528 241.251 253.232C246.391 254.95 251.149 255.801 255.526 255.801H256.101C260.478 255.801 265.238 254.949 270.378 253.232C275.515 251.528 280.993 248.951 286.794 245.532C292.598 242.103 297.546 239.012 301.639 236.255C305.732 233.496 310.868 229.879 317.056 225.403C323.24 220.926 327.288 218.028 329.191 216.693C346.699 204.514 391.242 173.583 462.806 123.903C476.7 114.2 488.308 102.492 497.633 88.787C506.965 75.088 511.626 60.717 511.626 45.682C511.626 33.118 507.103 22.363 498.061 13.418C489.02 4.471 478.312 0 465.944 0H45.679C31.024 0 19.746 4.948 11.847 14.844C3.949 24.742 0 37.114 0 51.959C0 63.95 5.236 76.944 15.703 90.933C26.169 104.923 37.307 115.916 49.106 123.909Z" fill="url(#paint0_linear_4238_73)"/>
<path d="M483.072 154.455C420.648 196.706 373.248 229.542 340.895 252.956C330.046 260.947 321.245 267.185 314.486 271.655C307.727 276.128 298.738 280.696 287.506 285.357C276.278 290.025 265.814 292.352 256.105 292.352H255.527C245.82 292.352 235.35 290.025 224.122 285.357C212.894 280.696 203.899 276.128 197.142 271.655C190.387 267.185 181.583 260.947 170.735 252.956C145.038 234.114 97.74 201.276 28.839 154.455C17.987 147.227 8.375 138.942 0 129.617V356.302C0 368.872 4.471 379.621 13.418 388.567C22.363 397.516 33.119 401.989 45.682 401.989H465.948C478.508 401.989 489.263 397.516 498.209 388.567C507.158 379.618 511.627 368.873 511.627 356.302V129.617C503.441 138.749 493.927 147.034 483.072 154.455Z" fill="url(#paint1_linear_4238_73)"/>
<defs>
<linearGradient id="paint0_linear_4238_73" x1="255.814" y1="129.617" x2="255.814" y2="401.989" gradientUnits="userSpaceOnUse">
<stop stop-color="#F4CD79"/>
<stop offset="1" stop-color="#C7983F"/>
</linearGradient>
<linearGradient id="paint1_linear_4238_73" x1="255.814" y1="129.617" x2="255.814" y2="401.989" gradientUnits="userSpaceOnUse">
<stop stop-color="#F4CD79"/>
<stop offset="1" stop-color="#C7983F"/>
</linearGradient>
</defs>
</svg>
</span>		<div><div class="label-muted-mb8">GENERAL INQUIRIES</div>
            <div class="text-md-mb4">elitetkdscot@gmail.com</div>
			</div>
        </div>

        <a class="contact-btn" href="mailto:elitetkdscot@gmail.com">
            SEND EMAIL
        </a>
    </div>

    <div class="contact-card-box">
        

        <div class="contact-row">
            <span class="contact-icon"><svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4238_74)">
<path d="M92.7282 72.3057C88.5767 68.1543 84.4363 64.0027 80.2848 59.8624C76.9927 56.4028 72.6738 56.4028 69.2142 59.8624C66.6251 62.4516 64.0249 65.0406 61.4358 67.6409C60.7438 68.3328 60.2193 68.3328 59.3599 67.9868C57.7977 66.949 55.9004 66.2571 54.338 65.2192C46.9056 60.5544 40.511 54.4945 34.9755 47.5754C32.2079 44.1157 29.7861 40.4888 28.0563 36.3373C27.7104 35.478 27.7104 34.9535 28.4023 34.2616C31.17 31.8398 33.5917 29.2508 36.1808 26.9964C39.8189 23.3695 39.8189 19.2179 36.1808 15.591C33.9376 13.3367 32.0293 11.4395 29.9647 9.36378C27.7104 7.12062 25.6347 5.04489 23.5589 2.96909C20.2779 -0.323031 15.9479 -0.323031 12.4994 2.96909C9.89921 5.5582 7.31016 8.14732 4.70981 10.7476C2.2882 13.1693 1.08284 16.1043 0.736815 19.3965C0.390928 24.7533 1.59615 29.9427 3.50446 34.9535C7.31016 45.4996 13.1913 54.4945 20.2779 62.9649C29.7861 74.3815 41.3702 83.5438 54.684 89.9496C60.7438 92.7173 66.9711 95.139 73.533 95.4849C78.3765 95.6523 82.3607 94.4471 85.6416 90.8089C87.8848 88.3872 90.485 86.1441 92.7282 83.7224C96.1877 80.0842 96.1877 75.7653 92.7282 72.3057Z" fill="url(#paint0_linear_4238_74)"/>
</g>
<defs>
<linearGradient id="paint0_linear_4238_74" x1="48.0003" y1="0.5" x2="48.0003" y2="95.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#F4CD79"/>
<stop offset="1" stop-color="#C7983F"/>
</linearGradient>
<clipPath id="clip0_4238_74">
<rect width="96" height="96" fill="white"/>
</clipPath>
</defs>
</svg>
</span>		<div><div class="label-muted-mb8">DIRECT LINE</div>
            <div class="text-md-normal">07590283735</div>
			</div>
        </div>

        <a class="contact-btn" href="tel:07590283735">
            CALL NOW
        </a>
    </div>

</div>
`;

	return h;
}

function toggleHomeMenu() {
	var d = document.getElementById("home-menu-dropdown");
	var b = document.getElementById("home-menu-btn");

	if (!d) return;

	if (getComputedStyle(d).display === "none") {
		d.style.display = "block";
		if (b) b.style.background = "";
	} else {
		d.style.display = "none";
		if (b) b.style.background = "";
	}
}
function closeHomeMenu() {
	var d = document.getElementById("home-menu-dropdown");
	var b = document.getElementById("home-menu-btn");
	if (d) d.style.display = "none";
	if (b) b.style.background = "";
}

// ═══════════════════════════════════════

function rClubApp() {
	var h =
		'<button class="bk" onclick="CT=\'home\';render()"><img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home</button>';
	h += '<div class="stitle">YOUR CLUB APP</div>';
	h += '<div class="padding-center-lg">';
	h += '<div class="icon-huge-mb16">&#128241;</div>';
	h += '<div class="title-xl-uppercase-mb8">Coming Soon</div>';
	h +=
		'<div class="text-md-muted-centered">Member features, club news, grading results and more are being developed.<br/><br/>Check back soon for updates from Elite Taekwon-Do.</div>';
	h += "</div>";
	h += '<div class="stay-connected-box">';
	h += '<div class="label-red-mb8">Stay Connected</div>';
	h +=
		'<a href="https://elitetkd.uk" target="_blank" class="btn-gold-outline">elitetkd.uk &#8599;</a>';
	h += "</div>";
	return h;
}

function rBooks() {
	var h =
		'<div class="top-image-section books-page">' +
		'<button class="bk" onclick="sT(\'home\')">' +
		'<img class="back-icon" src="./images/back-arrow.svg" alt="Back Icon"> Home' +
		"</button>" +
		'<div class="stitle">TAEKWONDO BOOKS</div>' +
		'<div class="text-md-muted-mb16">Books by Master Dutton — available on Amazon. Perfect companions to your training at every level.</div>' +
		"</div>";

	var books = [
		{
			title: "TaekwonDo: Unleash Your Potential",
			desc: "Complete guide from first class to black belt. ITF patterns explained step by step.",
			url: "https://www.amazon.co.uk/s?k=taekwondo+unleash+your+potential+dutton",
		},
		{
			title: "ITF Colour Belt Patterns",
			desc: "Complete step by step guide to all ITF colour belt patterns with detailed photos.",
			url: "https://www.amazon.co.uk/s?k=itf+colour+belt+patterns+dutton",
		},
		{
			title: "ITF Black Belt Patterns I-III Degree",
			desc: "Covering all moves from 1st to 3rd degree black belt with step by step photos.",
			url: "https://www.amazon.co.uk/s?k=itf+black+belt+patterns+dutton",
		},
	];
	books.forEach(function (b) {
		h += '<a href="' + b.url + '" target="_blank" class="card-link-box">';
		h +=
			'<div class="icon-xl-shrink"><svg width="81" height="95" viewBox="0 0 81 95" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M78.4053 14.3009C77.2891 14.3009 76.3841 15.206 76.3841 16.3222V90.9574H9.17662C6.34616 90.9574 4.0428 88.6541 4.04255 85.8236V85.8236C4.04255 84.4492 4.57816 83.1654 5.54839 82.1952C6.50852 81.2351 7.8021 80.6994 9.17655 80.6994H68.6122C69.7239 80.6994 70.6335 79.7899 70.6335 78.6782V2.02128C70.6335 0.909538 69.7239 0 68.6122 0H9.17655C4.11331 0 0 4.11331 0 9.17655V85.8227V85.8227C0 90.8828 4.11651 95 9.17662 95H78.4053C79.5216 95 80.4266 94.095 80.4266 92.9787V16.3222C80.4266 15.206 79.5216 14.3009 78.4053 14.3009Z" fill="url(#paint0_linear_4238_63)"/><path d="M68.6148 83.807H12.326C11.2097 83.807 10.3047 84.712 10.3047 85.8283C10.3047 86.9445 11.2097 87.8495 12.326 87.8495H68.6148C69.731 87.8495 70.636 86.9445 70.636 85.8283C70.636 84.712 69.731 83.807 68.6148 83.807Z" fill="url(#paint1_linear_4238_63)"/><defs><linearGradient id="paint0_linear_4238_63" x1="40.2133" y1="0" x2="40.2133" y2="95" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient><linearGradient id="paint1_linear_4238_63" x1="40.2133" y1="0" x2="40.2133" y2="95" gradientUnits="userSpaceOnUse"><stop stop-color="#F4CD79"/><stop offset="1" stop-color="#C7983F"/></linearGradient></defs></svg></div>';
		h +=
			'<div class="flex-fill"><div class="title-sm-white-mb6">' +
			b.title +
			"</div>";
		h += '<div class="text-sm-muted-mb8">' + b.desc + "</div>";
		h += '<div class="text-xs-gold-bold">View on Amazon</div></div></a>';
	});
	h +=
		'<a href="https://www.amazon.co.uk/stores/author/B0BGHSH7D7" target="_blank" class="btn-gold-gradient-mb4">';
	h +=
		'<span class="text-md-gold-bold">See all books by Master Dutton</span></a>';
	h +=
		'<button onclick="document.getElementById(\'content\').scrollTop=0" class="btn-scroll-top"><svg id="fi_3838680" clip-rule="evenodd" fill-rule="evenodd" height="512" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><path id="path2" d="m11 5.414-5.293 5.293c-.39.39-1.024.39-1.414 0s-.39-1.024 0-1.414l7-7c.39-.391 1.024-.391 1.414 0l7 7c.39.39.39 1.024 0 1.414s-1.024.39-1.414 0l-5.293-5.293v15.586c0 .552-.448 1-1 1s-1-.448-1-1z"></path></svg> Back to Top</button>';
	return h;
}
function render() {
	var c = document.getElementById("content");
	if (!CT_RUNNING && !(CC && CT_TIME > 0)) c.scrollTop = 0;
	var hdr = document.querySelector(".hdr");
	if (hdr) {
		if (CT === "home") {
			hdr.style.display = "flex";
		} else {
			hdr.style.display = "flex";
		}
	}
	if (CT === "home") c.innerHTML = rHome();
	else if (CT === "patterns") c.innerHTML = rPats();
	else if (CT === "techniques") c.innerHTML = rTech();
	else if (CT === "belt") c.innerHTML = rBelt();
	else if (CT === "quiz") c.innerHTML = rQuiz();
	else if (CT === "glossary") c.innerHTML = rGloss();
	else if (CT === "competition") c.innerHTML = rComp();
	else if (CT === "sparring") c.innerHTML = rSpar();
	else if (CT === "leaderboard") rLeaderboard().then(function(h){ c.innerHTML = h; });	
	else if (CT === "ask") c.innerHTML = rAsk();
	else if (CT === "stretch") c.innerHTML = rStretch();
	else if (CT === "timetable") c.innerHTML = rTimetable();
	else if (CT === "books") c.innerHTML = rBooks();
	else if (CT === "clubapp") c.innerHTML = rClubApp();
	else if (CT === "workouts") c.innerHTML = rWorkouts();
	if (GS && CT === "glossary") {
		setTimeout(function () {
			var el = document.getElementById("gls");
			if (el) {
				el.focus();
				el.selectionStart = el.selectionEnd = el.value.length;
			}
		}, 10);
	}
}
function sT(t) {
	CT = t;
	SP = null;
	MV = false;
	if (t !== "home") {
	}
	document.querySelectorAll(".tb").forEach(function (b) {
		b.classList.remove("active-menu");
	});
	var el = document.getElementById("t-" + t);
	if (el) el.classList.add("active-menu");
	render();
}
function sPF(f) {
	PF = f;
	render();
}
function sPat(i) {
	SP = PATS[i];
	render();
}
function bkPat() {
	SP = null;
	render();
}
function opMv() {
	MV = true;
	OM = null;
	render();
}
function bkMv() {
	MV = false;
	render();
}
function tgMv(i) {
	OM = OM === i ? null : i;
	render();
}
function sTC(c) {
	TC = c;
	TO = null;
	TL = "All";
	GS = "";
	render();
}
function sTL(l) {
	TL = l;
	TO = null;
	render();
}
function tTO(i) {
	TO = TO === i ? null : i;
	render();
}
function sBI(i) {
	BI = i;
	render();
}
function rBI() {
	Object.keys(BC)
		.filter(function (k) {
			return k.indexOf(BI + "_") === 0;
		})
		.forEach(function (k) {
			delete BC[k];
		});
	render();
}
function tReq(i) {
	var k = BI + "_" + i;

	BC[k] = !BC[k];

	var box = document.querySelector("#content");
	var top = box.scrollTop;

	render();

	box.scrollTop = top;
}
var Q_TIMER = null;
var Q_SECONDS = 0;

function shuffleQs(arr) {
	var a = arr.slice();
	for (var i = a.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
	}
	return a.slice(0, 30);
}

function sQL(i) {
	QL = i;
	QI = 0;
	QS = null;
	QSC = 0;
	QA = 0;
	QF = false;
	QH = [];
	Q_SECONDS = 0;
	if (Q_TIMER) clearInterval(Q_TIMER);
	Q_TIMER = setInterval(function () {
		Q_SECONDS++;
		var el = document.getElementById("q-timer");
		if (el) el.textContent = qFmtTime(Q_SECONDS);
	}, 1000);
	QLEV[QL]._qs = shuffleQs(QLEV[QL].qs);
	render();
}
function qFmtTime(s) {
	var m = Math.floor(s / 60);
	var sec = s % 60;
	return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
}
function bkQ() {
	QL = null;
	if (Q_TIMER) { clearInterval(Q_TIMER); Q_TIMER = null; }
	render();
}
function rsQ() {
	if (Q_TIMER) { clearInterval(Q_TIMER); Q_TIMER = null; }
	sQL(QL);
}
function aQ(i) {
	if (QS !== null) return;
	QS = i;
	var lv = QLEV[QL],
		q = lv._qslv._qs,
		ok = i === q.a;
	if (ok) QSC++;
	QA++;
	QH.push({ q: q.q, c: ok, ans: q.o[q.a] });
	render();
	setTimeout(function () {
		if (QA >= 30) {
			QF = true;
			if (Q_TIMER) { clearInterval(Q_TIMER); Q_TIMER = null; }
			render();
		} else {
			QI++;
			QS = null;
			render();
		}
	}, 1200);
}
var PWD = "tkd399";
function checkPwd() {
	var val = document.getElementById("pwd-input").value.trim().toLowerCase();
	if (val === PWD) {
		localStorage.setItem("tkd-auth", PWD);
		document.getElementById("pwd-screen").style.display = "none";
		document.getElementById("pwd-err").textContent = "";
	} else {
		document.getElementById("pwd-err").textContent = "Wrong code. Try again.";
		document.getElementById("pwd-input").value = "";
		document.getElementById("pwd-input").focus();
	}
}
document.addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		var ps = document.getElementById("pwd-screen");
		if (ps && ps.style.display !== "none") checkPwd();
	}
});

document.addEventListener("DOMContentLoaded", function () {
	var bb = document.getElementById("belt-badge");
	if (bb) bb.textContent = BELT + " ▾";
	var bs = document.getElementById("belt-strip");
	if (bs) {
		var cb = BELTS.find(function (b) {
			return b.name === BELT;
		});
		if (cb) bs.style.background = cb.strip;
	}

	// Bind static HTML element event listeners
	var toggleBtn = document.getElementById("pwd-screen-toggle");
	if (toggleBtn) {
		toggleBtn.addEventListener("click", function () {
			var input = document.getElementById("pwd-input");
			if (input) {
				if (input.type === "password") {
					input.type = "text";
					this.classList.add("active");
				} else {
					input.type = "password";
					this.classList.remove("active");
				}
			}
		});
	}

	var enterBtn = document.getElementById("pwd-screen-btn");
	if (enterBtn) {
		enterBtn.addEventListener("click", checkPwd);
	}

	var resetBtn = document.getElementById("pwd-screen-reset");
	if (resetBtn) {
		resetBtn.addEventListener("click", function () {
			localStorage.clear();
			location.reload();
		});
	}

	var splDiv = document.getElementById("spl");
	if (splDiv) {
		var triggerSwell = function () {
			if (window._startSwell) window._startSwell();
		};
		splDiv.addEventListener("click", triggerSwell);
		splDiv.addEventListener("touchstart", triggerSwell, { passive: true });
	}

	var badge = document.getElementById("belt-badge");
	if (badge) {
		badge.addEventListener("click", showBeltPicker);
	}

	// Bind bottom navigation tabs
	var tabs = [
		"home",
		"patterns",
		"techniques",
		"belt",
		"quiz",
		"competition",
		"stretch",
	];
	tabs.forEach(function (tab) {
		var tabBtn = document.getElementById("t-" + tab);
		if (tabBtn) {
			tabBtn.addEventListener("click", function () {
				sT(tab);
			});
		}
	});

	// Always show cinematic splash — hides after 10.5 seconds
	setTimeout(function () {
		var spl = document.getElementById("spl");
		if (spl) {
			spl.classList.add("h");
			spl.style.opacity = "0";
			setTimeout(function () {
				spl.style.display = "none";
				if (localStorage.getItem("tkd-auth") !== PWD) {
					var ps = document.getElementById("pwd-screen");
					if (ps) ps.style.display = "flex";
				}
			}, 800);
		}
	}, 10500);
	render();
});
