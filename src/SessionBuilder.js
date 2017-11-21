function SessionBuilder(storage, remoteAddress) {
  this.remoteAddress = remoteAddress;
  this.storage = storage;
}

SessionBuilder.prototype = {
  processPreKey: function(device) {
    return Internal.SessionLock.queueJobForNumber(this.remoteAddress.toString(), function() {
      return this.storage.isTrustedIdentity(
          this.remoteAddress.getName(), device.identityKey, this.storage.Direction.SENDING
      ).then(function(trusted) {
        if (!trusted) {
          throw new Error('Identity key changed');
        }

        return Internal.crypto.Ed25519Verify(
          device.identityKey,
          device.signedPreKey.publicKey,
          device.signedPreKey.signature
        );
      }).then(function() {
        return Internal.crypto.createKeyPair();
      }).then(function(baseKey) {
        var devicePreKey;
        if (device.preKey) {
            devicePreKey = device.preKey.publicKey;
        }
        return this.initSession(true, baseKey, undefined, device.identityKey,
          devicePreKey, device.signedPreKey.publicKey, device.registrationId
        ).then(function(session) {
            session.pendingPreKey = {
                signedKeyId : device.signedPreKey.keyId,
                baseKey     : baseKey.pubKey
            };
            if (device.preKey) {
              session.pendingPreKey.preKeyId = device.preKey.keyId;
            }
            return session;
        });
      }.bind(this)).then(function(session) {
        var address = this.remoteAddress.toString();
        return this.storage.loadSession(address).then(function(serialized) {
          var record;
          if (serialized !== undefined) {
            record = Internal.SessionRecord.deserialize(serialized);
          } else {
            record = new Internal.SessionRecord();
          }

          record.archiveCurrentState();
          record.updateSessionState(session);
          return Promise.all([
            this.storage.storeSession(address, record.serialize()),
            this.storage.saveIdentity(this.remoteAddress.toString(), session.indexInfo.remoteIdentityKey)
          ]);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },
  processV3: function(record, message) {
    var preKeyPair, signedPreKeyPair, session;
    return this.storage.isTrustedIdentity(
        this.remoteAddress.getName(), message.identityKey.toArrayBuffer(), this.storage.Direction.RECEIVING
    ).then(function(trusted) {
        if (!trusted) {
            var e = new Error('Unknown identity key');
            e.identityKey = message.identityKey.toArrayBuffer();
            throw e;
        }
        return Promise.all([
            this.storage.loadPreKey(message.preKeyId),
            this.storage.loadSignedPreKey(message.signedPreKeyId),
        ]).then(function(results) {
            preKeyPair       = results[0];
            signedPreKeyPair = results[1];
        });
    }.bind(this)).then(function() {
        session = record.getSessionByBaseKey(message.baseKey);
        if (session) {
          console.log("Duplicate PreKeyMessage for session");
          return;
        }

        session = record.getOpenSession();

        if (signedPreKeyPair === undefined) {
            // Session may or may not be the right one, but if its not, we
            // can't do anything about it ...fall through and let
            // decryptWhisperMessage handle that case
            if (session !== undefined && session.currentRatchet !== undefined) {
                return;
            } else {
                throw new Error("Missing Signed PreKey for PreKeyWhisperMessage");
            }
        }

        if (session !== undefined) {
            record.archiveCurrentState();
        }
        if (message.preKeyId && !preKeyPair) {
            console.log('Invalid prekey id', message.preKeyId);
        }
        return this.initSession(false, preKeyPair, signedPreKeyPair,
            message.identityKey.toArrayBuffer(),
            message.baseKey.toArrayBuffer(), undefined, message.registrationId
        ).then(function(new_session) {
            // Note that the session is not actually saved until the very
            // end of decryptWhisperMessage ... to ensure that the sender
            // actually holds the private keys for all reported pubkeys
            record.updateSessionState(new_session);
            return this.storage.saveIdentity(this.remoteAddress.toString(), message.identityKey.toArrayBuffer()).then(function() {
              return message.preKeyId;
            });
        }.bind(this));
    }.bind(this));
  },
  initSession: function(isInitiator, ourEphemeralKey, ourSignedKey,
                   theirIdentityPubKey, theirEphemeralPubKey,
                   theirSignedPubKey, registrationId) {
    return this.storage.getIdentityKeyPair().then(function(ourIdentityKey) {
        if (isInitiator) {
            if (ourSignedKey !== undefined) {
                throw new Error("Invalid call to initSession");
            }
            ourSignedKey = ourEphemeralKey;
        } else {
            if (theirSignedPubKey !== undefined) {
                throw new Error("Invalid call to initSession");
            }
            theirSignedPubKey = theirEphemeralPubKey;
        }

        var sharedSecret;
        if (ourEphemeralKey === undefined || theirEphemeralPubKey === undefined) {
            sharedSecret = new Uint8Array(32 * 4);
        } else {
            sharedSecret = new Uint8Array(32 * 5);
        }

        for (var i = 0; i < 32; i++) {
            sharedSecret[i] = 0xff;
        }

        return Promise.all([
            Internal.crypto.ECDHE(theirSignedPubKey, ourIdentityKey.privKey),
            Internal.crypto.ECDHE(theirIdentityPubKey, ourSignedKey.privKey),
            Internal.crypto.ECDHE(theirSignedPubKey, ourSignedKey.privKey)
        ]).then(function(ecRes) {
            if (isInitiator) {
                sharedSecret.set(new Uint8Array(ecRes[0]), 32);
                sharedSecret.set(new Uint8Array(ecRes[1]), 32 * 2);
            } else {
                sharedSecret.set(new Uint8Array(ecRes[0]), 32 * 2);
                sharedSecret.set(new Uint8Array(ecRes[1]), 32);
            }
            sharedSecret.set(new Uint8Array(ecRes[2]), 32 * 3);

            if (ourEphemeralKey !== undefined && theirEphemeralPubKey !== undefined) {
                return Internal.crypto.ECDHE(
                    theirEphemeralPubKey, ourEphemeralKey.privKey
                ).then(function(ecRes4) {
                    sharedSecret.set(new Uint8Array(ecRes4), 32 * 4);
                });
            }
        }).then(function() {
            return Internal.HKDF(sharedSecret.buffer, new ArrayBuffer(32), "WhisperText");
        }).then(function(masterKey) {
            var session = {
                registrationId: registrationId,
                currentRatchet: {
                    rootKey                : masterKey[0],
                    lastRemoteEphemeralKey : theirSignedPubKey,
                    previousCounter        : 0
                },
                indexInfo: {
                    remoteIdentityKey : theirIdentityPubKey,
                    closed            : -1
                },
                oldRatchetList: []
            };

            // If we're initiating we go ahead and set our first sending ephemeral key now,
            // otherwise we figure it out when we first maybeStepRatchet with the remote's ephemeral key
            if (isInitiator) {
                session.indexInfo.baseKey = ourEphemeralKey.pubKey;
                session.indexInfo.baseKeyType = Internal.BaseKeyType.OURS;
                return Internal.crypto.createKeyPair().then(function(ourSendingEphemeralKey) {
                    session.currentRatchet.ephemeralKeyPair = ourSendingEphemeralKey;
                    return this.calculateSendingRatchet(session, theirSignedPubKey).then(function() {
                        return session;
                    });
                }.bind(this));
            } else {
                session.indexInfo.baseKey = theirEphemeralPubKey;
                session.indexInfo.baseKeyType = Internal.BaseKeyType.THEIRS;
                session.currentRatchet.ephemeralKeyPair = ourSignedKey;
                return session;
            }
        }.bind(this));
    }.bind(this));
  },
  calculateSendingRatchet: function(session, remoteKey) {
      var ratchet = session.currentRatchet;

      return Internal.crypto.ECDHE(
          remoteKey, util.toArrayBuffer(ratchet.ephemeralKeyPair.privKey)
      ).then(function(sharedSecret) {
          return Internal.HKDF(
              sharedSecret, util.toArrayBuffer(ratchet.rootKey), "WhisperRatchet"
          );
      }).then(function(masterKey) {
          session[util.toString(ratchet.ephemeralKeyPair.pubKey)] = {
              messageKeys : {},
              chainKey    : { counter : -1, key : masterKey[1] },
              chainType   : Internal.ChainType.SENDING
          };
          ratchet.rootKey = masterKey[0];
      });
  }

};

libsignal.SessionBuilder = function (storage, remoteAddress) {
  var builder = new SessionBuilder(storage, remoteAddress);
  this.processPreKey = builder.processPreKey.bind(builder);
  this.processV3 = builder.processV3.bind(builder);
};
