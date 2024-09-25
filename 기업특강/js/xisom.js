
(function(global) {

	var func = global.$XView;
	if (typeof func != "undefined") {
		// 이미 설정됨..
		return;
	}
	// View
	func = function(name) {
		if (typeof name == "number") {
			return page.views[name];
		}
		return page.getViewByName(name);
	};
	global.$XView = func;
	global.$XV = func;

	// Tag
	func = function(name) {
		if (typeof name == "number") {
			return scada.tags[name];
		}
		return scada.getTagByName(name);
	};
	global.$XTag = func;
	global.$XT = func;

	// Device
	func = function(name) {
		if (typeof name == "number") {
			return scada.devices[name];
		}
		return scada.getDeviceByName(name);
	};
	global.$XDevice = func;
	global.$XI = func;

	// Export
	func = function(name) {
		if (typeof name == "number") {
			return scada.exports[name];
		}
		return scada.getExportByName(name);
	};
	global.$XExport = func;
	global.$XE = func;

	// Database
	func = function(name) {
		if (typeof name == "number") {
			return scada.databases[name];
		}
		return scada.getDatabaseByName(name);
	};
	global.$XDatabase = func;
	global.$XD = func;

	// User
	//func = function(name) {
	//	if (typeof name == "number") {
	//		return scada.users[name];
	//	}
	//	return scada.getUserById(name);
	//};
	//global.$XUser = func;
	//global.$XU = func;

	// Alarm
	func = function(name) {
		if (typeof name == "number") {
			return scada.alarms[name];
		}
		return scada.getAlarmByName(name);
	};
	global.$XAlarm = func;
	global.$XA = func;

	// Report
	func = function(name) {
		if (typeof name == "number") {
			return scada.reports[name];
		}
		return scada.getReportByName(name);
	};
	global.$XReport = func;
	global.$XR = func;

	// Scenario(Recipe)
	func = function(name) {
		if (typeof name == "number") {
			return scada.scenarios[name];
		}
		return scada.getScenarioByName(name);
	};

	global.$XScenario = func;
	global.$XS = func;

	// Capture
	func = function(name) {
		if (typeof name == "number") {
			return scada.captures[name];
		}
		return scada.getCaptureByName(name);
	};
	global.$XCapture = func;
	global.$XC = func;

	// Timer
	func = function (handler, delay, interval, limit, tag) {
		if (typeof handler != "function") return;

		var intervalHandle = 0;
		var timeoutHandle = 0;
		var count = 0;
		if (delay == null || delay < 0) delay = 0;
		if (interval == null || interval < 0) interval = 0;
		if (limit == null || limit < 0) limit = 0;

		//디지털 태그가 트리거로 들어오지 않은 경우
		if (tag == null ||
			typeof tag != "object" ||
			typeof tag.value != "boolean" ||
			typeof tag.addEventListener != "function") {
			start();
		} else {
			tag.addEventListener("change", function () {
				if (tag.value == true) {
					start();
				} else {
					stop();
				}
			});
		}

		function start() {
			if (timeoutHandle != 0 || intervalHandle != 0) return;

			timeoutHandle = setTimeout(function () {
				call();
				if (limit <= 0) {
					intervalHandle = setInterval(function () { call() }, interval);
				}
				else if (limit > 1) {
					intervalHandle = setInterval(function () {
						call();
						if (count >= limit) {
							stop();
						}
					}, interval);
				}
			}, delay);
		}

		function stop() {
			clearTimeout(timeoutHandle);
			clearInterval(intervalHandle);
			timeoutHandle = 0
			intervalHandle = 0
			count = 0;
		}

		function call() {
			count++;
			handler();
		}

		return {
			get enable() {
				return timeoutHandle != 0 || intervalHandle != 0;
			},
			set enable(state) {
				if (state) {
					start();
				} else {
					stop();
				}
			}
		}
	};
	global.$Timer = func;

	// LoginAndMove
	var func = function (id, pw, pageName, onFail) {
		if (scada.login(id, pw)) {
			window.location.replace(pageName);
		} else if (onFail != null) {
			onFail();
		}
	};
	global.$LoginAndMove = func;

	// LogoutAndMove
	var func = function (pageName) {
		scada.logout();
		window.location.replace(pageName);
	};
	global.$LogoutAndMove = func;

	// LoginAndOpen
	var func = function (id, pw, pageName, option, onFail) {
		if (scada.login(id, pw)) {
			window.open(pageName, '_blank', option);
		} else if (onFail != null) {
			onFail();
		}
	};
	global.$LoginAndOpen = func;

	// LogoutAndOpen
	var func = function (pageName, option) {
		scada.logout();
		window.open(pageName, '_blank', option);
	};
	global.$LogoutAndOpen = func;

	// PageOpen
	var func = function (pageName, option) {
		if (option.indexOf("centerparent=yes") != -1) {
			$Common.openCenter(pageName, '_blank', option);
		} else {
			window.open(pageName, '_blank', option);
		}
	};
	global.$PageOpen = func;

	// PageMove
	var func = function (pageName, delay, trigger) {
		$Timer(function () {
			window.location.replace(pageName);
		}, delay, 0, 0, trigger);
	};
	global.$PageMove = func;

	// PageClose
	var func = function (delay, trigger) {
		$Timer(function () {
			self.opener = self;
			window.close();
		}, delay, 0, 0, trigger);
	};
	global.$PageClose = func;

	// PageCloseConfirm
	var func = function (delay, trigger) {
		$Timer(function () {
			window.close();
		}, delay, 0, 0, trigger);
	};
	global.$PageCloseConfirm = func;

}(this));

