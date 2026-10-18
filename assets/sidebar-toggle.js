(() => {
  const sidebar = document.getElementById("sidebar");
  const button = document.getElementById("menu-button");
  const scrim = document.getElementById("mobile-scrim");
  const mobile = window.matchMedia("(max-width: 760px)");
  const preferenceKey = "sathishram-sidebar-collapsed";
  let collapsed = localStorage.getItem(preferenceKey) === "true";

  if (!sidebar || !button || !scrim) {
    throw new Error("The course navigation toggle requires its sidebar, button, and scrim.");
  }

  function updateButton() {
    const expanded = mobile.matches ? sidebar.classList.contains("open") : !collapsed;
    const label = mobile.matches
      ? expanded ? "Close course navigation" : "Open course navigation"
      : expanded ? "Collapse course navigation" : "Expand course navigation";
    button.setAttribute("aria-expanded", String(expanded));
    button.classList.toggle("is-collapsed", !expanded);
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  function closeMobileNavigation(returnFocus = false) {
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
    updateButton();
    if (returnFocus) button.focus();
  }

  window.closeCourseNavigation = closeMobileNavigation;

  button.addEventListener("click", () => {
    if (mobile.matches) {
      const open = !sidebar.classList.contains("open");
      sidebar.classList.toggle("open", open);
      scrim.classList.toggle("show", open);
      updateButton();
      if (open) sidebar.querySelector("a, button")?.focus();
      return;
    }

    collapsed = !collapsed;
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    localStorage.setItem(preferenceKey, String(collapsed));
    updateButton();
  });

  scrim.addEventListener("click", () => closeMobileNavigation(true));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobile.matches && sidebar.classList.contains("open")) {
      closeMobileNavigation(true);
    }
  });
  mobile.addEventListener("change", () => {
    closeMobileNavigation();
    updateButton();
  });

  document.body.classList.toggle("sidebar-collapsed", collapsed);
  updateButton();
})();
