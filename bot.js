/*
 * Discord Bot invite link
 * https://discordapp.com/oauth2/authorize?client_id=507957137465540629&scope=bot&permissions=470019159
 */

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');

var commandsList = fs.readFileSync("./commandsList.txt", "utf8");

//For !commands
const sendList = (currentValue) =>
{
    message.author.send(currentValue);
    message.author.send(config.listSplit);
};

//Triggered when the bot is started up.
client.on("ready", () => {
	console.log("-----Starting Bot-----");
	//Prints when the bot connects and its name
	console.log("Connected as " + client.user.tag + "\n");
	//Lists servers that the bot is connected to
	console.log("Servers:");
	client.guilds.forEach((guild) => {
		console.log(" - " + guild.name);
	});
	console.log("");
	client.user.setActivity(`Serving ${client.guilds.size} servers | ~help`);

	//Points System
	// Check if the table "points" exists.
	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
	if (!table['count(*)'])
	{
		// If the table isn't there, create it and setup the database correctly.
		sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
		// Ensure that the "id" row is always unique and indexed.
		sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
		sql.pragma("synchronous = 1");
		sql.pragma("journal_mode = wal");
	}

	// And then we have two prepared statements to get and set the score data.
	client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
	client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
});

//Triggered when the bot joins a server(guild).
client.on("guildCreate", guild => {
	console.log(`New server joined: ${guild.name} (id: ${guild.id}). This server has ${guild.memberCount} members!`);
	client.user.setActivity(`Serving ${client.guilds.size} servers | ~help`);
});

//Triggered when the bot is removed from a server(guild).
client.on("guildDelete", guild => {
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Serving ${client.guilds.size} servers | ~help`);
});

//Triggered when the someone sends a message in a server that the bot is active in.
client.on("message", (message) => {
	//Prevents the bot from responding to messages from bots or ones that do not start with the prefix.
	if (message.author.bot)
	{return;}

	let score;
	if (message.guild)
	{
		score = client.getScore.get(message.author.id, message.guild.id);
		if (!score)
		{
			score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
		}
		score.points++;
		const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
		console.log("curLevel: " + curLevel);
		if(score.level < curLevel)
		{
			score.level++;
			message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
		}
		client.setScore.run(score);
	}

	//Tests to see if a message starts with the prefix, calls the 'processCommand' function if it does.
	if (message.content.startsWith(config.prefix))
	{
		//Main command processing.
		let msg = message.content.substr(1).split(" "); //Removes the ! and splits based on each space
		let cmd = msg[0].toLowerCase(); // The first word directly after the exclamation is the command
		let args = msg.slice(1); // All other words are arguments/parameters/options for the command

		console.log("Command received: " + cmd);
		console.log("Arguments: " + args); // There may not be any arguments

		switch (cmd)
		{
			case "ping":
				message.channel.send("Pong!");
				break;
			case "github":
				message.channel.send("https://github.com/chrisblammo123/Discord-Bot/");
				break;
			case "info":
				message.channel.send("Custom Discord Bot made by Chris Struck (c h r i s#2604)\nFor help, use !help or !commands or contact me");
				break;
			case "help": //WIP
				message.channel.send("Check your private messages.22");
				message.author.send("test test");
				break;
			case "commands": //WIP
				message.channel.send("Check your private messages for the command list.");
				//message.author.send(commandsList);
				message.author.send("Commands List:");
				commandsList.split(config.listSplit).forEach((currentValue) => {
					message.author.send(currentValue);
			    message.author.send(config.listSplit);
				});
				break;
			case "nick":
				if (message.member.hasPermission("CHANGE_NICKNAME", false, true, true))
				{
					let nickname = args.join(" ");
					message.member.setNickname(nickname);
					message.channel.send("Changed nickname.");
				}
				else
				{
					message.channel.send("You do not have permission for that command.");
				}
				break;
			case "kick": //WIP
				if (message.member.hasPermission("KICK_MEMBERS"), false, true, true)
				{
					let member = message.mentions.members.first();
					let reason = args.slice(1).join(" ");
					//original
					//member.send(`You were kicked from ${guild.name} by ${message.author} for ${reason}.`);
					//member.kick(reason);
					//message.channel.send(`${member} was kicked by ${message.author} for ${reason}.`);

					///*
					//Possible Solution
					message.member.send(`You were kicked from ${guild.name} by ${message.author} for ${reason}.`).then(function()
					{
						message.member.kick(reason);
						console.log(`Successfully sent ban message to ${message.member.tag}`);
						message.channel.send(`${member} was kicked by ${message.author} for ${reason}.`);
					});
					//*/
					/*
					//This was orgininally added, might add it after i make sure the above code works
					.catch(function(){
					message.member.ban(`reason`)
					console.log(`Unsuccessfully sent ban message to ${message.member.tag}`);
					});
					*/
				}
				else
				{
					message.channel.send("You do not have permission for that command.");
				}
				break;
			case "ban": //WIP
				if (message.member.hasPermission("BAN_MEMBERS"), false, true, true)
				{
					let member = message.mentions.members.first();
					let reason = args.slice(1).join(" ");
					member.send(`You were banned from ${message.guild.name} by ${message.author} for ${reason}.`);
					member.ban(reason);
					message.channel.send(`${member} was banned by ${message.author} for ${reason}.`);
				}
				else
				{
					message.channel.send("You do not have permission for that command.");
				}
				break;
			case "points":
				message.channel.send(`You currently have ${score.points} points.`);
				break;
			case "level":
				message.channel.send(`You currently are level ${score.level}.`);
				break;
			case "give":
					if (message.author.hasPermission("ADMINISTRATOR", false, true, true) || message.author.id == config.ownerID)
					{
						let member = message.mentions.members.first();
						let amount = parseInt(args.slice(1));

						//Gets the member's current points
						let userscore = client.getScore.get(user.id, message.guild.id);

						//In case the member has not been seen
						if (!userscore)
						{
							userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 };
						}

						userscore.points += amount;

						// We also want to update their level (but we won't notify them if it changes)
						let userLevel = Math.floor(0.1 * Math.sqrt(score.points));
						userscore.level = userLevel;

						//Save the new Score
						client.setScore.run(userscore);

						message.channel.send(`${user.tag} has received ${amount} points and now has ${userscore.points} points.`);
					}
					else
					{
						message.channel.send("You do not have permission for that command.");
					}
					break;
				case "leaderboard":
					const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);

					// Now shake it and show it! (as a nice embed, too!)
					const embed = new Discord.RichEmbed()
					.setTitle("Leaderboard")
					.setAuthor(client.user.username, client.user.avatarURL)
					.setDescription("Our top 10 points leaders!")
					.setColor(0x00AE86);

					for(const data of top10)
					{
						embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
					}
					message.channel.send({embed});
					break;
			default:
				message.channel.send("Invalid command, try !info or !help for help, or view the commands with !commands");
				break;
		}
	}
});


//Secret token for the bot, defined in the config.json file.
client.login(config.token);
