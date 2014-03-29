// makes it wait for browser to load to render
window.requestAnimationFrame(function() {
	new GameManager(4,GameInputManager, HTMLActuator, LocalStorageManager);
});