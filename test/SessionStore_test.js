function testSessionStore(store) {
    describe('SessionStore', function() {
        var number = '+5558675309';
        var testRecord = 'an opaque string';
        describe('storeSession', function() {
            var address = new SignalProtocolAddress(number, 1);
            it('stores sessions encoded as strings', function(done) {
                store.storeSession(address.toString(), testRecord).then(function() {
                    return store.loadSession(address.toString()).then(function(record) {
                        assert.strictEqual(record, testRecord);
                    });
                }).then(done,done);
            });
            it('stores sessions encoded as array buffers', function(done) {
                var testRecord = new Uint8Array([1,2,3]).buffer;
                store.storeSession(address.toString(), testRecord).then(function() {
                    return store.loadSession(address.toString()).then(function(record) {
                        assertEqualArrayBuffers(testRecord, record);
                    });
                }).then(done,done);
            });
        });
        describe('loadSession', function() {
            it('returns sessions that exist', function(done) {
              var address = new SignalProtocolAddress(number, 1);
                var testRecord = 'an opaque string';
                store.storeSession(address.toString(), testRecord).then(function() {
                    return store.loadSession(address.toString()).then(function(record) {
                        assert.strictEqual(record, testRecord);
                    });
                }).then(done,done);
            });
            it('returns undefined for sessions that do not exist', function(done) {
              var address = new SignalProtocolAddress(number, 2);
                return store.loadSession(address.toString()).then(function(record) {
                    assert.isUndefined(record);
                }).then(done,done);
            });
        });
        describe('removeSession', function() {
            it('deletes sessions', function(done) {
                var address = new SignalProtocolAddress(number, 1);
                before(function(done) {
                    store.storeSession(address.toString(), testRecord).then(done);
                });
                store.removeSession(address.toString()).then(function() {
                    return store.loadSession(address.toString()).then(function(record) {
                        assert.isUndefined(record);
                    });
                }).then(done,done);
            });
        });
        describe('removeAllSessions', function() {
            it('removes all sessions for a number', function(done) {
                var devices = [1, 2, 3].map(function(deviceId) {
                    var address = new SignalProtocolAddress(number, deviceId);
                    return address.toString();
                });
                var promise = Promise.resolve();
                devices.forEach(function(encodedNumber) {
                    promise = promise.then(function() {
                        return store.storeSession(encodedNumber, testRecord + encodedNumber);
                    });
                });
                promise.then(function() {
                    return store.removeAllSessions(number).then(function(record) {
                        return Promise.all(devices.map(store.loadSession.bind(store))).then(function(records) {
                            for (var i in records) {
                                assert.isUndefined(records[i]);
                            };
                        });
                    });
                }).then(done,done);
            });
        });
    });
}
