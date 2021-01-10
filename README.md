# BenLoveBot
How many times does ben say he loves us :D

# Backstory
Our ECE 2025 discord server has some cool people in it and Ben kept saying "love". He said it so much, someone had to make a discord bot to track how many times he said it.

![make a bot](https://imgur.com/wMlQjtr.png)

# The Bot
The bot is written in javascript, and connects to discord using node.js. I used to store the info in a text file, but decided to switch to Sequelize which is an ORM for node.js, compatible with Sqlite. I currently have it hosted on Amazon's EC2 servers.

Using the command `!benlove` will output a count for the total number of times he said the word.

![benlove](https://imgur.com/Q9PaT3w.png)

Using the command `!graph` will output a 5 day line graph for the word frequency. It uses quickchart.io's api to generate this.

![graphs](https://imgur.com/xv4cmre.png)
