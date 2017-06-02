var protos = require("./protos"),
	protoMask = 0x80000000,
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	bkv = require('binarykvparser');

var SteamRegistrar = function SteamRegistrar(steamUser, steamGC, debug) {
	EventEmitter.call(this);

	this.debug = debug || false;
	this._user = steamUser;
	this._gc = steamGC;
	this._handlers = {};

	var self = this;

	this._gc.on('message', function(type, message, callback) {
		callback = callback || null;

		var msgId = type.msg & ~protoMask;
		if (self.debug)
			console.info("Message from GC: " + msgId);

		switch (msgId) {	// In the event that we need more in the future.
			case 763:		// ClientPurchaseResponse = 763;
				if (self.debug)
					console.info("Emitting purchaseResponse");
				var purchaseResponse = protos.ClientPurchaseResponse.decode(message);
				purchaseResponse.purchase_receipt_info = vdf.decode(purchaseResponse.purchase_receipt_info.toBuffer());
				self.emit("purchaseResponse", purchaseResponse);
				break;
		}
	});
};

util.inherits(SteamRegistrar, EventEmitter);

SteamRegistrar.prototype.activateKey = function(key, callback) {
	if (this.debug)
		console.info("Sending activation request");
	var newCallback = function(header, message) {
		var purchaseResponse = protos.ClientPurchaseResponse.decode(message);
		purchaseResponse.purchase_receipt_info = bkv.parse(purchaseResponse.purchase_receipt_info.toBuffer());
		callback(purchaseResponse);
	};
	if (callback === undefined) newCallback = undefined;	// Otherwise, the event will not be emitted.
	var payload = new protos.ClientRegisterKey({
		key: key
	});
	this._gc._send({
		msg: 743,		// ClientRegisterKey = 743;
		proto: {},
	}, payload.toBuffer(), newCallback);
};

exports.SteamRegistrar = SteamRegistrar;