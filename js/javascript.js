window.onload = () => {
    
    function Update(time) {
        requestAnimationFrame(Update);
        TWEEN.update(time);
    }
    requestAnimationFrame(Update);
    
    const canvas = document.querySelectorAll(".a-canvas")[0];
    const marker = document.querySelectorAll("#marker")[0];
    const model = document.querySelectorAll("#object")[0];
    const audio = new Audio("audio/generate.mp3");
    const hammer = new Hammer(canvas);
    const a1 = window.innerWidth * 0.25;
    const a2 = window.innerHeight * 0.25;
    const b = -2;
    const max = 5;
    const min = 1;
    const speed = 0.3;
    let press = 0;
    let scale = 1;

    // AR
    marker.addEventListener("markerFound", event => {
        model.setAttribute("position", "0 0 0");
        model.setAttribute("scale", "0 0 0");
        audio.play();
        let s = { x: 0, y: 0, z: 0};
        new TWEEN.Tween(s)
	    .to({ x: 3, y: 3, z: 3 }, 500)
	    .easing(TWEEN.Easing.Back.Out)
        .onUpdate(() => model.setAttribute("scale", `${s.x} ${s.y} ${s.z}`))
        .delay(750)
        .start();
    });
    marker.addEventListener("markerLost", event => {
        audio.pause();
        audio.currentTime = 0; 
    });
    
    // 宣告手勢
    hammer.get('pan').set("direction", "Hammer.DIRECTION_ALL");
    hammer.add(new Hammer.Pinch());
    
    // 移動
    hammer.on("panstart", event => {
        press = 0;
        let origin = model.getAttribute("position");
        const x = event.center.x / a1 + b;
        const z = event.center.y / a2 + b;
        new TWEEN.Tween(origin)
	    .to({ x: x, z: z }, 100)
	    .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => model.setAttribute("position", `${origin.x} 0 ${origin.z}`))
	    .onComplete(() => press++)
        .start();
    });
    hammer.on("panmove", event => {
        if (press < 1) return;
        const x = event.center.x / a1 + b;
        const z = event.center.y / a2 + b;
        model.setAttribute("position", `${x} 0 ${z}`);
    });
    
    // 縮放
    hammer.on("pinchstart", event => {
        scale = 1;
    });
    hammer.on("pinchmove", event => {
        if (event.scale === scale) return;
        else if (event.scale > scale) {
            scale = event.scale;
            let s = model.getAttribute("scale").x;
            if (s >= max) return;
            s += speed;
            model.setAttribute("scale", `${s} ${s} ${s}`);
        } else {
            scale = event.scale;
            let s = model.getAttribute("scale").x;
            if (s <= min) return;
            s -= speed;
            model.setAttribute("scale", `${s} ${s} ${s}`);
        }
    });
};
