"use strict";

const Encryptor = require("./Encryptor");

const _convertInputToBufferAsync = function (input, base64) {
    return Promise.resolve().then(() => {
        if (Buffer.isBuffer(input)) return input;

        if (process.browser && input instanceof Blob) {
            return new Promise(resolve => {
                const fileReader = new FileReader();
                fileReader.onload = event => {
                    resolve(Buffer.from(event.target.result));
                };
                fileReader.readAsArrayBuffer(input);
            });
        }

        if (typeof input === "string" && base64)
            return Buffer.from(input, "base64");
        if (typeof input === "string" && !base64) return Buffer.from(input, "utf8");
        if (input instanceof Uint8Array || input instanceof ArrayBuffer)
            return Buffer.from(input);

        throw new Error(`Input type unknown.`);
    });
};

const decryptFileAsync = function (f, password) {
    return _convertInputToBufferAsync(f).then(data => {
        const encryptor = new Encryptor();
        return encryptor.decryptAsync(data, password);
    });
};

module.exports = { decryptFileAsync };
