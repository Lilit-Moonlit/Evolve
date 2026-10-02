/* EVOLVE donation site — language switcher, rendering, copy buttons, form.
 * Plain JS, no external dependencies. Serves over HTTP (GitHub/Codeberg Pages);
 * do not open via file:// (fetch of locale files would be blocked). */
(function () {
  "use strict";

  var LANG_STORAGE_KEY = "evolve-donate-lang";
  var RTL_LANGS = ["ar", "he"];
  var COPIED_RESET_MS = 2000;
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/mdekrwqk";

  /* Display rows for the addresses table (labels are chain proper nouns).
   * Several EVM chains share the single "EVM" address value from addresses.json. */
  var ADDRESS_ROWS = [
    { key: "BTC", label: "Bitcoin (BTC)" },
    { key: "Lightning", label: "Bitcoin Lightning" },
    { key: "EVM", label: "Ethereum (ETH / ERC-20)" },
    { key: "EVM", label: "Arbitrum One" },
    { key: "EVM", label: "Optimism" },
    { key: "EVM", label: "Base" },
    { key: "EVM", label: "Polygon" },
    { key: "EVM", label: "BNB Smart Chain (BSC)" },
    { key: "EVM", label: "Avalanche (C-Chain)" },
    { key: "Solana", label: "Solana (SOL / SPL)" },
    { key: "TON", label: "TON" },
    { key: "TRON", label: "TRON (TRX / USDT-TRC20)" },
    { key: "XMR", label: "Monero (XMR)" },
    { key: "LTC", label: "Litecoin (LTC)" },
    { key: "DOGE", label: "Dogecoin (DOGE)" },
  ];

  var localeCache = Object.create(null); // code -> parsed locale JSON
  var state = {
    lang: "en",
    names: [], // locales/index.json
    addresses: {}, // addresses.json
  };

  function $(id) {
    return document.getElementById(id);
  }

  function fetchJson(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
      return res.json();
    });
  }

  function loadLocale(code) {
    if (localeCache[code]) return Promise.resolve(localeCache[code]);
    return fetchJson("locales/" + code + ".json").then(
      function (data) {
        localeCache[code] = data;
        return data;
      },
      function () {
        // Missing/corrupt locale -> fall back to English strings silently.
        return {};
      },
    );
  }

  function lookup(dict, path) {
    var node = dict;
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (!node || typeof node !== "object" || !(parts[i] in node)) return undefined;
      node = node[parts[i]];
    }
    return typeof node === "string" ? node : undefined;
  }

  function t(path) {
    var value = lookup(localeCache[state.lang], path);
    if (value === undefined) value = lookup(localeCache.en, path);
    return value !== undefined ? value : path;
  }

  function applyText() {
    var i;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(nodes[i].getAttribute("data-i18n"));
    }
    nodes = document.querySelectorAll("[data-i18n-aria]");
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("aria-label", t(nodes[i].getAttribute("data-i18n-aria")));
    }
    document.title = t("donate.title");
  }

  function renderAddresses() {
    var list = $("addresses-list");
    list.textContent = "";
    ADDRESS_ROWS.forEach(function (row) {
      var value = String(state.addresses[row.key] || "");
      /* Hide networks that have not been filled in yet. */
      if (!value || value.indexOf("<YOUR_") === 0) return;

      var item = document.createElement("div");
      item.className = "addr-row";

      var network = document.createElement("span");
      network.className = "addr-network";
      network.textContent = row.label;

      var address = document.createElement("code");
      address.className = "addr-value";
      address.textContent = value;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("data-address", value);
      btn.textContent = t("donate.copy");

      item.appendChild(network);
      item.appendChild(address);
      item.appendChild(btn);
      list.appendChild(item);
    });
  }

  function renderLanguageOptions(select) {
    select.textContent = "";
    state.names.forEach(function (entry) {
      var option = document.createElement("option");
      option.value = entry.code;
      option.textContent = entry.name;
      select.appendChild(option);
    });
  }

  function detectLanguage(codes) {
    var saved = null;
    try {
      saved = localStorage.getItem(LANG_STORAGE_KEY);
    } catch (err) {
      /* storage unavailable */
    }
    if (saved && codes.indexOf(saved) !== -1) return saved;

    var candidates = [];
    if (window.navigator.languages) candidates = candidates.concat(window.navigator.languages);
    if (window.navigator.language) candidates.push(window.navigator.language);

    var i, j;
    for (i = 0; i < candidates.length; i++) {
      var exact = String(candidates[i] || "").toLowerCase();
      for (j = 0; j < codes.length; j++) {
        if (codes[j].toLowerCase() === exact) return codes[j];
      }
    }
    for (i = 0; i < candidates.length; i++) {
      var prefix = String(candidates[i] || "")
        .toLowerCase()
        .split("-")[0];
      if (!prefix) continue;
      for (j = 0; j < codes.length; j++) {
        if (codes[j].toLowerCase().split("-")[0] === prefix) return codes[j];
      }
    }
    return "en";
  }

  function applyLanguage(code, select) {
    state.lang = code;
    document.documentElement.lang = code;
    document.documentElement.dir = RTL_LANGS.indexOf(code) !== -1 ? "rtl" : "ltr";
    try {
      localStorage.setItem(LANG_STORAGE_KEY, code);
    } catch (err) {
      /* storage unavailable */
    }
    if (select) select.value = code;
    applyText();
    renderAddresses();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Legacy fallback for non-secure contexts.
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy")) resolve();
        else reject(new Error("copy failed"));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function wireCopyButtons() {
    var list = $("addresses-list");
    list.addEventListener("click", function (ev) {
      var btn = ev.target;
      if (!btn || btn.nodeType !== 1) return;
      var target = btn.closest(".copy-btn");
      if (!target || !list.contains(target)) return;

      copyText(target.getAttribute("data-address")).then(
        function () {
          target.classList.add("copied");
          target.textContent = t("donate.copied");
          clearTimeout(target._copiedTimer);
          target._copiedTimer = setTimeout(function () {
            target.classList.remove("copied");
            target.textContent = t("donate.copy");
          }, COPIED_RESET_MS);
        },
        function () {
          /* clipboard unavailable — no-op */
        },
      );
    });
  }

  function wireForm() {
    var form = $("feedback-form");
    var status = $("form-status");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      status.textContent = "";
      status.className = "form-status";

      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          status.textContent = t("donate.form.success");
          status.className = "form-status success";
          form.reset();
        })
        .catch(function () {
          status.textContent = t("donate.form.error");
          status.className = "form-status error";
        });
    });
  }

  function init() {
    var select = $("language-select");

    Promise.all([fetchJson("locales/index.json"), fetchJson("addresses.json")])
      .then(function (results) {
        state.names = results[0];
        state.addresses = results[1];
        var codes = state.names.map(function (entry) {
          return entry.code;
        });
        var initial = detectLanguage(codes);
        renderLanguageOptions(select);
        return Promise.all([loadLocale("en"), loadLocale(initial)]).then(function () {
          return initial;
        });
      })
      .then(function (initial) {
        applyLanguage(initial, select);

        select.addEventListener("change", function () {
          var code = select.value;
          loadLocale(code).then(function () {
            applyLanguage(code, select);
          });
        });

        wireCopyButtons();
        wireForm();
      })
      .catch(function (err) {
        console.error("Failed to initialize the donation page:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
