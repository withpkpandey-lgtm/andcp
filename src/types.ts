/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TopicCategory = 'basics' | 'intermediate' | 'advanced' | 'applications';

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  name: string;
  category: TopicCategory;
  description: string;
  syllabus: string[];
  completed: boolean;
  unlocked: boolean;
  quiz: QuizQuestion[];
  projectDescription?: string;
  projectStarterCode?: string;
}

export interface MessageLineExplanation {
  line: string;
  index: number;
  explanation: string;
}

export interface Message {
  id: string;
  sender: 'tutor' | 'student';
  text: string;
  timestamp: string;
  type?: 'text' | 'quiz' | 'code' | 'project';
  code?: string;
  quizData?: QuizQuestion;
  quizAnsweredIndex?: number;
  quizIsCorrect?: boolean;
  lineByLine?: MessageLineExplanation[];
  isTyping?: boolean;
}

export interface StudentProgress {
  userName: string;
  rollNumber?: string;
  stream?: 'B.pharm' | 'D.pharm' | '';
  completedTopics: string[]; // List of topic IDs
  quizScores: { [topicId: string]: { score: number, total: number } };
  currentTopicId: string;
  joinedDate: string;
}

export interface PharmaProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  simulatedOutput: string;
  explanation: { line: string; desc: string }[];
}

export const PHARMA_PROGRAMS: PharmaProgram[] = [
  {
    id: 'pk_simulator',
    name: 'Pharmacokinetics (PK) Drug Elimination Simulator',
    category: 'Pharmacology',
    description: 'Simulates first-order drug elimination kinetics in a patient body. Computes half-life concentration hour-by-hour.',
    code: `def simulate_drug_elimination(initial_dose_mg, half_life_hours, total_hours):
    import math
    print(f"--- Drug Elimination Simulation ---")
    print(f"Initial Dose: {initial_dose_mg} mg")
    print(f"Half-life: {half_life_hours} hours\\n")
    print("Hour | Remaining Drug (mg) | Elimination %")
    print("-" * 45)
    
    # Elimination rate constant (Ke)
    ke = 0.693 / half_life_hours
    
    for hour in range(0, total_hours + 1):
        # First-order elimination formula: C = C0 * e^(-ke * t)
        remaining = initial_dose_mg * math.exp(-ke * hour)
        eliminated_pct = ((initial_dose_mg - remaining) / initial_dose_mg) * 100
        print(f"{hour:4d} | {remaining:19.2f} | {eliminated_pct:12.1f}%")

simulate_drug_elimination(initial_dose_mg=500, half_life_hours=4, total_hours=12)`,
    simulatedOutput: `--- Drug Elimination Simulation ---
Initial Dose: 500 mg
Half-life: 4 hours

Hour | Remaining Drug (mg) | Elimination %
---------------------------------------------
   0 |              500.00 |          0.0%
   1 |              420.45 |         15.9%
   2 |              353.55 |         29.3%
   3 |              297.30 |         40.5%
   4 |              250.00 |         50.0%
   5 |              210.22 |         58.0%
   6 |              176.78 |         64.6%
   7 |              148.65 |         70.3%
   8 |              125.00 |         75.0%
   9 |              105.11 |         79.0%
  10 |               88.39 |         82.3%
  11 |               74.33 |         85.1%
  12 |               62.50 |         87.5%`,
    explanation: [
      { line: "def simulate_drug_elimination(initial_dose_mg, half_life_hours, total_hours):", desc: "Drug elimination study ke liye function declare kiya jisme dosage aur half-life parameter pass hote hain." },
      { line: "import math", desc: "Scientific calculations (exponential function e^x) ke liye Python ka standard math library import kiya." },
      { line: "ke = 0.693 / half_life_hours", desc: "Elimination rate constant (Ke) calculate kiya. Ye standard mathematical relation hai drug elimination half life aur rate constant me." },
      { line: "for hour in range(0, total_hours + 1):", desc: "Hour 0 se total simulated hours tak iterate karne ke liye for loop chalaya." },
      { line: "remaining = initial_dose_mg * math.exp(-ke * hour)", desc: "First-order elimination formula: C = C0 * e^(-ke * t) apply karke current remaining medicine dose calculate kiya." },
      { line: "eliminated_pct = ((initial_dose_mg - remaining) / initial_dose_mg) * 100", desc: "Total input dose se kitne percent medicine body se eliminate ho chuki hai, wo calculate kiya." },
      { line: "simulate_drug_elimination(initial_dose_mg=500, half_life_hours=4, total_hours=12)", desc: "Function call kiya with 500mg dose (jaise Paracetamol) aur 4 hours half life." }
    ]
  },
  {
    id: 'tablet_dissolution',
    name: 'USP Tablet Dissolution Rate Analyzer',
    category: 'Pharmaceutics',
    description: 'Analyzes active pharmaceutical ingredient (API) release percentages over time and validates against standard USP limits (Q-value).',
    code: `def check_usp_dissolution(q_value, actual_releases_pct):
    print("--- USP Dissolution Stage 1 Evaluation ---")
    print(f"Target USP Q-Value: {q_value}%\\n")
    
    passed_tablets = 0
    total_tablets = len(actual_releases_pct)
    
    # USP S1 Stage Criteria: Each unit must be >= Q + 5%
    required_s1 = q_value + 5
    
    for idx, release in enumerate(actual_releases_pct, 1):
        status = "PASS" if release >= required_s1 else "FAIL (Below Q+5%)"
        if release >= required_s1:
            passed_tablets += 1
        print(f"Tablet #{idx}: Release = {release}% | Status: {status}")
        
    print("-" * 50)
    if passed_tablets == total_tablets:
        print("RESULT: PASS - S1 Stage complete. All 6 units pass criteria!")
    else:
        print(f"RESULT: STAGE 1 FAIL. Only {passed_tablets}/{total_tablets} passed. Proceed to Stage 2 testing.")

# Tested 6 tablets dissolution results for Paracetamol 500mg (USP Target Q=75%)
tablet_results = [82, 85, 79, 88, 81, 74]
check_usp_dissolution(q_value=75, actual_releases_pct=tablet_results)`,
    simulatedOutput: `--- USP Dissolution Stage 1 Evaluation ---
Target USP Q-Value: 75%

Tablet #1: Release = 82% | Status: PASS
Tablet #2: Release = 85% | Status: PASS
Tablet #3: Release = 79% | Status: FAIL (Below Q+5%)
Tablet #4: Release = 88% | Status: PASS
Tablet #5: Release = 81% | Status: PASS
Tablet #6: Release = 74% | Status: FAIL (Below Q+5%)
--------------------------------------------------
RESULT: STAGE 1 FAIL. Only 4/6 passed. Proceed to Stage 2 testing.`,
    explanation: [
      { line: "def check_usp_dissolution(q_value, actual_releases_pct):", desc: "USP guidelines check karne ke liye function banaya jo standard Q-Value aur tablets ke actual readings parameters accept karta hai." },
      { line: "required_s1 = q_value + 5", desc: "USP criteria ke mutabik S1 stage me har individual tablet ka API release percentage (Q + 5)% se zyada hona chahiye." },
      { line: "for idx, release in enumerate(actual_releases_pct, 1):", desc: "Tablet results list par index sequence 1 se enumerate karke traverse kiya." },
      { line: "status = \"PASS\" if release >= required_s1 else \"FAIL (Below Q+5%)\"", desc: "Ternary shorthand expression se comparison operator apply kiya." },
      { line: "if passed_tablets == total_tablets:", desc: "Agar 6 ke 6 tablets pass hain to batch ko successful consider kiya, warna Stage 2 evaluation trigger ki warning di." }
    ]
  },
  {
    id: 'weight_variation',
    name: 'Tablet Weight Variation USP Quality Control Test',
    category: 'Quality Control',
    description: 'Simulates weight variation checks for a sample batch of 20 tablets. Calculates standard deviation and checks USP compliance.',
    code: `def evaluate_weight_variation(tablet_weights_mg):
    import math
    total_tablets = len(tablet_weights_mg)
    average_weight = sum(tablet_weights_mg) / total_tablets
    
    # Calculate Standard Deviation (SD) and Coefficient of Variation (RSD)
    variance = sum((x - average_weight) ** 2 for x in tablet_weights_mg) / total_tablets
    std_dev = math.sqrt(variance)
    rsd = (std_dev / average_weight) * 100
    
    print("--- USP Weight Variation Test ---")
    print(f"Number of Tablets Tested: {total_tablets}")
    print(f"Average Tablet Weight  : {average_weight:.2f} mg")
    print(f"Standard Deviation (SD) : {std_dev:.2f} mg")
    print(f"Relative Std Dev (RSD)  : {rsd:.2f}%\\n")
    
    # USP criteria for > 250mg tablet: No more than 2 tablets deviate by more than 5%
    limit_pct = 5.0
    limit_dev = average_weight * (limit_pct / 100.0)
    out_of_bounds_count = 0
    
    for idx, w in enumerate(tablet_weights_mg, 1):
        deviation = abs(w - average_weight)
        if deviation > limit_dev:
            out_of_bounds_count += 1
            print(f" Tablet #{idx:02d}: {w} mg [DEVIATED by {deviation:.1f} mg (> 5%)]")
            
    print("-" * 55)
    if out_of_bounds_count <= 2:
        print("USP TEST RESULT: PASS (Acceptable weight variation batch)")
    else:
        print(f"USP TEST RESULT: FAIL ({out_of_bounds_count} tablets failed limits, max allowed is 2)")

# 20 tablets weights (messy compounding simulation)
vials_weights = [324, 325, 311, 326, 320, 319, 328, 305, 322, 321,
                 324, 323, 298, 327, 325, 326, 324, 322, 321, 325]
evaluate_weight_variation(vials_weights)`,
    simulatedOutput: `--- USP Weight Variation Test ---
Number of Tablets Tested: 20
Average Tablet Weight  : 321.60 mg
Standard Deviation (SD) : 7.23 mg
Relative Std Dev (RSD)  : 2.25%

 Tablet #03: 311 mg [DEVIATED by 10.6 mg (> 5%)]
 Tablet #08: 305 mg [DEVIATED by 16.6 mg (> 5%)]
 Tablet #13: 298 mg [DEVIATED by 23.6 mg (> 5%)]
-------------------------------------------------------
USP TEST RESULT: FAIL (3 tablets failed limits, max allowed is 2)`,
    explanation: [
      { line: "average_weight = sum(tablet_weights_mg) / total_tablets", desc: "Batch ke sabhi tablets ka standard weight sum karke statistical average calculate kiya." },
      { line: "variance = sum((x - average_weight) ** 2 for x in tablet_weights_mg) / total_tablets", desc: "Variance derive karne ke liye mean se differences ka squares compute kiya." },
      { line: "std_dev = math.sqrt(variance)", desc: "Square root apply karke final standard deviation index nikal liya." },
      { line: "rsd = (std_dev / average_weight) * 100", desc: "Relative Standard Deviation (RSD) calculate kiya, jise coefficient of variation bhi kehte hain. Ye precision index hai." },
      { line: "if deviation > limit_dev:", desc: "Check karta hai ki individual tablet average weight se +/-5% range se bahar to nahi hai." },
      { line: "if out_of_bounds_count <= 2:", desc: "Quality control check standard rule apply kiya: 20 me se max 2 tablets limit pass fail rules cross kar sakti hain." }
    ]
  },
  {
    id: 'alligation_compounding',
    name: 'Alligation Medialis Pharmaceutical Compounding',
    category: 'Compounding Calculations',
    description: 'Calculates correct proportions of high strength and low strength ingredients to prepare a custom target strength formulation.',
    code: `def calculate_compounding_proportions(high_pct, low_pct, target_pct, total_amount_g):
    print("--- Pharmaceutical Compounding Calculator (Alligation Method) ---")
    print(f"High Concentration Stock: {high_pct}%")
    print(f"Low Concentration Stock : {low_pct}%")
    print(f"Desired Target Strength : {target_pct}%")
    print(f"Total Desired Volume    : {total_amount_g} g\\n")
    
    if not (low_pct < target_pct < high_pct):
        print("ERROR: Target strength must be strictly between high and low stock concentrations!")
        return
        
    # Alligation cross-subtraction
    parts_high = target_pct - low_pct
    parts_low = high_pct - target_pct
    total_parts = parts_high + parts_low
    
    # Proportions
    weight_high = (parts_high / total_parts) * total_amount_g
    weight_low = (parts_low / total_parts) * total_amount_g
    
    print(f"Alligation Ratio (High:Low Parts) = {parts_high} : {parts_low}")
    print(f"Total Parts = {total_parts}")
    print("-" * 55)
    print(f"REQUIRED: Mix {weight_high:.2f} g of {high_pct}% stock")
    print(f"AND     : Mix {weight_low:.2f} g of {low_pct}% stock")
    print(f"To get {total_amount_g} g of exactly {target_pct}% formulation!")

# Prepare 500g of 20% Zinc Oxide Ointment from 50% and 10% ointments
calculate_compounding_proportions(high_pct=50, low_pct=10, target_pct=20, total_amount_g=500)`,
    simulatedOutput: `--- Pharmaceutical Compounding Calculator (Alligation Method) ---
High Concentration Stock: 50%
Low Concentration Stock : 10%
Desired Target Strength : 20%
Total Desired Volume    : 500 g

Alligation Ratio (High:Low Parts) = 10 : 30
Total Parts = 40
-------------------------------------------------------
REQUIRED: Mix 125.00 g of 50% stock
AND     : Mix 375.00 g of 10% stock
To get 500 g of exactly 20% formulation!`,
    explanation: [
      { line: "def calculate_compounding_proportions(high_pct, low_pct, target_pct, total_amount_g):", desc: "High, Low, aur Target strength aur desired total target mass ke variables define kiye." },
      { line: "if not (low_pct < target_pct < high_pct):", desc: "Error checking logic: target strength hamesha available inputs ke beech me honi chahiye." },
      { line: "parts_high = target_pct - low_pct", desc: "Alligation grid cross method: High parts ko target minus low percentage se subtract karke calculate karte hain." },
      { line: "parts_low = high_pct - target_pct", desc: "Low parts ko high minus target percentage ke diagonal sub-value se cross calculate kiya jata hai." },
      { line: "weight_high = (parts_high / total_parts) * total_amount_g", desc: "Ratio proportional fractions use karke high strong stock ka absolute mass calculate kiya." },
      { line: "weight_low = (parts_low / total_parts) * total_amount_g", desc: "Ratio proportional fractions use karke diluted stock ingredient ka required weight nikal liya." }
    ]
  }
];


export const INITIAL_TOPICS: Topic[] = [
  // BASICS
  {
    id: 'variables',
    name: 'Variables in Python',
    category: 'basics',
    description: 'Learn how to store and manage data using variables in Python.',
    syllabus: [
      'What is a variable? (Variables क्या होते हैं?)',
      'Naming rules for variables (Variables के नामकरण के नियम)',
      'Assigning values to variables (Value assign करना)',
      'Re-assigning values (Value बदलना)'
    ],
    completed: false,
    unlocked: true,
    quiz: [
      {
        question: 'Which of the following is a valid Python variable name?',
        options: ['2my_var', 'my-var', 'my_var', 'my var'],
        answerIndex: 2,
        explanation: 'In Python, variable names must start with a letter or an underscore, and can only contain letters, numbers, and underscores.'
      },
      {
        question: 'What is the value of x after this code: \n\nx = 10\nx = x + 5\nx = "Python"',
        options: ['15', '"Python"', 'Error', '10'],
        answerIndex: 1,
        explanation: 'Python is dynamically typed. First x is 10, then 15, and finally reassigned to the string "Python".'
      }
    ],
    projectDescription: 'Create a "Smart Bill Calculator" that stores items, prices, and tax rates in separate variables, calculates the total price, and displays a clean invoice.',
    projectStarterCode: `# Store item details
item_name = "Paracetamol Tablets"
item_price = 120.50
quantity = 3
gst_rate = 0.12 # 12% GST

# Calculate total and tax (Calculate here)
# ... Your code here ...
`
  },
  {
    id: 'data_types',
    name: 'Data Types',
    category: 'basics',
    description: 'Explore the main built-in data types: integer, float, string, and boolean.',
    syllabus: [
      'Integers and Floats (पूर्णांक और दशमलव संख्या)',
      'Strings - Text representation (अक्षरों का समूह)',
      'Booleans - True/False values (सही या गलत)',
      'Checking data types with type() (Data type पता करना)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'What will print(type(3.14)) output?',
        options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'double'>"],
        answerIndex: 2,
        explanation: 'In Python, decimal numbers are represented by the float data type.'
      },
      {
        question: 'How do you check the length of a string in Python?',
        options: ['length("hello")', 'len("hello")', '"hello".length()', 'size("hello")'],
        answerIndex: 1,
        explanation: 'The built-in len() function is used to get the number of items or length of a sequence/string.'
      }
    ],
    projectDescription: 'Build a "Medical Dose Advisor" that takes a patient name (string), weight in kg (float), age (int), and calculates recommended medicine dosage as a float.',
    projectStarterCode: `# Patient Data Types
patient_name = "Rohan Sharma"
weight_kg = 72.5
age = 28

# Calculate dosage (e.g. 10mg per kg)
# ... Your code here ...
`
  },
  {
    id: 'input_output',
    name: 'Input & Output',
    category: 'basics',
    description: 'Interact with your users by taking input and printing formatted outputs.',
    syllabus: [
      'Using print() to output data (स्क्रीन पर दिखाना)',
      'Taking input with input() (यूजर से जानकारी लेना)',
      'Typecasting inputs (Input को दूसरे data type में बदलना)',
      'F-strings formatting (फॉरमेटेड आउटपुट)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'What does input() always return by default?',
        options: ['integer', 'string', 'boolean', 'float'],
        answerIndex: 1,
        explanation: 'The input() function always returns a string. If you need numbers, you must typecast it (e.g., int(input())).'
      },
      {
        question: 'Which syntax represents f-string formatting in Python?',
        options: ['print("Hello {name}")', 'print(f"Hello {name}")', 'print("Hello" + name)', 'print("Hello %s", name)'],
        answerIndex: 1,
        explanation: 'F-strings start with "f" or "F" before the quotes, allowing Python variables directly inside curly brackets {}.'
      }
    ],
    projectDescription: 'Create a terminal "Interactive Patient Admission Form" that asks the user for patient name, blood group, and contact number, then prints an elegant digital ID Card using F-strings.',
    projectStarterCode: `# Ask for input
# patient_name = input("Enter Patient Name: ")
# ... Ask other details ...

# Print nicely formatted admission card
# ... Your code here ...
`
  },
  {
    id: 'operators',
    name: 'Operators',
    category: 'basics',
    description: 'Use arithmetic, comparison, and logical operators to build expressions.',
    syllabus: [
      'Arithmetic Operators (+, -, *, /, //, %, **)',
      'Comparison Operators (==, !=, >, <, >=, <=)',
      'Logical Operators (and, or, not)',
      'Operator Precedence (BODMAS in coding)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'What is the output of print(10 // 3) in Python?',
        options: ['3.3333333333333335', '3', '1', 'Error'],
        answerIndex: 1,
        explanation: '// is the floor division operator. It divides the numbers and rounds down to the nearest integer.'
      },
      {
        question: 'What is the output of print(True and not False)?',
        options: ['True', 'False', 'None', 'Error'],
        answerIndex: 0,
        explanation: 'not False is True. So we get: True and True, which is True.'
      }
    ],
    projectDescription: 'Build an "Automated Lab Dilution Ratio Calculator" that takes stock concentration and desired concentration, then computes solvent and solute volumes using arithmetic operators.',
    projectStarterCode: `# Stock and Target Concentration
stock_conc = 100 # mg/mL
target_conc = 25 # mg/mL
total_volume = 200 # mL

# Solute Volume = (Target_conc * Total_volume) / Stock_conc
# Solvent Volume = Total_volume - Solute_volume
# ... Your code here ...
`
  },

  // INTERMEDIATE
  {
    id: 'conditions',
    name: 'Conditions (if-elif-else)',
    category: 'intermediate',
    description: 'Make decisions in your code using conditional blocks.',
    syllabus: [
      'The if statement (अगर ऐसा हो)',
      'The else statement (नहीं तो)',
      'Multiple conditions with elif (या फिर ऐसा हो)',
      'Nested conditions (शर्त के अंदर शर्त)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'Which keyword is used in Python to check multiple sequential conditions?',
        options: ['else if', 'elseif', 'elif', 'switch'],
        answerIndex: 2,
        explanation: 'Python uses "elif" (short for else if) for checking multiple conditions sequentially.'
      }
    ],
    projectDescription: 'Develop a "Pharma Temperature Monitoring System" that checks drug storage temperature. Print "NORMAL" if between 2-8°C, "WARNING: TOO COLD" if under 2, and "ALERT: TOO HOT" if above 8.',
    projectStarterCode: `current_temp = 9.2 # °C

# Check temperature status
# ... Your code here ...
`
  },
  {
    id: 'loops',
    name: 'Loops (For & While)',
    category: 'intermediate',
    description: 'Repeat tasks efficiently using loop structures.',
    syllabus: [
      'For loops - Iterating over ranges/sequences (निश्चित गिनती)',
      'While loops - Conditional repetition (जब तक शर्त पूरी हो)',
      'Loop control: break and continue (लूप को रोकना या आगे बढ़ाना)',
      'Nested loops (लूप के अंदर लूप)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'What is the output of: for i in range(1, 4): print(i)?',
        options: ['1, 2, 3, 4', '1, 2, 3', '0, 1, 2, 3', 'Error'],
        answerIndex: 1,
        explanation: 'range(start, end) is exclusive of the end index. So range(1, 4) produces 1, 2, and 3.'
      }
    ],
    projectDescription: 'Create a "Pill Dosage Scheduler Reminder" that prints a sequence of dosage times for a patient over 7 days, skip printing on day 4 (patient resting day) using the continue keyword.',
    projectStarterCode: `# Scheduler
days = 7

for day in range(1, days + 1):
    # Skip Day 4 using continue
    # ... Your code here ...
`
  },
  {
    id: 'functions',
    name: 'Functions',
    category: 'intermediate',
    description: 'Write reusable blocks of code using parameters and return statements.',
    syllabus: [
      'Defining a function with def (काम का नाम तय करना)',
      'Function arguments & parameters (सामग्री)',
      'Returning values with return (जवाब देना)',
      'Local vs Global scope (सीमाएं)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'Which keyword is used to define a function in Python?',
        options: ['function', 'func', 'def', 'define'],
        answerIndex: 2,
        explanation: 'The "def" keyword is used to define functions in Python.'
      }
    ],
    projectDescription: 'Write a reusable function "calculate_bmi(weight, height)" that calculates BMI and returns a tuple of the numerical value and a patient diagnostic status ("Underweight", "Normal", "Overweight").',
    projectStarterCode: `def calculate_bmi(weight_kg, height_m):
    # bmi = weight / (height * height)
    # Return BMI and Status
    pass # Replace with your code
`
  },
  {
    id: 'modules_libraries',
    name: 'Modules & Libraries',
    category: 'intermediate',
    description: 'Import math, random, datetime, or create custom modules to extend capabilities.',
    syllabus: [
      'Importing built-in modules: import math, random, os',
      'Using aliases (as) and specific imports (from ... import ...)',
      'Creating custom Python modules (खुद का मॉड्यूल बनाना)',
      'Installing external libraries with pip (Pip का इस्तेमाल)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'How do you import only the "sqrt" function from the "math" module?',
        options: ['import sqrt from math', 'from math import sqrt', 'import math.sqrt', 'from math use sqrt'],
        answerIndex: 1,
        explanation: '"from module import function" is the correct syntax for importing specific names.'
      }
    ],
    projectDescription: 'Build an "AI Sample Batch Randomizer" that uses the "random" module to pick 5 random sample IDs from a large batch of research vials (e.g. VIAL-100 to VIAL-999).',
    projectStarterCode: `import random

# Generate or simulate random selection
# ... Your code here ...
`
  },

  // ADVANCED
  {
    id: 'file_handling',
    name: 'File Handling',
    category: 'advanced',
    description: 'Read and write local files (txt, csv) to persist student and research data.',
    syllabus: [
      'Opening files with open() (फाइल खोलना)',
      'Reading files (read(), readline(), readlines())',
      'Writing to files with write() and append ("a")',
      'The "with" statement (फाइल खुद-ब-खुद बंद होना)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'What is the advantage of using the "with open(...)" statement?',
        options: ['It runs faster.', 'It automatically closes the file.', 'It encrypts the file.', 'It prevents writing errors.'],
        answerIndex: 1,
        explanation: 'The "with" block acts as a context manager, ensuring the file is safely closed even if an exception occurs.'
      }
    ],
    projectDescription: 'Create a "Patient Log Creator" that writes clinical test results (such as glucose levels or heart rate) to a "logs.txt" file and reads it back to display a summary report.',
    projectStarterCode: `# Log results to patient_report.txt
patient_name = "Amit Kumar"
sugar_level = 145 # mg/dL

# Write to file and read back
# ... Your code here ...
`
  },
  {
    id: 'exception_handling',
    name: 'Exception Handling',
    category: 'advanced',
    description: 'Prevent program crashes by catching errors using try-except blocks.',
    syllabus: [
      'Understanding Runtime Errors (गलतियां क्या हैं?)',
      'The try-except block (गलती पकड़ने का तरीका)',
      'Handling specific exceptions (ZeroDivisionError, ValueError)',
      'The finally block (हमेशा चलने वाला कोड)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'Which block is executed regardless of whether an exception occurred or not?',
        options: ['except', 'else', 'finally', 'try'],
        answerIndex: 2,
        explanation: 'The "finally" block is always executed, making it perfect for cleanups.'
      }
    ],
    projectDescription: 'Build a "Safe Calculator for Lab Formulas" that takes user inputs and divides stocks. Use try-except to prevent crashes when input is not a number or when dividing by zero.',
    projectStarterCode: `def safe_divide(solute, solvent):
    try:
        # Perform division and handle zero solvent or invalid values
        pass
    except Exception as e:
        print(f"Error caught: {e}")
`
  },
  {
    id: 'oop',
    name: 'Object Oriented Programming (OOP)',
    category: 'advanced',
    description: 'Structure complex codebases using Classes, Objects, and Inheritance.',
    syllabus: [
      'What are Classes and Objects? (ब्लूप्रिंट और वस्तु)',
      'The __init__ constructor (शुरुआती तैयारी)',
      'Class Attributes vs Methods (विशेषताएं और काम)',
      'Inheritance - Reusing classes (एक क्लास से दूसरी क्लास बनाना)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'What does "self" represent inside a Python class method?',
        options: ['The parent class', 'The current instance of the class', 'A private variable', 'An automatic loop counter'],
        answerIndex: 1,
        explanation: '"self" represents the specific object instance that is calling the class method.'
      }
    ],
    projectDescription: 'Define a "Medicine" class with attributes name, chemical_formula, and price. Add a sub-class "Antibiotic" that inherits from Medicine and includes a dosage attribute.',
    projectStarterCode: `class Medicine:
    def __init__(self, name, price):
        self.name = name
        self.price = price

# Inherit and expand with Antibiotic
# ... Your code here ...
`
  },
  {
    id: 'database',
    name: 'Database Integration',
    category: 'advanced',
    description: 'Use sqlite3 to create, read, update, and delete persistent structured records.',
    syllabus: [
      'Introduction to Relational Databases (डेटाबेस का परिचय)',
      'Connecting to SQLite using sqlite3 module',
      'Executing SQL Queries (CREATE, INSERT, SELECT)',
      'Committing changes and closing connections'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'Which built-in Python module is commonly used for a lightweight local database?',
        options: ['mysql', 'mongodb', 'sqlite3', 'postgres'],
        answerIndex: 2,
        explanation: 'Python comes pre-installed with the "sqlite3" module, which is perfect for managing local relational database files.'
      }
    ],
    projectDescription: 'Write a script to build a "Pharmacy Inventory Database" that creates a table, inserts 3 medicines with quantity details, and queries the database for low-stock alerts.',
    projectStarterCode: `import sqlite3

# Connect to database (in-memory or file)
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

# Create table, insert data, and query
# ... Your code here ...
`
  },
  {
    id: 'api',
    name: 'Web APIs and Requests',
    category: 'advanced',
    description: 'Fetch data, connect with other apps, and interact with web services.',
    syllabus: [
      'What is an API? (एपीआई क्या होता है?)',
      'The HTTP protocol (GET, POST requests)',
      'Using the "requests" library to fetch JSON data',
      'Parsing API response data'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'Which HTTP method is typically used to fetch/retrieve data from an API?',
        options: ['POST', 'PUT', 'GET', 'DELETE'],
        answerIndex: 2,
        explanation: 'The GET method is used to retrieve data from a server or API.'
      }
    ],
    projectDescription: 'Create a "Covid-19 Tracker" or "Public Drug Info Search" that makes a simulated GET request to a public healthcare API and displays key information about a drug.',
    projectStarterCode: `# Simulating calling an API
# import requests
# response = requests.get("https://api.fda.gov/drug/label.json?search=ibuprofen&limit=1")
# data = response.json()

# Parse drug results
# ... Your code here ...
`
  },

  // APPLICATIONS
  {
    id: 'app_pharma',
    name: 'Pharma & Drug Discovery',
    category: 'applications',
    description: 'Learn how Python automates calculations and data modeling in Pharmaceutical science.',
    syllabus: [
      'Chemical structure analysis (SMILES representations)',
      'Pharmacokinetics (PK/PD) curve simulations',
      'Automating clinical lab test results filtering',
      'Bioinformatics basics in Python'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'How is Python useful in Pharmacokinetics?',
        options: ['To synthesize chemical formulas directly.', 'To calculate half-life and simulate drug concentration curves.', 'To print medicine container labels.', 'None of the above.'],
        answerIndex: 1,
        explanation: 'Python is heavily used to simulate mathematical models of drug absorption, distribution, metabolism, and excretion (ADME) over time.'
      }
    ],
    projectDescription: 'Write a Python program that simulates a first-order drug elimination model (half-life clearance rate), printing the remaining drug level in a patient body hour-by-hour for 12 hours.',
    projectStarterCode: `# Drug clearance simulator
initial_dose = 500 # mg (e.g. Paracetamol)
half_life_hours = 4

# Print remaining drug concentration over time
# ... Your code here ...
`
  },
  {
    id: 'app_data',
    name: 'Data Analysis (Pandas & Numpy)',
    category: 'applications',
    description: 'Analyze, clean, and visualize large amounts of research or health datasets.',
    syllabus: [
      'Introduction to NumPy arrays (तेज़ कैलकुलेशन)',
      'Pandas DataFrames for tabular data (एक्सेल की तरह डेटा)',
      'Cleaning missing data points',
      'Generating statistics (Mean, Median, Std Dev)'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'Which Python library is most famous for manipulating tabular/Excel-like data structures?',
        options: ['numpy', 'pandas', 'matplotlib', 'requests'],
        answerIndex: 1,
        explanation: '"pandas" is the premier Python library for data manipulation and analysis, introducing the powerful DataFrame structure.'
      }
    ],
    projectDescription: 'Build an "Analyzer for Clinical Trials" that processes patient heart rates during a drug trial, calculates the average heart rate, and outputs a list of anomalies above 100 BPM.',
    projectStarterCode: `# Clinical Trial Heart Rate list
heart_rates = [72, 75, 104, 68, 112, 80, 82, 95]

# Calculate statistics and find anomalies
# ... Your code here ...
`
  },
  {
    id: 'app_research',
    name: 'Scientific Research',
    category: 'applications',
    description: 'Empower scientific discovery with mathematical models, statistics, and graphs.',
    syllabus: [
      'Plotting scientific graphs with Matplotlib (ग्राफ बनाना)',
      'Statistical significance testing with SciPy (T-tests)',
      'Handling high-precision scientific constants',
      'Parsing CSV research outputs'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'Which Matplotlib function is used to draw a simple line chart?',
        options: ['plt.scatter()', 'plt.bar()', 'plt.plot()', 'plt.draw()'],
        answerIndex: 2,
        explanation: 'The plt.plot() function is used to plot coordinate pairs as lines or markers.'
      }
    ],
    projectDescription: 'Write a simulation that generates a synthetic dataset of enzyme reaction rates against substrate concentrations (Michaelis-Menten kinetics) and computes the maximum rate (Vmax).',
    projectStarterCode: `# Enzyme kinetics simulator
# Formula: v = (Vmax * [S]) / (Km + [S])
vmax = 100 # mmol/min
km = 5 # mmol

# Simulate for various substrate concentrations [S]
# ... Your code here ...
`
  },
  {
    id: 'app_automation',
    name: 'Automation & Scripting',
    category: 'applications',
    description: 'Save hundreds of hours by scripting file management, email reporting, and scraping.',
    syllabus: [
      'Automating folder organization with "os" and "shutil"',
      'Automating Excel sheets with "openpyxl"',
      'Web scraping fundamentals using BeautifulSoup',
      'Scheduling scripts to run automatically'
    ],
    completed: false,
    unlocked: false,
    quiz: [
      {
        question: 'Which module would you use to create folders, check file existence, or scan directories in Python?',
        options: ['sys', 'os', 'math', 'datetime'],
        answerIndex: 1,
        explanation: 'The "os" module provides a portable way of using operating system dependent functionality, like creating files and folders.'
      }
    ],
    projectDescription: 'Write an "Automated Lab Report Organizer" script that scans a simulated folder of filenames and automatically renames and organizes them into folders named "Reports", "Data", and "Images".',
    projectStarterCode: `import os

# Simulated list of messy lab files
messy_files = ["vial_test_report.pdf", "spectroscopy_data.csv", "drug_molecular_image.png"]

# Organize them into target folders
# ... Your code here ...
`
  }
];
