var _CryptoJSDigestFallbackMap = {
    "SHA-1": CryptoJS.SHA1,
    "SHA-256": CryptoJS.SHA256,
    "SHA-384": CryptoJS.SHA384,
    "SHA-512": CryptoJS.SHA512
};

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
        if (!crypto)
            return false;
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
//# sourceMappingURL=digest.js.map
