const { BrowserWindow } = require("electron");

class MainWindow extends BrowserWindow {
	constructor(file, isDev) {
		super({
			title: "SysInfo",
			width: isDev ? 800 : 500,
			height: 600,
			icon: "./assets/icons/icon.png",
			resizable: isDev ? true : false,
			show: false,
			opacity: 0.9,
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
			},
		});

		this.loadFile(file);

		if (isDev) {
			this.webContents.openDevTools();
		}
	}
}

module.exports = MainWindow;
