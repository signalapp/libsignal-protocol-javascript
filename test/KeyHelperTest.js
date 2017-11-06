var KeyHelper = require('../src/KeyHelper.js');

describe('KeyHelper', function() {
    function validateKeyPair(keyPair) {
        assert.isDefined(keyPair.pubKey);
        assert.isDefined(keyPair.privKey);
        assert.strictEqual(keyPair.privKey.byteLength, 32);
        assert.strictEqual(keyPair.pubKey.byteLength, 33);
        assert.strictEqual(new Uint8Array(keyPair.pubKey)[0], 5);
    }

    describe('generateIdentityKeyPair', function() {
        it ('works', function() {
            KeyHelper.generateIdentityKeyPair().then(function(keyPair) {
                validateKeyPair(keyPair);
            });
        });
    });

    describe('generateRegistrationId', function() {
        it('generates a 14-bit integer', function() {
            var registrationId = KeyHelper.generateRegistrationId();
            assert.isNumber(registrationId);
            assert(registrationId >= 0);
            assert(registrationId < 16384);
            assert.strictEqual(registrationId, Math.round(registrationId)); // integer
        });
    });

    describe("generatePreKey", function() {
        it('generates a preKey', function(done) {
            KeyHelper.generatePreKey(1337).then(function(result) {
                validateKeyPair(result.keyPair);
                assert.strictEqual(result.keyId, 1337);
            }).then(done, done);
        });
        it('throws on bad keyId', function() {
            assert.throws(function(done) {
                KeyHelper.generatePreKey('bad');
            }, TypeError);
        });
    });

    describe("generateSignedPreKey", function() {
        it('generates a preKey', function(done) {
            KeyHelper.generateIdentityKeyPair().then(function(identityKey) {
                KeyHelper.generateSignedPreKey(identityKey, 1337).then(function(result) {
                    validateKeyPair(result.keyPair);
                    assert.strictEqual(result.keyId, 1337);
                    //todo: validate result.signature
                });
            }).then(done, done);
        });
        it('throws on bad keyId', function() {
            assert.throws(function(done) {
                KeyHelper.generateSignedPreKey('bad');
            }, TypeError);
        });
    });
});
