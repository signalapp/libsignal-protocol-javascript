describe('SignalProtocolAddress', function() {
  var name = 'name';
  var deviceId = 42;
  var string = 'name.42';
  describe('getName', function() {
    it('returns the name', function() {
      var address = new SignalProtocolAddress(name, 1);
      assert.strictEqual(name, address.getName());
    });
  });
  describe('getDeviceId', function() {
    it('returns the deviceId', function() {
      var address = new SignalProtocolAddress(name, deviceId);
      assert.strictEqual(deviceId, address.getDeviceId());
    });
  });
  describe('toString', function() {
    it('returns the address', function() {
      var address = new SignalProtocolAddress(name, deviceId);
      assert.strictEqual(string, address.toString());
    });
  });
  describe('fromString', function() {
    it('throws on a bad inputs', function() {
      [ '', null, {} ].forEach(function(input) {
        assert.throws(function() {
          var address = libsignal.SignalProtocolAddress.fromString(input);
        });
      });
    });
    it('constructs the address', function() {
      var address = libsignal.SignalProtocolAddress.fromString(string);
      assert.strictEqual(deviceId, address.getDeviceId());
      assert.strictEqual(name, address.getName());
    });
  });
});
