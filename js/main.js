/* jshint esversion: 6 */

(function () {
	'use strict';
	
	window.onload = () => {

		requestAnimationFrame(onUpdate);
    
		const marker = document.querySelectorAll("#marker")[0];
		const model = document.querySelectorAll("#model")[0];
		const canvas = document.querySelectorAll(".a-canvas")[0];
	    const hammer = new Hammer(canvas);
		const audio = new Audio("audio/generate.mp3");
		
		const c1 = window.innerWidth * 0.25;
		const c2 = window.innerHeight * 0.25;
		let press = 0;
		
		const max = 5;
		const min = 1;
		const speed = 0.3;
		let scale = 1;

	    detectAR(marker, model, audio);
		defineGesture(hammer);
		dragModel(model, hammer, c1, c2, press);
	    pinchModel(model, hammer, scale, max, min, speed);
	};
	


	function onUpdate(time) {
	    requestAnimationFrame(onUpdate);
		TWEEN.update(time);
	}

	function detectAR(marker, model, audio) {

		// 偵測掃描卡
		marker.addEventListener("markerFound", () => {

	        model.setAttribute("position", "0 0 0");
			model.setAttribute("scale", "0 0 0");
			audio.play();

			// 在 750 毫秒內，將 s 補間動畫至 { 3, 3, 3 }
			let s = { x: 0, y: 0, z: 0};
			new TWEEN.Tween(s)
			.to({ x: 3, y: 3, z: 3 }, 750)
			.easing(TWEEN.Easing.Back.Out)
			.onUpdate(() => model.setAttribute("scale", `${s.x} ${s.y} ${s.z}`)) // 每幀變化時進行的動作
			.delay(750) // 延遲 750 毫秒再進行下一步
			.start(); // 開始執行
		});

		// 遺失掃描卡
	    marker.addEventListener("markerLost", () => {
			audio.pause();
			audio.currentTime = 0; 
		});
	}

	function defineGesture(hammer) {
		hammer.get('pan').set("direction", "Hammer.DIRECTION_ALL");
		hammer.add(new Hammer.Pinch());
	}

	function dragModel(model, hammer, c1, c2, press) {

		hammer.on("panstart", e => {

			// 以迴歸分析計算 螢幕座標 → 模型座標
			const x = e.center.x / c1 - 2;
			const z = e.center.y / c2 - 2;
			let origin = model.getAttribute("position");
			press = 0;
			
			// 在 100 毫秒內，將 origin 補間動畫至 { x, 0, z }
			new TWEEN.Tween(origin)
			.to({ x: x, z: z }, 100)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => model.setAttribute("position", `${origin.x} 0 ${origin.z}`)) // 每幀變化時進行的動作
			.onComplete(() => press++) // 完成後 press + 1
			.start(); // 開始執行
		});
		
		hammer.on("panmove", e => {
	        if (press < 1) return;
			const x = e.center.x / c1 - 2;
			const z = e.center.y / c2 - 2;
			model.setAttribute("position", `${x} 0 ${z}`);
		});
	}

	function pinchModel(model, hammer, scale, max, min, speed) {

		hammer.on("pinchstart", () => scale = 1);

		hammer.on("pinchmove", e => {

	        if (e.scale === scale) return;

			else if (e.scale > scale) {
				// 放大
	            scale = e.scale;
				let s = model.getAttribute("scale").x;
				if (s >= max) return;
				s += speed;
				model.setAttribute("scale", `${s} ${s} ${s}`);
			} else {
				// 縮小
	            scale = e.scale;
				let s = model.getAttribute("scale").x;
				if (s <= min) return;
				s -= speed;
				model.setAttribute("scale", `${s} ${s} ${s}`);
			}
		});
	}

})();
