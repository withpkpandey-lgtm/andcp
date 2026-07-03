import { LabProgram } from '../types';

export const INITIAL_LABS: LabProgram[] = [
  // 1. PYTHON BASICS LAB
  {
    id: 'basic_hello',
    title: 'Hello World and Basic Print',
    category: 'basics',
    objective: 'Write and run your first Python script to print messages on the screen.',
    theory: 'Python me output print karne ke liye print() function ka use kiya jata hai. Ye screen par message ya values dikhane ke liye sabse basic aur important tool hai.',
    code: `print("Namaste PyGuru Classroom!")
print("Welcome to Python Programming Lab.")
print("Let's learn code together beta!")`,
    lineByLine: [
      { line: 'print("Namaste PyGuru Classroom!")', desc: 'print() function screen par characters ya string print karta hai. Double quotes ke andar ka text output screen par dikhega.' },
      { line: 'print("Welcome to Python Programming Lab.")', desc: 'Is line se second line print hogi, Python automatic end me new line characters add karta hai.' }
    ],
    inputExample: 'None (Self-contained)',
    outputExample: `Namaste PyGuru Classroom!\nWelcome to Python Programming Lab.\nLet's learn code together beta!`,
    practiceTask: 'Apne print message me apna naam (Name) aur apna program status print karne ka script likhiye beta!'
  },
  {
    id: 'basic_io',
    title: 'User Input and Formatting',
    category: 'basics',
    objective: 'Learn how to take dynamic user inputs and print formatted strings (f-strings).',
    theory: 'input() function se user se text receive kiya jata hai. f-strings (formatted string literals) ki help se string ke andar variables ko bracket {} me direct embed kiya jata hai.',
    code: `# Taking input from student
student_name = "Rohan Sharma"  # Simulated input
age = 21

# Printing using elegant f-string format
print(f"Student: {student_name}")
print(f"Age: {age} Years")
print(f"Congratulations {student_name}, your profile is set up!")`,
    lineByLine: [
      { line: 'student_name = "Rohan Sharma"', desc: 'student_name naam ke variable me string value "Rohan Sharma" store ki gyi.' },
      { line: 'print(f"Student: {student_name}")', desc: 'String literal starting with f (f-string) standard variable substitution represent karta hai.' }
    ],
    inputExample: 'Rohan Sharma, 21',
    outputExample: `Student: Rohan Sharma\nAge: 21 Years\nCongratulations Rohan Sharma, your profile is set up!`,
    practiceTask: 'User se unka favorite medicine name poochkar use f-string ke sath display kijiye beta!'
  },
  {
    id: 'basic_vars',
    title: 'Variables and Re-assignment',
    category: 'basics',
    objective: 'Demonstrate declaring variables, checking their values, and changing them.',
    theory: 'Variables parameters or value contain karne wale dabbe hain. Python dynamically typed hai, isme hum aaram se real-time dynamic value change (re-assign) kar sakte hain.',
    code: `medicine_name = "Aspirin"
quantity = 100
print(f"Initial Stock of {medicine_name}: {quantity}")

# Re-assigning new values
quantity = quantity - 25
print(f"Updated Stock of {medicine_name}: {quantity}")`,
    lineByLine: [
      { line: 'medicine_name = "Aspirin"', desc: 'String assign ki gyi medicine_name variable ko.' },
      { line: 'quantity = quantity - 25', desc: 'Purane stock value me se 25 units subtract karke value ko re-assign kiya gya.' }
    ],
    inputExample: 'None',
    outputExample: `Initial Stock of Aspirin: 100\nUpdated Stock of Aspirin: 75`,
    practiceTask: 'Ek variable "wallet_balance" lijiye, usme 500 assign karein aur usme se 120 minus karke updated balance print karein.'
  },
  {
    id: 'basic_datatypes',
    title: 'Data Type Demonstration',
    category: 'basics',
    objective: 'Understand and check different data types (int, float, str, bool) using type().',
    theory: 'Python me primary datatypes hote hain - int (integer), float (decimal), str (text), and bool (True/False). type() function inka data type batata hai.',
    code: `vial_id = 405
concentration = 12.5
active = True
label = "Vaccine batch A"

print(f"vial_id: {vial_id}, Type: {type(vial_id)}")
print(f"concentration: {concentration}, Type: {type(concentration)}")
print(f"active: {active}, Type: {type(active)}")
print(f"label: {label}, Type: {type(label)}")`,
    lineByLine: [
      { line: 'vial_id = 405', desc: 'integer value define ki gyi.' },
      { line: 'print(f"vial_id: {vial_id}, Type: {type(vial_id)}")', desc: 'type() call karke class output display kiya ja raha hai.' }
    ],
    inputExample: 'None',
    outputExample: `vial_id: 405, Type: <class 'int'>\nconcentration: 12.5, Type: <class 'float'>\nactive: True, Type: <class 'bool'>\nlabel: Vaccine batch A, Type: <class 'str'>`,
    practiceTask: 'Char naye variables banayein aur type() print karein check karne ke liye beta!'
  },
  {
    id: 'basic_typecast',
    title: 'Type Conversion (Typecasting)',
    category: 'basics',
    objective: 'Convert values from one data type to another manually.',
    theory: 'Typecast ka matlab hai data type change karna. Jaise integer ko float me badalna float(), string to integer int(), etc.',
    code: `price_str = "150"
# Convert to integer
price_int = int(price_str)
tax = price_int * 0.12

print(f"Converted Price: {price_int} (Type: {type(price_int)})")
print(f"Calculated Tax: {tax}")`,
    lineByLine: [
      { line: 'price_int = int(price_str)', desc: 'String "150" ko real integer numerical value me badalne ke liye int() ka prayog kiya.' }
    ],
    inputExample: 'None',
    outputExample: `Converted Price: 150 (Type: <class 'int'>)\nCalculated Tax: 18.0`,
    practiceTask: 'Decimal weight 82.75 ko int me badalkar display kijiye beta!'
  },
  {
    id: 'basic_operators',
    title: 'Operators Practice',
    category: 'basics',
    objective: 'Perform arithmetic, comparison, and logical checks.',
    theory: 'Python operators use standard symbols: arithmetic (+, -, *, /), floor division (//), exponentiation (**), comparison (==, !=, >, <) aur logical (and, or, not).',
    code: `a = 15
b = 4

print(f"Sum: {a + b}")
print(f"Power (a**2): {a ** 2}")
print(f"Floor Division (15//4): {a // b}")
print(f"Remainder (15%4): {a % b}")
print(f"Are both equal? {a == b}")`,
    lineByLine: [
      { line: 'print(f"Floor Division (15//4): {a // b}")', desc: '// decimal part ko remove karke pure whole number print karta hai.' }
    ],
    inputExample: 'None',
    outputExample: `Sum: 19\nPower (a**2): 225\nFloor Division (15//4): 3\nRemainder (15%4): 3\nAre both equal? False`,
    practiceTask: 'Ek formula check kariye standard drug index: check if (dose > 50 and weight < 100) are True.'
  },

  // 2. CONDITIONAL STATEMENT LAB
  {
    id: 'cond_even_odd',
    title: 'Even or Odd Checker',
    category: 'conditions',
    objective: 'Determine if a number is even or odd using if-else and modulus operator.',
    theory: 'Agar kisi number ko 2 se divide karne par remainder (modulus %) zero bachta hai to vo Even hai, nahi to Odd.',
    code: `number = 37

if number % 2 == 0:
    print(f"The number {number} is EVEN! 👍")
else:
    print(f"The number {number} is ODD! 🐍")`,
    lineByLine: [
      { line: 'if number % 2 == 0:', desc: 'Shart: agar modulus output strict equal zero ho to andr ka code block execute hoga.' }
    ],
    inputExample: '37',
    outputExample: 'The number 37 is ODD! 🐍',
    practiceTask: 'Change number to 120 and test again, fir custom number ka result print kariye.'
  },
  {
    id: 'cond_greatest',
    title: 'Find Greatest Number',
    category: 'conditions',
    objective: 'Find the greatest among three given numbers.',
    theory: 'Sequential logical comparison nested or flat syntax criteria (if-elif-else) use karke teen values ko evaluate karte hain.',
    code: `x = 45
y = 82
z = 56

if x >= y and x >= z:
    greatest = x
elif y >= x and y >= z:
    greatest = y
else:
    greatest = z

print(f"Greatest among {x}, {y}, {z} is: {greatest}")`,
    lineByLine: [
      { line: 'if x >= y and x >= z:', desc: 'Pehli condition logic checks: kya x baaki dono se bada ya barabar hai?' }
    ],
    inputExample: '45, 82, 56',
    outputExample: 'Greatest among 45, 82, 56 is: 82',
    practiceTask: 'Change variables to x=90, y=100, z=500 and run program again!'
  },
  {
    id: 'cond_grades',
    title: 'Student Grade Calculator',
    category: 'conditions',
    objective: 'Calculate letter grades based on student performance marks percentage.',
    theory: 'Grade thresholds: Grade A for >=85%, B for >=70%, C for >=50%, Else Fail. Pawan Sir ka standard marks rule.',
    code: `marks = 78

if marks >= 85:
    grade = "A (Excellent!) 🌟"
elif marks >= 70:
    grade = "B (Good Job!) 👍"
elif marks >= 50:
    grade = "C (Pass) 😊"
else:
    grade = "F (Improvement Needed, hard work beta!) ✍️"

print(f"Marks: {marks}% | Grade: {grade}")`,
    lineByLine: [],
    inputExample: '78',
    outputExample: 'Marks: 78% | Grade: B (Good Job!) 👍',
    practiceTask: 'Verify results for 42% and 92% respectively and see the special message.'
  },
  {
    id: 'cond_calculator',
    title: 'Simple Arithmetic Calculator',
    category: 'conditions',
    objective: 'Build a basic arithmetic operator selector based on conditional inputs.',
    theory: 'Operator matching strings dynamically select parameters and perform arithmetic blocks safely.',
    code: `num1 = 20
num2 = 5
operator = "*"  # Supported: +, -, *, /

if operator == "+":
    result = num1 + num2
elif operator == "-":
    result = num1 - num2
elif operator == "*":
    result = num1 * num2
elif operator == "/":
    result = num1 / num2 if num2 != 0 else "Error (Zero Div)"
else:
    result = "Invalid Operator"

print(f"Calculation: {num1} {operator} {num2} = {result}")`,
    lineByLine: [],
    inputExample: '20, 5, "*"',
    outputExample: 'Calculation: 20 * 5 = 100',
    practiceTask: 'Add check for division by zero exception scenario and test operator with "/"'
  },
  {
    id: 'cond_eligibility',
    title: 'Eligibility Checker',
    category: 'conditions',
    objective: 'Validate voter or clinical trial participant eligibility.',
    theory: 'Age and weight conditions decide if a patient is allowed to participate in clinical dose testing trials.',
    code: `age = 22
weight = 55

if age >= 18 and weight >= 50:
    print("Eligible for Clinical Trial Research! ✅")
else:
    print("Not Eligible! Age or Weight criteria not matched. ❌")`,
    lineByLine: [],
    inputExample: 'Age: 22, Weight: 55',
    outputExample: 'Eligible for Clinical Trial Research! ✅',
    practiceTask: 'Write a script to check if license status is eligible if age >= 18.'
  },

  // 3. LOOP LAB
  {
    id: 'loop_for',
    title: 'For Loop Sequence Iteration',
    category: 'loops',
    objective: 'Iterate over ranges and display step outputs.',
    theory: 'For loops sequence structure iterate karne ke liye ideal hote hain (jaise list, range, string).',
    code: `print("Counting sequence 1 to 5:")
for number in range(1, 6):
    print(f"Vial Index Number: {number}")`,
    lineByLine: [
      { line: 'for number in range(1, 6):', desc: 'Is loop me standard python range list generator execute ho rha hai jo 1 se 5 (6 excluded) chalega.' }
    ],
    inputExample: 'None',
    outputExample: `Counting sequence 1 to 5:\nVial Index Number: 1\nVial Index Number: 2\nVial Index Number: 3\nVial Index Number: 4\nVial Index Number: 5`,
    practiceTask: 'Print table of squares of first 5 natural numbers using for loop.'
  },
  {
    id: 'loop_while',
    title: 'While Loop with Condition Check',
    category: 'loops',
    objective: 'Repeat code block until a condition remains True.',
    theory: 'While loop tab tak chalta hai jab tak defined logic conditional statement True return kare.',
    code: `stock_level = 5

while stock_level > 0:
    print(f"Dispensing capsule! Remaining stock: {stock_level}")
    stock_level -= 1

print("Out of Stock! Re-order immediately! 🚨")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Dispensing capsule! Remaining stock: 5\nDispensing capsule! Remaining stock: 4\nDispensing capsule! Remaining stock: 3\nDispensing capsule! Remaining stock: 2\nDispensing capsule! Remaining stock: 1\nOut of Stock! Re-order immediately! 🚨`,
    practiceTask: 'Increment a variable counter from 1 to 10 using while loop.'
  },
  {
    id: 'loop_table',
    title: 'Multiplication Table Generator',
    category: 'loops',
    objective: 'Print a clean mathematical multiplication table for any given integer.',
    theory: 'A variable multiplier increases from 1 to 10 in a loop and multiplies with target base integer.',
    code: `table_of = 8

print(f"Multiplication Table for {table_of}:")
print("-" * 30)
for i in range(1, 11):
    print(f"{table_of} x {i:02d} = {table_of * i}")`,
    lineByLine: [],
    inputExample: '8',
    outputExample: `Multiplication Table for 8:\n------------------------------\n8 x 01 = 8\n8 x 02 = 16\n8 x 03 = 24\n...\n8 x 10 = 80`,
    practiceTask: 'Create table generator for 12 and 19!'
  },
  {
    id: 'loop_factorial',
    title: 'Factorial Calculator Program',
    category: 'loops',
    objective: 'Calculate the factorial of a positive integer (e.g., 5! = 120).',
    theory: 'Factorial is product of all positive integers less than or equal to n. Calculated sequentially in a loop.',
    code: `num = 5
factorial = 1

for i in range(1, num + 1):
    factorial *= i

print(f"Factorial of {num} is: {factorial}")`,
    lineByLine: [],
    inputExample: '5',
    outputExample: 'Factorial of 5 is: 120',
    practiceTask: 'Find the factorial of 7 using Python loop.'
  },
  {
    id: 'loop_prime',
    title: 'Prime Number Checker',
    category: 'loops',
    objective: 'Check if a given number is prime (only divisible by 1 and itself).',
    theory: 'Prime number 2 se lekar half of value tak kisi aur number se perfectly divide (%) nahi hota.',
    code: `num = 29
is_prime = True

if num <= 1:
    is_prime = False
else:
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            is_prime = False
            break

if is_prime:
    print(f"{num} is a PRIME number! 🌟")
else:
    print(f"{num} is NOT a prime number!")`,
    lineByLine: [],
    inputExample: '29',
    outputExample: '29 is a PRIME number! 🌟',
    practiceTask: 'Test if 100 and 101 are prime numbers.'
  },
  {
    id: 'loop_fibonacci',
    title: 'Fibonacci Series Generator',
    category: 'loops',
    objective: 'Generate a sequence of numbers where each is sum of previous two.',
    theory: 'Fibonacci starting terms are 0 and 1. Next terms are derived by adding preceding values.',
    code: `terms = 8
n1, n2 = 0, 1
count = 0

print("Fibonacci sequence:")
while count < terms:
    print(n1, end=" -> ")
    nth = n1 + n2
    n1 = n2
    n2 = nth
    count += 1
print("End")`,
    lineByLine: [],
    inputExample: '8',
    outputExample: 'Fibonacci sequence:\n0 -> 1 -> 1 -> 2 -> 3 -> 5 -> 8 -> 13 -> End',
    practiceTask: 'Generate Fibonacci series up to 12 terms.'
  },

  // 4. FUNCTION LAB
  {
    id: 'func_basic',
    title: 'Creating Functions and Reusability',
    category: 'functions',
    objective: 'Define a function with def, call it multiple times.',
    theory: 'Function code block ko dry design pattern (Dont Repeat Yourself) ke help se write and manage karta hai.',
    code: `def greet_student():
    print("Welcome to PyGuru Academy! 🎓")
    print("Padhai shuru karo beta! Keep coding.")

# Calling function
greet_student()
greet_student()`,
    lineByLine: [
      { line: 'def greet_student():', desc: 'def keyword se custom function greet_student define kiya.' }
    ],
    inputExample: 'None',
    outputExample: 'Welcome to PyGuru Academy! 🎓\nPadhai shuru karo beta! Keep coding.\nWelcome to PyGuru Academy! 🎓\nPadhai shuru karo beta! Keep coding.',
    practiceTask: 'Write a function named "show_server_status" that prints a custom server notice!'
  },
  {
    id: 'func_params',
    title: 'Functions with Parameters',
    category: 'functions',
    objective: 'Pass dynamic input arguments to custom defined functions.',
    theory: 'Function parenthesis ke andar parameters variables placeholders bankar data receive karte hain.',
    code: `def check_temperature(sample_id, temp):
    print(f"Vial {sample_id} recorded temperature is {temp}°C")
    if temp > 8:
        print("🚨 ALERT: Temperature exceeds limits! Save drug immediately.")
    else:
        print("✅ Status normal. Safe storage range.")

check_temperature("BATCH-102A", 9.5)
print("-" * 40)
check_temperature("BATCH-105B", 4.2)`,
    lineByLine: [],
    inputExample: '"BATCH-102A", 9.5',
    outputExample: `Vial BATCH-102A recorded temperature is 9.5°C\n🚨 ALERT: Temperature exceeds limits! Save drug immediately.\n----------------------------------------\nVial BATCH-105B recorded temperature is 4.2°C\n✅ Status normal. Safe storage range.`,
    practiceTask: 'Write a function "dose_calculator" that accepts weight and dosage_mg_per_kg to calculate patient dose.'
  },
  {
    id: 'func_return',
    title: 'Functions with Return Values',
    category: 'functions',
    objective: 'Return calculations results back to caller using the return keyword.',
    theory: 'return keyword response value generator ke roop me mathematical logic output return karta hai jo print ya store ho sake.',
    code: `def convert_celsius_to_fahrenheit(celsius):
    fahrenheit = (celsius * 9/5) + 32
    return fahrenheit

result = convert_celsius_to_fahrenheit(37)
print(f"Human body temperature: 37°C is equal to {result}°F")`,
    lineByLine: [],
    inputExample: '37',
    outputExample: 'Human body temperature: 37°C is equal to 98.6°F',
    practiceTask: 'Create a return-based percentage calculator function.'
  },
  {
    id: 'func_lambda',
    title: 'Lambda (Anonymous) Functions',
    category: 'functions',
    objective: 'Write concise, single-line anonymous expressions in Python.',
    theory: 'Lambda keyword single statement function create karta hai jise inline utility blocks ke sath map aur filter me use karte hain.',
    code: `# Simple lambda to calculate GST (12%)
calculate_gst = lambda price: price * 0.12

print(f"GST for 500 Rs: {calculate_gst(500)}")
print(f"GST for 1200 Rs: {calculate_gst(1200)}")`,
    lineByLine: [],
    inputExample: '500, 1200',
    outputExample: 'GST for 500 Rs: 60.0\nGST for 1200 Rs: 144.0',
    practiceTask: 'Create a lambda function "cube" that calculates cube of a number (x**3).'
  },

  // 5. DATA STRUCTURE LAB
  {
    id: 'ds_lists',
    title: 'List Operations and Manipulation',
    category: 'data_structures',
    objective: 'Create, modify, append, and slice Python lists.',
    theory: 'Lists index-based mutable ordered items arrays hain. Multi-item datasets storage ke liye perfect hain.',
    code: `medicines = ["Paracetamol", "Aspirin", "Ibuprofen"]
print(f"Original List: {medicines}")

# Append element
medicines.append("Amoxicillin")
print(f"After Append: {medicines}")

# Slicing first two
print(f"First two items: {medicines[0:2]}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Original List: ['Paracetamol', 'Aspirin', 'Ibuprofen']\nAfter Append: ['Paracetamol', 'Aspirin', 'Ibuprofen', 'Amoxicillin']\nFirst two items: ['Paracetamol', 'Aspirin']`,
    practiceTask: 'Create list of 5 clinical blood groups and reverse them.'
  },
  {
    id: 'ds_tuples',
    title: 'Tuples (Immutable Sequences)',
    category: 'data_structures',
    objective: 'Understand immutable collections and tuple unpacking.',
    theory: 'Tuples constant fixed values ke ordered, immutable sequences hote hain, jinhe change nahi kiya ja sakta.',
    code: `lab_location = (28.6139, 77.2090)  # Delhi Coordinates
print(f"Lab Latitude: {lab_location[0]}")
print(f"Lab Longitude: {lab_location[1]}")

# Trying to edit will fail: lab_location[0] = 12.0 (Throws TypeError)`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Lab Latitude: 28.6139\nLab Longitude: 77.209`,
    practiceTask: 'Create a tuple representation of a specific chemical formula ratio.'
  },
  {
    id: 'ds_dicts',
    title: 'Dictionary (Key-Value Pairs)',
    category: 'data_structures',
    objective: 'Manage structured data entries using key-value pair attributes.',
    theory: 'Dictionaries JSON format structure mutable items pairs hain jinhe descriptive keys se access kiya jata hai.',
    code: `patient = {
    "id": "PT-901",
    "name": "Amit Shah",
    "blood_group": "B+",
    "weight": 70
}

print(f"Patient Name: {patient['name']}")
# Add value
patient["age"] = 35
print(f"Updated Patient details: {patient}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Patient Name: Amit Shah\nUpdated Patient details: {'id': 'PT-901', 'name': 'Amit Shah', 'blood_group': 'B+', 'weight': 70, 'age': 35}`,
    practiceTask: 'Create a medicine info dictionary with price, composition and dosage parameters.'
  },
  {
    id: 'ds_sets',
    title: 'Sets (Unique Unordered Collections)',
    category: 'data_structures',
    objective: 'Work with set math, unions, intersections, and unique elements filtering.',
    theory: 'Sets distinct duplicates-free collection arrays hain. Inme order preservation nahi hota.',
    code: `lab_a_active = {"Paracetamol", "Aspirin", "Ibuprofen"}
lab_b_active = {"Aspirin", "Amoxicillin", "Insulin"}

# Intersection: Common medicines
common = lab_a_active.intersection(lab_b_active)
union_all = lab_a_active.union(lab_b_active)

print(f"Common items: {common}")
print(f"All Active Items list: {union_all}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Common items: {'Aspirin'}\nAll Active Items list: {'Ibuprofen', 'Paracetamol', 'Aspirin', 'Insulin', 'Amoxicillin'}`,
    practiceTask: 'Verify sets unique filters by creating a duplicate items list and converting to set().'
  },
  {
    id: 'ds_search_sort',
    title: 'Searching and Sorting Algorithms',
    category: 'data_structures',
    objective: 'Implement Linear Search and standard ascending list sorting.',
    theory: 'Python arrays me dynamic lookup linear/binary search algorithm aur .sort() system values order karte hain.',
    code: `temperatures = [8, 12, 5, 22, 14, 2]
print(f"Unsorted Labs: {temperatures}")

temperatures.sort()
print(f"Sorted Labs (Ascending): {temperatures}")

# Search
search_val = 22
found = search_val in temperatures
print(f"Is {search_val}°C present in monitored batch? {found}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Unsorted Labs: [8, 12, 5, 22, 14, 2]\nSorted Labs (Ascending): [2, 5, 8, 12, 14, 22]\nIs 22°C present in monitored batch? True`,
    practiceTask: 'Write a loop that prints index index position of search_val inside temperatures list.'
  },

  // 6. FILE HANDLING LAB
  {
    id: 'file_create_write',
    title: 'Create and Write to Local Files',
    category: 'file_handling',
    objective: 'Write logs into a physical text file on local device directory.',
    theory: 'with open() command context manager execute karta hai jisse file write complete hone ke baad auto-close ho jaye.',
    code: `# Create a custom clinical log file
with open("clinical_notes.txt", "w") as f:
    f.write("Batch Code: PK-009A\\n")
    f.write("Status: Dissolution Stage 1 Passed\\n")
    f.write("Evaluator: Mr. Pawan Sir\\n")

print("File 'clinical_notes.txt' successfully created and saved! 📝")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: "File 'clinical_notes.txt' successfully created and saved! 📝",
    practiceTask: 'Apna name details test karke custom file write script generate kijiye.'
  },
  {
    id: 'file_read',
    title: 'Read Data from Local Files',
    category: 'file_handling',
    objective: 'Read string files text buffer block sequentially.',
    theory: 'open() with mode r character reader activate karta hai, content .read() variable output print block me pull hota hai.',
    code: `try:
    with open("clinical_notes.txt", "r") as f:
        content = f.read()
    print("--- Reading File Content ---")
    print(content)
except FileNotFoundError:
    print("Arey beta file nahi mili! First run 'Create and Write File' lab.")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `--- Reading File Content ---\nBatch Code: PK-009A\nStatus: Dissolution Stage 1 Passed\nEvaluator: Mr. Pawan Sir`,
    practiceTask: 'Create file "temp.txt", write a single line, and read it back.'
  },
  {
    id: 'file_update',
    title: 'Update / Append Data into File',
    category: 'file_handling',
    objective: 'Append new records at the end of existing file lines.',
    theory: 'Open file inside append mode "a" to write content trailing list indices pe overwrite kiye bina.',
    code: `with open("clinical_notes.txt", "a") as f:
    f.write("Date: 25-June-2026\\n")

print("Successfully appended details to 'clinical_notes.txt'. Let's read it back!")
with open("clinical_notes.txt", "r") as f:
    print(f.read())`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Successfully appended details to 'clinical_notes.txt'. Let's read it back!\nBatch Code: PK-009A\nStatus: Dissolution Stage 1 Passed\nEvaluator: Mr. Pawan Sir\nDate: 25-June-2026`,
    practiceTask: 'Append patient entry to the log file!'
  },
  {
    id: 'file_student_records',
    title: 'Student Record Management System',
    category: 'file_handling',
    objective: 'Store student profiles logs and load reports dynamically.',
    theory: 'Comma separated values format write and read loops records save structure coordinate karte hain.',
    code: `# Create records list database in CSV style
records = [
    "Rahul Verma,B.pharm,2109401",
    "Priya Patel,D.pharm,2109503"
]

with open("student_db.csv", "w") as f:
    f.write("Name,Course,Roll\\n")
    for r in records:
        f.write(r + "\\n")

# Reading and parsing database
print("Database loaded successfully:")
with open("student_db.csv", "r") as f:
    lines = f.readlines()
    for l in lines:
        print(f"Record: {l.strip()}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Database loaded successfully:\nRecord: Name,Course,Roll\nRecord: Rahul Verma,B.pharm,2109401\nRecord: Priya Patel,D.pharm,2109503`,
    practiceTask: 'Write utility to add new students records sequentially from custom input parameters.'
  },

  // 7. OBJECT ORIENTED PROGRAMMING LAB
  {
    id: 'oop_basic',
    title: 'Class and Object Blueprint',
    category: 'oop',
    objective: 'Define a Python class and instantiate objects.',
    theory: 'Class ek template blueprint hai aur Object us class ka runtime concrete state instance hota hai.',
    code: `class Vaccine:
    name = "Covid Shield"
    efficacy = "90%"

# Instantiating objects
v1 = Vaccine()
print(f"Vaccine Name: {v1.name}")
print(f"Efficacy rate: {v1.efficacy}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Vaccine Name: Covid Shield\nEfficacy rate: 90%`,
    practiceTask: 'Create an "Instrument" class with name and usage, then create two objects.'
  },
  {
    id: 'oop_constructor',
    title: 'The __init__ Constructor Method',
    category: 'oop',
    objective: 'Initialize object attributes dynamically when creating class instances.',
    theory: 'The special constructor method __init__ runs automatically when object memory space instantiates.',
    code: `class Drug:
    def __init__(self, brand_name, price, stock):
        self.brand_name = brand_name
        self.price = price
        self.stock = stock

    def show_info(self):
        print(f"Brand: {self.brand_name} | Price: {self.price} Rs | Stock: {self.stock}")

drug1 = Drug("Paracetamol 650", 15, 2000)
drug2 = Drug("Combiflam", 22, 1500)

drug1.show_info()
drug2.show_info()`,
    lineByLine: [
      { line: '    def __init__(self, brand_name, price, stock):', desc: 'Constructor initialization definition. self keyword coordinates current object state properties.' }
    ],
    inputExample: 'None',
    outputExample: `Brand: Paracetamol 650 | Price: 15 Rs | Stock: 2000\nBrand: Combiflam | Price: 22 Rs | Stock: 1500`,
    practiceTask: 'Add chemical_salt attribute inside Drug class init and print.'
  },
  {
    id: 'oop_inheritance',
    title: 'Class Inheritance (Reusability)',
    category: 'oop',
    objective: 'Inherit child class structures and properties from parent class.',
    theory: 'Child class derived attributes parent class ke methods direct inherit up-use aur extend karti hai.',
    code: `class Medicine:
    def __init__(self, name):
        self.name = name
    def describe(self):
        print(f"This is a pharmaceutical medicine: {self.name}")

class Antibiotic(Medicine):
    def __init__(self, name, dosage):
        super().__init__(name)
        self.dosage = dosage
    def show_details(self):
        self.describe()
        print(f"Antibiotic Dosage rule: {self.dosage}")

anti = Antibiotic("Amoxicillin", "Three times daily")
anti.show_details()`,
    lineByLine: [
      { line: 'class Antibiotic(Medicine):', desc: 'Antibiotic class declare ki jo parent class Medicine ke rules inherit karti hai.' },
      { line: '        super().__init__(name)', desc: 'super() parent constructor ko pass karke variable details store state link karega.' }
    ],
    inputExample: 'None',
    outputExample: `This is a pharmaceutical medicine: Amoxicillin\nAntibiotic Dosage rule: Three times daily`,
    practiceTask: 'Create "Syrup" subclass that has additional attribute "flavor" and overrides describe().'
  },
  {
    id: 'oop_encapsulation',
    title: 'Encapsulation (Private Members)',
    category: 'oop',
    objective: 'Restrict direct public variable write-access using double underscore syntax.',
    theory: 'Encapsulation ensures details integrity. Double underscore (__) variables private data encapsulation generate karte hain.',
    code: `class PatientAccount:
    def __init__(self, name, balance):
        self.name = name
        self.__balance = balance  # Private member

    def get_balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

acc = PatientAccount("Suresh", 5000)
acc.deposit(1500)
print(f"Patient Account Name: {acc.name}")
print(f"Secure Balance check: {acc.get_balance()}")
# print(acc.__balance) # This line will FAIL due to encapsulation restriction!`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Patient Account Name: Suresh\nSecure Balance check: 6500`,
    practiceTask: 'Create private field "ssn" in Patient and fetch using get_ssn() method.'
  },
  {
    id: 'oop_polymorphism',
    title: 'Polymorphism (Dynamic Methods)',
    category: 'oop',
    objective: 'Execute different behaviors from identically named methods.',
    theory: 'Polymorphism generic action classes standard method implementations signature customize block coordinate karta hai.',
    code: `class Vial:
    def cap_color(self):
        print("Default clear transparent cap")

class InsulinVial(Vial):
    def cap_color(self):
        print("🔴 Orange cap for standard safety check")

class OralSyrupBottle(Vial):
    def cap_color(self):
        print("🟢 Green child-resistant screw cap")

# Multi-vials iteration
vials = [InsulinVial(), OralSyrupBottle()]
for v in vials:
    v.cap_color()`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `🔴 Orange cap for standard safety check\n🟢 Green child-resistant screw cap`,
    practiceTask: 'Add "OphthalmicBottle" subclass that overrides cap_color with "Blue cap".'
  },

  // 8. PYTHON LIBRARIES LAB
  {
    id: 'lib_math',
    title: 'Math Library Operations',
    category: 'libraries',
    objective: 'Use scientific math utilities, logs, and trigonometric standards.',
    theory: 'Python math library standard scientific parameters calculations handle karne ke function provide karti hai.',
    code: `import math

print(f"Pi value: {math.pi}")
print(f"Log (Base 10) of 100: {math.log10(100)}")
print(f"Square Root of 625: {math.sqrt(625)}")
print(f"Ceil and Floor of 3.4: Ceil={math.ceil(3.4)}, Floor={math.floor(3.4)}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Pi value: 3.141592653589793\nLog (Base 10) of 100: 2.0\nSquare Root of 625: 25.0\nCeil and Floor of 3.4: Ceil=4, Floor=3`,
    practiceTask: 'Use math library to calculate sin(90 degrees) - hint: math.radians(90).'
  },
  {
    id: 'lib_random',
    title: 'Random Library Simulations',
    category: 'libraries',
    objective: 'Generate randomized numbers, shuffle, or select items.',
    theory: 'random library is used for generating pseudo-random variations, perfect for sampling vials.',
    code: `import random

print(f"Random float between 0 and 1: {random.random():.4f}")
print(f"Random int between 1 and 100: {random.randint(1, 100)}")

vials = ["V-1", "V-2", "V-3", "V-4"]
print(f"Random Selected Vial sample: {random.choice(vials)}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Random float between 0 and 1: 0.3842\nRandom int between 1 and 100: 67\nRandom Selected Vial sample: V-3`,
    practiceTask: 'Shuffle a list of blood groups and print the result.'
  },
  {
    id: 'lib_datetime',
    title: 'Datetime and Clinical Durations',
    category: 'libraries',
    objective: 'Work with dates, formatted timestamps, and time intervals.',
    theory: 'The datetime module handles clock operations, tracking prescription expiry date validation.',
    code: `import datetime

now = datetime.datetime.now()
print(f"Current System Time: {now.strftime('%d-%b-%Y %H:%M')}")

# Expiry Date checker
days_to_expire = 180
expiry_date = now + datetime.timedelta(days=days_to_expire)
print(f"Medicine Expiry Date (180 days from now): {expiry_date.strftime('%Y-%m-%d')}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Current System Time: 25-Jun-2026 18:50\nMedicine Expiry Date (180 days from now): 2026-12-22`,
    practiceTask: 'Calculate difference between custom date and current system timestamp.'
  },
  {
    id: 'lib_numpy',
    title: 'NumPy Array Vector Mathematics',
    category: 'libraries',
    objective: 'Perform fast multi-dimensional vector array calculations.',
    theory: 'NumPy handles highly dense research metrics. Simulated NumPy list uses list comprehensions to mimic array actions.',
    code: `# Simulated NumPy arrays for standard devices compatibility
import math

weights = [500, 502, 498, 495, 505]  # Simulated NumPy Array
print(f"Weights raw array: {weights}")

mean_weight = sum(weights) / len(weights)
print(f"Calculated Mean: {mean_weight:.2f} mg")

# Simulated vectorized addition (Add 5mg formulation bias)
boosted_weights = [w + 5 for w in weights]
print(f"Vectorized addition output (+5mg): {boosted_weights}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Weights raw array: [500, 502, 498, 495, 505]\nCalculated Mean: 500.00 mg\nVectorized addition output (+5mg): [505, 507, 503, 500, 510]`,
    practiceTask: 'Calculate relative standard deviation array ratios using mathematical loops.'
  },
  {
    id: 'lib_pandas',
    title: 'Pandas Tabular Statistics',
    category: 'libraries',
    objective: 'Structure tabular active records into virtual tables.',
    theory: 'Pandas DataFrames hold rows-columns Excel formats. Simulated data structure tracks trial metrics.',
    code: `# Simulated Pandas drug dictionary
trials_data = [
    {"patient": "P1", "dose": 50, "response": 1.2},
    {"patient": "P2", "dose": 100, "response": 2.4},
    {"patient": "P3", "dose": 150, "response": 3.8}
]

print("Simulated trial dataframe visualization:")
print(f"{'Patient':<10} | {'Dose (mg)':<10} | {'Response %':<10}")
print("-" * 38)
for row in trials_data:
    print(f"{row['patient']:<10} | {row['dose']:<10} | {row['response']:<10}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `Simulated trial dataframe visualization:\nPatient    | Dose (mg)  | Response %\n--------------------------------------\nP1         | 50         | 1.2       \nP2         | 100        | 2.4       \nP3         | 150        | 3.8       `,
    practiceTask: 'Add another clinical patient record row inside dataset and print.'
  },
  {
    id: 'lib_matplotlib',
    title: 'Matplotlib ASCII Chart Plotting',
    category: 'libraries',
    objective: 'Generate a text-based ASCII response graph line for quick display.',
    theory: 'Scientific charts can be elegantly simulated using ASCII bars to visualize trends in text terminal environment.',
    code: `hours = [1, 2, 3, 4, 5]
vial_yields = [10, 25, 45, 60, 80]

print("--- Simulated Matplotlib Trend Chart Plot ---")
print("Hour | Percent Yield progress bar")
print("-" * 45)
for h, y in zip(hours, vial_yields):
    bar = "█" * (y // 5)
    print(f"Hr {h}  | {y:3d}% {bar}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `--- Simulated Matplotlib Trend Chart Plot ---\nHour | Percent Yield progress bar\n---------------------------------------------\nHr 1  |  10% ██\nHr 2  |  25% █████\nHr 3  |  45% █████████\nHr 4  |  60% ████████████\nHr 5  |  80% ████████████████`,
    practiceTask: 'Increase yields list and print extended dynamic growth chart!'
  },

  // 9. PHARMA SCIENCE PYTHON LAB (SPECIAL MODULE)
  {
    id: 'pharma_inventory',
    title: 'Medicine Inventory Calculation',
    category: 'pharma',
    objective: 'Manage and update stock of pharmaceutical drugs dynamically.',
    theory: 'Calculate the total value of stock and flag drugs that are below reorder threshold limits.',
    code: `inventory = [
    {"name": "Paracetamol 500", "stock": 420, "price": 12.0, "min_required": 100},
    {"name": "Amoxicillin 250", "stock": 45, "price": 45.0, "min_required": 80},
    {"name": "Metformin 500", "stock": 510, "price": 8.5, "min_required": 150},
    {"name": "Insulin Glargine", "stock": 12, "price": 320.0, "min_required": 20}
]

print("--- Pharmacy Low Stock Alerts ---")
for drug in inventory:
    total_val = drug["stock"] * drug["price"]
    status = "OK" if drug["stock"] >= drug["min_required"] else "⚠️ REORDER NOW"
    print(f"Drug: {drug['name']:<15} | Stock: {drug['stock']:3d} | Total Val: {total_val:7.2f} Rs | Status: {status}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `--- Pharmacy Low Stock Alerts ---\nDrug: Paracetamol 500 | Stock: 420 | Total Val: 5040.00 Rs | Status: OK\nDrug: Amoxicillin 250 | Stock:  45 | Total Val: 2025.00 Rs | Status: ⚠️ REORDER NOW\nDrug: Metformin 500   | Stock: 510 | Total Val: 4335.00 Rs | Status: OK\nDrug: Insulin Glargine | Stock:  12 | Total Val: 3840.00 Rs | Status: ⚠️ REORDER NOW`,
    practiceTask: 'Add code to calculate sum of total inventory value and print.'
  },
  {
    id: 'pharma_dose',
    title: 'Pediatric Dose Calculation',
    category: 'pharma',
    objective: 'Calculate accurate drug dosage for children using standard formulas.',
    theory: "Young's Rule is used to calculate dosage based on child age: Child Dose = (Age / (Age + 12)) * Adult Dose. Also Clark's Rule: (Weight in lbs / 150) * Adult Dose.",
    code: `adult_dose_mg = 500  # Adult Paracetamol dose
child_age = 6        # Years
child_weight_lbs = 45 # lbs

# Young's Rule
youngs_dose = (child_age / (child_age + 12)) * adult_dose_mg

# Clark's Rule
clarks_dose = (child_weight_lbs / 150) * adult_dose_mg

print("--- Pediatric Dosage Evaluation ---")
print(f"Adult standard dose: {adult_dose_mg} mg")
print(f"Child Age: {child_age} yrs | Weight: {child_weight_lbs} lbs")
print(f"Young's Rule Dose : {youngs_dose:.2f} mg")
print(f"Clark's Rule Dose : {clarks_dose:.2f} mg")`,
    lineByLine: [
      { line: 'youngs_dose = (child_age / (child_age + 12)) * adult_dose_mg', desc: "Young's formula division logic parameters calculated in floats." }
    ],
    inputExample: 'Adult Dose: 500, Age: 6, Weight: 45 lbs',
    outputExample: `--- Pediatric Dosage Evaluation ---\nAdult standard dose: 500 mg\nChild Age: 6 yrs | Weight: 45 lbs\nYoung's Rule Dose : 166.67 mg\nClark's Rule Dose : 150.00 mg`,
    practiceTask: 'Convert child_weight from kg to lbs and calculate Clark\'s dose - (1 kg = 2.204 lbs).'
  },
  {
    id: 'pharma_db',
    title: 'Drug Database Query Simulator',
    category: 'pharma',
    objective: 'Search active molecules and interactions in simulated medical database.',
    theory: 'Python dictionaries and lists act as database structures to filter specific pharmaceutical parameters.',
    code: `drug_db = [
    {"generic": "Paracetamol", "brands": ["Calpol", "Crocin"], "category": "Antipyretic", "kidney_safe": True},
    {"generic": "Ibuprofen", "brands": ["Brufen", "Combiflam"], "category": "NSAID", "kidney_safe": False},
    {"generic": "Amoxicillin", "brands": ["Novamox"], "category": "Antibiotic", "kidney_safe": True}
]

search_term = "Ibuprofen"
print(f"Querying Database for generic: {search_term}")
print("-" * 40)

for drug in drug_db:
    if drug["generic"].lower() == search_term.lower():
        print(f"Found! Category: {drug['category']}")
        print(f"Common Brands: {', '.join(drug['brands'])}")
        print(f"Safe for Chronic Kidney Patients? {'Yes' if drug['kidney_safe'] else '🔴 NO - Consult doctor'}")`,
    lineByLine: [],
    inputExample: '"Ibuprofen"',
    outputExample: `Querying Database for generic: Ibuprofen\n----------------------------------------\nFound! Category: NSAID\nCommon Brands: Brufen, Combiflam\nSafe for Chronic Kidney Patients? 🔴 NO - Consult doctor`,
    practiceTask: 'Search for "Amoxicillin" and output details.'
  },
  {
    id: 'pharma_patient',
    title: 'Patient Record Management',
    category: 'pharma',
    objective: 'Filter patients database based on chronic conditions.',
    theory: 'Iterate arrays to parse blood-pressure ranges or specific ailments to raise warning triggers.',
    code: `patients = [
    {"id": "P01", "name": "Deepak Kumar", "systolic": 145, "diastolic": 95},
    {"id": "P02", "name": "Meera Sen", "systolic": 118, "diastolic": 76},
    {"id": "P03", "name": "Rohan Jha", "systolic": 152, "diastolic": 98}
]

print("--- Clinical Patient Hypertension Screening ---")
for p in patients:
    is_hyper = p["systolic"] >= 140 or p["diastolic"] >= 90
    status = "🔴 HYPERTENSIVE ALERT" if is_hyper else "✅ NORMAL BP"
    print(f"ID: {p['id']} | Patient: {p['name']:<14} | BP: {p['systolic']}/{p['diastolic']} | Status: {status}")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `--- Clinical Patient Hypertension Screening ---\nID: P01 | Patient: Deepak Kumar   | BP: 145/95 | Status: 🔴 HYPERTENSIVE ALERT\nID: P02 | Patient: Meera Sen     | BP: 118/76 | Status: ✅ NORMAL BP\nID: P03 | Patient: Rohan Jha     | BP: 152/98 | Status: 🔴 HYPERTENSIVE ALERT`,
    practiceTask: 'Filter patients list to only show normal BP patients.'
  },
  {
    id: 'pharma_unit',
    title: 'Clinical Unit Conversion',
    category: 'pharma',
    objective: 'Perform conversions of medical indices (mg to mcg, Celsius to Fahrenheit).',
    theory: 'In pharmaceutical sciences, precise calculations are necessary. 1 mg = 1000 micrograms (mcg). 1 ounce = 29.57 mL.',
    code: `def mg_to_mcg(mg):
    return mg * 1000

def fluid_ounce_to_ml(ounces):
    return ounces * 29.57

print("--- Pharmacy Unit Conversions ---")
print(f"0.5 mg in mcg  = {mg_to_mcg(0.5)} mcg")
print(f"2 Fluid Ounces = {fluid_ounce_to_ml(2):.2f} mL")`,
    lineByLine: [],
    inputExample: '0.5 mg, 2 ounces',
    outputExample: `--- Pharmacy Unit Conversions ---\n0.5 mg in mcg  = 500.0 mcg\n2 Fluid Ounces = 59.14 mL`,
    practiceTask: 'Add translation for lbs to kg: 1 lb = 0.45359 kg.'
  },
  {
    id: 'pharma_stats',
    title: 'Statistical Analysis of Experimental Data',
    category: 'pharma',
    objective: 'Find mean, standard variance, and outliers of medical batch assays.',
    theory: 'Active constituent yield percentages from different assay groups are statistically analyzed.',
    code: `assay_yields = [98.5, 99.2, 97.8, 101.5, 98.9]  # percentages

mean_yield = sum(assay_yields) / len(assay_yields)
variance = sum((y - mean_yield) ** 2 for y in assay_yields) / len(assay_yields)
std_dev = variance ** 0.5

print("--- Clinical Assay Statistical Review ---")
print(f"Number of Assays: {len(assay_yields)}")
print(f"Mean Active Yield : {mean_yield:.2f}%")
print(f"Standard Deviation: {std_dev:.2f}%")
print(f"Variance Score    : {variance:.4f}%")`,
    lineByLine: [],
    inputExample: 'None',
    outputExample: `--- Clinical Assay Statistical Review ---\nNumber of Assays: 5\nMean Active Yield : 99.18%\nStandard Deviation: 1.25%\nVariance Score    : 1.5736%`,
    practiceTask: 'Calculate the margin of error at 95% confidence (approximated as 1.96 * std_dev).'
  }
];
