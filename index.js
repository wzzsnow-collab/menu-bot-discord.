const {
  Client,
  GatewayIntentBits,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error('Configure DISCORD_TOKEN no FadeHost.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const verde = 0x064E3B;

const opcoes = {
  administracao: {
    titulo: '<:martelo_adm:1558153039645511830> Administração e moderação',
    descricao:
      '**Administrador:**\n' +
      '*Responsável por supervisionar os moderadores, o chat e os meios de comunicação do Discord, podendo aplicar banimentos e outras medidas.*\n\n' +
      '**Moderador:**\n' +
      '*Responsável por supervisionar o chat e auxiliar o administrador nas questões necessárias.*'
  },

  supervisao: {
    titulo: '<:supervisor:1558220611191312405> Supervisão',
    descricao:
      '<:supervisor:1558220611191312405> **Supervisão:**\n\n' +
      '<@1511423848459800668>: *Auxiliar do lobão em questões de discord e etc.*\n\n' +
      '<@1444057630724063292>: *Auxiliar do lobão e dos donos em questões de discord e etc.*'
  },

  manager: {
    titulo: '<:manager:1558220670788436000> Manager e criadores',
    descricao:
      '**Manager:** <@1517677363268419627>\n' +
      '*Chefe da administração, auxiliar de vendas e suporte do exército, além de auxiliar o duque em questões do Discord.*\n\n' +
      '**Criador:** <@1531124763651735556>\n' +
      '*É o dono do servidor, sem ninguém acima dele.*'
  }
};

client.once('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
  console.log('Comando !menu ativado!');
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;

  if (message.content.trim().toLowerCase() !== '!menu') return;

  const menu = new StringSelectMenuBuilder()
    .setCustomId('menu_cargos')
    .setPlaceholder('Selecione uma categoria...')
    .addOptions([
      {
        label: 'Administração e moderação',
        value: 'administracao',
        description: 'Funções do administrador e dos moderadores',
        emoji: {
          id: '1558153039645511830',
          name: 'martelo_adm'
        }
      },
      {
        label: 'Supervisão',
        value: 'supervisao',
        description: 'Informações sobre a supervisão',
        emoji: {
          id: '1558220611191312405',
          name: 'supervisor'
        }
      },
      {
        label: 'Manager e criadores',
        value: 'manager',
        description: 'Conheça a direção e os criadores',
        emoji: {
          id: '1558220670788436000',
          name: 'manager'
        }
      }
    ]);

  const embed = new EmbedBuilder()
    .setColor(verde)
    .setTitle('Central de cargos e hierarquia')
    .setDescription(
      'Selecione uma categoria no menu abaixo para consultar ' +
      'as funções e responsabilidades de cada cargo.'
    );

  await message.channel.send({
    embeds: [embed],
    components: [
      new ActionRowBuilder().addComponents(menu)
    ]
  });
});

client.on('interactionCreate', async interaction => {
  if (
    !interaction.isStringSelectMenu() ||
    interaction.customId !== 'menu_cargos'
  ) {
    return;
  }

  const opcao = opcoes[interaction.values[0]];
  if (!opcao) return;

  const embed = new EmbedBuilder()
    .setColor(verde)
    .setTitle(opcao.titulo)
    .setDescription(opcao.descricao)
    .setFooter({
      text: 'Informações oficiais • Hierarquia do servidor'
    });

  await interaction.reply({
    embeds: [embed],
    flags: MessageFlags.Ephemeral,
    allowedMentions: { parse: [] }
  });
});

client.login(token);
