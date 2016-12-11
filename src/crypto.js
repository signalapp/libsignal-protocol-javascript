/*
 * vim: ts=4:sw=4
 */
'use strict';

// TODO polyfill window.crypto for node?
var crypto = window.crypto;

var Curve = require('./Curve.js');
var util = require('./helpers.js');
var dcodeIO = require('../build/dcodeIO.js');

if (!crypto || !crypto.subtle || typeof crypto.getRandomValues !== 'function') {
  throw new Error('WebCrypto not found');
}

// object for this crypto.js scope
var myCrypto = {};

myCrypto.crypto = {
  getRandomBytes: function(size) {
    var array = new Uint8Array(size);
    crypto.getRandomValues(array);
    return array.buffer;
  },
  encrypt: function(key, data, iv) {
    return crypto.subtle.importKey('raw', key, {name: 'AES-CBC'}, false, ['encrypt']).then(function(key) {
      return crypto.subtle.encrypt({name: 'AES-CBC', iv: new Uint8Array(iv)}, key, data);
    });
  },
  decrypt: function(key, data, iv) {
    return crypto.subtle.importKey('raw', key, {name: 'AES-CBC'}, false, ['decrypt']).then(function(key) {
      return crypto.subtle.decrypt({name: 'AES-CBC', iv: new Uint8Array(iv)}, key, data);
    });
  },
  sign: function(key, data) {
    return crypto.subtle.importKey('raw', key, {name: 'HMAC', hash: {name: 'SHA-256'}}, false, ['sign']).then(function(key) {
      return crypto.subtle.sign( {name: 'HMAC', hash: 'SHA-256'}, key, data);
    });
  },

  hash: function(data) {
    return crypto.subtle.digest({name: 'SHA-512'}, data);
  },

  HKDF: function(input, salt, info) {
    // Specific implementation of RFC 5869 that only returns the first 3 32-byte chunks
    // TODO: We dont always need the third chunk, we might skip it
    return myCrypto.crypto.sign(salt, input).then(function(PRK) {
      var infoBuffer = new ArrayBuffer(info.byteLength + 1 + 32);
      var infoArray = new Uint8Array(infoBuffer);
      infoArray.set(new Uint8Array(info), 32);
      infoArray[infoArray.length - 1] = 1;
      return myCrypto.crypto.sign(PRK, infoBuffer.slice(32)).then(function(T1) {
        infoArray.set(new Uint8Array(T1));
        infoArray[infoArray.length - 1] = 2;
        return myCrypto.crypto.sign(PRK, infoBuffer).then(function(T2) {
          infoArray.set(new Uint8Array(T2));
          infoArray[infoArray.length - 1] = 3;
          return myCrypto.crypto.sign(PRK, infoBuffer).then(function(T3) {
            return [ T1, T2, T3 ];
          });
        });
      });
    });
  },

  // Curve 25519 crypto
  createKeyPair: function(privKey) {
    if (privKey === undefined) {
      privKey = myCrypto.crypto.getRandomBytes(32);
    }
    return Curve.async.createKeyPair(privKey);
  },
  ECDHE: function(pubKey, privKey) {
    return Curve.async.ECDHE(pubKey, privKey);
  },
  Ed25519Sign: function(privKey, message) {
    return Curve.async.Ed25519Sign(privKey, message);
  },
  Ed25519Verify: function(pubKey, msg, sig) {
    return Curve.async.Ed25519Verify(pubKey, msg, sig);
  }
};


// HKDF for TextSecure has a bit of additional handling - salts always end up being 32 bytes
myCrypto.HKDF = function(input, salt, info) {
  if (salt.byteLength != 32) {
    throw new Error("Got salt of incorrect length");
  }

  return myCrypto.crypto.HKDF(input, salt,  util.toArrayBuffer(info));
};

myCrypto.verifyMAC = function(data, key, mac, length) {
  return myCrypto.crypto.sign(key, data).then(function(calculated_mac) {
    if (mac.byteLength != length  || calculated_mac.byteLength < length) {
      throw new Error("Bad MAC length");
    }
    var a = new Uint8Array(calculated_mac);
    var b = new Uint8Array(mac);
    var result = 0;
    for (var i=0; i < mac.byteLength; ++i) {
      result = result | (a[i] ^ b[i]);
    }
    if (result !== 0) {
      console.log('Our MAC  ', dcodeIO.ByteBuffer.wrap(calculated_mac).toHex());
      console.log('Their MAC', dcodeIO.ByteBuffer.wrap(mac).toHex());
      throw new Error("Bad MAC");
    }
  });
};

module.exports = myCrypto;

// TODO will need to include these later...maybe?
// module.exports = {
//   HKDF: {
//     deriveSecrets: function(input, salt, info) {
//       return myCrypto.HKDF(input, salt, info);
//     },
//   },
//   crypto: {
//     encrypt: function(key, data, iv) {
//       return myCrypto.crypto.encrypt(key, data, iv);
//     },
//     decrypt: function(key, data, iv) {
//       return myCrypto.crypto.decrypt(key, data, iv);
//     },
//     calculateMAC: function(key, data) {
//       return myCrypto.crypto.sign(key, data);
//     },
//     verifyMAC: function(data, key, mac, length) {
//       return myCrypto.verifyMAC(data, key, mac, length);
//     },
//     getRandomBytes: function(size) {
//       return myCrypto.crypto.getRandomBytes(size);
//     }
//   }
// };
