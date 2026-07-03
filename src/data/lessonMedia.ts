/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DiagramNode {
  label: string;
  desc: string;
  badge?: string;
  color?: string;
}

export interface LessonMedia {
  id: string;
  diagramTitle: string;
  diagramType: string;
  diagramDescription: string;
  diagramNodes: DiagramNode[];
  videoTitle: string;
  videoDuration: string; // 1 to 3 minutes, e.g. "1:45"
  videoDescription: string;
  videoHighlights: string[];
  videoSubtitles: { time: number; text: string }[];
}

export const LESSON_MEDIA_MAP: Record<string, LessonMedia> = {
  // BASICS
  intro_python: {
    id: 'intro_python',
    diagramTitle: 'Python Compilation & Execution Flow',
    diagramType: 'Execution Architecture Diagram',
    diagramDescription: 'Understand how Python code is compiled to Bytecode and executed by the Python Virtual Machine (PVM) in general and in healthcare contexts.',
    diagramNodes: [
      { label: 'Source Code (.py)', desc: 'Write human-readable Python code (e.g. drug_name = "Paracetamol")', badge: 'Human Code', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Compiler', desc: 'Auto-translates human code into low-level intermediate code instantly', badge: 'Fast Parser', color: 'bg-violet-50 border-violet-200 text-violet-700' },
      { label: 'Bytecode (.pyc)', desc: 'Platform-independent instructions cached for faster reloading', badge: 'Bytecode', color: 'bg-purple-50 border-purple-200 text-purple-700' },
      { label: 'PVM (Interpreter)', desc: 'Python Virtual Machine reads bytecode and runs it on CPU', badge: 'Engine', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Introduction to Python in Pharmacy in 2 Minutes! 💊',
    videoDuration: '1:50',
    videoDescription: 'Pawan sir explains what Python is and why it is highly preferred in pharmaceutical research & clinical calculations.',
    videoHighlights: [
      'Learn how Python differs from C++ or Java (No heavy boilerplate syntax!).',
      'Understand the role of the Python Virtual Machine (PVM) in interpreting code.',
      'See why big pharma labs use Python for drug compounding and calculation automation.'
    ],
    videoSubtitles: [
      { time: 0, text: "Hello, beta! Today we will discuss what Python is and its role in pharmacy." },
      { time: 15, text: "Python is a very simple and highly readable programming language." },
      { time: 30, text: "Without semicolons or curly brackets, you can directly create variables and write logic." },
      { time: 45, text: "In pharmacy, it is extremely useful for drug dosage calculation, formulation checks, and laboratory statistics." },
      { time: 65, text: "So let's learn how to write commands and create variables in the next modules. All the best, beta!" }
    ]
  },
  variables: {
    id: 'variables',
    diagramTitle: 'Variable Memory Allocation & Pointer Reference',
    diagramType: 'Memory Map Diagram',
    diagramDescription: 'In Python, variables are labels (references) pointing to actual object values stored in heap memory. They are not fixed boxes.',
    diagramNodes: [
      { label: 'Variable Label', desc: '`tablet_count` is just a pointer or tag in the namespace directory', badge: 'Namespace Pointer', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Memory Address', desc: 'Points to a dynamic memory block like `0x7ffee3b4`', badge: 'Hex Reference', color: 'bg-blue-50 border-blue-200 text-blue-700' },
      { label: 'Value Object (120)', desc: 'An integer object containing type identifier, ref count, and actual data (120)', badge: 'Int Object', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Python Variables & Memory Tricks Explained 🧠',
    videoDuration: '2:15',
    videoDescription: 'A short 2-minute video showing how variables act as dynamic references rather than static containers in Python.',
    videoHighlights: [
      'Understand why you do not need to specify "int" or "float" data types manually.',
      'See how dynamic typing makes writing tablet calculation formulas extremely fast.',
      'Learn variables naming rules in pharmacy scripts (e.g. camelCase vs snake_case).'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, people often think that a variable is a box where data is stored." },
      { time: 15, text: "But in Python, a variable is like a sticky label or a tag!" },
      { time: 30, text: "When you write dose equals 250, an object for 250 is created in the heap memory." },
      { time: 45, text: "And the dose tag starts pointing to it. This is called Dynamic Binding!" },
      { time: 65, text: "Because of this dynamic nature, coding is faster and system load is reduced. Did you understand, beta?" }
    ]
  },
  data_types: {
    id: 'data_types',
    diagramTitle: 'Core Built-in Data Types Taxonomy',
    diagramType: 'Hierarchical Taxonomy Map',
    diagramDescription: 'Understand the different data types available in Python: Numeric, Sequence (mutable vs immutable), Mapping, Set, and Boolean.',
    diagramNodes: [
      { label: 'Numeric Types', desc: '`int` (500mg), `float` (6.8 pH), `complex` (3 + 4j)', badge: 'Numbers', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Sequence Types', desc: '`str` ("Aspirin"), `list` [mutable items], `tuple` (immutable config parameters)', badge: 'Sequences', color: 'bg-teal-50 border-teal-200 text-teal-700' },
      { label: 'Mapping Type', desc: '`dict` {"brand": "Disprin", "salt": "Aspirin"} for key-value records', badge: 'Dictionaries', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Boolean & Set', desc: '`bool` (True/False approval) and unique unordered `set` of salts', badge: 'Logic & Set', color: 'bg-rose-50 border-rose-200 text-rose-700' }
    ],
    videoTitle: 'Mastering Python Data Types for Medical Data 🔬',
    videoDuration: '2:40',
    videoDescription: 'Quickly learn the exact data types to choose when handling pharmacy salts, patient lists, and lab readings.',
    videoHighlights: [
      'Learn the difference between floats (pH, weights) and integers (capsule counts).',
      'Discover Lists for patient logs and Dictionaries for comprehensive drug catalogs.',
      'Determine when to use standard strings vs boolean indicators.'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, in pharmacy, we must store all our data in the correct data types." },
      { time: 20, text: "For example, we use integers for tablet counts, and float values for pH levels." },
      { time: 40, text: "And we store medicine attributes, like formulation names, inside dictionaries." },
      { time: 60, text: "Understanding when to select mutable lists versus immutable tuples is very important!" },
      { time: 80, text: "Let us learn their conversion and verification in a practical program now." }
    ]
  },
  input_output: {
    id: 'input_output',
    diagramTitle: 'Interactive I/O Stream pipeline',
    diagramType: 'Data Flow Diagram',
    diagramDescription: 'Visualize how the `input()` function captures terminal streams, casts them into suitable types, and how `print()` with f-strings formats them.',
    diagramNodes: [
      { label: 'User Keyboard Input', desc: 'Reads data as standard raw string (e.g. "12.5" pH)', badge: 'stdin Stream', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Type Casting Box', desc: '`float(input())` converts raw text into operational float values', badge: 'Explicit Casting', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'f-string Formatter', desc: '`f"Result: {value:.2f}"` rounds decimal values dynamically', badge: 'Format Output', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Making Interactive Programs with print() & input() 📱',
    videoDuration: '1:30',
    videoDescription: 'Write interactive scripts that prompt clinical pharmacists for active ingredient weights and display formatted dosages.',
    videoHighlights: [
      'Why input() always returns a String (and how to avoid type errors!).',
      'Casting inputs to int() or float() safely before mathematical calculations.',
      'Aesthetic f-strings for formatting decimal precision in compound weights.'
    ],
    videoSubtitles: [
      { time: 0, text: "How will your program communicate with the user? By using input and print functions!" },
      { time: 15, text: "Always remember one thing: the input function always retrieves text in a string format." },
      { time: 30, text: "If you want to perform math, do not forget to convert it using integer or float typecasting." },
      { time: 45, text: "And represent the final result beautifully using f-strings with decimal precision." },
      { time: 65, text: "Let us design a dose calculator and test it live right now!" }
    ]
  },
  operators: {
    id: 'operators',
    diagramTitle: 'Operator Types & Precedence Stack',
    diagramType: 'Precedence Hierarchy Diagram',
    diagramDescription: 'An orderly view of operator precedence (PEMDAS) to ensure exact dosing and pharmacy compounding calculations do not fail due to priority errors.',
    diagramNodes: [
      { label: 'Parentheses ()', desc: 'Has the highest priority. Always calculated first in dosing equations', badge: 'Priority 1', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Exponentiation **', desc: 'Calculates power (e.g. concentration decay constants over time)', badge: 'Priority 2', color: 'bg-teal-50 border-teal-200 text-teal-700' },
      { label: 'Multiplication / Div / Mod', desc: '`*`, `/`, `//` (floor division), `%` (remainder of chemical mixing cycles)', badge: 'Priority 3', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Addition & Subtraction', desc: '`+` and `-` are calculated last in the arithmetic queue', badge: 'Priority 4', color: 'bg-rose-50 border-rose-200 text-rose-700' }
    ],
    videoTitle: 'Math & Operators Priority in Medicine Formulas 📊',
    videoDuration: '2:10',
    videoDescription: 'Avoid dangerous calculation errors in dosage rates by mastering operator precedence (PEMDAS) in Python.',
    videoHighlights: [
      'Understand standard operators: Division `/` vs Floor Division `//` vs Modulo `%`.',
      'Learn how parentheses ensure correct order of execution in complex biological equations.',
      'Explore assignment operators like `+=` and `-=` to increment titration values.'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, mathematical accuracy is the most critical factor in pharmaceutical calculations." },
      { time: 20, text: "In Python, we have two types of division: single slash for decimal float results..." },
      { time: 40, text: "And double slash for integer floor division values. Use percentage for modulo remainder." },
      { time: 60, text: "Always pay attention to PEMDAS rules so that active pharmaceutical dosages are calculated correctly." },
      { time: 90, text: "Let us verify these equations live in our system now!" }
    ]
  },
  // INTERMEDIATE
  conditions: {
    id: 'conditions',
    diagramTitle: 'If-Elif-Else Clinical Decision Tree',
    diagramType: 'Decision Flowchart',
    diagramDescription: 'How conditions bifurcate execution flow. Used for automated clinical triage, e.g., classifying patient blood pressure or drug dosage flags.',
    diagramNodes: [
      { label: 'Condition Check', desc: 'Is `systolic_bp >= 140` or `diastolic_bp >= 90`?', badge: 'Branch Node', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'True (If branch)', desc: 'Set `diagnosis = "Hypertension"` and output warning level', badge: 'High BP Path', color: 'bg-rose-50 border-rose-200 text-rose-700' },
      { label: 'False (Elif/Else branch)', desc: 'Check if `bp < 120` (Normal) or trigger moderate warnings', badge: 'Normal Path', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Clinical Decision Making with If-Else Logic 🚦',
    videoDuration: '1:45',
    videoDescription: 'Learn how to construct clean, nested decision-making blocks to classify patient health parameters dynamically.',
    videoHighlights: [
      'Master the basic structural syntax of `if`, `elif`, and `else` statements.',
      'Understand indentation block requirements in Python compared to curly-bracket languages.',
      'Use logical operators (`and`, `or`, `not`) to test multiple therapeutic indicators.'
    ],
    videoSubtitles: [
      { time: 0, text: "Let us learn conditional branching, beta, which will automatically classify diagnoses." },
      { time: 15, text: "In Python, after writing 'if', adding a colon and giving indentation is mandatory." },
      { time: 30, text: "We use 'elif' for checking multiple conditions, and 'else' for any remaining options." },
      { time: 45, text: "Logical operators like 'and' and 'or' help us perform precise range checking." },
      { time: 65, text: "Let us apply this on real-world clinical metrics classification now!" }
    ]
  },
  loops: {
    id: 'loops',
    diagramTitle: 'For & While Iteration Cycle in Drug Titration',
    diagramType: 'Loop Execution Pipeline',
    diagramDescription: 'Loops iterate over collections of patient logs, or decrement concentration levels during decay half-life simulations.',
    diagramNodes: [
      { label: 'Sequence Iterator', desc: 'Loops over elements in `med_inventory` or a range of dose ticks', badge: 'Loop Header', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Loop Body', desc: 'Runs tasks iteratively (e.g. print expiration warning for expired salt items)', badge: 'Execution Block', color: 'bg-violet-50 border-violet-200 text-violet-700' },
      { label: 'Termination Check', desc: 'Breaks automatically when items end, or if sentinel state triggers `break`', badge: 'Boundary Guard', color: 'bg-rose-50 border-rose-200 text-rose-700' }
    ],
    videoTitle: 'Looping Through Patient Data & Salt Batches 🔄',
    videoDuration: '2:30',
    videoDescription: 'Master "for" loops for lists and "while" loops for threshold-based chemical kinetics decay processes.',
    videoHighlights: [
      'Learn the structure of `for item in list` and how it auto-advances safely.',
      'Understand `while` loops and avoid dangerous infinite loops in clinical triggers.',
      'Control flow using `break` and `continue` inside batch quality assessment loops.'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, if we need to check the shelf life of one hundred medicine containers..." },
      { time: 20, text: "We will not write manual code for each one! We will use loops instead." },
      { time: 40, text: "The 'for' loop is perfect for iterating sequentially through lists or database records." },
      { time: 60, text: "And 'while' loops are used when we need to repeat actions until a condition is met." },
      { time: 80, text: "Let us iterate through a list and calculate batch test indicators now!" }
    ]
  },
  functions: {
    id: 'functions',
    diagramTitle: 'Function Call Stack, Parameters & Scope',
    diagramType: 'Stack Frame Diagram',
    diagramDescription: 'Understand how modular functions take arguments, perform isolated chemical calculations, and return clean outputs.',
    diagramNodes: [
      { label: 'Function Call', desc: '`calc_dose(weight=70, salt="Aspirin")` pushes a frame to the execution stack', badge: 'Call Frame', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Parameter Processing', desc: 'Accepts arguments with default parameters (e.g. unit="mg")', badge: 'Local Namespace', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Value Returns', desc: 'Outputs final float/dict object back to the main thread and pops stack', badge: 'Return Value', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Writing Reusable Formulas with Functions 🛠️',
    videoDuration: '1:55',
    videoDescription: 'Organize your compounding math by modularizing calculations into clean, reusable Python functions.',
    videoHighlights: [
      'Define functions with the `def` keyword, arguments, and default values.',
      'Learn local scope variables inside functions versus global scope parameters.',
      'Use the `return` statement to output complex clinical outcomes (tuples/dicts).'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, duplicating code is a bad programming practice!" },
      { time: 15, text: "Bundle your compounding formulas forever by defining them once using the 'def' keyword." },
      { time: 30, text: "We control internal calculations by passing arguments along with default metrics." },
      { time: 45, text: "The return statement safely delivers the calculated result back to our main application code." },
      { time: 65, text: "Come, let us build clear and beautiful dosing logic in a functional design!" }
    ]
  },
  modules_libraries: {
    id: 'modules_libraries',
    diagramTitle: 'Module Importing & Path Resolution',
    diagramType: 'Namespace Dependency Map',
    diagramDescription: 'How Python locates and imports built-in libraries like `math` or third-party packages like `numpy` to resolve pharmacological mathematical structures.',
    diagramNodes: [
      { label: 'Import Statement', desc: '`import math` or `from math import pi` loads library files', badge: 'Import Node', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Sys.path Search', desc: 'Searches built-in modules, local folders, and then site-packages', badge: 'Directory Scan', color: 'bg-teal-50 border-teal-200 text-teal-700' },
      { label: 'Namespace Binding', desc: 'Integrates math functions without conflicting with local variables', badge: 'Namespace Safe', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Supercharging Code with Math & Standard Libraries 📦',
    videoDuration: '2:20',
    videoDescription: 'Learn how to import external math modules for chemical concentrations, exponential decay, and statistical drug trials.',
    videoHighlights: [
      'Import standard modules: `math`, `random` (for clinical test randomization), `datetime`.',
      'Learn the difference: `import library` versus `from library import specific_function`.',
      'Install third-party tools like pandas or scipy safely using pip commands.'
    ],
    videoSubtitles: [
      { time: 0, text: "The real power of Python lies in its rich library ecosystem, beta!" },
      { time: 15, text: "You do not need to manually design logarithms, exponents, or squares yourself." },
      { time: 30, text: "Simply write 'import math' and use complex exponential pharmacokinetic decay functions easily." },
      { time: 45, text: "Randomizing drug trial groups is also very simple with the 'random' module." },
      { time: 65, text: "Let us import standard libraries and check their logic!" }
    ]
  },
  // ADVANCED
  file_handling: {
    id: 'file_handling',
    diagramTitle: 'Safe File Stream I/O Operations',
    diagramType: 'I/O Stream Flowchart',
    diagramDescription: 'Always use the `with` context manager in Python to open, read, or write patient prescription CSV logs safely without memory leaks.',
    diagramNodes: [
      { label: 'Context Manager Start', desc: '`with open("meds.txt", "r") as file` opens a secure system resource descriptor', badge: 'with statement', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Buffered Read/Write', desc: 'Performs `file.read()` or line-by-line streaming without overloading RAM', badge: 'Stream Read', color: 'bg-violet-50 border-violet-200 text-violet-700' },
      { label: 'Auto-Close', desc: 'Automatically closes files on block exit, even if code crashes inside!', badge: 'Safety Release', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Saving Drug Lists to Files with context managers 📄',
    videoDuration: '2:45',
    videoDescription: 'Read and write prescription logs to standard .txt and .csv files safely using context-managed files.',
    videoHighlights: [
      'Understand opening modes: read `"r"`, write `"w"`, append `"a"`.',
      'See why standard open/close commands cause lockups and how the "with" keyword fixes this.',
      'How to read files line-by-line to handle very large laboratory records.'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, if the program closes, all data inside active memory will be lost." },
      { time: 20, text: "We must save our reports into text or CSV files for permanent storage." },
      { time: 40, text: "Always use the 'with open' statement in Python because it automatically closes files for you." },
      { time: 60, text: "This prevents data corruption from file lockups or unexpected crash errors. This is a gold standard!" },
      { time: 80, text: "Let us write a patient log live and check the created file in the folder." }
    ]
  },
  exception_handling: {
    id: 'exception_handling',
    diagramTitle: 'Try-Except Error Catching Flow',
    diagramType: 'Exception Handling Pipeline',
    diagramDescription: 'Prevent clinical applications from crashing due to bad inputs (such as text instead of dose weights) using robust Exception Handling blocks.',
    diagramNodes: [
      { label: 'Try Block', desc: 'Execute vulnerable code (e.g. dividing by concentration volume `vol`)', badge: 'Hazard Zone', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Exception Catches', desc: '`except ZeroDivisionError:` intercepts dividing by zero. `except ValueError:` catches text types', badge: 'Active Guard', color: 'bg-rose-50 border-rose-200 text-rose-700' },
      { label: 'Finally / Else Block', desc: '`finally` runs cleanups (e.g., closing sensor connections) regardless of outcomes', badge: 'Cleanup', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Bulletproofing Apps with Try-Except Blocks 🛡️',
    videoDuration: '1:50',
    videoDescription: 'Keep critical patient dashboards running smoothly by intercepting common value errors and division faults.',
    videoHighlights: [
      'Understand common Python errors: `ValueError`, `ZeroDivisionError`, `FileNotFoundError`.',
      'Learn how `try` and `except` catch system crashes in production.',
      'Construct polite, descriptive error warnings for users instead of dry technical traces.'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, if a critical medical application crashes suddenly, it leaves a very bad user experience." },
      { time: 15, text: "By using try-except blocks, we handle errors gracefully and show user-friendly messages." },
      { time: 30, text: "Whether it is a zero-division error or an invalid entry by a patient, our try block will catch it." },
      { time: 45, text: "This keeps the system running safely, ensuring maximum safety in medical operations." },
      { time: 65, text: "Let us build some custom exception handlers in our playground right now!" }
    ]
  },
  oop: {
    id: 'oop',
    diagramTitle: 'Class Instantiation & Attribute Inheritance',
    diagramType: 'Object Hierarchy Diagram',
    diagramDescription: 'Object-Oriented Programming (OOP) allows us to design a generic "Medicine" blueprint, creating individual drug instances with localized variables and methods.',
    diagramNodes: [
      { label: 'Class Blueprint', desc: 'Defines abstract properties (e.g. `salt`, `strength`, `check_expiry()`)', badge: 'Class Medicine', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Constructor __init__', desc: 'Binds dynamic properties onto localized self references', badge: 'Object Initializer', color: 'bg-teal-50 border-teal-200 text-teal-700' },
      { label: 'Instance Object', desc: '`med1 = Medicine("Aspirin", 150)` is a concrete physical entity in memory', badge: 'Instance Object', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Object-Oriented Programming (OOP) in Pharma 🧬',
    videoDuration: '2:50',
    videoDescription: 'Learn classes, self, constructors, and inheritance by structuring logical drug databases.',
    videoHighlights: [
      'Define structural schemas using classes with explicit state methods.',
      'How the constructor `__init__` sets local parameters using `self` context variables.',
      'Inherit properties to build specialized subclasses (e.g., Capsule inherits from Medicine).'
    ],
    videoSubtitles: [
      { time: 0, text: "Today we will learn the Object-Oriented Programming concepts, beta! We will code using blueprints." },
      { time: 20, text: "Medicine is a broad class containing common attributes like salt names and strengths." },
      { time: 40, text: "The '__init__' constructor will initialize those attributes onto live object instances." },
      { time: 60, text: "With these object models, maintaining and expanding clinical software becomes highly systematic." },
      { time: 85, text: "Let us define a robust drug object structure in this step!" }
    ]
  },
  database: {
    id: 'database',
    diagramTitle: 'Relational SQLite Storage Pipeline',
    diagramType: 'SQL Query Lifecycle Map',
    diagramDescription: 'How Python programs open local databases, write SQL statements, execute queries using cursors, and commit transaction rows permanently.',
    diagramNodes: [
      { label: 'DB Connection', desc: 'Connects to serverless database file `sqlite3.connect("pharmacy.db")`', badge: 'Database File', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Cursor Box', desc: 'The vehicle executing raw queries and holding relational result rows', badge: 'SQL Executor', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Commit & Close', desc: '`conn.commit()` saves structural records, releasing hardware resources', badge: 'Transaction Commit', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Storing Patient & Expire Medicine Lists in DB 🗄️',
    videoDuration: '2:15',
    videoDescription: 'Connect Python to an sqlite3 database file to query active patient reports, salt levels, and drug alerts.',
    videoHighlights: [
      'Understand SQL relational tables, primary keys, and text/integer/real columns.',
      'Execute dynamic SQL commands from Python: CREATE, INSERT, SELECT queries.',
      'Fetch records securely using fetchone() or fetchall() cursor methodologies.'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, to save active patient records and dynamic drug stocks, we need reliable databases." },
      { time: 15, text: "Python comes with a built-in serverless relational database engine called sqlite3." },
      { time: 30, text: "A cursor object will execute our queries, and fetchall will retrieve records as standard tuples." },
      { time: 45, text: "Always call commit after inserting or updating data to save the records permanently." },
      { time: 65, text: "Let us create a medicine inventory table and check its records on the SQL console!" }
    ]
  },
  api: {
    id: 'api',
    diagramTitle: 'RESTful API HTTP Request-Response Circle',
    diagramType: 'Web API Architecture Map',
    diagramDescription: 'A direct guide to importing the popular `requests` module in Python to send RESTful GET/POST requests and retrieve drug data in JSON format.',
    diagramNodes: [
      { label: 'requests.get(url)', desc: 'Sends standard GET request containing parameters to a public drug catalog', badge: 'HTTP GET', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Server Processing', desc: 'Queries high-performance pharmaceutical endpoints for active chemical salts', badge: 'API Endpoint', color: 'bg-violet-50 border-violet-200 text-violet-700' },
      { label: 'JSON Parsing', desc: '`.json()` translates response streams into a friendly Python dictionary', badge: 'Parsed Dictionary', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Fetching Drug Details using REST Web APIs 🌐',
    videoDuration: '2:30',
    videoDescription: 'Learn how to query live web servers for molecular formulas, interactions, and generic drug structures.',
    videoHighlights: [
      'Master the popular third-party `requests` module to access RESTful resources.',
      'Check standard HTTP response status codes: 200 (Success) versus 404 (Not Found).',
      'Parse deeply nested JSON objects to extract generic names and dosage warnings.'
    ],
    videoSubtitles: [
      { time: 0, text: "There are thousands of active medicine libraries and databases online, beta!" },
      { time: 15, text: "We can access global drug data in real-time by sending standard web API requests." },
      { time: 30, text: "We use the requests.get command to query web URLs and fetch clinical information." },
      { time: 45, text: "Once converted into a JSON dictionary, the data is instantly accessible as standard Python keys." },
      { time: 65, text: "Let us connect to a live public drug API endpoint and print the response!" }
    ]
  },
  // APPLICATIONS
  app_pharma: {
    id: 'app_pharma',
    diagramTitle: 'Active Pharmaceutical Ingredient (API) Dosing Engine',
    diagramType: 'Formulation Pipeline Map',
    diagramDescription: 'How Python automates compounding ratios and validates raw active salt ingredients against standard pharmacopeia thresholds.',
    diagramNodes: [
      { label: 'Batch Ingredients', desc: 'Raw inputs: active pharmaceutical salts, excipient weights, target volume', badge: 'Raw Recipe', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Ratio Calculator', desc: 'Evaluates required dilution and compounding densities using clinical formulas', badge: 'Compounding Logic', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Pharmacopeia Check', desc: 'Compares concentration outcomes with standard chemical limits safely', badge: 'Safety Evaluator', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Automating Lab Compounding with Python 🧪',
    videoDuration: '1:45',
    videoDescription: 'Build formulation scripts that ensure exact pill weights and compound calculations in pharmacy production.',
    videoHighlights: [
      'Formulate dilution rates dynamically based on custom active ingredient density.',
      'Apply standard deviations to multi-tablet weight assays to check quality compliance.',
      'Create alert thresholds to auto-flag incorrect compounding ratios.'
    ],
    videoSubtitles: [
      { time: 0, text: "In pharmaceutical compounding, human errors in mixing ratios can be extremely dangerous." },
      { time: 15, text: "We write Python scripts that calculate active salts and excipients with absolute mathematical precision." },
      { time: 30, text: "After executing calculations, the script automatically validates them against standard deviation limits." },
      { time: 45, text: "This automation multiplies safety in drug compounding. Let us implement these formulas now." }
    ]
  },
  app_data: {
    id: 'app_data',
    diagramTitle: 'Clinical Trial Patient Analytics Pipeline',
    diagramType: 'Data Analytics Flowchart',
    diagramDescription: 'How raw clinical data is loaded into lists/dictionaries, aggregated, and mapped to descriptive and diagnostic trial metrics.',
    diagramNodes: [
      { label: 'Raw Trial Log', desc: 'Patient metrics: resting heart rates, systolic BP before/after treatment rounds', badge: 'Data Arrays', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Descriptive Stats', desc: 'Computes sample means, standard deviations, and efficacy indicators', badge: 'Math Processing', color: 'bg-violet-50 border-violet-200 text-violet-700' },
      { label: 'Efficacy Output', desc: 'Groups patients into responsive vs non-responsive categories for analytics', badge: 'Result Classification', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Clinical Trials Statistical Analysis 📈',
    videoDuration: '2:20',
    videoDescription: 'Calculate the efficacy of a drug treatment over a sample patient group by writing simple statistical routines in Python.',
    videoHighlights: [
      'Write routines to process trial columns: Pre-treatment vs Post-treatment metrics.',
      'Calculate standard deviation and mean difference to find treatment efficacy ratios.',
      'Categorize and clean data anomalies (missing values or abnormal readings) dynamically.'
    ],
    videoSubtitles: [
      { time: 0, text: "Clinical trial analytics are what determines if a drug trial passes or fails, did you understand, beta?" },
      { time: 20, text: "We can parse patient metrics like heart rate and blood pressure values inside Python lists." },
      { time: 40, text: "Using simple loops, we can easily calculate average differences and trace percentage recovery." },
      { time: 60, text: "Let us represent this scientific report in our professional terminal interface!" }
    ]
  },
  app_research: {
    id: 'app_research',
    diagramTitle: 'Pharmacokinetics (PK) Model Simulation Map',
    diagramType: 'Biological Simulation Pipeline',
    diagramDescription: 'Simulate drug absorption, distribution, metabolism, and excretion (ADME) pathways using differential concentration algorithms.',
    diagramNodes: [
      { label: 'Oral Dose Input', desc: 'Initial therapeutic dose is absorbed into the GI tract at rate `Ka`', badge: 'Absorption Input', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Central Compartment', desc: 'Drug enters plasma blood circulation and distributes across organs', badge: 'Plasma Circulation', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Renal Elimination', desc: 'Metabolized drug is cleared out of systemic circulation at clearance rate `Ke`', badge: 'Elimination Clearance', color: 'bg-rose-50 border-rose-200 text-rose-700' }
    ],
    videoTitle: 'Simulating Drug Elimination and ADME Curves 🧬',
    videoDuration: '2:50',
    videoDescription: 'A short visual walkthrough showing how mathematical simulation curves predict steady-state concentration inside a patient.',
    videoHighlights: [
      'Learn the standard equations for pharmacokinetic absorption and elimination half-lives.',
      'Build iterative loops that track concentration values at 1-minute intervals.',
      'Identify therapeutic index boundaries (Minimum Effective vs Maximum Toxic concentration).'
    ],
    videoSubtitles: [
      { time: 0, text: "With pharmacokinetic simulation, we can predict drug concentrations without direct human testing." },
      { time: 20, text: "An oral dose is first absorbed in the gastrointestinal tract, and then enters the blood plasma." },
      { time: 45, text: "Then, the kidney continuously eliminates it. We model this rate of decay dynamically using mathematical loops." },
      { time: 70, text: "This gives us a precise blood concentration curve. Come, let us run the simulation and plot it!" }
    ]
  },
  app_automation: {
    id: 'app_automation',
    diagramTitle: 'Smart Stock Refill Alert Pipeline',
    diagramType: 'Inventory Management Flowchart',
    diagramDescription: 'Automate stock alerts by scanning pharmacy medicine quantities and sending real-time WhatsApp purchase order requests when they fall below safety limits.',
    diagramNodes: [
      { label: 'Stock Database', desc: 'Continuous audit of current medicine shelf items and expiration timestamps', badge: 'Quantity Audit', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Safety Threshold Check', desc: 'Compare quantity with safety benchmark. Check expiry days remaining', badge: 'Trigger Monitor', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Purchase Reorder Output', desc: 'Auto-generates restock lists and notifies PYGURU/Sir through automated channels', badge: 'Refill Actions', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Auto-refilling Pharmacy Stock with Python scripts 📦',
    videoDuration: '1:55',
    videoDescription: 'Automate medicine inventory scanning and receive automatic triggers when key drug stocks run dangerously low.',
    videoHighlights: [
      'Construct a nested condition scanner tracking current medicine levels.',
      'Calculate safety stock indices based on daily patient consumption averages.',
      'Generate professional purchase orders in plain text streams.'
    ],
    videoSubtitles: [
      { time: 0, text: "Manual inventory auditing carries high risks of stock-outs for critical drugs, beta." },
      { time: 15, text: "Our Python program will automatically scan the database and trigger real-time stock alert messages." },
      { time: 30, text: "Several critical formulations are reordered before they cross safety thresholds, using shelf-life analysis." },
      { time: 45, text: "This control framework ensures flawless operations. Let us run our inventory reordering algorithm!" }
    ]
  },
  // LABS
  pk_simulator: {
    id: 'pk_simulator',
    diagramTitle: 'One-Compartment Intravenous Bolus Model',
    diagramType: 'Compartmental Model Diagram',
    diagramDescription: 'An IV Bolus injection instantly introduces the full dose into plasma. The model tracks exponential concentration decline over elimination time ticks.',
    diagramNodes: [
      { label: 'IV Bolus Input', desc: 'Dose enters blood circulation system instantly, reaching peak concentration `C0`', badge: 'Bolus Start', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Plasma Volume (Vd)', desc: 'Apparent Volume of Distribution influences overall initial plasma concentration', badge: 'Distribution Volume', color: 'bg-teal-50 border-teal-200 text-teal-700' },
      { label: 'First-order Decay', desc: '`C = C0 * e^(-Ke * t)` represents the continuous metabolism curves', badge: 'Exponential Decay', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Intravenous Bolus Pharmacokinetics Lab Guide 🔬',
    videoDuration: '2:40',
    videoDescription: 'Watch how we calculate the Volume of Distribution and elimination rate constant dynamically in Python.',
    videoHighlights: [
      'Learn the difference: Oral drug absorption versus direct IV Bolus compartmentalization.',
      'Calculate half-life `t1/2` using the natural log constant value 0.693 divided by `Ke`.',
      'Examine the area under the curve (AUC) to estimate total drug exposure rates.'
    ],
    videoSubtitles: [
      { time: 0, text: "Welcome, beta, to our pharmacokinetic bolus simulation modeling lab!" },
      { time: 15, text: "In an IV Bolus, there is no absorption phase, which is why peak concentration is achieved instantly." },
      { time: 35, text: "We run a loop to track and calculate concentration values over continuous time intervals." },
      { time: 55, text: "And the elimination rate constant Ke determines how rapidly the drug clears from the plasma." },
      { time: 75, text: "Let us adjust the simulation values and analyze the concentration charts on our live console!" }
    ]
  },
  tablet_dissolution: {
    id: 'tablet_dissolution',
    diagramTitle: 'Noyes-Whitney Dissolution Rate Model',
    diagramType: 'Chemical Dissolution Rate Flowchart',
    diagramDescription: 'Understand how a solid tablet particle dissolves into water solvent depending on surface area, concentration gradients, and thickness layers.',
    diagramNodes: [
      { label: 'Tablet Core', desc: 'Solid capsule with specific total surface area `A` in the stomach fluids', badge: 'Solid Phase', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Stagnant Diffusion Layer', desc: 'Thin boundary layer surrounding solid particles with thickness `h`', badge: 'Boundary Layer', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Bulk Solution Concentration', desc: 'Solvent volume concentration `C`. Noyes-Whitney equation: `dC/dt = (D * A / h) * (Cs - C)`', badge: 'Dissolved Phase', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Tablet Dissolution Profile & Noyes-Whitney Math 🧪',
    videoDuration: '2:15',
    videoDescription: 'Analyze how formulation design parameters alter the release profile of active drugs inside gastrointestinal fluids.',
    videoHighlights: [
      'Understand how surface area adjustments change tablet release speeds (Fast vs Sustained Release).',
      'Calculate diffusion coefficients in aqueous stomach solvents.',
      'Determine the saturation solubility of active salts inside biological mediums.'
    ],
    videoSubtitles: [
      { time: 0, text: "How does a tablet dissolve after ingestion? This is predicted by the Noyes-Whitney equation." },
      { time: 15, text: "The greater the total surface area, the faster the chemical dissolution velocity will be." },
      { time: 30, text: "Saturated layer thickness and concentration differences drive the continuous rate of dissolution." },
      { time: 45, text: "By writing Python formulas, we can automatically plot dissolution profiles for quality check." },
      { time: 65, text: "Let us inject the formulation parameters and monitor the release curves live!" }
    ]
  },
  weight_variation: {
    id: 'weight_variation',
    diagramTitle: 'IP/BP Tablet Weight Variation Assays',
    diagramType: 'Quality Assurance Process Flow',
    diagramDescription: 'Validate tablet production runs by evaluating 20 random tablet weights and checking if they conform to British & Indian Pharmacopeia standard deviation limits.',
    diagramNodes: [
      { label: 'Sample Selection (20 Tablets)', desc: 'Collect and record individual weights of 20 random tablets from the batch run', badge: 'Batch Samples', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Average Weight Check', desc: 'Calculate the overall mean weight of the batch sample (e.g., target 250mg)', badge: 'Calculated Mean', color: 'bg-teal-50 border-teal-200 text-teal-700' },
      { label: 'Pharmacopeia Tolerance Limits', desc: 'Verify how many tablets deviate by more than 5%, 7.5%, or 10% from the mean weight', badge: 'Deviation Assay', color: 'bg-rose-50 border-rose-200 text-rose-700' },
      { label: 'Batch Verdict (Pass/Fail)', desc: 'Auto-approve the batch if no more than 2 tablets exceed deviation and none exceed double deviation', badge: 'QA Decider', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Pharmacopeia Weight Variation Assay Lab 📊',
    videoDuration: '2:25',
    videoDescription: 'Master statistical Quality Control assays by coding tablet weight variance metrics inside Python.',
    videoHighlights: [
      'Understand the specific deviation limits of IP (Indian) and USP (United States) pharmacopeia.',
      'Write arithmetic loops to dynamically find average weight and individual deviation values.',
      'Auto-generate Quality Control certificates verifying batch status.'
    ],
    videoSubtitles: [
      { time: 0, text: "Beta, every tablet in a pharmaceutical production batch must have an almost identical weight." },
      { time: 15, text: "As per pharmacopeia safety guidelines, we weigh and test twenty random tablets from each batch." },
      { time: 30, text: "Our Python script will calculate the average weight and analyze individual percentage deviation metrics." },
      { time: 45, text: "If the safety limits are breached, a batch rejection alert is immediately triggered." },
      { time: 65, text: "Come, let us set up a tablet weights array and run a batch compliance test now!" }
    ]
  },
  alligation_compounding: {
    id: 'alligation_compounding',
    diagramTitle: 'Alligation Medial & Alternate Dilution Grid',
    diagramType: 'Matrix Compounding Grid',
    diagramDescription: 'How clinical pharmacists mix high-concentration stock salts with low-concentration excipients to obtain an exact intermediate therapeutic concentration.',
    diagramNodes: [
      { label: 'High Concentration (H%)', desc: 'The stronger chemical stock solution available in laboratory cabinets', badge: 'Stock Input', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
      { label: 'Target Concentration (T%)', desc: 'The exact required therapeutic concentration specified by patient prescription', badge: 'Desired Target', color: 'bg-teal-50 border-teal-200 text-teal-700' },
      { label: 'Low Concentration (L%)', desc: 'The weaker active solution or inert diluent (e.g. sterile water 0%) used for dilution', badge: 'Diluent Input', color: 'bg-amber-50 border-amber-200 text-amber-700' },
      { label: 'Alligation Parts Ratio', desc: '`Parts of H = T - L` and `Parts of L = H - T`. Mix ratios to compound target.', badge: 'Compounding Ratio', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
    ],
    videoTitle: 'Alligation Alternate Method & Dilution Math 🧪',
    videoDuration: '2:55',
    videoDescription: 'Learn how to use the classic Alligation Tic-Tac-Toe cross grid to mix stock drug concentrations dynamically.',
    videoHighlights: [
      'Master the mathematical dilution equations when stock levels are fixed.',
      'Implement the Alligation Alternate grid in clear Python lists to calculate dilution volumes.',
      'Generate step-by-step pharmacy compounding recipes with exact quantities.'
    ],
    videoSubtitles: [
      { time: 0, text: "In clinical compounding, the Alligation method is highly popular for calculating dilution volumes." },
      { time: 15, text: "For example, how do we mix ninety percent alcohol with twenty percent alcohol to get a fifty percent solution?" },
      { time: 30, text: "A cross grid subtraction calculates the exact parts of high and low concentration solutions required." },
      { time: 45, text: "We will code this compounding grid in Python using basic arithmetic operations." },
      { time: 65, text: "This will give us the exact mixing quantities instantly on the output screen. Let us build it!" }
    ]
  }
};
