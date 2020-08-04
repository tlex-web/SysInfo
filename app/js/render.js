// The required modules are already brought in, in the monitor.js file
const settingsForm = document.querySelector("#settings-form");

// Get default settings
ipcRenderer.on("settings:get", (e, settings) => {
	document.querySelector("#cpu-overload").value = settings.cpuOverload;
	document.querySelector("#alert-frequency").value = settings.alertFrequency;
});

// Set user settings
settingsForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const cpuOverload = document.querySelector("#cpu-overload").value;
	const alertFrequency = document.querySelector("#alert-frequency").value;

	ipcRenderer.send("settings:set", {
		cpuOverload,
		alertFrequency,
	});

	showAlert("Settings saved");
});

function showAlert(message) {
	const alert = document.querySelector("#alert");
	alert.classList.remove("hide");
	alert.classList.add("alert");
	alert.innerText = message;

	setTimeout(() => {
		alert.classList.remove("alert");
	}, 3000);
}

ipcRenderer.on("nav:toggle", () => {
	const nav = document.querySelector("#nav");
	nav.classList.toggle("hide");
});
