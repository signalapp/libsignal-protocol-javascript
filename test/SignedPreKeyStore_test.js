function testSignedPreKeyStore(store) {
    describe('SignedPreKeyStore', function() {
        var testKey;
        before(function(done) {
            Internal.crypto.createKeyPair().then(function(keyPair) {
                testKey = keyPair;
            }).then(done,done);
        });
        describe('storeSignedPreKey', function() {
            it('stores signed prekeys', function(done) {
                store.storeSignedPreKey(3, testKey).then(function() {
                    return store.loadSignedPreKey(3).then(function(key) {
                        assertEqualArrayBuffers(key.pubKey, testKey.pubKey);
                        assertEqualArrayBuffers(key.privKey, testKey.privKey);
                    });
                }).then(done,done);
            });
        });
        describe('loadSignedPreKey', function() {
            it('returns prekeys that exist', function(done) {
                store.storeSignedPreKey(1, testKey).then(function() {
                    return store.loadSignedPreKey(1).then(function(key) {
                        assertEqualArrayBuffers(key.pubKey, testKey.pubKey);
                        assertEqualArrayBuffers(key.privKey, testKey.privKey);
                    });
                }).then(done,done);
            });
            it('returns undefined for prekeys that do not exist', function(done) {
                store.storeSignedPreKey(1, testKey).then(function() {
                    return store.loadSignedPreKey(2).then(function(key) {
                        assert.isUndefined(key);
                    });
                }).then(done,done);
            });
        });
        describe('removeSignedPreKey', function() {
            it('deletes signed prekeys', function(done) {
                before(function(done) {
                    store.storeSignedPreKey(4, testKey).then(done);
                });
                store.removeSignedPreKey(4, testKey).then(function() {
                    return store.loadSignedPreKey(4).then(function(key) {
                        assert.isUndefined(key);
                    });
                }).then(done,done);
            });
        });
    });
}
