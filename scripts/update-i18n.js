const fs = require('fs');
const path = require('path');

// Configuration
const localesDir = path.join('C:\\CFC\\apps\\web\\src\\i18n\\locales');
const targetKeys = {
  email: ['label', 'placeholder', 'add', 'added', 'remove', 'removed'],
  phone: ['label', 'placeholder', 'add', 'added', 'remove', 'removed']
};

// Tier 1 translations (natural translations)
const tier1 = {
  'uk': {
    email: {label: 'Електронний опікун', placeholder: 'Введіть вашу електронну адресу', add: 'Додати електронну адресу', added: 'Електронний опікун додано', remove: 'Видалити', removed: 'Електронний опікун видалено'},
    phone: {label: 'Телефонний опікун', placeholder: 'Введіть ваш номер телефону', add: 'Додати телефон', added: 'Телефонний опікун додано', remove: 'Видалити', removed: 'Телефонний опікун видалено'}
  },
  'de': {
    email: {label: 'E-Mail-Wächter', placeholder: 'Geben Sie Ihre E-Mail ein', add: 'E-Mail hinzufügen', added: 'E-Mail-Wächter hinzugefügt', remove: 'Entfernen', removed: 'E-Mail-Wächter entfernt'},
    phone: {label: 'Telefonischer Wächter', placeholder: 'Geben Sie Ihre Telefonnummer ein', add: 'Telefon hinzufügen', added: 'Telefonischer Wächter hinzugefügt', remove: 'Entfernen', removed: 'Telefonischer Wächter entfernt'}
  },
  'fr': {
    email: {label: 'Gardien email', placeholder: 'Entrez votre email', add: 'Ajouter un email', added: 'Gardien email ajouté', remove: 'Supprimer', removed: 'Gardien email supprimé'},
    phone: {label: 'Gardien téléphone', placeholder: 'Entrez votre numéro de téléphone', add: 'Ajouter un téléphone', added: 'Gardien téléphone ajouté', remove: 'Supprimer', removed: 'Gardien téléphone supprimé'}
  },
  'es': {
    email: {label: 'Guardián de correo electrónico', placeholder: 'Introduce tu correo electrónico', add: 'Añadir correo electrónico', added: 'Guardián de correo electrónico añadido', remove: 'Eliminar', removed: 'Guardián de correo electrónico eliminado'},
    phone: {label: 'Guardián de teléfono', placeholder: 'Introduce tu número de teléfono', add: 'Añadir número de teléfono', added: 'Guardián de teléfono añadido', remove: 'Eliminar', removed: 'Guardián de teléfono eliminado'}
  },
  'pt': {
    email: {label: 'Guardião de e-mail', placeholder: 'Insira seu e-mail', add: 'Adicionar e-mail', added: 'Guardião de e-mail adicionado', remove: 'Remover', removed: 'Guardião de e-mail removido'},
    phone: {label: 'Guardião de telefone', placeholder: 'Insira seu número de telefone', add: 'Adicionar telefone', added: 'Guardião de telefone adicionado', remove: 'Remover', removed: 'Guardião de telefone removido'}
  },
  'ja': {
    email: {label: 'メールガーディアン', placeholder: 'メールアドレスを入力してください', add: 'メールを追加', added: 'メールガーディアンが追加されました', remove: '削除', removed: 'メールガーディアンが削除されました'},
    phone: {label: '電話番号ガーディアン', placeholder: '電話番号を入力してください', add: '電話番号を追加', added: '電話番号ガーディアンが追加されました', remove: '削除', removed: '電話番号ガーディアンが削除されました'}
  },
  'zh-TW': {
    email: {label: '電子郵件守護者', placeholder: '輸入您的電子郵件地址', add: '添加電子郵件', added: '電子郵件守護者已添加', remove: '移除', removed: '電子郵件守護者已移除'},
    phone: {label: '電話守護者', placeholder: '輸入您的電話號碼', add: '添加電話', added: '電話守護者已添加', remove: '移除', removed: '電話守護者已移除'}
  },
  'ar': {
    email: {label: 'حارس البريد الإلكتروني', placeholder: 'أدخل بريدك الإلكتروني', add: 'إضافة بريد إلكتروني', added: 'تمت إضافة حارس البريد الإلكتروني', remove: 'حذف', removed: 'تمت إزالة حارس البريد الإلكتروني'},
    phone: {label: 'حارس الهاتف', placeholder: 'أدخل رقم هاتفك', add: 'إضافة رقم هاتف', added: 'تمت إضافة حارس الهاتف', remove: 'حذف', removed: 'تمت إزالة حارس الهاتف'}
  },
    'vi': {
      email: {label: 'Người bảo vệ email', placeholder: 'Nhập email của bạn', add: 'Thêm email', added: 'Đã thêm người bảo vệ email', remove: 'Xóa', removed: 'Đã xóa người bảo vệ email'},
      phone: {label: 'Người bảo vệ điện thoại', placeholder: 'Nhập số điện thoại của bạn', add: 'Thêm số điện thoại', added: 'Đã добавлено захисника телефону', remove: 'Xóa', removed: 'Đã видалено захисника телефону'}
    },
    // English defaults for Tier 2
    // English defaults for Tier 2
    'en': {
      email: {label: 'Email Guardian', placeholder: 'Enter your email', add: 'Add Email', added: 'Email guardian added', remove: 'Remove', removed: 'Email guardian removed'},
      phone: {label: 'Phone Guardian', placeholder: 'Enter your phone', add: 'Add Phone', added: 'Phone guardian added', remove: 'Remove', removed: 'Phone guardian removed'}
    }
};

// Helper function to safely merge objects
function mergeObjects(target, source) {
  for (const key in source) {
    if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

// Process a single file
function processFile(filePath, lang) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let json;
    try {
      json = JSON.parse(content);
    } catch (e) {
      console.error(`FAIL: ${lang} - JSON parse error`);
      return false;
    }

    // Ensure auth.recovery structure exists
    if (!json.auth) json.auth = {};
    if (!json.auth.recovery) json.auth.recovery = {};
    
    // Get translations for this language
    const trans = tier1[lang] || {};
    
    // Process email
    const emailObj = json.auth.recovery.email;
    if (!emailObj) {
      json.auth.recovery.email = {};
    }
    mergeObjects(json.auth.recovery.email, trans.email || {});
    
    // Process phone
    const phoneObj = json.auth.recovery.phone;
    if (!phoneObj) {
      json.auth.recovery.phone = {};
    }
    mergeObjects(json.auth.recovery.phone, trans.phone || {});
    
    // Write back with proper formatting
    const newContent = JSON.stringify(json, null, 2) + '\n';
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`OK: ${lang}`);
    return true;
  } catch (e) {
    console.error(`FAIL: ${lang} - ${e.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.log('Starting i18n key update...');
  
  // Get all locale files
  const files = fs.readdirSync(localesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({name: f, path: path.join(localesDir, f)}));
  
  console.log(`Found ${files.length} locale files`);
  
  // Process all files
  let successCount = 0;
  const failures = [];
  
  for (const file of files) {
    const lang = file.name.replace('.json', '');
    if (processFile(file.path, lang)) {
      successCount++;
    } else {
      failures.push(lang);
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Successfully processed: ${successCount}/${files.length} files`);
  if (failures.length) {
    console.error(`Failed files: ${failures.join(', ')}`);
  }
  
  // Validation pass
  console.log(`\n=== VALIDATION ===`);
  let validCount = 0;
  const invalidFiles = [];
  
  for (const file of files) {
    try {
      JSON.parse(fs.readFileSync(file.path, 'utf8'));
      validCount++;
    } catch (e) {
      invalidFiles.push(file.name);
    }
  }
  console.log(`JSON validation: ${validCount}/${files.length} files valid`);
  if (invalidFiles.length) {
    console.error(`Invalid files: ${invalidFiles.join(', ')}`);
  }
  
  // Key presence check
  console.log(`\n=== KEY CHECK ===`);
  let missing = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file.path, 'utf8');
    const hasEmail = targetKeys.email.every(key => 
      content.includes(`auth.recovery.email.${key}`)
    );
    const hasPhone = targetKeys.phone.every(key => 
      content.includes(`auth.recovery.phone.${key}`)
    );
    const lang = file.name.replace('.json', '');
    if (!hasEmail || !hasPhone) {
      missing.push(lang);
    }
  }
  console.log(`All keys present in: ${files.length - missing.length}/${files.length} files`);
  if (missing.length) {
    console.error(`Missing in: ${missing.join(', ')}`);
  }
  
  // Run prettier
  console.log(`\nRunning Prettier...`);
  try {
    const { execSync } = require('child_process');
    execSync('npx prettier --write "apps/web/src/i18n/locales/*.json"', { stdio: 'inherit' });
    console.log('Prettier completed successfully');
  } catch (e) {
    console.error('Prettier failed:', e.message);
  }
  
  console.log(`\n=== DONE ===`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processFile, main };