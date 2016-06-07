;(function() {

'use strict';

// I am the...workee?
var origCurve25519 = Internal.curve25519_async;

Internal.startWorker = function(url) {
    Internal.stopWorker(); // there can be only one
    Internal.curve25519_async = new Curve25519Worker(url);
};

Internal.stopWorker = function() {
    if (Internal.curve25519_async instanceof Curve25519Worker) {
        var worker = Internal.curve25519_async.worker;
        Internal.curve25519_async = origCurve25519;
        worker.terminate();
    }
};

libsignal.worker = {
  startWorker: Internal.startWorker,
  stopWorker: Internal.stopWorker,
};

function Curve25519Worker(url) {
    this.jobs = {};
    this.jobId = 0;
    this.worker = new Worker(url);
    this.worker.onmessage = function(e) {
        var job = this.jobs[e.data.id];
        if (e.data.error && typeof job.onerror === 'function') {
            job.onerror(new Error(e.data.error));
        } else if (typeof job.onsuccess === 'function') {
            job.onsuccess(e.data.result);
        }
        delete this.jobs[e.data.id];
    }.bind(this);
}

Curve25519Worker.prototype = {
    constructor: Curve25519Worker,
    postMessage: function(methodName, args, onsuccess, onerror) {
        return new Promise(function(resolve, reject) {
          this.jobs[this.jobId] = { onsuccess: resolve, onerror: reject };
          this.worker.postMessage({ id: this.jobId, methodName: methodName, args: args });
          this.jobId++;
        }.bind(this));
    },
    keyPair: function(privKey) {
        return this.postMessage('keyPair', [privKey]);
    },
    sharedSecret: function(pubKey, privKey) {
        return this.postMessage('sharedSecret', [pubKey, privKey]);
    },
    sign: function(privKey, message) {
        return this.postMessage('sign', [privKey, message]);
    },
    verify: function(pubKey, message, sig) {
        return this.postMessage('verify', [pubKey, message, sig]);
    }
};

})();
