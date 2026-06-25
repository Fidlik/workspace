const translations = {
  en: {
    "nav.services": "Services",
    "nav.support": "Support",
    "nav.contact": "Contact",
    "hero.eyebrow": "IT services for small business",
    "hero.title": "Reliable technology help without enterprise overhead.",
    "hero.copy": "Kompotex.org helps small teams keep computers, cloud tools, websites, and daily operations running smoothly.",
    "hero.primary": "Start a conversation",
    "hero.secondary": "View services",
    "intro.label": "What we focus on",
    "intro.title": "Practical IT for owners, offices, and small teams.",
    "intro.copy": "The goal is simple: fewer interruptions, clearer systems, and technology that supports the work instead of becoming another job.",
    "services.label": "Services",
    "services.title": "Help where small businesses usually need it first.",
    "services.support.title": "IT support and troubleshooting",
    "services.support.copy": "Computers, printers, email, shared drives, backups, accounts, and everyday issues handled calmly and clearly.",
    "services.cloud.title": "Microsoft 365 and cloud setup",
    "services.cloud.copy": "Tenant setup, mailboxes, permissions, SharePoint, Teams, device basics, and sensible security defaults.",
    "services.web.title": "Websites and small web tools",
    "services.web.copy": "Lightweight sites, forms, ticket pages, internal dashboards, and Cloudflare or GitHub based hosting.",
    "services.automation.title": "Automation and cleanup",
    "services.automation.copy": "Scripts, data cleanup, file workflows, reports, and small integrations that remove repetitive manual work.",
    "support.label": "Ways to work together",
    "support.title": "Flexible support, from one task to ongoing care.",
    "support.audit.title": "IT checkup",
    "support.audit.copy": "Review accounts, devices, backups, domains, and hosting. Leave with clear next steps.",
    "support.project.title": "Project help",
    "support.project.copy": "Set up a site, migrate mail, repair a workflow, or create a small tool for your team.",
    "support.monthly.title": "Monthly support",
    "support.monthly.copy": "A lightweight retainer for updates, questions, fixes, and small improvements.",
    "process.label": "Process",
    "process.title": "Small steps, clear ownership.",
    "process.step1.title": "Listen",
    "process.step1.copy": "Understand the problem, tools, urgency, and budget.",
    "process.step2.title": "Stabilize",
    "process.step2.copy": "Fix what is blocking work and reduce immediate risk.",
    "process.step3.title": "Improve",
    "process.step3.copy": "Document the setup, automate where useful, and make the next fix easier.",
    "contact.label": "Contact",
    "contact.title": "Tell us what is slowing your team down.",
    "contact.copy": "Send a short note with the issue, company size, and the tools you use. We will suggest the simplest useful next step.",
    "contact.button": "info@kompotex.org",
    "footer.copy": "Practical IT services for small business."
  },
  cs: {
    "nav.services": "Služby",
    "nav.support": "Podpora",
    "nav.contact": "Kontakt",
    "hero.eyebrow": "IT služby pro malé firmy",
    "hero.title": "Spolehlivá pomoc s technikou bez zbytečné režie.",
    "hero.copy": "Kompotex.org pomáhá malým týmům udržet počítače, cloudové nástroje, weby a každodenní provoz v klidu.",
    "hero.primary": "Napište nám",
    "hero.secondary": "Zobrazit služby",
    "intro.label": "Na co se zaměřujeme",
    "intro.title": "Praktické IT pro majitele, kanceláře a malé týmy.",
    "intro.copy": "Cíl je jednoduchý: méně výpadků, přehlednější systémy a technologie, která podporuje práci místo toho, aby přidávala další starosti.",
    "services.label": "Služby",
    "services.title": "Pomoc tam, kde ji malé firmy obvykle potřebují nejdřív.",
    "services.support.title": "IT podpora a řešení potíží",
    "services.support.copy": "Počítače, tiskárny, e-mail, sdílené disky, zálohy, účty a běžné problémy řešené klidně a srozumitelně.",
    "services.cloud.title": "Microsoft 365 a cloud",
    "services.cloud.copy": "Nastavení tenantu, schránek, oprávnění, SharePointu, Teams, základů správy zařízení a rozumného zabezpečení.",
    "services.web.title": "Weby a malé webové nástroje",
    "services.web.copy": "Lehké weby, formuláře, ticket stránky, interní přehledy a hosting přes Cloudflare nebo GitHub.",
    "services.automation.title": "Automatizace a úklid",
    "services.automation.copy": "Skripty, čištění dat, souborové postupy, reporty a malé integrace, které ubírají opakovanou ruční práci.",
    "support.label": "Možnosti spolupráce",
    "support.title": "Flexibilní podpora od jednoho úkolu po průběžnou péči.",
    "support.audit.title": "IT kontrola",
    "support.audit.copy": "Prověření účtů, zařízení, záloh, domén a hostingu. Výsledkem jsou jasné další kroky.",
    "support.project.title": "Projektová pomoc",
    "support.project.copy": "Nastavení webu, migrace e-mailu, oprava workflow nebo vytvoření malého nástroje pro tým.",
    "support.monthly.title": "Měsíční podpora",
    "support.monthly.copy": "Lehký paušál na aktualizace, dotazy, opravy a drobná zlepšení.",
    "process.label": "Postup",
    "process.title": "Malé kroky, jasná odpovědnost.",
    "process.step1.title": "Pochopení",
    "process.step1.copy": "Ujasníme problém, nástroje, naléhavost a rozpočet.",
    "process.step2.title": "Stabilizace",
    "process.step2.copy": "Vyřešíme to, co brzdí práci, a snížíme okamžité riziko.",
    "process.step3.title": "Zlepšení",
    "process.step3.copy": "Zdokumentujeme nastavení, zautomatizujeme užitečné části a usnadníme další zásah.",
    "contact.label": "Kontakt",
    "contact.title": "Napište, co váš tým zpomaluje.",
    "contact.copy": "Pošlete krátkou zprávu s popisem potíže, velikostí firmy a nástroji, které používáte. Navrhneme nejjednodušší užitečný další krok.",
    "contact.button": "info@kompotex.org",
    "footer.copy": "Praktické IT služby pro malé firmy."
  }
};

const elements = document.querySelectorAll("[data-i18n]");
const buttons = document.querySelectorAll("[data-lang]");

function setLanguage(lang) {
  const dictionary = translations[lang] || translations.en;

  elements.forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  document.documentElement.lang = lang;
  document.title = lang === "cs"
    ? "Kompotex.org | IT služby pro malé firmy"
    : "Kompotex.org | IT services for small business";

  buttons.forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  localStorage.setItem("kompotex-language", lang);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

const savedLanguage = localStorage.getItem("kompotex-language");
const browserLanguage = navigator.language.toLowerCase().startsWith("cs") ? "cs" : "en";
setLanguage(savedLanguage || browserLanguage);
