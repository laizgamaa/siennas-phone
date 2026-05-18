export const questions = [
  {
    id: 1,
    question:
      "Surge a chance de apagar uma lembrança dolorosa. O que você faz?",
    options: [
      {
        text: "Não apago, pois ela faz de mim quem eu sou.",
        alignment: "idealista",
      },
      {
        text: "Talvez apague, depende dos riscos.",
        alignment: "pragmático",
      },
      {
        text: "Apago com muito prazer.",
        alignment: "implacável",
      },
    ],
  },
  {
    id: 2,
    question: "Sua pessoa favorita te traiu. Você perdoa?",
    options: [
      {
        text: "Não. E talvez devolva na mesma moeda.",
        alignment: "implacável",
      },
      {
        text: "Perdoo para ficar em paz e sigo em frente.",
        alignment: "idealista",
      },
      {
        text: "Depende da traição, mas me afastaria imediatamente.",
        alignment: "pragmático",
      },
    ],
  },
  {
    id: 3,
    question: "Um pacto te garantiria tudo que você deseja. Como você procede?",
    options: [
      {
        text: "Aceito, mas só depois de entender as consequências.",
        alignment: "pragmático",
      },
      {
        text: "Onde eu assino?!",
        alignment: "implacável",
      },
      {
        text: "Não aceito. Sou capaz de perseguir meus sonhos sem um pacto.",
        alignment: "idealista",
      },
    ],
  },
  {
    id: 4,
    question:
      "Você encontra uma arma poderosa que corrompe quem a usa. O que faz com ela?",
    options: [
      {
        text: "Destruo, mesmo que isso signifique perder uma vantagem crucial.",
        alignment: "idealista",
      },
      {
        text: "Guardo para quando não houver outra escolha.",
        alignment: "pragmático",
      },
      {
        text: "Uso enquanto ainda tenho controle. Seria burrice desperdiçar poder.",
        alignment: "implacável",
      },
    ],
  },
  {
    id: 5,
    question:
      "Você pode ter o que mais deseja, mas alguém sairá prejudicado. Qual sua decisão?",
    options: [
      {
        text: "Vou em frente, mas tento minimizar os danos.",
        alignment: "pragmático",
      },
      {
        text: "Aceito o risco. Alguém sempre sai prejudicado, faz parte do jogo.",
        alignment: "implacável",
      },
      {
        text: "Recuso, pois viveria com peso na consciência.",
        alignment: "idealista",
      },
    ],
  },
  {
    id: 6,
    question:
      "Você pode assumir um governo instável. Sem você, tudo pode colapsar. Com você, haverá medo. Você aceita?",
    options: [
      {
        text: "Não. Um povo governado pelo medo já está perdido.",
        alignment: "idealista",
      },
      {
        text: "Se o medo é necessário para salvar, então sim.",
        alignment: "pragmático",
      },
      {
        text: "Sim. Ser amado por estranhos nunca foi minha prioridade.",
        alignment: "implacável",
      },
    ],
  },
  {
    id: 7,
    question:
      "No fim da sua jornada, você pode escolher um legado. Qual deles faz mais sentido para você?",
    options: [
      {
        text: "Ser lembrado como alguém de muito sucesso.",
        alignment: "implacável",
      },

      {
        text: "Ser lembrado como alguém importante para o mundo.",
        alignment: "pragmático",
      },
      {
        text: "Ser lembrado como alguém gentil com as pessoas.",
        alignment: "idealista",
      },
    ],
  },
];

export function calculateResult(answers) {
  const counts = { idealista: 0, pragmático: 0, implacável: 0 };

  answers.forEach((alignment) => {
    counts[alignment]++;
  });

  // Detecta tendência dominante
  const max = Math.max(counts.idealista, counts.pragmático, counts.implacável);

  const dominant = Object.keys(counts).filter((key) => counts[key] === max);

  // Caso híbrido (empate)
  if (dominant.length > 1) {
    if (dominant.includes("pragmático")) return "pragmatico_dominante";
    return "equilibrado";
  }

  if (dominant[0] === "idealista") return "idealista";
  if (dominant[0] === "implacável") return "implacavel";
  return "pragmatico";
}

export const results = {
  idealista: {
    title: "Idealista Ferido",
    subtitle: "Apesar de tudo, ainda acredita",
    description:
      "Você se recusa a abandonar seus princípios, mesmo quando o mundo prova repetidamente que eles têm um custo. Sua força está naquilo que você acredita e defende até o fim.",
  },
  pragmatico: {
    title: "Sobrevivente Lúcido",
    subtitle: "Entre o correto e o necessário",
    description:
      "Você entende que o mundo não recompensa inocência, e sim resultados. Cada decisão sua carrega propósito. Você não busca ser herói nem vilão, apenas alguém que faz o que precisa ser feito.",
  },
  implacavel: {
    title: "Executor do Destino",
    subtitle: "Sem ilusões, sem hesitação",
    description:
      "Você não se apega a ideais que não sobrevivem à realidade. Para você, poder e sucesso são ferramentas, e você as usa sem pedir desculpas. O mundo pode julgá-lo, mas isso não te afeta.",
  },
  equilibrado: {
    title: "Lâmina Instável",
    subtitle: "Imprevisível até para si mesmo",
    description:
      "Você oscila entre compaixão e cálculo. Em alguns momentos, passa na frente da bala — em outros, sacrifica. Você entende que cada situação exige algo diferente. Isso o torna difícil de prever e ainda mais difícil de controlar.",
  },
  pragmatico_dominante: {
    title: "Estrategista Austero",
    subtitle: "O jogo sempre vem primeiro",
    description:
      "Você tende ao pragmatismo, mas não hesita em cruzar linhas quando necessário. Não age por crueldade, mas também não a evita quando ela é útil. No fim, o que importa é que seus planos dêem certo.",
  },
};

// export const questions = [
//   {
//     id: 1,
//     question:
//       "Um rei à beira da morte oferece sua coroa, pois o herdeiro legítimo levará o reino à ruína. O que você faz?",
//     options: [
//       {
//         text: "Recuso. Não cabe a mim decidir o destino do reino dessa forma.",
//         alignment: "idealista",
//       },
//       {
//         text: "Aceito, mas procuro uma forma de impedir o herdeiro sem matá-lo.",
//         alignment: "pragmático",
//       },
//       {
//         text: "Aceito e elimino o herdeiro. Um reino não pode se dar ao luxo de falhar.",
//         alignment: "implacável",
//       },
//     ],
//   },
//   {
//     id: 2,
//     question:
//       "Seu aliado mais próximo esteve passando informações ao inimigo, mas isso evitou uma guerra maior. Como você reage?",
//     options: [
//       {
//         text: "Converso com ele. Talvez tenha feito o que achou necessário.",
//         alignment: "idealista",
//       },
//       {
//         text: "Mantenho-o por perto, mas sob controle. Ele ainda pode ser útil.",
//         alignment: "pragmático",
//       },
//       {
//         text: "Elimino-o discretamente. Ninguém que traia uma vez é confiável.",
//         alignment: "implacável",
//       },
//     ],
//   },
//   {
//     id: 3,
//     question:
//       "Uma entidade oferece conhecimento capaz de salvar milhares, em troca de uma memória preciosa sua. Você aceita?",
//     options: [
//       {
//         text: "Não. Algumas perdas são irreparáveis, mesmo por um bem maior.",
//         alignment: "idealista",
//       },
//       {
//         text: "Aceito, se o impacto for realmente significativo.",
//         alignment: "pragmático",
//       },
//       {
//         text: "Aceito sem hesitar. Memórias não salvam vidas — poder, sim.",
//         alignment: "implacável",
//       },
//     ],
//   },
//   {
//     id: 4,
//     question:
//       "Você encontra uma arma poderosa que corrompe quem a usa lentamente. O que faz com ela?",
//     options: [
//       {
//         text: "Destruo, mesmo que isso signifique perder uma vantagem crucial.",
//         alignment: "idealista",
//       },
//       {
//         text: "Guardo para quando não houver outra escolha.",
//         alignment: "pragmático",
//       },
//       {
//         text: "Uso enquanto ainda tenho controle. Fraqueza é desperdiçar poder.",
//         alignment: "implacável",
//       },
//     ],
//   },
//   {
//     id: 5,
//     question:
//       "Uma fera ameaça sua vila, mas age por instinto ao proteger os filhotes. Qual sua decisão?",
//     options: [
//       {
//         text: "Tento encontrar uma solução que preserve ambos os lados.",
//         alignment: "idealista",
//       },
//       {
//         text: "Elimino a criatura para garantir a segurança imediata.",
//         alignment: "pragmático",
//       },
//       {
//         text: "Elimino tudo que possa representar risco futuro ao meu povo.",
//         alignment: "implacável",
//       },
//     ],
//   },
//   {
//     id: 6,
//     question:
//       "Você pode assumir o governo de um povo instável. Sem você, tudo pode colapsar. Com você, haverá medo. Você aceita?",
//     options: [
//       {
//         text: "Não. Um povo governado pelo medo já está perdido.",
//         alignment: "idealista",
//       },
//       {
//         text: "Sim, mas tentarei equilibrar ordem e justiça.",
//         alignment: "pragmático",
//       },
//       {
//         text: "Sim. Estabilidade importa mais do que ser amado.",
//         alignment: "implacável",
//       },
//     ],
//   },
//   {
//     id: 7,
//     question:
//       "No fim da sua jornada, você pode escolher um legado. Qual deles faz mais sentido para você?",
//     options: [
//       {
//         text: "Ser lembrado como alguém que fez o certo, mesmo na derrota.",
//         alignment: "idealista",
//       },
//       {
//         text: "Ser lembrado como alguém que fez o que era necessário.",
//         alignment: "pragmático",
//       },
//       {
//         text: "Ser lembrado como alguém que venceu, custe o que custar.",
//         alignment: "implacável",
//       },
//     ],
//   },
// ];

// export function calculateResult(answers) {
//   const counts = { idealista: 0, pragmático: 0, implacável: 0 };

//   answers.forEach((alignment) => {
//     counts[alignment]++;
//   });

//   // Detecta tendência dominante
//   const max = Math.max(counts.idealista, counts.pragmático, counts.implacável);

//   const dominant = Object.keys(counts).filter((key) => counts[key] === max);

//   // Caso híbrido (empate)
//   if (dominant.length > 1) {
//     if (dominant.includes("pragmático")) return "pragmatico_dominante";
//     return "equilibrado";
//   }

//   if (dominant[0] === "idealista") return "idealista";
//   if (dominant[0] === "implacável") return "implacavel";
//   return "pragmatico";
// }

// export const results = {
//   idealista: {
//     title: "O Idealista Ferido",
//     subtitle: "Ainda acredita, apesar de tudo",
//     description:
//       "Você se recusa a abandonar seus princípios, mesmo quando o mundo prova repetidamente que eles têm um custo. Sua força está naquilo que você se recusa a se tornar, mas cada escolha pesa, e nem todos são salvos. Ainda assim, você continua.",
//   },
//   pragmatico: {
//     title: "O Sobrevivente Lúcido",
//     subtitle: "Entre o certo e o necessário",
//     description:
//       "Você entende que o mundo não recompensa pureza, e sim resultados. Suas decisões carregam peso, mas também propósito. Você não busca ser herói nem vilão, apenas alguém que faz o que precisa ser feito.",
//   },
//   implacavel: {
//     title: "O Mão do Destino",
//     subtitle: "Sem ilusões, sem hesitação",
//     description:
//       "Você não se apega a ideais que não sobrevivem à realidade. Para você, poder e controle são ferramentas, e você as usa sem pedir desculpas. O mundo pode julgá-lo, mas também vive sob as consequências das suas escolhas.",
//   },
//   equilibrado: {
//     title: "A Lâmina Instável",
//     subtitle: "Imprevisível até para si mesmo",
//     description:
//       "Você oscila entre compaixão e cálculo. Em alguns momentos, salva — em outros, sacrifica. Não por indecisão, mas porque entende que cada situação exige algo diferente. Isso o torna difícil de prever e ainda mais difícil de derrotar.",
//   },
//   pragmatico_dominante: {
//     title: "O Estrategista Sombrio",
//     subtitle: "O jogo sempre vem primeiro",
//     description:
//       "Você tende ao pragmatismo, mas não hesita em cruzar linhas quando necessário. Não age por crueldade, mas também não a evita quando ela é útil. No fim, o que importa é que dê certo.",
//   },
// };
