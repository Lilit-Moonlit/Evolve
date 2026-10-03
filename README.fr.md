[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Rencontres, conception et santé vérifiée — privé par défaut, confiance là où ça compte.**

EVOLVE est une plateforme open-source et décentralisée pour les personnes qui en ont fini avec confier leur numéro de téléphone, leur visage et leurs données de santé les plus intimes à la base de données de quelqu'un d'autre. Vous vous connectez avec votre propre portefeuille crypto — sans téléphone, sans e-mail, sans KYC — et vous pouvez récupérer votre compte via un engagement ADN on-chain. Vos données de santé restent les vôtres : les résultats de tests sont analysés automatiquement, les statuts individuels des agents pathogènes ne sont **jamais** montrés à qui que ce soit, et le matching repose uniquement sur des verdicts anonymes de compatibilité (Safe / Compatible / Caution / Risk). Le chat fonctionne en pair-à-pair via libp2p et Nostr, avec un repli HTTP pour la commodité.

> **État — la plateforme fonctionne aujourd'hui ; le mainnet et le DEX sont les prochaines étapes.**
> Rencontres, conception, vérification de santé, le flux laboratoire, le chat P2P, le jeton EVOLVE et la gouvernance sont tous opérationnels. À venir : un **déploiement mainnet et la liquidité DEX**, plus une **vente publique prévue** (voir [Le jeton EVOLVE](#le-jeton-evolve-testnet-uniquement)).
> Les contrats intelligents sont déployés **uniquement sur le testnet Ethereum Sepolia**. Rien ici n'est un conseil financier ou une offre d'investissement.

> **EVOLVE vous est utile ? Soutenez le développement — chaque don va au code, aux partenariats avec les laboratoires, à l'hébergement et à la traduction → [DONATE.md](DONATE.md).**

## Rien à craindre

EVOLVE a été construit autour des questions que les gens se posent réellement avant de faire confiance à une plateforme comme celle-ci.

| L'inquiétude                                               | Ce qu'EVOLVE fait déjà à ce sujet                                                                                                                                                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| « Mes données de santé vont fuiter. »                      | Les résultats individuels des agents pathogènes ne sont **jamais** montrés à qui que ce soit — seulement un verdict anonyme : Safe / Compatible / Caution / Risk.                                                 |
| « Mes photos finiront quelque part. »                      | Les photos sont floutées par défaut. Le propriétaire accorde une vue de **15 secondes** ou **permanente** — à la demande ou de sa propre initiative. La consultation est gratuite.                                |
| « Je devrai donner ma pièce d'identité ou mon téléphone. » | Connexion par portefeuille (SIWE). Pas de téléphone, pas d'e-mail, pas de KYC. La récupération passe par un engagement ADN on-chain.                                                                              |
| « Il ou elle ment sur sa santé. »                          | Les résultats sont **vérifiés par un laboratoire** (QR + reconnaissance faciale), et les tests du couple sont faits **lors de la rencontre** — la fraîcheur des résultats IST compte, l'ADN ne vieillit pas.      |
| « Quelqu'un va-t-il prendre mon argent et disparaître ? »  | La conception repose sur un véritable enjeu à risque : le dépôt d'un homme ne bouge que lorsque la paternité est **confirmée** ; sinon il lui est simplement restitué.                                            |
| « Le jeton est-il un pump-and-dump ? »                     | Aucune vente n'est active aujourd'hui ; le code est ouvert (MIT) ; la réserve non mise en circulation est prévue pour être verrouillée dans un **coffre non vidable** dont même le fondateur ne peut pas retirer. |
| « La plateforme peut-elle être fermée ou interdite ? »     | Messagerie pair-à-pair d'abord, stockage décentralisé (IPFS / Arweave), 18 configurations de réseaux EVM et aucun domaine codé en dur.                                                                            |

## Quoi et pourquoi

Les applications de rencontres classiques vous demandent d'échanger votre numéro de téléphone, votre e-mail, vos photos et vos détails intimes de santé contre une base de données centrale — puis de faire confiance à cette base pour toujours. EVOLVE part du présupposé inverse : **confidentialité par défaut, autocustodie et absence de point de défaillance unique**.

- **Confidentialité par défaut** — les données de santé ne sont jamais exposées ; seuls des verdicts anonymes.
- **Résistance aux interdictions** — messagerie P2P d'abord, stockage décentralisé, conception multi-réseaux, aucun domaine codé en dur.
- **Identité autocustodiée** — votre portefeuille est votre connexion ; récupération par ADN au lieu d'e-mail ou de téléphone.
- **Pas de barrière KYC** — aucune pièce d'identité officielle, aucun téléphone ni e-mail requis pour utiliser la plateforme.

Lisez la justification complète dans [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Une santé à laquelle vous pouvez vraiment vous fier

- Téléversez un test IST en texte brut ou en PDF (extraction de la couche texte, avec repli OCR pour les scans).
- L'analyseur connaît 8 agents pathogènes : VIH-1/2, syphilis, chlamydia, gonorrhée, HSV-1, HSV-2, hépatite B, hépatite C — dans les formats de rapports anglais, ukrainiens et russes.
- **Le statut individuel des agents pathogènes n'est jamais affiché aux autres utilisateurs.** Les profils ne montrent jamais que le verdict anonyme : **Safe / Compatible / Caution / Risk**.
- Les enregistrements ADN on-chain (`DNAVerification.sol`) alimentent la récupération et la vérification.

### Laboratoires partenaires — des preuves, pas des promesses

Entrez dans un laboratoire partenaire et montrez votre code QR. Le laboratoire le scanne, confirme votre identité par **reconnaissance faciale** (pour que personne d'autre ne puisse récupérer votre résultat) et joint le rapport IST — PDF, scan ou texte, même avec un OCR médiocre. Le résultat est signé par un vrai laboratoire, pas par vous, donc les autres voient un **fait vérifié** au lieu de votre parole. Et chaque vérification confirmée paie **1 EVOLVE au patient et 1 EVOLVE au laboratoire** — les deux parties ont une raison d'être honnêtes. Les agents pathogènes individuels ne sont toujours jamais montrés à quiconque.

## Trouver quelqu'un

- Filtres de recherche : « Que recherchez-vous » (rencontres / conception / conception polyandre / tests IST), « Qui recherchez-vous » (hommes, femmes, couples), sélections en cascade pays → ville, « peut voyager dans votre pays » avec listes par pays, couleur de peau, préférence de test, uniquement compatibles IST.
- Assistant d'intégration : âge (masquable), langues, bio, photo.
- **Chat P2P** via libp2p (gossipsub) + Nostr, avec repli sur API HTTP.

## Conception

Deux façons de planifier un enfant, et les deux reposent sur la même idée : l'intention réelle se montre par un enjeu réel en EVOLVE — jamais par des promesses. L'engagement d'un homme vit dans son dépôt EvolveFund (à partir de 15 EVOLVE, bloqué au moins 30 jours), et une femme peut fixer son propre dépôt minimum pour les hommes qui la contactent.

**Conception.** La femme mène : elle invite un homme en particulier et le nomme dans un lien (bond). Il doit avoir un dépôt EvolveFund actif ; quand les deux confirment, il est verrouillé et le compte à rebours démarre. La grossesse est déclarée entre 14 et 30 jours après la confirmation, et les tests IST et ADN du couple sont faits lors de la rencontre elle-même — la fraîcheur des résultats IST compte, l'ADN ne vieillit pas. Une fois la paternité confirmée, le dépôt de l'homme passe à la femme ; si elle n'est pas confirmée, le dépôt lui est simplement restitué. Rien ne change de mains avant que les faits soient établis.

**Conception polyandre.** Le choix lui appartient, et reste privé. Elle ouvre une session qui dure 48 heures — sans dépôt propre (elle peut en ajouter un uniquement pour la réputation, si elle le souhaite). Les hommes avec un dépôt actif peuvent la rejoindre — jusqu'à 50 — et confirmer, ce qui verrouille leur mise. Quatorze jours après la clôture de la session, le père est choisi. Il récupère son dépôt plus une récompense de la cagnotte : le double de son dépôt et 1 EVOLVE pour chaque autre participant. Les hommes non choisis perdent leur mise — 90 % à la femme, 10 % au père choisi. Elle ne risque rien et ne peut que gagner ; les hommes mettent leur mise derrière le droit d'être choisis.

## Le jeton EVOLVE (testnet uniquement)

- ERC-20, offre maximale **8,000,000,000 EVOLVE**. Les actions d'administration sont encadrées par un `TimelockController` de 48 heures.
- **Répartition prévue de l'offre** — conçue pour mettre presque toute l'offre au service des utilisateurs, pas des initiés :

| Objet                                                  |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Fondateurs et équipe (salaire / récompense)            |    25,000,000 |
| Réserve DEX (futur)                                    |     4,000,000 |
| Vente publique (prévue)                                |     5,000,000 |
| Réserve de récompenses — labos, patients, mères, pères | 7,966,000,000 |

- **Vente publique prévue** — 5,000,000 EVOLVE vendus par l'application à **$0.8 pièce**, payables dans tout jeton pris en charge par l'application ; le produit finance le développement. _(Prévu — pas encore actif.)_
- **Émission trustless (prévue)** — la réserve de récompenses de ~7,966,000,000 doit être verrouillée dans un `RewardVault` non vidable : libérée uniquement et progressivement via les récompenses aux labos, patients, mères et pères, tout changement de règle exigeant un vote de gouvernance. Même le fondateur ne peut pas la retirer. Conception : [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Économie des cadeaux emoji** — un cadeau coûte 1 EVOLVE, réparti proportionnellement entre les propriétaires de cadeaux existants ; un modèle de revenus perpétuel, et les cadeaux sont transférables.
- **EvolveFund** — staking masculin (min 15 EVOLVE, verrouillage de 30 jours) qui compte dans le poids de gouvernance ; les femmes utilisent leur solde de portefeuille.
- **Récompenses de vérification** — 1 EVOLVE à l'utilisateur vérifié et 1 EVOLVE au laboratoire qui confirme, par vérification IST/ADN (plus un faucet à débit limité).
- **Gouvernance** — le poids de vote combine la réputation récursive (8 votes, profondeur 3), la part d'enfants/paternité et les EVOLVE misés ou détenus.
- Intégration **LayerZero OFT** pour les futurs transferts multichaînes d'EVOLVE (dépendances en place ; rien déployé au-delà de Sepolia pour l'instant).

## Soutenir le projet

EVOLVE est indépendant et open-source. S'il vous est utile, vous pouvez soutenir le développement par un don — chaque contribution va au code, aux partenariats avec les laboratoires, à l'hébergement et à la traduction.

- **Détails des dons (EVM, Monero et plus) :** [DONATE.md](DONATE.md)
- **Page de dons multilingue (34 langues) :** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Une vente publique de jetons est prévue dans la feuille de route mais n'est **pas** active aujourd'hui. Les dons sont des cadeaux qui soutiennent le développement open-source et ne donnent droit à aucun jeton, aucune participation, aucun rendement ni profit. Ne donnez que ce que vous pouvez vous permettre de perdre.

## Architecture et pile technique

Monorepo géré avec npm workspaces + Turborepo :

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

Principaux contrats intelligents : `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (cadeaux emoji + récompenses), `Governance.sol`, `BondManager.sol` (conception et conception polyandre), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, et un `TimelockController` OpenZeppelin.

Détails : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Feuille de route

En cours : mise en production de l'application web. Prévu : registre on-chain des laboratoires et certification des tests, un véritable adaptateur de fournisseur de messagerie pour l'ingestion des rapports de laboratoire, attestations vérifiées on-chain sur les profils, le **RewardVault trustless** avec émission contrôlée par la gouvernance ([design](docs/REWARD-VAULT-PLAN.md)), la **vente publique de jetons**, la mise à jour du vesting pour l'allocation du fondateur, et la mise en place de liquidité DEX (actuellement bloquée — elle nécessite des déploiements du jeton sur mainnet). L'expansion multi-réseaux (Arbitrum, Avalanche et autres chaînes EVM) suivra après le durcissement du testnet.

Liste complète : [docs/ROADMAP.md](docs/ROADMAP.md).

## Premiers pas (développeurs)

Prérequis : **Node.js 20+** et npm 10.x.

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

## Contribuer

Les contributions sont les bienvenues — code, rapports de bugs, suggestions de fonctionnalités et propositions. Veuillez lire [CONTRIBUTING.md](CONTRIBUTING.md) et notre [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) avant de commencer.

## Dépôts (miroirs)

| Miroir   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentation

- [Quoi et pourquoi](docs/WHAT-AND-WHY.md) — problème, vision, valeurs fondamentales
- [Comment ça marche](docs/HOW-IT-WORKS.md) — parcours utilisateurs, pas à pas
- [Architecture](docs/ARCHITECTURE.md) — monorepo, packages, flux de données
- [Tokenomics](docs/TOKENOMICS.md) — modèle du jeton et répartition de l'offre
- [Plan RewardVault](docs/REWARD-VAULT-PLAN.md) — émission trustless (prévue)
- [Feuille de route](docs/ROADMAP.md) — jalons et statut actuel
- [FAQ](docs/FAQ.md) — questions fréquentes
- [Guide des portefeuilles](docs/WALLETS.md) — comment créer des portefeuilles et obtenir des adresses de don

## Licence

Licencié sous la [licence MIT](LICENSE).
