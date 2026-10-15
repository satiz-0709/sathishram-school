(() => {
  const examples = [
    { name:"Naive / basic RAG", group:"Baseline", use:"A direct question can be answered from one retrieved evidence set.", stages:["Question","Retrieve top chunks","Generate with evidence"], code:`documents = ["foxes live in forests", "whales live in oceans"]
question = "Where do foxes live?"
terms = set(question.lower().replace("?", "").split())
hits = [doc for doc in documents if terms.intersection(doc.split())]
print("Retrieved:", hits[0])` },
    { name:"Advanced RAG", group:"Query improvement", use:"A short or ambiguous query needs rewriting or expansion before retrieval.", stages:["Original query","Rewrite / expand","Retrieve and filter","Grounded answer"], code:`question = "it lives where?"
rewritten = "fox habitat where foxes live"
documents = ["foxes live in forests", "whales live in oceans"]
hits = [doc for doc in documents if "fox" in doc]
print("Rewrite:", rewritten)
print("Evidence:", hits[0])` },
    { name:"Modular RAG", group:"Composable pipelines", use:"A system needs retrieval stages that can be swapped and evaluated independently.", stages:["Parse","Retrieve","Rerank","Generate"], code:`def retrieve(query, docs):
    return [doc for doc in docs if query in doc]
def rerank(query, docs):
    return sorted(docs, key=lambda doc: doc.count(query), reverse=True)
docs = ["cat guide", "cat cat care"]
print(rerank("cat", retrieve("cat", docs)))` },
    { name:"Hybrid RAG", group:"Retrieval", use:"Semantic matching alone or exact keyword search alone misses important documents.", stages:["Keyword search","Vector search","Fuse rankings","Context"], code:`keyword_rank = ["invoice 4821", "invoice policy"]
vector_rank = ["invoice policy", "billing guide"]
combined = list(dict.fromkeys(keyword_rank + vector_rank))
print("Fused candidates:", combined)` },
    { name:"Reranking RAG", group:"Retrieval", use:"The first-stage search finds useful candidates but puts the best evidence too low.", stages:["Retrieve wide set","Score query relevance","Rerank top results","Use best evidence"], code:`query = "refund policy"
candidates = ["refund request steps", "account profile", "policy for refunds"]
ranked = sorted(candidates,
                key=lambda doc: sum(word in doc for word in query.split()),
                reverse=True)
print("Best evidence:", ranked[0])` },
    { name:"Parent-child RAG", group:"Context design", use:"Small chunks retrieve precisely, but need surrounding context to answer correctly.", stages:["Index small children","Match a child","Load parent passage","Answer with context"], code:`parents = {"p1": "Return window is 30 days. Items must be unused."}
children = [("p1", "Return window is 30 days."),
            ("p1", "Items must be unused.")]
matched = children[0]
print("Matched chunk:", matched[1])
print("Expanded context:", parents[matched[0]])` },
    { name:"Hierarchical RAG", group:"Context design", use:"A large collection needs coarse-to-fine search, such as summaries followed by source chunks.", stages:["Collection summaries","Choose relevant group","Search detailed chunks","Cite source"], code:`summaries = {"travel": "Flights, tickets, and baggage", "food": "Recipes and nutrition"}
query = "baggage limit"
section = next(name for name, text in summaries.items()
               if "baggage" in text)
chunks = {"travel": ["Carry-on limit is 8 kg."]}
print(section, "->", chunks[section][0])` },
    { name:"GraphRAG", group:"Structured knowledge", use:"A question depends on entity relationships or multi-hop connections.", stages:["Extract entities","Traverse relationships","Gather linked evidence","Synthesize"], code:`graph = {"Mira": ["Project Cedar"],
         "Project Cedar": ["Oslo office"]}
start = "Mira"
project = graph[start][0]
place = graph[project][0]
print(start, "->", project, "->", place)` },
    { name:"Agentic RAG", group:"Adaptive retrieval", use:"A question may need several searches and the next search depends on earlier evidence.", stages:["Inspect question","Choose search tool","Observe result","Stop or search again"], code:`question = "Compare the two plans"
searches = ["plan A features", "plan B features"]
results = {"plan A features": "Plan A: 5 users",
           "plan B features": "Plan B: 10 users"}
for search in searches:
    print(results[search])` },
    { name:"Corrective RAG (CRAG)", group:"Answer correction", use:"Retrieved evidence may be weak, irrelevant, or incomplete and needs a recovery path.", stages:["Retrieve","Grade evidence","Repair / search again","Answer or abstain"], code:`evidence = ["A source about weather"]
question = "refund deadline"
relevant = any("refund" in item for item in evidence)
if not relevant:
    evidence = ["Refunds are available within 30 days."]
print("Use evidence:", evidence[0])` },
    { name:"Self-RAG / self-reflective RAG", group:"Answer correction", use:"The system should check whether evidence supports its draft and retrieve again when needed.", stages:["Retrieve","Draft with citations","Check support","Revise or abstain"], code:`sources = {"S1": "Returns accepted within 30 days."}
draft = {"claim": "Returns accepted within 30 days.", "source": "S1"}
supported = draft["claim"] in sources[draft["source"]]
print("Supported:", supported)
print("Answer:", draft["claim"] if supported else "Need more evidence")` },
    { name:"Adaptive RAG", group:"Adaptive retrieval", use:"Different queries need different amounts or kinds of retrieval work.", stages:["Classify query","Choose route","Retrieve as needed","Answer"], code:`question = "What is 2 + 2?"
needs_search = "policy" in question or "latest" in question
route = "retrieve" if needs_search else "answer directly"
print("Route:", route)` },
    { name:"Multi-query / query-fusion RAG", group:"Query improvement", use:"One wording misses relevant passages, so related search queries are combined.", stages:["Create query variants","Search each","Fuse unique candidates","Rerank"], code:`queries = ["car hire cost", "rental vehicle price"]
index = {"rental vehicle price": ["Rental costs depend on dates."],
         "car hire cost": ["Daily car hire starts at $40."]}
fused = list(dict.fromkeys(index[queries[0]] + index[queries[1]]))
print("Candidates:", len(fused))` },
    { name:"Multimodal RAG", group:"Data modalities", use:"Evidence includes images, tables, audio, or other non-text content as well as text.", stages:["Parse modalities","Index text + media links","Retrieve evidence","Generate cited response"], code:`evidence = [
    {"kind": "text", "source": "manual.txt", "content": "Reset with button A."},
    {"kind": "image", "source": "panel.png", "content": "button A diagram"},
]
results = [item for item in evidence if "button A" in item["content"]]
print("Matched modalities:", [item["kind"] for item in results])` }
  ];
  window.ragTypeExamples = examples;
})();
