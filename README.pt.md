[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Namoro, concepção e verificação de saúde — privado por padrão, verificado onde importa.**

O EVOLVE é uma plataforma open-source e descentralizada para conexões íntimas verificáveis: namoro, concepção e compatibilidade anônima de IST/DNA. Você entra com a sua própria carteira cripto (Sign-In with Ethereum) — sem número de telefone, sem e-mail, sem KYC — e pode recuperar a conta por meio de um compromisso de DNA on-chain. Os dados de saúde continuam sendo seus: os resultados de laboratório são analisados automaticamente, os status individuais dos patógenos **nunca** são mostrados a ninguém, e o matching depende apenas de vereditos anônimos de compatibilidade (Safe / Compatible / Caution / Risk). O chat funciona ponto a ponto via libp2p e Nostr, com um fallback HTTP por conveniência, e o aplicativo traz uma fachada pública leve de “Safety Mode” e também um Companion Mode independente para avaliar resultados de testes de IST.

> **Status: alfa em estágio inicial.** O EVOLVE está em desenvolvimento ativo e não é um produto finalizado.
> Os contratos inteligentes estão implantados **apenas na rede de testes Ethereum Sepolia**.
> **Não há implantação na mainnet, não há DEX, não há liquidez e não há venda pública de tokens** — e nada disso é prometido.
> Os recursos podem mudar ou quebrar a qualquer momento. Nada aqui é conselho financeiro ou oferta de investimento.

## O quê e por quê

As plataformas de namoro tradicionais pedem que você entregue seu número de telefone, e-mail, fotos e detalhes íntimos de saúde a um banco de dados central. O EVOLVE parte da premissa oposta: privacidade por padrão, autocustódia e nenhum ponto único de falha. Valores centrais:

- **Privacidade por padrão** — os dados de saúde nunca são expostos; apenas vereditos anônimos.
- **Resistência a banimentos** — mensagens P2P em primeiro lugar, armazenamento descentralizado (IPFS / Arweave), design multirrede, sem domínios fixados no código.
- **Identidade autocustodiada** — sua carteira é o seu login; recuperação baseada em DNA em vez de e-mail/telefone.
- **Sem barreira de KYC** — nenhum documento de identidade oficial, telefone ou e-mail é exigido para usar a plataforma.

Leia a justificativa completa em [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (em inglês).

## Recursos principais

### Identidade e privacidade

- **Login com carteira SIWE** (MetaMask e outras carteiras EVM) — a saída de emergência resistente à censura.
- **Recuperação de conta por DNA** — o resultado do seu teste de DNA é transformado em hash (SHA-256, comprometido on-chain como `bytes32`) e pode restaurar o acesso sem telefone ou e-mail.
- **Abstração de conta (ERC-4337)** — contas inteligentes e um paymaster para onboarding sem gás; o SIWE permanece sempre disponível.

### Compatibilidade anônima de saúde

- Envio de resultados de testes de IST como texto simples ou PDF (extração da camada de texto com fallback de OCR para páginas digitalizadas).
- O parser reconhece 8 patógenos: HIV-1/2, sífilis, clamídia, gonorreia, HSV-1, HSV-2, hepatite B, hepatite C (formatos de relatório em inglês, ucraniano e russo).
- **O status individual dos patógenos nunca é exibido para outros usuários.** Os perfis mostram apenas um veredito anônimo: **Safe / Compatible / Caution / Risk**.
- Os registros on-chain de verificação de DNA (`DNAVerification.sol`) sustentam os fluxos de recuperação e verificação.

### Perfis, busca e comunicação

- Filtros de busca: “O que você procura” (namoro / concepção / concepção poliândrica / testes de IST), “Quem você procura” (homens, mulheres, casais), seleções em cascata país → cidade, “pode viajar para o seu país” com listas por país, cor da pele, preferência de teste, apenas compatíveis em IST.
- Assistente de onboarding: idade (ocultável), idiomas, bio, foto.
- **Privacidade das fotos**: as fotos ficam desfocadas por padrão; o proprietário concede visualizações de 15 segundos ou permanentes, mediante solicitação ou de forma proativa. Visualizar é grátis.
- **Chat P2P** via libp2p (gossipsub) + Nostr, com fallback de API HTTP.

### Modos de concepção

- **Modo 2 — Pregnancy Bond**: uma mulher cria um vínculo, um homem aplica EVOLVE em staking (≥ 100 na build atual de testnet), ambos confirmam; após gravidez e paternidade confirmadas, o stake é transferido para a mulher.
- **Modo 3 — Cryptic Choice**: uma mulher abre uma sessão de 48 horas, os homens participam com staking; ela escolhe o pai — o stake dele é devolvido, os demais dividem: 90% para ela / 10% para o pai escolhido.

### Laboratórios e verificação

- **Fluxo de laboratórios parceiros**: os laboratórios se registram como parceiros, verificam pacientes por QR code e reconhecimento facial e anexam relatórios de IST (PDF/texto com extração por OCR).
- **Companion Mode**: fluxo independente para avaliar resultados de testes de IST sem entrar na plataforma de namoro.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): uma fachada pública limitada (status de IST, links públicos de perfil, verificações de compatibilidade) que continua funcionando mesmo que os recursos de namoro/concepção sejam restringidos em alguma jurisdição ou loja de aplicativos.

### Token EVOLVE (apenas testnet)

- ERC-20, oferta máxima de 8.000.000.000 EVOLVE, ações administrativas condicionadas a um TimelockController de 48 horas.
- **Economia de presentes emoji**: um presente custa 1 EVOLVE, distribuído proporcionalmente entre os atuais proprietários de presentes — um modelo de receita perpétuo para os detentores; os presentes são transferíveis.
- **EvolveFund**: staking masculino (mín. 15 EVOLVE, bloqueio de 30 dias) que conta para o peso de governança; as mulheres usam o saldo da carteira.
- **Recompensas de verificação**: 1 EVOLVE para o usuário verificado e 1 EVOLVE para o laboratório confirmador a cada verificação de IST/DNA (além de um faucet de testes com limite de frequência).
- O peso de voto na governança combina reputação recursiva (8 votos, profundidade 3), a proporção de filhos/paternidade e EVOLVE em staking ou em carteira.
- Integração **LayerZero OFT** para futuras transferências multichain de EVOLVE (dependências prontas; nada implantado além da Sepolia por enquanto).

### Plataforma

- Aplicativo web (instalável como PWA) e aplicativo mobile em Expo/React Native.
- Interface traduzida para **34 idiomas**.
- Pronto para multirrede: 18 configurações de redes EVM (Arbitrum e Avalanche são as L2 principais planejadas — **ainda não implantadas**).

## Arquitetura e pilha tecnológica

Monorepo gerenciado com npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (aplicativo web principal, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flags e configuração remota dinâmica
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Tipos compartilhados, utilitários, middleware, web3
  matching/     # Algoritmos de matching, filtros, ranqueamento
  p2p/          # Rede libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Arquitetura, tokenômica, roteiro, FAQ
```

Contratos inteligentes principais: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (presentes emoji + recompensas), `Governance.sol`, `BondManager.sol` (modos 2 e 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, `SmartAccountFactory` + `Paymaster` ERC-4337 e um `TimelockController` da OpenZeppelin.

Detalhes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (em inglês).

## Roteiro

Em andamento: preparação do aplicativo web para produção. Planejado: registro de laboratórios on-chain e certificação de testes, adaptador real de provedor de e-mail para a ingestão de relatórios laboratoriais, atestações verificadas on-chain nos perfis, atualização do vesting de tokens para as alocações de fundadores/desenvolvedores, provisão de liquidez em DEX (atualmente bloqueada — exige implantações do token na mainnet). A expansão multirrede (Arbitrum, Avalanche e outras redes EVM) vem depois do amadurecimento na rede de testes.

Lista completa: [docs/ROADMAP.md](docs/ROADMAP.md) (em inglês).

## Primeiros passos (desenvolvedores)

Requisitos: **Node.js 20+** e npm 10.x.

```bash
# Clonar e instalar todos os workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Aplicativo web (servidor de dev Vite em http://localhost:3000)
cd apps/web
npm run dev
npm test                # suíte vitest

# Contratos inteligentes
cd packages/contracts
npm run compile         # hardhat compile
npm test                # suíte de testes do hardhat
npm run deploy:local    # implantar todos os contratos em uma rede Hardhat em processo
```

## Contribuindo

Contribuições são bem-vindas — código, relatórios de bugs, sugestões de recursos e propostas. Leia [CONTRIBUTING.md](CONTRIBUTING.md) e nosso [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) antes de começar.

## Apoie o projeto

Se o EVOLVE é útil para você, você pode apoiar o desenvolvimento com uma doação — detalhes em [DONATE.md](DONATE.md). Prefere uma página web? Use a página de doações multilíngue (34 idiomas): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Não há venda de tokens e nunca haverá.** Não é possível “investir” em tokens EVOLVE; as doações são presentes para apoiar o desenvolvimento open-source e não dão ao doador direito a tokens, participação, retornos ou qualquer reivindicação financeira.

## Repositórios (espelhos)

| Espelho  | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentação

- [O quê e por quê](docs/WHAT-AND-WHY.md) — problema, visão, valores centrais (inglês)
- [Como funciona](docs/HOW-IT-WORKS.md) — fluxos de usuário, passo a passo (inglês)
- [Arquitetura](docs/ARCHITECTURE.md) — monorepo, pacotes, fluxos de dados (inglês)
- [Tokenômica](docs/TOKENOMICS.md) — modelo do token e distribuição da oferta (inglês)
- [Roteiro](docs/ROADMAP.md) — marcos e status atual (inglês)
- [FAQ](docs/FAQ.md) — perguntas frequentes (inglês)
- [Guia de carteiras](docs/WALLETS.md) — como criar carteiras e obter endereços de doação (inglês)

## Licença

Licenciado sob a [Licença MIT](LICENSE).
