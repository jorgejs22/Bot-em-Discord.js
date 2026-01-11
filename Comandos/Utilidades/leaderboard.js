const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder
} = require("discord.js");

const db = require("quick.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Veja o Ranking de pessoas mais ricas do servidor!"),

  async execute(interaction) {
    let usuarios = await db.get("usuarios_dracma");

    const servidor = interaction.guild.id;
    
    if (!Array.isArray(usuarios)) usuarios = [];

    // Garante que o autor esteja incluso no ranking
    const autorId = interaction.user.id;

    
    if (!usuarios.includes(autorId)) {
      usuarios.push(autorId);
      db.set("usuarios_dracma", usuarios);
    }

    const rankingCompleto = [];

    for (const userId of usuarios) {
      const value = await db.get(`dracma_${servidor}_${userId}`) || 0;
      rankingCompleto.push({ userId, value });
    }

    // Remove usuários com saldo 0 (opcional: comente essa linha se quiser mostrar todos)
    // rankingCompleto = rankingCompleto.filter(u => u.value > 0);

    if (rankingCompleto.length === 0) {
      const embed0 = new EmbedBuilder()
        .setTitle(`🏦 Leaderboard`)
        .setColor("Blue")
        .setDescription(`Ninguém tem dracmas no servidor!`);

      const row0 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("anterior0")
          .setLabel("↩️ Previous Page")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("proximo0")
          .setLabel("Next Page ↪️")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      );

      return interaction.reply({
        embeds: [embed0],
        components: [row0],
        ephemeral: false
      });
    }

    rankingCompleto.sort((a, b) => b.value - a.value);

    let currencySymbol = await db.get(`currencySymbol_${interaction.guild.id}`) || "🪙";
    let paginaAtual = 0;
    const itensPorPagina = 10;
    const server = interaction.guild.name;

    function gerarPaginas(pagina) {
      const inicio = pagina * itensPorPagina;
      const fim = inicio + itensPorPagina;
      const paginaDados = rankingCompleto.slice(inicio, fim);

      const texto = paginaDados.map((entry, index) =>
        `**${inicio + index + 1}** - <@${entry.userId}> - **${entry.value.toLocaleString()}** ${currencySymbol}`
      ).join("\n");

      return new EmbedBuilder()
        .setTitle(`🏦 Leaderboard`)
        .setDescription(texto)
        .setFooter({
          text: `Página ${pagina + 1} de ${Math.ceil(rankingCompleto.length / itensPorPagina)}`
        });
    }

    const anterior = new ButtonBuilder()
      .setCustomId("anterior")
      .setLabel("⬅️")
      .setStyle(ButtonStyle.Primary);

    const proximo = new ButtonBuilder()
      .setCustomId("proximo")
      .setLabel("➡️")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(anterior, proximo);

    const embed = gerarPaginas(paginaAtual);
    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000
    });

    collector.on("collect", async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: "Essa interação não é sua!",
          ephemeral: true
        });
      }

      const totalPaginas = Math.ceil(rankingCompleto.length / itensPorPagina);

      if (i.customId === "anterior" && paginaAtual > 0) {
        paginaAtual--;
      } else if (i.customId === "proximo" && paginaAtual < totalPaginas - 1) {
        paginaAtual++;
      }

      const novoEmbed = gerarPaginas(paginaAtual);
      await i.update({
        embeds: [novoEmbed],
        components: [row]
      });
    });
  }
};