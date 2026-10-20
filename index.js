/**
 * @package log4me
 *
 * @author: info@wayneoliver.co.za
 * @created: 17/05/2019 12:12:12
 */

const fs = require("fs");

const FATAL = 1;
const ERROR = 2;
const WARN  = 3;
const INFO  = 4;
const DEBUG = 5;

let logLevel = DEBUG;
let path     = "./log";
let prefix   = "log_";
let fileName = "";


function log(message, level) {
	if (level > logLevel) {
		return;
	}
	let now   = new Date();
	let local = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
	writeLine(getPrefix(local, level) + format(message) + "\n", level, local);
}

function format(message) {
	if (typeof message === "string") {
		return message;
	}
	if (message !== null && typeof message === "object") {
		return JSON.stringify(message);
	}
	return String(message);
}

function writeLine(text, level, local) {
	if (path == "stdout") {
		fileName = "";
		if (level < WARN)
			console.error(text.trim());
		else
			console.log(text.trim());
		return;
	}

	fileName = path + "/" + prefix + local.toISOString().substring(0, 10) + ".log";
	try {
		fs.mkdirSync(path, { recursive: true });
		fs.appendFileSync(fileName, text, "utf8");
	} catch (err) {
		fileName = "";
		console.error("log4me: could not write to " + path + ": " + err.message);
	}
}

function getPrefix(local, level) {
	let ts = local.toISOString().replace(/T/, ' ').replace(/\..+/, '');

	switch (level) {
		case FATAL:
			return ts + ' - FATAL - ';
		case ERROR:
			return ts + ' - ERROR - ';
		case WARN:
			return ts + ' - WARN  - ';
		case INFO:
			return ts + ' - INFO  - ';
		case DEBUG:
			return ts + ' - DEBUG - ';
		default:
			return ts + ' - DEBUG - ';
	}
}

function setLevel(level) {

	if (level == 'fatal' || level == 'FATAL' || level == 1) {
		logLevel = FATAL;
	} else if (level == 'error' || level == 'ERROR' || level == 2) {
		logLevel = ERROR;
	} else if (level == 'warn' || level == 'WARN' || level == 3) {
		logLevel = WARN;
	} else if (level == 'info' || level == 'INFO' || level == 4) {
		logLevel = INFO;
	} else {
		logLevel = DEBUG;
	}
}

function getFileName() {
	return fileName;
}

function setPath(newPath) {
	path = newPath;
}

function setPrefix(newPrefix) {
	prefix = newPrefix;
}

function fatal(message) {
	log(message, FATAL);
}
function error(message) {
	log(message, ERROR);
}
function warn(message) {
	log(message, WARN);
}
function info(message) {
	log(message, INFO);
}
function debug(message) {
	log(message, DEBUG);
}

module.exports = {
	fatal,
	error,
	warn,
	info,
	debug,
	getFileName,
	setLevel,
	setPrefix,
	setPath
};
