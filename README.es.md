[English](README.md) | [العربية](README.ar.md) | [Български](README.bg.md) | [Čeština](README.cs.md) | [Dansk](README.da.md) | [Deutsch](README.de.md) | [Ελληνικά](README.el.md) | [Español](README.es.md) | [Eesti](README.et.md) | [Suomi](README.fi.md) | [Filipino](README.fil.md) | [Français](README.fr.md) | [עברית](README.he.md) | [Hrvatski](README.hr.md) | [Magyar](README.hu.md) | [Íslenska](README.is.md) | [Italiano](README.it.md) | [日本語](README.ja.md) | [Lietuvių](README.lt.md) | [Latviešu](README.lv.md) | [Norsk bokmål](README.nb.md) | [नेपाली](README.ne.md) | [Nederlands](README.nl.md) | [Polski](README.pl.md) | [Português](README.pt.md) | [Română](README.ro.md) | [Русский](README.ru.md) | [Slovenčina](README.sk.md) | [Slovenščina](README.sl.md) | [Svenska](README.sv.md) | [Kiswahili](README.sw.md) | [Українська](README.uk.md) | [Tiếng Việt](README.vi.md) | [繁體中文](README.zh-TW.md)

# EVOLVE

**Citas, concepción y verificación de salud — privado por defecto, verificado donde importa.**

EVOLVE es una plataforma open-source y descentralizada para conexiones íntimas verificables: citas, concepción y compatibilidad anónima de ETS/ADN. Inicias sesión con tu propia cartera cripto (Sign-In with Ethereum) — sin número de teléfono, sin correo electrónico, sin KYC — y puedes recuperar tu cuenta mediante un compromiso de ADN on-chain. Los datos de salud siguen siendo tuyos: los resultados de laboratorio se analizan automáticamente, los estados individuales de los patógenos **nunca** se muestran a nadie, y el emparejamiento se basa únicamente en veredictos anónimos de compatibilidad (Safe / Compatible / Caution / Risk). El chat funciona de igual a igual a través de libp2p y Nostr, con un respaldo HTTP por comodidad, y la aplicación incluye una fachada pública ligera «Safety Mode» además de un Companion Mode independiente para evaluar resultados de pruebas de ETS.

> **Estado: alfa en fase temprana.** EVOLVE está en desarrollo activo y no es un producto terminado.
> Los contratos inteligentes están desplegados **solo en la red de pruebas Ethereum Sepolia**.
> **No hay despliegue en mainnet, no hay DEX, no hay liquidez ni venta pública de tokens** — y nada de eso se promete.
> Las funciones pueden cambiar o romperse en cualquier momento. Nada de esto constituye asesoramiento financiero ni una oferta de inversión.

## Qué y por qué

Las plataformas de citas tradicionales te piden entregar tu número de teléfono, correo electrónico, fotos y detalles íntimos de salud a una base de datos central. EVOLVE parte de la premisa opuesta: privacidad por defecto, autocustodia y sin un punto único de fallo. Valores fundamentales:

- **Privacidad por defecto** — los datos de salud nunca se exponen; solo veredictos anónimos.
- **Resistencia a bloqueos** — mensajería P2P como prioridad, almacenamiento descentralizado (IPFS / Arweave), diseño multired, sin dominios fijados en el código.
- **Identidad autocustodiada** — tu cartera es tu inicio de sesión; recuperación basada en ADN en lugar de correo/teléfono.
- **Sin barrera de KYC** — no se exige documento de identidad, teléfono ni correo electrónico para usar la plataforma.

Lee la justificación completa en [docs/WHAT-AND-WHY.md](docs/WHAT-AND-WHY.md) (en inglés).

## Funciones principales

### Identidad y privacidad

- **Inicio de sesión con cartera SIWE** (MetaMask y otras carteras EVM) — la vía de escape resistente a la censura.
- **Recuperación de cuenta mediante ADN** — el resultado de tu prueba de ADN se procesa con hash (SHA-256, comprometido on-chain como `bytes32`) y puede restaurar el acceso sin teléfono ni correo.
- **Abstracción de cuenta (ERC-4337)** — cuentas inteligentes y un paymaster para un onboarding sin gas; SIWE siempre sigue disponible.

### Compatibilidad de salud anónima

- Sube resultados de pruebas de ETS como texto sin formato o PDF (extracción de la capa de texto con respaldo OCR para páginas escaneadas).
- El analizador reconoce 8 patógenos: VIH-1/2, sífilis, clamidia, gonorrea, VHS-1, VHS-2, hepatitis B, hepatitis C (formatos de informe en inglés, ucraniano y ruso).
- **El estado individual de los patógenos nunca se muestra a otros usuarios.** Los perfiles solo muestran un veredicto anónimo: **Safe / Compatible / Caution / Risk**.
- Los registros on-chain de verificación de ADN (`DNAVerification.sol`) impulsan los flujos de recuperación y verificación.

### Perfiles, búsqueda y comunicación

- Filtros de búsqueda: «Qué buscas» (citas / concepción / concepción poliándrica / pruebas de ETS), «A quién buscas» (hombres, mujeres, parejas), selecciones en cascada país → ciudad, «puede viajar a tu país» con listas por país, color de piel, preferencia de pruebas, solo compatibles en ETS.
- Asistente de incorporación (onboarding): edad (ocultable), idiomas, biografía, foto.
- **Privacidad de las fotos**: las fotos están difuminadas por defecto; el propietario concede vistas de 15 segundos o permanentes, a petición o de forma proactiva. Verlas es gratis.
- **Chat P2P** a través de libp2p (gossipsub) + Nostr, con respaldo de API HTTP.

### Modos de concepción

- **Modo 2 — Pregnancy Bond**: una mujer crea un vínculo, un hombre pone EVOLVE en staking (≥ 100 en la compilación actual de testnet), ambos confirman; tras un embarazo y una paternidad confirmados, el stake se transfiere a la mujer.
- **Modo 3 — Cryptic Choice**: una mujer abre una sesión de 48 horas, los hombres se unen haciendo staking; ella elige al padre — su stake se le devuelve, el resto se reparte: 90 % para ella / 10 % para el padre elegido.

### Laboratorios y verificación

- **Flujo de laboratorios asociados**: los laboratorios se registran como socios, verifican a los pacientes mediante código QR y coincidencia facial, y adjuntan informes de ETS (PDF/texto con extracción OCR).
- **Companion Mode**: flujo independiente para evaluar resultados de pruebas de ETS sin unirse a la plataforma de citas.
- **Safety Mode** (`VITE_PRODUCT_MODE=safety`): una fachada pública limitada (estado de ETS, enlaces públicos de perfil, comprobaciones de compatibilidad) que sigue funcionando incluso si las funciones de citas/concepción se restringen en alguna jurisdicción o tienda de aplicaciones.

### Token EVOLVE (solo testnet)

- ERC-20, emisión máxima de 8.000.000.000 EVOLVE, acciones de administración protegidas por un TimelockController de 48 horas.
- **Economía de regalos emoji**: un regalo cuesta 1 EVOLVE, que se reparte proporcionalmente entre los propietarios de regalos existentes — un modelo de ingresos perpetuo para los titulares; los regalos son transferibles.
- **EvolveFund**: staking masculino (mín. 15 EVOLVE, bloqueo de 30 días) que cuenta para el peso de gobernanza; las mujeres usan el saldo de su cartera.
- **Recompensas por verificación**: 1 EVOLVE para el usuario verificado y 1 EVOLVE para el laboratorio que confirma, en cada verificación de ETS/ADN (más un faucet de pruebas con límite de frecuencia).
- El peso de voto en gobernanza combina la reputación recursiva (8 votos, profundidad 3), la proporción de hijos/paternidad y los EVOLVE en staking o en cartera.
- Integración de **LayerZero OFT** para futuras transferencias multicanal de EVOLVE (dependencias listas; nada desplegado más allá de Sepolia por ahora).

### Plataforma

- Aplicación web (instalable como PWA) y aplicación móvil Expo/React Native.
- Interfaz traducida a **34 idiomas**.
- Preparada para multired: 18 configuraciones de redes EVM (Arbitrum y Avalanche son las L2 principales previstas — **aún no desplegadas**).

## Arquitectura y pila tecnológica

Monorrepo gestionado con npm workspaces + Turborepo:

```
apps/
  web/          # Vite + React + TypeScript (aplicación web principal, i18next, Prisma)
  mobile/       # Expo + React Native
packages/
  config/       # Indicadores de funciones y configuración remota dinámica
  contracts/    # Solidity 0.8.24, Hardhat, Ignition, OpenZeppelin, LayerZero
  core/         # Tipos compartidos, utilidades, middleware, web3
  matching/     # Algoritmos de emparejamiento, filtros, ranking
  p2p/          # Redes libp2p (gossipsub) + Nostr
  storage/      # IPFS, Arweave, Lit Protocol
docs/           # Arquitectura, tokenómica, hoja de ruta, FAQ
```

Contratos inteligentes clave: `EVOLVE.sol` (ERC-20), `ProfileNFT.sol` (ERC-721), `TrustScore.sol`, `Voting.sol`, `Evolve2Earn.sol` (regalos emoji + recompensas), `Governance.sol`, `BondManager.sol` (modos 2 y 3), `EvolveFund.sol`, `VerificationRegistry.sol`, `DNAVerification.sol`, `SmartAccountFactory` + `Paymaster` ERC-4337 y un `TimelockController` de OpenZeppelin.

Detalles: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md) · [docs/TOKENOMICS.md](docs/TOKENOMICS.md) (en inglés).

## Hoja de ruta

En curso: preparación para producción de la aplicación web. Previsto: registro de laboratorios on-chain y certificación de pruebas, adaptador real de proveedor de correo para la recepción de informes de laboratorio, atestaciones verificadas on-chain en los perfiles, actualización del vesting de tokens para las asignaciones de fundadores/desarrolladores, aprovisionamiento de liquidez en DEX (actualmente bloqueado — requiere despliegues del token en mainnet). La expansión multired (Arbitrum, Avalanche y otras cadenas EVM) llegará después de consolidar la red de pruebas.

Lista completa: [docs/ROADMAP.md](docs/ROADMAP.md) (en inglés).

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
npm test                # suite de vitest

# Contratos inteligentes
cd packages/contracts
npm run compile         # hardhat compile
npm test                # suite de pruebas de hardhat
npm run deploy:local    # desplegar todos los contratos en una red Hardhat en proceso
```

## Contribuir

Las contribuciones son bienvenidas — código, informes de errores, sugerencias de funciones y propuestas. Lee [CONTRIBUTING.md](CONTRIBUTING.md) y nuestro [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) antes de empezar.

## Apoyar el proyecto

Si EVOLVE te resulta útil, puedes apoyar el desarrollo con una donación — detalles en [DONATE.md](DONATE.md). ¿Prefieres una página web? Usa la página de donaciones multilingüe (34 idiomas): **https://lilit-moonlit.github.io/Evolve/** · **https://limitafternoon.codeberg.page/Evolve/**.

**No hay venta de tokens ni la habrá.** No se puede «invertir» en tokens EVOLVE; las donaciones son regalos para apoyar el desarrollo open-source y no otorgan al donante derecho a tokens, participación, rendimientos ni ninguna reclamación financiera.

## Repositorios (espejos)

| Espejo   | URL                                        |
| -------- | ------------------------------------------ |
| GitHub   | https://github.com/Lilit-Moonlit/Evolve    |
| Codeberg | https://codeberg.org/limitafternoon/Evolve |
| GitLab   | https://gitlab.com/evolve-group3/evolve    |

## Documentación

- [Qué y por qué](docs/WHAT-AND-WHY.md) — problema, visión, valores fundamentales (inglés)
- [Cómo funciona](docs/HOW-IT-WORKS.md) — flujos de usuario, paso a paso (inglés)
- [Arquitectura](docs/ARCHITECTURE.md) — monorrepo, paquetes, flujos de datos (inglés)
- [Tokenómica](docs/TOKENOMICS.md) — modelo del token y distribución de la emisión (inglés)
- [Hoja de ruta](docs/ROADMAP.md) — hitos y estado actual (inglés)
- [FAQ](docs/FAQ.md) — preguntas frecuentes (inglés)
- [Guía de carteras](docs/WALLETS.md) — cómo crear carteras y obtener direcciones de donación (inglés)

## Licencia

Publicado bajo la [Licencia MIT](LICENSE).
