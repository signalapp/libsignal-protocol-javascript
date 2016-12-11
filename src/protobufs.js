/* vim: ts=4:sw=4 */

// this is concatinated after ../protos/WhisperTextProtocol.proto
// Internal.protoText is getting passed in from that file
// (see the Gruntfile's `protos_concat` routine)
// here we export the loaded protobuf, an object
//    { WhisperMessage, PreKeyWhisperMessage }
module.exports = function protobuf() {
  'use strict';
  var dcodeIO = require('../build/dcodeIO.js');

  function loadProtoBufs(filename) {
    return dcodeIO.loadProto(Internal.protoText['protos/' + filename]).build('textsecure');
  }

  var protocolMessages = loadProtoBufs('WhisperTextProtocol.proto');

  return {
    WhisperMessage            : protocolMessages.WhisperMessage,
    PreKeyWhisperMessage      : protocolMessages.PreKeyWhisperMessage
  };
}();
