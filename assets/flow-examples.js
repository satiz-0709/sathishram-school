const visualFlowExamples = {
  "Your first steps in Python": [
    'print("Hello, Python!")',
    "interpreter executes the print instruction",
    "Hello, Python!"
  ],
  "Variables & naming": [
    "score = 10",
    "10 + 5 → 15",
    "score now refers to 15",
    "print(score) → 15"
  ],
  "Numbers & arithmetic": [
    "price = 19.99",
    "quantity = 3",
    "19.99 × 3 = 59.97",
    "print(total) → 59.97"
  ],
  "Conditionals: if, elif, else": [
    "score = 82",
    "82 >= 90 → False",
    "82 >= 80 → True",
    'grade = "B"'
  ],
  "Loops: for & while": [
    "range(1, 4) → 1, 2, 3",
    "number = 1 → print(1)",
    "number = 2 → print(2)"
  ],
  "Dictionaries & sets": [
    '{"name": "Ari", "level": 3}',
    'lookup key: "name"',
    'value found: "Ari"',
    'user.get("city", "unknown") → "unknown"'
  ],
  "Comprehensions": [
    "numbers = [1, 2, 3, 4, 5]",
    "keep values where n % 2 == 0",
    "square each included n",
    "squares = [1, 4, 9, 16, 25]"
  ],
  "Functions & return values": [
    "calculate_total(4.5, quantity=3)",
    "price = 4.5; quantity = 3",
    "4.5 × 3 = 13.5",
    "return 13.5 to the caller"
  ],
  "Classes & objects": [
    'class Dog: blueprint with speak()',
    'Dog("Mochi") creates an instance',
    'pet.name = "Mochi"',
    'pet.speak() → "Mochi says woof!"'
  ],
  "Exceptions & error handling": [
    'text = "42"',
    "int(text) attempts conversion",
    "conversion succeeds → 42",
    "else prints 84; finally always runs"
  ],
  "Iterators & generators": [
    "countdown(3) creates a generator",
    "next() asks for the next value",
    "yield 3; generator pauses",
    "later requests yield 2, then 1"
  ],
  "What is Playwright?": [
    "Python test: page.goto(example.com)",
    "Playwright sends browser commands",
    "Chromium renders the page and returns its title"
  ],
  "Launch, page & browser context": [
    "browser = chromium.launch()",
    "new_context() creates isolated cookies and storage",
    "context.new_page() opens a tab",
    "page.goto(url) navigates that tab"
  ],
  "Locators & auto-waiting": [
    'get_by_role("button", name="Save")',
    "Playwright resolves the locator",
    "waits until the button is actionable",
    "click() → page shows Saved"
  ],
  "User-facing locators": [
    'role = "button"; accessible name = "Continue"',
    'get_by_role("button", name="Continue")',
    "one matching control is found",
    "click() performs the user's action"
  ],
  "Assertions & expect": [
    'page shows heading "Dashboard"',
    'expect(heading).to_be_visible()',
    "assertion retries while UI updates",
    "pass when visible; otherwise report timeout"
  ],
  "Pytest & pytest-playwright": [
    "pytest discovers test_homepage",
    "page fixture provides an isolated browser page",
    "test navigates and checks the heading",
    "fixture teardown closes test resources"
  ],
  "Frames, popups & downloads": [
    'expect_popup() starts listening',
    'click "Open report" link',
    "browser opens a new Page (popup tab/window)",
    "popup_info.value gives the new page"
  ],
  "Network requests & API testing": [
    'click "Refresh" button',
    "page sends GET /api/items",
    "server returns HTTP 200",
    "expect_response captures the response"
  ],
  "Authentication & storage state": [
    "test signs in to a test account",
    "context saves cookies and local storage",
    "fresh context loads storage_state.json",
    "new page starts with the saved session"
  ],
  "Trace viewer, screenshots & debugging": [
    "test performs browser actions",
    "trace records actions and page snapshots",
    "failure retains trace.zip",
    "trace viewer replays the test timeline"
  ]
};
