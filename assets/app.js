const chapters = [
  {
    title: "Getting started", symbol: "✳", lessons: [
      { title: "Your first steps in Python", category: "THE BASICS", duration: 4, summary: "Meet Python, write your first instruction, and see how code becomes an action.", theory: "Python is a programming language: a way to write clear instructions a computer can follow. You write source code in a .py file, and the Python interpreter reads those instructions and carries them out in order. Python is popular because its syntax is readable, but it is still precise: indentation and spelling matter.", analogy: "Think of Python as a recipe language. You write each step in order, and the interpreter is the cook who follows your instructions exactly.", goal: "Explain what Python and the interpreter do, and recognize a basic print statement.", code: "# Ask Python to display a message\nprint(\"Hello, Python!\")\n\n# Python follows instructions from top to bottom\nprint(\"I'm learning to code.\")", output: "Hello, Python!\\nI'm learning to code.", quiz: { question: "What does the Python interpreter do?", options: ["Designs your user interface", "Reads and runs your code", "Stores your files online"], answer: 1 }, visual: { nodes: [["⌨","Your code","instructions"],["Py","Interpreter","reads each line"],["▤","Output","visible result"]], links: ["reads","produces"], caption: "Source code goes in; the interpreter turns instructions into a result." } },
      { title: "Syntax, comments & indentation", category: "THE BASICS", duration: 5, summary: "Learn how Python code is written, documented, and grouped into blocks.", theory: "Syntax is the set of rules for writing valid code. A # begins a comment that Python ignores. Unlike many languages, Python uses indentation (usually four spaces) to show which statements belong together. Consistent indentation is required, not just decoration.", analogy: "Indentation is like nesting boxes: the lines shifted to the right belong inside the block introduced above them.", goal: "Identify comments and explain why consistent indentation matters.", code: "# This is a comment — Python skips it\nif True:\n    message = \"Inside the block\"\n    print(message)  # four spaces show the block", output: "Inside the block", quiz: { question: "How does Python mark the statements inside a block?", options: ["With indentation", "With curly braces", "With a semicolon"], answer: 0 }, visual: { nodes: [["#","Comment","ignored"],["if","Block start",":"],["↳","Indented lines","grouped"],["▶","Interpreter","runs block"]], links: ["documents","opens","groups"], caption: "A colon opens a block; indentation shows which lines belong to it." } },
      { title: "Variables & naming", category: "THE BASICS", duration: 5, summary: "Give values meaningful names and understand assignment.", theory: "A variable is a name bound to an object in memory. Assignment with = creates or updates that binding; it does not mean mathematical equality. Choose descriptive names such as user_name, use lowercase words separated by underscores, and avoid Python keywords.", analogy: "A variable name is a label attached to a value. If you reassign the label, it refers to the new value; the old object may still exist elsewhere.", goal: "Create a variable, reassign it, and follow the value it refers to.", code: "user_name = \"Mina\"  # bind a name to a string\nscore = 10\nscore = score + 5     # read, add, reassign\n\nprint(user_name)\nprint(score)", output: "Mina\\n15", quiz: { question: "What does score = score + 5 do?", options: ["Checks whether score equals 5", "Adds 5 to the current score", "Creates a function named score"], answer: 1 }, visual: { nodes: [["label","score","name"],["→","15","value"],["＋","score + 5","new value"],["→","15","reassigned"]], links: ["refers to","calculate","rebinds"], caption: "Assignment evaluates the right side first, then binds the name to that result." } },
      { title: "Numbers & arithmetic", category: "THE BASICS", duration: 6, summary: "Use Python's numeric types and operators to calculate.", theory: "Python's common numeric types are int for whole numbers, float for decimal numbers, and complex for numbers with an imaginary part. Operators include +, -, *, /, // (floor division), % (remainder), and ** (power). Parentheses make evaluation order explicit.", analogy: "Operators are tiny instructions attached to values: Python evaluates them according to precedence, much like a calculator.", goal: "Choose numeric operators and distinguish division from floor division.", code: "price = 19.99\nquantity = 3\nprint(price * quantity)\nprint(17 // 5)  # whole-number quotient\nprint(17 % 5)   # remainder\nprint(2 ** 3)   # power", output: "59.97\\n3\\n2\\n8", quiz: { question: "Which operator gives the remainder?", options: ["//", "%", "**"], answer: 1 }, visual: { nodes: [["19.99","price","float"],["×","operation","multiply"],["3","quantity","int"],["59.97","result","float"]], links: ["input","input","produces"], caption: "An operator combines input values into a result." } },
      { title: "Strings & text", category: "THE BASICS", duration: 6, summary: "Work with text, formatting, and common string operations.", theory: "A string (str) is a sequence of Unicode text, written inside quotes. Strings are immutable: methods such as .upper() return a new string rather than changing the original. f-strings, written with an f prefix, neatly insert expressions into text.", analogy: "A string is a strand of characters. Indexes point to positions, and slicing selects a segment without altering the original strand.", goal: "Create strings, interpolate values, and use basic string methods.", code: "name = \"Ada\"\nmessage = f\"Hello, {name}!\"\nprint(message)\nprint(name.upper())\nprint(\"python\"[0:3])", output: "Hello, Ada!\\nADA\\npyt", quiz: { question: "What does an f-string help you do?", options: ["Insert values into text", "Repeat a loop forever", "Convert text into a file"], answer: 0 }, visual: { nodes: [["\"Hello\"","Text","characters"],["{name}","f-string","insert value"],["\"Hello, Ada\"","Result","new string"]], links: ["template","formats"], caption: "An f-string substitutes expressions inside braces to make new text." } }
    ]
  },
  {
    title: "Core building blocks", symbol: "▦", lessons: [
      { title: "Booleans & comparisons", category: "CORE BUILDING BLOCKS", duration: 5, summary: "Represent true or false and compare values.", theory: "The bool type has exactly two values: True and False. Comparison operators (==, !=, <, >, <=, >=) produce booleans. Remember: = assigns a value; == compares two values. Python treats some values as false in conditions, including 0, \"\", None, and empty collections.", analogy: "A comparison is a yes-or-no question. Its boolean answer can route your program down different paths.", goal: "Use comparison operators and identify boolean results.", code: "temperature = 22\nis_warm = temperature >= 20\nprint(is_warm)\nprint(5 == \"5\")  # different types", output: "True\\nFalse", quiz: { question: "Which operator tests equality?", options: ["=", "==", "!="], answer: 1 }, visual: { nodes: [["22","temperature","value"],["≥ 20","comparison","question"],["✓","True","boolean"]] ,links:["checked by","returns"],caption:"Comparisons turn values into a True or False result."} },
      { title: "Conditionals: if, elif, else", category: "CORE BUILDING BLOCKS", duration: 6, summary: "Make decisions and run the matching branch of code.", theory: "An if statement evaluates a condition and runs its indented block only when that condition is truthy. Use elif for another condition to test, and else for the fallback. The first matching branch wins. Conditions can be combined with and, or, and not.", analogy: "A conditional is a fork in a trail: Python checks each signpost in order and takes the first route whose condition is true.", goal: "Build a multi-branch decision with if, elif, and else.", code: "score = 82\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"Keep practicing\"\nprint(grade)", output: "B", quiz: { question: "If an if condition is false, what is checked next?", options: ["The first elif condition", "Every branch at once", "The function's return value"], answer: 0 }, visual: { nodes: [["score","Input","82"],["?","≥ 90","false"],["?","≥ 80","true"],["B","Chosen branch","output"]],links:["check","then check","select"],caption:"Python tests branches from top to bottom and takes the first true one."} },
      { title: "Loops: for & while", category: "CORE BUILDING BLOCKS", duration: 7, summary: "Repeat actions with for loops, while loops, and range.", theory: "A for loop visits each item in an iterable, such as a list or string. range(stop) produces a sequence of integers up to but not including stop. A while loop repeats as long as its condition remains true. Ensure a while loop can eventually stop to avoid an infinite loop.", analogy: "A for loop is a checklist: move to the next item each time. A while loop is a repeating question: keep going while the answer is yes.", goal: "Choose between for and while and trace a loop's iterations.", code: "for number in range(1, 4):\n    print(number)\n\ncount = 3\nwhile count > 0:\n    print(\"go\", count)\n    count -= 1", output: "1\\n2\\n3\\ngo 3\\ngo 2\\ngo 1", quiz: { question: "What values does range(1, 4) produce?", options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"], answer: 0 }, visual: { nodes: [["1","Item 1","next"],["2","Item 2","next"],["3","Item 3","done"]],links:["iterate","iterate"],caption:"A for loop processes one item per pass until the iterable is exhausted."} },
      { title: "Lists & tuples", category: "CORE BUILDING BLOCKS", duration: 7, summary: "Store ordered collections and choose mutable or immutable sequences.", theory: "A list is an ordered, mutable collection written with square brackets. Indexing starts at 0; negative indexes count from the end. A tuple is ordered but immutable, often written with parentheses. Slices such as items[1:3] select a range and exclude the ending index.", analogy: "A list is an editable shelf of numbered slots. A tuple is the same kind of shelf, sealed once created.", goal: "Index, slice, and update a list and explain when a tuple is useful.", code: "colors = [\"teal\", \"gold\", \"plum\"]\ncolors.append(\"coral\")\nprint(colors[0])\nprint(colors[1:3])\npoint = (4, 7)  # fixed pair", output: "teal\\n['gold', 'plum']", quiz: { question: "Which collection can you change after creating it?", options: ["tuple", "list", "Both are immutable"], answer: 1 }, visual: { nodes: [["0","teal","index"],["1","gold","index"],["2","plum","index"],["+","coral","append"]],links:["next","next","add"],caption:"A list preserves order and can grow or change as your program runs."} },
      { title: "Dictionaries & sets", category: "CORE BUILDING BLOCKS", duration: 7, summary: "Model key-value data and work with unique items.", theory: "A dictionary maps unique keys to values, like {\"name\": \"Ari\"}. Retrieve values by key and use .get() when a key may be absent. A set stores unique hashable items and supports operations such as union (|), intersection (&), and difference (-).", analogy: "A dictionary is a labeled filing cabinet: the key is the tab, and the value is what's inside. A set is a bag that automatically keeps only one of each item.", goal: "Store and retrieve dictionary values and use a set to remove duplicates.", code: "user = {\"name\": \"Ari\", \"level\": 3}\nprint(user[\"name\"])\nprint(user.get(\"city\", \"unknown\"))\ntags = {\"python\", \"beginner\", \"python\"}\nprint(len(tags))", output: "Ari\\nunknown\\n2", quiz: { question: "What does a set automatically enforce?", options: ["Every item has a key", "All items are unique", "Items stay sorted"], answer: 1 }, visual: { nodes: [["key","name","lookup"],["→","Ari","value"],["key","level","lookup"],["→","3","value"]],links:["maps to","maps to","stores"],caption:"A dictionary finds values by their keys, rather than by position."} },
      { title: "Comprehensions", category: "CORE BUILDING BLOCKS", duration: 6, summary: "Create collections concisely from an iterable and optional condition.", theory: "A comprehension builds a collection from an iterable in one expression. A list comprehension uses [expression for item in iterable if condition]; similar forms create sets and dictionaries. Keep comprehensions readable—if the logic gets nested or complicated, use a regular loop.", analogy: "A comprehension is a compact assembly line: take each input, optionally filter it, transform it, and collect the result.", goal: "Read a list comprehension and write one with a filter.", code: "numbers = [1, 2, 3, 4, 5]\nsquares = [n ** 2 for n in numbers]\nevens = [n for n in numbers if n % 2 == 0]\nprint(squares)\nprint(evens)", output: "[1, 4, 9, 16, 25]\\n[2, 4]", quiz: { question: "In a comprehension, what does an if clause do?", options: ["Filters which items are included", "Defines a function", "Sorts the final list"], answer: 0 }, visual: { nodes: [["1,2,3…","Iterable","source"],["if","Filter","optional"],["n²","Transform","expression"],["[1,4,9…]","New list","result"]],links:["visits","keeps","collects"],caption:"Each item is visited, optionally filtered, transformed, then collected."} }
    ]
  },
  {
    title: "Functions & modules", symbol: "?", lessons: [
      { title: "Functions & return values", category: "FUNCTIONS & MODULES", duration: 7, summary: "Package reusable logic into functions with inputs and outputs.", theory: "Define a function with def and a name, followed by parentheses and a colon. Parameters are the function's inputs; arguments are the actual values supplied when calling it. return sends a result back to the caller and ends the function. Without an explicit return, the result is None.", analogy: "A function is a small machine: pass in ingredients (arguments), follow its recipe (body), and collect its output (return value).", goal: "Define and call a function that accepts parameters and returns a value.", code: "def calculate_total(price, quantity=1):\n    \"\"\"Return the cost for this quantity.\"\"\"\n    return price * quantity\n\ntotal = calculate_total(4.5, quantity=3)\nprint(total)", output: "13.5", quiz: { question: "What does return do inside a function?", options: ["Sends a value back to the caller", "Repeats the function", "Prints every local variable"], answer: 0 }, visual: { nodes: [["4.5, 3","Arguments","inputs"],["Æ’","Function","work"],["×","Calculation","4.5 × 3"],["13.5","Return","output"]],links:["passed in","computes","returns"],caption:"Arguments enter a function; its return value travels back to the caller."} },
      { title: "Scope & parameters", category: "FUNCTIONS & MODULES", duration: 7, summary: "Understand where names live and pass arguments safely.", theory: "A local name exists inside the function where it is created. Global names live at module level. Python resolves names using the LEGB rule: Local, Enclosing, Global, Built-in. Prefer returning values over changing globals. Positional and keyword arguments are common; mutable default values are evaluated once, so use None when you need a fresh list per call.", analogy: "Scope is like a room: local names are on the room's desk, while built-ins are in a shared toolbox everyone can reach.", goal: "Explain local scope and use safe function defaults.", code: "def add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags\n\nprint(add_tag(\"new\"))\nprint(add_tag(\"sale\"))", output: "['new']\\n['sale']", quiz: { question: "Why avoid a list as a function's default argument?", options: ["It is shared between calls", "Lists cannot be returned", "Python cannot create lists"], answer: 0 }, visual: { nodes: [["Global","Module","outer scope"],["Æ’","Function","local scope"],["↗","Return","pass result"],["Caller","Uses value","explicit"]],links:["can access","sends back","receives"],caption:"Local names stay in their function; returning values makes data flow explicit."} },
      { title: "Lambda, map & filter", category: "FUNCTIONS & MODULES", duration: 6, summary: "Use small functions for transformations and filtering.", theory: "A lambda creates a small anonymous function containing one expression. map applies a function to each item; filter keeps items for which a predicate is true. List comprehensions are often easier to read for simple cases. Use named functions when behavior deserves a meaningful name or reuse.", analogy: "map is a transformation station that handles each item; filter is a checkpoint that lets only matching items through.", goal: "Recognize a lambda and transform or filter a sequence.", code: "prices = [5, 12, 8, 20]\nwith_tax = list(map(lambda p: p * 1.1, prices))\naffordable = list(filter(lambda p: p < 10, prices))\nprint(with_tax)\nprint(affordable)", output: "[5.5, 13.200000000000001, 8.8, 22.0]\\n[5, 8]", quiz: { question: "What does filter keep?", options: ["Items where the condition is true", "Items that map returns as strings", "Only the first item"], answer: 0 }, visual: { nodes: [["items","Input","sequence"],["Î»","map","transform"],["Î»","filter","test"],["results","Output","sequence"]],links:["each item","matching items","collect"],caption:"Transform each element, then keep only values that pass your predicate."} },
      { title: "Modules, imports & packages", category: "FUNCTIONS & MODULES", duration: 6, summary: "Reuse code by importing modules from Python's standard library and packages.", theory: "A module is a .py file whose names you can reuse with import. Python includes a large standard library; third-party packages are installed into an environment, commonly with pip. A package groups modules. Prefer explicit imports such as from pathlib import Path, and protect script-only behavior with if __name__ == \"__main__\":.", analogy: "A module is a toolbox you can import into your workshop instead of building every tool yourself.", goal: "Import a standard-library tool and describe the module/package difference.", code: "from pathlib import Path\n\nhere = Path(\"notes.txt\")\nprint(here.suffix)\n\nif __name__ == \"__main__\":\n    print(\"Run as a script\")", output: ".txt\\nRun as a script", quiz: { question: "What does a Python package group together?", options: ["Related modules", "Only number values", "One running loop"], answer: 0 }, visual: { nodes: [["Python","Project","your code"],["ðŸ“¦","Package","module group"],["▣","Module","reusable file"],["import","Your code","use names"]],links:["contains","contains","makes available"],caption:"Packages organize modules; imports bring selected names into your code."} }
    ]
  },
  {
    title: "Object-oriented Python", symbol: "◇", lessons: [
      { title: "Classes & objects", category: "OBJECT-ORIENTED PYTHON", duration: 7, summary: "Model data and behavior together with classes and instances.", theory: "A class is a blueprint that defines attributes (data) and methods (behavior). An object, also called an instance, is a concrete value created from that class. __init__ initializes each new instance; self refers to the current instance and is written explicitly as the first parameter of instance methods.", analogy: "A class is the blueprint for a house; each object is a built house with its own address and rooms.", goal: "Create a class, instantiate an object, and call one of its methods.", code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f\"{self.name} says woof!\"\n\npet = Dog(\"Mochi\")\nprint(pet.speak())", output: "Mochi says woof!", quiz: { question: "What is an instance?", options: ["A concrete object created from a class", "A special Python loop", "A file containing only comments"], answer: 0 }, visual: { nodes: [["Class","Dog","blueprint"],["__init__","Mochi","instance data"],["Object","pet","one dog"],["speak()","woof!","behavior"]],links:["creates","assigned to","calls"],caption:"A class defines a shape; an instance carries its own data and behavior."} },
      { title: "Encapsulation & properties", category: "OBJECT-ORIENTED PYTHON", duration: 7, summary: "Keep object state consistent and expose a clean public interface.", theory: "Encapsulation groups state and behavior behind a class's interface. Python uses conventions: a leading underscore (such as _balance) signals an implementation detail, but does not enforce privacy. Properties let an attribute-style interface validate or compute values. Keep state changes controlled and invariants clear.", analogy: "Encapsulation is a control panel: users operate safe controls without needing to touch the wiring inside.", goal: "Explain Python's underscore convention and use a property to validate state.", code: "class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(\"Below absolute zero\")\n        self._celsius = value", output: "The setter keeps the temperature within a valid range.", quiz: { question: "What does a leading underscore on _balance usually communicate?", options: ["Internal-use convention", "Python-enforced private access", "That the value is a constant"], answer: 0 }, visual: { nodes: [["User","sets value","request"],["@property","Interface","checks"],["_state","Internal data","stored"],["ValueError","Invalid","guard"]],links:["requests","validates","updates"],caption:"A property can guard an object's state behind a familiar attribute interface."} },
      { title: "Inheritance & composition", category: "OBJECT-ORIENTED PYTHON", duration: 8, summary: "Reuse behavior by specializing classes or combining smaller objects.", theory: "Inheritance models an \"is-a\" relationship: a subclass extends a base class and can override methods. super() calls behavior from the next class in the method resolution order. Composition models a \"has-a\" relationship by giving an object other objects to work with. Prefer composition when it keeps relationships simpler and more flexible.", analogy: "Inheritance is a specialized blueprint; composition is building with parts that can be swapped independently.", goal: "Distinguish inheritance from composition and use super() in an override.", code: "class Animal:\n    def speak(self):\n        return \"Some sound\"\n\nclass Cat(Animal):\n    def speak(self):\n        base = super().speak()\n        return f\"{base}; meow!\"\n\nprint(Cat().speak())", output: "Some sound; meow!", quiz: { question: "Composition best describes which relationship?", options: ["A Cat is an Animal", "A Car has an Engine", "A value equals another value"], answer: 1 }, visual: { nodes: [["Animal","Base class","general"],["↓","inherits","is-a"],["Cat","Subclass","specialized"],["Engine","Part","has-a"]],links:["parent of","specializes","alternative: contains"],caption:"Inheritance specializes a type; composition assembles behavior from parts."} },
      { title: "Polymorphism & special methods", category: "OBJECT-ORIENTED PYTHON", duration: 7, summary: "Use a shared interface across different types and customize Python behavior.", theory: "Polymorphism lets different objects respond to the same operation in their own way. Python often uses duck typing: if an object supports the needed behavior, it can be used. Special methods such as __str__, __len__, and __eq__ connect your classes to built-in operations and functions.", analogy: "A shared socket can fit different plugs: code asks for the behavior it needs, not a specific class label.", goal: "Explain duck typing and recognize common special methods.", code: "class Playlist:\n    def __init__(self, songs):\n        self.songs = songs\n\n    def __len__(self):\n        return len(self.songs)\n\nmix = Playlist([\"Blue\", \"Gold\"])\nprint(len(mix))", output: "2", quiz: { question: "What does implementing __len__ let your object support?", options: ["The built-in len() function", "The import statement", "A for-loop's else clause"], answer: 0 }, visual: { nodes: [["len(x)","Shared request","interface"],["List","__len__","behavior"],["Playlist","__len__","behavior"],["2","Result","common use"]],links:["calls","same request","returns"],caption:"Different types can support one shared operation by implementing the needed method."} },
      { title: "Dataclasses & type hints", category: "OBJECT-ORIENTED PYTHON", duration: 7, summary: "Describe expected types and reduce boilerplate for data-focused classes.", theory: "Type hints document the intended types of variables, parameters, and returns; Python does not enforce them at runtime by default, but tools can check them. @dataclass generates common methods such as __init__ and __repr__ for classes primarily storing data. Use Optional types (or X | None) to make possible absence explicit.", analogy: "Type hints are labels on the ports of a machine: they tell readers and tools what kind of value should connect.", goal: "Add annotations to a function and define a small dataclass.", code: "from dataclasses import dataclass\n\n@dataclass\nclass Book:\n    title: str\n    pages: int\n\ndef reading_time(book: Book) -> float:\n    return book.pages / 30\n\nprint(Book(\"Small Steps\", 120))", output: "Book(title='Small Steps', pages=120)", quiz: { question: "Do Python type hints enforce types at runtime by default?", options: ["Yes, always", "No, they primarily document and support tools", "Only in dataclasses"], answer: 1 }, visual: { nodes: [["Annotations","str, int","describe"],["@dataclass","Decorator","generates"],["Book","Class","data model"],["Tools","Type check","analyze"]],links:["guide","builds","understands"],caption:"Hints describe intent; dataclasses generate common data-container methods."} }
    ]
  },
  {
    title: "Beyond the basics", symbol: "↗", lessons: [
      { title: "Exceptions & error handling", category: "BEYOND THE BASICS", duration: 7, summary: "Handle expected failures without hiding real problems.", theory: "Exceptions signal that an operation could not proceed normally. Put risky operations in try, handle specific expected exception types with except, use else for success-only work, and finally for cleanup. Raise an appropriate exception when your function receives invalid input. Avoid catching Exception broadly unless you can handle or report it meaningfully.", analogy: "Exception handling is a safety net: catch the specific kinds of falls you can recover from and let unexpected ones be visible.", goal: "Handle a specific exception and distinguish else from finally.", code: "text = \"42\"\ntry:\n    number = int(text)\nexcept ValueError as error:\n    print(f\"Not a number: {error}\")\nelse:\n    print(number * 2)\nfinally:\n    print(\"Conversion attempted\")", output: "84\\nConversion attempted", quiz: { question: "Why catch a specific exception such as ValueError?", options: ["It avoids hiding unrelated bugs", "It prevents all errors", "It makes every error retry automatically"], answer: 0 }, visual: { nodes: [["try","Risky work","attempt"],["✓","Success","else"],["!","Known error","except"],["↘","Always","finally"]],links:["branches","if succeeds","if matching error","cleanup"],caption:"A matching exception takes its handler; finally runs either way."} },
      { title: "Files & context managers", category: "BEYOND THE BASICS", duration: 6, summary: "Read and write files safely with with and pathlib.", theory: "Use open (or pathlib.Path.open) to access a file. A context manager used with with ensures the file is closed even if an error occurs. Choose an explicit encoding such as UTF-8 for text, and be deliberate about modes: \"r\" reads, \"w\" overwrites, and \"a\" appends.", analogy: "A with block is like borrowing a book with an automatic return slot: when the block ends, the resource is put away.", goal: "Read a UTF-8 text file using a context manager.", code: "from pathlib import Path\n\npath = Path(\"notes.txt\")\npath.write_text(\"Learn Python!\", encoding=\"utf-8\")\nwith path.open(encoding=\"utf-8\") as file:\n    text = file.read()\nprint(text)", output: "Learn Python!", quiz: { question: "What does a with block help guarantee for an open file?", options: ["It is closed when the block ends", "Its contents are encrypted", "It can never be missing"], answer: 0 }, visual: { nodes: [["Path","notes.txt","file"],["with","Open safely","context"],["read()","Text","contents"],["exit","Close","automatic"]],links:["locates","opens","returns","ensures"],caption:"The context manager owns cleanup, even when reading fails."} },
      { title: "Iterators & generators", category: "BEYOND THE BASICS", duration: 7, summary: "Produce values one at a time for memory-friendly iteration.", theory: "An iterable can provide an iterator; an iterator produces the next value on request. A generator function uses yield to pause and resume, keeping its state between values. Generators are useful for large or streaming data because values are produced lazily instead of stored all at once.", analogy: "A list is a box containing every ticket; a generator is a ticket dispenser that prints the next one only when asked.", goal: "Explain lazy iteration and write a generator using yield.", code: "def countdown(start):\n    while start > 0:\n        yield start\n        start -= 1\n\nfor number in countdown(3):\n    print(number)", output: "3\\n2\\n1", quiz: { question: "What does yield do in a generator?", options: ["Produces a value and pauses", "Closes the program", "Sorts the values in memory"], answer: 0 }, visual: { nodes: [["request","next()","ask"],["yield","one value","produce"],["pause","saved state","wait"],["request","next()","continue"]],links:["advances","remembers","asks again"],caption:"Each request advances the generator and produces just the next value."} },
      { title: "Decorators", category: "BEYOND THE BASICS", duration: 7, summary: "Wrap a function to add reusable behavior without changing its body.", theory: "A decorator is a callable that takes a function and returns a replacement, often a wrapper. The @decorator syntax applies that transformation when the function is defined. Decorators power features such as logging and access checks. functools.wraps preserves useful metadata from the wrapped function.", analogy: "A decorator is a reusable jacket around a function: add a feature on the way in and out while keeping the core operation intact.", goal: "Read @decorator syntax and explain how a wrapper adds behavior.", code: "from functools import wraps\n\ndef announce(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        print(\"Starting...\")\n        return func(*args, **kwargs)\n    return wrapper\n\n@announce\ndef greet(name):\n    print(f\"Hello, {name}!\")", output: "Calling greet(\"Sam\") prints: Starting...\\nHello, Sam!", quiz: { question: "What is a common purpose of a decorator?", options: ["Add reusable behavior around a function", "Turn every function into a class", "Make all arguments optional"], answer: 0 }, visual: { nodes: [["greet()","Original","function"],["@announce","Decorator","wrap"],["wrapper","Added step","behavior"],["result","Same job","enhanced"]],links:["passed to","returns","calls"],caption:"A decorator creates a wrapped callable that adds behavior around the original."} },
      { title: "Testing & debugging", category: "BEYOND THE BASICS", duration: 7, summary: "Check behavior with assertions and find bugs systematically.", theory: "Tests compare expected behavior with actual behavior and should be repeatable. Start with small unit tests for one function or class, including normal and edge cases. Python's unittest is built in; pytest is a popular third-party alternative. Debug by reproducing the issue, inspecting values, and narrowing down where expectations diverge.", analogy: "A test is a small, repeatable experiment: set up known inputs, run the code, and compare the result to what you expected.", goal: "Write a basic assertion and describe a useful debugging workflow.", code: "def square(number):\n    return number * number\n\nassert square(4) == 16\nassert square(0) == 0\nassert square(-3) == 9\nprint(\"All checks passed\")", output: "All checks passed", quiz: { question: "What does an assertion help verify?", options: ["That an expected condition is true", "That your app is deployed", "That every function has a decorator"], answer: 0 }, visual: { nodes: [["Input","4","test case"],["Function","square()","run"],["Expected","16","assert"],["Actual","16","compare"]],links:["given","produces","checked against"],caption:"A test compares the actual result with an explicit expected result."} },
      { title: "Virtual environments & pip", category: "BEYOND THE BASICS", duration: 6, summary: "Isolate project dependencies and install packages reliably.", theory: "A virtual environment gives a project its own Python packages, preventing dependency conflicts with other projects. Create one with python -m venv .venv, activate it in your terminal, then install packages using python -m pip install package-name. Record dependencies in a requirements file or modern project metadata.", analogy: "A virtual environment is a separate workbench for each project: tools installed on one bench do not clutter the others.", goal: "Explain why virtual environments matter and identify the basic venv and pip commands.", code: "# Create an isolated project environment\npython -m venv .venv\n\n# Activate it, then install a dependency\npython -m pip install requests\n\n# Record installed packages\npython -m pip freeze > requirements.txt", output: "A project-local environment keeps its dependencies separate.", quiz: { question: "Why create a virtual environment for a project?", options: ["To isolate its dependencies", "To make Python code run without an interpreter", "To automatically fix syntax errors"], answer: 0 }, visual: { nodes: [["Project A",".venv","isolated"],["pip","install","package"],["Project B",".venv","separate"],["System","Python","unchanged"]],links:["owns","adds to","does not affect","stays clean"],caption:"Each project's environment isolates its installed dependencies."} },
      { title: "Async & concurrency", category: "BEYOND THE BASICS", duration: 8, summary: "Use async and await for concurrent I/O-bound tasks.", theory: "async def defines a coroutine; await pauses it while an awaited operation is pending, allowing an event loop to run other work. asyncio is useful when many tasks spend time waiting on I/O, such as network requests. Async does not automatically speed up CPU-heavy work; use appropriate multiprocessing or native tools for that.", analogy: "Async is like a barista starting several drinks: while one waits for the espresso machine, they can prepare another order.", goal: "Explain what await pauses and when asyncio is a good fit.", code: "import asyncio\n\nasync def fetch_label():\n    await asyncio.sleep(0.1)  # stand-in for I/O\n    return \"done\"\n\nasync def main():\n    result = await fetch_label()\n    print(result)\n\nasyncio.run(main())", output: "done", quiz: { question: "Asyncio is especially useful for which work?", options: ["Many tasks waiting on I/O", "One large CPU calculation only", "Fixing type errors"], answer: 0 }, visual: { nodes: [["Task A","await I/O","waiting"],["Event loop","switch","runs other"],["Task B","ready","progress"],["Task A","resumes","done"]],links:["yields","schedules","returns to"],caption:"When one coroutine awaits I/O, the event loop can run another ready task."} },
      { title: "AI agents & safe tool use", category: "BEYOND THE BASICS", duration: 9, summary: "Trace a goal-driven agent as it chooses a bounded tool, observes the result, and decides what to do next.", theory: "An agentic program works toward a goal through a repeated loop: inspect the task, choose a plan or tool, perform an action, observe the result, and decide whether another step is needed. This lesson uses a deterministic local planner so the process is transparent; it is not an LLM and does not access the network. Real agents should use an allowlist of narrowly scoped tools, validate arguments and results, cap iterations, log actions, and require human approval for consequential operations. Never execute arbitrary model-generated Python as a tool.", analogy: "Imagine a delivery driver with a destination and a small approved fleet: the driver checks the route, chooses a vehicle, completes one leg, checks the result, and only then continues.", goal: "Explain the observe-plan-act-observe loop and name practical boundaries for safe tool use.", code: "def add(left, right):\n    return left + right\n\ndef multiply(left, right):\n    return left * right\n\n# Only these reviewed tools are available to the planner.\ntools = {\"add\": add, \"multiply\": multiply}\ngoal = \"multiply 4 by 3\"\nplan = {\"tool\": \"multiply\", \"arguments\": (4, 3)}\n\nif plan[\"tool\"] not in tools:\n    raise ValueError(\"Tool is not allowed\")\nobservation = tools[plan[\"tool\"]](*plan[\"arguments\"])\nif observation == 12:\n    print(f\"Goal complete: {observation}\")", output: "Goal complete: 12", quiz: { question: "What should happen before an agent executes a selected tool?", options: ["Validate that the tool is allowed and its arguments are acceptable", "Run any generated code without inspection", "Repeat the tool forever until it succeeds"], answer: 0 }, visual: { nodes: [["ðŸŽ¯","Goal","understand request"],["ðŸ§ ","Plan","choose allowed tool"],["ðŸ§°","Act","call add / multiply"],["ðŸ‘€","Observe","inspect returned value"],["✓","Decide","finish or plan next step"]], links: ["sets direction","selects","produces result","evaluate"], caption: "An agent repeats a bounded goal → plan → action → observation loop; this example uses only local, allowlisted functions." } },
      { title: "Pythonic habits & next steps", category: "BEYOND THE BASICS", duration: 5, summary: "Bring core Python ideas together and build your next project.", theory: "Pythonic code is clear, direct, and consistent. Follow PEP 8 conventions, use meaningful names, keep functions focused, and prefer readable solutions over clever ones. Learn to read tracebacks, consult official documentation, and build small projects: a CLI tool, data organizer, web app, or automation script.", analogy: "Good code is a note to the next person who reads it—including future you. Optimize first for clarity, then measure before optimizing speed.", goal: "Recognize a few practical Python conventions and choose a project to apply them.", code: "def greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello, {name}!\"\n\nif __name__ == \"__main__\":\n    print(greet(\"Python learner\"))", output: "Hello, Python learner!", quiz: { question: "What is usually the best first priority when writing Python?", options: ["Clear, readable code", "The shortest possible line", "Avoiding all functions"], answer: 0 }, visual: { nodes: [["Learn","Concepts","understand"],["Build","Small project","apply"],["Test","Check behavior","verify"],["Share","Next step","grow"]],links:["practice","validate","iterate"],caption:"Learning sticks when concepts become small, tested projects."} }
    ]
  }
];

chapters[0].lessons.splice(2, 0, {
  title: "Variables, values & types",
  category: "THE BASICS",
  duration: 7,
  summary: "Understand what a variable is and how Python values get their types.",
  theory: "A variable is a name bound to an object; the value has a type. Python is dynamically typed, so you do not declare a variable's type and a name can later refer to a value of another type. Common built-in value types include int, float, bool, str, and NoneType. Collections such as list, tuple, dict, and set hold groups of values and are covered next. Use type(value) to inspect a value and isinstance(value, ExpectedType) for most type checks.",
  analogy: "Think of a variable as a label card that can point to different objects. The object carries its own type tag: Asha is text, 12 is an integer, and a list is a collection.",
  goal: "Explain name-to-object binding, identify common Python value types, and distinguish a variable name from its value.",
  code: `name = "Asha"           # str
age = 12                # int
height = 1.52            # float
is_student = True       # bool
subjects = ["Python", "Art"]  # list

print("name:", type(name).__name__)
print("age:", type(age).__name__)
print("height:", type(height).__name__)
print("is_student:", type(is_student).__name__)
print("subjects:", type(subjects).__name__)

age = "twelve"           # rebinding is allowed
print("age after rebinding:", type(age).__name__)`,
  output: `name: str
age: int
height: float
is_student: bool
subjects: list
age after rebinding: str`,
  quiz: { question: "In Python, where does the type belong?", options: ["To the value/object, not permanently to the variable name", "To the variable name forever", "Only to the file"], answer: 0 },
  visual: { nodes: [["name","Variable","label"],["12","int","value"],["type(12)","Inspect","int"],["new value","Rebind","str"]], links: ["references","has type","can point to"], caption: "Names refer to objects; objects carry types, and a name can be rebound." }
});

chapters[1].lessons.splice(3, 0, {
  title: "Collections: choose the right container",
  category: "CORE BUILDING BLOCKS",
  duration: 7,
  summary: "Learn what collections are before studying lists, tuples, dictionaries, and sets.",
  theory: "A collection stores or organizes multiple values. Choose by the behavior you need: list is ordered and mutable; tuple is ordered and immutable; dict maps unique keys to values; set stores unique hashable items without positional indexing. These are different types with different operations—not just different bracket styles. Collections can contain other collections and may hold mixed types, though consistent element types often make programs easier to understand.",
  analogy: "Choose a container for the job: a list is an editable queue, a tuple is a fixed coordinate, a dictionary is a labeled parts catalog, and a set is a unique tag basket.",
  goal: "Choose among list, tuple, dict, and set based on ordering, mutability, and lookup needs.",
  code: `shopping = ["milk", "bread"]       # ordered, changeable
location = (51.5, -0.1)             # fixed pair
vehicle = {"type": "bike", "gears": 7}  # key → value
tags = {"travel", "green", "travel"} # duplicates collapse

print(shopping[0])
print(vehicle["type"])
print(tags)`,
  output: "milk\\nbike\\n{'travel', 'green'}",
  quiz: { question: "Which collection maps named keys to values?", options: ["list", "dict", "tuple"], answer: 1 },
  visual: { nodes: [["list","Ordered","mutable"],["tuple","Ordered","fixed"],["dict","Key → value","lookup"],["set","Unique items","membership"]], links: ["stores","stores","maps","keeps"], caption: "Pick a collection based on how the data should be ordered, changed, and found." }
});

chapters[0].lessons.push({
  title: "Strings across types: format, convert & transform",
  category: "THE BASICS",
  duration: 8,
  summary: "Format values of different types into text and transform strings safely.",
  theory: "An f-string formats int, float, bool, and other values into display text without changing their original types. String methods such as strip(), title(), upper(), and split() return new strings or collections because strings are immutable. join() combines an iterable of strings; convert non-string items explicitly with map(str, values) before joining. Use format specifiers such as {height:.1f} to control displayed numbers.",
  analogy: "Think of a message template as a display panel: it reads values of different types, formats a readable copy, and leaves the original numbers and booleans unchanged.",
  goal: "Use f-strings with multiple value types, transform text, and distinguish display conversion from changing a value's type.",
  code: `name = "  asha kumar  "   # str
age = 12                  # int
height = 1.52              # float
is_ready = True            # bool
skills = ["Python", "Art"] # list[str]

clean_name = name.strip().title()
message = f"{clean_name} is {age} ({height:.1f} m), ready={is_ready}"
skill_text = ", ".join(skills).upper()
print(message)
print(skill_text)
print(type(age).__name__)`,
  output: "Asha Kumar is 12 (1.5 m), ready=True\\nPYTHON, ART\\nint",
  quiz: { question: "After `message = f\"Age: {age}\"`, what is the type of age?", options: ["It stays int; the f-string creates display text", "It becomes str", "It becomes float"], answer: 0 },
  visual: { nodes: [["int · float · bool","Input values","different types"],["f-string","Format","new display text"],["strip · title","Transform","new strings"],["join · upper","Combine","text output"]], links: ["interpolates","returns new text","combines"], caption: "Different types can flow into formatted text without changing the original values." }
});

chapters[0].lessons.splice(chapters[0].lessons.findIndex((lesson) => lesson.title === "Strings across types: format, convert & transform") + 1, 0, {
  title: "Input, conversion & validation",
  category: "THE BASICS",
  duration: 7,
  summary: "Read user input as text, convert it deliberately, and handle invalid values.",
  theory: "input() displays a prompt and always returns a string. Convert that string to the type your program needs, for example with int() or float(). Conversion can fail with ValueError, so validate untrusted input and give the user a useful response. Avoid bool(text) for yes/no input because every non-empty string, including 'False', is truthy; compare normalized text with accepted choices instead.",
  analogy: "Input arrives as a note written in text. Before using it as a number, check that it can be read as one and decide what to do when it cannot.",
  goal: "Explain input()'s return type, convert numeric text, and handle a failed conversion.",
  code: `raw_age = "21"  # input("Age: ") returns text
try:
    age = int(raw_age)
except ValueError:
    print("Please enter a whole number.")
else:
    print(f"Next year: {age + 1}")`,
  output: "Next year: 22",
  quiz: { question: "What type does input() return before conversion?", options: ["str", "int", "bool"], answer: 0 },
  visual: { nodes: [["input()","Read","text"],["int()","Convert","number"],["try / except","Validate","handle failure"],["result","Continue","safe"]], links: ["returns","parses","guards"], caption: "Treat user input as text first, then convert and handle invalid values." }
});

chapters[4].lessons.splice(chapters[4].lessons.findIndex((lesson) => lesson.title === "Files & context managers") + 1, 0, {
  title: "JSON & structured data",
  category: "BEYOND THE BASICS",
  duration: 7,
  summary: "Exchange structured data with JSON and distinguish parsing from validation.",
  theory: "The json standard-library module converts between JSON text and Python values. Use json.loads() to parse text, json.dumps() to create text, and json.load()/json.dump() with an open file. JSON objects become dictionaries, arrays become lists, and null becomes None. Parsing only checks JSON syntax: validate required keys, value types, and ranges separately before trusting external data.",
  analogy: "JSON is a shared envelope format. Parsing opens the envelope and builds Python values; validation checks whether the contents match what your program expects.",
  goal: "Parse JSON into Python values, serialize a result, and explain why parsed data still needs validation.",
  code: `import json

payload = '{"name": "Asha", "scores": [8, 9]}'
student = json.loads(payload)
average = sum(student["scores"]) / len(student["scores"])
result = {"name": student["name"], "average": average}
print(json.dumps(result, sort_keys=True))`,
  output: `{"average": 8.5, "name": "Asha"}`,
  quiz: { question: "Which call parses JSON text into Python values?", options: ["json.loads()", "json.dumps()", "pathlib.Path()"], answer: 0 },
  visual: { nodes: [["JSON text","Input","portable format"],["json.loads","Parse","Python values"],["Validate","Check shape","keys and types"],["json.dumps","Serialize","JSON text"]], links: ["decoded by","must be checked","encoded by"], caption: "Parsing creates Python values; validation checks whether those values are safe to use." }
});

chapters[1].lessons.splice(chapters[1].lessons.findIndex((lesson) => lesson.title === "Loops: for & while") + 1, 0, {
  title: "Iteration tools & useful built-ins",
  category: "CORE BUILDING BLOCKS",
  duration: 7,
  summary: "Use Python's built-ins to iterate, combine, sort, and summarize data clearly.",
  theory: "Built-ins often make common loops clearer. enumerate(iterable, start=1) pairs each item with a counter; zip(a, b) walks through iterables together and stops when the shortest ends; sorted() returns a new sorted list, optionally using key=. sum(), min(), max(), any(), and all() summarize values or conditions. Choose the tool that expresses the intent, and do not assume zipped inputs have equal lengths unless you check them.",
  analogy: "These built-ins are small tools for common jobs: label each item, pair matching rows, order a result, or ask one question about a whole group.",
  goal: "Use enumerate, zip, sorted, and a summary built-in to replace repetitive loop bookkeeping.",
  code: `names = ["Mina", "Ari", "Lee"]
scores = [82, 95, 88]

for number, name in enumerate(names, start=1):
    print(number, name)

ranked = sorted(zip(names, scores), key=lambda row: row[1], reverse=True)
print(ranked[0][0])
print(all(score >= 70 for score in scores))`,
  output: "1 Mina\\n2 Ari\\n3 Lee\\nAri\\nTrue",
  quiz: { question: "What does enumerate(items, start=1) provide on each pass?", options: ["An index and the current item", "Only the final item", "A sorted copy"], answer: 0 },
  visual: { nodes: [["items","Iterable","values"],["enumerate / zip","Pair","index or rows"],["sorted","Order","new list"],["all / any","Summarize","boolean"]], links: ["feeds","can organize","can answer"], caption: "Use built-ins that say what the loop is doing instead of maintaining bookkeeping by hand." }
});

chapters[1].lessons.splice(chapters[1].lessons.findIndex((lesson) => lesson.title === "Collections: choose the right container") + 1, 0, {
  title: "Mutability, references & copying",
  category: "CORE BUILDING BLOCKS",
  duration: 8,
  summary: "Understand aliases and shallow copies before changing nested collections.",
  theory: "Assignment binds another name to an object; it does not copy the object. If two names refer to the same mutable list or dictionary, a change through either name is visible through both. A shallow copy creates a new outer collection but still shares nested objects. Use copy.deepcopy only when an independent recursive copy is needed, and prefer clear construction of new values when that is simpler. Use == to compare values; reserve is for identity checks such as value is None.",
  analogy: "Two labels can point to the same box. A shallow copy gives you a new outer box but may leave the smaller boxes inside shared.",
  goal: "Identify an alias, explain a shallow-copy surprise, and choose a safe copy strategy for nested data.",
  code: `from copy import deepcopy

original = [["apples"], ["bread"]]
alias = original
shallow = original.copy()
shallow[0].append("pears")
independent = deepcopy(original)
independent[0].append("plums")

print(alias is original)
print(original)
print(independent)`,
  output: "True\\n[['apples', 'pears'], ['bread']]\\n[['apples', 'pears', 'plums'], ['bread']]",
  quiz: { question: "What does list.copy() do for a nested list?", options: ["Copies the outer list but keeps references to nested items", "Recursively copies every object", "Makes the list immutable"], answer: 0 },
  visual: { nodes: [["original","Nested list","mutable"],["alias","Same object","shared"],["shallow copy","New outside","inner shared"],["deepcopy","Recursive copy","independent"]], links: ["referenced by","copies outer only","copies nested values"], caption: "Know which objects are shared before mutating nested data." }
});

chapters[4].lessons.splice(chapters[4].lessons.findIndex((lesson) => lesson.title === "Virtual environments & pip") + 1, 0, {
  title: "Project layout & pyproject.toml",
  category: "BEYOND THE BASICS",
  duration: 8,
  summary: "Organize a small Python package and describe its build metadata in pyproject.toml.",
  theory: "A maintainable project keeps importable code, tests, and project metadata in clear places. A common package layout puts source under src/package_name/, tests under tests/, and project instructions in README.md. pyproject.toml is the standard configuration file for build backends and tools: [build-system] identifies the backend, while [project] stores metadata such as name, version, Python requirements, and dependencies. Start with a regular package containing __init__.py; choose a build backend and follow its documentation when adding build or publishing steps.",
  analogy: "A project is a labeled workshop: source code has its own shelf, tests have a checking bench, and pyproject.toml tells tools how the workshop is assembled.",
  goal: "Recognize a src-layout package and explain the roles of the [build-system] and [project] tables.",
  code: `project_files = [
    "pyproject.toml",
    "README.md",
    "src/tiny_greeter/__init__.py",
    "tests/test_greeter.py",
]
pyproject = """[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "tiny-greeter"
version = "0.1.0"
requires-python = ">=3.10"
"""
print(project_files)
print(pyproject.splitlines()[0])`,
  output: "['pyproject.toml', 'README.md', 'src/tiny_greeter/__init__.py', 'tests/test_greeter.py']\\n[build-system]",
  quiz: { question: "Which pyproject.toml table declares a build backend?", options: ["[build-system]", "[tests]", "[imports]"], answer: 0 },
  visual: { nodes: [["src/","Package code","imports"],["tests/","Checks","behavior"],["pyproject.toml","Metadata","build tools"],["Backend","Build","distribution"]], links: ["contains","checks","configures"], caption: "A clear layout and standard metadata file make a project easier to develop and package." }
});

const allLessons = chapters.flatMap((chapter) => chapter.lessons.map((lesson) => ({ ...lesson, chapter: chapter.title })));
const progressKey = "pypath-progress";
const completedKey = "pypath-completed";
const savedLessonIndex = allLessons.findIndex((lesson) => lesson.title === localStorage.getItem(progressKey));
let savedCompleted = [];
try {
  const parsed = JSON.parse(localStorage.getItem(completedKey) || "[]");
  if (Array.isArray(parsed)) savedCompleted = parsed.filter((index) => Number.isInteger(index) && index >= 0 && index < allLessons.length);
} catch (error) {
  console.warn("Saved Python completion data could not be read.", error);
}
const state = { index: savedLessonIndex >= 0 ? savedLessonIndex : 0, completed: new Set(savedCompleted), quizAnswered: false, view: "learn" };
const byId = (id) => document.getElementById(id);
let flowTimer = null;
let flowPosition = -1;
let currentFlowValues = [];
const escapeHtml = (text) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function renderCurriculum(filter = "") {
  const root = byId("curriculum");
  root.innerHTML = "";
  let matches = 0;
  chapters.forEach((chapter, chapterIndex) => {
    const filteredLessons = chapter.lessons.map((lesson, lessonIndex) => ({ lesson, lessonIndex })).filter(({ lesson }) => lesson.title.toLowerCase().includes(filter.toLowerCase()) || lesson.category.toLowerCase().includes(filter.toLowerCase()));
    if (!filteredLessons.length) return;
    matches += filteredLessons.length;
    const section = document.createElement("section");
    const isActiveChapter = filteredLessons.some(({ lesson }) => lesson.title === allLessons[state.index].title);
    const expanded = window.curriculumAccordionsExpanded === null ? isActiveChapter : window.curriculumAccordionsExpanded;
    section.className = `chapter${expanded ? "" : " closed"}`;
    const toggle = document.createElement("button");
    toggle.className = "chapter-toggle";
    toggle.innerHTML = `<span class="chapter-symbol">${schoolIcon("layers")}</span><span>${escapeHtml(chapter.title)}</span><span class="chevron">⌄</span>`;
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.addEventListener("click", () => {
      window.curriculumAccordionsExpanded = null;
      byId("expand-curriculum").textContent = "Expand all";
      section.classList.toggle("closed");
      toggle.setAttribute("aria-expanded", String(!section.classList.contains("closed")));
    });
    const list = document.createElement("div");
    list.className = "chapter-lessons";
    const subgroups = new Map();
    filteredLessons.forEach((entry) => {
      const name = curriculumSubgroup(entry.lesson.title, false);
      if (!subgroups.has(name)) subgroups.set(name, []);
      subgroups.get(name).push(entry);
    });
    subgroups.forEach((groupLessons, name) => {
      const subgroup = document.createElement("section");
      const subgroupExpanded = window.curriculumAccordionsExpanded === true ||
        (window.curriculumAccordionsExpanded === null && groupLessons.some(({ lesson }) => lesson.title === allLessons[state.index].title));
      subgroup.className = `curriculum-subgroup${subgroupExpanded ? "" : " closed"}`;
      const subgroupToggle = document.createElement("button");
      subgroupToggle.className = "subgroup-toggle";
      subgroupToggle.type = "button";
      subgroupToggle.setAttribute("aria-expanded", String(subgroupExpanded));
      subgroupToggle.innerHTML = `<span>${escapeHtml(name)}</span><small>${groupLessons.length}</small><span class="subgroup-chevron">⌄</span>`;
      subgroupToggle.addEventListener("click", () => {
        window.curriculumAccordionsExpanded = null;
        byId("expand-curriculum").textContent = "Expand all";
        subgroup.classList.toggle("closed");
        subgroupToggle.setAttribute("aria-expanded", String(!subgroup.classList.contains("closed")));
      });
      const subgroupLessons = document.createElement("div");
      subgroupLessons.className = "subgroup-lessons";
      groupLessons.forEach(({ lesson }) => {
        const globalIndex = allLessons.findIndex((item) => item.title === lesson.title);
        const item = document.createElement("button");
        item.className = `lesson-link${globalIndex === state.index ? " active" : ""}${state.completed.has(globalIndex) ? " completed" : ""}`;
        item.innerHTML = `<span class="lesson-check" aria-hidden="true"></span><span>${escapeHtml(lesson.title)}</span>`;
        item.setAttribute("aria-current", globalIndex === state.index ? "page" : "false");
        item.addEventListener("click", () => { state.index = globalIndex; renderLesson(); byId("sidebar").classList.remove("open"); byId("mobile-scrim").classList.remove("show"); });
        subgroupLessons.appendChild(item);
      });
      subgroup.append(subgroupToggle, subgroupLessons);
      list.appendChild(subgroup);
    });
    section.append(toggle, list);
    root.appendChild(section);
  });
  byId("curriculum-count").textContent = filter ? String(matches) : String(allLessons.length);
  if (!matches) root.innerHTML = '<div class="empty-state">No lessons match that search. Try another topic or keyword.</div>';
}

function highlightCode(source) {
  const pattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b(?:class|def|return|if|elif|else|for|in|while|import|from|as|with|try|except|finally|raise|yield|async|await|True|False|None|and|or|not|is|lambda|pass|break|continue)\b|\b\d+(?:\.\d+)?\b|\b(?:print|len|range|list|int|str|super|open|enumerate|zip|map|filter|set|dict|tuple|type)\b)/g;
  let result = "";
  let lastIndex = 0;
  for (const match of source.matchAll(pattern)) {
    result += escapeHtml(source.slice(lastIndex, match.index));
    const token = match[0];
    const className = token.startsWith("#") ? "comment" : token.startsWith('"') || token.startsWith("'") ? "str" : /^\d/.test(token) ? "num" : /^(print|len|range|list|int|str|super|open|enumerate|zip|map|filter|set|dict|tuple|type)$/.test(token) ? "fn" : "kw";
    result += `<span class="${className}">${escapeHtml(token)}</span>`;
    lastIndex = match.index + token.length;
  }
  return result + escapeHtml(source.slice(lastIndex));
}

function showFlowStep(index) {
  const stage = byId("visual-stage");
  const steps = [...stage.querySelectorAll(".simulation-step")];
  if (!steps.length) return;
  flowPosition = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[flowPosition];
  stage.querySelector(".lesson-simulation")?.updateStep(flowPosition);
  byId("flow-step").textContent = `Step ${flowPosition + 1} of ${steps.length} - ${step.dataset.title}`;
  byId("flow-value").textContent = step.dataset.detail || step.dataset.title;
  byId("flow-insight").textContent = currentFlowValues[flowPosition] || step.dataset.detail;
}
function advanceFlow() {
  if (flowPosition >= currentFlowValues.length - 1) {
    window.clearInterval(flowTimer);
    flowTimer = null;
    byId("flow-play-button").innerHTML = `${schoolIcon("arrow")}<span>Replay simulation</span>`;
    return;
  }
  showFlowStep(flowPosition + 1);
  if (flowPosition === currentFlowValues.length - 1) {
    window.clearInterval(flowTimer);
    flowTimer = null;
    byId("flow-play-button").innerHTML = `${schoolIcon("arrow")}<span>Replay simulation</span>`;
  }
}

function playFlow() {
  if (flowTimer) {
    window.clearInterval(flowTimer);
    flowTimer = null;
    byId("flow-play-button").innerHTML = `${schoolIcon("arrow")}<span>Resume simulation</span>`;
    return;
  }
  if (flowPosition >= currentFlowValues.length - 1) {
    flowPosition = 0;
    byId("visual-stage").querySelectorAll(".simulation-step").forEach((node) => node.classList.remove("flow-current", "flow-passed"));
    showFlowStep(0);
  }
  if (flowPosition < currentFlowValues.length - 1) {
    byId("flow-play-button").innerHTML = `${schoolIcon("collapse")}<span>Pause simulation</span>`;
    flowTimer = window.setInterval(advanceFlow, 950);
  }
}

function renderVisual(visual, lesson) {
  if (flowTimer) window.clearInterval(flowTimer);
  flowTimer = null; flowPosition = -1;
  const simulation = buildPythonConceptVisual(lesson);
  currentFlowValues = simulation.values;
  byId("visual-stage").replaceChildren(simulation.element);
  byId("visual-stage").querySelectorAll(".simulation-step").forEach((button) => button.addEventListener("click", () => {
    if (flowTimer) window.clearInterval(flowTimer); flowTimer = null;
    showFlowStep(Number(button.dataset.index));
    byId("flow-play-button").innerHTML = `${schoolIcon("arrow")}<span>${flowPosition === currentFlowValues.length - 1 ? "Replay simulation" : "Resume simulation"}</span>`;
  }));
  byId("visual-caption").textContent = visual.caption;
  byId("flow-play-button").innerHTML = `${schoolIcon("arrow")}<span>Run simulation</span>`;
  showFlowStep(0);
}
function renderQuiz(quiz) {
  const options = byId("quiz-options");
  options.replaceChildren();
  byId("quiz-question").textContent = quiz.question;
  byId("quiz-feedback").textContent = "";
  byId("quiz-feedback").className = "quiz-feedback";
  state.quizAnswered = false;
  quiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (state.quizAnswered) return;
      state.quizAnswered = true;
      const correct = index === quiz.answer;
      button.classList.add(correct ? "correct" : "incorrect");
      if (!correct) options.children[quiz.answer].classList.add("correct");
      const feedback = byId("quiz-feedback");
      feedback.textContent = correct ? "Exactly right — nice work!" : `Not quite. The best answer is: ${quiz.options[quiz.answer]}`;
      if (!correct) feedback.classList.add("wrong");
    });
    options.appendChild(button);
  });
}

function renderCheatSheet(filter = "") {
  const grid = byId("cheat-grid");
  const term = filter.toLowerCase();
  let visibleItems = 0;
  grid.innerHTML = "";
  cheatSheet.forEach((section) => {
    const items = section.items.filter(([title, code]) => `${section.category} ${title} ${code}`.toLowerCase().includes(term));
    if (!items.length) return;
    visibleItems += items.length;
    const card = document.createElement("section");
    card.className = "cheat-card";
    const heading = document.createElement("h2");
    const cardId = `cheat-${section.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    heading.innerHTML = `${schoolIcon(schoolIconForSymbol(section.icon))}<span>${escapeHtml(section.category)}</span><button class="cheat-card-toggle" type="button" aria-expanded="${window.allAccordionsExpanded === true}" aria-controls="${cardId}"><span class="section-chevron" aria-hidden="true"></span></button>`;
    const body = document.createElement("div");
    body.className = "cheat-body";
    body.id = cardId;
    body.hidden = window.allAccordionsExpanded !== true;
    heading.querySelector(".cheat-card-toggle").addEventListener("click", (event) => {
      body.hidden = !body.hidden;
      event.currentTarget.setAttribute("aria-expanded", String(!body.hidden));
    });
    card.append(heading, body);
    items.forEach(([title, code]) => {
      const item = document.createElement("div");
      item.className = "cheat-item";
      item.innerHTML = `<div class="cheat-item-top"><span>${escapeHtml(title)}</span><button class="cheat-copy" type="button" data-code="${escapeHtml(code)}">Copy</button></div><pre><code>${escapeHtml(code)}</code></pre>`;
      body.appendChild(item);
    });
    grid.appendChild(card);
  });
  if (!visibleItems) grid.innerHTML = '<div class="resource-empty">No cheat-sheet entries match your search.</div>';
  byId("cheat-count").textContent = `${visibleItems} reference${visibleItems === 1 ? "" : "s"}`;
}

function renderInterviewQuestions() {
  const list = byId("question-list");
  const term = byId("question-search").value.trim().toLowerCase();
  const category = byId("question-category").value;
  const matches = interviewQuestions.map((entry, index) => ({ entry, index })).filter(({ entry }) => {
    const [topic, question, answer] = entry;
    return (!category || topic === category) && `${topic} ${question} ${answer}`.toLowerCase().includes(term);
  });
  list.replaceChildren();
  matches.forEach(({ entry, index }) => {
    const [topic, question, answer] = entry;
    const item = document.createElement("details");
    item.className = "question-item";
    item.open = window.allAccordionsExpanded === true;
    const summary = document.createElement("summary");
    summary.innerHTML = `<span class="question-number">${String(index + 1).padStart(3, "0")}</span><span class="question-text">${escapeHtml(question)}</span><span class="question-category-tag">${escapeHtml(topic)}</span><span class="question-chevron">⌄</span>`;
    const answerText = document.createElement("p");
    answerText.className = "question-answer";
    answerText.textContent = answer;
    item.append(summary, answerText);
    list.appendChild(item);
  });
  if (!matches.length) list.innerHTML = '<div class="resource-empty">No questions match those filters. Try a different search or topic.</div>';
  byId("question-count").textContent = `${matches.length} of ${interviewQuestions.length} questions`;
}

function renderInterviewPrograms() {
  const list = byId("program-list");
  const term = byId("program-search").value.trim().toLowerCase();
  const category = byId("program-category").value;
  const matches = interviewPrograms.map((program, index) => ({ program, index })).filter(({ program }) => {
    return (!category || program.category === category) &&
      `${program.category} ${program.title} ${program.difficulty} ${program.prompt} ${program.approach} ${program.code}`.toLowerCase().includes(term);
  });
  list.replaceChildren();
  matches.forEach(({ program, index }) => {
    const card = document.createElement("article");
    card.className = "program-card";
    const expanded = window.allAccordionsExpanded === true;
    const heading = document.createElement("div");
    heading.className = "program-heading";
    heading.innerHTML = `<span class="program-number">${String(index + 1).padStart(2, "0")}</span><div class="program-title-group"><h2>${escapeHtml(program.title)}</h2><span class="question-category-tag">${escapeHtml(program.category)}</span><span class="program-difficulty ${program.difficulty.toLowerCase()}">${escapeHtml(program.difficulty)}</span></div><button class="program-toggle" type="button" aria-expanded="${expanded}">${expanded ? "Hide solution" : "Show solution"}</button>`;
    const prompt = document.createElement("p");
    prompt.className = "program-prompt";
    prompt.textContent = program.prompt;
    const solution = document.createElement("div");
    solution.className = "program-solution";
    solution.hidden = !expanded;
    solution.innerHTML = `<div class="program-approach"><strong>Approach</strong><p>${escapeHtml(program.approach)}</p><small>${escapeHtml(program.complexity)}</small></div><div class="program-code-heading"><strong>Python solution</strong><button class="cheat-copy program-copy" type="button" data-program-index="${index}">Copy code</button></div><div class="code-window"><div class="code-window-top"><div class="window-dots"><i></i><i></i><i></i></div><span>solution.py</span><span class="python-chip">PYTHON 3</span></div><pre><code>${highlightCode(program.code)}</code></pre><div class="output-bar"><span class="output-label"><span>›</span> SAMPLE OUTPUT</span><span class="program-output"></span></div></div>`;
    solution.querySelector(".program-output").textContent = program.output;
    heading.querySelector(".program-toggle").addEventListener("click", (event) => {
      const button = event.currentTarget;
      solution.hidden = !solution.hidden;
      button.setAttribute("aria-expanded", String(!solution.hidden));
      button.textContent = solution.hidden ? "Show solution" : "Hide solution";
    });
    card.append(heading, prompt, solution);
    list.appendChild(card);
  });
  if (!matches.length) list.innerHTML = '<div class="resource-empty">No programs match those filters. Try another search or topic.</div>';
  byId("program-count").textContent = `${matches.length} of ${interviewPrograms.length} programs`;
}

function setView(view) {
  document.body.dataset.printView = view;
  byId("resource-accordion").open = view !== "learn";
  const labels = { learn: ["Learning path", "Getting started"], cheatsheet: ["Study resources", "Interview cheat sheet"], interview: ["Study resources", "Interview Q&A"], programs: ["Study resources", "Interview programs"], mock: ["Practice", "Mock exam"] };
  state.view = view;
  document.querySelectorAll(".study-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  byId("lesson-view").hidden = view !== "learn";
  byId("cheatsheet-view").hidden = view !== "cheatsheet";
  byId("interview-view").hidden = view !== "interview";
  byId("programs-view").hidden = view !== "programs";
  byId("mock-exam-view").hidden = view !== "mock";
  byId("curriculum-accordion").hidden = view !== "learn";
  byId("breadcrumb-root").textContent = labels[view][0];
  byId("breadcrumb-topic").textContent = view === "learn" ? allLessons[state.index].chapter : labels[view][1];
  byId("search").closest(".search-box").hidden = view !== "learn";
  if (view === "cheatsheet") renderCheatSheet(byId("cheat-search").value.trim());
  if (view === "interview") renderInterviewQuestions();
  if (view === "mock") window.startMockExam?.();
  if (view === "programs") renderInterviewPrograms();
  byId("sidebar").classList.remove("open");
  byId("mobile-scrim").classList.remove("show");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderLesson() {
  if (window.lessonNarrator) window.lessonNarrator.stop();
  const lesson = allLessons[state.index];
  localStorage.setItem(progressKey, lesson.title);
  byId("breadcrumb-topic").textContent = lesson.chapter;
  byId("lesson-category").textContent = lesson.category;
  byId("lesson-duration").textContent = `${lesson.duration} MIN READ`;
  byId("lesson-title").textContent = lesson.title;
  byId("lesson-summary").textContent = lesson.summary;
  byId("lesson-theory").textContent = lesson.theory;
  byId("lesson-analogy").textContent = lesson.analogy;
  byId("lesson-goal").textContent = lesson.goal;
  byId("goal-duration").textContent = String(lesson.duration);
  byId("lesson-code").innerHTML = highlightCode(lesson.code);
  byId("lesson-output").textContent = lesson.output.replace(/\\n/g, "\n");
  byId("footer-position").textContent = `${String(state.index + 1).padStart(2, "0")} / ${allLessons.length}`;
  byId("prev-button").disabled = state.index === 0;
  byId("next-button").disabled = state.index === allLessons.length - 1;
  const complete = state.completed.has(state.index);
  byId("complete-button").classList.toggle("done", complete);
  byId("complete-button").querySelector(".complete-label").textContent = complete ? "Completed" : "Mark complete";
  renderVisual(lesson.visual, lesson);
  renderQuiz(lesson.quiz);
  renderCurriculum(byId("search").value);
  const progress = Math.round((state.completed.size / allLessons.length) * 100);
  byId("course-progress").style.width = `${progress}%`;
  byId("course-progress").parentElement.setAttribute("aria-valuenow", String(progress));
  byId("progress-label").textContent = `${progress}%`;
  byId("lesson-count").textContent = `${state.completed.size} of ${allLessons.length} lessons`;
  window.lessonSectionProgress?.render();
}

function moveLesson(offset) {
  state.index = Math.max(0, Math.min(allLessons.length - 1, state.index + offset));
  renderLesson();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

byId("complete-button").addEventListener("click", () => {
  if (window.lessonSectionProgress) {
    window.lessonSectionProgress.setAll(state.index, !state.completed.has(state.index));
    return;
  }
  if (state.completed.has(state.index)) state.completed.delete(state.index);
  else state.completed.add(state.index);
  localStorage.setItem(completedKey, JSON.stringify([...state.completed]));
  renderLesson();
});
byId("clear-progress-button").addEventListener("click", () => {
  if (!window.confirm("Clear your Python course progress? This will remove completed lessons and restart at the first lesson.")) return;
  state.completed.clear();
  window.lessonSectionProgress?.reset();
  state.index = 0;
  localStorage.removeItem(progressKey);
  localStorage.removeItem(completedKey);
  renderLesson();
  showToast("Python progress cleared");
});
byId("prev-button").addEventListener("click", () => moveLesson(-1));
byId("next-button").addEventListener("click", () => moveLesson(1));
byId("flow-play-button").addEventListener("click", playFlow);
document.querySelectorAll(".section-collapse-button").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    window.setLessonSectionExpanded(button, !expanded);
  });
});
byId("search").addEventListener("input", (event) => renderCurriculum(event.target.value.trim()));
byId("expand-curriculum").addEventListener("click", () => {
  window.curriculumAccordionsExpanded = window.curriculumAccordionsExpanded !== true;
  byId("expand-curriculum").textContent = window.curriculumAccordionsExpanded ? "Collapse all" : "Expand all";
  renderCurriculum(byId("search").value.trim());
});
document.querySelectorAll(".study-tab").forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));
byId("cheat-search").addEventListener("input", (event) => renderCheatSheet(event.target.value.trim()));
byId("question-search").addEventListener("input", renderInterviewQuestions);
byId("question-category").addEventListener("change", renderInterviewQuestions);
byId("program-search").addEventListener("input", renderInterviewPrograms);
byId("program-category").addEventListener("change", renderInterviewPrograms);

byId("program-total").textContent = String(interviewPrograms.length);
byId("program-list").addEventListener("click", async (event) => {
  const button = event.target.closest(".program-copy");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(interviewPrograms[Number(button.dataset.programIndex)].code);
    showToast("Program copied to clipboard");
  } catch (error) {
    showToast("Clipboard access isn't available in this browser");
  }
});
byId("print-cheatsheet").addEventListener("click", () => {
  const search = byId("cheat-search"); const query = search.value;
  search.value = ""; renderCheatSheet(""); document.body.dataset.printView = "cheatsheet";
  window.addEventListener("afterprint", () => { search.value = query; renderCheatSheet(query.trim()); document.body.dataset.printView = state.view; }, { once: true });
  window.print();
});
byId("cheat-grid").addEventListener("click", async (event) => {
  const button = event.target.closest(".cheat-copy");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.code);
    showToast("Snippet copied to clipboard");
  } catch (error) {
    showToast("Clipboard access isn't available in this browser");
  }
});
byId("copy-button").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(allLessons[state.index].code);
    showToast("Code copied to clipboard");
  } catch (error) {
    showToast("Clipboard access isn't available in this browser");
  }
});
byId("menu-button").addEventListener("click", () => { byId("sidebar").classList.add("open"); byId("mobile-scrim").classList.add("show"); });
byId("mobile-scrim").addEventListener("click", () => { byId("sidebar").classList.remove("open"); byId("mobile-scrim").classList.remove("show"); });
document.querySelectorAll(".aside-link").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelectorAll(".aside-link").forEach((item) => item.classList.remove("active"));
  link.classList.add("active");
  const sections = ["idea", "visual", "code", "practice"];
  const target = [".concept-card", ".visual-card", ".code-card", ".practice-card"][sections.indexOf(link.getAttribute("href").slice(1))];
  document.querySelector(target).scrollIntoView({ behavior: "smooth", block: "start" });
}));
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    byId(state.view === "cheatsheet" ? "cheat-search" : state.view === "interview" ? "question-search" : state.view === "programs" ? "program-search" : state.view === "mock" ? "mock-answer" : "search").focus();
  }
  if (byId("lesson-view").hidden || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "SELECT") return;
  if (event.key === "ArrowRight") moveLesson(1);
  if (event.key === "ArrowLeft") moveLesson(-1);
});

new Set(interviewQuestions.map(([category]) => category)).forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  byId("question-category").appendChild(option);
});
new Set(interviewPrograms.map(({ category }) => category)).forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  byId("program-category").appendChild(option);
});
if (interviewQuestions.length !== 100) throw new Error(`Expected 100 interview questions, found ${interviewQuestions.length}`);
if (interviewPrograms.length !== 36) throw new Error(`Expected 36 interview programs, found ${interviewPrograms.length}`);
window.lessonSectionProgress = window.createLessonSectionProgress({
  course: "python",
  getIndex: () => state.index,
  getCompleted: () => state.completed,
  setCompleted: (value) => { state.completed = value; },
  saveCompleted: () => localStorage.setItem(completedKey, JSON.stringify([...state.completed])),
  onChange: () => renderLesson()
});
window.lessonNarrator = setupLessonAudio(() => allLessons[state.index], false);
renderLesson();
renderCheatSheet();
