/* jshint esversion: 6 */

(function () {
	'use strict';
	
	// UI 參數
	const number = "0.0.1"; //版本號
	const size = 56; //按鈕圖片的尺寸（準備的圖也要是這個尺寸）
	const distance = 30; //按鈕離邊界的距離

	// UI 介面
	let black, camera, version;

	// 當前螢幕大小
	let width, height;


	window.onload = () => {
		addUI();
		requestAnimationFrame(onUpdate1);

		const marker = document.querySelectorAll("#marker")[0];
		const model = document.querySelectorAll("#model")[0];
		const audio = new Audio(audio/generate.mp3);
		found(marker, model, audio);
		lost(marker, audio);

		//const model = document.querySelectorAll("#model")[0];
		const hammer = new Hammer(document.querySelectorAll(".a-canvas")[0]);
		let isDrag, lastScale;

		requestAnimationFrame(onUpdate2);
		defineGesture(hammer);
		listenerDrag(model, hammer, isDrag);
	    listenerPinch(model, hammer, lastScale);
	};
	


	function onUpdate1(time) {
	    requestAnimationFrame(onUpdate1);
		TWEEN.update(time);

		// 更新螢幕大小
		if (width === window.innerWidth && height === window.innerHeight) return;
		width = window.innerWidth;
		height = window.innerHeight;
		setUI();
	}

	function addUI() {
		
		// Black
		black = document.createElement("div");
        black.style.backgroundColor = "black";
		black.style.position = "fixed";
        document.body.appendChild(black);
		
		// Camera
		camera = document.createElement("div");
        camera.style.backgroundImage = "url('image/camera.png')";
        camera.style.width = `${size}px`;
        camera.style.height = `${size}px`;
        camera.style.position = "fixed";
        document.body.appendChild(camera);

		// Version
        version = document.createElement("div");
        version.style.color = "white";
        version.style.position = "fixed";
        version.style.right = "10px";
        version.style.bottom = "10px";
        version.innerHTML = `version_${numbrt}`;
        document.body.appendChild(version);
	}

	function setUI() {
		
		// 參數重置
        reset(black);
		reset(camera);

		if (width < height) {
			// 直式螢幕
            black.style.width = `${width}px`;
            black.style.height = `${distance * 2 + size}px`;
            black.style.left = "0px";
            black.style.bottom = "0px";
            camera.style.left = `${width * 0.5 - size * 0.5}px`;
            camera.style.bottom = `${distance}px`;
        } else {
			// 橫式螢幕
            black.style.width = `${distance * 2 + size}px`;
            black.style.height = `${height}px`;
            black.style.right = "0px";
            black.style.top = "0px";
            camera.style.right = `${distance}px`;
            camera.style.top = `${height * 0.5 - size * 0.5}px`;
        }
	}

	function reset(ui) {
		ui.style.left = null;
        ui.style.right = null;
        ui.style.top = null;
        ui.style.bottom = null;
	}

})();
