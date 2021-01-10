const Discord = require('discord.js');
const client = new Discord.Client();
fs = require("fs");
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("!bencoom");
});

function writeF(a) {
	fs.writeFile("count.txt", a, function(err) {
		if (err) throw err;
		console.log("Saved!");
	})
}

function readF() {
	var fileString = fs.readFileSync("count.txt", "utf8");
	return fileString;
}

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
	console.log(msg.member.id);
  }

  if (msg.author.id === '760979018840932382') {
	  console.log("ben typed");
	  if (msg.content.includes("cum") || msg.content.includes("coom") || msg.content.includes("semen")) {
		  if (msg.content != "!bencoom") {
			console.log(readF());
			writeF(parseInt(readF())+1);
		  }
	  }
  }
  
  if (msg.content === "!bencoom") {
		var c = readF();
	  	const embed = {
			"title": "Ben has cummed/coomed/semened " + c + " times",
			"color": 6593371
		};
		msg.channel.send({
			embed
		});
  }
});

client.login('Nzg1NjExOTA2NTA4NTIxNDgz.X86YGg.O-YvtW9UsnbR3-A4C8rhfh_UOzI');