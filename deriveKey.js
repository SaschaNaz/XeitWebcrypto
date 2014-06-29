var _CryptoJSDeriveKeyFallbackMap = {
    "PBKDF1": CryptoJS.PBKDF1,
    "PBKDF2": CryptoJS.PBKDF2
};

function _deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages) {
    crypto.subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages);
}

function deriveKey() {
}
//# sourceMappingURL=derivekey.js.map
