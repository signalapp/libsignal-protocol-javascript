/*
 * vim: ts=4:sw=4
 */

var Internal = Internal || {};

Internal.BaseKeyType = {
  OURS: 1,
  THEIRS: 2
};
Internal.ChainType = {
  SENDING: 1,
  RECEIVING: 2
};

var ARCHIVED_STATES_MAX_LENGTH = 40;

Internal.SessionRecord = function() {
    'use strict';
    var MESSAGE_LOST_THRESHOLD_MS = 1000*60*60*24*7;

    var StaticByteBufferProto = new dcodeIO.ByteBuffer().__proto__;
    var StaticArrayBufferProto = new ArrayBuffer().__proto__;
    var StaticUint8ArrayProto = new Uint8Array().__proto__;

    function isStringable(thing) {
        return (thing === Object(thing) &&
                (thing.__proto__ == StaticArrayBufferProto ||
                    thing.__proto__ == StaticUint8ArrayProto ||
                    thing.__proto__ == StaticByteBufferProto));
    }
    function ensureStringed(thing) {
        if (typeof thing == "string" || typeof thing == "number" || typeof thing == "boolean") {
            return thing;
        } else if (isStringable(thing)) {
            return util.toString(thing);
        } else if (thing instanceof Array) {
            var array = [];
            for (var i = 0; i < thing.length; i++) {
                array[i] = ensureStringed(thing[i]);
            }
            return array;
        } else if (thing === Object(thing)) {
            var obj = {};
            for (var key in thing) {
                obj[key] = ensureStringed(thing[key]);
            }
            return obj;
        } else if (thing === null) {
            return null;
        } else {
            throw new Error("unsure of how to jsonify object of type " + typeof thing);
        }
    }

    function jsonThing(thing) {
        return JSON.stringify(ensureStringed(thing)); //TODO: jquery???
    }

    var SessionRecord = function(identityKey, registrationId) {
        this._sessions = {};
        identityKey = util.toString(identityKey);
        if (typeof identityKey !== 'string') {
            throw new Error('SessionRecord: Invalid identityKey');
        }
        this.identityKey = identityKey;
        this.registrationId = registrationId;

        if (this.registrationId === undefined || typeof this.registrationId !== 'number') {
            this.registrationId = null;
        }
    };

    SessionRecord.deserialize = function(serialized) {
        var data = JSON.parse(serialized);
        var record = new SessionRecord(data.identityKey, data.registrationId);
        record._sessions = data.sessions;
        if (record._sessions === undefined || record._sessions === null || typeof record._sessions !== "object" || Array.isArray(record._sessions)) {
            throw new Error("Error deserializing SessionRecord");
        }
        if (record.identityKey === undefined || record.registrationId === undefined) {
            throw new Error("Error deserializing SessionRecord");
        }
        return record;
    };

    SessionRecord.prototype = {
        serialize: function() {
            return jsonThing({
                sessions       : this._sessions,
                registrationId : this.registrationId,
                identityKey    : this.identityKey
            });
        },
        haveOpenSession: function() {
            return this.registrationId !== null;
        },

        getSessionByBaseKey: function(baseKey) {
            var session = this._sessions[util.toString(baseKey)];
            if (session && session.indexInfo.baseKeyType === Internal.BaseKeyType.OURS) {
                console.log("Tried to lookup a session using our basekey");
                return undefined;
            }
            return session;
        },
        getSessionByRemoteEphemeralKey: function(remoteEphemeralKey) {
            this.detectDuplicateOpenSessions();
            var sessions = this._sessions;

            var searchKey = util.toString(remoteEphemeralKey);

            var openSession;
            for (var key in sessions) {
                if (sessions[key].indexInfo.closed == -1) {
                    openSession = sessions[key];
                }
                if (sessions[key][searchKey] !== undefined) {
                    return sessions[key];
                }
            }
            if (openSession !== undefined) {
                return openSession;
            }

            return undefined;
        },
        getOpenSession: function() {
            var sessions = this._sessions;
            if (sessions === undefined) {
                return undefined;
            }

            this.detectDuplicateOpenSessions();

            for (var key in sessions) {
                if (sessions[key].indexInfo.closed == -1) {
                    return sessions[key];
                }
            }
            return undefined;
        },
        detectDuplicateOpenSessions: function() {
            var openSession;
            var sessions = this._sessions;
            for (var key in sessions) {
                if (sessions[key].indexInfo.closed == -1) {
                    if (openSession !== undefined) {
                        throw new Error("Datastore inconsistensy: multiple open sessions");
                    }
                    openSession = sessions[key];
                }
            }
        },
        updateSessionState: function(session, registrationId) {
            var sessions = this._sessions;

            this.removeOldChains(session);

            if (this.identityKey === null) {
                this.identityKey = session.indexInfo.remoteIdentityKey;
            }
            if (util.toString(this.identityKey) !== util.toString(session.indexInfo.remoteIdentityKey)) {
                var e = new Error("Identity key changed at session save time");
                e.identityKey = session.indexInfo.remoteIdentityKey.toArrayBuffer();
                throw e;
            }

            sessions[util.toString(session.indexInfo.baseKey)] = session;

            this.removeOldSessions();

            var openSessionRemaining = false;
            for (var key in sessions) {
                if (sessions[key].indexInfo.closed == -1) {
                    openSessionRemaining = true;
                }
            }
            if (!openSessionRemaining) { // Used as a flag to get new pre keys for the next session
                this.registrationId = null;
            } else if (this.registrationId === null && registrationId !== undefined) {
                this.registrationId = registrationId;
            } else if (this.registrationId === null) {
                throw new Error("Had open sessions on a record that had no registrationId set");
            }
        },
        getSessions: function() {
            // return an array of sessions ordered by time closed,
            // followed by the open session
            var list = [];
            var openSession;
            for (var k in this._sessions) {
                if (this._sessions[k].indexInfo.closed === -1) {
                    openSession = this._sessions[k];
                } else {
                    list.push(this._sessions[k]);
                }
            }
            list = list.sort(function(s1, s2) {
                return s1.indexInfo.closed - s2.indexInfo.closed;
            });
            if (openSession) {
                list.push(openSession);
            }
            return list;
        },
        archiveCurrentState: function() {
            var open_session = this.getOpenSession();
            if (open_session !== undefined) {
                this.closeSession(open_session);
                this.updateSessionState(open_session);
            }
        },
        closeSession: function(session) {
            if (session.indexInfo.closed > -1) {
                return;
            }
            console.log('closing session', session.indexInfo.baseKey);

            // After this has run, we can still receive messages on ratchet chains which
            // were already open (unless we know we dont need them),
            // but we cannot send messages or step the ratchet

            // Delete current sending ratchet
            delete session[util.toString(session.currentRatchet.ephemeralKeyPair.pubKey)];
            // Move all receive ratchets to the oldRatchetList to mark them for deletion
            for (var i in session) {
                if (session[i].chainKey !== undefined && session[i].chainKey.key !== undefined) {
                    session.oldRatchetList[session.oldRatchetList.length] = {
                        added: Date.now(), ephemeralKey: i
                    };
                }
            }
            session.indexInfo.closed = Date.now();
            this.removeOldChains(session);
        },
        removeOldChains: function(session) {
            // Sending ratchets are always removed when we step because we never need them again
            // Receiving ratchets are added to the oldRatchetList, which we parse
            // here and remove all but the last five.
            while (session.oldRatchetList.length > 5) {
                var index = 0;
                var oldest = session.oldRatchetList[0];
                for (var i = 0; i < session.oldRatchetList.length; i++) {
                    if (session.oldRatchetList[i].added < oldest.added) {
                        oldest = session.oldRatchetList[i];
                        index = i;
                    }
                }
                console.log("Deleting chain closed at", oldest.added);
                delete session[util.toString(oldest.ephemeralKey)];
                session.oldRatchetList.splice(index, 1);
            }
        },
        removeOldSessions: function() {
            // Retain only the last 20 sessions
            var sessions = this._sessions;
            var oldestBaseKey, oldestSession;
            while (Object.keys(sessions).length > ARCHIVED_STATES_MAX_LENGTH) {
                for (var key in sessions) {
                    var session = sessions[key];
                    if (session.indexInfo.closed > -1 && // session is closed
                        (!oldestSession || session.indexInfo.closed < oldestSession.indexInfo.closed)) {
                        oldestBaseKey = key;
                        oldestSession = session;
                    }
                }
                console.log("Deleting session closed at", oldestSession.indexInfo.closed);
                delete sessions[util.toString(oldestBaseKey)];
            }
        },
    };

    return SessionRecord;
}();
