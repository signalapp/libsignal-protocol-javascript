/* vim: ts=4:sw=4 */

'use strict';

describe("SignalProtocolStore", function() {
    var store = new SignalProtocolStore();
    var registrationId = 1337;
    var identityKey = {
        pubKey: Internal.crypto.getRandomBytes(33),
        privKey: Internal.crypto.getRandomBytes(32),
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
