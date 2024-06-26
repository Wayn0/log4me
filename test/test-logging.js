const fs = require("fs")
var assert = require("assert")

var log = require("../index.js")
log.setLevel(5)
log.setPath("./test")
log.setPrefix("test_")

log.info("hello world!")

var fileName = log.getFileName()

describe("The log file", function () {
    it("should exists in the prescribed path", function () {
        assert.equal(true, fs.existsSync(fileName))
    })

    it("contains the message logged above", function () {
        var logString = (data = fs.readFileSync(fileName))
        assert.equal(true, logString.includes("hello world!"))
    })

    it("uses the correct log level", function () {
        var logString = (data = fs.readFileSync(fileName))
        assert.equal(true, logString.includes("- INFO  -"))
    })

    it("has been deleted", function () {
        fs.unlinkSync(fileName)
        assert.equal(false, fs.existsSync(fileName))
    })
})
