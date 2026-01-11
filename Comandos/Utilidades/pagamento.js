const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType
} = require("discord.js");

const db = require("quick.db");

 module.exports = {
   data: new SlashCommandBuilder()
      .setName("pagar")
      .setDescription("Transfira dinheiro para um usuário")
      .addUserOption(option =>
        option.setName("usuário")
            .setDescription("O usuário que você quer pagar")
                  .setRequired(true))
      .addIntegerOption(option =>
        option.setName("quantidade")
              .setDescription("A quantidade de dinheiro que você quer transferir")
                .setRequired(true)
                .setMinValue(1)),

   async execute(interaction) {

       const user = interaction.options.getUser("usuário");
       const amount = interaction.options.getInteger("quantidade");
       const servidor = interaction.guild.id;

         if(user.id === interaction.user.id) {
             return interaction.reply({ content: "Você não pode transferir dinheiro para si mesmo!", ephemeral: true });
         }

       const autor = interaction.user.id;
     
        let userMoney = db.get(`dracma_${servidor}_${autor}`);
        let symbol = db.get(`currencySymbol_${servidor}`) || "🪙";
     
       if(userMoney < amount) {
           return interaction.reply({ content: `Você não tem dinheiro suficiente para transferir!`, ephemeral: true})
       }
         const embed = new EmbedBuilder()
        .setTitle(`${autor.tag}`)
         .setDescription(`✅ ${user} recebeu seus ${symbol} ${amount}`)

         db.subtract(`dracma_${servidor}_${autor}`, amount);
     db.add(`dracma_${servidor}_${user}`, amount);

       let usuarios = await db.get("usuarios_dracma");

      if(!Array.isArray(usuarios)) {
          usuarios = [];
      }

      if(!usuarios.includes(user.id)) {
          usuarios.push(user);
          await db.set("usuarios_dracma", usuarios)
      }
     
     await interaction.reply({ embeds: [embed] });
       }
         }