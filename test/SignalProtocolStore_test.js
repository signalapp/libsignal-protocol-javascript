/* vim: ts=4:sw=4 */

'use strict';

var Crypto = require('../src/crypto.js');

var SignalProtocolStore = require('./InMemorySignalProtocolStore.js');


function testSignalProtocolStore (testIdentityKeyStore, testPreKeyStore, testSignedPreKeyStore, testSessionStore) {
  describe("SignalProtocolStore", function() {
    var store = new SignalProtocolStore();
    var registrationId = 1337;
    var identityKey = {
      pubKey: Crypto.crypto.getRandomBytes(33),
      privKey: Crypto.crypto.getRandomBytes(32),
    };
    before(function() {
      store.put('registrationId', registrationId);
      store.put('identityKey', identityKey);
    });
    testIdentityKeyStore(store, registrationId, identityKey);
    testPreKeyStore(store);
    testSignedPreKeyStore(store);
    testSessionStore(store);
  });
}

module.exports = testSignalProtocolStore;
