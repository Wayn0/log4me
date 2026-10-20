const fs = require("fs");
const assert = require("node:assert");
const { describe, it, before, after } = require("node:test");

const log = require("../index.js");

describe("The log file", () => {
    const dir = "./test";
    let fileName;

    before(() => {
        log.setLevel(5);
        log.setPath(dir);
        log.setPrefix("test_");

        log.info("hello world!");
        fileName = log.getFileName();
    });

    after(() => {
        if (fileName && fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        }
    });

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

describe("The log directory", () => {
    const dir = "./test/created-by-logger";

    after(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it("is created automatically when missing", () => {
        fs.rmSync(dir, { recursive: true, force: true });
        log.setLevel(5);
        log.setPath(dir);
        log.setPrefix("auto_");

        log.info("created on demand");

        assert.equal(fs.existsSync(log.getFileName()), true);
    });
});

describe("Message formatting", () => {
    const dir = "./test";
    let fileName;

    before(() => {
        log.setLevel(5);
        log.setPath(dir);
        log.setPrefix("fmt_");

        log.debug(42);
        log.debug({ a: 1 });
        fileName = log.getFileName();
    });

    after(() => {
        if (fileName && fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        }
    });

    it("writes non-object values as plain text", () => {
        const logString = fs.readFileSync(fileName, "utf8");
        assert.equal(logString.includes(" - DEBUG - 42\n"), true);
    });

    it("writes objects as JSON", () => {
        const logString = fs.readFileSync(fileName, "utf8");
        assert.equal(logString.includes(' - DEBUG - {"a":1}\n'), true);
    });
});

describe("stdout mode", () => {
    let originalPath;

    before(() => {
        originalPath = "./test";
        log.setLevel(5);
        log.setPath("stdout");
    });

    after(() => {
        log.setPath(originalPath);
    });

    it("sends warnings and above to console.log", (t) => {
        const logSpy = t.mock.method(console, "log", () => {});
        const errorSpy = t.mock.method(console, "error", () => {});

        log.info("to stdout");

        assert.equal(logSpy.mock.callCount(), 1);
        assert.equal(errorSpy.mock.callCount(), 0);
        assert.match(logSpy.mock.calls[0].arguments[0], /- INFO  - to stdout$/);
    });

    it("sends errors and above to console.error", (t) => {
        const logSpy = t.mock.method(console, "log", () => {});
        const errorSpy = t.mock.method(console, "error", () => {});

        log.error("to stderr");

        assert.equal(errorSpy.mock.callCount(), 1);
        assert.equal(logSpy.mock.callCount(), 0);
        assert.match(errorSpy.mock.calls[0].arguments[0], /- ERROR - to stderr$/);
    });

    it("reports no file name", () => {
        log.debug("no file involved");
        assert.equal(log.getFileName(), "");
    });
});
