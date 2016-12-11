// for legacy builds
// we browserify bundle this into a js file for folks  to include in their html
var libsignal = require('./main.js');
window.libsignal = libsignal;
