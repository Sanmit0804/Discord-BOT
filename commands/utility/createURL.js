const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createurl")
    .setDescription("Creates a new short URL"),
  async execute(interaction) {

    await interaction.reply(`New shortURL is: `);
  },
};

// Pending....