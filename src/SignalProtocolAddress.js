function SignalProtocolAddress(name, deviceId) {
  this.name = name;
  this.deviceId = deviceId;
}

SignalProtocolAddress.prototype = {
  getName: function() {
    return this.name;
  },
  getDeviceId: function() {
    return this.deviceId;
  },
  toString: function() {
    return this.name + '.' + this.deviceId;
  },
  equals: function(other) {
    if (!(other instanceof SignalProtocolAddress)) { return false; }
    return other.name === this.name && other.deviceId === this.deviceId;
  }
};

var mySignalProtocolAddress = function(name, deviceId) {
  var address = new SignalProtocolAddress(name, deviceId);

  ['getName', 'getDeviceId', 'toString', 'equals'].forEach(function(method) {
    this[method] = address[method].bind(address);
  }.bind(this));
};

mySignalProtocolAddress.fromString = function(encodedAddress) {
  if (typeof encodedAddress !== 'string' || !encodedAddress.match(/.*\.\d+/)) {
    throw new Error('Invalid SignalProtocolAddress string');
  }
  var parts = encodedAddress.split('.');
  return new mySignalProtocolAddress(parts[0], parseInt(parts[1]));
};

module.exports = mySignalProtocolAddress;
