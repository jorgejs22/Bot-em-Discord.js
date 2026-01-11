const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
      data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Veja informações sobre o bot!"),

        async execute(interaction) {


          let client = interaction.client
          
           let dono = "vlad_dracull.";
    let usuarios = client.users.cache.size;
    let servidores = client.guilds.cache.size;
    let linguagem = `[JavaScript](https://pt.wikipedia.org/wiki/JavaScript)`;
      let livraria = `[Discord.js](https://pt.wikipedia.org/wiki/Node.js)`;
      let ping = client.ws.ping;
      let bot = client.user.tag;
      let avatar_bot = client.user.displayAvatarURL({ dynamic: true });
  let embed = new EmbedBuilder()
    .setColor(`#ffffff`)
    .setAuthor({ name: bot, iconURL: avatar_bot })
    .setFooter({ text: `Ping atual de ${ping}ms`, iconURL: avatar_bot })
    .setTimestamp(new Date())
    .setThumbnail(avatar_bot)
    .setDescription(`Olá ${interaction.user}, Abaixo você verá minhas informações e Obrigado por me utilizar!\n\n<:discooooord:810321998920024075> | Versão: 1.6.0 (Beta)\n<:staff:1021090313076482088>**|** Meu Desenvolvedor: ${client.users.cache.get[dono]}\n<:Mundo_Icon:807366305577173032> | Servidores: \`${servidores}\`\n<:users_Icon:807538787936632852> | Usuários: \`${usuarios}\`\n<:javascript:803224949728084008> | Linguagem: Fui criado em ${linguagem} Utilizando <:nodejs:805403574787899393> [Node.js](https://pt.wikipedia.org/wiki/Node.js)\<:DiscordJS_icon:805034915196043284> | Livraria: \`${livraria}\`\n\n  Hospedagem: [Repl.it](https://www.replit.com/) `)

           await interaction.reply({ embeds: [embed] });
        }
}