let signal = require('..');

describe('Integration test', function() {
  it('imports all methods', function(done) {
    assert.isDefined(signal);
    assert.isDefined(signal.KeyHelper);
    assert.isDefined(signal.SignalProtocolAddress);
    assert.isDefined(signal.SessionBuilder);
    assert.isDefined(signal.SessionCipher);
    assert.isDefined(signal.FingerprintGenerator);
    assert.isDefined(signal._crypto);
    assert.isDefined(signal._curve);
    done();
  });

  it('can play out install-time key stuff', function (done) {
    var KeyHelper = signal.KeyHelper;
    var registrationId = KeyHelper.generateRegistrationId();
    var keyId = 1337;
    var ikp = null; // ref for later
    assert.isDefined(registrationId);
    KeyHelper.generateIdentityKeyPair().then(function(identityKeyPair) {
      assert.isDefined(identityKeyPair.pubKey);
      assert.isDefined(identityKeyPair.privKey);
      ikp = identityKeyPair;
    }).then(function () {
      return KeyHelper.generatePreKey(keyId);
    }).then(function(preKey) {
      assert.isDefined(preKey.keyId);
      assert.isDefined(preKey.keyPair);
    }).then(function () {
      return KeyHelper.generateSignedPreKey(ikp, keyId);
    }).then(function(signedPreKey) {
        assert.isDefined(signedPreKey.keyId);
        assert.isDefined(signedPreKey.keyPair);
    }).then(done, done);
  });

  function generateIdentity(store) {
    return Promise.all([
      signal.KeyHelper.generateIdentityKeyPair(),
      signal.KeyHelper.generateRegistrationId(),
    ]).then(function(result) {
      store.put('identityKey', result[0]);
      store.put('registrationId', result[1]);
    });
  }

  function generatePreKeyBundle(store, preKeyId, signedPreKeyId) {
    return Promise.all([
      store.getIdentityKeyPair(),
      store.getLocalRegistrationId()
    ]).then(function(result) {
      var identity = result[0];
      var registrationId = result[1];

      return Promise.all([
        signal.KeyHelper.generatePreKey(preKeyId),
        signal.KeyHelper.generateSignedPreKey(identity, signedPreKeyId),
      ]).then(function(keys) {
        var preKey = keys[0];
        var signedPreKey = keys[1];

        store.storePreKey(preKeyId, preKey.keyPair);
        store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);

        return {
          identityKey: identity.pubKey,
          registrationId : registrationId,
          preKey:  {
            keyId     : preKeyId,
            publicKey : preKey.keyPair.pubKey
          },
          signedPreKey: {
            keyId     : signedPreKeyId,
            publicKey : signedPreKey.keyPair.pubKey,
            signature : signedPreKey.signature
          }
        };
      });
    });
  }

  it('can play out session building stuff + encrypt', function (done) {
    var name = 'name';
    var deviceId = 42;
    var MySignalProtocolStore = require('./InMemorySignalProtocolStore.js');
    var store = new MySignalProtocolStore();
    var address = new signal.SignalProtocolAddress(name, deviceId);
    var sessionBuilder = new signal.SessionBuilder(store, address);

    generateIdentity(store)
      .then(function () {
        return generatePreKeyBundle(store, 1337, 1);
      }).then(function (bundle) {
        return sessionBuilder.processPreKey(bundle);
      }).then(function () {
        var plaintext = "Hello world";
        var sessionCipher = new signal.SessionCipher(store, address);
        sessionCipher.encrypt(plaintext).then(function(ciphertext) {
          assert.isDefined(ciphertext.type);
          assert.isDefined(ciphertext.body);
          done();
        });
      }).catch(function (err) {
        assert.isUndefined(err);
      });
  });
});
