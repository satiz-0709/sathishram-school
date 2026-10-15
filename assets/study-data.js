const cheatSheet = [
  {
    category: "Core syntax",
    icon: "⌨",
    items: [
      ["Assignment / equality", "x = 5    # assign\nx == 5   # compare"],
      ["f-strings", "name = \"Ada\"\nprint(f\"Hello, {name}!\")"],
      ["Truthiness", "Falsy: False, None, 0, \"\", [], {}, set()\nMost other values are truthy."],
      ["Unpacking", "first, *middle, last = [1, 2, 3, 4]"],
      ["Identity vs equality", "a == b   # same value?\na is b    # same object?"]
    ]
  },
  {
    category: "Collections",
    icon: "▦",
    items: [
      ["List: mutable sequence", "items = [\"a\", \"b\"]\nitems.append(\"c\")"],
      ["Tuple: immutable sequence", "point = (3, 7)\nx, y = point"],
      ["Dictionary: key → value", "user = {\"name\": \"Sam\"}\nname = user.get(\"name\", \"Guest\")"],
      ["Set: unique values", "unique = set([1, 1, 2])  # {1, 2}\ncommon = {1, 2} & {2, 3}"],
      ["Comprehensions", "squares = [n*n for n in range(6)]\nlookup = {n: n*n for n in range(6)}"]
    ]
  },
  {
    category: "Control flow & functions",
    icon: "↗",
    items: [
      ["Conditional expression", "label = \"adult\" if age >= 18 else \"minor\""],
      ["Loop with index", "for index, item in enumerate(items):\n    print(index, item)"],
      ["Loop over pairs", "for key, value in mapping.items():\n    print(key, value)"],
      ["Function with defaults", "def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}\""],
      ["Args and kwargs", "def inspect(*args, **kwargs):\n    print(args, kwargs)"],
      ["Lambda", "by_length = sorted(words, key=lambda word: len(word))"],
      ["Generator expression", "total = sum(value * value for value in numbers)"],
      ["Guard clause", "def divide(a, b):\n    if b == 0:\n        raise ValueError(\"b cannot be zero\")\n    return a / b"]
    ]
  },
  {
    category: "Object-oriented Python",
    icon: "◇",
    items: [
      ["Class & instance", "class Dog:\n    def __init__(self, name):\n        self.name = name"],
      ["Instance method", "def speak(self):\n    return f\"{self.name} says woof\""],
      ["Class method", "@classmethod\ndef from_text(cls, text):\n    return cls(text.strip())"],
      ["Static method", "@staticmethod\ndef is_valid(value):\n    return value >= 0"],
      ["Property", "@property\ndef name(self):\n    return self._name"],
      ["Inheritance", "class Puppy(Dog):\n    def speak(self):\n        return super().speak()"],
      ["Dataclass", "from dataclasses import dataclass\n@dataclass\nclass Point:\n    x: float\n    y: float"],
      ["Special methods", "__init__  construct\n__repr__  developer representation\n__len__   support len(obj)"]
    ]
  },
  {
    category: "Errors, files & context",
    icon: "⌁",
    items: [
      ["Handle a specific exception", "try:\n    number = int(text)\nexcept ValueError:\n    number = 0"],
      ["Raise an error", "if not username:\n    raise ValueError(\"username is required\")"],
      ["Read a text file safely", "from pathlib import Path\ntext = Path(\"notes.txt\").read_text(encoding=\"utf-8\")"],
      ["Write a text file", "Path(\"notes.txt\").write_text(text, encoding=\"utf-8\")"],
      ["Context manager", "with open(path, encoding=\"utf-8\") as file:\n    text = file.read()"]
    ]
  },
  {
    category: "Useful built-ins & idioms",
    icon: "✳",
    items: [
      ["Sort without mutating", "ordered = sorted(items, key=..., reverse=True)"],
      ["Sort a list in place", "items.sort(key=...)  # returns None"],
      ["Any / all", "any(is_valid(x) for x in values)\nall(is_valid(x) for x in values)"],
      ["Zip sequences", "for name, score in zip(names, scores):\n    print(name, score)"],
      ["Safe dictionary lookup", "value = config.get(\"timeout\", 30)"],
      ["Type check (carefully)", "isinstance(value, int)  # also True for bool"],
      ["Copy a list", "shallow = original.copy()  # nested items are shared"],
      ["None check", "if result is None:\n    ..."]
    ]
  },
  {
    category: "Interview gotchas",
    icon: "⚑",
    items: [
      ["Mutable default argument", "def add(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items"],
      ["Late binding in closures", "funcs = [lambda n=n: n for n in range(3)]\n# Default captures each current n"],
      ["Shallow vs deep copy", "import copy\nshallow = copy.copy(value)\ndeep = copy.deepcopy(value)"],
      ["Floating-point equality", "import math\nmath.isclose(0.1 + 0.2, 0.3)"],
      ["String immutability", "text = \"hello\"\ntext = text.upper()  # a new string"],
      ["Argument passing", "Names are bound to objects; mutation may be visible,\nrebinding a local name does not rebind the caller."],
      ["Big-O basics", "List append: amortized O(1)\nList search: O(n)\nDict/set lookup: average O(1)"],
      ["Main guard", "if __name__ == \"__main__\":\n    main()"]
    ]
  },
  {
    category: "Modules & environments",
    icon: "M",
    items: [
      ["Import a module", "import math\nprint(math.sqrt(16))"],
      ["Import a named value", "from pathlib import Path"],
      ["Protect the entry point", "if __name__ == \"__main__\":\n    main()"],
      ["Create a virtual environment", "python -m venv .venv\npython -m pip install requests"],
      ["Record dependencies", "python -m pip freeze > requirements.txt"]
    ]
  },
  {
    category: "Iteration & decorators",
    icon: "I",
    items: [
      ["Iterator protocol", "iterator = iter(values)\nfirst = next(iterator)"],
      ["Generator function", "def count_up_to(limit):\n    for number in range(limit):\n        yield number"],
      ["Generator expression", "total = sum(number * number for number in values)"],
      ["Decorator wrapper", "from functools import wraps\n\ndef log_call(function):\n    @wraps(function)\n    def wrapper(*args, **kwargs):\n        return function(*args, **kwargs)\n    return wrapper"]
    ]
  },
  {
    category: "Testing, types & async",
    icon: "T",
    items: [
      ["Test normal and edge cases", "def square(number):\n    return number * number\n\nassert square(4) == 16\nassert square(0) == 0"],
      ["Add a type hint", "def greet(name: str) -> str:\n    return f\"Hello, {name}\""],
      ["Define a dataclass", "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float"],
      ["Await I/O work", "import asyncio\n\nasync def main():\n    result = await fetch_data()\n    return result\n\nasyncio.run(main())"],
      ["Debug with a traceback", "try:\n    process(data)\nexcept ValueError as error:\n    print(f\"Invalid data: {error}\")\n    raise"]
    ]
  },
  {
    category: "Safe agent tools",
    icon: "A",
    items: [
      ["Allowlist tool names", "tools = {\"add\": add, \"multiply\": multiply}\nif selected_tool not in tools:\n    raise ValueError(\"Tool is not allowed\")"],
      ["Validate arguments", "if not isinstance(value, int):\n    raise TypeError(\"value must be an integer\")"],
      ["Bound repeated work", "for attempt in range(max_attempts):\n    result = run_step()\n    if result.is_complete:\n        break"]
    ]
  }
];

const interviewQuestions = [
  ["Python fundamentals", "What is Python?", "Python is a high-level, general-purpose programming language known for readable syntax and a broad ecosystem. It supports procedural, object-oriented, and functional styles."],
  ["Python fundamentals", "Is Python compiled or interpreted?", "Both descriptions apply in different stages. CPython compiles source to bytecode, then its virtual machine executes that bytecode. Other Python implementations may work differently."],
  ["Python fundamentals", "What does dynamically typed mean?", "Names are not declared with fixed types. Objects have types, and a name can be rebound to objects of different types while the program runs."],
  ["Python fundamentals", "What is strong typing in Python?", "Python generally does not silently coerce unrelated types; incompatible operations usually raise errors. For example, adding a string and an integer requires an explicit conversion."],
  ["Python fundamentals", "What is PEP 8?", "PEP 8 is the widely used style guide for Python code. It recommends conventions for naming, formatting, imports, and readable layout."],
  ["Python fundamentals", "Why is indentation significant?", "Indentation defines statement blocks in Python. Consistent indentation is part of the syntax, so incorrect indentation can change meaning or raise IndentationError."],
  ["Python fundamentals", "What is the difference between a comment and a docstring?", "A comment explains code to readers and starts with #. A docstring is a string literal placed at the start of a module, class, or function and is available through documentation tools."],
  ["Python fundamentals", "What is None?", "None is Python's singleton object representing the absence of a value. Test it with is None rather than equality."],
  ["Python fundamentals", "What is the difference between == and is?", "== checks value equality according to an object's equality behavior. is checks whether two references point to the exact same object."],
  ["Python fundamentals", "What values are falsy in Python?", "Common falsy values include False, None, numeric zero, and empty strings and collections. Custom objects can define truthiness with __bool__ or __len__."],
  ["Python fundamentals", "What is a mutable object?", "A mutable object can be changed in place after creation. Lists, dictionaries, and sets are mutable; strings, tuples, integers, and frozensets are immutable."],
  ["Python fundamentals", "What is the difference between list and tuple?", "Both are ordered sequences. Lists are mutable and use brackets; tuples are immutable and use commas, commonly parentheses. Tuples can be hashable when all their elements are hashable."],
  ["Python fundamentals", "What is a set?", "A set is an unordered collection of unique hashable elements. It supports membership tests and operations such as union, intersection, and difference."],
  ["Python fundamentals", "What is a dictionary?", "A dictionary maps hashable keys to values. It preserves insertion order in modern Python, and average key lookup is O(1), assuming well-distributed hashes."],
  ["Python fundamentals", "What is a hashable object?", "An object is hashable when it has a stable hash value during its lifetime and equality behavior consistent with that hash. Hashable objects can be dictionary keys or set members."],
  ["Data structures", "How does list.append differ from list.extend?", "append adds its argument as one item. extend iterates over its argument and adds each yielded item to the list."],
  ["Data structures", "What is slicing?", "Slicing selects a sequence range using start:stop:step. The stop index is excluded, and omitted values use defaults."],
  ["Data structures", "What is the difference between sort() and sorted()?", "list.sort() sorts a list in place and returns None. sorted(iterable) returns a new sorted list and accepts any iterable."],
  ["Data structures", "How do you remove duplicates from a list?", "Use a set when order does not matter. To preserve first-seen order, use dict.fromkeys(items) or an explicit seen-set loop when handling special cases."],
  ["Data structures", "What is a shallow copy?", "A shallow copy creates a new outer container but retains references to the same nested objects. Mutating a shared nested object is visible through both containers."],
  ["Data structures", "What is a deep copy?", "A deep copy recursively copies objects within a compound object where possible. copy.deepcopy is useful when nested mutable state must be independent, but can be expensive or unsuitable for some resources."],
  ["Data structures", "How do dictionaries handle missing keys?", "Indexing a missing key raises KeyError. get(key, default) returns a fallback, while setdefault can insert a default when absent."],
  ["Data structures", "What is the difference between a set and a frozenset?", "A set is mutable and therefore unhashable. A frozenset is immutable and hashable if its elements are hashable, so it can be used as a dictionary key."],
  ["Data structures", "What does enumerate() do?", "enumerate(iterable, start=0) yields index-item pairs, avoiding manual index counters in loops."],
  ["Data structures", "What does zip() do?", "zip combines iterables position by position and stops at the shortest input by default. Use strict=True in supported Python versions when unequal lengths should raise an error."],
  ["Data structures", "What are *args and **kwargs?", "*args collects extra positional arguments into a tuple. **kwargs collects extra keyword arguments into a dictionary."],
  ["Data structures", "What is iterable unpacking?", "Unpacking assigns elements from an iterable to names, such as a, b = pair. A starred target, such as first, *rest = values, captures remaining items into a list."],
  ["Data structures", "How do you combine two dictionaries?", "Use {**a, **b} or a | b in Python 3.9 and later. On key collisions, the later mapping's value wins."],
  ["Data structures", "What is the average time complexity of dictionary lookup?", "Average-case lookup is O(1), but collisions and unusual hash behavior can worsen performance. The exact cost also depends on hashing the key."],
  ["Control flow & functions", "What is the difference between for and while?", "A for loop iterates over an iterable's items. A while loop repeats as long as a condition is true and needs a clear way to reach termination."],
  ["Control flow & functions", "What does range(5) produce?", "It is a range object representing 0, 1, 2, 3, and 4. The stop value is excluded; the object can be iterated without first allocating a list."],
  ["Control flow & functions", "What is a function parameter versus an argument?", "A parameter is a name in a function definition. An argument is the value or expression supplied when calling the function."],
  ["Control flow & functions", "What happens if a function has no return statement?", "It returns None implicitly. A bare return also returns None."],
  ["Control flow & functions", "What is a lambda function?", "A lambda is a small anonymous function containing one expression. Use a named def when behavior needs multiple statements, documentation, or a meaningful reusable name."],
  ["Control flow & functions", "What is a list comprehension?", "A compact expression that creates a list by iterating over an iterable, optionally filtering items, and evaluating an output expression for each included item."],
  ["Control flow & functions", "What is a generator expression?", "A lazy expression like (x*x for x in values) that yields values one at a time instead of building a full list in memory."],
  ["Control flow & functions", "What does yield do?", "yield produces a value from a generator and suspends execution, preserving local state so the generator can resume on the next request."],
  ["Control flow & functions", "What is the LEGB scope rule?", "Python looks up local, enclosing, global, and built-in scopes in that order. The rule explains how an unqualified name is resolved."],
  ["Control flow & functions", "What is a closure?", "A closure is a function that retains access to names from its enclosing scope after that outer function has returned."],
  ["Control flow & functions", "What is a decorator?", "A decorator is a callable that takes a function or class and returns a replacement, commonly a wrapper that adds behavior. The @ syntax applies it at definition time."],
  ["Control flow & functions", "What does functools.wraps do?", "It copies important metadata such as the wrapped function's name and docstring onto a wrapper, improving introspection and documentation."],
  ["Control flow & functions", "What is recursion?", "Recursion is when a function calls itself, directly or indirectly. It needs a base case and a progressing recursive case to terminate."],
  ["Control flow & functions", "What is a mutable default argument pitfall?", "Default expressions are evaluated once when the function is defined, not on each call. A default list can therefore be shared across calls; use None and create a fresh list inside."],
  ["Object-oriented Python", "What is a class?", "A class defines a type by grouping data and behavior. Instances created from it hold per-object state and use its methods."],
  ["Object-oriented Python", "What is an instance?", "An instance is a concrete object created from a class. It has identity and may have state in instance attributes."],
  ["Object-oriented Python", "What is self?", "self is the conventional name for the first parameter of an instance method. Python passes the instance when the method is called through that instance."],
  ["Object-oriented Python", "What is __init__?", "__init__ initializes an already-created instance after construction. It is not the method that actually creates the instance; __new__ handles that step."],
  ["Object-oriented Python", "What is the difference between a class and an instance attribute?", "A class attribute is stored on the class and can be shared or inherited. An instance attribute belongs to one instance and commonly stores its individual state."],
  ["Object-oriented Python", "What is inheritance?", "Inheritance creates a subclass based on a base class, allowing it to reuse or specialize behavior. It models an is-a relationship."],
  ["Object-oriented Python", "What does super() do?", "super() provides a proxy for calling the next implementation in the method resolution order. It supports cooperative inheritance when classes use it consistently."],
  ["Object-oriented Python", "What is method overriding?", "A subclass provides its own implementation of a method defined by a base class. Calls on subclass instances use the overriding implementation according to method resolution order."],
  ["Object-oriented Python", "What is polymorphism?", "Polymorphism lets different types be used through a common operation or interface, with each type providing appropriate behavior."],
  ["Object-oriented Python", "What is duck typing?", "Duck typing focuses on the operations an object supports rather than requiring it to inherit from a particular class. If it provides the needed behavior, it can be used."],
  ["Object-oriented Python", "What is encapsulation in Python?", "Encapsulation groups state and behavior behind a class interface. A leading underscore is a convention for non-public implementation details, not enforced privacy."],
  ["Object-oriented Python", "What is a property?", "@property lets a method be accessed with attribute syntax. It can compute a value or validate assignments using a setter."],
  ["Object-oriented Python", "What is the difference between @classmethod and @staticmethod?", "A class method receives the class as its first argument and is often used for alternate constructors. A static method receives neither an instance nor class automatically."],
  ["Object-oriented Python", "What is composition?", "Composition builds an object using other objects it owns or coordinates. It models a has-a relationship and can be more flexible than inheritance."],
  ["Object-oriented Python", "What is a dataclass?", "dataclasses.dataclass decorates a class to generate common methods such as __init__ and __repr__, especially for classes that primarily store data."],
  ["Object-oriented Python", "What are dunder methods?", "Special methods with double underscores, such as __len__ and __iter__, let user-defined objects participate in Python syntax and built-in operations."],
  ["Object-oriented Python", "What does __repr__ provide?", "__repr__ returns a developer-oriented string representation. Ideally it is unambiguous and, where practical, useful for recreating the object."],
  ["Advanced Python", "What is an iterator?", "An iterator produces values one at a time with __next__ and raises StopIteration when exhausted. iter(iterable) obtains an iterator."],
  ["Advanced Python", "What is the difference between an iterable and an iterator?", "An iterable can provide an iterator, usually through __iter__. An iterator is the stateful object that yields successive values and is itself iterable."],
  ["Advanced Python", "What is a context manager?", "A context manager manages setup and cleanup around a with block, commonly through __enter__ and __exit__. It is useful for files, locks, and transactions."],
  ["Advanced Python", "Why use with when opening a file?", "The with statement ensures the file is closed when the block exits, including when an exception occurs. Specify an encoding for predictable text handling."],
  ["Advanced Python", "How does exception handling work?", "Put risky code in try and catch specific expected exception types with except. Use else for success-only work and finally for cleanup that should always happen."],
  ["Advanced Python", "What is the difference between raise and assert?", "raise signals an error as part of program behavior. assert checks a debugging assumption and can be disabled with optimization, so it should not validate untrusted input."],
  ["Advanced Python", "What is a module?", "A module is a Python source file whose definitions can be imported by other code. Modules provide namespaces and help organize reusable code."],
  ["Advanced Python", "What is a package?", "A package organizes related modules under a package name. Regular packages commonly include __init__.py; namespace packages can span locations without it."],
  ["Advanced Python", "What does the __name__ == \"__main__\" guard do?", "It runs a block only when the file is executed as the top-level script, not when it is imported as a module."],
  ["Advanced Python", "What is a virtual environment?", "A virtual environment is an isolated Python installation context for a project, allowing its dependencies to be managed separately from other projects."],
  ["Advanced Python", "What is a Python generator?", "A generator is an iterator that produces values lazily. Generator functions use yield and retain their state between values."],
  ["Advanced Python", "What is async and await?", "async def defines a coroutine, and await suspends it until an awaitable completes so an event loop can run other tasks in the meantime."],
  ["Advanced Python", "When is asyncio useful?", "It is useful for high-concurrency I/O-bound work where tasks spend time waiting, such as network operations. It does not automatically accelerate CPU-bound calculations."],
  ["Advanced Python", "What is a race condition?", "A race condition occurs when program results depend on unpredictable timing or interleaving of concurrent operations. Synchronization or redesign can protect shared state."],
  ["Advanced Python", "What is the GIL in CPython?", "The Global Interpreter Lock in standard CPython allows only one thread at a time to execute Python bytecode in a process. Threads can still help with I/O; multiprocessing can use multiple cores for CPU-bound Python work."],
  ["Advanced Python", "How do shallow and deep copies differ?", "A shallow copy duplicates only the outer container and shares nested references. A deep copy recursively copies nested objects where possible."],
  ["Runtime & performance", "What is the difference between bytecode and source code?", "Source code is the human-readable Python text. Bytecode is an intermediate instruction format, commonly cached in __pycache__ by CPython and executed by its virtual machine."],
  ["Runtime & performance", "How does garbage collection work in CPython?", "CPython primarily reclaims objects using reference counting and supplements it with a cyclic garbage collector to detect unreachable reference cycles."],
  ["Runtime & performance", "What is the difference between a process and a thread?", "A process has its own memory space; threads share memory within a process. Processes can use multiple CPU cores but have more communication overhead, while threads are useful for I/O concurrency."],
  ["Runtime & performance", "How do you profile Python code?", "Measure first with tools such as cProfile for CPU time or timeit for small snippets. Optimize the actual bottleneck rather than guessing."],
  ["Runtime & performance", "What is Big O notation?", "Big O describes how an algorithm's resource use grows with input size, ignoring constant factors. It helps compare scalability, such as O(n) versus O(n²)."],
  ["Runtime & performance", "Why are dictionary and set lookups usually fast?", "They use hash tables, giving average-case O(1) membership or key lookup. Worst-case behavior can be slower, and keys must be hashable."],
  ["Runtime & performance", "What is a memory leak in Python?", "Memory remains in use when objects are no longer needed but are still reachable, for example through an unintended cache or reference. Profiling and inspecting references helps locate it."],
  ["Runtime & performance", "Why can 0.1 + 0.2 differ from 0.3?", "Most decimal fractions cannot be represented exactly in binary floating point, so rounding occurs. Use math.isclose for approximate comparisons or Decimal for decimal arithmetic requirements."],
  ["Runtime & performance", "What is the difference between pip and venv?", "pip installs packages into the active Python environment. venv creates an isolated environment; they solve related but different tasks."],
  ["Runtime & performance", "What is a traceback?", "A traceback shows the call stack leading to an unhandled exception, usually including source locations and the final exception type and message."],
  ["Runtime & performance", "How should Python projects manage dependencies?", "Use an isolated environment and declare dependencies in project metadata or a lock/requirements file appropriate to the project. Pin versions when reproducibility requires it."],
  ["Runtime & performance", "What does Python's type hinting do?", "Type hints document expected types and enable static analysis tools and editor support. Python does not generally enforce annotations at runtime by default."],
  ["Runtime & performance", "What is structural pattern matching?", "The match/case statement, introduced in Python 3.10, compares a value against patterns and can destructure structured data. It is not simply a switch statement."],
  ["Runtime & performance", "What is an import side effect?", "An import side effect is behavior that occurs just by importing a module, such as writing files or starting work. Keep modules safe to import and put script execution behind a main guard."],
  ["Runtime & performance", "How do you make code testable?", "Keep units focused, minimize hidden global state and side effects, inject dependencies where useful, and write repeatable tests for expected and edge-case behavior."],
  ["Practical interview", "How do you reverse a string in Python?", "For a string s, s[::-1] returns a reversed copy using a negative slice step. It is concise, though other approaches may be clearer in some contexts."],
  ["Practical interview", "How do you find the largest item in a sequence?", "Use max(items) for comparable values, or max(items, key=...) when ranking by a field. Handle empty input with a default or an explicit validation step."],
  ["Practical interview", "How can you count item frequencies?", "Use collections.Counter(items) for a concise frequency mapping, or build a dictionary in a loop when custom counting behavior is needed."],
  ["Practical interview", "How can you check whether a string is a palindrome?", "Normalize the input according to requirements, then compare it with its reverse. Clarify whether case, spaces, punctuation, and Unicode normalization should matter."],
  ["Practical interview", "What is the safest way to compare two floats?", "Use math.isclose(a, b) with tolerances suited to the domain rather than exact equality, unless exact representation is guaranteed."],
  ["Practical interview", "How do you merge two sorted lists?", "Use a two-pointer O(n+m) merge, choosing the smaller current item from either input and appending leftovers. heapq.merge is convenient for iterables."],
  ["Practical interview", "What should a good unit test cover?", "Test observable behavior, typical inputs, edge cases, and failure behavior. Keep tests independent and deterministic, and avoid testing implementation details unnecessarily."],
  ["Practical interview", "How do you debug an unexpected exception?", "Reproduce it, read the final exception and traceback, inspect relevant values near the failing line, reduce the case, then add a regression test after fixing the cause."],
  ["Practical interview", "How do you explain a technical trade-off in an interview?", "State the requirements and constraints, compare options, explain the chosen trade-off, and mention how you would measure or revisit it. Use a concrete example."],
];
