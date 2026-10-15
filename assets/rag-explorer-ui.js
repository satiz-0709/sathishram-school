(() => {
  const examples = window.ragTypeExamples || [];
  const container = document.getElementById("path-rag-explorer");
  if (!container || !examples.length) return;
  let active = 0;
  let worker = null;
  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function show(index) {
    active = index;
    const item = examples[index];
    container.replaceChildren();
    const head = create("div", "rag-explorer-heading");
    head.append(create("span", "path-category", "RAG PATTERN LIBRARY"));
    head.append(create("h2", "", "Explore RAG architecture types"));
    head.append(create("p", "", "Choose a pattern to see when it helps, how its flow works, and a runnable miniature example."));
    container.append(head);
    const picker = create("div", "rag-type-grid");
    examples.forEach((example, i) => {
      const button = create("button", `rag-type-button${i === index ? " active" : ""}`, example.name);
      button.type = "button";
      button.setAttribute("aria-pressed", String(i === index));
      button.addEventListener("click", () => show(i));
      picker.append(button);
    });
    container.append(picker);
    const card = create("div", "rag-type-detail");
    const detailHeading = create("div", "rag-type-title");
    detailHeading.append(create("span", "rag-type-group", item.group));
    detailHeading.append(create("h3", "", item.name));
    detailHeading.append(create("p", "", item.use));
    card.append(detailHeading);
    const diagram = create("div", "rag-flow");
    diagram.setAttribute("aria-label", `${item.name} flow`);
    item.stages.forEach((stage, i) => {
      const node = create("div", "rag-flow-node");
      node.append(create("span", "rag-flow-number", String(i + 1).padStart(2, "0")));
      node.append(create("strong", "", stage));
      diagram.append(node);
      if (i < item.stages.length - 1) diagram.append(create("span", "rag-flow-arrow", "→"));
    });
    card.append(diagram);
    const codeSection = create("section", "rag-demo-code");
    const codeHeader = create("div", "rag-demo-code-header");
    const labels = create("div");
    labels.append(create("strong", "", "Runnable mini example"));
    labels.append(create("small", "", "Python · toy data · no model or vector database"));
    codeHeader.append(labels);
    const run = create("button", "rag-run-button", "Run example");
    run.type = "button";
    codeHeader.append(run);
    codeSection.append(codeHeader);
    const pre = create("pre", "rag-demo-pre");
    pre.append(create("code", "", item.code));
    codeSection.append(pre);
    const output = create("pre", "rag-demo-output", "Run the example to see its output.");
    output.setAttribute("aria-live", "polite");
    codeSection.append(output);
    const disclosure = create("p", "rag-demo-disclosure", "This demonstration runs in a browser Python runtime. It illustrates the retrieval pattern with small in-memory data; it does not call an AI provider, read private files, or contact a vector database.");
    codeSection.append(disclosure);
    card.append(codeSection);
    container.append(card);
    run.addEventListener("click", () => {
      run.disabled = true;
      output.textContent = "Loading Python runtime…";
      try {
        worker ||= new Worker("../assets/python-runner-worker.js");
        worker.onmessage = (event) => {
          run.disabled = false;
          output.textContent = event.data.ok ? (event.data.output || "Example finished with no printed output.") : `Could not run this example: ${event.data.error}`;
        };
        worker.onerror = (event) => {
          run.disabled = false;
          output.textContent = `Python runtime could not start: ${event.message || "check that the page is served over HTTP and internet access is available."}`;
        };
        worker.postMessage({ code: item.code });
      } catch (error) {
        run.disabled = false;
        output.textContent = `Python runtime could not start: ${error.message}`;
      }
    });
  }
  window.renderRagExplorer = (isVisible) => {
    container.dataset.active = String(isVisible);
    container.hidden = !isVisible;
    if (isVisible) show(active);
  };
})();
