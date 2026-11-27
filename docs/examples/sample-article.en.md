---
title: "Understanding Python Variables Through Simple Examples"
description: "Learn what Python variables are, how to name them, and how to use values in a small beginner-friendly program."
pubDate: 2026-11-28T09:00:00+07:00
coverImage: "/images/ilustrasi-tipe-data-dasar.webp"
tags: ["python", "programming", "beginner", "variables"]
isDraft: true
idSlug: "mengenal-variabel-python-melalui-contoh-sederhana"
faq:
  - q: "Does Python require explicit variable type declarations?"
    a: "Not for ordinary use. Python determines the type from the assigned value."
  - q: "Can a variable name start with a number?"
    a: "No. A variable name must start with a letter or an underscore."
---

Programs often need to keep information temporarily: a user's name, an item count, or a process status. In Python, one of the simplest ways to refer to a value is through a **variable**.

## What Is a Variable?

A variable is a name that refers to a value. Think of it as a label on a box: the label tells us what the box represents without requiring us to remember where it is stored.

```python
name = "Budi"
age = 17

print(name)
print(age)
```

In this example, `name` refers to the text `"Budi"`, while `age` refers to the number `17`.

## Basic Naming Rules

Keep these rules in mind:

- A variable name may contain letters, numbers, and underscores.
- It cannot start with a number.
- Names are case-sensitive (`name` is different from `Name`).
- Do not use Python keywords as variable names.
- Choose names that communicate the purpose of the data.

```python
student_name = "Alya"
book_count = 4
is_logged_in = True

print(student_name, book_count, is_logged_in)
```

## Common Mistakes

`2name` is invalid because it starts with a number. `student-name` is not a regular variable name because the hyphen is interpreted as a subtraction operator. Use `student_name` or `studentName` instead.

```python
# Valid
student_name = "Alya"

# Invalid: uncomment the following lines to see a SyntaxError
# 2name = "Alya"
# student-name = "Alya"
```

## Conclusion

Variables give names to values, making programs easier to read and maintain. Start with clear, descriptive names. Once you understand variables, move on to data types to learn which operations are available for different values.
