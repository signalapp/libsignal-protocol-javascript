var Internal = Internal || {};

Internal.protoText = function() {
	var protoText = {};

	protoText['protos/WhisperTextProtocol.proto'] = 
		'package textsecure;\n' +
		'option java_package = "org.whispersystems.libsignal.protocol";\n' +
		'option java_outer_classname = "WhisperProtos";\n' +
		'message WhisperMessage {\n' +
		'  optional bytes  ephemeralKey    = 1;\n' +
		'  optional uint32 counter         = 2;\n' +
		'  optional uint32 previousCounter = 3;\n' +
		'  optional bytes  ciphertext      = 4; // PushMessageContent\n' +
		'}\n' +
		'message PreKeyWhisperMessage {\n' +
		'  optional uint32 registrationId = 5;\n' +
		'  optional uint32 preKeyId       = 1;\n' +
		'  optional uint32 signedPreKeyId = 6;\n' +
		'  optional bytes  baseKey        = 2;\n' +
		'  optional bytes  identityKey    = 3;\n' +
		'  optional bytes  message        = 4; // WhisperMessage\n' +
		'}\n' +
		'message KeyExchangeMessage {\n' +
		'  optional uint32 id               = 1;\n' +
		'  optional bytes  baseKey          = 2;\n' +
		'  optional bytes  ephemeralKey     = 3;\n' +
		'  optional bytes  identityKey      = 4;\n' +
		'  optional bytes  baseKeySignature = 5;\n' +
		'}\n' +
''	;

	return protoText;
}();