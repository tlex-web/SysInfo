const path = require("path");
const { ipcRenderer } = require("electron");
const osu = require("node-os-utils");
const os = require("os");
const { title } = require("process");
const { options } = require("node-os-utils");
const memory = osu.mem;
const cpu = osu.cpu;
const { total } = osu.netstat.inOut()


let cpuOverload;
let alertFrequency;

ipcRenderer.on("settings:get", (e, settings) => {
	cpuOverload = +settings.cpuOverload;
	alertFrequency = +settings.alertFrequency;
});

// Display CPU Usage Parameters
setInterval(() => {
	// CPU Usage
	cpu.usage().then((info) => {
		document.querySelector("#cpu-usage").innerText = `${info} %`;

		document.querySelector("#cpu-progress").style.width = `${info}%`;

		if (info >= cpuOverload) {
			document.querySelector("#cpu-progress").style.background = "red";
		} else {
			document.querySelector("#cpu-progress").style.background = "#30c88b";
		}

		// Check overload
		if (info >= cpuOverload && initNotify(alertFrequency)) {
			notify({
				title: "CPU Overload",
				body: `CPU is over ${cpuOverload}`,
				icon: path.join(__dirname, "img", "icon.png"),
			});

			localStorage.setItem("lastNotify", +new Date());
		}
	});

	// CPU Free
	cpu.free().then((info) => {
		document.querySelector("#cpu-free").innerText = `${info} %`;
	});

	// Memory Free
	memory.info().then((info) => {
		document.querySelector('#memory-free').innerText = `${info.freeMemPercentage} %`
	})

	// Uptime
	document.querySelector("#sys-uptime").innerText = secondsToDHMS(os.uptime());
}, 1000);

// Set Model
document.querySelector("#cpu-model").innerText = cpu.model();

// Set Computer Name
document.querySelector("#computer-name").innerText = os.hostname();

// Set OS
document.querySelector("#os").innerText = `${os.type()} ${os.arch()}`;

// Set Total Memory
memory.info().then((info) => {
	document.querySelector("#total-memory").innerText = info.totalMemMb;
});

memory.info().then((info) => {
	document.querySelector('#free-memory').innerText = info.usedMemMb
})

document.querySelector('#ip-address').innerText = osu.os.ip()

function secondsToDHMS(seconds) {
	seconds = +seconds;
	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = Math.floor(seconds / (1000 * 60));
	const s = Math.floor(seconds % 60);

	return `${d}d ${h}h ${m}m ${s}s`;
}

function notify(options) {
	new Notification(options.title, options);
}

// Check time since last notification
function initNotify(frequency) {
	if (localStorage.getItem("lastNotify") === null) {
		// Store timestamp
		localStorage.setItem("lastNotify", +new Date());
		return true;
	}
	const notifyTime = new Date(parseInt(localStorage.getItem("lastNotify")));
	const currentTime = new Date();
	const diffrence = Math.abs(currentTime - notifyTime);
	const minutesPassed = Math.ceil(diffrence / (60 * 1000));

	if (minutesPassed > frequency) {
		return true;
	} else {
		return false;
	}
}
