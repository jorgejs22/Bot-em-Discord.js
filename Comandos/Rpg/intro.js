const Discord = require("discord.js");

module.exports = {
  name: "intro",
  aliases: ["introdução", "introducao", "inicio"],
  description: "Sistema de RPG'S",
  type: Discord.ApplicationCommandType.ChatInput,
   run: async (client, inteeraction) => {

     let user = interaction.user;

     const inicio = new Discord.EmbedBuilder()
     .setTitle(`Inicio`)
     .setColor("RANDOM")
     .setDescription(`Ola ${user}, Bem-vindo ao novo painel de introdução dos meus RPG'S, onde você pode ler sobre todos os tipos de RPG's existentes, e também pode escolher um RPG para começar a jogar!`)
     .setFooter({ text: `Painel de RPG'S`, iconURL: client.user.displayAvatarURL() })
     .setTimestamp();

     const rpg1 = new Discord.EmbedBuilder()
     .setTitle(`RPG DE PAÍSES`)
     .setColor("RANDOM")
     .setDescription(`O RPG de Países é um lugar onde você pode criar seu país, criar o seu governo e fazer diversas alianças.`)
     .setFooter({ text: `PAINEL DE RPG'S`, iconURL: client.user.displayAvatarURL })

     const row = new Discord.ActionRowBuilder()
     .addComponents(
         new Discord.ButtonBuilder()
         .setCustomId(1)
         .setLabel(`Rpg 1`)
         .setStyle(Discord.ButtonStyle.Primary),

         new Discord.ButtonBuilder()
           .setCustomId(2)
          .setLabel(`Rpg 2`)
          .setStyle(Discord.ButtonStyle.Primary)
        
     ) 

     interaction.reply({ embeds: [inicio], components: [row] });

     const collector = interaction.channel.createMessageComponentCollector()
     collector.on('collect', i => {
         if (i.customId === 1) {
             i.reply({ embeds: [rpg1], ephemeral: true })
           
         } else if (i.customId === 2) {
           i.reply({ embeds: [rpg2], ephemeral: true })
         }
     });

     collector.on('end', collected => {
        console.log(`Foram coletadas ${collected.size} interações.`)
     })
   }
}