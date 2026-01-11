// Polyfill for ReadableStream in older Node.js versions
if (!global.ReadableStream) {
  global.ReadableStream = require('stream/web').ReadableStream;
}

// Suppress deprecation warnings
process.removeAllListeners('warning');

const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Carregar comandos de pasta Comandos
const comandosPath = path.join(__dirname, "Comandos");
const categorias = fs.readdirSync(comandosPath);

for (const categoria of categorias) {
  const arquivosComando = fs.readdirSync(`${comandosPath}/${categoria}`).filter(file => file.endsWith('.js'));
  for (const file of arquivosComando) {
    const comando = require(`./Comandos/${categoria}/${file}`);
    if (comando.data && comando.execute) {
      client.commands.set(comando.data.name, comando);
    }
  }
}

// Deploy dos comandos ao entrar
client.once(Events.ClientReady, async () => {
  console.log(`✅ Logado como ${client.user.tag}`);

  // Registra os comandos em todos os servidores
  const slashCommands = client.commands.map(cmd => cmd.data.toJSON());
  const guilds = client.guilds.cache.map(g => g.id);
  for (const guildId of guilds) {
    const guild = client.guilds.cache.get(guildId);
    if (guild) await guild.commands.set(slashCommands);
  }
});

// Lida com interações
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const comando = client.commands.get(interaction.commandName);
  if (!comando) return;

  try {
    await comando.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "❌ Ocorreu um erro ao executar esse comando.",
      ephemeral: true
    });
  }
});

client.login(config.token);