/*
 * vim: ts=4:sw=4
 */
'use strict';

var util = require('../src/helpers.js');
var TestVectors = require('./testvectors.js');
var SignalProtocolStore = require('./InMemorySignalProtocolStore.js');
var SignalProtocolAddress = require('../src/SignalProtocolAddress.js');
var SessionCipher = require('../src/SessionCipher.js');
var Crypto = require('../src/crypto.js');
var SessionRecord = require('../src/SessionRecord.js');
var SessionBuilder = require('../src/SessionBuilder.js');
var textsecure = require('./temp_helpers.js');
var protobuf = require('../build/protobufs_concat.js');

describe('SessionCipher', function() {
    describe('getRemoteRegistrationId', function() {
        var store = new SignalProtocolStore();
        var registrationId = 1337;
        var address = new SignalProtocolAddress('foo', 1);
        var sessionCipher = new SessionCipher(store, address.toString());
        describe('when a record exists', function() {
            before(function(done) {
                var record = new SessionRecord('identityKey', registrationId);
                store.storeSession(address.toString(), record.serialize()).then(done);
            });
            it('returns a valid registrationId', function(done) {
                sessionCipher.getRemoteRegistrationId().then(function(value) {
                    assert.strictEqual(value, registrationId);
                }).then(done,done);
            });
        });
        describe('when a record does not exist', function() {
            it('returns undefined', function(done) {
                var sessionCipher = new SessionCipher(store, 'bar.1');
                sessionCipher.getRemoteRegistrationId().then(function(value) {
                    assert.isUndefined(value);
                }).then(done,done);
            });
        });
    });

    describe('hasOpenSession', function() {
        var store = new SignalProtocolStore();
        var address = new SignalProtocolAddress('foo', 1);
        var sessionCipher = new SessionCipher(store, address.toString());
        describe('registrationId is valid', function() {
            before(function(done) {
                var record = new SessionRecord('identityKey', 1);
                store.storeSession(address.toString(), record.serialize()).then(done);
            });
            it('returns true for a session with a valid registrationId', function(done) {
                sessionCipher.hasOpenSession(address.toString()).then(function(value) {
                    assert.isTrue(value);
                }).then(done,done);
            });
        });
        describe('registrationId is null', function() {
            before(function(done) {
                var record = new SessionRecord('identityKey');
                store.storeSession(address.toString(), record.serialize()).then(done);
            });
            it('returns false for a session with a null registrationId', function(done) {
                sessionCipher.hasOpenSession(address.toString()).then(function(value) {
                    assert.isFalse(value);
                }).then(done,done);
            });
        });
        describe('when there is no session', function() {
            it('returns false', function(done) {
                sessionCipher.hasOpenSession('bar').then(function(value) {
                    assert.isFalse(value);
                }).then(done,done);
            });
        });
    });


    function setupReceiveStep(store, data, privKeyQueue) {
        if (data.newEphemeralKey !== undefined) {
            privKeyQueue.push(data.newEphemeralKey);
        }

        if (data.ourIdentityKey === undefined) {
            return Promise.resolve();
        }

      return Crypto.crypto.createKeyPair(data.ourIdentityKey).then(function(keyPair) {
            store.put('identityKey', keyPair);
        }).then(function() {
            return Crypto.crypto.createKeyPair(data.ourSignedPreKey);
        }).then(function(signedKeyPair) {
            store.storeSignedPreKey(data.signedPreKeyId, signedKeyPair);
        }).then(function() {
            if (data.ourPreKey !== undefined) {
                return Crypto.crypto.createKeyPair(data.ourPreKey).then(function(keyPair) {
                    store.storePreKey(data.preKeyId, keyPair);
                });
            }
        });
    }

    function getPaddedMessageLength(messageLength) {
        var messageLengthWithTerminator = messageLength + 1;
        var messagePartCount            = Math.floor(messageLengthWithTerminator / 160);

        if (messageLengthWithTerminator % 160 !== 0) {
            messagePartCount++;
        }

        return messagePartCount * 160;
    }
    function pad(plaintext) {
      var paddedPlaintext = new Uint8Array(
          getPaddedMessageLength(plaintext.byteLength + 1) - 1
      );
      paddedPlaintext.set(new Uint8Array(plaintext));
      paddedPlaintext[plaintext.byteLength] = 0x80;

      return paddedPlaintext.buffer;
    }

    function unpad(paddedPlaintext) {
        paddedPlaintext = new Uint8Array(paddedPlaintext);
        var plaintext;
        for (var i = paddedPlaintext.length - 1; i >= 0; i--) {
            if (paddedPlaintext[i] == 0x80) {
                plaintext = new Uint8Array(i);
                plaintext.set(paddedPlaintext.subarray(0, i));
                plaintext = plaintext.buffer;
                break;
            } else if (paddedPlaintext[i] !== 0x00) {
                throw new Error('Invalid padding');
            }
        }
        return plaintext;
    }

    function doReceiveStep(store, data, privKeyQueue, address) {
        return setupReceiveStep(store, data, privKeyQueue).then(function() {
            var sessionCipher = new SessionCipher(store, address);

            if (data.type == textsecure.protobuf.IncomingPushMessageSignal.Type.CIPHERTEXT) {
                return sessionCipher.decryptWhisperMessage(data.message).then(unpad);
            }
            else if (data.type == textsecure.protobuf.IncomingPushMessageSignal.Type.PREKEY_BUNDLE) {
                return sessionCipher.decryptPreKeyWhisperMessage(data.message).then(unpad);
            } else {
                throw new Error("Unknown data type in test vector");
            }

        }).then(function checkResult(plaintext) {
            var content = textsecure.protobuf.PushMessageContent.decode(plaintext);
            if (data.expectTerminateSession) {
                if (content.flags == textsecure.protobuf.PushMessageContent.Flags.END_SESSION) {
                    return true;
                } else {
                    return false;
                }
            }
            return content.body == data.expectedSmsText;
        }).catch(function checkException(e) {
            if (data.expectException) {
                return true;
            }
            throw e;
        });
    }

    function setupSendStep(store, data, privKeyQueue) {
        if (data.registrationId !== undefined) {
            store.put('registrationId', data.registrationId);
        }
        if (data.ourBaseKey !== undefined) {
            privKeyQueue.push(data.ourBaseKey);
        }
        if (data.ourEphemeralKey !== undefined) {
            privKeyQueue.push(data.ourEphemeralKey);
        }

        if (data.ourIdentityKey !== undefined) {
            return Crypto.crypto.createKeyPair(data.ourIdentityKey).then(function(keyPair) {
                store.put('identityKey', keyPair);
            });
        }
        return Promise.resolve();
    }

    function doSendStep(store, data, privKeyQueue, address) {
        return setupSendStep(store, data, privKeyQueue).then(function() {
            if (data.getKeys !== undefined) {
                var deviceObject = {
                    encodedNumber  : address.toString(),
                    identityKey    : data.getKeys.identityKey,
                    preKey         : data.getKeys.devices[0].preKey,
                    signedPreKey   : data.getKeys.devices[0].signedPreKey,
                    registrationId : data.getKeys.devices[0].registrationId
                };

                var builder = new SessionBuilder(store, address);

                return builder.processPreKey(deviceObject);
            }
        }).then(function() {

            var proto = new textsecure.protobuf.PushMessageContent();
            if (data.endSession) {
                proto.flags = textsecure.protobuf.PushMessageContent.Flags.END_SESSION;
            } else {
                proto.body = data.smsText;
            }

            var sessionCipher = new SessionCipher(store, address);
            return sessionCipher.encrypt(pad(proto.toArrayBuffer())).then(function(msg) {
                //XXX: This should be all we do: isEqual(data.expectedCiphertext, encryptedMsg, false);
                if (msg.type == 1) {
                    return util.isEqual(data.expectedCiphertext, msg.body);
                } else {
                    if (new Uint8Array(data.expectedCiphertext)[0] !== msg.body.charCodeAt(0)) {
                        throw new Error("Bad version byte");
                    }

                    var expected = protobuf.PreKeyWhisperMessage.decode(
                        data.expectedCiphertext.slice(1)
                    ).encode();

                    if (!util.isEqual(expected, msg.body.substring(1))) {
                        throw new Error("Result does not match expected ciphertext");
                    }

                    return true;
                }
            }).then(function(res) {
                if (data.endSession) {
                    return sessionCipher.closeOpenSessionForDevice().then(function() {
                        return res;
                    });
                }
                return res;
            });
        });
    }

    function getDescription(step) {
        var direction = step[0];
        var data = step[1];
        if (direction === "receiveMessage") {
            if (data.expectTerminateSession) {
                return 'receive end session message';
            } else if (data.type === 3) {
                return 'receive prekey message ' + data.expectedSmsText;
            } else {
                return 'receive message ' + data.expectedSmsText;
            }
        } else if (direction === "sendMessage") {
            if (data.endSession) {
                return 'send end session message';
            } else if (data.ourIdentityKey) {
                return 'send prekey message ' + data.smsText;
            } else {
                return 'send message ' + data.smsText;
            }
        }
    }

    TestVectors.forEach(function(test) {
        describe(test.name, function(done) {
            this.timeout(20000);

            var privKeyQueue = [];
            var origCreateKeyPair = Crypto.crypto.createKeyPair;

            before(function() {
                // Shim createKeyPair to return predetermined keys from
                // privKeyQueue instead of random keys.
                Crypto.crypto.createKeyPair = function(privKey) {
                    if (privKey !== undefined) {
                        return origCreateKeyPair(privKey);
                    }
                    if (privKeyQueue.length == 0) {
                        throw new Error('Out of private keys');
                    } else {
                        var privKey = privKeyQueue.shift();
                        return Crypto.crypto.createKeyPair(privKey).then(function(keyPair) {
                            var a = btoa(util.toString(keyPair.privKey));
                            var b = btoa(util.toString(privKey));
                            if (util.toString(keyPair.privKey) != util.toString(privKey))
                                throw new Error('Failed to rederive private key!');
                            else
                                return keyPair;
                        });
                    }
                }
            });

            after(function() {
                Crypto.crypto.createKeyPair = origCreateKeyPair;
                if (privKeyQueue.length != 0) {
                    throw new Error('Leftover private keys');
                }
            });

            function describeStep(step) {
                var direction = step[0];
                var data = step[1];
                if (direction === "receiveMessage") {
                    if (data.expectTerminateSession) {
                        return 'receive end session message';
                    } else if (data.type === 3) {
                        return 'receive prekey message ' + data.expectedSmsText;
                    } else {
                        return 'receive message ' + data.expectedSmsText;
                    }
                } else if (direction === "sendMessage") {
                    if (data.endSession) {
                        return 'send end session message';
                    } else if (data.ourIdentityKey) {
                        return 'send prekey message ' + data.smsText;
                    } else {
                        return 'send message ' + data.smsText;
                    }
                }
            }

            var store = new SignalProtocolStore();
            var address = SignalProtocolAddress.fromString("SNOWDEN.1");
            test.vectors.forEach(function(step) {
                it(getDescription(step), function(done) {
                    var doStep;

                    if (step[0] === "receiveMessage") {
                        doStep = doReceiveStep;
                    } else if (step[0] === "sendMessage") {
                        doStep = doSendStep;
                    } else {
                        throw new Error('Invalid test');
                    }

                    doStep(store, step[1], privKeyQueue, address)
                        .then(assert).then(done, done);
                });
            });
        });
    });
});
