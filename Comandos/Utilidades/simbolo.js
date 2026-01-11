const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const db = require("quick.db");


        module.exports = {
          data: new SlashCommandBuilder()
            .setName("setcurrency")
            .setDescription("Defina o símbolo da moeda!")
            .addStringOption(option => 
              option.setName("símbolo")
              .setDescription("Um símbolo (emoji) para a moeda")
               .setRequired(true)),

     async execute(interaction) {
       const guildId = interaction.guild.id;
       const currencySymbol = interaction.options.getString("símbolo");

       const embed = new EmbedBuilder()
           .setDescription(`✅ O símbolo da moeda foi definido para: ${currencySymbol}`)
           .setColor("Green")

         await db.set(`currencySymbol_${guildId}`, currencySymbol);

       await interaction.reply({
         embeds: [embed],
         ephemeral: false
       })
     }
}