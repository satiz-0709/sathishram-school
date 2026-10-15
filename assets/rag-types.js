(() => {
  const course = window.learningPaths.rag;
  const lesson = course.lessons.find((item) => item.title === "Types of RAG: architecture patterns");
  lesson.intro = "RAG patterns describe different ways to prepare, retrieve, rank, and validate evidence before generation. Their names overlap: one system can be hybrid, modular, and agentic at the same time. Explore 13 useful patterns and run a tiny local Python example for each.";
  lesson.bullets = [
    "Naive RAG is a one-pass baseline: retrieve relevant chunks, then answer from those chunks.",
    "Advanced patterns improve query handling, retrieval, ranking, context assembly, or answer checks; they should solve a measured failure.",
    "The pattern names are not one universal, exclusive taxonomy. GraphRAG, multimodal, hybrid, agentic, and corrective approaches can be combined.",
    "The demos below use small in-memory examples to show the idea. Production versions need real parsing, retrieval, models, authorization, and evaluation."
  ];
  lesson.code = "# Choose a pattern by the failure you need to solve\nif evidence_is_missing: improve_ingestion_or_retrieval()\nelif evidence_is_found_but_ranked_poorly: rerank_candidates()\nelif question_needs_multiple_steps: use_bounded_agentic_retrieval()\n\nanswer = generate_with_authorized_evidence(question, evidence)";
  lesson.tip = "Start with a measured one-pass baseline, then add only the pattern that addresses an observed failure. Patterns can be combined.";
})();
