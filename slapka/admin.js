function applyAdminLock() {
  document.body.classList.remove("admin-locked");
  document.body.classList.add("admin-unlocked");
}

const originalRenderAll = renderAll;
renderAll = function renderAllWithAccessMode() {
  originalRenderAll();
  applyAdminLock();
};

const adminOpen = document.querySelector("#admin-open");
const adminModal = document.querySelector("#admin-modal");
const adminCancel = document.querySelector("#admin-cancel");
const adminLogout = document.querySelector("#admin-logout");

if (adminOpen) {
  adminOpen.textContent = "Odhlásit";
  adminOpen.addEventListener("click", () => {
    window.location.href = "/logout";
  });
}

adminCancel?.addEventListener("click", () => {
  if (adminModal) adminModal.hidden = true;
});

adminLogout?.addEventListener("click", () => {
  window.location.href = "/logout";
});

applyAdminLock();
