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
    .setName("loja")
    .setDescription("Veja os itens disponíveis na loja!"),

  async execute(interaction) {
    const servidor = interaction.guild.id;

    let items = db.get(`itens_${servidor}`);

    let symbol = await db.get(`currencySymbol_${servidor}`) || "🪙";
    
    if (!Array.isArray(items) || items.length === 0) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Loja")
            .setDescription("Nenhum item disponível na loja!")
            .setColor("Red")
        ],
        ephemeral: false
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle(`🛒 Loja do Servidor`)
        .setColor("Random")
        .addFields([
          {
            name: "Itens disponíveis:",
            value: items
              .map(item => `${item.icone} **${item.nome}** - ${item.preço} ${symbol}\n_${item.descrição}_ (Estoque: ${item.estoque})`)
              .join("\n"),
            inline: false
          }
        ]);

      return interaction.reply({
        embeds: [embed],
        ephemeral: false
      });
    }
  }
};