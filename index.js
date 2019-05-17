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


function log(message, level) {
	if (level <= logLevel) {
		var text = getHeader(level) + message + "\n";
		writeLine(text);
	}
}

function writeLine(text) {

	const fs = require('fs')
	var dayString = new Date().toISOString().substring(0,10);
	var path = "./logs";
	var file = "./logs/log_" + dayString + ".log";
	fs.access(path, fs.F_OK, (err) => {
		if (err) {
			console.error(err)
			console.error("Please make sure you have a writable ./logs directory");
			return
		} else {

			fs.access(path, fs.F_OK, (err) => {
				if (err) {
					fs.writeFile(file, text, function (err, file) {
						if (err) throw err;
					});
				} else {

					fs.appendFile(file,text,'utf8',
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
	var ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	
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
	debug
};