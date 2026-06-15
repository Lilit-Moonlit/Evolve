/**
 * Generates/updates i18n locale files.
 * Tier 1-2 (14 langs): en + de, fr, es, it, pt, nl, pl, uk, sv, nb, da, fi, ja
 * Tier 3-4 (19 langs): basic translations
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '../src/i18n/locales');
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf-8'));

const auth = {
  de: { loading: 'Sichere Sitzung wird geladen...', connectWallet: { title: 'Wallet verbinden', description: 'Willkommen bei Evolve! Verbinden Sie Ihre Ethereum-Wallet über RainbowKit, um auf Ihr verschlüsseltes medizinisches Profil zuzugreifen.' }, signIn: { title: 'Mit Ethereum anmelden', description: 'Bitte signieren Sie die sichere kryptografische Nachricht, um den Besitz Ihrer Wallet zu bestätigen und Ihre privaten Daten zu laden.', button: 'Mit Ethereum anmelden' }, logout: 'Abmelden' },
  fr: { loading: 'Chargement de la session sécurisée...', connectWallet: { title: 'Connecter votre portefeuille', description: 'Bienvenue sur Evolve ! Connectez votre portefeuille Ethereum via RainbowKit pour accéder à votre profil médical chiffré.' }, signIn: { title: 'Se connecter avec Ethereum', description: 'Veuillez signer le message cryptographique sécurisé pour vérifier la propriété de votre portefeuille et charger vos données privées.', button: 'Se connecter avec Ethereum' }, logout: 'Déconnexion' },
  es: { loading: 'Cargando sesión segura...', connectWallet: { title: 'Conectar tu billetera', description: '¡Bienvenido a Evolve! Conecta tu billetera Ethereum con RainbowKit para acceder a tu perfil médico cifrado.' }, signIn: { title: 'Iniciar sesión con Ethereum', description: 'Firma el mensaje criptográfico seguro para verificar la propiedad de tu billetera y cargar tus datos privados.', button: 'Iniciar sesión con Ethereum' }, logout: 'Cerrar sesión' },
  it: { loading: 'Caricamento sessione sicura...', connectWallet: { title: 'Connetti il tuo wallet', description: 'Benvenuto su Evolve! Connetti il tuo wallet Ethereum con RainbowKit per accedere al tuo profilo medico crittografato.' }, signIn: { title: 'Accedi con Ethereum', description: 'Firma il messaggio crittografico sicuro per verificare la proprietà del tuo wallet e caricare i tuoi dati privati.', button: 'Accedi con Ethereum' }, logout: 'Esci' },
  pt: { loading: 'Carregando sessão segura...', connectWallet: { title: 'Conectar carteira', description: 'Bem-vindo ao Evolve! Conecte sua carteira Ethereum via RainbowKit para acessar seu perfil médico criptografado.' }, signIn: { title: 'Entrar com Ethereum', description: 'Assine a mensagem criptográfica segura para verificar a propriedade da sua carteira e carregar seus dados privados.', button: 'Entrar com Ethereum' }, logout: 'Sair' },
  nl: { loading: 'Beveiligde sessie laden...', connectWallet: { title: 'Wallet verbinden', description: 'Welkom bij Evolve! Verbind je Ethereum-wallet via RainbowKit om toegang te krijgen tot je versleutelde medische profiel.' }, signIn: { title: 'Inloggen met Ethereum', description: 'Onderteken het beveiligde cryptografische bericht om het eigendom van je wallet te verifiëren en je privégegevens te laden.', button: 'Inloggen met Ethereum' }, logout: 'Uitloggen' },
  pl: { loading: 'Ładowanie bezpiecznej sesji...', connectWallet: { title: 'Połącz portfel', description: 'Witaj w Evolve! Połącz swój portfel Ethereum przez RainbowKit, aby uzyskać dostęp do zaszyfrowanego profilu medycznego.' }, signIn: { title: 'Zaloguj się przez Ethereum', description: 'Podpisz bezpieczną wiadomość kryptograficzną, aby potwierdzić własność portfela i załadować prywatne dane.', button: 'Zaloguj się przez Ethereum' }, logout: 'Wyloguj' },
  uk: { loading: 'Завантаження безпечної сесії...', connectWallet: { title: 'Підключіть гаманець', description: 'Ласкаво просимо до Evolve! Підключіть Ethereum-гаманець через RainbowKit для доступу до зашифрованого медичного профілю.' }, signIn: { title: 'Увійти через Ethereum', description: 'Підпишіть захищене криптографічне повідомлення, щоб підтвердити власність гаманця та завантажити приватні дані.', button: 'Увійти через Ethereum' }, logout: 'Вийти' },
  sv: { loading: 'Laddar säker session...', connectWallet: { title: 'Anslut din plånbok', description: 'Välkommen till Evolve! Anslut din Ethereum-plånbok via RainbowKit för att komma åt din krypterade medicinska profil.' }, signIn: { title: 'Logga in med Ethereum', description: 'Signera det säkra kryptografiska meddelandet för att verifiera ägandet av din plånbok och ladda dina privata data.', button: 'Logga in med Ethereum' }, logout: 'Logga ut' },
  nb: { loading: 'Laster sikker økt...', connectWallet: { title: 'Koble til lommeboken', description: 'Velkommen til Evolve! Koble til Ethereum-lommeboken din via RainbowKit for å få tilgang til din krypterte medisinske profil.' }, signIn: { title: 'Logg inn med Ethereum', description: 'Signer den sikre kryptografiske meldingen for å bekrefte eierskapet av lommeboken og laste private data.', button: 'Logg inn med Ethereum' }, logout: 'Logg ut' },
  da: { loading: 'Indlæser sikker session...', connectWallet: { title: 'Forbind din tegnebog', description: 'Velkommen til Evolve! Forbind din Ethereum-tegnebog via RainbowKit for at få adgang til din krypterede medicinske profil.' }, signIn: { title: 'Log ind med Ethereum', description: 'Underskriv den sikre kryptografiske besked for at bekræfte ejerskab af din tegnebog og indlæse dine private data.', button: 'Log ind med Ethereum' }, logout: 'Log ud' },
  fi: { loading: 'Ladataan suojattua istuntoa...', connectWallet: { title: 'Yhdistä lompakko', description: 'Tervetuloa Evolveen! Yhdistä Ethereum-lompakkosi RainbowKitin kautta päästäksesi salattuun lääketieteelliseen profiiliisi.' }, signIn: { title: 'Kirjaudu Ethereumilla', description: 'Allekirjoita suojattu salaustekninen viesti vahvistaaksesi lompakon omistajuuden ja ladataksesi yksityiset tietosi.', button: 'Kirjaudu Ethereumilla' }, logout: 'Kirjaudu ulos' },
  ja: { loading: 'セキュアセッションを読み込み中...', connectWallet: { title: 'ウォレットを接続', description: 'Evolveへようこそ！RainbowKitでEthereumウォレットを接続し、暗号化された医療プロフィールにアクセスしてください。' }, signIn: { title: 'Ethereumでサインイン', description: 'ウォレットの所有権を確認し、プライベートデータを読み込むために、安全な暗号メッセージに署名してください。', button: 'Ethereumでサインイン' }, logout: 'ログアウト' },
};

const tier12ExistingFix = {
  de: { language: { select: 'Sprache auswählen', title: 'Wählen Sie Ihre Sprache', description: 'Wählen Sie Ihre bevorzugte Sprache, um fortzufahren' }, country: { select: 'Land auswählen', title: 'Wählen Sie Ihr Land', description: 'Wählen Sie Ihr Land, um mit Personen in Ihrer Nähe zu matchen' } },
  fr: { language: { select: 'Choisir la langue', title: 'Choisissez votre langue', description: 'Sélectionnez votre langue préférée pour continuer' }, country: { select: 'Choisir le pays', title: 'Choisissez votre pays', description: 'Sélectionnez votre pays pour matcher avec des personnes à proximité' } },
  es: { language: { select: 'Seleccionar idioma', title: 'Elige tu idioma', description: 'Selecciona tu idioma preferido para continuar' }, country: { select: 'Seleccionar país', title: 'Elige tu país', description: 'Selecciona tu país para conectar con personas cercanas' } },
  it: { language: { select: 'Seleziona lingua', title: 'Scegli la tua lingua', description: 'Seleziona la lingua preferita per continuare' }, country: { select: 'Seleziona paese', title: 'Scegli il tuo paese', description: 'Seleziona il tuo paese per matchare con persone vicine' } },
  pt: { language: { select: 'Selecionar idioma', title: 'Escolha seu idioma', description: 'Selecione seu idioma preferido para continuar' }, country: { select: 'Selecionar país', title: 'Escolha seu país', description: 'Selecione seu país para encontrar pessoas próximas' } },
  nl: { language: { select: 'Taal selecteren', title: 'Kies je taal', description: 'Selecteer je voorkeurstaal om door te gaan' }, country: { select: 'Land selecteren', title: 'Kies je land', description: 'Selecteer je land om te matchen met mensen in de buurt' } },
  pl: { language: { select: 'Wybierz język', title: 'Wybierz swój język', description: 'Wybierz preferowany język, aby kontynuować' }, country: { select: 'Wybierz kraj', title: 'Wybierz swój kraj', description: 'Wybierz kraj, aby dopasować osoby w pobliżu' } },
  uk: { language: { select: 'Обрати мову', title: 'Оберіть мову', description: 'Оберіть бажану мову, щоб продовжити' }, country: { select: 'Обрати країну', title: 'Оберіть країну', description: 'Оберіть країну, щоб знайти людей поруч' } },
};

const tier12Full = {
  sv: { app: { tagline: 'Decentraliserad dejting byggd på Web3 & P2P' }, navigation: { swipe: 'Svep', messages: 'Meddelanden', profile: 'Profil' }, home: { hero: { title: 'Hitta din match', subtitle: 'Svep igenom profiler och träffa intressanta personer.' }, filters: { verifiedStd: 'Endast med verifierat STD', verifiedDna: 'Endast med verifierat DNA', noProfiles: 'Inga profiler matchar de valda filtren.' }, profile: { newMatch: 'Ny match', noMoreProfiles: 'Inga fler profiler just nu! Kom tillbaka senare.' } }, profile: { tabs: { profile: 'Profil', reputation: 'Rykte' }, myProfile: { title: 'Min profil', verifiedUser: 'Verifierad användare' }, status: { stdStatus: 'STD-status', dnaStatus: 'DNA-status', uploaded: '✓ Uppladdad', notUploaded: '✗ Ej uppladdad' }, upload: { title: 'Ladda upp hälsotester', stdTest: 'STD-test', dnaTest: 'DNA-test', redactFields: 'Redigera känsliga fält före uppladdning:', fullName: 'Fullständigt namn', address: 'Adress', phoneNumber: 'Telefonnummer', patientId: 'Patient-ID', encryptUpload: 'Kryptera & ladda upp PDF', uploadSuccess: 'Dokument uppladdat och krypterat!' }, documents: { title: 'Mina dokument', noDocuments: 'Inga dokument uppladdade ännu.' }, reputation: { title: 'Ryktet', score: 'Poäng', description: 'Ditt rykte baseras på förtroendevikterna hos personer som har intygat för dig.', votersTitle: 'Röstande & förtroendenätverk', weight: 'Vikt:' } }, chat: { title: 'Chatt', subtitle: 'Anslut med dina matchningar', requestAccess: 'Begärde åtkomst till ditt {{testType}}-test.', approvedRequest: 'Jag har godkänt din begäran! Du kan nu se min dekrypterade {{testType}}-testrapport.', approvedResponse: 'Jag godkände din begäran att se mitt {{testType}}-test.', declinedResponse: 'Jag avböjde din begäran att se mitt {{testType}}-test.' }, language: { select: 'Välj språk', title: 'Välj ditt språk', description: 'Välj ditt föredragna språk för att fortsätta' }, country: { select: 'Välj land', title: 'Välj ditt land', description: 'Välj ditt land för att matcha med personer i närheten' } },
  nb: { app: { tagline: 'Desentralisert dating bygget på Web3 & P2P' }, navigation: { swipe: 'Sveip', messages: 'Meldinger', profile: 'Profil' }, home: { hero: { title: 'Finn din match', subtitle: 'Sveip gjennom profiler og møt interessante mennesker.' }, filters: { verifiedStd: 'Kun med verifisert STD', verifiedDna: 'Kun med verifisert DNA', noProfiles: 'Ingen profiler matcher de valgte filtrene.' }, profile: { newMatch: 'Ny match', noMoreProfiles: 'Ingen flere profiler akkurat nå! Sjekk tilbake senere.' } }, profile: { tabs: { profile: 'Profil', reputation: 'Omdømme' }, myProfile: { title: 'Min profil', verifiedUser: 'Verifisert bruker' }, status: { stdStatus: 'STD-status', dnaStatus: 'DNA-status', uploaded: '✓ Lastet opp', notUploaded: '✗ Ikke lastet opp' }, upload: { title: 'Last opp helsetester', stdTest: 'STD-test', dnaTest: 'DNA-test', redactFields: 'Rediger sensitive felt før opplasting:', fullName: 'Fullt navn', address: 'Adresse', phoneNumber: 'Telefonnummer', patientId: 'Pasient-ID', encryptUpload: 'Krypter & last opp PDF', uploadSuccess: 'Dokument lastet opp og kryptert!' }, documents: { title: 'Mine dokumenter', noDocuments: 'Ingen dokumenter lastet opp ennå.' }, reputation: { title: 'Omdømme', score: 'Poeng', description: 'Ditt omdømme er basert på tillitsvektene til personer som har garantert for deg.', votersTitle: 'Stemmer & tillitsnettverk', weight: 'Vekt:' } }, chat: { title: 'Chat', subtitle: 'Koble til med matchene dine', requestAccess: 'Ba om tilgang til {{testType}}-testen din.', approvedRequest: 'Jeg har godkjent forespørselen din! Du kan nå se min dekrypterte {{testType}}-testrapport.', approvedResponse: 'Jeg godkjente forespørselen din om å se {{testType}}-testen min.', declinedResponse: 'Jeg avslo forespørselen din om å se {{testType}}-testen min.' }, language: { select: 'Velg språk', title: 'Velg ditt språk', description: 'Velg foretrukket språk for å fortsette' }, country: { select: 'Velg land', title: 'Velg ditt land', description: 'Velg landet ditt for å matche med folk i nærheten' } },
  da: { app: { tagline: 'Decentraliseret dating bygget på Web3 & P2P' }, navigation: { swipe: 'Swipe', messages: 'Beskeder', profile: 'Profil' }, home: { hero: { title: 'Find dit match', subtitle: 'Swipe gennem profiler og mød interessante mennesker.' }, filters: { verifiedStd: 'Kun med verificeret STD', verifiedDna: 'Kun med verificeret DNA', noProfiles: 'Ingen profiler matcher de valgte filtre.' }, profile: { newMatch: 'Nyt match', noMoreProfiles: 'Ingen flere profiler lige nu! Tjek tilbage senere.' } }, profile: { tabs: { profile: 'Profil', reputation: 'Omdømme' }, myProfile: { title: 'Min profil', verifiedUser: 'Verificeret bruger' }, status: { stdStatus: 'STD-status', dnaStatus: 'DNA-status', uploaded: '✓ Uploadet', notUploaded: '✗ Ikke uploadet' }, upload: { title: 'Upload sundhedstests', stdTest: 'STD-test', dnaTest: 'DNA-test', redactFields: 'Rediger følsomme felter før upload:', fullName: 'Fulde navn', address: 'Adresse', phoneNumber: 'Telefonnummer', patientId: 'Patient-ID', encryptUpload: 'Krypter & upload PDF', uploadSuccess: 'Dokument uploadet og krypteret!' }, documents: { title: 'Mine dokumenter', noDocuments: 'Ingen dokumenter uploadet endnu.' }, reputation: { title: 'Omdømme', score: 'Score', description: 'Dit omdømme er baseret på tillidsvægtene fra personer, der har garanteret for dig.', votersTitle: 'Vælgere & tillidsnetværk', weight: 'Vægt:' } }, chat: { title: 'Chat', subtitle: 'Forbind med dine matches', requestAccess: 'Anmodede om adgang til din {{testType}}-test.', approvedRequest: 'Jeg har godkendt din anmodning! Du kan nu se min dekrypterede {{testType}}-testrapport.', approvedResponse: 'Jeg godkendte din anmodning om at se min {{testType}}-test.', declinedResponse: 'Jeg afviste din anmodning om at se min {{testType}}-test.' }, language: { select: 'Vælg sprog', title: 'Vælg dit sprog', description: 'Vælg dit foretrukne sprog for at fortsætte' }, country: { select: 'Vælg land', title: 'Vælg dit land', description: 'Vælg dit land for at matche med folk i nærheden' } },
  fi: { app: { tagline: 'Hajautettu deittailu Web3:lla ja P2P:llä' }, navigation: { swipe: 'Pyyhkäise', messages: 'Viestit', profile: 'Profiili' }, home: { hero: { title: 'Löydä matchisi', subtitle: 'Pyyhkäise profiileja ja tapaa mielenkiintoisia ihmisiä.' }, filters: { verifiedStd: 'Vain vahvistetulla STD:llä', verifiedDna: 'Vain vahvistetulla DNA:lla', noProfiles: 'Yksikään profiili ei vastaa valittuja suodattimia.' }, profile: { newMatch: 'Uusi match', noMoreProfiles: 'Ei enempää profiileja nyt! Tarkista myöhemmin.' } }, profile: { tabs: { profile: 'Profiili', reputation: 'Maine' }, myProfile: { title: 'Oma profiili', verifiedUser: 'Vahvistettu käyttäjä' }, status: { stdStatus: 'STD-tila', dnaStatus: 'DNA-tila', uploaded: '✓ Ladattu', notUploaded: '✗ Ei ladattu' }, upload: { title: 'Lataa terveystestit', stdTest: 'STD-testi', dnaTest: 'DNA-testi', redactFields: 'Muokkaa arkaluontoiset kentät ennen latausta:', fullName: 'Koko nimi', address: 'Osoite', phoneNumber: 'Puhelinnumero', patientId: 'Potilastunnus', encryptUpload: 'Salaa & lataa PDF', uploadSuccess: 'Asiakirja ladattu ja salattu!' }, documents: { title: 'Omat asiakirjat', noDocuments: 'Asiakirjoja ei ole vielä ladattu.' }, reputation: { title: 'Mainepisteet', score: 'Pisteet', description: 'Maineesi perustuu sinua suositelleiden henkilöiden luottamuspainoihin.', votersTitle: 'Äänestäjät & luottamusverkosto', weight: 'Paino:' } }, chat: { title: 'Chat', subtitle: 'Yhdistä matcheihisi', requestAccess: 'Pyysi pääsyä {{testType}}-testiisi.', approvedRequest: 'Hyväksyin pyyntösi! Voit nyt nähdä salatun {{testType}}-testiraporttini.', approvedResponse: 'Hyväksyin pyyntösi nähdä {{testType}}-testini.', declinedResponse: 'Hylkäsin pyyntösi nähdä {{testType}}-testini.' }, language: { select: 'Valitse kieli', title: 'Valitse kielisi', description: 'Valitse haluamasi kieli jatkaaksesi' }, country: { select: 'Valitse maa', title: 'Valitse maasi', description: 'Valitse maasi löytääksesi lähellä olevia ihmisiä' } },
  ja: { app: { tagline: 'Web3とP2Pで構築された分散型デーティング' }, navigation: { swipe: 'スワイプ', messages: 'メッセージ', profile: 'プロフィール' }, home: { hero: { title: 'マッチを見つけよう', subtitle: 'プロフィールをスワイプして、素敵な人とつながりましょう。' }, filters: { verifiedStd: 'STD検証済みのみ', verifiedDna: 'DNA検証済みのみ', noProfiles: '選択したフィルターに一致するプロフィールがありません。' }, profile: { newMatch: '新しいマッチ', noMoreProfiles: '今はプロフィールがありません！後でまた確認してください。' } }, profile: { tabs: { profile: 'プロフィール', reputation: '評判' }, myProfile: { title: 'マイプロフィール', verifiedUser: '認証済みユーザー' }, status: { stdStatus: 'STDステータス', dnaStatus: 'DNAステータス', uploaded: '✓ アップロード済み', notUploaded: '✗ 未アップロード' }, upload: { title: '健康検査をアップロード', stdTest: 'STD検査', dnaTest: 'DNA検査', redactFields: 'アップロード前に機密フィールドを編集:', fullName: '氏名', address: '住所', phoneNumber: '電話番号', patientId: '患者ID', encryptUpload: '暗号化してPDFをアップロード', uploadSuccess: 'ドキュメントが正常にアップロード・暗号化されました！' }, documents: { title: 'マイドキュメント', noDocuments: 'まだドキュメントがアップロードされていません。' }, reputation: { title: '評判スコア', score: 'スコア', description: '評判は、あなたを保証した人々の信頼ウェイトに基づいています。', votersTitle: '投票者と信頼ネットワーク', weight: 'ウェイト:' } }, chat: { title: 'チャット', subtitle: 'マッチとつながる', requestAccess: '{{testType}}検査へのアクセスをリクエストしました。', approvedRequest: 'リクエストを承認しました！復号化された{{testType}}検査レポートを閲覧できます。', approvedResponse: '{{testType}}検査の閲覧リクエストを承認しました。', declinedResponse: '{{testType}}検査の閲覧リクエストを拒否しました。' }, language: { select: '言語を選択', title: '言語を選んでください', description: '続行するには希望の言語を選択してください' }, country: { select: '国を選択', title: '国を選んでください', description: '近くの人とマッチするために国を選択してください' } },
};

const tier34Basic = {
  cs: { tagline: 'Decentralizované seznamování na Web3 a P2P', heroTitle: 'Najděte svůj match', swipe: 'Přejetí', messages: 'Zprávy', profile: 'Profil' },
  ro: { tagline: 'Întâlniri descentralizate pe Web3 și P2P', heroTitle: 'Găsește-ți perechea', swipe: 'Glisează', messages: 'Mesaje', profile: 'Profil' },
  hu: { tagline: 'Decentralizált társkeresés Web3-on és P2P-n', heroTitle: 'Találd meg a párod', swipe: 'Húzás', messages: 'Üzenetek', profile: 'Profil' },
  el: { tagline: 'Αποκεντρωμένο dating σε Web3 & P2P', heroTitle: 'Βρες το ταίρι σου', swipe: 'Σύρε', messages: 'Μηνύματα', profile: 'Προφίλ' },
  hr: { tagline: 'Decentralizirano spajanje na Web3 i P2P', heroTitle: 'Pronađi svoj match', swipe: 'Povuci', messages: 'Poruke', profile: 'Profil' },
  sk: { tagline: 'Decentralizované zoznamovanie na Web3 a P2P', heroTitle: 'Nájdite svoj match', swipe: 'Potiahnuť', messages: 'Správy', profile: 'Profil' },
  sl: { tagline: 'Decentralizirano spoznavanje na Web3 in P2P', heroTitle: 'Poišči svoj match', swipe: 'Povleci', messages: 'Sporočila', profile: 'Profil' },
  bg: { tagline: 'Децентрализирано запознанства на Web3 и P2P', heroTitle: 'Намерете своя match', swipe: 'Плъзни', messages: 'Съобщения', profile: 'Профил' },
  et: { tagline: 'Detsentraliseeritud tutvumine Web3 ja P2P-l', heroTitle: 'Leia oma match', swipe: 'Pühi', messages: 'Sõnumid', profile: 'Profiil' },
  lv: { tagline: 'Decentralizētas iepazīšanās ar Web3 un P2P', heroTitle: 'Atrodi savu match', swipe: 'Pavelc', messages: 'Ziņas', profile: 'Profils' },
  lt: { tagline: 'Decentralizuotos pažintys su Web3 ir P2P', heroTitle: 'Rask savo match', swipe: 'Perbrauk', messages: 'Žinutės', profile: 'Profilis' },
  is: { tagline: 'Distræð stefnumót byggð á Web3 og P2P', heroTitle: 'Finndu þinn match', swipe: 'Strjúka', messages: 'Skilaboð', profile: 'Prófíll' },
  he: { tagline: 'היכרויות מבוזרות על Web3 ו-P2P', heroTitle: 'מצא את ההתאמה שלך', swipe: 'החלק', messages: 'הודעות', profile: 'פרופיל' },
  ar: { tagline: 'مواعدة لامركزية مبنية على Web3 و P2P', heroTitle: 'اعثر على شريكك', swipe: 'اسحب', messages: 'الرسائل', profile: 'الملف الشخصي' },
  'zh-TW': { tagline: '基於 Web3 和 P2P 的去中心化約會', heroTitle: '找到你的配對', swipe: '滑動', messages: '訊息', profile: '個人資料' },
  ne: { tagline: 'Web3 र P2P मा आधारित विकेन्द्रित डेटिङ', heroTitle: 'आफ्नो म्याच खोज्नुहोस्', swipe: 'स्वाइप', messages: 'सन्देश', profile: 'प्रोफाइल' },
  sw: { tagline: 'Mahusiano yasiyokuwa na kituo kwenye Web3 na P2P', heroTitle: 'Pata mechi yako', swipe: 'Telezesha', messages: 'Ujumbe', profile: 'Wasifu' },
  fil: { tagline: 'Desentralisadong dating sa Web3 at P2P', heroTitle: 'Hanapin ang iyong match', swipe: 'Mag-swipe', messages: 'Mga mensahe', profile: 'Profile' },
  vi: { tagline: 'Hẹn hò phi tập trung trên Web3 & P2P', heroTitle: 'Tìm match của bạn', swipe: 'Vuốt', messages: 'Tin nhắn', profile: 'Hồ sơ' },
};

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = deepMerge(out[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

function applyTier34(locale, basic) {
  return deepMerge(JSON.parse(JSON.stringify(en)), {
    app: { tagline: basic.tagline },
    navigation: { swipe: basic.swipe, messages: basic.messages, profile: basic.profile },
    home: { hero: { title: basic.heroTitle, subtitle: en.home.hero.subtitle } },
    auth: {
      loading: 'Loading secure session...',
      connectWallet: { title: 'Connect Your Wallet', description: en.auth.connectWallet.description },
      signIn: { title: 'Sign In with Ethereum', description: en.auth.signIn.description, button: 'Sign-In with Ethereum' },
      logout: 'Logout',
    },
  });
}

const tier12Codes = ['de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'uk', 'sv', 'nb', 'da', 'fi', 'ja'];
const tier34Codes = Object.keys(tier34Basic);

for (const code of tier12Codes) {
  const file = path.join(localesDir, `${code}.json`);
  let existing = {};
  if (fs.existsSync(file)) existing = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const merged = tier12Full[code]
    ? deepMerge(deepMerge(deepMerge(en, existing), tier12Full[code]), { auth: auth[code] })
    : deepMerge(deepMerge(deepMerge(en, existing), tier12ExistingFix[code] || {}), { auth: auth[code] });
  fs.writeFileSync(file, JSON.stringify(merged, null, 2) + '\n');
  console.log(`Updated tier 1-2: ${code}`);
}

for (const code of tier34Codes) {
  const file = path.join(localesDir, `${code}.json`);
  const data = applyTier34(code, tier34Basic[code]);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`Updated tier 3-4: ${code}`);
}

console.log('Done.');
