interface Window {
    crypto: Crypto;
}
interface CryptoOperation {
    __proto__: any;
}

declare module CryptoJS {
    module enc {
        interface EncStatic {
            CP949: CryptoJS.enc.ICoder;
        }
    }
}

var _CryptoJSCharsetMap = {
    //http://www.iana.org/assignments/character-sets/character-sets.xhtml
    "utf-8": CryptoJS.enc.Utf8,
    "utf-16": CryptoJS.enc.Utf16,
    "latin1": CryptoJS.enc.Latin1,
    "iso-8859-1": CryptoJS.enc.Latin1,
    "euc-kr": CryptoJS.enc.CP949
}
function parseString(str: string, method: string) {
    var encoder = <CryptoJS.enc.ICoder>_CryptoJSCharsetMap[(method || "utf-16").toLowerCase()];
    return CryptoJS.enc.Utf16.stringify(encoder.parse(str));
};
function encodeString(str: string, method: string) {
    method = _CryptoJSCharsetMap[(method || "utf-16").toLowerCase()];
    return (<CryptoJS.enc.ICoder>CryptoJS.enc[method]).stringify(CryptoJS.enc.Utf16.parse(str));
}
var _CryptoJSDigestFallbackMap = {
    "SHA-1": CryptoJS.SHA1
}
var crypto = window.crypto || window.msCrypto;
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
        try {
            _digest(algorithm, new Uint8Array(0));
            return true;
        }
        catch (e) {
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
function stringToUint8Array(str: string) {
    return new Uint8Array(Array.prototype.map.call(str, (c) => c.charCodeAt(0)));
}
function uint8ArrayToString(uint8Array: Uint8Array) {
    return Array.prototype.map.call(uint8Array, (n) => String.fromCharCode(n)).join('');
}