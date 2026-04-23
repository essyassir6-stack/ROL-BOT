const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

const CONFIG = {
  TOKEN: process.env.TOKEN,

  SERVER_NAME: '𝘾𝙅 & 𝙍𝘾𝙎 𝙘𝙧𝙖𝙘𝙠 ',
  SERVER_IMAGE_URL: 'https://media.discordapp.net/attachments/1480969775344652470/1496647110525845625/DF7E4FDA-66D3-49FF-BD5E-7C746253AE2D.png?ex=69eaa4bd&is=69e9533d&hm=9ff7a4eac4f3558b2d6df718155617fbfaf6dc6d4e1ac90c58173320159faf77&=&format=webp&quality=lossless&width=1229&height=819',

  CHANNEL_ID: '1496827212631117925',

  ROLES: {
    '⛏️ Minecraft': '1496825448892465202',
    '🎯 Valorant': '1496825506501365845',
    '🏆 League of Legends': '1496825631231709316',
    '✨ Genshin Impact': '1496825687913271437',
    '🔫 Call of Duty': '1496825756343603331',
    '🪂 Fortnite': '1496825831266189344',
    '🔥 Apex Legends': '1496825929966686250',
    '🧱 Roblox': '1496825967799308352',
    '👾 Among Us': '1496826081288654868',
    '💣 Counter-Strike 2': '1496826179473375283'
  }
};

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(CONFIG.CHANNEL_ID).catch(() => null);
  if (!channel) return console.log("❌ Channel not found");

  // 🔥 Embed كبير واحترافي
  const embed = new EmbedBuilder()
    .setTitle(`🔥 ${CONFIG.SERVER_NAME}`)
    .setDescription(`
🎮 **Choose your games below**

> Click a button to **get/remove** your role
    `)
    .setColor(0xFF0000)
    .setImage(CONFIG.SERVER_IMAGE_URL) // 👈 صورة كبيرة
    .setThumbnail(CONFIG.SERVER_IMAGE_URL) // 👈 صغيرة فوق
    .setFooter({ text: "GLORIA Community • Role System" });

  const games = Object.keys(CONFIG.ROLES);
  const rows = [];

  for (let i = 0; i < games.length; i += 5) {
    const row = new ActionRowBuilder();

    games.slice(i, i + 5).forEach(game => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`role_${game}`)
          .setLabel(game)
          .setStyle(ButtonStyle.Danger) // 🔥 لون أحمر
      );
    });

    rows.push(row);
  }

  await channel.send({
    embeds: [embed],
    components: rows
  });
});

// 🎮 system ديال roles
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (!interaction.customId.startsWith('role_')) return;

  const game = interaction.customId.replace('role_', '');
  const roleId = CONFIG.ROLES[game];

  const role = interaction.guild.roles.cache.get(roleId);
  const member = interaction.member;

  if (!role) {
    return interaction.reply({ content: "❌ Role not found", ephemeral: true });
  }

  try {
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(role);
      await interaction.reply({ content: `❌ Removed ${game}`, ephemeral: true });
    } else {
      await member.roles.add(role);
      await interaction.reply({ content: `✅ Added ${game}`, ephemeral: true });
    }
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "❌ Error", ephemeral: true });
  }
});

client.login(CONFIG.TOKEN);
