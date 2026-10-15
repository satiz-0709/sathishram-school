function buildLessonSimulation(lesson, mode) {
  const title = lesson.title || "Lesson";
  const topic = `${title} ${lesson.chapter || ""} ${lesson.module || ""} ${lesson.summary || ""} ${lesson.intro || ""}`.toLowerCase();
  const codeLines = (lesson.code || "").split("\n").filter((line) => line.trim() && !line.trim().startsWith("#"));
  const codeSample = codeLines.slice(0, 3).join("\n") || title;
  const outputText = (lesson.output || "Done").replace(/\\n/g, " | ");
  const make = (caption, icon, leftLabel, leftValue, rightLabel, rightValue, explanation) => ({ caption, icon, leftLabel, leftValue, rightLabel, rightValue, explanation });
  let scene = "runtime", stages;
  if (mode === "ai") {
    const labels = lesson.visualSteps?.length ? lesson.visualSteps : ["Prepare the input", "Apply the concept", "Inspect the result", "Choose the next action"];
    const icons = ["\uD83C\uDFAF", "\uD83E\uDDED", "\u2699\uFE0F", "\uD83D\uDD0E", "\u2705"];
    const bullets = lesson.bullets || [];
    scene = /rag|retriev|vector|embedding/.test(topic) ? "retrieval" : /agent|tool|graph|workflow|langchain/.test(topic) ? "agent" : /evaluation|eval|quality|test/.test(topic) ? "testing" : /model|llm|token|prompt|fine.?tun/.test(topic) ? "model" : /api|django|fastapi|request|route|endpoint|payload|http/.test(topic) ? "network" : "runtime";
    stages = labels.map((caption, index) => make(
      caption, icons[index % icons.length], index === 0 ? "LESSON INPUT" : `STEP ${index}`,
      index === 0 ? codeSample : labels[index - 1],
      index === labels.length - 1 ? "KEY IDEA" : "NEXT STEP",
      index === labels.length - 1 ? (lesson.tip || "Review the lesson result.") : labels[index + 1],
      bullets[index] || lesson.tip || lesson.intro || "Follow this stage to see how the lesson concept works."
    ));
  } else if (mode === "playwright" && /network|http|request|response/.test(topic)) {
    scene = "network";
    stages = [make("Test code", "\uD83D\uDCBB", "TEST", codeLines[0] || title, "", "", "The test asks the browser or API to do something."), make("Send request", "\uD83D\uDCE4", "REQUEST", "method + URL", "SERVER", "receives request", "A request travels from the test to the server."), make("Server works", "\u2699\uFE0F", "SERVER", "processes request", "DATA", "response is prepared", "The server handles the request and prepares a response."), make("Receive response", "\uD83D\uDCE8", "RESPONSE", "status + data", "TEST", "reads response", "The response returns so the test can inspect it."), make("Check result", "\u2705", "EXPECTED", "what should happen", "ACTUAL", outputText, "The test compares the real response with what it expected.")];
  } else if (mode === "playwright" && /install playwright|browser binaries|installation|project setup|project layout/.test(topic)) {
    scene = "setup";
    stages = [make("Install the Python package", "\uD83D\uDCE6", "TERMINAL", "python -m pip install playwright", "ENVIRONMENT", "Playwright API is available", "The package adds the Playwright Python API to this environment."), make("Download browser engines", "\uD83C\uDF10", "INSTALL COMMAND", "python -m playwright install", "BROWSER FILES", "Chromium / Firefox / WebKit", "Playwright installs compatible browser engines separately from the Python package."), make("Import the API", "\uD83D\uDCDD", "PYTHON TEST", codeLines.find((line) => /playwright/.test(line)) || "from playwright.sync_api import sync_playwright", "API", "ready to call", "The test imports the API it will use to control a browser."), make("Launch a browser", "\u25B6\uFE0F", "PLAYWRIGHT API", "p.chromium.launch()", "BROWSER PROCESS", "engine starts", "A Playwright call starts the installed browser engine."), make("Ready to automate", "\u2705", "TEST", "can create a page", "BROWSER", "ready for instructions", "Now the test can create a page, visit a site, and interact with it.")];
  } else if (mode === "playwright" && /sync|async/.test(topic)) {
    scene = "async";
    stages = [make("Choose the API style", "\uD83D\uDCDD", "PYTHON APP", /async/.test(lesson.code || "") ? "asyncio application" : "regular Python script", "API", /async/.test(lesson.code || "") ? "async_playwright" : "sync_playwright", "Choose sync for a regular script or async when your application already uses asyncio."), make("Start Playwright", "\u2699\uFE0F", "CONTEXT MANAGER", /async/.test(lesson.code || "") ? "async with async_playwright()" : "with sync_playwright()", "DRIVER", "browser API starts", "The context manager starts Playwright and safely manages its driver."), make("Launch and create page", "\uD83C\uDF10", "BROWSER CALL", "chromium.launch()", "PAGE", "new tab created", "The API launches the browser, then creates a page for the test."), make("Make browser calls", "\uD83D\uDC46", "PAGE API", /async/.test(lesson.code || "") ? "await page.goto(...)" : "page.goto(...)" , "EVENT LOOP", /async/.test(lesson.code || "") ? "await yields while waiting" : "call completes before next line", "Async calls use await so the event loop can do other work while the browser responds."), make("Read result and close", "\u2705", "PAGE RESULT", outputText, "CLEANUP", "browser closes", "The test reads the result and closes the browser it launched.")];
  } else if (mode === "playwright" && /launch|browser context|what is playwright|browser lifecycle|page & browser|compared with other tools/.test(topic)) {
    scene = "lifecycle";
    stages = [make("Start Playwright", "\uD83D\uDCDD", "PYTHON CODE", codeLines.find((line) => /sync_playwright|async_playwright/.test(line)) || "with sync_playwright() as p", "DRIVER", "Playwright starts", "Your Python test calls Playwright's context manager to start the automation driver."), make("Launch a browser engine", "\uD83C\uDF10", "PLAYWRIGHT OBJECT", "p.chromium.launch()", "BROWSER PROCESS", "Chromium opens", "The test calls launch on Playwright. Playwright starts the selected browser engine."), make("Create an isolated context", "\uD83D\uDD12", "BROWSER", "browser.new_context()", "BROWSER CONTEXT", "fresh cookies + storage", "A context is a clean, isolated browser session for this test."), make("Open a page", "\uD83D\uDCC4", "CONTEXT", "context.new_page()", "PAGE / TAB", "website can load here", "A page is a tab inside that context. The test makes page calls through Playwright."), make("Navigate and observe", "\uD83D\uDC46", "PAGE API", "page.goto(url)", "WEB PAGE", outputText, "The page call makes the browser navigate; the test can then inspect the rendered page."), make("Close in order", "\uD83D\uDCE6", "CONTEXT", "context.close()", "BROWSER", "browser.close()", "The test closes its context and browser to release resources.")];
  } else if (mode === "playwright" && /action|click|fill|keyboard|mouse|drag|hover|checkbox|dropdown|form|dialog|alert|prompt|pagination/.test(topic)) {
    scene = "action";
    stages = [make("Test calls a Playwright method", "\uD83D\uDCDD", "PYTHON TEST", codeLines.find((line) => /click|fill|press|check|hover|drag|select/.test(line)) || codeLines[0] || title, "PLAYWRIGHT API", "receives the call", "The test does not reach into the page directly. It calls a Playwright method."), make("Resolve the locator", "\uD83D\uDD0E", "LOCATOR", "get_by_role(...) or locator(...) ", "PAGE DOM", "matching element found", "Playwright uses the locator to find the intended element in the page."), make("Wait and check", "\u23F3", "ACTIONABILITY", "unique, visible, stable, enabled", "ELEMENT", "ready to receive input", "Before acting, Playwright waits for the element to be ready and not covered."), make("Send browser input", "\uD83D\uDC46", "PLAYWRIGHT", /fill|type|keyboard/.test(topic) ? "types text / key events" : /hover|mouse/.test(topic) ? "moves the mouse" : "sends a click", "BROWSER", "input reaches page", "Playwright sends input to the browser, like a person using the page."), make("Page reacts", "\uD83C\uDF10", "WEB PAGE", "handles the user action", "NEW STATE", outputText, "The page handles the input and updates what the user can see."), make("Check the result", "\u2705", "EXPECT", "expected page state", "OBSERVED", outputText, "The test checks the visible outcome so it knows the action worked.")];
  } else if (mode === "playwright" && /assert|expect|verification|screenshot/.test(topic)) {
    scene = "assertion";
    stages = [make("Choose expected behavior", "\uD83D\uDCDD", "TEST EXPECTS", title, "TARGET", "visible page state", "The test says what the person should see or what value should be true."), make("Read the live page", "\uD83D\uDD0E", "LOCATOR", "find the page element", "BROWSER", "current state", "Playwright reads the current state of the rendered page."), make("Retry the check", "\u23F3", "EXPECT API", "to_be_visible / to_have_text", "PAGE", "checked until timeout", "Web-first expect checks again while the page is changing, until it passes or times out."), make("Compare outcome", "\u2696\uFE0F", "EXPECTED", "what test asked for", "ACTUAL", outputText, "The assertion compares the expected state with what the browser actually shows."), make("Report pass or fail", "\u2705", "ASSERTION", "match or mismatch", "TEST RESULT", /fail|error/.test(outputText.toLowerCase()) ? "failure reported" : "passed", "The test reports a clear pass or a useful failure when the values differ.")];
  } else if (mode === "playwright" && /locator|find element|selector|strict mode|tooltip|extraction|shadow dom/.test(topic)) {
    scene = "locator";
    stages = [make("Describe the target", "\uD83D\uDCDD", "TEST CODE", codeLines.find((line) => /get_by|locator/.test(line)) || title, "LOCATOR", "a reusable description", "The test describes the control it wants instead of saving a fragile screen position."), make("Ask the page", "\uD83D\uDD0E", "PLAYWRIGHT API", "get_by_role / get_by_label", "PAGE DOM", "searches rendered elements", "Playwright searches the page for an element matching the locator."), make("Wait for a match", "\u23F3", "LOCATOR", "re-check while page updates", "MATCHES", "one element is ready", "A locator can wait and retry as the page changes."), make("Resolve ambiguity", "\u2696\uFE0F", "MATCH COUNT", "strict action needs one", "TARGET", "unique control", "If several controls match, strict mode asks the test to make its locator more precise."), make("Use the element", "\uD83D\uDC46", "ACTION", "click / read / fill", "PAGE", outputText, "The action or assertion runs against the matched element.")];
  } else if (mode === "playwright" && /navigation|wait|timeout|back|forward|page event/.test(topic)) {
    scene = "navigation";
    stages = [make("Ask the page to navigate", "\uD83D\uDCDD", "TEST CODE", codeLines.find((line) => /goto|go_back|go_forward|wait/.test(line)) || title, "PAGE API", "receives navigation call", "The test calls a navigation method on its Playwright Page object."), make("Browser starts navigation", "\uD83C\uDF10", "BROWSER", "requests the new address", "NETWORK", "page begins loading", "The browser makes the request and starts loading the new document."), make("Wait for the right state", "\u23F3", "WAIT", "load state or expected element", "PAGE", "condition becomes true", "Playwright waits for a specific page state instead of sleeping for an arbitrary time."), make("Page becomes ready", "\uD83D\uDC40", "DOCUMENT", "content is rendered", "LOCATORS", "can find new elements", "The page reaches the state the test needs."), make("Continue the test", "\u2705", "NEXT ACTION", "use page or locator", "RESULT", outputText, "The test continues after the expected navigation condition is met.")];
  } else if (mode === "playwright" && /first browser test|pytest|fixture|hook|test anatomy|browser matrix|parallel|\bci\b|continuous integration/.test(topic)) {
    scene = "testing";
    stages = [make("Prepare an isolated page", "\uD83D\uDCCB", "PYTEST FIXTURE", "page", "CONTEXT", "fresh test session", "Pytest provides a page fixture backed by an isolated browser context."), make("Arrange the page", "\uD83C\uDF10", "PAGE FIXTURE", codeLines.find((line) => /goto/.test(line)) || "page.goto(url)", "BROWSER", "site is open", "The test uses its page object to open the site or set up starting state."), make("Act like a person", "\uD83D\uDC46", "LOCATOR ACTION", codeLines.find((line) => /click|fill|check|press/.test(line)) || "click or fill a control", "PAGE", "user action occurs", "The test asks Playwright to interact with a user-facing control."), make("Check what changed", "\u2705", "EXPECT", "visible expected behavior", "PAGE", outputText, "The assertion checks the browser behavior the user cares about."), make("Clean up", "\uD83E\uDDF9", "PYTEST", "test finishes", "BROWSER CONTEXT", "closed automatically", "The fixture manages its browser resources and isolates the next test.")];
  } else if (mode === "playwright" && /frame|popup|multiple tabs|window|download/.test(topic)) {
    scene = "frames";
    stages = [make("Trigger browser behavior", "\uD83D\uDCDD", "PAGE ACTION", codeLines.find((line) => /click|expect_popup|expect_download|frame/.test(line)) || title, "BROWSER", "event begins", "The test starts the user action that opens a frame, tab, download, or component."), make("Browser creates target", "\uD83C\uDF10", "BROWSER", "new frame or page appears", "EVENT", "target is announced", "The browser reports the new page, frame, or download event."), make("Wait for the event", "\u23F3", "EXPECT EVENT", "expect_popup / expect_download", "PLAYWRIGHT", "captures target", "The test starts waiting before the action so it does not miss the event."), make("Work with target", "\uD83D\uDD0E", "FRAME LOCATOR / PAGE", "find content in target", "ELEMENT", "target is accessible", "Playwright scopes work to the correct frame or newly opened page."), make("Verify the outcome", "\u2705", "ASSERTION", "expected content or file", "RESULT", outputText, "The test checks the new target or downloaded file." )];
  } else if (mode === "playwright" && /authentication|storage state|login|session/.test(topic)) {
    scene = "auth";
    stages = [make("Sign in once", "\uD83D\uDD11", "LOGIN PAGE", "enter test account", "WEB APP", "checks credentials", "A setup step signs in using a dedicated test account."), make("Save browser state", "\uD83D\uDCE6", "BROWSER CONTEXT", "cookies + local storage", "STORAGE STATE", "saved to file", "Playwright saves the authenticated session state for reuse."), make("Create a fresh test context", "\uD83D\uDD12", "STORAGE STATE", "load saved session", "NEW CONTEXT", "starts signed in", "A new isolated context can start with that saved state."), make("Visit protected page", "\uD83C\uDF10", "PAGE API", "page.goto(protected_url)", "WEB APP", "recognizes session", "The browser sends its stored session data with the page request."), make("Check access", "\u2705", "EXPECT", "account page visible", "RESULT", outputText, "The test confirms the signed-in user can reach the protected page.")];
  } else if (mode === "playwright" && /codegen|record|replay/.test(topic)) {
    scene = "codegen";
    stages = [make("Open the recorder", "\uD83D\uDCDD", "PLAYWRIGHT CODEGEN", "choose browser + URL", "BROWSER", "page opens", "Codegen opens a browser and watches the actions you perform."), make("Perform user actions", "\uD83D\uDC46", "BROWSER", "click / fill / navigate", "RECORDER", "observes behavior", "The recorder watches real interactions in the browser."), make("Build locators", "\uD83D\uDD0E", "RECORDER", "identify controls", "PYTHON CODE", "actions are written", "Codegen turns observed actions into Playwright calls and locators."), make("Review the test", "\uD83D\uDD0D", "GENERATED CODE", codeSample, "DEVELOPER", "checks quality", "Generated code is a starting point; a person reviews and improves its locators and assertions."), make("Replay and verify", "\u2705", "PYTHON TEST", "run generated steps", "BROWSER", outputText, "Run the reviewed code again and add checks for the expected behavior.")];
  } else if (mode === "playwright") {
    scene = "browser";
    stages = [make("Test instruction", "\uD83D\uDCBB", "TEST CODE", codeLines[0] || title, "", "", "The test gives the browser one clear instruction."), make("Find the page element", "\uD83D\uDD0E", "LOCATOR", /role|text|label|placeholder|test.?id/i.test(title) ? "find by what a person sees" : "find the matching button or field", "PAGE", "matching element", "A locator is a set of directions for finding an element on the page."), make("Check it is ready", "\uD83D\uDC40", "BROWSER", "waits until it can act", "ELEMENT", "ready for action", "Playwright checks that the element is ready before continuing."), make("Act on the page", "\uD83D\uDC46", "ACTION", /fill|form|input/i.test(topic) ? "type into the field" : /navigation|back|forward|tab|popup/i.test(topic) ? "move to the requested page" : "click or interact", "PAGE", "page changes", "The browser performs the action like a person would."), make("Verify the result", "\u2705", "EXPECT", "the expected page state", "OBSERVED", outputText, "The test checks what the user can now see.")];
  } else if (/your first steps|syntax, comments|print\(|interpreter|how python works/.test(topic)) {
    scene = "interpreter";
    stages = [make("Write Python", "\uD83D\uDCDD", "SOURCE CODE", codeSample, "", "", "You write Python instructions in a human-readable language."), make("Read the instructions", "\uD83D\uDD0D", "PARSER", "checks words and structure", "VALID?", "yes, continue", "Python first checks that the code is written in a form it understands."), make("Compile to bytecode", "\u2699\uFE0F", "CPYTHON COMPILER", "Python source code", "BYTECODE", "LOAD  /  CALL  /  RETURN", "CPython compiles the source into bytecode: small instructions for the Python virtual machine. This is not a direct translation into CPU machine language."), make("Run the instructions", "\uD83D\uDCBB", "CPYTHON VIRTUAL MACHINE", "reads one bytecode instruction", "OPERATION", "calls print with the text", "The Python virtual machine carries out the bytecode operations in order."), make("Show the output", "\uD83D\uDCE4", "OUTPUT", outputText, "SCREEN", "text appears", "The operation finishes, and print sends the text to the output.")];
  } else if (/string|text|format|convert|transform/.test(topic)) {
    scene = "text";
    stages = [make("Start with text", "\uD83D\uDCDD", "INPUT TEXT", /["']([^"']+)["']/.exec(lesson.code || "")?.[1] || "your words", "STRING", "text value", "A string is text stored as a value in the program."), make("Choose a text operation", "\u2699\uFE0F", "METHOD", /upper|lower/.test(lesson.code || "") ? "change letter case" : /strip/.test(lesson.code || "") ? "remove outside spaces" : /format|f\"|f'/.test(lesson.code || "") ? "put values into a message" : "change or combine text", "ORIGINAL", "stays unchanged", "String operations make a new result; the original text value is not changed in place."), make("Build new text", "\uD83E\uDDF5", "TRANSFORM", "apply the chosen rule", "NEW STRING", "result is created", "Python makes a new string with the transformed text."), make("Use the new value", "\uD83D\uDCE6", "NEW VALUE", outputText, "NAME", "save or pass it on", "The program can store the new string under a name or pass it to another operation."), make("Show the text", "\uD83D\uDCE4", "OUTPUT", outputText, "SCREEN", "words appear", "Printing displays the resulting text.")];
  } else if (/variables|variable|naming|value|types|numbers|arithmetic/.test(topic)) {
    scene = /arithmetic|numbers/.test(topic) ? "arithmetic" : "memory";
    if (scene === "arithmetic") stages = [make("Read the expression", "\uD83D\uDCDD", "CODE", codeLines[0] || title, "", "", "Python reads the numbers and the operation symbol."), make("Load the values", "\uD83E\uDDE0", "VALUE A", "number from code", "VALUE B", "number from code", "Each number is available to the operation."), make("Do the operation", "\u2699\uFE0F", "OPERATOR", /\*/.test(lesson.code || "") ? "multiply" : /\//.test(lesson.code || "") ? "divide" : /-/.test(lesson.code || "") ? "subtract" : "add", "CALCULATION", "combine the values", "Python applies the operator to the values."), make("Save the answer", "\uD83D\uDCE6", "RESULT", "calculated value", "NAME", "stored if assigned", "If the code assigns the answer, Python connects its name to the new value."), make("Display the answer", "\uD83D\uDCE4", "OUTPUT", outputText, "SCREEN", "result appears", "The final value is shown when the code prints it.")];
    else stages = [make("Run the assignment", "\uD83D\uDCDD", "PYTHON CODE", codeSample, "", "", "The assignment tells Python to connect a name with a value."), make("Create the name", "\uD83C\uDFF7\uFE0F", "NAME TABLE", ((/\w+/.exec(codeLines[0] || "fruit")?.[0] || "fruit") + " -> @0x01"), "POINTS TO", "a value in memory", "Python records the variable name so the program can find its value again."), make("Store the value", "\uD83E\uDCE5", "HEAP MEMORY BOX", "object @0x01", "VALUE", /[\"']([^\"']+)[\"']/.exec(lesson.code || "")?.[1] || "the assigned value", "The value lives as an object in memory. The name points to that object; it is not the box itself."), make("Look up the name", "\uD83D\uDD0E", "ASK FOR", /\w+/.exec(codeLines[0] || "fruit")?.[0] || "the variable", "NAME TABLE", "finds its value", "When code asks for the name, Python follows the name table to the stored object."), make("Use or display it", "\uD83D\uDCE4", "FETCHED VALUE", /[\"']([^\"']+)[\"']/.exec(lesson.code || "")?.[1] || outputText, "OUTPUT", outputText, "Python fetches the value and uses it, for example by displaying it.")];
  } else if (/if |condition|boolean|comparison|decision/.test(topic)) {
    scene = "decision";
    stages = [make("Read the condition", "\uD83D\uDCDD", "QUESTION", codeLines.find((line) => /if |elif/.test(line)) || title, "", "", "The condition is a question that can be true or false."), make("Compare values", "\u2696\uFE0F", "LEFT SIDE", "current value", "RIGHT SIDE", "value to compare", "Python compares the two sides of the condition."), make("Choose a path", "\uD83D\uDEE4\uFE0F", "TRUE PATH", "run this branch", "FALSE PATH", "skip or try another branch", "Only the branch that matches the answer is taken."), make("Run that branch", "\u27A1\uFE0F", "CHOSEN CODE", "matching instructions", "OTHER CODE", "not run", "Python continues with the instructions on the chosen path."), make("See the result", "\u2705", "OUTPUT", outputText, "RESULT", "condition handled", "The selected path determines what the program does next.")];
  } else if (/loop|iteration|generator|iterator|comprehension/.test(topic)) {
    scene = "loop";
    stages = [make("Get the items", "\uD83E\uDDFA", "ITERABLE", "items waiting", "NEXT ITEM", "ready", "A loop starts with a group or stream of items to visit."), make("Take one item", "\uD83D\uCE26", "CURRENT ITEM", "item 1", "LOOP NAME", "holds this item", "The loop puts one item into its loop variable."), make("Run the loop body", "\u2699\uFE0F", "INSTRUCTIONS", codeLines.find((line) => /print|append|yield|=/.test(line)) || title, "CURRENT ITEM", "used here", "The indented body runs once for the current item."), make("Move to the next", "\u27F3", "NEXT ITEM", "item 2, then item 3...", "SAME BODY", "runs again", "Python repeats the body for each next item."), make("Finish the loop", "\u2705", "MORE ITEMS?", "no", "PROGRAM", "continues after loop", "When there are no more items, the loop stops." )];
  } else if (/function|scope|parameter|return|lambda|map|filter|decorator/.test(topic)) {
    scene = "function";
    stages = [make("Define the recipe", "\uD83D\uDCD6", "FUNCTION NAME", /def\s+(\w+)/.exec(lesson.code || "")?.[1] || title, "BODY", "saved instructions", "A function gives a reusable group of instructions a name."), make("Call the function", "\uD83D\uDC49", "CALL", codeLines.find((line) => /\w+\s*\(/.test(line)) || "function(arguments)", "INPUTS", "arguments sent in", "Calling a function starts its instructions and passes in any arguments."), make("Make a local workspace", "\uD83D\uDCCB", "PARAMETERS", "receive input values", "LOCAL NAMES", "live in this call", "The function gets its own temporary names while it runs."), make("Do the work", "\u2699\uFE0F", "BODY", "instructions run in order", "RESULT", "value is prepared", "The function body performs its job."), make("Return to caller", "\uD83D\uDCE4", "RETURN VALUE", outputText, "CALLER", "gets the result", "Return sends a value back to the code that called the function.")];
  } else if (/list|tuple|dictionary|dict|set|collection/.test(topic)) {
    scene = "collection";
    stages = [make("Create a container", "\uD83E\uDDFA", "COLLECTION", title, "ITEMS", "values stored together", "A collection keeps several values together under one name."), make("Put values inside", "\uD83C\uDF4E", "NEW ITEM", "one value", "CONTAINER", "item added", "The program adds each value to the collection."), make("Find a value", "\uD83D\uDD0E", /dict|dictionary/.test(topic) ? "KEY" : "INDEX", /dict|dictionary/.test(topic) ? "name or key" : "position number", "COLLECTION", "finds matching item", "Python uses a key or position to find the value you ask for."), make("Change or filter", "\u2699\uFE0F", "RULE", "what to keep or update", "VALUES", "collection changes", "The code can update, remove, or select values in the collection."), make("Use the result", "\uD83D\uDCE4", "RESULT", outputText, "OUTPUT", "items displayed", "The program uses or displays the collection values.")];
  } else if (/module|import|package/.test(topic)) {
    scene = "module";
    stages = [make("Keep code in a file", "\uD83D\uDCC4", "MODULE FILE", title, "CODE", "reusable instructions", "A module is a Python file that stores code we may want to use again."), make("Import the module", "\uD83D\uDCE5", "IMPORT", codeLines.find((line) => /import|from/.test(line)) || "import module", "PROGRAM", "can use its names", "Importing makes selected names from the module available here."), make("Find the name", "\uD83D\uDD0E", "NAMESPACE", "module.name", "DEFINITION", "Python locates it", "Python looks up the requested function, class, or value in the imported module."), make("Use the code", "\u2699\uFE0F", "FUNCTION OR VALUE", "reusable code", "PROGRAM", "uses it here", "The program calls or reads the imported code."), make("See the result", "\u2705", "OUTPUT", outputText, "RESULT", "work is complete", "The imported code does its job and returns control to the program.")];
  } else if (/test|debug|pytest|assert|trace|flak|reliable automation|delivery/.test(topic)) {
    scene = "testing";
    stages = [make("Write the check", "\uD83D\uDCDD", "TEST", codeSample, "EXPECT", "a known result", "A test describes what should happen for a chosen example."), make("Run the code", "\u25B6\uFE0F", "PROGRAM", "runs with test input", "ACTUAL", "result produced", "The test runs the real code with the example input."), make("Compare results", "\u2696\uFE0F", "EXPECTED", "what should happen", "ACTUAL", outputText, "An assertion compares the result with what the test expected."), make("Report the check", "\uD83D\uDCCA", "COMPARISON", "values match or differ", "TEST STATUS", /fail|error/.test(outputText.toLowerCase()) ? "failed" : "passed", "A passing check gives confidence; a failing check points to something to investigate."), make("Fix or continue", "\u2705", "NEXT STEP", "inspect or keep coding", "PROGRAM", "clear feedback", "The result helps a person decide what to fix or build next.")];
  } else if (/agent|tool use|ai /.test(topic)) {
    scene = "agent";
    stages = [make("Receive a goal", "\uD83C\uDFAF", "GOAL", title, "TASK", "what needs doing", "An agent starts with a goal and the limits it must follow."), make("Make a plan", "\uD83D\uDCCB", "PLAN", "small safe steps", "TOOLS", "allowed actions only", "The agent chooses a short plan using only permitted tools."), make("Use a tool", "\uD83D\uDEE0\uFE0F", "TOOL INPUT", "checked task data", "TOOL RESULT", "information returned", "The tool performs one requested action and returns information."), make("Check the result", "\uD83D\uDC40", "OBSERVATION", outputText, "GOAL", "compare with request", "The agent checks whether the result matches the original goal."), make("Respond safely", "\u2705", "FINAL ANSWER", outputText, "USER", "gets the result", "The agent reports what it found and avoids claiming work it did not do.")];
  } else if (/async|concurr|parallel/.test(topic)) {
    scene = "async";
    stages = [make("Start a task", "\uD83D\uDCDD", "COROUTINE", "task is prepared", "EVENT LOOP", "ready to schedule", "An async function describes work that can pause while it waits."), make("Schedule work", "\uD83D\uDCCB", "EVENT LOOP", "chooses a ready task", "TASKS", "take turns", "The event loop lets ready tasks make progress without blocking on waiting."), make("Pause while waiting", "\u23F3", "TASK A", "waiting for I/O", "TASK B", "can keep working", "When one task waits for a response, another task can run."), make("Resume with result", "\uD83D\uDCE8", "RESPONSE", "data arrives", "TASK A", "continues", "The waiting task resumes when its awaited result is ready."), make("Finish the work", "\u2705", "TASK RESULTS", outputText, "PROGRAM", "continues", "The program gathers the completed work and moves on.")];
  } else if (/class|object|inherit|property|dataclass|polymorph/.test(topic)) {
    scene = "object";
    stages = [make("Describe a class", "\uD83D\uDCCB", "CLASS", /class\s+(\w+)/.exec(lesson.code || "")?.[1] || title, "BLUEPRINT", "fields and behavior", "A class describes what its objects can store and do."), make("Make an instance", "\u2692\uFE0F", "BLUEPRINT", "class description", "NEW OBJECT", "instance created", "Creating an instance makes a real object from the class blueprint."), make("Store its own values", "\uD83D\uDCE6", "OBJECT", "instance in memory", "ATTRIBUTES", "this object's data", "Each instance stores its own attribute values."), make("Use its behavior", "\u2699\uFE0F", "METHOD CALL", "object.method()", "OBJECT", "responds using its data", "A method is behavior that works with the object."), make("Observe the result", "\u2728", "OBJECT RESULT", outputText, "PROGRAM", "continues", "The object produces a result or changes its own state.")];
  } else if (/exception|error|file|context manager|resource/.test(topic)) {
    scene = "safety";
    stages = [make("Start the operation", "\uD83D\uDCDD", "TRY", codeLines[0] || title, "RESOURCE", "opened or used", "The program begins an operation that could fail."), make("Watch for trouble", "\uD83D\uDC40", "OPERATION", "runs", "ERROR?", "check what happens", "Python watches for an error while the operation runs."), make("Handle the problem", "\u26A0\uFE0F", "ERROR", "caught safely", "HANDLER", "responds", "A handler catches the problem and gives the program a safe response."), make("Clean up", "\uD83E\uDDF9", "RESOURCE", "closed safely", "PROGRAM", "keeps going", "A context manager cleans up resources even when something goes wrong."), make("Finish clearly", "\u2705", "OUTCOME", outputText, "USER", "gets a clear result", "The program ends the operation with a useful outcome.")];
  } else {
    scene = mode === "playwright" ? "browser" : "runtime";
    stages = [make("Read the code", "\uD83D\uDCDD", "SOURCE", codeSample, "", "", lesson.analogy || "The program starts with the instructions you wrote."), make("Prepare the operation", "\u2699\uFE0F", "INPUT", "lesson values", "PROCESS", "concept is applied", "Python reads the inputs and prepares the operation."), make("Carry out the steps", "\uD83D\uDCBB", "RUNTIME", title, "CURRENT STEP", "running", "The runtime applies this lesson's idea one step at a time."), make("Create a result", "\uD83D\uDCE6", "RESULT", outputText, "VALUE", "ready to use", "The operation creates a value or change that the program can use."), make("Show what happened", "\uD83D\uDCE4", "OUTPUT", outputText, "SCREEN", "result appears", "The final result is shown so a person can see what happened.")];
  }
  const root = document.createElement("section"); root.className = "lesson-simulation process-simulation"; root.dataset.scene = scene; root.setAttribute("aria-label", `${title} step-by-step visual explanation`);
  const heading = document.createElement("div"); heading.className = "process-heading";
  const headingLabel = document.createElement("strong"); headingLabel.textContent = mode === "playwright" ? "WATCH THE TEST WORK" : mode === "ai" ? "WATCH THE CONCEPT WORK" : "WATCH THE CODE WORK";
  const headingTitle = document.createElement("span"); headingTitle.textContent = title; heading.append(headingLabel, headingTitle); root.appendChild(heading);
  const source = document.createElement("div"); source.className = "process-source"; const sourceLabel = document.createElement("small"); sourceLabel.textContent = mode === "playwright" ? "PYTHON TEST CODE" : mode === "ai" ? "LESSON EXAMPLE" : "PYTHON SOURCE CODE"; const sourceCode = document.createElement("code"); sourceCode.textContent = codeSample; source.append(sourceLabel, sourceCode); root.appendChild(source);
  const rail = document.createElement("div"); rail.className = "process-rail";
  const stations = stages.map((stage, index) => {
    const station = document.createElement("div"); station.className = "process-station"; station.dataset.index = String(index);
    const icon = document.createElement("span"); icon.className = "process-icon"; icon.textContent = stage.icon;
    const name = document.createElement("strong"); name.textContent = stage.caption;
    const hint = document.createElement("small"); hint.textContent = stage.leftLabel;
    station.append(icon, name, hint); rail.appendChild(station);
    if (index < stages.length - 1) { const connector = document.createElement("span"); connector.className = "process-connector"; connector.textContent = "\u2192"; rail.appendChild(connector); }
    return station;
  });
  root.appendChild(rail);
  const traveler = document.createElement("span"); traveler.className = "process-traveler"; traveler.setAttribute("aria-hidden", "true"); rail.appendChild(traveler);
  let browserState = null;
  if (mode === "playwright" && scene !== "network") {
    const browserScene = document.createElement("div"); browserScene.className = "pw-browser-scene";
    const browserTop = document.createElement("div"); browserTop.className = "pw-browser-top";
    const browserDots = document.createElement("span"); browserDots.className = "pw-browser-dots"; browserDots.innerHTML = "<i></i><i></i><i></i>";
    const tab = document.createElement("strong"); tab.textContent = "Playwright test browser"; browserTop.append(browserDots, tab);
    const address = document.createElement("div"); address.className = "pw-address"; address.innerHTML = '<span class="pw-lock">&#9679;</span><span>https://demo.local</span><small>SIMULATED PAGE</small>';
    const page = document.createElement("div"); page.className = "pw-page";
    const nav = document.createElement("div"); nav.className = "pw-page-nav"; const brand = document.createElement("strong"); brand.textContent = /shop|cart|product|checkout/.test(topic) ? "Little Shop" : /login|auth|account/.test(topic) ? "Your Account" : "Example App"; const navLink = document.createElement("span"); navLink.textContent = "Home     Help"; nav.append(brand, navLink);
    const card = document.createElement("div"); card.className = "pw-page-card"; const pageTitle = document.createElement("h3"); pageTitle.textContent = /login|auth|account/.test(topic) ? "Welcome back" : /shop|cart|product|checkout/.test(topic) ? "Fresh picks for you" : "A page ready for your test"; const pageText = document.createElement("p"); pageText.textContent = /login|auth|account/.test(topic) ? "Sign in to continue to your account." : /shop|cart|product|checkout/.test(topic) ? "Choose an item and add it to your basket." : "The browser has rendered this page. Your test can find and use its controls.";
    const form = document.createElement("div"); form.className = "pw-page-form"; const input = document.createElement("span"); input.className = "pw-page-input"; input.textContent = /login|auth|account/.test(topic) ? "Email address" : /search|pagination/.test(topic) ? "Search items" : "Name or email"; const action = document.createElement("span"); action.className = "pw-page-action"; action.textContent = /login|auth|account/.test(topic) ? "Sign in" : /shop|cart|product|checkout/.test(topic) ? "Add to basket" : /search|pagination/.test(topic) ? "Search" : /fill|form|input/.test(topic) ? "Submit" : "Save"; const status = document.createElement("small"); status.className = "pw-page-status"; status.textContent = "Waiting for the test..."; form.append(input, action, status); card.append(pageTitle, pageText, form); page.append(nav, card);
    const pointer = document.createElement("span"); pointer.className = "pw-pointer"; pointer.textContent = "\uD83D\uDDB1"; browserScene.append(browserTop, address, page, pointer); root.appendChild(browserScene); browserState = { root: browserScene, status, action };
  } else if (mode === "playwright" && scene === "network") {
    const apiScene = document.createElement("div"); apiScene.className = "pw-api-scene";
    const client = document.createElement("div"); client.className = "pw-api-node pw-api-client"; const clientIcon = document.createElement("span"); clientIcon.textContent = "\uD83D\uDCBB"; const clientTitle = document.createElement("strong"); clientTitle.textContent = "Python test"; const clientCode = document.createElement("code"); clientCode.textContent = codeLines.find((line) => /\.get|\.post|\.put|\.delete|APIRequestContext/.test(line)) || "request.get(url)"; client.append(clientIcon, clientTitle, clientCode);
    const request = document.createElement("div"); request.className = "pw-api-request";
    const apiCall = /(?:request|api_request_context|page\.request)\.(get|post|put|delete|patch)\s*\(\s*["'']([^"'']+)/i.exec(lesson.code || "");
    const requestLabel = document.createElement("small"); requestLabel.textContent = apiCall ? `${apiCall[1].toUpperCase()} ${apiCall[2]}` : "GET /api/items";
    const requestName = document.createElement("span"); requestName.textContent = "REQUEST";
    const sendArrow = document.createElement("i"); sendArrow.textContent = "\u2192";
    const receiveArrow = document.createElement("i"); receiveArrow.textContent = "\u2190";
    const responseName = document.createElement("span"); responseName.textContent = "RESPONSE";
    request.append(requestName, sendArrow, requestLabel, receiveArrow, responseName);
    const server = document.createElement("div"); server.className = "pw-api-node pw-api-server"; const serverIcon = document.createElement("span"); serverIcon.textContent = "\uD83D\uDDA5\uFE0F"; const serverTitle = document.createElement("strong"); serverTitle.textContent = "API server"; const serverCode = document.createElement("code"); serverCode.textContent = "checks request, returns status + data"; server.append(serverIcon, serverTitle, serverCode);
    const apiResult = document.createElement("div"); apiResult.className = "pw-api-result"; apiResult.textContent = `Response received: ${outputText}`; apiScene.append(client, request, server, apiResult); root.appendChild(apiScene); browserState = { root: apiScene, status: apiResult, action: null };
  }
  const detail = document.createElement("div"); detail.className = "process-detail";
  const detailHead = document.createElement("div"); detailHead.className = "process-detail-head";
  const activeIcon = document.createElement("span"); activeIcon.className = "process-active-icon";
  const activeTitle = document.createElement("strong"); activeTitle.className = "process-active-title"; detailHead.append(activeIcon, activeTitle);
  const memory = document.createElement("div"); memory.className = "process-memory";
  const leftBox = document.createElement("div"); leftBox.className = "process-memory-box"; const leftLabel = document.createElement("small"); const leftValue = document.createElement("strong"); leftBox.append(leftLabel, leftValue);
  const arrow = document.createElement("span"); arrow.className = "process-memory-arrow"; arrow.textContent = "\u2192";
  const rightBox = document.createElement("div"); rightBox.className = "process-memory-box process-memory-result"; const rightLabel = document.createElement("small"); const rightValue = document.createElement("strong"); rightBox.append(rightLabel, rightValue); memory.append(leftBox, arrow, rightBox);
  const explanation = document.createElement("p"); explanation.className = "process-explanation"; explanation.setAttribute("aria-live", "polite"); detail.append(detailHead, memory, explanation); root.appendChild(detail);
  const timeline = document.createElement("div"); timeline.className = "process-timeline";
  const buttons = stages.map((stage, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "simulation-step"; button.dataset.index = String(index); button.dataset.title = stage.caption; button.dataset.detail = stage.explanation; button.setAttribute("aria-label", `Show stage ${index + 1}: ${stage.caption}`); button.setAttribute("aria-pressed", "false"); button.textContent = String(index + 1); timeline.appendChild(button); return button; }); root.appendChild(timeline);
  const values = stages.map((stage) => stage.explanation);
  root.updateStep = (index) => { const stage = stages[index]; activeIcon.textContent = stage.icon; activeTitle.textContent = `Step ${index + 1}: ${stage.caption}`; leftLabel.textContent = stage.leftLabel; leftValue.textContent = stage.leftValue; rightLabel.textContent = stage.rightLabel || "NEXT"; rightValue.textContent = stage.rightValue || "moving to next step"; explanation.textContent = stage.explanation; root.dataset.step = String(index); root.style.setProperty("--flow-progress", String(stages.length <= 1 ? 1 : index / (stages.length - 1))); if (browserState) { browserState.root.dataset.step = String(index); browserState.status.textContent = browserState.root.classList.contains("pw-api-scene") ? `Response received: ${stage.rightValue || outputText}` : (index >= stages.length - 2 ? (stage.rightValue || "The page shows the result.") : `${stage.caption} - ${stage.explanation}`); if (browserState.action) browserState.action.classList.toggle("is-used", index >= 3); } stations.forEach((station, i) => { station.classList.toggle("is-active", i === index); station.classList.toggle("is-done", i < index); }); buttons.forEach((button, i) => { button.classList.toggle("is-active", i === index); button.classList.toggle("is-done", i < index); button.setAttribute("aria-pressed", String(i === index)); }); };
  return { element: root, values, kind: scene };
}
function buildPythonConceptVisual(lesson) { return buildLessonSimulation(lesson, "python"); }
function buildPlaywrightConceptVisual(lesson) { return buildLessonSimulation(lesson, "playwright"); }
function buildAIConceptVisual(lesson, visualSteps) { return buildLessonSimulation({ ...lesson, visualSteps, output: lesson.tip || lesson.intro }, "ai"); }
function curriculumSubgroup(title, isPlaywright) {
  const pythonGroups = {
    "Your first steps in Python": "Start with Python",
    "Syntax, comments & indentation": "Start with Python",
    "Variables, values & types": "Variables & value types",
    "Variables & naming": "Variables & value types",
    "Numbers & arithmetic": "Variables & value types",
    "Strings & text": "Variables & value types",
    "Strings across types: format, convert & transform": "Variables & value types",
    "Booleans & comparisons": "Logic & decisions",
    "Conditionals: if, elif, else": "Logic & decisions",
    "Loops: for & while": "Loops & iteration",
    "Collections: choose the right container": "Collections & containers",
    "Lists & tuples": "Collections & containers",
    "Dictionaries & sets": "Collections & containers",
    "Comprehensions": "Collections & containers",
    "Functions & return values": "Functions & scope",
    "AI agents & safe tool use": "Automation & AI agents",
    "Scope & parameters": "Functions & scope",
    "Lambda, map & filter": "Functional tools",
    "Modules, imports & packages": "Modules & packages",
    "Classes & objects": "Object-oriented Python",
    "Encapsulation & properties": "Object-oriented Python",
    "Inheritance & composition": "Object-oriented Python",
    "Polymorphism & special methods": "Object-oriented Python",
    "Dataclasses & type hints": "Object-oriented Python",
    "Exceptions & error handling": "Errors & resource handling",
    "Files & context managers": "Errors & resource handling",
    "Iterators & generators": "Iteration & async",
    "Decorators": "Functions & reusable behavior",
    "Testing & debugging": "Testing & tooling",
    "Virtual environments & pip": "Testing & tooling",
    "Async & concurrency": "Iteration & async",
    "Pythonic habits & next steps": "Testing & tooling"
  };
  const playwrightGroups = {
    "What is Playwright?": "Browser setup & lifecycle",
    "Install Playwright for Python": "Browser setup & lifecycle",
    "Launch, page & browser context": "Browser setup & lifecycle",
    "Sync & async APIs": "Browser setup & lifecycle",
    "Your first browser test": "Test structure & verification",
    "Playwright compared with other tools": "Browser setup & lifecycle",
    "Python project setup & layout": "Browser setup & lifecycle",
    "Pytest test anatomy, fixtures & hooks": "Pytest & isolation",
    "pytest.ini configuration & browser matrix": "Pytest & isolation",
    "Run, select & debug pytest tests": "Pytest & isolation",
    "Assertions: web-first, soft & screenshots": "Test structure & verification",
    "Locator chaining, filtering & strict mode": "Finding elements",
    "Actions & actionability checks": "User actions",
    "Explicit waits & timeout budgets": "Navigation & page events",
    "Locators & auto-waiting": "Finding elements",
    "User-facing locators": "Finding elements",
    "CSS, text & test-id locators": "Finding elements",
    "Click, fill & keyboard actions": "User actions",
    "Mouse actions: hover, hold & drag-and-drop": "User actions",
    "Assertions & expect": "User actions",
    "Pytest & pytest-playwright": "Pytest & isolation",
    "Fixtures, hooks & test isolation": "Pytest & isolation",
    "Navigation, waits & timeouts": "Navigation & page events",
    "Forms, dialogs & file uploads": "Navigation & page events",
    "Frames, popups & downloads": "Navigation & page events",
    "Role & text locators in practice": "Accessible locators",
    "Checkboxes, radio buttons & dropdowns": "Forms & controls",
    "Pagination & paged results": "Forms & controls",
    "Navigate backward & forward": "Pages & navigation",
    "Multiple tabs, windows & popups": "Pages & navigation",
    "Frames & nested iframes": "Pages & navigation",
    "Shadow DOM components": "Pages & navigation",
    "API requests & network handling": "Network & authentication",
    "Record & replay with codegen": "Debugging & delivery",
    "Network requests & API testing": "Network & authentication",
    "Authentication & storage state": "Network & authentication",
    "Trace viewer, screenshots & debugging": "Debugging & delivery",
    "Parallelism, browsers & configuration": "Debugging & delivery",
    "CI, flakiness & interview strategy": "Debugging & delivery"
  };
  return (isPlaywright ? playwrightGroups : pythonGroups)[title] || "More concepts";
}





















