const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client();
fs = require("fs");

const sq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = sq.define('tags', {
	date: {
		type: Sequelize.TEXT,
		unique: true,
	},
	count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("!bencoom");
  Tags.sync();
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

function createDate(sub) {
	var today = new Date();
	var prev = new Date();
	prev.setDate(today.getDate() - sub);
	var d = prev.getDate() + "-" + (prev.getMonth() + 1) + "-" + prev.getFullYear();
	return d;
}

async function getCount(d) {
	const tag = await Tags.findOne({where: {date: d}});
	return tag.count;
}

client.on('message', async msg => {
	var todayDate = createDate(0);

    if (msg.author.id === '760979018840932382') {
	  console.log("ben typed");
	    if (msg.content.includes("cum") || msg.content.includes("coom") || msg.content.includes("semen")) {
		    if (msg.content != "!bencoom") {
				console.log(readF());
				writeF(parseInt(readF())+1);
				
				try {
					const tag = await Tags.create({
					date: todayDate,
					count: 1,
					});
				} catch (e) {
					var tagCount = await getCount(todayDate);
					console.log('prev: ' + tagCount);
					const affected = Tags.update({count: (parseInt(tagCount) + 1)}, {where: {date: todayDate}});
				}
				
		    }
	    }
    }
  
    if (msg.content === "!bencoom") {
		const tL = await Tags.findAll();
		const tA = tL.map(t => t.count);
		
		var c = tA.reduce((a, b) => a + b, 0);
		console.log(c);
		
	  	const embed = {
			"title": "Ben has cummed/coomed/semened " + c + " times",
			"color": 6593371
		};
		msg.channel.send({
			embed
		});
    }
	
	if (msg.content === '!graph') {
	    var i;
	    var beginning = "https://quickchart.io/chart?bkg=white&c={type:'line',data:{labels:[";
	    var middle = "],datasets:[{label:'cooms',data:[";
	    var end = "]}]}}";
	    var dates = [];
	    var datas = [];
	    for (i = 4; i > -1; i--) {
			var d = createDate(i);
			dates.push(d.substring(0,d.indexOf('-')));
			datas.push(await getCount(d));
	    }
	    var d1 = dates.join(',')
	    var d2 = datas.join(',')
	    msg.channel.send(beginning + d1 + middle + d2 + end);
    }
	
	if (msg.content === "!setup") {
		const tag = Tags.create({
		date: '8-12-2020',
		count: 5,
		});
		const tag1 = Tags.create({
		date: '7-12-2020',
		count: 37,
		});
		const tag2 = Tags.create({
		date: '6-12-2020',
		count: 21,
		});
		const tag3 = Tags.create({
		date: '5-12-2020',
		count: 1,
		});
		const tag4 = Tags.create({
		date: '4-12-2020',
		count: 1,
		});
		const tag5 = Tags.create({
		date: '3-12-2020',
		count: 394,
		});
	}
});

const config = require("./auth.json");
client.login(config.token);