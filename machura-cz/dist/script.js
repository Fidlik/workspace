"use strict";
document.getElementById("year").textContent = new Date().getFullYear();
const target = window.MACHURA_CONFIG?.itUrl?.trim();
if (target) {
  try {
    const url = new URL(target);
    if (url.protocol === "https:" || url.protocol === "http:") {
      const link = document.getElementById("it-link");
      link.href = url.href;
      link.removeAttribute("aria-disabled");
      document.getElementById("it-status").textContent = url.hostname;
    }
  } catch { /* Při neplatné adrese zůstane bezpečně stav Připravujeme. */ }
}
