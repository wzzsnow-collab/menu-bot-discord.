
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
    titulo: '<:Superviso:1558895037608366170> Supervisão',
    descricao:
      '<:Superviso:1558895037608366170> **Supervisão:**\n\n' +
      '<@1511423848459800668>: Responsável por auxiliar diretamente o Lobão em questões relacionadas ao Discord, contribuindo para a organização e manutenção do servidor. Atua no gerenciamento e na organização dos canais, configuração e ajuste de cargos e permissões, resolução de problemas técnicos e administrativos, além de prestar suporte aos membros da equipe sempre que necessário. Também auxilia na manutenção da estrutura do servidor, buscando garantir um ambiente organizado, funcional e adequado às necessidades da administração.\n\n' +
      '<@1444057630724063292>: Responsável por auxiliar o Lobão e os proprietários na administração geral do Discord, colaborando para o bom funcionamento e a organização do servidor. Atua no gerenciamento de canais, organização da estrutura interna, configuração e manutenção de cargos e permissões, resolução de problemas e suporte geral à equipe administrativa. Também contribui para a aplicação das diretrizes estabelecidas pelos responsáveis, auxilia na identificação de dificuldades internas e trabalha para manter a organização, a eficiência e a estabilidade do servidor. Além disso, presta assistência nas demandas administrativas e colabora com os demais membros da equipe para garantir que as atividades sejam realizadas de maneira organizada e eficiente.'
  },

  manager: {
    titulo: '<:Criador:1558896039484727347> Manager e criadores',
    descricao:
      '**Manager:** <@1517677363268419627>\n' +
      'Responsável pela liderança e organização de toda a administração do servidor. Atua diretamente no comando da equipe administrativa, auxilia nas vendas e no suporte do Exército, garantindo que os serviços sejam realizados de maneira eficiente e organizada. Também presta assistência ao Duque em questões relacionadas ao Discord, auxiliando na resolução de problemas, na organização interna e na manutenção do bom funcionamento do servidor.\n\n' +
      '**Criador:** <@1531124763651735556>\n' +
      'Fundador e proprietário absoluto do servidor, responsável pela sua criação, desenvolvimento e direção geral. Possui autoridade máxima sobre todas as decisões administrativas e organizacionais, estando acima de todos os demais cargos e membros da equipe. É responsável por definir os rumos do servidor, estabelecer diretrizes, supervisionar a administração e garantir que os objetivos e padrões estabelecidos sejam mantidos. Nenhum outro cargo possui autoridade superior à do Criador.'
  }
};

client.once('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
  console.log('Comando !menu ativado!');
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (message.content.trim().toLowerCase() !== '!menu') return;

  try {
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
            id: '1558895037608366170',
            name: 'Superviso'
          }
        },
        {
          label: 'Manager e criadores',
          value: 'manager',
          description: 'Conheça a direção e os criadores',
          emoji: {
            id: '1558896039484727347',
            name: 'Criador'
          }
        }
      ]);

    const embed = new EmbedBuilder()
      .setColor(verde)
      .setDescription(
        '## -# **Conheça a equipe responsável pela condução do Quartel Militar do Exército** <:martelo_adm:1558153039645511830>\n' +
        '-# Nesta seção estão reunidos os integrantes que atuam diretamente na **administração, organização, supervisão e desenvolvimento da comunidade**, contribuindo para o funcionamento de seus setores e para a manutenção de sua estrutura.\n' +
        '-# **Cada membro possui uma função específica dentro da Administração**, exercendo suas atribuições conforme sua área de atuação e contribuindo para o desenvolvimento contínuo do Exército Brasileiro.'
      );

    await message.channel.send({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(menu)
      ]
    });

    console.log('Menu enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao executar !menu:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (
    !interaction.isStringSelectMenu() ||
    interaction.customId !== 'menu_cargos'
  ) {
    return;
  }

  try {
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

    console.log('Categoria selecionada:', interaction.values[0]);
  } catch (error) {
    console.error('Erro ao responder à categoria:', error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'Ocorreu um erro ao abrir esta categoria.',
        flags: MessageFlags.Ephemeral
      }).catch(console.error);
    }
  }
});

client.login(token).catch(error => {
  console.error('Erro ao conectar o bot:', error);
});
