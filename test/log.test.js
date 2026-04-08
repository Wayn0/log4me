const fs = require("fs");
const assert = require("node:assert");
const { describe, it } = require("node:test");

const log = require("../index.js");

log.setLevel(5);
log.setPath("./test");
log.setPrefix("test_");

log.info("hello world!");

const fileName = log.getFileName();

describe("The log file", () => {
    it("should exist in the prescribed path", () => {
        assert.equal(fs.existsSync(fileName), true);
    });

    it("contains the message logged above", () => {
        const logString = fs.readFileSync(fileName, "utf8");
        assert.equal(logString.includes("hello world!"), true);
    });

    it("uses the correct log level", () => {
        const logString = fs.readFileSync(fileName, "utf8");
        assert.equal(logString.includes("- INFO  -"), true);
    });

    it("has been deleted", () => {
        fs.unlinkSync(fileName);
        assert.equal(fs.existsSync(fileName), false);
    });
});