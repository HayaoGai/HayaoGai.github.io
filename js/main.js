/* jshint esversion: 6 */

(function () {
	'use strict';
	
	// 版本號
	const number = "0.0.1"; 

	
	window.addEventListener("load", init);

	function init() {
		window.removeEventListener("load", init);
		const version = document.createElement("div");
      	version.style.color = "white";
      	version.style.position = "fixed";
      	version.style.right = "10px";
      	version.style.bottom = "10px";
      	version.innerHTML = `version_${number}`;
      	document.body.appendChild(version);
	}
	
})();
