// Todas as opções de nível 4 levam a este encerramento
const convergenceResponse =
  "Enfim, pense no que eu disse, monstrinho. O céu pode te prometer paz, mas eu sou o único que te dá o que você realmente deseja. Agora vá dormir... Te espero nos seus sonhos.";

export const kaiDecisionTree = {
  options: [
    // N1
    {
      label: "NÃO VAI NÃO!",
      kaiResponse:
        "Com medo, monstrinho? Já falei, eu não mordo. Só se você pedir, claro",
      options: [
        // N2
        {
          label: "Vou contar pro anjo!",
          kaiResponse:
            "Ela já não mandou você me bloquear? Anjos não operam milagres contra a sua vontade, sabia?",
          options: [
            // N3
            {
              label: "Você ESTÁ bloqueado! Por que não me deixa em paz?",
              kaiResponse:
                "Também prefiro conversar pessoalmente. O inferno é solitário demais sem você para me irritar",
              options: [
                // N4
                {
                  label: "O inferno é o seu lugar, não o meu",
                  kaiResponse:
                    "Ainda tentando se convencer de que não perdeu nada lá? Monstrinho...",
                  options: [
                    // N5
                    {
                      label: "Você se acha mesmo, né?",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label:
                        "O que eu queria mesmo ter perdido ainda está aqui me enchendo",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
                {
                  label: "Você não cansa de ser um pesadelo?",
                  kaiResponse: "E você não se cansa de sonhar comigo?",
                  options: [
                    // N5
                    {
                      label: "Acredite, se eu pudesse controlar, não sonharia",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "HA HA. Muito engraçado",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
              ],
            },
            {
              label: "Ela disse que você é minha ruína",
              kaiResponse:
                "Ela só quer te transformar numa boneca de porcelana. Eu prefiro você com garras",
              options: [
                // N4
                {
                  label: "Minhas garras são para me defender de você",
                  kaiResponse:
                    "Engraçado... Não é assim que você usa elas nos seus sonhos",
                  options: [
                    // N5
                    {
                      label: "Acredite, se eu pudesse controlar, não sonharia",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "HA HA. Muito engraçado",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
                {
                  label: "Pelo menos o céu me dá trégua",
                  kaiResponse:
                    "Que graça teria se eu sumisse da sua vida, monstrinho?",
                  options: [
                    // N5
                    {
                      label: "Vou fingir que você não perguntou isso",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "Ah, você não seria tão misericordioso",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Não tenho medo de você",
          kaiResponse:
            "Tô ouvindo seu coração daqui… Quer uma ajudinha para acalmar o pulso?",
          options: [
            // N3
            {
              label: "Você não tem nada melhor pra fazer?",
              kaiResponse:
                "Sempre há canalhas para derrubar, mas você é uma distração muito mais divertida",
              options: [
                {
                  label: "Uau, que heróico. Um demônio ambicioso.",
                  kaiResponse: convergenceResponse,
                  options: [],
                },
                {
                  label: "Divertida, eu?",
                  kaiResponse: convergenceResponse,
                  options: [],
                },
              ],
            },
            {
              label: "Isso é perseguição, sabia?",
              kaiResponse:
                "Estou só fazendo meu trabalho, monstrinho. Por que não facilita?",
              options: [
                {
                  label: "Vai sonhando!",
                  kaiResponse: convergenceResponse,
                  options: [],
                },
                {
                  label: "Porque eu sou o desafio que você não vai vencer",
                  kaiResponse: convergenceResponse,
                  options: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Só esperou eu ficar sozinha?!",
      kaiResponse:
        "Admita que fica entediada com aquele anjo. Posso entreter você de outras formas",
      options: [
        // N2
        {
          label: "Tentador… mas não posso",
          kaiResponse:
            "Não pode… ou não quer? Existe uma diferença importante que o seu corpo já entendeu",
          options: [
            // N3
            {
              label: "Não quero. Sai daqui",
              kaiResponse:
                "Seus olhos dizem outra coisa, e eles nunca aprenderam a mentir como eu",
              options: [
                // N4
                {
                  label: "Meus olhos refletem o meu desprezo",
                  kaiResponse:
                    "Desprezo é um sentimento intenso demais para quem diz não se importar",
                  options: [
                    {
                      label: "Você interpreta tudo errado",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "Prefiro isso a admitir qualquer coisa",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
                {
                  label: "Queria engarrafar sua autoestima e vender",
                  kaiResponse:
                    "E eu compraria sua teimosia só para assistir você perdendo para ela",
                  options: [
                    {
                      label: "Continue sonhando",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "Nunca vou perder para você",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
              ],
            },
            {
              label: "As duas coisas. Respeite as regras, demônio",
              kaiResponse:
                "Regras são para almas medíocres. Você foi feita para coisas maiores, monstrinho",
              options: [
                // N4
                {
                  label: "Minha vida não é medíocre",
                  kaiResponse: "Suas palavras, não minhas",
                  options: [
                    {
                      label: "Você devia arrumar outro emprego",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "FUI!",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
                {
                  label: "O que seria maior do que a minha liberdade?",
                  kaiResponse:
                    "Ter alguém diante de quem você escolheria abrir mão dela. Assustador, né?",
                  options: [
                    {
                      label: "Nunca aconteceria",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "Você se acha importante demais",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "O que você quer de mim agora?",
          kaiResponse:
            "Só uma conversa sincera. Ou uma barganha, se você estiver se sentindo ousada hoje",
          options: [
            // N3
            {
              label: "Barganhas com você custam caro demais",
              kaiResponse:
                "Te custaria apenas o orgulho de admitir que sentiu minha falta",
              options: [
                // N4
                {
                  label: "Senti falta do perigo, não de você",
                  kaiResponse:
                    "Mentira bonita. Pena que seu coração sempre entrega a verdade",
                  options: [
                    {
                      label: "Meu coração não manda em mim",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "Você inventa o que quer ouvir",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
                {
                  label: "Meu orgulho é a única coisa que me resta",
                  kaiResponse:
                    "Então guarde bem. Porque eu adoro colecionar coisas raras",
                  options: [
                    {
                      label: "Nem pense nisso",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "Você é impossível!",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
              ],
            },
            {
              label: "Diga logo o que quer",
              kaiResponse:
                "Quero ver até onde você vai para salvar a si mesma. É o meu passatempo favorito",
              options: [
                // N4
                {
                  label: "Vou até o fim para te provar que está errado",
                  kaiResponse:
                    "É essa coragem imprudente que me faz apostar em você, monstrinho",
                  options: [
                    {
                      label: "Pare de apostar na minha queda",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "Vai perder essa aposta",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
                {
                  label: "Você só quer me ver falhar",
                  kaiResponse:
                    "Se eu quisesse sua queda, já teria conseguido há muito tempo",
                  options: [
                    {
                      label: "Isso não faz sentido nenhum",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                    {
                      label: "Você fala como se se importasse",
                      kaiResponse: convergenceResponse,
                      options: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
