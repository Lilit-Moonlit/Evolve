[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)
<!-- evolve-readme-sync: 3796750887b0bd65 -->

# EVOLVE

**Citas, concepción y salud verificada — privado por defecto, confiable donde importa.**

EVOLVE es una plataforma descentralizada de código abierto para personas que están cansadas de entregar su número de teléfono, su rostro y sus datos de salud más íntimos a la base de datos de otra persona. Inicias sesión con tu propia billetera cripto — sin teléfono, sin correo, sin KYC — y puedes recuperar tu cuenta mediante un compromiso de ADN en cadena. Tus datos de salud siguen siendo tuyos: los resultados de las pruebas se analizan automáticamente, los estados individuales de los patógenos **nunca** se muestran a nadie, y el emparejamiento se basa solo en veredictos de compatibilidad anónimos (Safe / Compatible / Caution / Risk). El chat funciona de igual a igual mediante libp2p y Nostr, con un respaldo HTTP por comodidad. Los regalos y las transferencias avanzan hacia la confidencialidad total: los regalos privados ya están en vivo, con una billetera protegida Railgun y un prototipo de conocimiento cero de Aztec en la hoja de ruta (consulta [Privacidad y transacciones confidenciales](#privacidad--transacciones-confidenciales)).

> **Estado — modo demo, en desarrollo activo.**
> Citas, concepción, verificación de salud, flujo de laboratorio, chat P2P, token EVOLVE y gobernanza están implementados y funcionan en una **demo local** — la aplicación **aún no está desplegada públicamente**. Aún por delante: un **despliegue en mainnet y liquidez DEX**, más una **venta pública prevista** (consulta [El token EVOLVE](#el-token-evolve-solo-testnet)).
> Los contratos inteligentes están desplegados **solo en la red de pruebas Ethereum Sepolia**. Nada de esto es asesoramiento financiero ni una oferta de inversión.

> **¿EVOLVE te resulta útil? Apoya el desarrollo — cada donación se destina a código, alianzas con laboratorios, alojamiento y traducción → [DONATE.md](DONATE.md).**

## Nada que temer

EVOLVE se construyó en torno a las preguntas que la gente realmente se hace antes de confiar en una plataforma así.

| La preocupación                                   | Lo que EVOLVE ya hace al respecto                                                                                                                                                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «Mis datos de salud se filtrarán.»                | Los resultados individuales de patógenos **nunca** se muestran a nadie — solo un veredicto anónimo: Safe / Compatible / Caution / Risk.                                                                                 |
| «Mis fotos terminarán en algún sitio.»            | Las fotos están desenfocadas por defecto. El propietario concede una vista de **15 segundos** o **permanente** — bajo solicitud o proactivamente. Ver es gratis.                                                        |
| «Tendré que entregar mi documento o mi teléfono.» | Inicio de sesión con billetera (SIWE). Sin teléfono, sin correo, sin KYC. La recuperación funciona mediante un compromiso de ADN en cadena.                                                                             |
| «Él o ella miente sobre su salud.»                | Los resultados están **verificados por laboratorio** (QR + coincidencia facial), y las pruebas de la pareja se hacen **en el encuentro** — los resultados recientes de ITS importan, el ADN no envejece.                |
| «¿Alguien se llevará mi dinero y desaparecerá?»   | La concepción funciona con una apuesta real en riesgo: el depósito de un hombre solo se mueve cuando la paternidad está **confirmada**; de lo contrario, simplemente se le devuelve.                                    |
| «¿El token es un pump-and-dump?»                  | El código es abierto (MIT); casi todo el suministro está reservado para recompensas de usuarios, y la reserva no circulante se bloqueará en una **bóveda no vaciable** de la que ni siquiera el fundador puede retirar. |
| «¿La plataforma puede cerrarse o prohibirse?»     | Mensajería de igual a igual primero, almacenamiento descentralizado (IPFS / Arweave), 18 configuraciones de red EVM y ningún dominio fijo.                                                                              |

## Qué y por qué

Las apps de citas tradicionales te piden cambiar tu número de teléfono, correo, fotos y detalles íntimos de salud por una base de datos central — y luego confiar en esa base para siempre. EVOLVE parte de la premisa opuesta: **privacidad por defecto, autocustodia y ausencia de un único punto de fallo**.

- **Privacidad por defecto** — los datos de salud nunca se exponen; solo veredictos anónimos.
- **Resistencia a prohibiciones** — mensajería P2P primero, almacenamiento descentralizado, diseño multired, sin dominios fijos.
- **Identidad autocustodiada** — tu billetera es tu inicio de sesión; recuperación por ADN en lugar de correo o teléfono.
- **Sin barrera KYC** — no se requiere documento, teléfono ni correo para usar la plataforma.

Lee la justificación completa en [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md).

## Salud en la que realmente puedes confiar

- Sube una prueba de ITS como texto plano o PDF (extracción de capa de texto, con respaldo OCR para escaneos).
- El analizador conoce 8 patógenos: VIH-1/2, Sífilis, Clamidia, Gonorrea, VHS-1, VHS-2, Hepatitis B, Hepatitis C — en formatos de informe en inglés, ucraniano y ruso.
- **El estado individual de patógenos nunca se muestra a otros usuarios.** Los perfiles solo muestran el veredicto anónimo: **Safe / Compatible / Caution / Risk**.
- Los registros de ADN en cadena (`DNAVerification.sol`) impulsan la recuperación y la verificación.

### Laboratorios asociados — prueba, no promesa

Entra en un laboratorio asociado y muestra tu código QR. El laboratorio lo escanea, confirma tu identidad con **coincidencia facial** (para que nadie más pueda recoger tu resultado) y adjunta el informe de ITS — PDF, escaneo o texto, incluso con un OCR deficiente. El resultado lo firma un laboratorio real, no tú, así que otros ven un **hecho verificado** en lugar de tu palabra. Y cada verificación confirmada paga **1 EVOLVE al paciente y 1 EVOLVE al laboratorio** — ambos lados tienen una razón para ser honestos. Los patógenos individuales nunca se muestran a nadie.

## Encontrar a alguien

- Filtros de búsqueda: «Qué buscas» (citas / concepción / concepción poliándrica / pruebas de ITS), «A quién buscas» (hombres, mujeres, parejas), selección en cascada país → ciudad, «puede viajar a tu país» con listas por país, color de piel, preferencia de pruebas, solo compatibles con ITS.
- Asistente de incorporación: edad (ocultable), idiomas, bio, foto.
- **Chat P2P** mediante libp2p (gossipsub) + Nostr, con un respaldo de API HTTP.

## Concepción

Dos formas de planificar un hijo, y ambas se basan en la misma idea: la intención real se demuestra con una apuesta real en EVOLVE — nunca con promesas. El compromiso de un hombre vive en su depósito EvolveFund (desde 15 EVOLVE, bloqueado al menos 30 días), y una mujer puede fijar su propio depósito mínimo para los hombres que la alcancen.

**Concepción.** La mujer lidera: invita a un hombre concreto y lo nombra en un vínculo. Él necesita un depósito EvolveFund activo; cuando ambos confirman, se bloquea y comienza la cuenta atrás. El embarazo se comunica entre 14 y 30 días después de la confirmación, y las pruebas de ITS y ADN de la pareja se hacen en el propio encuentro — los resultados recientes de ITS importan, el ADN no envejece. Una vez confirmada la paternidad, el depósito del hombre pasa a la mujer; si no se confirma, el depósito simplemente se le devuelve. Nada cambia de manos hasta que los hechos estén resueltos.

**Concepción poliándrica.** La elección le pertenece a ella y permanece privada. Abre una sesión de 48 horas — sin depósito propio (puede añadir uno solo por reputación, si lo desea). Los hombres con depósito activo pueden unirse — hasta 50 — y confirmar, lo que bloquea su apuesta. Catorce días después de cerrarse la sesión, se elige al padre. Él recupera su depósito más una recompensa del fondo: el doble de su depósito y 1 EVOLVE por cada otro participante. Los hombres no elegidos pierden su apuesta — 90 % para la mujer, 10 % para el padre elegido. Ella no arriesga nada y solo puede ganar; los hombres ponen su apuesta detrás del derecho a ser elegidos.

## Privacidad y transacciones confidenciales

La privacidad es la regla por defecto — y EVOLVE construye una hoja de ruta hacia transferencias en cadena totalmente confidenciales.

- **Regalos privados** — envía una rosa 🌹 o un cactus 🌵 (1 EVOLVE) y elige quién puede ver que fuiste tú: _público_, _anónimo para todos salvo el destinatario_ o _totalmente anónimo_. En los modos anónimos, el regalo viaja como un vale de un solo uso que el destinatario reclama con su propia billetera, de modo que el remitente nunca aparece en cadena. (La anonimidad del remitente hoy es de nivel casual: la transacción de financiación puede correlacionarse por tiempo y monto.)
- **Billetera protegida Railgun** — una billetera privada tras un feature flag (`VITE_RAILGUN_ENABLED`, desactivada por defecto) que oculta montos y direcciones mediante el pool de conocimiento cero de Railgun. Es el camino hacia la verdadera anonimidad del remitente.
- **Prototipo Aztec** — la misma lógica de transferencia privada y vínculo privado, expresada como circuitos Noir de conocimiento cero y mantenida tras una barrera explícita hasta que Aztec esté listo para producción. Consulta [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).
- **Modelo de dos billeteras** — una billetera pública de apuesta participa en la gobernanza; una billetera privada protegida está deliberadamente **excluida** del peso de voto, manteniendo separadas privacidad y poder de voto.

Detalles: [docs/RAILGUN-INTEGRATION.md](docs/RAILGUN-INTEGRATION.md) · [docs/SHIELDED-STAKES-DESIGN.md](docs/SHIELDED-STAKES-DESIGN.md) · [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md).

## El token EVOLVE (solo testnet)

- ERC-20, suministro máximo **8 000 000 000 EVOLVE**. Las acciones de administración están protegidas por un `TimelockController` de 48 horas.
- **Asignación prevista** — diseñada para poner casi todo el suministro a trabajar para los usuarios, no para los internos:

| Propósito                                                        |        EVOLVE |
| ---------------------------------------------------------------- | ------------: |
| Fundadores y equipo (salario / recompensa)                       |    25 000 000 |
| Reserva DEX (futura)                                             |     4 000 000 |
| Venta pública (prevista)                                         |     5 000 000 |
| Reserva de recompensas — laboratorios, pacientes, madres, padres | 7 966 000 000 |

- **Venta pública prevista** — 5 000 000 EVOLVE vendidos por la aplicación a **0,8 $ cada uno**, pagaderos en cualquier token que la aplicación admita; los ingresos financian el desarrollo. _(Previsto — aún no en vivo.)_
- **Emisión sin confianza (prevista)** — la reserva de recompensas de ~7 966 000 000 se bloqueará en un `RewardVault` no vaciable: liberada solo gradualmente mediante recompensas de laboratorio, paciente, madre y padre, con cambios de reglas que requieren voto de gobernanza. Ni siquiera el fundador puede retirarla. Diseño: [docs/REWARD-VAULT-PLAN.md](docs/REWARD-VAULT-PLAN.md).
- **Economía de regalos emoji** — un regalo cuesta 1 EVOLVE, repartido proporcionalmente entre los dueños de regalos existentes; un modelo de ingresos perpetuo, y los regalos son transferibles.
- **EvolveFund** — staking masculino (mín 15 EVOLVE, bloqueo de 30 días) que cuenta para el peso de gobernanza; las mujeres usan el saldo de su billetera.
- **Recompensas de verificación** — 1 EVOLVE al usuario verificado y 1 EVOLVE al laboratorio confirmador por verificación de ITS/ADN (más un faucet limitado por tasa).
- **Gobernanza** — el peso de voto combina reputación recursiva (8 votos, profundidad 3), la proporción de hijos/paternidad y EVOLVE en staking o en tenencia.
- Integración **LayerZero OFT** para futuras transferencias EVOLVE multicadena (dependencias en su lugar; nada desplegado más allá de Sepolia aún).

## Apoya el proyecto

EVOLVE es independiente y de código abierto. Si te resulta útil, puedes apoyar el desarrollo con una donación — cada contribución se destina a código, alianzas con laboratorios, alojamiento y traducción.

- **Detalles de donación (EVM, Monero y más):** [DONATE.md](DONATE.md)
- **Página de donaciones multilingüe (34 idiomas):** **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**

Una venta pública de tokens está **prevista** — 5 000 000 EVOLVE, vendidos por la aplicación (consulta [El token EVOLVE](#el-token-evolve-solo-testnet)). Las donaciones son regalos que apoyan el desarrollo de código abierto y no dan derecho a tokens, capital, rendimientos ni beneficios. Por favor, da solo lo que puedas permitirte perder.

## Arquitectura y stack tecnológico

Monorepo gestionado con npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (app web principal, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Feature flags y configuración remota dinámica
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Tipos compartidos, utilidades, middleware, web3
  matching/     # Algoritmos de emparejamiento, filtros, clasificación
  p2p/          # Red libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Arquitectura, tokenómica, hoja de ruta, FAQ
```

Contratos inteligentes clave: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (regalos emoji + recompensas), `Governance.sol`, `BondManager.sol` (concepción y concepción poliándrica), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, ERC-4337 `SmartAccountFactory` + `Paymaster`, y un `TimelockController` de OpenZeppelin.

Detalles: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md)

## Hoja de ruta

En curso: preparación de la aplicación web para producción. Previsto: registro de laboratorios en cadena y certificación de pruebas, un adaptador de proveedor de correo real para la ingesta de informes de laboratorio, atestaciones verificadas en cadena en perfiles, el **`RewardVault` sin confianza** con emisión gobernada ([diseño](docs/REWARD-VAULT-PLAN.md)), la **venta pública de tokens**, la actualización del vesting de tokens para la asignación de fundadores, y el aprovisionamiento de liquidez DEX (actualmente bloqueado — requiere despliegues de tokens en mainnet). En el frente de privacidad, los regalos privados están terminados, mientras que la billetera protegida Railgun y la migración de vínculos privados Aztec quedan tras las comprobaciones en [docs/ROADMAP.md](docs/ROADMAP.md) y [docs/AZTEC-PROTOTYPE.md](docs/AZTEC-PROTOTYPE.md). La expansión multired (Arbitrum, Avalanche y otras cadenas EVM) seguirá tras el endurecimiento del testnet.

Lista completa: [docs/ROADMAP.md](docs/ROADMAP.md).

## Primeros pasos (desarrolladores)

Requisitos: **Node.js 20+** y npm 10.x.

```bash
# Clonar e instalar todos los workspaces
git clone https://github.com/Lilit-Moonlit/Evolve.git
cd Evolve
npm install

# Aplicación web (servidor de desarrollo Vite en http://localhost:3000)
cd apps/web
npm run dev
npm test                # suite vitest

# Contratos inteligentes
cd packages/contracts
npm run compile         # hardhat compile
npm test                # suite de pruebas hardhat
npm run deploy:local    # desplegar todos los contratos en una red Hardhat en proceso
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

- [Qué y por qué](docs/WHAT-AND-WHY.md) — problema, visión, valores fundamentales
- [Cómo funciona](docs/HOW-IT-WORKS.md) — flujos de usuario, paso a paso
- [Arquitectura](docs/ARCHITECTURE.md) — monorepo, paquetes, flujos de datos
- [Tokenómica](docs/TOKENOMICS.md) — modelo del token y distribución del suministro
- [Plan RewardVault](docs/REWARD-VAULT-PLAN.md) — emisión sin confianza (prevista)
- [Integración Railgun](docs/RAILGUN-INTEGRATION.md) — spike de integración de billetera protegida
- [Apuestas protegidas](docs/SHIELDED-STAKES-DESIGN.md) — apuestas de concepción privadas (diseño)
- [Prototipo Aztec](docs/AZTEC-PROTOTYPE.md) — transferencias privadas ZK y vínculos (investigación)
- [Hoja de ruta](docs/ROADMAP.md) — hitos y estado actual
- [FAQ](docs/FAQ.md) — preguntas frecuentes
- [Guía de billeteras](docs/WALLETS.md) — cómo crear billeteras y obtener direcciones de donación

## Licencia

Bajo la [MIT License](LICENSE).
