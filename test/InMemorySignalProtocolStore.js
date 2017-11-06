var util = require('../src/helpers.js');

function SignalProtocolStore() {
	this.store = {};
}

SignalProtocolStore.prototype = {
	getIdentityKeyPair: function() {
		return Promise.resolve(this.get('identityKey'));
	},
	getLocalRegistrationId: function() {
		return Promise.resolve(this.get('registrationId'));
	},
	put: function(key, value) {
		if (key === undefined || value === undefined || key === null || value === null)
			throw new Error("Tried to store undefined/null");
		this.store[key] = value;
	},
	get: function(key, defaultValue) {
		if (key === null || key === undefined)
			throw new Error("Tried to get value for undefined/null key");
		if (key in this.store) {
			return this.store[key];
		} else {
			return defaultValue;
		}
	},
	remove: function(key) {
		if (key === null || key === undefined)
			throw new Error("Tried to remove value for undefined/null key");
		delete this.store[key];
	},

	isTrustedIdentity: function(identifier, identityKey) {
		if (identifier === null || identifier === undefined) {
			throw new Error("tried to check identity key for undefined/null key");
    }
		if (!(identityKey instanceof ArrayBuffer)) {
			throw new Error("Expected identityKey to be an ArrayBuffer");
    }
		var trusted = this.get('identityKey' + identifier);
    if (trusted === undefined) {
      return Promise.resolve(true);
    }
    return Promise.resolve(util.toString(identityKey) === util.toString(trusted));
	},
	loadIdentityKey: function(identifier) {
		if (identifier === null || identifier === undefined)
			throw new Error("Tried to get identity key for undefined/null key");
		return Promise.resolve(this.get('identityKey' + identifier));
	},
	saveIdentity: function(identifier, identityKey) {
		if (identifier === null || identifier === undefined)
			throw new Error("Tried to put identity key for undefined/null key");
		return Promise.resolve(this.put('identityKey' + identifier, identityKey));
	},

	/* Returns a prekeypair object or undefined */
	loadPreKey: function(keyId) {
    var res = this.get('25519KeypreKey' + keyId);
    if (res !== undefined) {
      res = { pubKey: res.pubKey, privKey: res.privKey };
    }
    return Promise.resolve(res);
	},
	storePreKey: function(keyId, keyPair) {
		return Promise.resolve(this.put('25519KeypreKey' + keyId, keyPair));
	},
	removePreKey: function(keyId) {
		return Promise.resolve(this.remove('25519KeypreKey' + keyId));
	},

	/* Returns a signed keypair object or undefined */
	loadSignedPreKey: function(keyId) {
    var res = this.get('25519KeysignedKey' + keyId);
    if (res !== undefined) {
      res = { pubKey: res.pubKey, privKey: res.privKey };
    }
    return Promise.resolve(res);
	},
	storeSignedPreKey: function(keyId, keyPair) {
		return Promise.resolve(this.put('25519KeysignedKey' + keyId, keyPair));
	},
	removeSignedPreKey: function(keyId) {
		return Promise.resolve(this.remove('25519KeysignedKey' + keyId));
	},

	loadSession: function(identifier) {
		return Promise.resolve(this.get('session' + identifier));
	},
	storeSession: function(identifier, record) {
		return Promise.resolve(this.put('session' + identifier, record));
	},
  removeSession: function(identifier) {
		return Promise.resolve(this.remove('session' + identifier));
  },
  removeAllSessions: function(identifier) {
    for (var id in this.store) {
      if (id.startsWith('session' + identifier)) {
        delete this.store[id];
      }
    }
    return Promise.resolve();
  }
};

module.exports = SignalProtocolStore;
