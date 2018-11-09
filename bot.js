const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

var commandsList = fs.readFileSync("./commandList.txt", "utf8");

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
	client.user.setActivity(`Serving ${client.guilds.size} servers | ~help`)
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
	if (receivedMessage.author.bot || !receivedMessage.content.startsWith(config.prefix))
	{return;}

	//Tests to see if a message starts with the prefix, calls the 'processCommand' function if it does.
	if (receivedMessage.content.startsWith(config.prefix))
	{
		//Main command processing.
		let msg = message.content.substr(1).split(" "); //Removes the ! and splits based on each space//was receivedMessage
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
				message.channel.send("https://www.github.com/chrisblammo123/");
				break;
			case "info":
				message.channel.send("Custom Discord Bot made by Chris Struck (c h r i s#2604)\nFor help, use !help or !commands or contact me");
				break;
			case "help": //WIP
				message.channel.send("Check your private messages.22");
				message.author.send("test test");
				break;
			case "commands": //WIP
				message.channel.send("Check your private messages.");
				message.author.send(commandsList);
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
					//for some reason it doesnt always send.
					member.send(`You were kicked from ${message.guild.name} by ${message.author} for ${reason}.`);
					member.kick(reason);
					message.channel.send(`${member} was kicked by ${message.author} for ${reason}.`);
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
			default:
				message.channel.send("Invalid command, try !help or !commands");
				break;
		}
	}
});


//Secret token for the bot, defined in the config.json file.
client.login(config.token);
