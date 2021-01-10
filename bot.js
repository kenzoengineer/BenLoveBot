const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client();
fs = require("fs");

//init sequelize database
const sq = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

//add tags for date and count
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
  client.user.setActivity("!benlove");
  Tags.sync();
});

//file writing function (not used anymore)
function writeF(a) {
	fs.writeFile("count.txt", a, function(err) {
		if (err) throw err;
		console.log("Saved!");
	})
}

//returns file for reading
function readF() {
	return fs.readFileSync("count.txt", "utf8");
}

//generates a date which is (sub) days ago
//e.g. createDate(1) is yesterday
function createDate(sub) {
	var today = new Date();
	var prev = new Date();
	prev.setDate(today.getDate() - sub);
	var d = prev.getDate() + "-" + (prev.getMonth() + 1) + "-" + prev.getFullYear();
	return d;
}

//sql to find the count on a specified day
//SELECT count IN sq WHERE date = d
//async function as this may take a while
async function getCount(d) {
	const tag = await Tags.findOne({where: {date: d}});
	return tag.count;
}

//client on loop, always running
client.on('message', async msg => {
    //today (not a const as this will change as the bot is running over many days)
	let todayDate = createDate(0);

    //runs when it detects a message author is ben
    if (msg.author.id === '760979018840932382') {
        console.log("ben typed");
        //checks if keywords are typed
        if (msg.content.includes("love") || msg.content.includes("luv") || msg.content.includes("<3")) {
            //make sure he isn't typing the !benlove command as "love" is in that command
            if (msg.content != "!benlove") {
                //read file
                console.log(readF());
                //write to file
				writeF(parseInt(readF())+1);

                //update tags (pretty bad, try not to use try catch blocks for decision making >_>)
                try {
                    //if tag does not exist, create it
					const tag = await Tags.create({
					date: todayDate,
					count: 1,
					});
                } catch (e) {
                    //otherwise, update it
					var tagCount = await getCount(todayDate);
					console.log('prev: ' + tagCount);
					const affected = Tags.update({count: (parseInt(tagCount) + 1)}, {where: {date: todayDate}});
				}
				
		    }
	    }
    }

    //if anyone says the !benlove command
    if (msg.content === "!benlove") {
        //get all tags (async function)
        const tL = await Tags.findAll();
        //map all tags to an array with counts;
		const tA = tL.map(t => t.count);

        //reduce array by summing all of its values
		var c = tA.reduce((a, b) => a + b, 0);
		console.log(c);

        //send the message
	  	const embed = {
			"title": "Ben has loved " + c + " times",
			"color": 6593371
		};
		msg.channel.send({
			embed
		});
    }

    //graph function
    //uses quickchart.io api, but instead of actually using the api, i just copy
    //the link that gets generated and manually edit the url LOL
	if (msg.content === '!graph') {
	    var i;
	    var beginning = "https://quickchart.io/chart?bkg=white&c={type:'line',data:{labels:[";
	    var middle = "],datasets:[{label:'loves',data:[";
	    var end = "]}]}}";
	    var dates = [];
        var datas = [];
        //get info from last 5 days
	    for (i = 4; i > -1; i--) {
            var d = createDate(i);
            //push date name
            dates.push(d.substring(0, d.indexOf('-')));
            //push count
			datas.push(await getCount(d));
        }
	    var d1 = dates.join(',')
        var d2 = datas.join(',')
        //format is: .https://quickchart.io/chart?bkg=white&c={type:'line',data:{labels:[01-05-2021,01-06,2021,etc.],datasets:[{label:'loves',data:[1,2,etc.]}]}}
	    msg.channel.send(beginning + d1 + middle + d2 + end);
    }

    //setup function which I used to add in the word occurances before the bot creation date manually
    //should never be called again, kept for documentation purposes
    //no issues if someone types this command as the dates it overwrites are hardcoded
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

//get bot token (secret!!!) and login with it
const config = require("./auth.json");
client.login(config.token);