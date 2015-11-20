var steamKey = require("./"),
	Steam = require("steam"),
	bot = new Steam.SteamClient(),
	steamUser = new Steam.SteamUser(bot),
	SteamRegistrar = new steamKey.SteamRegistrar(steamUser, bot, true),
	readlineSync = require("readline-sync"),
	fs = require('fs'),
	crypto = require("crypto");

function MakeSha(bytes) {
    var hash = crypto.createHash('sha1');
    hash.update(bytes);
    return hash.digest();
}

var onSteamLogOn = function onSteamLogOn(response){
    if (response.eresult == Steam.EResult.OK) {
        console.log('Logged in!');
    }
    else
    {
        console.log('error, ', response);
        process.exit();
    }

    SteamRegistrar.on('purchaseResponse', function(resp) {
    	console.log("Got activation info");
    	console.log(resp);
    })

    SteamRegistrar.activateKey("AAAAA-BBBBB-CCCCC");
}, onSteamSentry = function onSteamSentry(sentry) {
    console.log("Received sentry.");
    fs.writeFileSync('sentry', sentry);
};

var username = readlineSync.question('Username: ');
var password = readlineSync.question('Password: ', {noEchoBack: true});
var authCode = readlineSync.question('AuthCode: ');

var logonDetails = {
	"account_name": username,
	"password": password
}
if (authCode !== "") {
    logonDetails.auth_code = authCode;
}
var sentry = fs.readFileSync("sentry");
if (sentry.length) {
    logonDetails.sha_sentryfile = MakeSha(sentry);
}
bot.connect();
steamUser.on('updateMachineAuth', function(response, callback){
    fs.writeFileSync('sentry', response.bytes);
    callback({ sha_file: MakeSha(response.bytes) });
});
bot.on("logOnResponse", onSteamLogOn)
	.on('sentry', onSteamSentry)
	.on('connected', function(){
		steamUser.logOn(logonDetails);
	});