declare module CryptoJS {
    interface CryptoJSStatic {
        PBKDF1: CryptoJS.algo.IEvpKDFHelper;
    }
}

var _CryptoJSDeriveKeyFallbackMap = {
    "PBKDF1": CryptoJS.PBKDF1,
    "PBKDF2": CryptoJS.PBKDF2
}

function _deriveKey() {

}

function deriveKey() {
}


