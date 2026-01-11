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
        .setName("trabalhar")
        .setDescription("Trabalhe para ganhar dracmas!"),

     async execute(interaction) {
         
         const userId = interaction.user.id;
        const servidor = interaction.guild.id;

         const embed = new EmbedBuilder()
            .setTitle("Trabalho")
            .setDescription("Clique no botão abaixo para trabalhar e ganhar dracmas!")
            .setColor("Random")
            .setFooter({ text: "Você só pode trabalhar a cada 10 minutos!" });

        const trabalho = new ButtonBuilder()
           .setCustomId("trabalho")
           .setLabel("Trabalhar")
           .setStyle(ButtonStyle.Success);

       const row = new ActionRowBuilder().addComponents(trabalho);
       
       const reply = await interaction.reply({
           embeds: [embed],
           components: [row],
           ephemeral: false
       })

       const collector = reply.createMessageComponentCollector({
           componentType: ComponentType.Button,
           time: 600000
       })

       collector.on("collect", async i => {
           if (i.user.id !== interaction.user.id) return;
           
           const cooldown = await db.get(`cooldown_${userId}`);
           const currentTime = Date.now();
           const cooldownTime = 10 * 60 * 1000;
           
           if (cooldown && currentTime - cooldown < cooldownTime) {
               const tempoRestante = cooldownTime - (currentTime - cooldown);
               const minutosRestantes = Math.ceil(tempoRestante / (60 * 1000));
               const segundosRestantes = Math.ceil((tempoRestante % (60 * 1000)) / 1000);

               await i.reply({
                   content: `Você já trabalhou recentemente! Tente novamente em ${minutosRestantes} minutos e ${segundosRestantes} segundos.`,
                   ephemeral: true
               });
               await db.subtract(`cooldown_${userId}`, tempoRestante);
               return;
           }

           // Work logic - only executes if not on cooldown
           let cidade = ["Nirvrade", "Termópilas", "Tebas", "Argos", "Houz", "Zeruz", "Leveron", "Virteskem"];
           let local = cidade[Math.floor(Math.random() * cidade.length)];
           let opcoesTrabalho = [];
           
         if (local === "Virteskem" || local === "Argos") {
    opcoesTrabalho = ["Lenhador", "Carpinteiro", "Soldado"];
} else if (local === "Nirvrade" || local === "Leveron" || local === "Termópilas") {
    opcoesTrabalho = ["Minerador", "Construtor", "Soldado", "Pesquisador", "Médico"];
} else {
    // Cidades restantes: Zeruz, Houz, Tebas
    opcoesTrabalho = ["Ferreiro", "Mensageiro", "Cavaleiro"];
         }
           
           let serviço = opcoesTrabalho[Math.floor(Math.random() * opcoesTrabalho.length)];
           let dracmas = Math.floor(Math.random() * 80) + 1;
           
           await db.add(`dracma_${servidor}_${userId}`, dracmas);
           let totalDracmas = await db.get(`dracma_${servidor}_${userId}`) || 0;
           const embedNew = new EmbedBuilder()
               .setTitle(`Trabalho`)
               .setColor("Green")
               .setDescription(`Você trabalhou em ${local} como ${serviço} e ganhou ${dracmas} Dracmas pelos seus serviços!\n💰 Você agora tem ${totalDracmas.toLocaleString()} Dracmas!`);

           const trabalhoNovo = new ButtonBuilder()
               .setCustomId("trabalho")
               .setLabel("Trabalhar")
               .setStyle(ButtonStyle.Success);

           const rowNova = new ActionRowBuilder().addComponents(trabalhoNovo);
           
           await db.set(`cooldown_${userId}`, currentTime);

           let usuarios = await db.get("usuarios_dracma");

// Garante que é um array antes de continuar
if (!Array.isArray(usuarios)) {
    usuarios = [];
}

if (!usuarios.includes(userId)) {
    usuarios.push(userId);
    await db.set("usuarios_dracma", usuarios);
}
             
           await i.update({
               embeds: [embedNew],
               components: [rowNova]
           });
       })
     }
}