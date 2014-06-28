var _CryptoJSCharsetMap = {
    //http://www.iana.org/assignments/character-sets/character-sets.xhtml
    "utf-8": CryptoJS.enc.Utf8,
    "utf-16": CryptoJS.enc.Utf16,
    "latin1": CryptoJS.enc.Latin1,
    "iso-8859-1": CryptoJS.enc.Latin1,
    "euc-kr": CryptoJS.enc.CP949
};
function parseString(str, method) {
    var encoder = _CryptoJSCharsetMap[(method || "utf-16").toLowerCase()];
    return CryptoJS.enc.Utf16.stringify(encoder.parse(str));
}
;
function encodeString(str, method) {
    method = _CryptoJSCharsetMap[(method || "utf-16").toLowerCase()];
    return CryptoJS.enc[method].stringify(CryptoJS.enc.Utf16.parse(str));
}
var _CryptoJSDigestFallbackMap = {
    "SHA-1": CryptoJS.SHA1
};
var crypto = window.crypto || window.msCrypto;

/**
Digests ArrayBuffer using W3C Web Cryptography
*/
function _digest(algorithm, buffer) {
    var parameters = [algorithm];
    if (buffer !== undefined)
        parameters.push(buffer);
    var operation = crypto.subtle.digest.apply(crypto.subtle, parameters);

    if (operation.__proto__ === Promise.prototype)
        return operation;
    else {
        return new Promise(function (resolve, reject) {
            if (operation.result)
                resolve(operation.result);
            else
                operation.oncomplete = function () {
                    return resolve(new Uint8Array(operation.result));
                }; //IE11 gives ArrayBuffer here
        });
    }
}

/**
Digests ArrayBuffer using W3C Web Cryptography, fallbacking to CryptoJS
*/
function digest(algorithm, buffer) {
    var supported = (function () {
        try  {
            _digest(algorithm, new Uint8Array(0));
            return true;
        } catch (e) {
            return false;
        }
    })();
    if (supported)
        return _digest(algorithm, buffer);
    else {
        return new Promise(function (resolve, reject) {
            var fallback = _CryptoJSDigestFallbackMap[algorithm];
            if (fallback)
                resolve(stringToUint8Array(CryptoJS.enc.Latin1.stringify(fallback(uint8ArrayToString(new Uint8Array(buffer))))));
            else
                reject(new Error("NotSupportedError"));
        });
    }
}
function stringToUint8Array(str) {
    return new Uint8Array(Array.prototype.map.call(str, function (c) {
        return c.charCodeAt(0);
    }));
}
function uint8ArrayToString(uint8Array) {
    return Array.prototype.map.call(uint8Array, function (n) {
        return String.fromCharCode(n);
    }).join('');
}
//# sourceMappingURL=app.js.map
