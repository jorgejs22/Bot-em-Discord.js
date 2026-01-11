const Discord = require("discord.js")


module.exports = {

  name: "help", // Coloque o nome do comando

  description: "Painel de comandos do bot.", // Coloque a descrição do comando

  type: Discord.ApplicationCommandType.ChatInput,



  run: async (client, interaction) => {



    let embed_painel = new Discord.EmbedBuilder()

    .setColor("Aqua")

    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynmiac: true }) })

    .setDescription(`**Olá ${interaction.user}, eu sou o __OneBot__ <:emoji_13:1046384971092328478> !
Veja meus comandos clicando nos Menu's Abaixo.:**

Aviso: Os Comandos Que Estiverem em <:online:1011055332753158215>  Estão Funcionando, os Comandos Que Estiverem Em <:offline:1011055462747213844> Não Estão funcionando E Os que Estiverem Em <:manuteno:1011055405151047730> Estão Em Manutenção.`);



    let embed_utilidade = new Discord.EmbedBuilder()

    .setColor("Aqua")

    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynmiac: true }) })

    .setDescription(`Olá ${interaction.user}, veja meus comandos de **utilidade** abaixo:
    <:slash:1022902893793251328>ping\n<:slash:1022902893793251328>help (Retorna esse painel).`);



    let embed_diversao = new Discord.EmbedBuilder()

    .setColor("Aqua")

    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynmiac: true }) })

    .setDescription(`Olá ${interaction.user}, veja meus comandos de **diversão** abaixo:
    Em Desenvolvimento...`);



    let embed_adm = new Discord.EmbedBuilder()

    .setColor("Aqua")

    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynmiac: true }) })

    .setDescription(`Olá ${interaction.user}, veja meus comandos de **administração** abaixo:
<:slash:1022902893793251328> ban <usuario> <Motivo>
<:slash:1022902893793251328> sorteio <prêmio> <descrição do prêmio> <tempo>\n<:slash:1022902893793251328> clear <quantidade>`);



    let painel = new Discord.ActionRowBuilder().addComponents(

        new Discord.SelectMenuBuilder()

            .setCustomId("painel_help")

            .setPlaceholder("Veja meus comandos!")

            .addOptions(

                {

                    label: "Painel Inicial",

                    //description: "",

                    emoji: "📖",

                    value: "painel"

                },

                {

                    label: "Utilidade",

                    description: "Veja meus comandos de utilidade.",

                    emoji: "✨",

                    value: "utilidade"

                },

                {

                    label: "Diversão",

                    description: "Veja meus comandos de diversão.",

                    emoji: "😅",

                    value: "diversao"

                },

                {

                    label: "Administração",

                    description: "Veja meus comandos de administração.",

                    emoji: "🔨",

                    value: "adm"

                }

            )

    )



    interaction.reply({ embeds: [embed_painel], components: [painel], ephemeral: true }).then( () => {

        interaction.channel.createMessageComponentCollector().on("collect", (c) => {

            let valor = c.values[0];



            if (valor === "painel") {

                c.deferUpdate()

                interaction.editReply({ embeds: [embed_painel] })

            } else if (valor === "utilidade") {

                c.deferUpdate()

                interaction.editReply({ embeds: [embed_utilidade] })

            } else if (valor === "diversao") {

                c.deferUpdate()

                interaction.editReply({ embeds: [embed_diversao] })

            } else if (valor === "adm") {

                c.deferUpdate()

                interaction.editReply({ embeds: [embed_adm] })

            }

        })

    })





    

  }

}