/* jshint esversion: 6 */

(function () {
	'use strict';
	
	// 縮放參數
	const scaleMax = 5;
	const scaleMin = 1;
	const scaleSpeed = 0.3;
	
	// 當前螢幕大小
	let width, height;
	
	// 迴歸分析常數
	let constant1, constant2;


	window.addEventListener("load", () => {

		const model = document.querySelectorAll("#model")[0];
		const hammer = new Hammer(document.querySelectorAll(".a-canvas")[0]);
		let isDrag, lastScale;

		requestAnimationFrame(onUpdate);
		defineGesture(hammer);
		listenerDrag(model, hammer, isDrag);
	    listenerPinch(model, hammer, lastScale);
	});
	


	function onUpdate(time) {
	    requestAnimationFrame(onUpdate);

		// 更新螢幕大小
		if (width === window.innerWidth && height === window.innerHeight) return;
		width = window.innerWidth;
		height = window.innerHeight;
		constant1 = width * 0.25;
		constant2 = height * 0.25;
	}

	function defineGesture(hammer) {
		hammer.get('pan').set("direction", "Hammer.DIRECTION_ALL");
		hammer.add(new Hammer.Pinch());
	}

	function listenerDrag(model, hammer, isDrag) {

		hammer.on("panstart", e => {

			// 以迴歸分析計算 螢幕座標 → 模型座標
			const x = e.center.x / constant1 - 2;
			const z = e.center.y / constant2 - 2;
			let origin = model.getAttribute("position");
			isDrag = false;
			
			// 在 100 毫秒內，將 origin 補間動畫至 { x, 0, z }
			new TWEEN.Tween(origin)
			.to({ x: x, z: z }, 100)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => model.setAttribute("position", `${origin.x} 0 ${origin.z}`)) // 每幀變化時進行的動作
			.onComplete(() => isDrag = true) // 完成後 press + 1
			.start(); // 開始執行
		});
		
		hammer.on("panmove", e => {
	        if (!isDrag) return;
			const x = e.center.x / constant1 - 2;
			const z = e.center.y / constant2 - 2;
			model.setAttribute("position", `${x} 0 ${z}`);
		});
	}

	function listenerPinch(model, hammer, lastScale) {

		hammer.on("pinchstart", () => lastScale = 1);

		hammer.on("pinchmove", e => {

	        if (e.scale === lastScale) return;

			else if (e.scale > lastScale) {
				// 放大
	            lastScale = e.scale;
				let s = model.getAttribute("scale").x;
				if (s >= scaleMax) return;
				s += scaleSpeed;
				model.setAttribute("scale", `${s} ${s} ${s}`);
			} else {
				// 縮小
	            lastScale = e.scale;
				let s = model.getAttribute("scale").x;
				if (s <= scaleMin) return;
				s -= scaleSpeed;
				model.setAttribute("scale", `${s} ${s} ${s}`);
			}
		});
	}

})();
