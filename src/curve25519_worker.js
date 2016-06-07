var Internal = Internal || {};
// I am the worker
this.onmessage = function(e) {
    Internal.curve25519_async[e.data.methodName].apply(null, e.data.args).then(function(result) {
        postMessage({ id: e.data.id, result: result });
    }).catch(function(error) {
        postMessage({ id: e.data.id, error: error.message });
    });
};
