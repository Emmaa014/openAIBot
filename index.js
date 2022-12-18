const axios = require('axios');
const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
// const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require('./config.json')

const client = new Client({ intents: 
  [GatewayIntentBits.Guilds] 
})

// Command Handler
const { readdirSync } = require('fs')

console.log(' ')
const loadCommands = (client, dir = "./commands/") => {
    console.log('» Commands \n')
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
        console.log("• "+dirs+" :\n")
        for(const file of commands) {
            const getFileName = require(`../${dir}/${dirs}/${file}`);    
            client.commands.set(getFileName.help.name, getFileName);
            console.log(`Command : ${getFileName.help.name} ✔️`);    
        };
        console.log(' ')
    });  
};

module.exports = {
    loadCommands,
}

// When the bot receivs an interaction
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Après
client.on('message', message => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!commands.has(commandName)) return;

  const command = commands.get(commandName);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});

client.login(config.token);

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag} ==> ✔️`);
  // Statut
  client.user.setActivity(config.activity);
});
