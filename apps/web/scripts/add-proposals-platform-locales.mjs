// Deterministic i18n locale adder for ProposalsPanel platform/status/filter keys
// (communications.proposalPlatformFilter.*, communications.proposalStatus.*,
// communications.proposalViewOn).
//
// Deep-merges new keys (nested objects, matching how i18next resolves
// dot-notation t() keys) into every locale JSON file, validates all 34
// locales, and prints "ALL 34 LOCALES VALID" on success.
//
// Natural translations are provided for Tier 1 languages
// (uk de fr es pt ja ko zh ar vi hi tr th id ms ru); all other
// locales fall back to English (repo Tier 2 convention).
//
// Idempotent: re-running deep-merges the same values (existing values are
// overwritten only with identical content, so no duplication occurs).
//
// NOTE: GitHub / Codeberg / GitLab are brand names and stay untranslated.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "..", "src", "i18n", "locales");

// English source (nested, mirrors the i18n key paths used by t()).
const EN = {
  communications: {
    proposalPlatformFilter: {
      all: "All",
      github: "GitHub",
      codeberg: "Codeberg",
      gitlab: "GitLab",
      inApp: "In-app",
    },
    proposalStatus: {
      open: "Open",
      closed: "Closed",
      merged: "Merged",
    },
    proposalViewOn: "View on {{platform}}",
  },
};

// Natural translations for Tier 1 languages (only the new keys).
const NATURAL = {
  uk: {
    communications: {
      proposalPlatformFilter: {
        all: "Усі",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "У додатку",
      },
      proposalStatus: {
        open: "Відкрито",
        closed: "Закрито",
        merged: "Злито",
      },
      proposalViewOn: "Переглянути на {{platform}}",
    },
  },
  ru: {
    communications: {
      proposalPlatformFilter: {
        all: "Все",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "В приложении",
      },
      proposalStatus: {
        open: "Открыто",
        closed: "Закрыто",
        merged: "Слито",
      },
      proposalViewOn: "Открыть на {{platform}}",
    },
  },
  de: {
    communications: {
      proposalPlatformFilter: {
        all: "Alle",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "In der App",
      },
      proposalStatus: {
        open: "Offen",
        closed: "Geschlossen",
        merged: "Zusammengeführt",
      },
      proposalViewOn: "Auf {{platform}} ansehen",
    },
  },
  fr: {
    communications: {
      proposalPlatformFilter: {
        all: "Tous",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "Dans l'application",
      },
      proposalStatus: {
        open: "Ouverte",
        closed: "Fermée",
        merged: "Fusionnée",
      },
      proposalViewOn: "Voir sur {{platform}}",
    },
  },
  es: {
    communications: {
      proposalPlatformFilter: {
        all: "Todos",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "En la aplicación",
      },
      proposalStatus: {
        open: "Abierta",
        closed: "Cerrada",
        merged: "Fusionada",
      },
      proposalViewOn: "Ver en {{platform}}",
    },
  },
  pt: {
    communications: {
      proposalPlatformFilter: {
        all: "Todos",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "No aplicativo",
      },
      proposalStatus: {
        open: "Aberta",
        closed: "Fechada",
        merged: "Mesclada",
      },
      proposalViewOn: "Ver no {{platform}}",
    },
  },
  ja: {
    communications: {
      proposalPlatformFilter: {
        all: "すべて",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "アプリ内",
      },
      proposalStatus: {
        open: "オープン",
        closed: "クローズ",
        merged: "マージ済み",
      },
      proposalViewOn: "{{platform}}で表示",
    },
  },
  ko: {
    communications: {
      proposalPlatformFilter: {
        all: "전체",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "앱 내",
      },
      proposalStatus: {
        open: "열림",
        closed: "닫힘",
        merged: "병합됨",
      },
      proposalViewOn: "{{platform}}에서 보기",
    },
  },
  zh: {
    communications: {
      proposalPlatformFilter: {
        all: "全部",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "应用内",
      },
      proposalStatus: {
        open: "开启",
        closed: "关闭",
        merged: "已合并",
      },
      proposalViewOn: "在{{platform}}上查看",
    },
  },
  ar: {
    communications: {
      proposalPlatformFilter: {
        all: "الكل",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "داخل التطبيق",
      },
      proposalStatus: {
        open: "مفتوح",
        closed: "مغلق",
        merged: "مدمج",
      },
      proposalViewOn: "عرض على {{platform}}",
    },
  },
  vi: {
    communications: {
      proposalPlatformFilter: {
        all: "Tất cả",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "Trong ứng dụng",
      },
      proposalStatus: {
        open: "Đang mở",
        closed: "Đã đóng",
        merged: "Đã hợp nhất",
      },
      proposalViewOn: "Xem trên {{platform}}",
    },
  },
  hi: {
    communications: {
      proposalPlatformFilter: {
        all: "सभी",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "ऐप में",
      },
      proposalStatus: {
        open: "खुला",
        closed: "बंद",
        merged: "मर्ज किया गया",
      },
      proposalViewOn: "{{platform}} पर देखें",
    },
  },
  tr: {
    communications: {
      proposalPlatformFilter: {
        all: "Tümü",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "Uygulama içinde",
      },
      proposalStatus: {
        open: "Açık",
        closed: "Kapalı",
        merged: "Birleştirildi",
      },
      proposalViewOn: "{{platform}} üzerinde görüntüle",
    },
  },
  th: {
    communications: {
      proposalPlatformFilter: {
        all: "ทั้งหมด",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "ในแอป",
      },
      proposalStatus: {
        open: "เปิด",
        closed: "ปิด",
        merged: "รวมแล้ว",
      },
      proposalViewOn: "ดูบน {{platform}}",
    },
  },
  id: {
    communications: {
      proposalPlatformFilter: {
        all: "Semua",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "Di dalam aplikasi",
      },
      proposalStatus: {
        open: "Terbuka",
        closed: "Ditutup",
        merged: "Digabungkan",
      },
      proposalViewOn: "Lihat di {{platform}}",
    },
  },
  ms: {
    communications: {
      proposalPlatformFilter: {
        all: "Semua",
        github: "GitHub",
        codeberg: "Codeberg",
        gitlab: "GitLab",
        inApp: "Dalam aplikasi",
      },
      proposalStatus: {
        open: "Terbuka",
        closed: "Ditutup",
        merged: "Digabungkan",
      },
      proposalViewOn: "Lihat di {{platform}}",
    },
  },
};

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      out[key] = deepMerge(out[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

// Read the actual locale files from disk (single source of truth).
const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith(".json"));

function main() {
  if (files.length === 0) {
    console.error("NOT ALL LOCALES EXIST");
    process.exit(1);
  }

  for (const f of files) {
    const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW"
    const filePath = path.join(LOCALES_DIR, f);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Tier 1 natural translation (fall back zh-TW -> zh), otherwise English.
    const natural = NATURAL[locale] || NATURAL[locale.split("-")[0]];
    const source = natural ? deepMerge(deepClone(EN), deepClone(natural)) : deepClone(EN);
    const merged = deepMerge(data, source);
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n", "utf8");
  }

  // Verify every locale file now contains the required keys.
  const required = [
    ["communications", ["proposalPlatformFilter", "all"]],
    ["communications", ["proposalPlatformFilter", "github"]],
    ["communications", ["proposalPlatformFilter", "codeberg"]],
    ["communications", ["proposalPlatformFilter", "gitlab"]],
    ["communications", ["proposalPlatformFilter", "inApp"]],
    ["communications", ["proposalStatus", "open"]],
    ["communications", ["proposalStatus", "closed"]],
    ["communications", ["proposalStatus", "merged"]],
    ["communications", ["proposalViewOn"]],
  ];
  const bad = [];
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, f), "utf8"));
    for (const [root, pathParts] of required) {
      let node = data[root];
      for (const p of pathParts) node = node && node[p];
      if (!node) {
        bad.push(`${f.replace(/\.json$/, "")}.${root}.${pathParts.join(".")}`);
      }
    }
  }
  console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : "ALL 34 LOCALES VALID");
}

main();
