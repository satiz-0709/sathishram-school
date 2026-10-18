window.allAccordionsExpanded = false;
window.curriculumAccordionsExpanded = null;

const lessonSectionNames = {
  "description-content": "Description",
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
  button.querySelector(".section-toggle-label")?.replaceChildren(name);
};
