const ADMIN_PASSWORD_KEY = "slapka-admin-password";
let slapkaAdminUnlocked = Boolean(sessionStorage.getItem(ADMIN_PASSWORD_KEY));

function getAdminPassword() {
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY) || "";
}

function setAdminMessage(message = "") {
  const error = document.querySelector("#admin-error");
  if (error) error.textContent = message;
}

function applyAdminLock() {
  const unlocked = slapkaAdminUnlocked;
  document.body.classList.toggle("admin-unlocked", unlocked);
  document.body.classList.toggle("admin-locked", !unlocked);

  const adminButton = document.querySelector("#admin-open");
  if (adminButton) adminButton.textContent = unlocked ? "Admin odemčeno" : "Admin";

  document.querySelectorAll("input, select, button").forEach((element) => {
    const keepEnabled =
      element.closest("#admin-modal") ||
      element.id === "admin-open" ||
      element.classList.contains("trip-card") ||
      element.classList.contains("receipt-tab");

    if (!keepEnabled) element.disabled = !unlocked;
  });
}

function openAdminModal() {
  const modal = document.querySelector("#admin-modal");
  const password = document.querySelector("#admin-password");
  if (!modal) return;
  setAdminMessage("");
  modal.hidden = false;
  requestAnimationFrame(() => password?.focus());
}

function closeAdminModal() {
  const modal = document.querySelector("#admin-modal");
  if (modal) modal.hidden = true;
}

async function saveRemoteState() {
  const previousState = structuredClone(state);
  try {
    const response = await fetch(API_STATE_URL, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-slapka-admin": getAdminPassword()
      },
      body: JSON.stringify(state)
    });

    if (response.status === 401) throw new Error("Admin heslo nesedí.");
    if (response.status === 403) throw new Error("Nastav ADMIN_PASSWORD v Cloudflare.");
    if (!response.ok) throw new Error("Uložení selhalo.");

    state = mergeRemoteState(await response.json(), previousState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    els.autosaveNote.textContent = "Uloženo do databáze";
    renderTripList();
    renderReceiptList();
    applyAdminLock();
  } catch (error) {
    els.autosaveNote.textContent = error.message || "Uloženo jen lokálně";
    if (/heslo|ADMIN_PASSWORD/i.test(error.message || "")) {
      slapkaAdminUnlocked = false;
      sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
      applyAdminLock();
    }
  }
}

const originalRenderAll = renderAll;
renderAll = function renderAllWithAdminLock() {
  originalRenderAll();
  applyAdminLock();
};

const adminOpen = document.querySelector("#admin-open");
const adminModal = document.querySelector("#admin-modal");
const adminForm = document.querySelector("#admin-form");
const adminPassword = document.querySelector("#admin-password");
const adminCancel = document.querySelector("#admin-cancel");
const adminLogout = document.querySelector("#admin-logout");

adminOpen?.addEventListener("click", openAdminModal);
adminCancel?.addEventListener("click", closeAdminModal);
adminModal?.addEventListener("click", (event) => {
  if (event.target === adminModal) closeAdminModal();
});

adminForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = adminPassword?.value || "";
  if (!password) {
    setAdminMessage("Zadej heslo.");
    return;
  }

  sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
  slapkaAdminUnlocked = true;
  setAdminMessage("");
  closeAdminModal();
  applyAdminLock();
});

adminLogout?.addEventListener("click", () => {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  slapkaAdminUnlocked = false;
  if (adminPassword) adminPassword.value = "";
  setAdminMessage("Zamčeno.");
  applyAdminLock();
});

applyAdminLock();
