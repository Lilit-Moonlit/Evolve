[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Rencontres, conception et vérification de santé — privé par défaut, vérifié là où c'est important.**

EVOLVE est une plateforme open-source et décentralisée de connexions intimes vérifiables : rencontres, conception et compatibilité STD/ADN anonyme. Vous vous connectez avec votre propre portefeuille crypto (Sign-In with Ethereum) — sans numéro de téléphone, sans e-mail, sans KYC — et vous pouvez récupérer votre compte grâce à un engagement ADN on-chain. Vos données de santé restent les vôtres : les résultats de laboratoire sont analysés automatiquement, les statuts individuels des pathogènes ne sont **jamais** montrés à quiconque, et le matching repose uniquement sur des verdicts de compatibilité anonymes (Safe / Compatible / Caution / Risk). Le chat fonctionne en pair-à-pair via libp2p et Nostr, avec un repli HTTP par commodité ; l'application embarque en outre une façade publique légère « Safety Mode » ainsi qu'un Companion Mode autonome pour évaluer les résultats de tests STD.

> **Statut : alpha à un stade précoce.** EVOLVE est en développement actif et n'est pas un produit fini.
> Les contrats intelligents sont déployés **uniquement sur le testnet Ethereum Sepolia**.
> Il n'y a **pas de déploiement mainnet, pas de DEX, pas de liquidité et pas de vente publique de tokens** — et rien de tout cela n'est promis.
> Les fonctionnalités peuvent changer ou casser à tout moment. Rien ici n'est un conseil financier ou une offre d'investissement.

## Le quoi et le pourquoi

Les plateformes de rencontre traditionnelles vous demandent de confier votre numéro de téléphone, votre e-mail, vos photos et des détails intimes sur votre santé à une base de données centrale. EVOLVE part du principe inverse : confidentialité par défaut, autocustodie (self-custody) et absence de point de défaillance unique. Valeurs fondamentales :

- **Confidentialité par défaut** — les données de santé ne sont jamais exposées ; uniquement des verdicts anonymes.
- **Résistance aux bannissements** — messagerie P2P d'abord, stockage décentralisé (IPFS / Arweave), conception multi-réseaux, aucun domaine codé en dur.
- **Identité autocustodiée** — votre portefeuille est votre identifiant ; récupération par ADN au lieu d'e-mail/téléphone.
- **Pas de barrière KYC** — aucune pièce d'identité officielle, aucun téléphone ni e-mail requis pour utiliser la plateforme.

Lisez la justification complète dans [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (en anglais).

## Fonctionnalités clés

### Identité et confidentialité

- **Connexion par portefeuille SIWE** (MetaMask et autres portefeuilles EVM) — la sortie de secours résistante à la censure.
- **Récupération de compte par ADN** — votre résultat de test ADN est haché (SHA-256, engagement on-chain en `bytes32`) et peut restaurer l'accès sans téléphone ni e-mail.
- **Account Abstraction (ERC-4337)** — comptes intelligents et paymaster pour un onboarding sans gas ; SIWE reste toujours disponible.

### Compatibilité santé anonyme

- Envoi de résultats de tests STD en texte brut ou en PDF (extraction de la couche texte avec repli OCR pour les pages scannées).
- Le parseur reconnaît 8 pathogènes : VIH-1/2, syphilis, chlamydia, gonorrhée, HSV-1, HSV-2, hépatite B, hépatite C (formats de rapports anglais, ukrainien et russe).
- **Le statut individuel des pathogènes n'est jamais affiché aux autres utilisateurs.** Les profils montrent uniquement un verdict anonyme : **Safe / Compatible / Caution / Risk**.
- Les enregistrements de vérification ADN on-chain (`DNAVerification.sol`) alimentent les flux de récupération et de vérification.

### Profils, recherche et communication

- Filtres de recherche : « Que recherchez-vous » (rencontres / conception / conception polyandre / tests STD), « Qui recherchez-vous » (hommes, femmes, couples), sélections en cascade pays → ville, « peut voyager dans votre pays » avec listes par pays, couleur de peau, préférence de test, uniquement compatibles STD.
- Assistant d'onboarding : âge (masquable), langues, bio, photo.
- **Confidentialité des photos** : les photos sont floutées par défaut ; le propriétaire accorde des vues de 15 secondes ou permanentes, à la demande ou de sa propre initiative. La consultation est gratuite.
- **Chat P2P** via libp2p (gossipsub) + Nostr, avec repli sur API HTTP.

### Modes de conception

- **Mode 2 — Pregnancy Bond** : une femme crée un engagement (bond), un homme stake des EVOLVE (≥ 100 sur la build testnet actuelle), les deux confirment ; après une grossesse et une paternité confirmées, le stake est transféré à la femme.
- **Mode 3 — Cryptic Choice** : une femme ouvre une session de 48 heures, les hommes y participent en stakant ; elle choisit le père — son stake lui est restitué, les autres se répartissent : 90 % pour elle / 10 % pour le père choisi.

### Laboratoires et vérification

- **Flux des laboratoires partenaires** : les laboratoires s'enregistrent comme partenaires, vérifient les patients par QR code et reconnaissance faciale, et joignent des rapports STD (PDF/texte avec extraction OCR).
- **Companion Mode** : flux autonome d'évaluation des résultats de tests STD sans rejoindre la plateforme de rencontre.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`) : une façade publique limitée (statut STD, liens de profil publics, vérifications de compatibilité) qui continue de fonctionner même si les fonctions de rencontre/conception sont restreintes dans une juridiction ou un app store.

### Token EVOLVE (testnet uniquement)

- ERC-20, offre maximale de 8 000 000 000 EVOLVE, actions d'administration conditionnées par un TimelockController de 48 heures.
- **Économie des cadeaux emoji** : un cadeau coûte 1 EVOLVE, réparti proportionnellement entre les propriétaires de cadeaux existants — un modèle de revenus perpétuel pour les détenteurs ; les cadeaux sont transférables.
- **EvolveFund** : staking masculin (15 EVOLVE minimum, verrouillage de 30 jours) comptant dans le poids de gouvernance ; les femmes utilisent leur solde de portefeuille.
- **Récompenses de vérification** : 1 EVOLVE pour l'utilisateur vérifié et 1 EVOLVE pour le laboratoire confirmateur lors d'une vérification STD/ADN (plus un faucet de test à débit limité).
- Le poids de vote en gouvernance combine la réputation récursive (8 votes, profondeur 3), la part d'enfants/paternité et les EVOLVE stakés ou détenus.
- Intégration **LayerZero OFT** pour de futurs transferts multichaîne d'EVOLVE (dépendances en place ; rien déployé au-delà de Sepolia pour l'instant).

### Plateforme

- Application web (installable en PWA) et application mobile Expo/React Native.
- Interface traduite en **34 langues**.
- Prête pour le multi-réseaux : 18 configurations de réseaux EVM (Arbitrum et Avalanche sont les L2 principales prévues — **pas encore déployées**).

## Architecture et pile technique

Monorepo géré avec npm workspaces + Turborepo :

```
apps/
  web/          # Vite + React + TypeScript (application web principale, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flags et configuration distante dynamique
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Types partagés, utilitaires, middleware, web3
  matching/     # Algorithmes de matching, filtres, classement
  p2p/          # Réseau libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Architecture, tokenomics, feuille de route, FAQ
```

Contrats intelligents clés : `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (cadeaux emoji + récompenses), `Governance.sol`, `BondManager.sol` (modes 2 et 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, `SmartAccountFactory` + `Paymaster` ERC-4337, ainsi qu'un `TimelockController` OpenZeppelin.

Détails : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (en anglais).

## Feuille de route

En cours : mise en production de l'application web. Prévu : registre de laboratoires on-chain et certification des tests, véritable adaptateur de fournisseur de messagerie pour l'ingestion des rapports de laboratoire, attestations vérifiées on-chain dans les profils, mise à jour du vesting des tokens pour les allocations fondateurs/développeurs, mise en place de liquidité DEX (actuellement bloquée — nécessite des déploiements de token en mainnet). L'expansion multi-réseaux (Arbitrum, Avalanche et autres chaînes EVM) suivra après le durcissement du testnet.

Liste complète : [docs/ROADMAP.md](docs/ROADMAP.md) (en anglais).

## Premiers pas (développeurs)

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

# Contrats intelligents
cd packages/contracts
npm run compile         # hardhat compile
npm test                # suite de tests hardhat
npm run deploy:local    # déployer tous les contrats sur un réseau Hardhat in-process
```

## Contribuer

Les contributions sont les bienvenues — code, rapports de bugs, suggestions de fonctionnalités et propositions. Veuillez lire [CONTRIBUTING.md](CONTRIBUTING.md) et notre [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) avant de commencer.

## Soutenir le projet

Si vous trouvez EVOLVE utile, vous pouvez soutenir le développement par un don — détails dans [DONATE.md](DONATE.md). Vous préférez une page web ? Utilisez la page de don multilingue (34 langues) : **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**Il n'y a pas de vente de tokens et il n'y en aura pas.** Impossible « d'investir » dans les tokens EVOLVE ; les dons sont des cadeaux destinés à soutenir le développement open-source et ne donnent droit à aucun token, aucune participation, aucun rendement ni aucune revendication financière.

## Dépôts (miroirs)

| Miroir   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentation

- [Le quoi et le pourquoi](docs/WHAT-AND-WHY.md) — problème, vision, valeurs fondamentales (anglais)
- [Comment ça marche](docs/HOW-IT-WORKS.md) — parcours utilisateurs, pas à pas (anglais)
- [Architecture](docs/ARCHITECTURE.md) — monorepo, packages, flux de données (anglais)
- [Tokenomics](docs/TOKENOMICS.md) — modèle du token et distribution de l'offre (anglais)
- [Feuille de route](docs/ROADMAP.md) — jalons et statut actuel (anglais)
- [FAQ](docs/FAQ.md) — questions fréquentes (anglais)
- [Guide des portefeuilles](docs/WALLETS.md) — créer des portefeuilles et obtenir des adresses de don (anglais)

## Licence

Sous la [Licence MIT](LICENSE).
