const interviewPrograms = [
  {
    category: "Strings",
    title: "Reverse a string",
    difficulty: "Easy",
    prompt: "Return the characters of a string in reverse order.",
    approach: "Python slicing supports a step of -1. This creates a reversed string without changing the original.",
    complexity: "Time O(n); space O(n) for the resulting string.",
    code: "text = \"python\"\nreversed_text = text[::-1]\nprint(reversed_text)",
    output: "nohtyp"
  },
  {
    category: "Strings",
    title: "Check for a palindrome",
    difficulty: "Easy",
    prompt: "Check whether text reads the same forward and backward, ignoring case and non-alphanumeric characters.",
    approach: "Normalize the text first, then compare it with its reverse.",
    complexity: "Time O(n); space O(n) for normalized text.",
    code: "def is_palindrome(text):\n    cleaned = \"\".join(\n        char.lower() for char in text if char.isalnum()\n    )\n    return cleaned == cleaned[::-1]\n\nprint(is_palindrome(\"A man, a plan, a canal: Panama!\"))",
    output: "True"
  },
  {
    category: "Strings",
    title: "Count vowels and consonants",
    difficulty: "Easy",
    prompt: "Count English vowels and consonant letters in a string, ignoring digits and punctuation.",
    approach: "Normalize letters to lowercase and count only alphabetic characters.",
    complexity: "Time O(n); extra space O(1).",
    code: "def count_letters(text):\n    vowels = set(\"aeiou\")\n    vowel_count = consonant_count = 0\n    for char in text.lower():\n        if char.isalpha():\n            if char in vowels:\n                vowel_count += 1\n            else:\n                consonant_count += 1\n    return vowel_count, consonant_count\n\nprint(count_letters(\"Python 3!\"))",
    output: "(1, 5)"
  },
  {
    category: "Strings",
    title: "Build a character frequency map",
    difficulty: "Easy",
    prompt: "Count how many times each character occurs in a string.",
    approach: "Use a dictionary and increment the count for each character.",
    complexity: "Time O(n); space O(k), where k is the number of unique characters.",
    code: "def character_counts(text):\n    counts = {}\n    for char in text:\n        counts[char] = counts.get(char, 0) + 1\n    return counts\n\nprint(character_counts(\"level\"))",
    output: "{'l': 2, 'e': 2, 'v': 1}"
  },
  {
    category: "Strings",
    title: "Check whether two strings are anagrams",
    difficulty: "Easy",
    prompt: "Determine whether two strings contain the same letters with the same frequencies, ignoring spaces and case.",
    approach: "Normalize both strings and compare their character frequency maps.",
    complexity: "Time O(n + m); space O(k).",
    code: "from collections import Counter\n\ndef are_anagrams(first, second):\n    normalize = lambda text: \"\".join(text.lower().split())\n    return Counter(normalize(first)) == Counter(normalize(second))\n\nprint(are_anagrams(\"Dormitory\", \"Dirty room\"))",
    output: "True"
  },
  {
    category: "Strings",
    title: "Find the first non-repeating character",
    difficulty: "Easy",
    prompt: "Return the first character that appears exactly once, or None when there is no such character.",
    approach: "Count characters once, then scan the original string in order.",
    complexity: "Time O(n); space O(k).",
    code: "from collections import Counter\n\ndef first_unique(text):\n    counts = Counter(text)\n    return next((char for char in text if counts[char] == 1), None)\n\nprint(first_unique(\"swiss\"))",
    output: "w"
  },
  {
    category: "Strings",
    title: "Remove duplicate characters",
    difficulty: "Easy",
    prompt: "Remove repeated characters while preserving the first-seen order.",
    approach: "Track characters in a set and append only the first occurrence.",
    complexity: "Time O(n) average; space O(k).",
    code: "def unique_characters(text):\n    seen = set()\n    result = []\n    for char in text:\n        if char not in seen:\n            seen.add(char)\n            result.append(char)\n    return \"\".join(result)\n\nprint(unique_characters(\"banana\"))",
    output: "ban"
  },
  {
    category: "Strings",
    title: "Check balanced parentheses",
    difficulty: "Medium",
    prompt: "Check whether parentheses, brackets, and braces are correctly nested and balanced.",
    approach: "Push opening brackets onto a stack. Each closing bracket must match the most recent opener.",
    complexity: "Time O(n); space O(n) in the worst case.",
    code: "def is_balanced(text):\n    pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for char in text:\n        if char in \"([{\":\n            stack.append(char)\n        elif char in pairs:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n    return not stack\n\nprint(is_balanced(\"{[()]}\"))",
    output: "True"
  },
  {
    category: "Strings",
    title: "Find the longest word",
    difficulty: "Easy",
    prompt: "Return the longest whitespace-separated word in a sentence.",
    approach: "Split into words and use max with len as the key. Define how ties or empty input should behave.",
    complexity: "Time O(n); space O(n) for the split words.",
    code: "def longest_word(sentence):\n    words = sentence.split()\n    return max(words, key=len, default=\"\")\n\nprint(longest_word(\"Code clearly every day\"))",
    output: "clearly"
  },
  {
    category: "Numbers",
    title: "Calculate factorial",
    difficulty: "Easy",
    prompt: "Calculate n! for a non-negative integer n.",
    approach: "Multiply integers from 2 through n. By convention, 0! is 1.",
    complexity: "Time O(n); space O(1), excluding the growing integer result.",
    code: "def factorial(n):\n    if n < 0:\n        raise ValueError(\"n must be non-negative\")\n    result = 1\n    for value in range(2, n + 1):\n        result *= value\n    return result\n\nprint(factorial(5))",
    output: "120"
  },
  {
    category: "Numbers",
    title: "Generate the Fibonacci sequence",
    difficulty: "Easy",
    prompt: "Return the first n Fibonacci numbers, beginning with 0 and 1.",
    approach: "Keep the two most recent values and update them at each iteration.",
    complexity: "Time O(n); space O(n) for the returned list.",
    code: "def fibonacci(n):\n    result = []\n    a, b = 0, 1\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(fibonacci(7))",
    output: "[0, 1, 1, 2, 3, 5, 8]"
  },
  {
    category: "Numbers",
    title: "Check whether a number is prime",
    difficulty: "Easy",
    prompt: "Return True if n is a prime number and False otherwise.",
    approach: "Reject values below 2. It is enough to test divisors up to the square root of n.",
    complexity: "Time O(√n); space O(1).",
    code: "from math import isqrt\n\ndef is_prime(n):\n    if n < 2:\n        return False\n    for divisor in range(2, isqrt(n) + 1):\n        if n % divisor == 0:\n            return False\n    return True\n\nprint(is_prime(29))",
    output: "True"
  },
  {
    category: "Numbers",
    title: "List primes up to a limit",
    difficulty: "Medium",
    prompt: "Return every prime number less than or equal to limit.",
    approach: "Use the Sieve of Eratosthenes: mark multiples of each prime as composite.",
    complexity: "Time O(n log log n); space O(n).",
    code: "def primes_up_to(limit):\n    if limit < 2:\n        return []\n    prime = [True] * (limit + 1)\n    prime[0] = prime[1] = False\n    for value in range(2, int(limit ** 0.5) + 1):\n        if prime[value]:\n            for multiple in range(value * value, limit + 1, value):\n                prime[multiple] = False\n    return [value for value, is_prime in enumerate(prime) if is_prime]\n\nprint(primes_up_to(20))",
    output: "[2, 3, 5, 7, 11, 13, 17, 19]"
  },
  {
    category: "Numbers",
    title: "Find the greatest common divisor",
    difficulty: "Easy",
    prompt: "Find the greatest common divisor of two integers.",
    approach: "Use Euclid's algorithm: gcd(a, b) equals gcd(b, a % b). Python's standard library provides math.gcd.",
    complexity: "Time O(log(min(a, b))); space O(1) for the iterative method.",
    code: "from math import gcd\n\nprint(gcd(48, 18))",
    output: "6"
  },
  {
    category: "Numbers",
    title: "Find the least common multiple",
    difficulty: "Easy",
    prompt: "Find the least common multiple of two integers.",
    approach: "For non-zero inputs, lcm(a, b) = abs(a*b) // gcd(a, b). math.lcm handles zero and multiple arguments.",
    complexity: "Time O(log(min(a, b))); space O(1).",
    code: "from math import lcm\n\nprint(lcm(12, 18))",
    output: "36"
  },
  {
    category: "Numbers",
    title: "Check for an Armstrong number",
    difficulty: "Easy",
    prompt: "Check whether a non-negative number equals the sum of its digits raised to the number of digits.",
    approach: "Convert to digits, raise each to the digit count, and compare the sum with the original number.",
    complexity: "Time O(d); space O(d), where d is the number of digits.",
    code: "def is_armstrong(number):\n    digits = str(number)\n    power = len(digits)\n    return number == sum(int(digit) ** power for digit in digits)\n\nprint(is_armstrong(153))",
    output: "True"
  },
  {
    category: "Numbers",
    title: "Check for a perfect number",
    difficulty: "Medium",
    prompt: "Check whether a positive integer equals the sum of its positive proper divisors.",
    approach: "Find divisors in pairs up to the square root, taking care not to count the square root twice.",
    complexity: "Time O(√n); space O(1).",
    code: "from math import isqrt\n\ndef is_perfect(number):\n    if number < 2:\n        return False\n    total = 1\n    for divisor in range(2, isqrt(number) + 1):\n        if number % divisor == 0:\n            total += divisor\n            pair = number // divisor\n            if pair != divisor:\n                total += pair\n    return total == number\n\nprint(is_perfect(28))",
    output: "True"
  },
  {
    category: "Lists & arrays",
    title: "Find the second-largest distinct number",
    difficulty: "Easy",
    prompt: "Return the second-largest distinct value, or raise an error if fewer than two distinct values exist.",
    approach: "Remove duplicates, sort, and select the second-to-last value. In a performance-sensitive setting, track the top two values in one pass.",
    complexity: "Time O(n log n); space O(n).",
    code: "def second_largest(values):\n    distinct = sorted(set(values))\n    if len(distinct) < 2:\n        raise ValueError(\"need two distinct values\")\n    return distinct[-2]\n\nprint(second_largest([8, 3, 8, 5, 1]))",
    output: "5"
  },
  {
    category: "Lists & arrays",
    title: "Remove duplicates and keep order",
    difficulty: "Easy",
    prompt: "Return a list with duplicates removed while preserving the first occurrence.",
    approach: "Use a set to track seen values and a list to preserve their original order.",
    complexity: "Time O(n) average; space O(n).",
    code: "def unique_in_order(values):\n    seen = set()\n    result = []\n    for value in values:\n        if value not in seen:\n            seen.add(value)\n            result.append(value)\n    return result\n\nprint(unique_in_order([3, 1, 3, 2, 1]))",
    output: "[3, 1, 2]"
  },
  {
    category: "Lists & arrays",
    title: "Find a pair that sums to a target",
    difficulty: "Medium",
    prompt: "Return the indices of two distinct values whose sum equals target, or None if no pair exists.",
    approach: "For each number, check whether its complement has already appeared in a dictionary.",
    complexity: "Time O(n) average; space O(n).",
    code: "def two_sum(values, target):\n    earlier = {}\n    for index, value in enumerate(values):\n        needed = target - value\n        if needed in earlier:\n            return earlier[needed], index\n        earlier[value] = index\n    return None\n\nprint(two_sum([2, 7, 11, 15], 9))",
    output: "(0, 1)"
  },
  {
    category: "Lists & arrays",
    title: "Binary search in a sorted list",
    difficulty: "Medium",
    prompt: "Return the index of target in a sorted list, or -1 if it is absent.",
    approach: "Compare with the middle element and discard half of the remaining search range each step.",
    complexity: "Time O(log n); space O(1).",
    code: "def binary_search(values, target):\n    left, right = 0, len(values) - 1\n    while left <= right:\n        middle = (left + right) // 2\n        if values[middle] == target:\n            return middle\n        if values[middle] < target:\n            left = middle + 1\n        else:\n            right = middle - 1\n    return -1\n\nprint(binary_search([1, 4, 6, 9, 12], 9))",
    output: "3"
  },
  {
    category: "Lists & arrays",
    title: "Merge two sorted lists",
    difficulty: "Medium",
    prompt: "Merge two sorted lists into one sorted result without sorting the combined data again.",
    approach: "Advance two pointers, repeatedly appending the smaller current value.",
    complexity: "Time O(n + m); space O(n + m) for the result.",
    code: "def merge_sorted(first, second):\n    result = []\n    i = j = 0\n    while i < len(first) and j < len(second):\n        if first[i] <= second[j]:\n            result.append(first[i])\n            i += 1\n        else:\n            result.append(second[j])\n            j += 1\n    return result + first[i:] + second[j:]\n\nprint(merge_sorted([1, 4, 7], [2, 3, 8]))",
    output: "[1, 2, 3, 4, 7, 8]"
  },
  {
    category: "Lists & arrays",
    title: "Find the missing number",
    difficulty: "Easy",
    prompt: "A list contains distinct values from 0 through n with one missing. Find the missing value.",
    approach: "Subtract the actual sum from the expected arithmetic-series sum.",
    complexity: "Time O(n); space O(1), excluding the input.",
    code: "def missing_number(values):\n    n = len(values)\n    return n * (n + 1) // 2 - sum(values)\n\nprint(missing_number([3, 0, 1]))",
    output: "2"
  },
  {
    category: "Lists & arrays",
    title: "Rotate a list to the right",
    difficulty: "Easy",
    prompt: "Rotate a list right by k positions. Return an empty list for empty input.",
    approach: "Reduce k modulo the list length, then join the last k items with the prefix.",
    complexity: "Time O(n); space O(n) for the returned list.",
    code: "def rotate_right(values, k):\n    if not values:\n        return []\n    k %= len(values)\n    return values[-k:] + values[:-k] if k else values[:]\n\nprint(rotate_right([1, 2, 3, 4, 5], 2))",
    output: "[4, 5, 1, 2, 3]"
  },
  {
    category: "Lists & arrays",
    title: "Move zeros to the end",
    difficulty: "Easy",
    prompt: "Move all zero values to the end while preserving the order of non-zero values.",
    approach: "Collect non-zero values in order and append the required number of zeros.",
    complexity: "Time O(n); space O(n) for the result.",
    code: "def move_zeros(values):\n    nonzero = [value for value in values if value != 0]\n    return nonzero + [0] * (len(values) - len(nonzero))\n\nprint(move_zeros([0, 1, 0, 3, 12]))",
    output: "[1, 3, 12, 0, 0]"
  },
  {
    category: "Lists & arrays",
    title: "Find the maximum subarray sum",
    difficulty: "Medium",
    prompt: "Find the largest sum of any non-empty contiguous subarray.",
    approach: "Kadane's algorithm tracks the best subarray ending at the current position and the best overall.",
    complexity: "Time O(n); space O(1).",
    code: "def max_subarray_sum(values):\n    if not values:\n        raise ValueError(\"values must not be empty\")\n    current = best = values[0]\n    for value in values[1:]:\n        current = max(value, current + value)\n        best = max(best, current)\n    return best\n\nprint(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))",
    output: "6"
  },
  {
    category: "Lists & arrays",
    title: "Flatten a nested list",
    difficulty: "Medium",
    prompt: "Flatten a list nested exactly one level deep.",
    approach: "Use two loops or a nested list comprehension, preserving left-to-right order.",
    complexity: "Time O(n); space O(n) for the flattened output.",
    code: "def flatten_once(nested):\n    return [item for group in nested for item in group]\n\nprint(flatten_once([[1, 2], [3], [4, 5]]))",
    output: "[1, 2, 3, 4, 5]"
  },
  {
    category: "Lists & arrays",
    title: "Transpose a matrix",
    difficulty: "Easy",
    prompt: "Return the transpose of a rectangular matrix.",
    approach: "Zip rows together; each tuple from zip forms a column. Convert the tuples back into lists.",
    complexity: "Time O(r × c); space O(r × c) for the result.",
    code: "def transpose(matrix):\n    return [list(column) for column in zip(*matrix)]\n\nprint(transpose([[1, 2, 3], [4, 5, 6]]))",
    output: "[[1, 4], [2, 5], [3, 6]]"
  },
  {
    category: "Lists & arrays",
    title: "Count word frequencies",
    difficulty: "Easy",
    prompt: "Count words case-insensitively in a sentence.",
    approach: "Normalize case, split on whitespace, and count with collections.Counter.",
    complexity: "Time O(n); space O(k), where k is the number of unique words.",
    code: "from collections import Counter\n\ndef word_counts(sentence):\n    return Counter(sentence.lower().split())\n\nprint(dict(word_counts(\"red blue red\")))",
    output: "{'red': 2, 'blue': 1}"
  },
  {
    category: "Algorithms",
    title: "FizzBuzz",
    difficulty: "Easy",
    prompt: "For numbers 1 through n, output Fizz for multiples of 3, Buzz for multiples of 5, FizzBuzz for both, otherwise the number.",
    approach: "Check divisibility by 15 first, then 3 and 5, so the combined case is not missed.",
    complexity: "Time O(n); space O(n) for the returned list.",
    code: "def fizzbuzz(n):\n    result = []\n    for number in range(1, n + 1):\n        if number % 15 == 0:\n            result.append(\"FizzBuzz\")\n        elif number % 3 == 0:\n            result.append(\"Fizz\")\n        elif number % 5 == 0:\n            result.append(\"Buzz\")\n        else:\n            result.append(str(number))\n    return result\n\nprint(fizzbuzz(5))",
    output: "['1', '2', 'Fizz', '4', 'Buzz']"
  },
  {
    category: "Algorithms",
    title: "Implement a stack with a list",
    difficulty: "Easy",
    prompt: "Demonstrate last-in, first-out push and pop operations.",
    approach: "Use list.append to push and list.pop to remove the most recently added item.",
    complexity: "Append and pop from the end are amortized O(1).",
    code: "stack = []\nstack.append(\"first\")\nstack.append(\"second\")\nlast_added = stack.pop()\nprint(last_added)\nprint(stack)",
    output: "second\n['first']"
  },
  {
    category: "Algorithms",
    title: "Implement a queue with deque",
    difficulty: "Easy",
    prompt: "Demonstrate first-in, first-out enqueue and dequeue operations.",
    approach: "collections.deque supports efficient append at the end and popleft at the front.",
    complexity: "Append and popleft are O(1).",
    code: "from collections import deque\n\nqueue = deque()\nqueue.append(\"first\")\nqueue.append(\"second\")\nserved = queue.popleft()\nprint(served)\nprint(list(queue))",
    output: "first\n['second']"
  },
  {
    category: "Algorithms",
    title: "Find the intersection of two lists",
    difficulty: "Easy",
    prompt: "Return the unique values that occur in both lists.",
    approach: "Convert one input to a set for average O(1) membership checks, then preserve the order from the first list.",
    complexity: "Time O(n + m) average; space O(m + k).",
    code: "def intersection(first, second):\n    second_values = set(second)\n    return list(dict.fromkeys(\n        value for value in first if value in second_values\n    ))\n\nprint(intersection([1, 2, 2, 3], [2, 3, 4]))",
    output: "[2, 3]"
  },
  {
    category: "Algorithms",
    title: "Find the most frequent item",
    difficulty: "Easy",
    prompt: "Return the most frequent value from a non-empty sequence.",
    approach: "Count values with Counter and select the most common entry. Clarify tie-breaking if the interviewer requires it.",
    complexity: "Time O(n); space O(k).",
    code: "from collections import Counter\n\ndef most_frequent(values):\n    if not values:\n        raise ValueError(\"values must not be empty\")\n    return Counter(values).most_common(1)[0][0]\n\nprint(most_frequent([\"a\", \"b\", \"a\", \"c\", \"a\"]))",
    output: "a"
  },
  {
    category: "Algorithms",
    title: "Merge overlapping intervals",
    difficulty: "Medium",
    prompt: "Merge intervals that overlap, assuming each interval is [start, end].",
    approach: "Sort by start, then either extend the previous interval or append a new interval.",
    complexity: "Time O(n log n); space O(n) for the result.",
    code: "def merge_intervals(intervals):\n    merged = []\n    for start, end in sorted(intervals):\n        if merged and start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged\n\nprint(merge_intervals([[1, 3], [2, 6], [8, 10]]))",
    output: "[[1, 6], [8, 10]]"
  },
  {
    category: "Algorithms",
    title: "Find the longest common prefix",
    difficulty: "Easy",
    prompt: "Find the longest prefix shared by every string in a list.",
    approach: "Start with the first string as a candidate and shorten it until every word starts with it.",
    complexity: "Time O(n × m) in the worst case; space O(m), where m is the candidate prefix length.",
    code: "def longest_common_prefix(words):\n    if not words:\n        return \"\"\n    prefix = words[0]\n    for word in words[1:]:\n        while not word.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix:\n                return \"\"\n    return prefix\n\nprint(longest_common_prefix([\"flower\", \"flow\", \"flight\"]))",
    output: "fl"
  }
];
