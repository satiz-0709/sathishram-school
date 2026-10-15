(() => {
  const storageKey = "sathishram-color-theme";
  const modeStorageKey = "sathishram-display-mode";
  const themeNames = ["evergreen", "ocean", "violet", "sunset"];
  const toggle = document.getElementById("theme-toggle");
  const modeToggle = document.getElementById("mode-toggle");
  const panel = document.getElementById("theme-panel");
  if (!toggle || !panel) return;

  const savedTheme = localStorage.getItem(storageKey);
  const applyTheme = (name) => {
    const theme = themeNames.includes(name) ? name : "ocean";
    document.documentElement.dataset.theme = theme;
    panel.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
    });
  };
  const applyMode = (name) => {
    const mode = name === "dark" ? "dark" : "light";
    document.documentElement.dataset.mode = mode;
    modeToggle.setAttribute("aria-pressed", String(mode === "dark"));
    modeToggle.setAttribute("aria-label", `Switch to ${mode === "dark" ? "light" : "dark"} mode`);
    modeToggle.querySelector(".mode-toggle-label").textContent = `${mode === "dark" ? "Dark" : "Light"} mode`;
  };

  applyTheme(savedTheme);
  applyMode(localStorage.getItem(modeStorageKey));
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    panel.hidden = isOpen;
    if (!isOpen) panel.querySelector("[aria-pressed='true']")?.focus();
  });

  panel.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.themeChoice;
      applyTheme(theme);
      localStorage.setItem(storageKey, theme);
    });
  });
  modeToggle.addEventListener("click", () => {
    const mode = document.documentElement.dataset.mode === "dark" ? "light" : "dark";
    applyMode(mode);
    localStorage.setItem(modeStorageKey, mode);
  });

  document.addEventListener("click", (event) => {
    if (!panel.hidden && !event.target.closest(".theme-control")) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
})();
