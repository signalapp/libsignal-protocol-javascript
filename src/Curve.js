(function() {
    'use strict';

    function validatePrivKey(privKey) {
        if (privKey === undefined || !(privKey instanceof ArrayBuffer) || privKey.byteLength != 32) {
            throw new Error("Invalid private key");
        }
    }
    function validatePubKeyFormat(pubKey) {
        if (pubKey === undefined || ((pubKey.byteLength != 33 || new Uint8Array(pubKey)[0] != 5) && pubKey.byteLength != 32)) {
            throw new Error("Invalid public key");
        }
        if (pubKey.byteLength == 33) {
            return pubKey.slice(1);
        } else {
            console.error("WARNING: Expected pubkey of length 33, please report the ST and client that generated the pubkey");
            return pubKey;
        }
    }

    function processKeys(raw_keys) {
        // prepend version byte
        var origPub = new Uint8Array(raw_keys.pubKey);
        var pub = new Uint8Array(33);
        pub.set(origPub, 1);
        pub[0] = 5;

        return { pubKey: pub.buffer, privKey: raw_keys.privKey };
    }

    function wrapCurve25519(curve25519) {
        return {
            // Curve 25519 crypto
            createKeyPair: function(privKey) {
                validatePrivKey(privKey);
                var raw_keys = curve25519.keyPair(privKey);
                if (raw_keys instanceof Promise) {
                    return raw_keys.then(processKeys);
                } else {
                    return processKeys(raw_keys);
                }
            },
            ECDHE: function(pubKey, privKey) {
                pubKey = validatePubKeyFormat(pubKey);
                validatePrivKey(privKey);

                if (pubKey === undefined || pubKey.byteLength != 32) {
                    throw new Error("Invalid public key");
                }

                return curve25519.sharedSecret(pubKey, privKey);
            },
            Ed25519Sign: function(privKey, message) {
                validatePrivKey(privKey);

                if (message === undefined) {
                    throw new Error("Invalid message");
                }

                return curve25519.sign(privKey, message);
            },
            Ed25519Verify: function(pubKey, msg, sig) {
                pubKey = validatePubKeyFormat(pubKey);

                if (pubKey === undefined || pubKey.byteLength != 32) {
                    throw new Error("Invalid public key");
                }

                if (msg === undefined) {
                    throw new Error("Invalid message");
                }

                if (sig === undefined || sig.byteLength != 64) {
                    throw new Error("Invalid signature");
                }

                return curve25519.verify(pubKey, msg, sig);
            }
        };
    }

    Internal.Curve       = wrapCurve25519(Internal.curve25519);
    Internal.Curve.async = wrapCurve25519(Internal.curve25519_async);

    function wrapCurve(curve) {
        return {
            generateKeyPair: function() {
                var privKey = Internal.crypto.getRandomBytes(32);
                return curve.createKeyPair(privKey);
            },
            createKeyPair: function(privKey) {
                return curve.createKeyPair(privKey);
            },
            calculateAgreement: function(pubKey, privKey) {
                return curve.ECDHE(pubKey, privKey);
            },
            verifySignature: function(pubKey, msg, sig) {
                return curve.Ed25519Verify(pubKey, msg, sig);
            },
            calculateSignature: function(privKey, message) {
                return curve.Ed25519Sign(privKey, message);
            }
        };
    }

    libsignal.Curve       = wrapCurve(Internal.Curve);
    libsignal.Curve.async = wrapCurve(Internal.Curve.async);

})();
