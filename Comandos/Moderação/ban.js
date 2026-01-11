const Discord = require("discord.js");

module.exports = {
  name: "ban",
  aliases: ["banir"],
  description: "Bane um usuario do servidor",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "usuario",
      description: "Mencione um usuario para banir",
      type: Discord.ApplicationCommandOptionType.User,
      required: true
    }, 
    {
      name: "motivo",
      description: "Insira um motivo para banir o usuario",
      type: Discord.ApplicationCommandOptionType.String,
      required: false
    }
  ],

  run: async (client, interaction) => {
    let userr = interaction.options.getUser("usuario");
    let user = interaction.guild.members.cache.get(userr.id);
    
    let userAutor = interaction.user;
    
    let motivo = interaction.options.getString("motivo");
    if(!motivo) motivo = "Não definido"


    if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
      interaction.reply({ content: `Você não possui permissão para utilizar este comando`, ephemeral: true });
      
    }

    if(interaction.user.id === userAutor.id) {
      interaction.reply({ content: `Você não pode se banir`, ephemeral: true });
    }

    if(interaction.user.id === client.user.id) {
      interaction.reply({ content: `Você não pode me banir`, ephemeral: true });
    }

    const embed = new Discord.EmbedBuilder()
       .setTitle(`<:ban:1069341944255539280> | Banimento`)
    .setColor(`Green`)
    .addField(`Usuario Banido:`, `${user} \`${user.id}\``, true)
    .addField(`Moderador Responsável:`, userAutor, true)
    .addField(`Motivo:`, motivo, true)
    .setFooter(`© ${client.user.username} 2024 - Todos os Direitos Reservados`)
    .setTimestamp();

    let erro = new Discord.EmbedBuilder()
     .setTitle(`<:erro:1069341944255539280> | Erro`)
    .setColor("Red")
    .setDescription(`Ocorreu um erro ao tentar banir o usuário ${user}`)
    .setFooter(`© ${client.user.username} 2024 - Todos os Direitos Reservados!`)
    .setTimestamp();

    user.ban({ reason: [motivo] }).then(() => {
      interaction.reply({ embeds: [embed] })
    }).catch(e => {
      interaction.reply({ embeds: [erro] })
  })

  }
}