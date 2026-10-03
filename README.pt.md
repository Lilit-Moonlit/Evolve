[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Namoro, concepção e saúde verificada — privado por padrão, confiança onde importa.**

A EVOLVE é uma plataforma descentralizada e de código aberto para pessoas que se cansaram de entregar seu número de telefone, seu rosto e seus dados de saúde mais íntimos ao banco de dados de outra pessoa. Você entra com sua própria carteira cripto — sem telefone, sem e-mail, sem KYC — e pode recuperar sua conta por meio de um compromisso de DNA on-chain. Seus dados de saúde continuam sendo seus: os resultados de exames são analisados automaticamente, os status individuais de patógenos **nunca** são mostrados a ninguém, e o matching depende apenas de vereditos anônimos de compatibilidade (Safe / Compatible / Caution / Risk). O chat funciona ponto a ponto via libp2p e Nostr, com um fallback HTTP por conveniência.

> **Status — a plataforma funciona hoje; mainnet e DEX são os próximos passos.**
> Namoro, concepção, verificação de saúde, o fluxo de laboratório, o chat P2P, o token EVOLVE e a governança estão todos funcionando. Ainda à frente: um **deploy na mainnet e liquidez em DEX**, além de uma **venda pública planejada** (veja [O token EVOLVE](#o-token-evolve-apenas-testnet)).
> Os contratos inteligentes estão implantados **apenas na testnet Ethereum Sepolia**. Nada aqui é conselho financeiro ou oferta de investimento.

> **Acha a EVOLVE útil? Apoie o desenvolvimento — cada doação vai para código, parcerias com laboratórios, hospedagem e tradução → [DONATE.md](DONATE.md).**

## Nada a temer

A EVOLVE foi construída em torno das perguntas que as pessoas realmente fazem antes de confiar em uma plataforma assim.

| A preocupação                                     | O que a EVOLVE já faz a respeito                                                                                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Meus dados de saúde vão vazar.»                  | Os resultados individuais de patógenos **nunca** são mostrados a ninguém — apenas um veredito anônimo: Safe / Compatible / Caution / Risk.                                                        |
| «Minhas fotos vão parar em algum lugar.»          | As fotos ficam borradas por padrão. O proprietário concede uma visualização de **15 segundos** ou **permanente** — a pedido ou de forma proativa. Visualizar é grátis.                            |
| «Vou ter que entregar meu documento ou telefone.» | Login com carteira (SIWE). Sem telefone, sem e-mail, sem KYC. A recuperação funciona por um compromisso de DNA on-chain.                                                                          |
| «Ele ou ela está mentindo sobre estar saudável.»  | Os resultados são **verificados por laboratório** (QR + reconhecimento facial), e os exames do casal são feitos **no próprio encontro** — resultados recentes de IST importam, DNA não envelhece. |
| «Alguém vai pegar meu dinheiro e sumir?»          | A concepção funciona com uma participação real em risco: o depósito de um homem só se move quando a paternidade é **confirmada**; caso contrário, simplesmente lhe é devolvido.                   |
| «O token é um pump-and-dump?»                     | Nenhuma venda está ativa hoje; o código é aberto (MIT); planeja-se trancar a reserva não colocada em circulação em um **cofre não drenável** do qual nem o fundador pode sacar.                   |
| «A plataforma pode ser desligada ou banida?»      | Mensagens ponto a ponto em primeiro lugar, armazenamento descentralizado (IPFS / Arweave), 18 configurações de redes EVM e nenhum domínio fixado no código.                                       |

## O quê e por quê

Os aplicativos de namoro tradicionais pedem que você troque seu número de telefone, e-mail, fotos e detalhes íntimos de saúde por um banco de dados central — e depois confie nesse banco para sempre. A EVOLVE parte da premissa oposta: **privacidade por padrão, autocustódia e nenhum ponto único de falha**.

- **Privacidade por padrão** — os dados de saúde nunca são expostos; apenas vereditos anônimos.
- **Resistência a banimentos** — mensagens P2P em primeiro lugar, armazenamento descentralizado, design multirrede, sem domínios fixados no código.
- **Identidade autocustodiada** — sua carteira é seu login; recuperação por DNA em vez de e-mail ou telefone.
- **Sem barreira de KYC** — nenhum documento oficial, telefone ou e-mail é exigido para usar a plataforma.

Leia a justificativa completa em [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Saúde em que você pode confiar de verdade

- Envie um exame de IST como texto bruto ou PDF (extração da camada de texto, com fallback de OCR para digitalizações).
- O parser conhece 8 patógenos: HIV-1/2, sífilis, clamídia, gonorreia, HSV-1, HSV-2, hepatite B, hepatite C — em formatos de laudos em inglês, ucraniano e russo.
- **O status individual de patógenos nunca é exibido a outros usuários.** Os perfis mostram apenas o veredito anônimo: **Safe / Compatible / Caution / Risk**.
- Registros de DNA on-chain (`DNAVerification.sol`) sustentam a recuperação e a verificação.

### Laboratórios parceiros — prova, não promessas

Entre em um laboratório parceiro e mostre seu QR code. O laboratório escaneia, confirma sua identidade com **reconhecimento facial** (para que ninguém mais possa retirar seu resultado) e anexa o laudo de IST — PDF, digitalização ou texto, mesmo com um OCR ruim. O resultado é assinado por um laboratório de verdade, não por você, então os outros veem um **fato verificado** em vez da sua palavra. E cada verificação confirmada paga **1 EVOLVE ao paciente e 1 EVOLVE ao laboratório** — os dois lados têm um motivo para ser honestos. Os patógenos individuais, ainda assim, nunca são mostrados a ninguém.

## Encontrar alguém

- Filtros de busca: «O que você procura» (namoro / concepção / concepção poliândrica / exames de IST), «Quem você procura» (homens, mulheres, casais), seleções em cascata país → cidade, «pode viajar para o seu país» com listas por país, cor da pele, preferência de exames, apenas compatíveis em IST.
- Assistente de onboarding: idade (ocultável), idiomas, bio, foto.
- **Chat P2P** via libp2p (gossipsub) + Nostr, com fallback para API HTTP.

## Concepção

Duas formas de planejar um filho, e ambas repousam na mesma ideia: a intenção real se demonstra com uma participação real em EVOLVE — nunca com promessas. O compromisso de um homem vive no seu depósito no EvolveFund (a partir de 15 EVOLVE, bloqueado por pelo menos 30 dias), e uma mulher pode definir seu próprio depósito mínimo para os homens que a alcançam.

**Concepção.** A mulher lidera: ela convida um homem específico e o nomeia em um vínculo (bond). Ele precisa de um depósito ativo no EvolveFund; quando ambos confirmam, ele é bloqueado e a contagem começa. A gravidez é informada entre 14 e 30 dias após a confirmação, e os exames de IST e DNA do casal são feitos no próprio encontro — resultados recentes de IST importam, DNA não envelhece. Confirmada a paternidade, o depósito do homem passa para a mulher; se não for confirmada, o depósito simplesmente lhe é devolvido. Nada muda de mãos até que os fatos estejam estabelecidos.

**Concepção poliândrica.** A escolha é dela, e permanece privada. Ela abre uma sessão que dura 48 horas — sem depósito próprio (ela pode acrescentar um apenas por reputação, se quiser). Homens com depósito ativo podem entrar — até 50 — e confirmar, o que bloqueia sua participação. Catorze dias após o fechamento da sessão, o pai é escolhido. Ele recebe seu depósito de volta mais uma recompensa do fundo: o dobro do seu depósito e 1 EVOLVE por cada outro participante. Os homens não escolhidos perdem sua participação — 90% para a mulher, 10% para o pai escolhido. Ela não arrisca nada e só tem a ganhar; os homens apostam sua participação pelo direito de serem escolhidos.

## O token EVOLVE (apenas testnet)

- ERC-20, oferta máxima **8,000,000,000 EVOLVE**. Ações administrativas são controladas por um `TimelockController` de 48 horas.
- **Alocação planejada da oferta** — desenhada para colocar quase toda a oferta a trabalho para os usuários, não para os insiders:

| Finalidade                                                   |        EVOLVE |
| ------------------------------------------------------------ | ------------: |
| Fundadores e equipe (salário / recompensa)                   |    25,000,000 |
| Reserva para DEX (futuro)                                    |     4,000,000 |
| Venda pública (planejada)                                    |     5,000,000 |
| Reserva de recompensas — laboratórios, pacientes, mães, pais | 7,966,000,000 |

- **Venda pública planejada** — 5,000,000 EVOLVE vendidos pelo app a **$0.8 cada**, pagáveis com qualquer token que o app aceite; a arrecadação financia o desenvolvimento. _(Planejado — ainda não ativo.)_
- **Emissão trustless (planejada)** — a reserva de recompensas de ~7,966,000,000 deve ser trancada em um `RewardVault` não drenável: liberada apenas gradualmente por recompensas a laboratórios, pacientes, mães e pais, com mudanças de regras exigindo votação de governança. Nem o fundador pode retirá-la. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Economia de presentes emoji** — um presente custa 1 EVOLVE, dividido proporcionalmente entre os donos de presentes existentes; um modelo de receita perpétuo, e presentes são transferíveis.
- **EvolveFund** — staking masculino (mín. 15 EVOLVE, bloqueio de 30 dias) que conta para o peso de governança; mulheres usam o saldo da carteira.
- **Recompensas de verificação** — 1 EVOLVE ao usuário verificado e 1 EVOLVE ao laboratório que confirma, por verificação de IST/DNA (além de um faucet com limite de frequência).
- **Governança** — o peso do voto combina reputação recursiva (8 votos, profundidade 3), parcela de filhos/paternidade e EVOLVE apostados ou mantidos.
- Integração **LayerZero OFT** para futuras transferências multichain de EVOLVE (dependências prontas; nada implantado além de Sepolia por enquanto).

## Apoie o projeto

A EVOLVE é independente e de código aberto. Se ela é útil para você, você pode apoiar o desenvolvimento com uma doação — cada contribuição vai para código, parcerias com laboratórios, hospedagem e tradução.

- **Dados para doações (EVM, Monero e mais):** [DONATE.md](DONATE.md)
- **Página de doações multilíngue (34 idiomas):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Uma venda pública de tokens está no roteiro, mas **não** está ativa hoje. Doações são presentes que apoiam o desenvolvimento de código aberto e não dão direito a tokens, participação, retornos ou lucro. Doe apenas o que você puder perder.

## Arquitetura e stack técnica

Monorepo gerenciado com npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (main web app, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flags & dynamic remote configuration
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Shared types, utilities, middleware, web3
  matching/     # Matching algorithms, filters, ranking
  p2p/          # libp2p (gossipsub) + Nostr networking
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architecture, tokenomics, roadmap, FAQ
```

Principais contratos inteligentes: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (presentes emoji + recompensas), `Governance.sol`, `BondManager.sol` (concepção e concepção poliândrica), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, e um `TimelockController` da OpenZeppelin.

Detalhes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roteiro

Em andamento: preparação do app web para produção. Planejado: registro on-chain de laboratórios e certificação de exames, um adaptador real de provedor de e-mail para a recepção de laudos laboratoriais, atestações verificadas on-chain nos perfis, o **RewardVault trustless** com emissão controlada por governança ([design](docs/REWARD-VAULT-PLAN.md)), a **venda pública de tokens**, a atualização do vesting da alocação do fundador e a provisão de liquidez em DEX (hoje bloqueada — exige deploys do token em mainnet). A expansão multirrede (Arbitrum, Avalanche e outras redes EVM) vem após o amadurecimento na testnet.

Lista completa: [docs/ROADMAP.md](docs/ROADMAP.md).

## Primeiros passos (desenvolvedores)

Requisitos: **Node.js 20+** e npm 10.x.

```bash
# Clone and install all workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Web app (Vite dev server on http://localhost:3000)
cd apps/web
npm run dev
npm test                # vitest suite

# Smart contracts
cd packages/contracts
npm run compile         # hardhat compile
npm test                # hardhat test suite
npm run deploy:local    # deploy all contracts to an in-process Hardhat network
```

## Contribuindo

Contribuições são bem-vindas — código, relatos de bugs, sugestões de recursos e propostas. Leia [CONTRIBUTING.md](CONTRIBUTING.md) e nosso [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) antes de começar.

## Repositórios (espelhos)

| Espelho  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentação

- [O quê e por quê](docs/WHAT-AND-WHY.md) — problema, visão, valores centrais
- [Como funciona](docs/HOW-IT-WORKS.md) — fluxos de usuário, passo a passo
- [Arquitetura](docs/ARCHITECTURE.md) — monorepo, pacotes, fluxos de dados
- [Tokenomics](docs/TOKENOMICS.md) — modelo do token e distribuição da oferta
- [Plano RewardVault](docs/REWARD-VAULT-PLAN.md) — emissão trustless (planejada)
- [Roteiro](docs/ROADMAP.md) — marcos e status atual
- [FAQ](docs/FAQ.md) — perguntas frequentes
- [Guia de carteiras](docs/WALLETS.md) — como criar carteiras e obter endereços de doação

## Licença

Licenciado sob a [Licença MIT](LICENSE).
