const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const db = require("quick.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-item")
    .setDescription("Adicione itens à Loja!")
    .addStringOption(option =>
      option.setName("nome")
        .setDescription("Um nome para o item")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("icone")
        .setDescription("Um emoji para o item")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("preço")
        .setDescription("Um preço para o item")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("descrição")
        .setDescription("Uma descrição para o item")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("estoque")
        .setDescription("Quantidade de itens no estoque")
        .setRequired(false)),

  async execute(interaction) {
    const nome = interaction.options.getString("nome");
    const icone = interaction.options.getString("icone");
    const preçoRaw = interaction.options.getString("preço");
    const descrição = interaction.options.getString("descrição");
    const estoqueRaw = interaction.options.getString("estoque") || "0";

    const servidor = interaction.guild.id;

    // Conversão e validação
    const preço = Number(preçoRaw);
    const estoque = Number(estoqueRaw);

    if (isNaN(preço) || preço < 0) {
      return interaction.reply({
        content: "❌ O preço deve ser um número válido.",
        ephemeral: true
      });
    }

    if (isNaN(estoque) || estoque < 0) {
      return interaction.reply({
        content: "❌ O estoque deve ser um número válido.",
        ephemeral: true
      });
    }

    const item = {
      nome,
      icone,
      preço,
      descrição,
      estoque
    };

    let symbol = await db.get(`currencySymbol_${servidor}`) || "🪙";
    
    // Adicionar ao banco
    db.push(`itens_${servidor}`, item);

    const embed = new EmbedBuilder()
      .setTitle(`🛒 Item Adicionado!`)
      .setColor("Green")
      .setDescription(`O item **${nome}** foi adicionado à loja com sucesso!`)
      .addFields(
        { name: "📝 Nome", value: nome, inline: true },
        { name: "💠 Ícone", value: icone, inline: true },
        { name: "💰 Preço", value: `${preço} ${symbol}`, inline: true },
        { name: "📄 Descrição", value: descrição, inline: false },
        { name: "📦 Estoque", value: `${estoque}`, inline: true }
      )
      .setFooter({ text: `Adicionado por ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
  }
};