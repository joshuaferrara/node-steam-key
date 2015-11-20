var Protobuf = require('protobufjs');

Protobuf.convertFieldsToCamelCase = false;

var builder = Protobuf.newBuilder();
Protobuf.loadProtoFile(__dirname + "/protos/key_registrar.proto", builder);
module.exports = builder.build();