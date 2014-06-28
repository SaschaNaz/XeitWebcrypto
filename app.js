var _CryptoJSCharsetMap = {
    //http://www.iana.org/assignments/character-sets/character-sets.xhtml
    "utf-8": "Utf8",
    "utf-16": "Utf16",
    "latin1": "Latin1",
    "iso-8859-1": "Latin1",
    "euc-kr": "CP949"
};
function parseString(str, method) {
    method = _CryptoJSCharsetMap[(method || "utf-16").toLowerCase()];
    return CryptoJS.enc.Utf16.stringify(CryptoJS.enc[method].parse(str));
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
var thenable = !!window.Promise;
function digest(algorithm, buffer) {
    var operation = crypto.subtle.digest(algorithm, buffer);
    if (thenable)
        return operation;
    else {
        return new Promise(function (resolve, reject) {
            operation.oncomplete = function () {
                return resolve(operation.result);
            };
        });
    }
}
//# sourceMappingURL=app.js.map
