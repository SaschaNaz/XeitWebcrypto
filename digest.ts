var _CryptoJSDigestFallbackMap = {
    "SHA-1": CryptoJS.SHA1,
    "SHA-256": CryptoJS.SHA256,
    "SHA-384": CryptoJS.SHA384,
    "SHA-512": CryptoJS.SHA512
}

/**
Digests ArrayBuffer using W3C Web Cryptography
*/
function _digest(algorithm: string, buffer: ArrayBufferView) {
    var parameters: any[] = [algorithm];
    if (buffer !== undefined)
        parameters.push(buffer);
    var operation = <CryptoOperation>crypto.subtle.digest.apply(crypto.subtle, parameters);

    if (operation.__proto__ === Promise.prototype)
        return <Promise<any>><any>operation;
    else {//polyfills IE11 implementation which gives CryptoOperation instead of Promise
        return new Promise<any>((resolve, reject) => {
            if (operation.result)
                resolve(operation.result);
            else
                operation.oncomplete = () => resolve(new Uint8Array(operation.result));//IE11 gives ArrayBuffer here
        });
    }
}

/**
Digests ArrayBuffer using W3C Web Cryptography, fallbacking to CryptoJS
*/
function digest(algorithm: string, buffer: ArrayBufferView) {
    var supported = (() => {
        if (!crypto)//no Web Cryptography support
            return false;
        try {
            _digest(algorithm, new Uint8Array(0));
            return true;
        }
        catch (e) {//Web Cryptography is supported but the target algorithm is not there
            return false;
        }
    })();
    if (supported)
        return _digest(algorithm, buffer);
    else {
        return new Promise<any>((resolve, reject) => {
            var fallback = <CryptoJS.lib.HasherHelper>_CryptoJSDigestFallbackMap[algorithm];
            if (fallback)
                resolve(
                    stringToUint8Array(
                        CryptoJS.enc.Latin1.stringify(
                            fallback(
                                uint8ArrayToString(
                                    new Uint8Array(buffer))))));
            else
                reject(new Error("NotSupportedError"));
        });
    }
}