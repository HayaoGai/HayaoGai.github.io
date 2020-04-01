/* jshint esversion: 6 */

(function () {
	'use strict';
	
	// UI 參數
	const size1 = 56; //按鈕圖片的尺寸（準備的圖也要是這個尺寸）
	const size2 = 100; //儲存取消的尺寸（準備的圖也要是這個尺寸）
	const distance = 30; //按鈕離邊界的距離

	// UI 介面
	let black, camera, bottom;

	// 當前螢幕大小
	let width, height;


	window.addEventListener("load", init);

	function init() {
		window.removeEventListener("load", init);
		requestAnimationFrame(onUpdate);
		addUI();
		addListener();
	}



	function onUpdate(time) {
		requestAnimationFrame(onUpdate);
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
      	camera.style.width = `${size1}px`;
      	camera.style.height = `${size1}px`;
      	camera.style.position = "fixed";
      	document.body.appendChild(camera);
	}

	function setUI() {
		// 參數重置
      	reset(black);
		reset(camera);
		// 直式螢幕
		if (width < height) {
          	black.style.width = `${width}px`;
          	black.style.height = `${distance * 2 + size1}px`;
          	black.style.left = "0px";
          	black.style.bottom = "0px";
          	camera.style.left = `${width * 0.5 - size1 * 0.5}px`;
          	camera.style.bottom = `${distance}px`;
      	// 橫式螢幕
		} else {
          	black.style.width = `${distance * 2 + size1}px`;
          	black.style.height = `${height}px`;
          	black.style.right = "0px";
          	black.style.top = "0px";
          	camera.style.right = `${distance}px`;
          	camera.style.top = `${height * 0.5 - size1 * 0.5}px`;
      	}
	}

    function reset(ui) {
    	ui.style.left = null;
    	ui.style.right = null;
    	ui.style.top = null;
    	ui.style.bottom = null;
	}



	function addListener() {
		camera.addEventListener("click", () => {
			// 畫布下面的黑底
			bottom = document.createElement("div");
			bottom.style.width = `${window.innerWidth}px`;
			bottom.style.height = `${window.innerHeight}px`;
			bottom.style.position = "absolute";
			bottom.style.left = "0px";
			bottom.style.top = "0px";
			bottom.style.backgroundColor = "black";
			bottom.style.opacity = "0";
			document.body.appendChild(bottom);
			// 一般攝影的圖
			const video = document.querySelectorAll("video")[0];
			const imageVideo = getVideo(video, video.offsetWidth, video.offsetHeight);
			// 3D 模型的圖
			const scene = document.querySelectorAll("a-scene")[0];
			const screenshot = scene.components.screenshot.getCanvas("perspective");
			const imageScene = getScene(screenshot, video.offsetWidth, video.offsetHeight);
			// 結合兩張圖為一張
			mergeImage(imageVideo, imageScene, video, bottom);
		});
	}

	function getVideo(video, dw, dh) {
		const canvas = document.createElement("canvas");
		canvas.width = dw;
		canvas.height = dh;
		const context = canvas.getContext("2d");
		context.drawImage(video, 0, 0, dw, dh);
		return canvas.toDataURL();
	}
	
	function getScene(originCanvas, dw, dh) {
		// a-scene 的 canvas 預設大小為 4096 * 2048
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = dw;
		canvas.height = dh;
        // Landscape
        if (dw > dh) {
            context.drawImage(originCanvas, 0, 0, dw, dh);
        // Portrait
		} else {
            const scale = dh / dw;
            const scaledHeight = originCanvas.width * scale;
            const scaledWidth = originCanvas.height * scale;
            const marginLeft = ( originCanvas.width - scaledWidth) / 2;
            context.drawImage(originCanvas, marginLeft, 0, scaledWidth, scaledHeight);
        }
        return canvas.toDataURL();
    }
	
	function mergeImage(b64Video, b64Scene, video, bottom) {
		mergeImages([b64Video, b64Scene]).then(base64 => {
			// 按比例縮小置中
			const w = video.offsetWidth * 0.55;
			const h = video.offsetHeight * 0.55;
			const x = (window.innerWidth - w) / 2;
			const y = (window.innerHeight - h) / 2;
			// 將畫布在網頁上的排序移到最上層
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			canvas.style.position = "absolute";
			canvas.style.left = `${x}px`;
			canvas.style.top = `${y}px`;
			canvas.style.opacity = "0";
			// 畫面複製到畫布上
			const image = new Image();
			image.onload = function() {
				const context = canvas.getContext("2d");
				context.drawImage(image, 0, 0, w, h);
				document.body.appendChild(canvas);
				// 補間動畫
				const s = { x: 0, y: 0 };
				new TWEEN.Tween(s)
				.to({ x: 1, y: 0.7 }, 750)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onUpdate(() => {
					canvas.style.opacity = `${s.x}`;
					bottom.style.opacity = `${s.y}`;
				})
				.onComplete(() => {
					// 擋住 canvas 不讓使用者直接右鍵儲存
					const div = document.createElement("div");
					div.style.width = video.offsetWidth;
					div.style.height = video.offsetHeight;
					div.style.position = "absolute";
					div.style.left = "0px";
					div.style.top = "0px";
					document.body.appendChild(div);
					// 儲存按鈕
					const save = document.createElement("div");
					save.style.backgroundImage = "url('image/save.png')";
					save.style.width = "200px";
      				save.style.height = "200px";
      				save.style.position = "fixed";
					save.style.right = "0px";
					save.style.bottom = "0px";
					div.appendChild(save);
					// 取消按鈕
					const cancel = document.createElement("div");
					cancel.style.backgroundImage = "url('image/cancel.png')";
					cancel.style.width = "200px";
      				cancel.style.height = "200px";
      				cancel.style.position = "fixed";
					cancel.style.bottom = "0px";
					div.appendChild(cancel);
					// 按鈕監聽
					savePhoto(base64, save, cancel, div, canvas);
				})
				.start();
			}	
			image.src = base64;
		});
	}
	
	function savePhoto(base64, save, cancel, div, canvas) {
		// 儲存
		save.addEventListener("click", () => {
			const link = document.createElement("a");
			link.setAttribute("download", "ar.png");
			link.setAttribute("href", base64);
			link.click();
		});
		// 取消
		cancel.addEventListener("click", () => {
			save.remove();
			cancel.remove();
			div.remove();
			canvas.remove();
			bottom.remove();
		});
	}

})();
