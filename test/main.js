/* vim: ts=4:sw=4 */
mocha.setup("bdd");
window.assert = chai.assert;

require('./helpers_test.js');
require('./crypto_test.js');
require('./SessionCipherTest.js');
require('./KeyHelperTest.js');
require('./NumericFingerprintTest.js');
require('./SessionBuilderTest.js');
var testIdentityKeyStore = require('./IdentityKeyStore_test.js');
var testPreKeyStore = require('./PreKeyStore_test.js');
var testSignedPreKeyStore = require('./SignedPreKeyStore_test.js');
var testSessionStore = require('./SessionStore_test.js');
require('./SignalProtocolStore_test.js')(
  testIdentityKeyStore,
  testPreKeyStore,
  testSignedPreKeyStore,
  testSessionStore
);
require('./SignalProtocolAddressTest.js');
require('./IntegrationTest.js');
