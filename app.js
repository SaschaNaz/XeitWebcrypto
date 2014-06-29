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
var crypto = window.crypto || window.msCrypto;
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
