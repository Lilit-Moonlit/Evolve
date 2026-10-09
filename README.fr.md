[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Rencontres, conception et santé vérifiée — privé par défaut, fiable là où ça compte.**

EVOLVE est une plateforme open source et décentralisée pour les personnes qui en ont assez de confier leur numéro de téléphone, leur visage et leurs données de santé les plus intimes à la base de données de quelqu'un d'autre. Vous vous connectez avec votre propre portefeuille crypto — sans téléphone, sans e-mail, sans KYC — et vous pouvez récupérer votre compte grâce à un engagement ADN on-chain. Vos données de santé restent les vôtres : les résultats de tests sont analysés automatiquement, les statuts individuels des pathogènes ne sont **jamais** montrés à personne, et le matching repose uniquement sur des verdicts de compatibilité anonymes (Safe / Compatible / Caution / Risk). Le chat fonctionne en pair-à-pair via libp2p et Nostr, avec un repli HTTP par commodité. Les cadeaux et les transferts s'acheminent vers une confidentialité totale : les cadeaux privés sont déjà en ligne, avec un portefeuille protégé Railgun et un prototype à connaissance nulle Aztec sur la feuille de route (voir [Confidentialité & transactions confidentielles](#confidentialité--transactions-confidentielles)).

> **Statut — mode démo, en développement actif.**
> Rencontres, conception, vérification de la santé, parcours laboratoire, chat P2P, token EVOLVE et gouvernance sont tous implémentés et fonctionnent dans une **démo locale** — l'application n'est **pas encore déployée publiquement**. Reste à venir : un **déploiement mainnet et la liquidité DEX**, plus une **vente publique prévue** (voir [Le token EVOLVE](#le-token-evolve-testnet-uniquement)).
> Les smart contracts sont déployés **uniquement sur le testnet Ethereum Sepolia**. Rien ici n'est un conseil financier ni une offre d'investissement.

> **EVOLVE vous est utile ? Soutenez le développement — chaque don finance le code, les partenariats laboratoires, l'hébergement et la traduction → [DONATE.md](DONATE.md).**

## Rien à craindre

EVOLVE a été construit autour des questions que les gens se posent réellement avant de faire confiance à une telle plateforme.

| L'inquiétude                                               | Ce qu'EVOLVE fait déjà à ce sujet                                                                                                                                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| « Mes données de santé vont fuiter. »                      | Les résultats individuels de pathogènes ne sont **jamais** montrés à personne — seulement un verdict anonyme : Safe / Compatible / Caution / Risk.                                                                            |
| « Mes photos vont finir quelque part. »                    | Les photos sont floutées par défaut. Le propriétaire accorde une vue de **15 secondes** ou **permanente** — sur demande ou proactivement. La consultation est gratuite.                                                       |
| « Je devrai donner ma pièce d'identité ou mon téléphone. » | Connexion par portefeuille (SIWE). Pas de téléphone, pas d'e-mail, pas de KYC. La récupération passe par un engagement ADN on-chain.                                                                                          |
| « Il ou elle ment sur sa santé. »                          | Les résultats sont **vérifiés en laboratoire** (QR + correspondance faciale), et les tests du couple sont faits **à la rencontre** — les résultats d'IST récents comptent, l'ADN ne vieillit pas.                             |
| « Quelqu'un va prendre mon argent et disparaître ? »       | La conception repose sur une vraie mise en jeu : la mise d'un homme ne bouge que lorsque la paternité est **confirmée** ; sinon, elle lui est simplement restituée.                                                           |
| « Le token est-il un pump-and-dump ? »                     | Le code est ouvert (MIT) ; presque toute l'offre est réservée aux récompenses des utilisateurs, et la réserve non circulante doit être verrouillée dans un **coffre non vidable** dont même le fondateur ne peut pas retirer. |
| « La plateforme peut-elle être fermée ou interdite ? »     | Messagerie pair-à-pair d'abord, stockage décentralisé (IPFS / Arweave), 18 configurations de réseaux EVM et aucun domaine codé en dur.                                                                                        |

## Quoi & Pourquoi

Les applications de rencontre traditionnelles vous demandent d'échanger votre numéro de téléphone, votre e-mail, vos photos et vos détails de santé intimes contre une base de données centrale — puis de faire confiance à cette base pour toujours. EVOLVE part du postulat inverse : **confidentialité par défaut, auto-conservation et absence de point de défaillance unique**.

- **Confidentialité par défaut** — les données de santé ne sont jamais exposées ; seulement des verdicts anonymes.
- **Résistance aux interdictions** — messagerie P2P d'abord, stockage décentralisé, conception multi-réseaux, aucun domaine codé en dur.
- **Identité auto-conservée** — votre portefeuille est votre identifiant ; récupération par ADN plutôt que par e-mail ou téléphone.
- **Aucune barrière KYC** — aucune pièce d'identité, téléphone ou e-mail requis pour utiliser la plateforme.

Lisez la justification complète dans [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Une santé à laquelle vous pouvez vraiment faire confiance

- Importez un test IST sous forme de texte brut ou de PDF (extraction de la couche texte, avec un repli OCR pour les scans).
- L'analyseur connaît 8 pathogènes : VIH-1/2, Syphilis, Chlamydia, Gonorrhée, HSV-1, HSV-2, Hépatite B, Hépatite C — dans les formats de rapport anglais, ukrainien et russe.
- **Le statut individuel des pathogènes n'est jamais affiché aux autres utilisateurs.** Les profils ne montrent que le verdict anonyme : **Safe / Compatible / Caution / Risk**.
- Les enregistrements ADN on-chain (`DNAVerification.sol`) assurent la récupération et la vérification.

### Laboratoires partenaires — la preuve, pas la promesse

Rendez-vous dans un laboratoire partenaire et montrez votre QR code. Le laboratoire le scanne, confirme votre identité par **correspondance faciale** (pour que personne d'autre ne puisse récupérer votre résultat) et joint le rapport IST — PDF, scan ou texte, même avec un OCR médiocre. Le résultat est signé par un vrai laboratoire, pas par vous, donc les autres voient un **fait vérifié** plutôt que vos paroles. Et chaque vérification confirmée paie **1 EVOLVE au patient et 1 EVOLVE au laboratoire** — les deux côtés ont une raison d'être honnêtes. Les pathogènes individuels ne sont toujours montrés à personne.

## Trouver quelqu'un

- Filtres de recherche : « Que recherchez-vous » (rencontres / conception / conception polyandre / dépistage IST), « Qui recherchez-vous » (hommes, femmes, couples), sélections en cascade pays → ville, « peut voyager vers votre pays » avec listes par pays, couleur de peau, préférence de dépistage, uniquement compatibles IST.
- Assistant d'intégration : âge (masquable), langues, bio, photo.
- **Chat P2P** via libp2p (gossipsub) + Nostr, avec un repli API HTTP.

## Conception

Deux façons de planifier un enfant, toutes deux fondées sur la même idée : l'intention réelle se montre par une vraie mise en EVOLVE — jamais par des promesses. L'engagement d'un homme vit dans son dépôt EvolveFund (à partir de 15 EVOLVE, verrouillé au moins 30 jours), et une femme peut fixer son propre dépôt minimum pour les hommes qui l'atteignent.

**Conception.** La femme mène : elle invite un homme précis et le nomme dans un lien. Il doit avoir un dépôt EvolveFund actif ; lorsque les deux confirment, il est verrouillé et le compte à rebours démarre. La grossesse est déclarée entre 14 et 30 jours après la confirmation, et les tests IST et ADN du couple sont faits lors de la rencontre elle-même — les résultats IST récents comptent, l'ADN ne vieillit pas. Une fois la paternité confirmée, le dépôt de l'homme passe à la femme ; sinon, le dépôt lui est simplement restitué. Rien ne change de mains tant que les faits ne sont pas établis.

**Conception polyandre.** Le choix lui appartient et reste privé. Elle ouvre une session de 48 heures — sans dépôt propre (elle peut en ajouter un uniquement pour la réputation, si elle le souhaite). Les hommes avec un dépôt actif peuvent rejoindre — jusqu'à 50 — et confirmer, ce qui verrouille leur mise. Quatorze jours après la clôture de la session, le père est choisi. Il récupère son dépôt plus une récompense du pool : le double de son dépôt et 1 EVOLVE pour chaque autre participant. Les hommes non choisis perdent leur mise — 90 % à la femme, 10 % au père choisi. Elle ne risque rien et ne peut que gagner ; les hommes mettent leur enjeu derrière le droit d'être choisis.

## Confidentialité & transactions confidentielles

La confidentialité est la règle par défaut — et EVOLVE construit une feuille de route vers des transferts on-chain entièrement confidentiels.

- **Cadeaux privés** — envoyez une rose 🌹 ou un cactus 🌵 (1 EVOLVE) et choisissez qui peut voir que c'était vous : _public_, _anonyme pour tous sauf le destinataire_ ou _entièrement anonyme_. Dans les modes anonymes, le cadeau voyage sous forme de bon à usage unique que le destinataire réclame avec son propre portefeuille, de sorte que l'expéditeur n'apparaît jamais on-chain. (L'anonymat de l'expéditeur est aujourd'hui de niveau occasionnel : la transaction de financement peut être corrélée par le temps et le montant.)
- **Portefeuille protégé Railgun** — un portefeuille privé derrière un feature flag (`VITE_RAILGUN_ENABLED`, désactivé par défaut) qui masque les montants et les adresses via le pool à connaissance nulle de Railgun. C'est la voie vers une vraie anonymité de l'expéditeur.
- **Prototype Aztec** — la même logique de transfert privé et de lien privé, exprimée en circuits Noir à connaissance nulle et gardée derrière un seuil explicite jusqu'à ce qu'Aztec soit prêt pour la production. Voir [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Modèle à deux portefeuilles** — un portefeuille de mise public participe à la gouvernance ; un portefeuille protégé privé est délibérément **exclu** du poids de vote, gardant confidentialité et pouvoir de vote séparés.

Détails : [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## Le token EVOLVE (testnet uniquement)

- ERC-20, offre maximale **8 000 000 000 EVOLVE**. Les actions d'administration sont sécurisées par un `TimelockController` de 48 heures.
- **Répartition prévue** — conçue pour mettre presque toute l'offre au travail pour les utilisateurs, pas pour les initiés :

| Objectif                                               |        EVOLVE |
| ------------------------------------------------------ | ------------: |
| Fondateurs et équipe (salaire / récompense)            |    25 000 000 |
| Réserve DEX (future)                                   |     4 000 000 |
| Vente publique (prévue)                                |     5 000 000 |
| Réserve de récompenses — labos, patients, mères, pères | 7 966 000 000 |

- **Vente publique prévue** — 5 000 000 EVOLVE vendus par l'application à **0,8 $ l'unité**, payables dans n'importe quel token supporté par l'application ; les recettes financent le développement. _(Prévu — pas encore en ligne.)_
- **Émission sans confiance (prévue)** — la réserve de récompenses d'environ 7 966 000 000 doit être verrouillée dans un `RewardVault` non vidable : libérée seulement progressivement via les récompenses labo, patient, mère et père, avec des changements de règles exigeant un vote de gouvernance. Même le fondateur ne peut pas la retirer. Conception : [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Économie de cadeaux emoji** — un cadeau coûte 1 EVOLVE, réparti proportionnellement entre les propriétaires de cadeaux existants ; un modèle de revenu perpétuel, et les cadeaux sont transférables.
- **EvolveFund** — staking masculin (min 15 EVOLVE, verrouillage 30 jours) qui compte dans le poids de gouvernance ; les femmes utilisent le solde de leur portefeuille.
- **Récompenses de vérification** — 1 EVOLVE à l'utilisateur vérifié et 1 EVOLVE au laboratoire confirmateur par vérification IST/ADN (plus un faucet limité en débit).
- **Gouvernance** — le poids de vote combine la réputation récursive (8 votes, profondeur 3), la part d'enfants/paternité et les EVOLVE stakés ou détenus.
- Intégration **LayerZero OFT** pour les futurs transferts EVOLVE multi-chaînes (dépendances en place ; rien de déployé au-delà de Sepolia pour l'instant).

## Soutenir le projet

EVOLVE est indépendant et open source. S'il vous est utile, vous pouvez soutenir le développement par un don — chaque contribution finance le code, les partenariats laboratoires, l'hébergement et la traduction.

- **Détails des dons (EVM, Monero et plus) :** [DONATE.md](DONATE.md)
- **Page de dons multilingue (34 langues) :** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Une vente publique de tokens est **prévue** — 5 000 000 EVOLVE, vendus par l'application (voir [Le token EVOLVE](#le-token-evolve-testnet-uniquement)). Les dons sont des cadeaux qui soutiennent le développement open source et ne donnent aucun droit sur les tokens, les capitaux, les rendements ou les profits. Ne donnez que ce que vous pouvez vous permettre de perdre.

## Architecture & stack technique

Monorepo géré avec npm workspaces + Turborepo :

```
apps/
  web/          # Vite + React + TypeScript (application web principale, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flags & configuration distante dynamique
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Types partagés, utilitaires, middleware, web3
  matching/     # Algorithmes de matching, filtres, classement
  p2p/          # Réseau libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architecture, tokenomics, feuille de route, FAQ
```

Smart contracts clés : `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (cadeaux emoji + récompenses), `Governance.sol`, `BondManager.sol` (conception et conception polyandre), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, et un `TimelockController` OpenZeppelin.

Détails : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Feuille de route

En cours : préparation de l'application web pour la production. Prévu : registre de laboratoires on-chain et certification des tests, un adaptateur de vrai fournisseur de messagerie pour l'ingestion des rapports de laboratoire, des attestations vérifiées on-chain sur les profils, le **`RewardVault` sans confiance** avec émission pilotée par la gouvernance ([conception](docs/REWARD-VAULT-PLAN.md)), la **vente publique de tokens**, la mise à jour du vesting des tokens pour l'allocation des fondateurs, et la mise en place de liquidité DEX (actuellement bloquée — elle exige des déploiements de tokens mainnet). Côté confidentialité, les cadeaux privés sont terminés, tandis que le portefeuille protégé Railgun et la migration des liens privés Aztec restent derrière les vérifications de [docs/ROADMAP.md](docs/ROADMAP.md) et [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). L'expansion multi-réseaux (Arbitrum, Avalanche et autres chaînes EVM) suivra après le durcissement du testnet.

Liste complète : [docs/ROADMAP.md](docs/ROADMAP.md).

## Pour commencer (développeurs)

Prérequis : **Node.js 20+** et npm 10.x.

```bash
# Cloner et installer tous les workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Application web (serveur de dev Vite sur http://localhost:3000)
cd apps/web
npm run dev
npm test                # suite vitest

# Smart contracts
cd packages/contracts
npm run compile         # hardhat compile
npm test                # suite de tests hardhat
npm run deploy:local    # déployer tous les contrats dans un réseau Hardhat in-process
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

- [Quoi & Pourquoi](docs/WHAT-AND-WHY.md) — problème, vision, valeurs fondamentales
- [Comment ça marche](docs/HOW-IT-WORKS.md) — parcours utilisateur, pas à pas
- [Architecture](docs/ARCHITECTURE.md) — monorepo, paquets, flux de données
- [Tokenomics](docs/TOKENOMICS.md) — modèle du token et répartition de l'offre
- [Plan RewardVault](docs/REWARD-VAULT-PLAN.md) — émission sans confiance (prévue)
- [Intégration Railgun](docs/RAILGUN-INTEGRATION.md) — spike d'intégration du portefeuille protégé
- [Mises protégées](docs/SHIELDED-STAKES-DESIGN.md) — mises de conception privées (conception)
- [Prototype Aztec](docs/AZTEC-PROTOTYPE.md) — transferts privés ZK & liens (recherche)
- [Feuille de route](docs/ROADMAP.md) — jalons et statut actuel
- [FAQ](docs/FAQ.md) — questions fréquentes
- [Guide des portefeuilles](docs/WALLETS.md) — comment créer des portefeuilles et obtenir des adresses de don

## Licence

Sous licence [MIT License](LICENSE).
