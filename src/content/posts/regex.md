---
title: "Regular Expressions (Regex)"
description: "A clear and practical guide to regular expressions: how they work and how to apply them to real-world text processing tasks."
authors: ["Akreed"]
tags: []
pubDate: "24 Jul 2025"
image: "../../assets/posts/regex.png"

---

## Definition and Purpose

A **regular expression**, often abbreviated as "regex" or "regexp", is a sequence of characters that forms a search pattern. In computer science, regular expressions are a fundamental tool for text processing and manipulation. Their primary purpose is to identify, match, or manage specific patterns within textual data.

Common applications include:

* **Data Validation**: Ensuring user input conforms to a specific format (e.g., email addresses, phone numbers, postal codes).
* **Data Extraction (Parsing)**: Isolating and extracting specific pieces of information from larger bodies of text (e.g., scraping log files, retrieving dates from documents).
* **Search and Replace Operations**: Performing complex and dynamic find-and-replace actions within strings or files.

## Fundamental components of Regular Expressions

A regular expression pattern is constructed from two main types of characters: **literals** and **metacharacters**.

* **Literals** are characters that are interpreted as themselves, such as the letters `a` through `z` or the digits `0` through `9`.
* **Metacharacters** are special symbols that have a predefined meaning within the regex engine. To match a metacharacter literally, it must be escaped with a backslash (`\`).

### Basic Metacharacters and Quantifiers

The most essential metacharacters and constructs are detailed below.

| Symbol(s) | Name | Description |
| :--- | :--- | :--- |
| `.` | Dot | Matches any single character, with the common exception of the newline character. |
| `*` | Asterisk | A quantifier that matches the preceding element **zero or more** times. |
| `+` | Plus Sign | A quantifier that matches the preceding element **one or more** times. |
| `?` | Question Mark | A quantifier that matches the preceding element **zero or one** time. It makes the preceding element optional. |
| `{n,m}` | Curly Braces | A generic quantifier to match the preceding element between `n` and `m` times, inclusive. `{n}` matches exactly `n` times; `{n,}` matches at least `n` times. |

### Character Classes

Character classes, or character sets, allow for matching one character from a specific group of characters.

| Expression | Name | Description |
| :--- | :--- | :--- |
| `[ ]` | Character Set | Matches any single character enclosed within the brackets. For example, `[aeiou]` matches any lowercase vowel. Ranges can be specified, e.g., `[a-z]`. |
| `[^ ]` | Negated Set | Matches any single character **not** enclosed within the brackets. For example, `[ˆ0-9]` matches any non-digit character. |
| `\d` | Digit | A shorthand for `[0-9]`. |
| `\w` | Word Character | A shorthand for `[a-zA-Z0-9_]`. |
| `\s` | Whitespace | A shorthand for whitespace characters such as space, tab, and newline. |
| `\D`, `\W`, `\S`| Negated Shorthands | Match any character that is not a digit, word character, or whitespace, respectively. |

### Anchors

Anchors are metacharacters that assert a position in the string. They do not match characters but rather locations.

| Anchor | Name | Description |
| :--- | :--- | :--- |
| `^` | Caret | Asserts the position at the start of the string. |
| `$` | Dollar | Asserts the position at the end of the string. |
| `\b` | Word Boundary | Asserts a position between a word character (`\w`) and a non-word character (`\W`) or at the start/end of the string. |

### Grouping and Alternation

| Symbol | Name | Description |
| :--- | :--- | :--- |
| `( )` | Parentheses | Groups multiple tokens together, creating a sub-expression. Quantifiers can be applied to the entire group. |
| `\|` | Pipe / Alternation | Functions as a logical OR operator, matching the expression on its left or the one on its right. |

## Examples / Exercises

The following examples / exercises demonstrate the application of these concepts.

### Pattern Matching for File Extensions

* **Sample Text**: `image.jpg, document.pdf, photo.png, music.mp3, archive.zip, data.csv, image.jpeg`
* **Objective**: Construct a pattern to match only image files with extensions `.jpg`, `.png`, or `.jpeg`.

<details>
    <summary>
        <b>Solution Pattern</b>
    </summary>

* `\w+\.(jpg|png|jpeg)`
* **Analysis**:
    * `\w+`: Matches the filename, which consists of one or more word characters.
    * `\.`: Matches the literal dot character that separates the filename from the extension.
    * `(jpg|png|jpeg)`: This is a capturing group that uses alternation (`|`) to match one of the specified extensions.
</details>

### Data Validation of Numeric Strings

* **Sample Text**: `My numbers are 415-555-1234 and 999-888-7777. Not 123-456-789 or 555-5555-555.`
* **Objective**: Isolate strings that conform to the North American phone number format `XXX-XXX-XXXX`.

<details>
    <summary>
        <b>Solution Pattern</b>
    </summary>

* `\b\d{3}-\d{3}-\d{4}\b`
* **Analysis**:
    * `\b`: A word boundary to ensure the pattern does not match as part of a larger number sequence.
    * `\d{3}`: A quantifier specifying exactly three digit characters.
    * `-`: Matches the literal hyphen separator.
    * `\d{4}`: A quantifier specifying exactly four digit characters.
</details>

### Extraction of Email Addresses

* **Sample Text**: `Contact us at support@example.com or sales.team@corp.co.uk. Invalid: user@.com`
* **Objective**: Match validly structured email addresses.

<details>
    <summary>
        <b>Solution Pattern</b>
    </summary>

* `[\w.-]+@[\w.-]+\.\w{2,}`
* **Analysis**:
    * `[\w.-]+`: A character set matching the local-part of the email address. It permits one or more word characters, dots, or hyphens.
    * `@`: Matches the literal "@" symbol.
    * `[\w.-]+`: Matches the domain name.
    * `\.`: Matches the literal dot preceding the top-level domain.
    * `\w{2,}`: Matches the top-level domain, requiring at least two word characters (e.g., `com`, `net`, `uk`).
</details>

## Resources

* [regexone.com](https://regexone.com)
* [regexr.com](https://regexr.com/)
* [regex101.com](https://regex101.com/)