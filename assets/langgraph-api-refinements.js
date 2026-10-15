(() => {
  const g = window.learningPaths.langgraph.lessons;
  const react = g.find((item) => item.title === "ToolNode, tools_condition, and the ReAct loop");
  react.title = "create_react_agent, ToolNode, tools_condition, and ReAct";
  react.bullets = [
    "The create_react_agent prebuilt is a compact model/tool loop. It is a version-sensitive API; current LangChain agent guidance favors create_agent for the standard case.",
    "ToolNode plus tools_condition exposes the same ReAct routing so you can add custom nodes and control.",
    "Tools return ToolMessages, and each tool implementation must enforce user authorization."
  ];
  react.code = "from langgraph.prebuilt import create_react_agent\n\n# Compact prebuilt pattern (check version/migration guidance):\nagent = create_react_agent(model, tools)\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Check order 42\"}]})\n\n# Explicit graph pattern for customization:\nfrom langgraph.graph import MessagesState, StateGraph, START\nfrom langgraph.prebuilt import ToolNode, tools_condition\n\nmodel_with_tools = model.bind_tools(tools)\ndef call_model(state: MessagesState):\n    return {\"messages\": [model_with_tools.invoke(state[\"messages\"])]}\n\nbuilder = StateGraph(MessagesState)\nbuilder.add_node(\"agent\", call_model)\nbuilder.add_node(\"tools\", ToolNode(tools))\nbuilder.add_edge(START, \"agent\")\nbuilder.add_conditional_edges(\"agent\", tools_condition)\nbuilder.add_edge(\"tools\", \"agent\")\ncustom_agent = builder.compile()" ;
  const messages = g.find((item) => item.title === "MessagesState and add_messages in practice");
  messages.bullets[1] = "Filter by message type or role when building model context; RemoveMessage deletes one message and REMOVE_ALL_MESSAGES intentionally resets the channel.";
  const persistence = g.find((item) => item.title === "Choose SQLite or PostgreSQL checkpointers");
  persistence.code = `# Install langgraph-checkpoint-sqlite for this backend.
from langgraph.checkpoint.sqlite import SqliteSaver

with SqliteSaver.from_conn_string("./checkpoints.sqlite") as saver:
    app = builder.compile(checkpointer=saver)
    config = {"configurable": {"thread_id": "demo-1"}}
    app.invoke(input_state, config)

# Install langgraph-checkpoint-postgres for a shared service.
from langgraph.checkpoint.postgres import PostgresSaver

with PostgresSaver.from_conn_string(DATABASE_URL) as saver:
    saver.setup()  # required when first creating its tables
    production_app = builder.compile(checkpointer=saver)`;
  const store = g.find((item) => item.title === "Use namespaced Store memory and semantic search");
  store.code = "from langgraph.store.memory import InMemoryStore\n\n# Local example; use an embedding implementation for semantic search.\nmemory = InMemoryStore(index={\"embed\": embeddings, \"dims\": 1536})\nnamespace = (user_id, \"memories\")\nmemory.put(namespace, \"pref-1\", {\"text\": \"Prefers concise replies\"})\nhits = memory.search(namespace, query=\"How should replies be written?\")\n\n# Persistent PostgreSQL store (requires pgvector and setup once):\nfrom langchain.embeddings import init_embeddings\nfrom langgraph.store.postgres import PostgresStore\n\nwith PostgresStore.from_conn_string(\n    DATABASE_URL,\n    index={\"embed\": init_embeddings(\"openai:text-embedding-3-small\"),\n           \"dims\": 1536, \"fields\": [\"text\"]},\n) as persistent_store:\n    persistent_store.setup()\n    persistent_store.put(namespace, \"pref-1\",\n                         {\"text\": \"Prefers concise replies\"})\n    matches = persistent_store.search(\n        namespace, query=\"How should replies be written?\", limit=5\n    )";
  const agents = g.find((item) => item.title === "Supervisor, swarm, and handoff designs");
  agents.code = `from langgraph.types import Command

def researcher(state):
    return Command(goto="writer",
                   update={"research_notes": search_sources(state["task"])})

# Supervisor package pattern:
from langgraph_supervisor import create_supervisor
supervisor = create_supervisor(
    agents=[researcher_agent, writer_agent], model=model
).compile()

# Swarm package pattern:
from langgraph_swarm import create_swarm
swarm = create_swarm(
    [triage_agent, billing_agent], default_active_agent="triage"
).compile()`;
  const deploy = g.find((item) => item.title === "Deploy with langgraph.json, CLI, and SDK");
  deploy.code = `# Create a background run and stream its events:
from langgraph_sdk import get_sync_client
client = get_sync_client(url=DEPLOYMENT_URL, api_key=API_KEY)
thread = client.threads.create()
payload = {"messages": [{"role": "user", "content": "Hi"}]}
run = client.runs.create(thread_id=thread["thread_id"],
                         assistant_id="assistant",
                         input=payload)
for event in client.runs.join_stream(thread["thread_id"],
                                    run["run_id"],
                                    stream_mode="updates"):
    print(event)

# Or create a run and stream it in one call:
# for event in client.runs.stream(thread_id, "assistant", input=payload):
#     print(event)`;
  const ops = g.find((item) => item.title === "Trace, cache, list checkpoints, and manage retention");
  ops.code = `# Set these in the deployment environment, not source control:
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=<secret-from-secret-manager>

# Inspect recent graph snapshots:
snapshots = list(app.get_state_history(config, limit=20))

# Backend-level listing is available on checkpointers too:
recent_checkpoints = list(checkpointer.list(config, limit=20))

# Configure retention/TTL supported by your selected backend;
# cache only deterministic, tenant-scoped reads.`;
  window.learningPaths.langgraph.references.push(
    {label: "PostgresStore API reference", url: "https://reference.langchain.com/python/langgraph.store.postgres/base/PostgresStore"},
    {label: "Prebuilt LangGraph agents", url: "https://reference.langchain.com/python/langgraph/prebuilt"}
  );
})();
