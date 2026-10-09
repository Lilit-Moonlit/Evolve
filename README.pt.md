[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Namoro, concepção e saúde verificada — privado por padrão, confiança onde importa.**

A EVOLVE é uma plataforma descentralizada e de código aberto para pessoas que se cansaram de entregar seu número de telefone, seu rosto e seus dados de saúde mais íntimos ao banco de dados de outra pessoa. Você entra com sua própria carteira cripto — sem telefone, sem e-mail, sem KYC — e pode recuperar sua conta por meio de um compromisso de DNA on-chain. Seus dados de saúde continuam sendo seus: os resultados de exames são processados automaticamente, os status individuais de patógenos **nunca** são mostrados a ninguém, e o matching depende apenas de vereditos anônimos de compatibilidade (Safe / Compatible / Caution / Risk). O chat funciona ponto a ponto sobre libp2p e Nostr, com um fallback HTTP por conveniência. Presentes e transferências caminham rumo à confidencialidade total: presentes com remetente privado já estão ativos hoje, com uma carteira protegida Railgun e um protótipo zero-knowledge Aztec no roteiro (veja [Privacidade e transações confidenciais](#privacidade-e-transações-confidenciais)).

> **Status — modo demonstração, em desenvolvimento ativo.**
> Namoro, concepção, verificação de saúde, o fluxo de laboratório, o chat P2P, o token EVOLVE e a governança estão todos implementados e rodando em uma **demonstração local** — o aplicativo **ainda não foi implantado publicamente**. Ainda à frente: **implantação na mainnet e liquidez em DEX**, além de uma **venda pública planejada** (veja [O token EVOLVE](#o-token-evolve-apenas-testnet)).
> Os contratos inteligentes estão implantados **apenas na testnet Ethereum Sepolia**. Nada aqui é conselho financeiro ou oferta de investimento.

> **Acha a EVOLVE útil? Apoie o desenvolvimento — cada doação vai para código, parcerias com laboratórios, hospedagem e tradução → [DONATE.md](DONATE.md).**

## Nada a temer

A EVOLVE foi construída em torno das perguntas que as pessoas realmente fazem antes de confiar em uma plataforma assim.

| A preocupação                                     | O que a EVOLVE já faz a respeito                                                                                                                                                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Meus dados de saúde vão vazar.»                  | Os resultados individuais de patógenos **nunca** são mostrados a ninguém — apenas um veredito anônimo: Safe / Compatible / Caution / Risk.                                                                              |
| «Minhas fotos vão parar em algum lugar.»          | As fotos ficam borradas por padrão. O proprietário concede uma visualização de **15 segundos** ou **permanente** — a pedido ou de forma proativa. Visualizar é grátis.                                                  |
| «Vou ter que entregar meu documento ou telefone.» | Login com carteira (SIWE). Sem telefone, sem e-mail, sem KYC. A recuperação funciona por meio de um compromisso de DNA on-chain.                                                                                        |
| «Ele ou ela está mentindo sobre estar saudável.»  | Os resultados são **verificados por laboratório** (QR + reconhecimento facial), e os exames do casal são feitos **no próprio encontro** — resultados recentes de STD importam, DNA não envelhece.                       |
| «Alguém vai pegar meu dinheiro e sumir?»          | A concepção funciona com uma garantia real em risco: o depósito de um homem só se move quando a paternidade é **confirmada**; caso contrário, é simplesmente devolvido a ele.                                           |
| «O token é um pump-and-dump?»                     | O código é aberto (MIT); quase toda a oferta é reservada a recompensas para os usuários, e a reserva ainda não colocada em circulação deve ser trancada em um **cofre não drenável** do qual nem o fundador pode sacar. |
| «A plataforma pode ser desligada ou banida?»      | Mensagens ponto a ponto em primeiro lugar, armazenamento descentralizado (IPFS / Arweave), 18 configurações de rede EVM e nenhum domínio fixado no código.                                                              |

## O quê e por quê

Os aplicativos de namoro tradicionais pedem que você troque seu número de telefone, e-mail, fotos e detalhes íntimos de saúde por um banco de dados central — e que depois confie nesse banco para sempre. A EVOLVE parte da premissa oposta: **privacidade por padrão, autocustódia e nenhum ponto único de falha**.

- **Privacidade por padrão** — os dados de saúde nunca são expostos; apenas vereditos anônimos.
- **Resistência a banimentos** — mensagens P2P em primeiro lugar, armazenamento descentralizado, design multirrede, sem domínios fixados no código.
- **Identidade autocustodiada** — sua carteira é o seu login; recuperação baseada em DNA em vez de e-mail ou telefone.
- **Sem barreira de KYC** — nenhum documento oficial, telefone ou e-mail é exigido para usar a plataforma.

Leia a justificativa completa em [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Saúde em que você pode confiar de verdade

- Envie um exame de STD como texto bruto ou PDF (extração da camada de texto, com fallback de OCR para digitalizações).
- O parser conhece 8 patógenos: HIV-1/2, sífilis, clamídia, gonorreia, HSV-1, HSV-2, hepatite B, hepatite C — em formatos de laudo em inglês, ucraniano e russo.
- **O status individual de cada patógeno nunca é exibido a outros usuários.** Os perfis mostram apenas o veredito anônimo: **Safe / Compatible / Caution / Risk**.
- Registros de DNA on-chain (`DNAVerification.sol`) alimentam a recuperação e a verificação.

### Laboratórios parceiros — provas, não promessas

Entre em um laboratório parceiro e mostre seu código QR. O laboratório escaneia, confirma sua identidade com **reconhecimento facial** (para que ninguém mais possa retirar seu resultado) e anexa o laudo de STD — PDF, digitalização ou texto, mesmo um OCR de baixa qualidade. O resultado é assinado por um laboratório de verdade, não por você, então os outros veem um **fato verificado** em vez da sua palavra. E cada verificação confirmada paga **1 EVOLVE ao paciente e 1 EVOLVE ao laboratório** — os dois lados têm um motivo para ser honestos. Os patógenos individuais continuam nunca sendo mostrados a ninguém.

## Encontrar alguém

- Filtros de busca: «o que você procura» (namoro / concepção / concepção poliândrica / teste de STD), «quem você procura» (homens, mulheres, casais), seletores em cascata país → cidade, «pode viajar para o seu país» com listas por país, cor da pele, preferência de testes, apenas compatíveis por STD.
- Assistente de integração: idade (ocultável), idiomas, bio, foto.
- **Chat P2P** sobre libp2p (gossipsub) + Nostr, com fallback de API HTTP.

## Concepção

Duas formas de planejar um filho, e ambas repousam na mesma ideia: a intenção real se mostra com uma garantia real em EVOLVE — nunca com promessas. O compromisso de um homem vive no depósito dele no EvolveFund (a partir de 15 EVOLVE, travado por pelo menos 30 dias), e uma mulher pode definir seu próprio depósito mínimo para os homens que a alcançam.

**Concepção.** A mulher lidera: ela convida um homem específico e o nomeia em um vínculo. Ele precisa de um depósito ativo no EvolveFund; quando ambos confirmam, o valor é travado e a contagem regressiva começa. A gravidez é reportada entre 14 e 30 dias após a confirmação, e os exames de STD e DNA do casal são feitos no próprio encontro — resultados recentes de STD importam, DNA não envelhece. Assim que a paternidade é confirmada, o depósito do homem passa para a mulher; se não for confirmado, o depósito é simplesmente liberado de volta para ele. Nada muda de mãos antes de os fatos serem esclarecidos.

**Concepção poliândrica.** A escolha pertence a ela, e permanece privada. Ela abre uma sessão que dura 48 horas — sem depósito próprio (ela pode acrescentar um apenas por reputação, se quiser). Homens com um depósito ativo podem participar — até 50 — e confirmar, o que trava a garantia deles. Catorze dias após o fechamento da sessão, o pai é escolhido. Ele recupera seu depósito e ainda recebe uma recompensa do fundo: o dobro do seu depósito e 1 EVOLVE por cada outro participante. Os homens não escolhidos perdem a garantia — 90% para a mulher, 10% para o pai escolhido. Ela não arrisca nada e só tem a ganhar; os homens colocam sua garantia atrás do direito de serem escolhidos.

## Privacidade e transações confidenciais

A privacidade é o padrão — e a EVOLVE está construindo um caminho rumo a transferências on-chain totalmente confidenciais.

- **Presentes privados** — envie uma rosa 🌹 ou um cacto 🌵 (1 EVOLVE) e escolha quem pode ver que foi você: _público_, _anônimo para todos, exceto o destinatário_, ou _totalmente anônimo_. Nos modos anônimos, o presente viaja como um voucher de uso único que o destinatário resgata com a própria carteira, então o remetente nunca aparece on-chain. (A anonimidade do remetente hoje é de nível casual: a transação de financiamento pode ser correlacionada por horário e valor.)
- **Carteira protegida Railgun** — uma carteira privada controlada por feature flag (`VITE_RAILGUN_ENABLED`, desativada por padrão) que oculta valores e endereços usando o pool zero-knowledge em produção da Railgun. Este é o caminho para a verdadeira anonimidade do remetente.
- **Protótipo Aztec** — a mesma lógica de transferência privada e vínculo privado, expressa como circuitos Noir zero-knowledge e mantida atrás de um portão explícito até que a Aztec esteja pronta para produção. Veja [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Modelo de duas carteiras** — uma carteira pública de garantias participa da governança; uma carteira privada protegida é deliberadamente **excluída** do peso de governança, mantendo privacidade e poder de voto separados.

Detalhes: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## O token EVOLVE (apenas testnet)

- ERC-20, oferta máxima de **8,000,000,000 EVOLVE**. Ações administrativas são controladas por um `TimelockController` de 48 horas.
- **Alocação planejada da oferta** — desenhada para colocar quase toda a oferta a serviço dos usuários, não de insiders:

| Finalidade                                                   |        EVOLVE |
| ------------------------------------------------------------ | ------------: |
| Fundadores e equipe (salário / recompensa)                   |    25,000,000 |
| Reserva para DEX (futuro)                                    |     4,000,000 |
| Venda pública (planejada)                                    |     5,000,000 |
| Reserva de recompensas — laboratórios, pacientes, mães, pais | 7,966,000,000 |

- **Venda pública planejada** — 5,000,000 EVOLVE vendidos pelo aplicativo a **$0.8 cada**, pagáveis em qualquer token que o aplicativo suporte; a receita financia o desenvolvimento. _(Planejada — ainda não está ativa.)_
- **Emissão trustless (planejada)** — a reserva de recompensas de ~7,966,000,000 deve ser trancada em um `RewardVault` não drenável: liberada apenas gradualmente por meio de recompensas a laboratórios, pacientes, mães e pais, com mudanças de regras exigindo votação na governança. Nem o fundador pode sacar. Design: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Economia de presentes emoji** — um presente custa 1 EVOLVE, dividido proporcionalmente entre os atuais proprietários de presentes; um modelo de receita perpétuo, e os presentes são transferíveis.
- **EvolveFund** — staking masculino (mínimo de 15 EVOLVE, trava de 30 dias) que conta para o peso de governança; as mulheres usam o saldo da carteira.
- **Recompensas de verificação** — 1 EVOLVE para o usuário verificado e 1 EVOLVE para o laboratório confirmador por verificação de STD/DNA (além de uma faucet limitada por taxa).
- **Governança** — o peso do voto combina reputação recursiva (8 votos, profundidade 3), participação em filhos/paternidade e EVOLVE em staking ou em saldo.
- Integração **LayerZero OFT** para futuras transferências multichain de EVOLVE (dependências prontas; nada implantado além da Sepolia por enquanto).

## Apoie o projeto

A EVOLVE é independente e de código aberto. Se ela é útil para você, você pode apoiar o desenvolvimento com uma doação — cada contribuição vai para código, parcerias com laboratórios, hospedagem e tradução.

- **Detalhes das doações (EVM, Monero e mais):** [DONATE.md](DONATE.md)
- **Página de doações multilíngue (34 idiomas):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Uma venda pública de tokens está **planejada** — 5,000,000 EVOLVE, vendidos pelo aplicativo (veja [O token EVOLVE](#o-token-evolve-apenas-testnet)). Doações são presentes que apoiam o desenvolvimento de código aberto e não dão direito a tokens, participação societária, retornos ou lucro. Por favor, doe apenas o que puder perder.

## Arquitetura e pilha tecnológica

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

Principais contratos inteligentes: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (presentes emoji + recompensas), `Governance.sol`, `BondManager.sol` (concepção e concepção poliândrica), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, `SmartAccountFactory` + `Paymaster` ERC-4337 e um `TimelockController` da OpenZeppelin.

Detalhes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Roteiro

Em andamento: preparação do aplicativo web para produção. Planejado: registro de laboratórios on-chain e certificação de exames, um adaptador real de provedor de e-mail para a ingestão de laudos laboratoriais, atestados verificados on-chain nos perfis, o **RewardVault trustless** com emissão controlada pela governança ([design](docs/REWARD-VAULT-PLAN.md)), a **venda pública de tokens**, atualização do vesting de tokens para a alocação dos fundadores e o provisionamento de liquidez em DEX (atualmente bloqueado — exige implantações do token em mainnet). No lado da privacidade, os presentes com remetente privado estão prontos, enquanto a carteira protegida Railgun e a migração de vínculos privados da Aztec permanecem atrás das verificações em [docs/ROADMAP.md](docs/ROADMAP.md) e [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). A expansão multirrede (Arbitrum, Avalanche e outras redes EVM) vem depois do amadurecimento na testnet.

Lista completa: [docs/ROADMAP.md](docs/ROADMAP.md).

## Como começar (desenvolvedores)

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

Contribuições são bem-vindas — código, relatórios de bugs, sugestões de recursos e propostas. Leia [CONTRIBUTING.md](CONTRIBUTING.md) e nosso [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) antes de começar.

## Repositórios (espelhos)

| Espelho  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentação

- [O quê e por quê](docs/WHAT-AND-WHY.md) — problema, visão, valores centrais
- [Como funciona](docs/HOW-IT-WORKS.md) — fluxos de uso, passo a passo
- [Arquitetura](docs/ARCHITECTURE.md) — monorepo, pacotes, fluxos de dados
- [Tokenomia](docs/TOKENOMICS.md) — modelo do token e distribuição da oferta
- [Plano do RewardVault](docs/REWARD-VAULT-PLAN.md) — emissão trustless (planejada)
- [Integração Railgun](docs/RAILGUN-INTEGRATION.md) — estudo de integração da carteira protegida
- [Stakes protegidos](docs/SHIELDED-STAKES-DESIGN.md) — garantias privadas de concepção (design)
- [Protótipo Aztec](docs/AZTEC-PROTOTYPE.md) — transferências e vínculos privados ZK (pesquisa)
- [Roteiro](docs/ROADMAP.md) — marcos e status atual
- [FAQ](docs/FAQ.md) — perguntas frequentes
- [Guia de carteiras](docs/WALLETS.md) — como criar carteiras e obter endereços para doações

## Licença

Licenciado sob a [Licença MIT](LICENSE).
