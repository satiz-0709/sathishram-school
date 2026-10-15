window.allAccordionsExpanded = null;
window.curriculumAccordionsExpanded = null;

const lessonSectionNames = {
  "description-content": "The idea",
  "visual-content": "Visual walkthrough",
  "code-content": "Example code",
  "practice-content": "Quick check"
};

window.setLessonSectionExpanded = (button, expanded) => {
  const content = document.getElementById(button.getAttribute("aria-controls"));
  if (!content) return;
  content.hidden = !expanded;
  button.setAttribute("aria-expanded", String(expanded));
  const section = content.closest("section");
  const heading = section?.querySelector(".practice-label, .section-title h2");
  const name = content.id === "practice-content"
    ? "Quick check"
    : heading?.textContent.trim() || lessonSectionNames[content.id] || content.id;
  const label = `${expanded ? "Collapse" : "Expand"} ${name}`;
  button.setAttribute("aria-label", label);
  button.title = label;
};

function setCurriculumAccordions(expanded) {
  window.curriculumAccordionsExpanded = expanded;
  document.querySelectorAll(".chapter, .curriculum-subgroup").forEach((section) => {
    section.classList.toggle("closed", !expanded);
    const button = section.querySelector(".chapter-toggle, .subgroup-toggle");
    if (button) button.setAttribute("aria-expanded", String(expanded));
  });
}

function setAllAccordions(expanded) {
  window.allAccordionsExpanded = expanded;
  setCurriculumAccordions(expanded);
  document.querySelectorAll(".section-collapse-button").forEach((button) => {
    window.setLessonSectionExpanded(button, expanded);
  });
  document.querySelectorAll(".cheat-body").forEach((body) => {
    body.hidden = !expanded;
    const button = body.parentElement.querySelector(".cheat-card-toggle");
    if (button) button.setAttribute("aria-expanded", String(expanded));
  });
  document.querySelectorAll("details.question-item, details.mock-solution").forEach((item) => { item.open = expanded; });
  document.querySelectorAll(".program-solution").forEach((solution) => {
    solution.hidden = !expanded;
    const button = solution.parentElement.querySelector(".program-toggle");
    if (button) {
      button.setAttribute("aria-expanded", String(expanded));
      button.textContent = expanded ? "Hide solution" : "Show solution";
    }
  });
  const toggle = document.getElementById("expand-all-button");
  toggle.querySelector("[data-icon]").innerHTML = schoolIcon(expanded ? "collapse" : "expand");
  toggle.querySelector("span:last-child").textContent = expanded ? "Collapse all" : "Expand all";
  toggle.setAttribute("aria-expanded", String(expanded));
  toggle.setAttribute("aria-label", expanded ? "Collapse all sections" : "Expand all sections");
  toggle.title = expanded ? "Collapse all sections" : "Expand all sections";
}

document.getElementById("expand-all-button").addEventListener("click", () => {
  setAllAccordions(window.allAccordionsExpanded !== true);
});
