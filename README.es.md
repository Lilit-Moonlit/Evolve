[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Citas, concepción y salud verificada — privado por defecto, confianza donde importa.**

EVOLVE es una plataforma descentralizada y de código abierto para personas que están hartas de entregar su número de teléfono, su cara y sus datos de salud más íntimos a la base de datos de otro. Inicias sesión con tu propia cartera cripto — sin teléfono, sin correo electrónico, sin KYC — y puedes recuperar tu cuenta mediante un compromiso de ADN on-chain. Tus datos de salud siguen siendo tuyos: los resultados de las pruebas se analizan automáticamente, los estados individuales de los patógenos **nunca** se muestran a nadie, y el emparejamiento se basa únicamente en veredictos anónimos de compatibilidad (Safe / Compatible / Caution / Risk). El chat funciona de igual a igual a través de libp2p y Nostr, con un respaldo HTTP por comodidad.

> **Estado — la plataforma funciona hoy; mainnet y DEX son lo siguiente.**
> Citas, concepción, verificación de salud, el flujo de laboratorio, el chat P2P, el token EVOLVE y la gobernanza están todos en funcionamiento. Queda por delante: un **despliegue en mainnet y liquidez en DEX**, más una **venta pública prevista** (ver [El token EVOLVE](#el-token-evolve-solo-testnet)).
> Los contratos inteligentes están desplegados **solo en la testnet de Ethereum Sepolia**. Nada de esto es asesoramiento financiero ni una oferta de inversión.

> **¿Te resulta útil EVOLVE? Apoya el desarrollo — cada donación va a código, alianzas con laboratorios, alojamiento y traducción → [DONATE.md](DONATE.md).**

## Nada que temer

EVOLVE se construyó en torno a las preguntas que la gente realmente se hace antes de confiar en una plataforma así.

| La preocupación                                   | Lo que EVOLVE ya hace al respecto                                                                                                                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Mis datos de salud se filtrarán.»                | Los resultados individuales de los patógenos **nunca** se muestran a nadie — solo un veredicto anónimo: Safe / Compatible / Caution / Risk.                                                                |
| «Mis fotos acabarán en alguna parte.»             | Las fotos están borrosas por defecto. El propietario concede una vista de **15 segundos** o **permanente** — a petición o de forma proactiva. Ver es gratis.                                               |
| «Tendré que entregar mi documento o mi teléfono.» | Inicio de sesión con cartera (SIWE). Sin teléfono, sin correo, sin KYC. La recuperación funciona mediante un compromiso de ADN on-chain.                                                                   |
| «Él o ella miente sobre estar sano.»              | Los resultados están **verificados por laboratorio** (QR + reconocimiento facial), y las pruebas de la pareja se hacen **en el encuentro** — los resultados recientes de ETS importan; el ADN no envejece. |
| «¿Alguien se llevará mi dinero y desaparecerá?»   | La concepción funciona con una participación real en riesgo: el depósito de un hombre solo se mueve cuando la paternidad está **confirmada**; de lo contrario, simplemente se le devuelve.                 |
| «¿Es el token un pump-and-dump?»                  | Hoy no hay ninguna venta activa; el código es abierto (MIT); se prevé bloquear la reserva no puesta en circulación en una **bóveda no vaciable** de la que ni siquiera el fundador puede retirar.          |
| «¿Pueden cerrar o prohibir la plataforma?»        | Mensajería de igual a igual ante todo, almacenamiento descentralizado (IPFS / Arweave), 18 configuraciones de redes EVM y ningún dominio fijado en el código.                                              |

## Qué y por qué

Las apps de citas tradicionales te piden cambiar tu número de teléfono, correo, fotos y detalles íntimos de salud por una base de datos central — y luego confiar en esa base para siempre. EVOLVE parte de la premisa opuesta: **privacidad por defecto, autocustodia y sin un único punto de falla**.

- **Privacidad por defecto** — los datos de salud nunca se exponen; solo veredictos anónimos.
- **Resistencia a prohibiciones** — mensajería P2P ante todo, almacenamiento descentralizado, diseño multirred, sin dominios fijados en el código.
- **Identidad autocustodiada** — tu cartera es tu inicio de sesión; recuperación basada en ADN en lugar de correo o teléfono.
- **Sin barrera de KYC** — no se requiere documento de identidad, teléfono ni correo para usar la plataforma.

Lee la justificación completa en [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Salud en la que puedes confiar de verdad

- Sube una prueba de ETS como texto sin formato o PDF (extracción de la capa de texto, con respaldo OCR para escaneos).
- El analizador conoce 8 patógenos: VIH-1/2, sífilis, clamidia, gonorrea, VHS-1, VHS-2, hepatitis B, hepatitis C — en formatos de informe en inglés, ucraniano y ruso.
- **El estado individual de los patógenos nunca se muestra a otros usuarios.** Los perfiles solo muestran el veredicto anónimo: **Safe / Compatible / Caution / Risk**.
- Los registros de ADN on-chain (`DNAVerification.sol`) impulsan la recuperación y la verificación.

### Laboratorios asociados — pruebas, no promesas

Entra en un laboratorio asociado y muestra tu código QR. El laboratorio lo escanea, confirma tu identidad con **reconocimiento facial** (para que nadie más pueda recoger tu resultado) y adjunta el informe de ETS — PDF, escaneo o texto, incluso con un OCR deficiente. El resultado lo firma un laboratorio real, no tú, así que los demás ven un **hecho verificado** en lugar de tu palabra. Y cada verificación confirmada paga **1 EVOLVE al paciente y 1 EVOLVE al laboratorio** — ambas partes tienen una razón para ser honestas. Los patógenos individuales, aun así, nunca se muestran a nadie.

## Encontrar a alguien

- Filtros de búsqueda: «Qué buscas» (citas / concepción / concepción poliándrica / pruebas de ETS), «A quién buscas» (hombres, mujeres, parejas), selecciones en cascada país → ciudad, «puede viajar a tu país» con listas por país, color de piel, preferencia de pruebas, solo compatibles con ETS.
- Asistente de incorporación: edad (ocultable), idiomas, bio, foto.
- **Chat P2P** a través de libp2p (gossipsub) + Nostr, con respaldo de API HTTP.

## Concepción

Dos formas de planear un hijo, y ambas descansan en la misma idea: la intención real se demuestra con una participación real en EVOLVE — nunca con promesas. El compromiso de un hombre vive en su depósito de EvolveFund (desde 15 EVOLVE, bloqueado al menos 30 días), y una mujer puede fijar su propio depósito mínimo para los hombres que la alcanzan.

**Concepción.** La mujer lidera: invita a un hombre concreto y lo nombra en un vínculo (bond). Él necesita un depósito activo en EvolveFund; cuando ambos confirman, se bloquea y comienza la cuenta atrás. El embarazo se notifica entre 14 y 30 días tras la confirmación, y las pruebas de ETS y ADN de la pareja se hacen en el propio encuentro — los resultados recientes de ETS importan; el ADN no envejece. Una vez confirmada la paternidad, el depósito del hombre pasa a la mujer; si no se confirma, el depósito simplemente se le devuelve. Nada cambia de manos hasta que los hechos quedan establecidos.

**Concepción poliándrica.** La elección es suya y permanece privada. Ella abre una sesión que dura 48 horas — sin depósito propio (puede añadir uno solo por reputación, si quiere). Los hombres con un depósito activo pueden unirse — hasta 50 — y confirmar, lo que bloquea su participación. Catorce días después del cierre de la sesión se elige al padre. Él recupera su depósito más una recompensa del fondo: el doble de su depósito y 1 EVOLVE por cada otro participante. Los hombres no elegidos pierden su participación — el 90 % para la mujer, el 10 % para el padre elegido. Ella no arriesga nada y solo puede ganar; los hombres ponen su participación tras el derecho a ser elegidos.

## El token EVOLVE (solo testnet)

- ERC-20, emisión máxima **8,000,000,000 EVOLVE**. Las acciones de administración están limitadas por un `TimelockController` de 48 horas.
- **Reparto previsto de la emisión** — diseñado para que casi toda la emisión trabaje para los usuarios, no para los insiders:

| Propósito                                                        |        EVOLVE |
| ---------------------------------------------------------------- | ------------: |
| Fundadores y equipo (salario / recompensa)                       |    25,000,000 |
| Reserva DEX (futuro)                                             |     4,000,000 |
| Venta pública (prevista)                                         |     5,000,000 |
| Reserva de recompensas — laboratorios, pacientes, madres, padres | 7,966,000,000 |

- **Venta pública prevista** — 5,000,000 EVOLVE vendidos por la app a **$0.8 cada uno**, pagaderos con cualquier token que la app admita; lo recaudado financia el desarrollo. _(Previsto — aún no activo.)_
- **Emisión trustless (prevista)** — la reserva de recompensas de ~7,966,000,000 se prevé bloquear en un `RewardVault` no vaciable: liberada solo gradualmente mediante recompensas a laboratorios, pacientes, madres y padres, con cambios de reglas que exigen una votación de gobernanza. Ni siquiera el fundador puede retirarla. Diseño: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Economía de regalos emoji** — un regalo cuesta 1 EVOLVE, repartido proporcionalmente entre los propietarios de regalos existentes; un modelo de ingresos perpetuo, y los regalos son transferibles.
- **EvolveFund** — staking masculino (mín. 15 EVOLVE, bloqueo de 30 días) que cuenta para el peso de gobernanza; las mujeres usan el saldo de su cartera.
- **Recompensas de verificación** — 1 EVOLVE al usuario verificado y 1 EVOLVE al laboratorio que confirma, por cada verificación de ETS/ADN (más un faucet con límite de frecuencia).
- **Gobernanza** — el peso del voto combina reputación recursiva (8 votos, profundidad 3), proporción de hijos/paternidad y EVOLVE apostados o mantenidos.
- Integración **LayerZero OFT** para futuras transferencias multicanal de EVOLVE (dependencias listas; nada desplegado más allá de Sepolia por ahora).

## Apoya el proyecto

EVOLVE es independiente y de código abierto. Si te resulta útil, puedes apoyar el desarrollo con una donación — cada contribución va a código, alianzas con laboratorios, alojamiento y traducción.

- **Datos para donar (EVM, Monero y más):** [DONATE.md](DONATE.md)
- **Página de donaciones multilingüe (34 idiomas):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Una venta pública de tokens está en la hoja de ruta pero **no** está activa hoy. Las donaciones son regalos que apoyan el desarrollo de código abierto y no dan derecho a tokens, participación, rendimientos ni beneficios. Da solo lo que puedas permitirte perder.

## Arquitectura y pila tecnológica

Monorepo gestionado con npm workspaces + Turborepo:

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

Principales contratos inteligentes: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (regalos emoji + recompensas), `Governance.sol`, `BondManager.sol` (concepción y concepción poliándrica), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, y un `TimelockController` de OpenZeppelin.

Detalles: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Hoja de ruta

En curso: preparación para producción de la app web. Previsto: registro de laboratorios on-chain y certificación de pruebas, un adaptador real de proveedor de correo para la recepción de informes de laboratorio, atestaciones verificadas on-chain en los perfiles, el **RewardVault trustless** con emisión controlada por gobernanza ([diseño](docs/REWARD-VAULT-PLAN.md)), la **venta pública de tokens**, la actualización del vesting para la asignación del fundador y la provisión de liquidez en DEX (actualmente bloqueada — requiere despliegues del token en mainnet). La expansión multirred (Arbitrum, Avalanche y otras cadenas EVM) llega tras consolidar la testnet.

Lista completa: [docs/ROADMAP.md](docs/ROADMAP.md).

## Primeros pasos (desarrolladores)

Requisitos: **Node.js 20+** y npm 10.x.

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

## Contribuir

Las contribuciones son bienvenidas — código, informes de errores, sugerencias de funciones y propuestas. Lee [CONTRIBUTING.md](CONTRIBUTING.md) y nuestro [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) antes de empezar.

## Repositorios (espejos)

| Espejo   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentación

- [Qué y por qué](docs/WHAT-AND-WHY.md) — problema, visión, valores centrales
- [Cómo funciona](docs/HOW-IT-WORKS.md) — flujos de usuario, paso a paso
- [Arquitectura](docs/ARCHITECTURE.md) — monorepo, paquetes, flujos de datos
- [Tokenomics](docs/TOKENOMICS.md) — modelo del token y reparto de la emisión
- [Plan RewardVault](docs/REWARD-VAULT-PLAN.md) — emisión trustless (prevista)
- [Hoja de ruta](docs/ROADMAP.md) — hitos y estado actual
- [FAQ](docs/FAQ.md) — preguntas frecuentes
- [Guía de carteras](docs/WALLETS.md) — cómo crear carteras y obtener direcciones de donación

## Licencia

Publicado bajo la [Licencia MIT](LICENSE).
