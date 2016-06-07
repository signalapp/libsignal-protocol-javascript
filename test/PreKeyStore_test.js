function testPreKeyStore(store) {
    var number = '+5558675309';
    var testKey;
    describe('PreKeyStore', function() {
        before(function(done) {
            Internal.crypto.createKeyPair().then(function(keyPair) {
                testKey = keyPair;
            }).then(done,done);
        });
        describe('storePreKey', function() {
            it('stores prekeys', function(done) {
                var address = new SignalProtocolAddress(number, 1);
                store.storePreKey(address.toString(), testKey).then(function() {
                    return store.loadPreKey(address.toString()).then(function(key) {
                        assertEqualArrayBuffers(key.pubKey, testKey.pubKey);
                        assertEqualArrayBuffers(key.privKey, testKey.privKey);
                    });
                }).then(done,done);
            });
        });
        describe('loadPreKey', function() {
            it('returns prekeys that exist', function(done) {
                var address = new SignalProtocolAddress(number, 1);
                store.storePreKey(address.toString(), testKey).then(function() {
                    return store.loadPreKey(address.toString()).then(function(key) {
                        assertEqualArrayBuffers(key.pubKey, testKey.pubKey);
                        assertEqualArrayBuffers(key.privKey, testKey.privKey);
                    });
                }).then(done,done);
            });
            it('returns undefined for prekeys that do not exist', function(done) {
                var address = new SignalProtocolAddress(number, 2);
                return store.loadPreKey(2).then(function(key) {
                    assert.isUndefined(key);
                }).then(done,done);
            });
        });
        describe('removePreKey', function() {
            it('deletes prekeys', function(done) {
                var address = new SignalProtocolAddress(number, 2);
                before(function(done) {
                    store.storePreKey(address.toString(), testKey).then(done);
                });
                store.removePreKey(address.toString()).then(function() {
                    return store.loadPreKey(address.toString()).then(function(key) {
                        assert.isUndefined(key);
                    });
                }).then(done,done);
            });
        });
    });
}
