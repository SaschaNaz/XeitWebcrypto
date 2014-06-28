interface Window {
    crypto: Crypto;
    Promise: typeof Promise;
}

var _CryptoJSCharsetMap = {
    //http://www.iana.org/assignments/character-sets/character-sets.xhtml
    "utf-8": "Utf8",
    "utf-16": "Utf16",
    "latin1": "Latin1",
    "iso-8859-1": "Latin1",
    "euc-kr": "CP949"
}
function parseString(str: string, method: string) {
    method = _CryptoJSCharsetMap[(method || "utf-16").toLowerCase()];
    return CryptoJS.enc.Utf16.stringify((<CryptoJS.enc.ICoder>CryptoJS.enc[method]).parse(str));
};
function encodeString(str: string, method: string) {
    method = _CryptoJSCharsetMap[(method || "utf-16").toLowerCase()];
    return (<CryptoJS.enc.ICoder>CryptoJS.enc[method]).stringify(CryptoJS.enc.Utf16.parse(str));
}
var _CryptoJSDigestFallbackMap = {
    "SHA-1": CryptoJS.SHA1
}
var crypto = window.crypto || window.msCrypto;
var thenable = !!window.Promise;
function digest(algorithm: string, buffer?: ArrayBufferView) {
    var operation = crypto.subtle.digest(algorithm, buffer);
    if (thenable)
        return <Promise<{}>><any>operation;
    else {
        return new Promise((resolve, reject) => {
            operation.oncomplete = () => resolve(operation.result);
        });
    }
}
