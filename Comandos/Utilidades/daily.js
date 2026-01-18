const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, EmbedBuilder,
    ComponentType
} = require("discord.js");
const db = require("quick.db");

 module.exports = {
    data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Colete sua recompensa diária em dracmas")
    .addStringOption(option => 
        option.setName("Padrão")
        .setDescription("Colete sua recompensa diária (Sem benefícios extras")
        .setRequired(false))
        .addStringOption(option => 
            option.setName("Premium")
            .setDescription("Colete sua recompensa diária com benefícios premium (Se você for um usuário premium")
            .setRequired(false)),
            async execute(interaction, client) {
                const userId = interaction.user.id;
                const servidor = interacrion.guild.id;
                const dailyAmount = Math.random() * (500 - 100) + 100;
                const premiumAmount = Math.random() * (1000 - 600) + 600;
                
                const lastDaily = db.get(`lastDaily_${servidor}_${userId}`);
                const now = Date.now();
                const cooldown = 24 * 60 * 60 * 1000;
                const option = interaction.options.getString("Padrão") || interaction.options.getString("Premium");
                const tem_premium = db.get(`premiun_${userId}`);
                if (lastDaily && now - lastDaily < cooldown) {
                    const tempoRestante = cooldown - (now - lastDaily);
                    const horas = Math.floor(tempoRestante / (60 * 60 * 1000))
                    const minutos = Math.floor(tempoRestante % (60 * 60 * 1000) / (60 * 1000));
                    const segundos = Math.floor(tempoRestante % (60 * 1000) / 1000);

                    return interaction.reply({ 
                        content: "🔥 Ei, ei, ei! Dá uma segurada ae! Você ainda não pode coletar sua recompensa diária. Tempo restante: ${horas} horas, ${minutos} minutos e ${segundos} segundos!",
                         ephemetal: true
                    })
                } 
                    if (option === "Premium" && !tem_premium) {
                        return interaction.reply({
                            content: "❌ Ops! Verifiquei aqui e parece que você não é um usuário premium. Para coletar a recompensa diária premium, você precisa ser um usuário premium.",
                            ephenetal: true
                        })
                    } else if (option === "Premium" && tem_premium) {
                        const embedPremium = new EmbedBuilder()
                              .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), dynamic: true })
                              .setDescription("🎉 Parabéns! Você coletou sua recompensa diária premium!")
                              .addFields(
                                { name: "💸 | Valor:", value: `${premiumAmount.toFixed(0)} dracmas`, inline: true }
                              )
                              .setFooter({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL(), dynamyc: true})
                              .setTimestamp();
                            db.add(`dracmas_${servidor}_${userId}`, premiumAmount);
                            db.set(`lastDaily_${servidor}_${userId}`, now);
                            
                      await interaction.reply({
                        embeds: [embedPremium],
                        ephemeral: false
                      })
                    }

                    if (option === "Padrão" && !tem_premium) {
                         const embedDaily = new EmbedBuilder()
                         .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), dynamic: true })
                          .setDescription("🎉 Parabéns! Você coletou sua recompensa diária!")
                             .addFields(
                            {  name: "💸 | Valor:", value: `${dailyAmount.toFixed(0)} dracmas`, inline: true }
                        )
                             .setFooter({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL(), dynamyc: true})
                             .setTimestamp();
                        
                             db.add(`dracmas_${servidor}_${userId}`, dailyAmount);
                             db.set(`lastDaily_${servidor}_${userId}`, now);

                             await interaction.reply({
                                embeds: [embedDaily],
                                ephemeral: false
                             })

                    }
                }
            }