const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../../apps/web/src/i18n/locales');

// Simple translations for testing - just English defaults
const defaultTrans = {
  email: {
    label: 'Email Guardian',
    placeholder: 'Enter your email',
    add: 'Add Email',
    added: 'Email guardian added',
    remove: 'Remove',
    removed: 'Email guardian removed'
  },
  phone: {
    label: 'Phone Guardian',
    placeholder: 'Enter your phone',
    add: 'Add Phone',
    added: 'Phone guardian added',
    remove: 'Remove',
    removed: 'Phone guardian removed'
  }
};

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} files`);

let successCount = 0;

files.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let json;
    try {
      json = JSON.parse(content);
    } catch (e) {
      console.error(`FAIL: ${lang} - JSON parse error: ${e.message}`);
      return;
    }
    
    if (!json.auth) json.auth = {};
    if (!json.auth.recovery) json.auth.recovery = {};
    
    // Ensure email object exists
    if (!json.auth.recovery.email) {
      json.auth.recovery.email = {};
    }
    // Merge default translations
    Object.keys(defaultTrans.email).forEach(key => {
      if (!(key in json.auth.recovery.email)) {
        json.auth.recovery.email[key] = defaultTrans.email[key];
      }
    });
    
    // Ensure phone object exists
    if (!json.auth.recovery.phone) {
      json.auth.recovery.phone = {};
    }
    Object.keys(defaultTrans.phone).forEach(key => {
      if (!(key in json.auth.recovery.phone)) {
        json.auth.recovery.phone[key] = defaultTrans.phone[key];
      }
    });
    
    const newContent = JSON.stringify(json, null, 2) + '\n';
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`OK: ${lang}`);
    successCount++;
  } catch (e) {
    console.error(`FAIL: ${lang} - ${e.message}`);
  }
});

console.log(`\n=== DONE ===`);
console.log(`Successfully updated: ${successCount}/${files.length} files`);
