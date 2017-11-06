var VERSION = 0;

var Crypto = require('./crypto.js');
var dcodeIO = require('../build/dcodeIO.js');

function iterateHash(data, key, count) {
  data = dcodeIO.ByteBuffer.concat([data, key]).toArrayBuffer();
  return Crypto.crypto.hash(data).then(function(result) {
    if (--count === 0) {
      return result;
    } else {
      return iterateHash(result, key, count);
    }
  });
}

function shortToArrayBuffer(number) {
  return new Uint16Array([number]).buffer;
}

function getEncodedChunk(hash, offset) {
  var chunk = ( hash[offset]   * Math.pow(2,32) +
                hash[offset+1] * Math.pow(2,24) +
                hash[offset+2] * Math.pow(2,16) +
                hash[offset+3] * Math.pow(2,8) +
                hash[offset+4] ) % 100000;
  var s = chunk.toString();
  while (s.length < 5) {
    s = '0' + s;
  }
  return s;
}

function getDisplayStringFor(identifier, key, iterations) {
  var bytes = dcodeIO.ByteBuffer.concat([
    shortToArrayBuffer(VERSION), key, identifier
  ]).toArrayBuffer();
  return iterateHash(bytes, key, iterations).then(function(output) {
    output = new Uint8Array(output);
    return getEncodedChunk(output, 0) +
      getEncodedChunk(output, 5) +
      getEncodedChunk(output, 10) +
      getEncodedChunk(output, 15) +
      getEncodedChunk(output, 20) +
      getEncodedChunk(output, 25);
  });
}

var FingerprintGenerator = function(iterations) {
  this.iterations = iterations;
};

FingerprintGenerator.prototype = {
  createFor: function(localIdentifier, localIdentityKey,
                      remoteIdentifier, remoteIdentityKey) {
    if (typeof localIdentifier !== 'string' ||
        typeof remoteIdentifier !== 'string' ||
        !(localIdentityKey instanceof ArrayBuffer) ||
        !(remoteIdentityKey instanceof ArrayBuffer)) {

      throw new Error('Invalid arguments');
    }

    return Promise.all([
      getDisplayStringFor(localIdentifier, localIdentityKey, this.iterations),
      getDisplayStringFor(remoteIdentifier, remoteIdentityKey, this.iterations)
    ]).then(function(fingerprints) {
      return fingerprints.sort().join('');
    });
  }
};

module.exports = FingerprintGenerator;
