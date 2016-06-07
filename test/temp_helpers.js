var pushMessages     = dcodeIO.ProtoBuf.loadProto('package textsecure;\n' +
'\n' +
'option java_package = "org.whispersystems.textsecure.push";\n' +
'option java_outer_classname = "PushMessageProtos";\n' +
'\n' +
'message IncomingPushMessageSignal {\n' +
'  enum Type {\n' +
'    UNKNOWN                      = 0;\n' +
'    CIPHERTEXT                   = 1;\n' +
'    KEY_EXCHANGE                 = 2;\n' +
'    PREKEY_BUNDLE                = 3;\n' +
'    PLAINTEXT                    = 4;\n' +
'    RECEIPT                      = 5;\n' +
'    PREKEY_BUNDLE_DEVICE_CONTROL = 6;\n' +
'    DEVICE_CONTROL               = 7;\n' +
'  }\n' +
'  optional Type   type         = 1;\n' +
'  optional string source       = 2;\n' +
'  optional uint32 sourceDevice = 7;\n' +
'  optional string relay        = 3;\n' +
'  optional uint64 timestamp    = 5;\n' +
'  optional bytes  message      = 6; // Contains an encrypted PushMessageContent\n' +
'//  repeated string destinations = 4; // No longer supported\n' +
'}\n' +
'\n' +
'message PushMessageContent {\n' +
'  message AttachmentPointer {\n' +
'    optional fixed64 id          = 1;\n' +
'    optional string  contentType = 2;\n' +
'    optional bytes   key         = 3;\n' +
'  }\n' +
'\n' +
'  message GroupContext {\n' +
'    enum Type {\n' +
'      UNKNOWN = 0;\n' +
'      UPDATE  = 1;\n' +
'      DELIVER = 2;\n' +
'      QUIT    = 3;\n' +
'    }\n' +
'    optional bytes             id      = 1;\n' +
'    optional Type              type    = 2;\n' +
'    optional string            name    = 3;\n' +
'    repeated string            members = 4;\n' +
'    optional AttachmentPointer avatar  = 5;\n' +
'  }\n' +
'\n' +
'  enum Flags {\n' +
'    END_SESSION = 1;\n' +
'  }\n' +
'\n' +
'  optional string            body        = 1;\n' +
'  repeated AttachmentPointer attachments = 2;\n' +
'  optional GroupContext      group       = 3;\n' +
'  optional uint32            flags       = 4;\n' +
'}').build('textsecure');

window.textsecure = {
    protobuf: {
        IncomingPushMessageSignal : pushMessages.IncomingPushMessageSignal,
        PushMessageContent        : pushMessages.PushMessageContent,
    }

};
