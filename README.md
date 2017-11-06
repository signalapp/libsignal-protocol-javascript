# libsignal-protocol-javascript

[![Build Status](https://travis-ci.org/WhisperSystems/libsignal-protocol-javascript.svg?branch=master)](https://travis-ci.org/WhisperSystems/libsignal-protocol-javascript)


Signal Protocol implementation for the browser based on
[libsignal-protocol-java](https://github.com/WhisperSystems/libsignal-protocol-java).

```
/dist       # Distributables
/build      # Intermediate build files
/src        # JS source files
/native     # C source files for curve25519
/protos     # Protobuf definitions
/test       # Tests
```

## Overview
A ratcheting forward secrecy protocol that works in synchronous and
asynchronous messaging environments.

### PreKeys

This protocol uses a concept called 'PreKeys'. A PreKey is an ECPublicKey and
an associated unique ID which are stored together by a server. PreKeys can also
be signed.

At install time, clients generate a single signed PreKey, as well as a large
list of unsigned PreKeys, and transmit all of them to the server.

### Sessions

Signal Protocol is session-oriented. Clients establish a "session," which is
then used for all subsequent encrypt/decrypt operations. There is no need to
ever tear down a session once one has been established.

Sessions are established in one of two ways:

1. PreKeyBundles. A client that wishes to send a message to a recipient can
   establish a session by retrieving a PreKeyBundle for that recipient from the
   server.
1. PreKeySignalMessages. A client can receive a PreKeySignalMessage from a
   recipient and use it to establish a session.

### State

An established session encapsulates a lot of state between two clients. That
state is maintained in durable records which need to be kept for the life of
the session.

State is kept in the following places:

* Identity State. Clients will need to maintain the state of their own identity
  key pair, as well as identity keys received from other clients.
* PreKey State. Clients will need to maintain the state of their generated
  PreKeys.
* Signed PreKey States. Clients will need to maintain the state of their signed
  PreKeys.
* Session State. Clients will need to maintain the state of the sessions they
  have established.

## Requirements

This implementation currently depends on the presence of the following
types/interfaces, which are available in most modern browsers.

* [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
* [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [WebCrypto](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) with support for:
  - AES-CBC
  - HMAC SHA-256

## Usage

Include `dist/libsignal-protocol.js` in your webpage.

### Install time

At install time, a libsignal client needs to generate its identity keys,
registration id, and prekeys.

```js
var KeyHelper = libsignal.KeyHelper;

var registrationId = KeyHelper.generateRegistrationId();
// Store registrationId somewhere durable and safe.

KeyHelper.generateIdentityKeyPair().then(function(identityKeyPair) {
    // keyPair -> { pubKey: ArrayBuffer, privKey: ArrayBuffer }
    // Store identityKeyPair somewhere durable and safe.
});

KeyHelper.generatePreKey(keyId).then(function(preKey) {
    store.storePreKey(preKey.keyId, preKey.keyPair);
});

KeyHelper.generateSignedPreKey(identityKeyPair, keyId).then(function(signedPreKey) {
    store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);
});

// Register preKeys and signedPreKey with the server
```

### Building a session

A libsignal client needs to implement a storage interface that will manage
loading and storing of identity, prekeys, signed prekeys, and session state.
See `test/InMemorySignalProtocolStore.js` for an example.

Once this is implemented, building a session is fairly straightforward:

```js
var store   = new MySignalProtocolStore();
var address = new libsignal.SignalProtocolAddress(recipientId, deviceId);

// Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
SessionBuilder sessionBuilder = new libsignal.SessionBuilder(store, address);

// Process a prekey fetched from the server. Returns a promise that resolves
// once a session is created and saved in the store, or rejects if the
// identityKey differs from a previously seen identity for this address.
var promise = sessionBuilder.processPreKey({
    registrationId: <Number>,
    identityKey: <ArrayBuffer>,
    signedPreKey: {
        keyId     : <Number>,
        publicKey : <ArrayBuffer>,
        signature : <ArrayBuffer>
    },
    preKey: {
        keyId     : <Number>,
        publicKey : <ArrayBuffer>
    }
});

promise.then(function onsuccess() {
  // encrypt messages
});

promise.catch(function onerror(error) {
  // handle identity key conflict
});
```

### Encrypting

Once you have a session established with an address, you can encrypt messages
using SessionCipher.

```js
var plaintext = "Hello world";
var sessionCipher = new libsignal.SessionCipher(store, address);
sessionCipher.encrypt(plaintext).then(function(ciphertext) {
    // ciphertext -> { type: <Number>, body: <string> }
    handle(ciphertext.type, ciphertext.body);
});
```

### Decrypting

Ciphertexts come in two flavors: WhisperMessage and PreKeyWhisperMessage.

```js
var address = new SignalProtocolAddress(recipientId, deviceId);
var sessionCipher = new SessionCipher(store, address);

// Decrypt a PreKeyWhisperMessage by first establishing a new session.
// Returns a promise that resolves when the message is decrypted or
// rejects if the identityKey differs from a previously seen identity for this
// address.
sessionCipher.decryptPreKeyWhisperMessage(ciphertext).then(function(plaintext) {
    // handle plaintext ArrayBuffer
}).catch(function(error) {
    // handle identity key conflict
});

// Decrypt a normal message using an existing session
var sessionCipher = new SessionCipher(store, address);
sessionCipher.decryptWhisperMessage(ciphertext).then(function(plaintext) {
    // handle plaintext ArrayBuffer
});
```

## Building

To compile curve25519 from C souce files in `/native`, install
[emscripten](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html).

```
grunt compile
```

## License

Copyright 2015-2016 Open Whisper Systems

Licensed under the GPLv3: http://www.gnu.org/licenses/gpl-3.0.html
