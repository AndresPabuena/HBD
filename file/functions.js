

// variables
var $win = $(window);
var clientWidth = $win.width();
var clientHeight = $win.height();

// resize handler removed: the responsive scaler in index.html handles viewport changes
// without reloading the page (which would interrupt the animation and music on mobile).

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 75);
		});
		return this;
	};
})(jQuery);

// ============================================================
// Fireworks / confetti particle system
// ============================================================
(function(window){
	var fwCanvas, fwCtx, fwParticles = [], fwRockets = [], fwRunning = false, fwEndsAt = 0, fwRAF = null;
	var COLORS = ['#ff4d6d','#ff8fa3','#ffb3c1','#ffd1dc','#ffe66d','#ff9f1c','#a663cc','#7df9ff','#ffffff'];

	function rand(a, b){ return a + Math.random() * (b - a); }
	function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

	function Rocket(){
		this.x = rand(80, fwCanvas.width - 80);
		this.y = fwCanvas.height + 10;
		this.targetY = rand(80, fwCanvas.height * 0.55);
		this.vy = -rand(8, 11);
		this.color = pick(COLORS);
		this.dead = false;
		this.trail = [];
	}
	Rocket.prototype.update = function(){
		this.trail.push({ x: this.x, y: this.y });
		if (this.trail.length > 6) this.trail.shift();
		this.y += this.vy;
		this.vy += 0.12;
		if (this.y <= this.targetY || this.vy >= 0) {
			this.explode();
			this.dead = true;
		}
	};
	Rocket.prototype.draw = function(ctx){
		for (var i = 0; i < this.trail.length; i++){
			var t = this.trail[i];
			ctx.globalAlpha = i / this.trail.length;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	};
	Rocket.prototype.explode = function(){
		var count = Math.floor(rand(40, 70));
		var baseColor = this.color;
		var multiColor = Math.random() < 0.4;
		for (var i = 0; i < count; i++){
			var angle = (Math.PI * 2 * i) / count + rand(-0.1, 0.1);
			var speed = rand(2, 6);
			fwParticles.push(new Particle(
				this.x, this.y,
				Math.cos(angle) * speed,
				Math.sin(angle) * speed,
				multiColor ? pick(COLORS) : baseColor
			));
		}
	};

	function Particle(x, y, vx, vy, color){
		this.x = x; this.y = y;
		this.vx = vx; this.vy = vy;
		this.color = color;
		this.alpha = 1;
		this.life = rand(60, 110);
		this.age = 0;
		this.size = rand(1.5, 3);
	}
	Particle.prototype.update = function(){
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= 0.98;
		this.vy = this.vy * 0.98 + 0.07;
		this.age++;
		this.alpha = Math.max(0, 1 - this.age / this.life);
	};
	Particle.prototype.draw = function(ctx){
		ctx.globalAlpha = this.alpha;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 1;
	};

	function ensureCanvas(){
		if (fwCanvas) return;
		fwCanvas = document.getElementById('fireworks');
		if (!fwCanvas) return;
		fwCtx = fwCanvas.getContext('2d');
	}

	function tick(){
		if (!fwCtx) return;
		fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

		if (fwRunning && Date.now() < fwEndsAt && Math.random() < 0.08) {
			fwRockets.push(new Rocket());
		}

		for (var i = fwRockets.length - 1; i >= 0; i--){
			fwRockets[i].update();
			fwRockets[i].draw(fwCtx);
			if (fwRockets[i].dead) fwRockets.splice(i, 1);
		}
		for (var j = fwParticles.length - 1; j >= 0; j--){
			fwParticles[j].update();
			fwParticles[j].draw(fwCtx);
			if (fwParticles[j].alpha <= 0) fwParticles.splice(j, 1);
		}

		if (fwRunning || fwRockets.length || fwParticles.length) {
			fwRAF = requestAnimationFrame(tick);
		} else {
			fwRAF = null;
			fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
		}
	}

	window.playFireworks = function(durationMs){
		ensureCanvas();
		if (!fwCtx) return;
		fwRunning = true;
		fwEndsAt = Date.now() + (durationMs || 5000);
		if (!fwRAF) tick();
		setTimeout(function(){ fwRunning = false; }, durationMs || 5000);
	};

	window.burstConfetti = function(){
		ensureCanvas();
		if (!fwCtx) return;
		for (var i = 0; i < 4; i++){
			var r = new Rocket();
			r.targetY = rand(100, fwCanvas.height * 0.4);
			r.x = rand(150, fwCanvas.width - 150);
			fwRockets.push(r);
		}
		if (!fwRAF) tick();
	};
})(window);

function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "Días <span class=\"digit\">" + days + "</span> Horas <span class=\"digit\">" + hours + "</span> Minutos <span class=\"digit\">" + minutes;
	$("#clock").html(result);

	var text = "EL MUNDO ES MÁS HERMOSO DESDE QUE LLEGASTE ";
	$("#message-box").html(text);

}
