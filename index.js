/**
 * @package log4me
 *
 * @author: info@wayneoliver.co.za
 * @created: 17/05/2019 12:12:12
 */


const FATAL = 1;
const ERROR = 2;
const WARN  = 3;
const INFO  = 4
const DEBUG = 5;

var logLevel = 5;
var path     = "./log";
var prefix   = "log_";
var fileName = "";


function log(message, level) {
	if (level <= logLevel) {
		if(typeof message === "string") {
			var text = getHeader(level) + message + "\n";
		} else if(typeof message === "object") {
			var text = getHeader(level) + JSON.stringify(message) + "\n";
		}
		writeLine(text);
	}
}

function writeLine(text) {

	const fs = require('fs')
	var date = new Date();
	var dayString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0,10);
	fileName = path + "/" + prefix + dayString + ".log";
	fs.access(path, fs.F_OK, (err) => {
		if (err) {
			console.error("Please make sure you have a writable " + path + " directory");
			throw err;
			
		} else {

			fs.access(path, fs.F_OK, (err) => {
				if (err) {
					fs.writeFile(file, text, function (err) {
						if (err) throw err;
					});
				} else {

					fs.appendFile(fileName,text,'utf8',
					// callback function
						function(err) { 
						if (err) throw err;
					});
				}
			});
		}
	});
}

function getHeader(level) {
	var d  = new Date();
	var ts = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().replace(/T/, ' ').replace(/\..+/, '');
	
	switch(level) {

		case FATAL:
			return ts + ' - FATAL - ';
			break;

		case ERROR:
			return ts + ' - ERROR - ';
			break;

		case WARN:
			return ts + ' - WARN  - ';
			break;

		case INFO:
			return ts + ' - INFO  - ';
			break;

		case DEBUG:
			return ts + ' - DEBUG - ';
			break;

		default:
			return ts + ' - DEBUG - ';
	}
}

function setLevel(level) {

	if(level == 'fatal' || level == 'FATAL' || level == 1) {
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
	log(message,FATAL);
}
function error(message) {
	log(message,ERROR);
}
function warn(message) {
	log(message,WARN);
}
function info(message) {
	log(message,INFO);
}
function debug(message) {
	log(message,DEBUG);
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
