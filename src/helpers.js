/*
 * vim: ts=4:sw=4
 */
'use strict';


var dcodeIO = require('../build/dcodeIO.js');
var StaticArrayBufferProto = new ArrayBuffer().__proto__;

function toString (thing) {
  if (typeof thing == 'string') {
    return thing;
  }
  return new dcodeIO.ByteBuffer.wrap(thing).toString('binary');
}

function toArrayBuffer (thing) {
  if (thing === undefined) {
    return undefined;
  }
  if (thing === Object(thing)) {
    if (thing.__proto__ == StaticArrayBufferProto) {
      return thing;
    }
  }
  var str;
  if (typeof thing == "string") {
    str = thing;
  } else {
    throw new Error("Tried to convert a non-string of type " + typeof thing + " to an array buffer");
  }
  return new dcodeIO.ByteBuffer.wrap(thing, 'binary').toArrayBuffer();
}

function isEqual (a, b) {
  // TODO: Special-case arraybuffers, etc
  if (a === undefined || b === undefined) {
    return false;
  }
  a = toString(a);
  b = toString(b);
  var maxLength = Math.max(a.length, b.length);
  if (maxLength < 5) {
    throw new Error("a/b compare too short");
  }
  return a.substring(0, Math.min(maxLength, a.length)) == b.substring(0, Math.min(maxLength, b.length));
}

var util = {
  toString: toString,
  toArrayBuffer: toArrayBuffer,
  isEqual: isEqual
};

module.exports = util;
