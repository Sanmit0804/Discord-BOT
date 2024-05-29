// For more information visit: https://discordjs.guide/creating-your-bot/

const fs = require("fs");
const path = require("path");

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

// Now we have created new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}); // GatewayIntentBits means which permissions are you giving to this bot. What are the intentions are available for that bot.

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// This was for demo only
client.on("messageCreate", (message) => {
  //   console.log(message.content);
  if (message.author.bot) return;
  message.reply({
    content: "Hi from Bot",
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  // To make sure to only handle slash commands in this function by making use of this isChatInputCommand() method
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
