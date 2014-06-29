declare module CryptoJS {
    interface CryptoJSStatic {
        PBKDF1: CryptoJS.algo.IEvpKDFHelper;
    }
}

var _CryptoJSDeriveKeyFallbackMap = {
    "PBKDF1": CryptoJS.PBKDF1,
    "PBKDF2": CryptoJS.PBKDF2
}

interface Pbkdf2Params extends Algorithm {
    salt: ArrayBufferView;
    iterations: number;
    hash: Algorithm;
}

function _deriveKey(
    algorithm: Algorithm,
    baseKey: Key,
    derivedKeyType: Algorithm,
    extractable: boolean,
    keyUsages: string[]) {
    
    
    crypto.subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages);
}

function deriveKey() {

}