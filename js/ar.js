/* jshint esversion: 6 */

(function () {
	'use strict';
	

	window.onload = () => {
		console.log("ar.js");

		const marker = document.querySelectorAll("#marker")[0];
		const model = document.querySelectorAll("#model")[0];
		const audio = new Audio(audio/generate.mp3);
	    
		found(marker, model, audio);
		lost(marker, audio);
	};



	// 偵測掃描卡
	function found(marker, model, audio) {

		marker.addEventListener("markerFound", () => {

	        // 模型重置
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
	}

	// 遺失掃描卡
	function lost(marker, audio) {

	    marker.addEventListener("markerLost", () => {
			audio.pause();
			audio.currentTime = 0; 
		});
	}

})();
