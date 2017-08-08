KeyHelper = libsignal.KeyHelper;

// const KeyHelper = require('./src/KeyHelper');

// const SignalProtocolStore = require('./InMemorySignalProtocolStore');

const store = SignalProtocolStore();

const registrationId = KeyHelper.generateRegistrationId();
// Store registrationId somehwere durable and safe.
console.log('registrationId', registrationId);

KeyHelper.generateIdentityKeyPair().then(function(identityKeyPair) {
    // keyPair -> { pubKey: ArrayBuffer, privKey: ArrayBuffer }
    // Store identityKeyPair somewhere durable and safe.
    console.log('identityKey.keyPair', identityKeyPair);
    console.log('identityKeyId', identityKeyPair.id);
    store.identityKeyPair(identityKeyPair.id)
});


KeyHelper.generatePreKey(keyId).then(function(preKey) {
    store.storePreKey(preKey.id, preKey.keyPair);
});

KeyHelper.generateSignedPreKey(identityKeyPair, keyId).then(function(signedPreKey) {
    store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);
});

console.log('STORE', store);

// SESSION

// var store   = new MySignalProtocolStore();
// var address = new libsignal.SignalProtocolAddress(recipientId, deviceId);

// // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
// //sessionBuilder (?) 
// SessionBuilder = new libsignal.SessionBuilder(store, address);

// // Process a prekey fetched from the server. Returns a promise that resolves
// // once a session is created and saved in the store, or rejects if the
// // identityKey differs from a previously seen identity for this address.
// var promise = sessionBuilder.processPreKey({
//     registrationId: Number,
//     identityKey: ArrayBuffer,
//     signedPreKey: {
//         keyId     : Number,
//         publicKey : ArrayBuffer,
//         signature : ArrayBuffer
//     },
//     preKey: {
//         keyId     : Number,
//         publicKey : ArrayBuffer
//     }
// });

// promise.then(function onsuccess() {
//   // encrypt messages
// });

// promise.catch(function onerror(error) {
//   // handle identity key conflict
// });
