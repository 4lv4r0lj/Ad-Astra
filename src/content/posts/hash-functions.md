---
title: "Hash Functions"
description: "An in-depth guide to cryptographic hash functions, their essential security properties, use cases and practical examples."
authors: ["Akreed"]
tags: ["hash-function", "cryptography", "data-integrity", "python", "security"]
pubDate: "27 Sep 2025"
image: "../../assets/posts/hash-functions.png"
---

A **hash function** is a deterministic mathematical algorithm that takes an input of arbitrary size—such as a file, a string, or any block of digital data—and converts it into a fixed-length string of bytes. This output is known as a hash value, hash code, message digest, or fingerprint. The core property of a hash function is its determinism: the same input will always produce the exact same output, consistently and predictably, every single time it is processed by the same function.

It is essential to understand the distinction between a **general-purpose hash function** and a **cryptographic hash function**.

A **general-purpose hash function** is designed for speed and efficiency in contexts where collisions, or two different inputs mapping to the same output, are a minor concern. These are commonly used in data structures like hash tables to quickly map keys to indices in an array, enabling near-constant-time data lookups, insertions, and deletions. For these applications, a collision simply means a slight performance degradation as the system must resolve the conflict, but it does not represent a security risk. The primary goal is to distribute data uniformly to minimize these incidental collisions.

In contrast, a **cryptographic hash function** is a specialized and much more robust subset of hash functions. These are built with rigorous security properties to withstand malicious, deliberate attacks. The value and purpose of a hash function in any security-sensitive application are entirely dependent on these cryptographic properties. The foundational properties that define a strong cryptographic hash function are as follows:
* **Pre-image Resistance (One-Way Property)**: This property ensures that the function is irreversible. Given a hash output, it is computationally infeasible to find the original input that generated it. In mathematical terms, for a given hash value H, it is impossible to solve for the input `x` in the equation `h(x)=H`. This characteristic is fundamental to secure applications like password storage, where the original password must remain unrecoverable.
* **Collision Resistance**: This is the most crucial security property. It states that it is computationally infeasible to find two distinct inputs, `x1`​ and `x2`​, that produce the exact same hash output, such that `h(x1​)=h(x2​)`. A common misunderstanding of this property is that collisions are impossible. In reality, a collision is mathematically inevitable due to the pigeonhole principle: the function maps an infinite number of possible inputs to a finite number of possible outputs. However, the "resistance" lies in the fact that the algorithm is designed to make the discovery of such a collision extremely difficult, requiring an immense amount of computational power. Modern, secure algorithms like SHA-256 have such a vast output space (256 bits, or 2<sup>256</sup> possible outputs) that the probability of a deliberate collision is vanishingly small. This is also related to the "birthday problem", a statistical phenomenon that shows how the likelihood of finding a collision increases faster than one might intuitively expect, which is why the output size must be sufficiently large for security purposes.
* **Avalanche Effect**: A good cryptographic hash function must exhibit the avalanche effect. This means that if a single bit is changed in the input, the resulting hash output should change unpredictably and drastically, with approximately half of the bits in the output flipping. This property is vital because it makes the hash highly sensitive to any form of data tampering, no matter how minor, ensuring that even the slightest alteration to a file or message will result in a completely different and easily detectable hash value.

## Use Cases

Hash functions are indispensable tools in modern computing and cybersecurity, with applications ranging from simple data organization to securing entire digital networks.
* **Data Integrity and File Verification**: A hash acts as a unique fingerprint for a file or message. By computing the hash of a file before it is sent and again after it is received, the two hash values can be compared. If the values match, it is a confirmation that the data was not altered or corrupted during transmission. This simple practice builds a "chain of trust" that is critical for verifying the authenticity of software downloads, digital documents, and network messages.
* **Secure Password Storage**: Storing user passwords in plaintext is a security vulnerability. Instead, secure systems store the cryptographic hash of each password in their database. When a user attempts to log in, the system takes their entered password, hashes it using the same function, and compares the newly generated hash to the stored one. If they match, the user is authenticated. Because the hash function is a one-way process, the original password can never be recovered from the stored hash, even if the database is breached. However, a password hash's deterministic nature presents a vulnerability. An attacker can pre-compute hashes for millions of common passwords and store them in a database known as a "rainbow table". If an attacker gains access to a database of hashed passwords, they can simply look up the hashes in their rainbow table to find the original plaintext passwords. To counter this, a salt is used. A salt is a unique, randomly generated string of characters that is added to the user's password before it is hashed. This means that two identical passwords from two different users will now have different hash values because of their unique salts. This process renders pre-computed rainbow tables useless and forces an attacker to brute-force each password individually, a computationally expensive and time-consuming process.
* **Data Structures**: As mentioned previously, non-cryptographic hash functions are the foundation of hash tables, also known as hash maps or associative arrays. These functions are used to map a key (e.g., a string) to an index in an underlying array. This provides an extremely efficient method for data storage and retrieval, with an average time complexity of `O(1)` for lookup operations.
* **Blockchain and Cryptocurrency**: Hash functions are a core building block of blockchain technology. Each block in a blockchain contains the cryptographic hash of the previous block's header, creating an immutable, tamper-evident chain of records. This structure ensures the integrity and security of the entire ledger. In systems like Bitcoin, a process known as "Proof-of-Work" relies on finding a specific hash that meets a certain complexity requirement, which is used to secure the network and validate new transactions.

## A Survey of Common Hash Algorithms

* **MD5 (Message Digest 5)**: A 128-bit hash function that was once widely used for data integrity verification. However, MD5 is now considered obsolete and insecure due to its vulnerability to collision attacks. It is not recommended for any security-sensitive applications.

* **SHA-1 (Secure Hash Algorithm 1)**: A 160-bit hash function that succeeded MD5. It was commonly used for file integrity and digital signatures. Similar to MD5, SHA-1 is now considered insecure due to known vulnerabilities and should no longer be used for security purposes.

* **SHA-2 Family**: This family, which includes algorithms like **SHA-256** and **SHA-512**, is the current industry standard. SHA-2 is widely implemented across a range of applications, including digital signatures, SSL/TLS, and blockchain technology, with Bitcoin using SHA-256. It is considered highly secure and is the recommended choice for most cryptographic tasks.

* **SHA-3 (Keccak)**: The latest addition to the Secure Hash Algorithm family, SHA-3 is an alternative to SHA-2, not a replacement. It uses a different internal structure called a "sponge construction". SHA-3 is a good choice for applications requiring high computational efficiency and low memory usage, such as embedded or smart devices. SHA-3 is considered to be at least as secure as SHA-2.

* **BLAKE2 / BLAKE3**: BLAKE2 is a modern, high-performance hash function that is faster than its predecessors like MD5, SHA-1, SHA-2, and SHA-3 while being at least as secure as SHA-3. It is optimized for 64-bit systems. It is used in projects like the Linux kernel's random number generator and the WireGuard VPN. BLAKE3 is the even faster successor.

* **Password-Specific Functions (bcrypt, Argon2**): These algorithms are designed specifically for the computationally intensive task of password hashing. Bcrypt, based on the Blowfish cipher, is still considered secure and is a common choice. Argon2 is the newest and is considered the strongest password hashing algorithm available due to its "memory-hard" design, which makes it particularly resistant to brute-force attacks using specialized hardware like GPUs.

## Practical Example

Python's built-in `hashlib` module is the de-facto standard for cryptographic hashing and provides a consistent, secure API for various hashing algorithms. It is important to note that Python's native `hash()` function is not intended for cryptographic use; its output is not guaranteed to be consistent across different Python versions or even different runs of the same program due to its non-cryptographic design.

### Step 1: Hashing a String

The following example demonstrates how to hash a simple string using the widely recommended SHA-256 algorithm.

```python
import hashlib

# Define the input string
input_string = "hello world"

# Hashlib functions operate on byte-like objects, so the string must be encoded.
# We use UTF-8 encoding.
encoded_bytes = input_string.encode('utf-8')

# Create a SHA-256 hash object and update it with the encoded bytes
sha256_hash = hashlib.sha256(encoded_bytes)

# Get the hash value in hexadecimal format
hash_digest = sha256_hash.hexdigest()

print(f"Original String: '{input_string}'")
print(f"SHA-256 Hash: {hash_digest}")

# Output:
# Original String: 'hello world'
# SHA-256 Hash: b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
```

The string is first converted into a sequence of bytes using `encode()`, as hashlib functions are designed to operate on binary data. The `.hexdigest()` method then returns the resulting hash as a readable hexadecimal string.

### Step 2: Demonstrating the Avalanche Effect

By making a single, seemingly minor change to the input string, the resulting hash value is completely and unpredictably altered, visually confirming the avalanche effect.

```python
import hashlib

# Original string from Step 1
original_string = "hello world"

# The same string, but with a single capital letter
modified_string = "hEllo world"

# Hash both strings
hash1 = hashlib.sha256(original_string.encode('utf-8')).hexdigest()
hash2 = hashlib.sha256(modified_string.encode('utf-8')).hexdigest()

print(f"Hash of '{original_string}':\n{hash1}\n")
print(f"Hash of '{modified_string}':\n{hash2}\n")

# Output:
# Hash of 'hello world':
# b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
#
# Hash of 'hEllo world':
# 18e0e0333fc08ca0668b8562d7fa9c4ff5f4389c75d8b29f1cff7c9fd20adc2f
```

The two outputs are entirely different, even though only one character was changed. This shows the hash function's extreme sensitivity to any data alteration.

### Step 3: Verifying File Integrity

A common real-world application is to verify that a downloaded file has not been corrupted or tampered with. A robust function for this task must handle large files efficiently by reading them in chunks, rather than loading the entire file into memory at once.

```python
import hashlib

def calculate_file_hash(file_path, algorithm='sha256'):
    """
    Calculates the hash of a file, reading it in chunks to handle large files efficiently.
    """
    try:
        # Get the hash constructor from hashlib
        hash_object = hashlib.new(algorithm)
    except ValueError:
        print(f"Error: Algorithm '{algorithm}' not supported.")
        return None

    # Define a buffer size (e.g., 64 KB)
    BUF_SIZE = 65536

    with open(file_path, 'rb') as f:
        # Read the file in chunks and update the hash object
        while chunk := f.read(BUF_SIZE):
            hash_object.update(chunk)

    return hash_object.hexdigest()

# Example usage:
file_to_check = 'path/to/downloaded_file.zip'
known_hash = '...' # The hash provided by the source, e.g., on a website

# In a real scenario, you would have created 'downloaded_file.zip' first.
# For demonstration purposes, we will use a dummy file.
with open(file_to_check, 'w') as f:
    f.write("This is a test file for integrity checking.")

calculated_hash = calculate_file_hash(file_to_check)

print(f"Calculated Hash for '{file_to_check}': {calculated_hash}")

# Check if the calculated hash matches the known hash
if calculated_hash == known_hash:
    print("File integrity verified: The hashes match.")
else:
    print("File integrity check failed: The hashes do not match.")

# The provided known_hash would be derived from the exact same file content,
# so the comparison would succeed.
```

This function reads the file in chunks of 64 KB using the update() method, which allows the program to process large files without consuming all available memory. This is a more robust and professional approach than reading the entire file at once.

## Security Attacks on Hash Functions

### Collision Attack

A collision occurs when two different inputs produce the same hash. If an attacker can generate a collision, they might trick a system into treating malicious data as if it were legitimate.

### Preimage Attack

A preimage attack tries to find an input that produces a specific hash. If successfull, attackers could "reverse-engineer" a hash back into its original input (or an equivalent).

#### Demo

```python
import hashlib
import itertools
import string

target_hash = hashlib.sha1("dog".encode()).hexdigest()
print(f"Target hash: {target_hash}")

# Try all 3-letter lowercase strings
for candidate in itertools.product(string.ascii_lowercase, repeat=3):
    test_str = "".join(candidate)
    if hashlib.sha1(test_str.encode()).hexdigest() == target_hash:
        print(f"Found match! '{test_str}' hashes to {target_hash}")
        break
```

Here, we brute-force all possible 3-letter lowercase words until one matches the target hash. With strong hash functions and long inputs, this becomes computationally infeasible — but weak choices (like MD5 or short passwords) make attacks possible.

### Dictionary & Rainbow Table Attack

Instead of brute-forcing blindly, attackers can pre-compute hashes of common passwords (dictionary) or build huge lookup tables (rainbow tables) to reverse hashes faster.

If passwords are stored as raw hashes without extra protection (salt and pepper), attackers can easily crack weak passwords this attack.

#### Demo

```python
import hashlib

# Pretend this is a stolen password hash
password_hash = hashlib.md5("secret123".encode()).hexdigest()

# Common password list
common_passwords = ["password", "123456", "letmein", "secret123", "qwerty"]

for pwd in common_passwords:
    if hashlib.md5(pwd.encode()).hexdigest() == password_hash:
        print(f"Password found! {pwd}")
        break
```

## Defending Against Hash Attacks

Now that we’ve seen how attackers can exploit weak or outdated hash functions, let’s look at common defenses. The goal is to make brute-force, dictionary, and rainbow table attacks impractical.

### Salt

A salt is a random value added to the password before hashing. This ensures that even if two users have the same password, their hashes will be different.

Example:
```python
import hashlib
import os

# User chooses a password
password = "mypassword"

# Generate a random salt (16 bytes)
salt = os.urandom(16)

# Hash password + salt
hash_with_salt = hashlib.sha256(salt + password.encode()).hexdigest()

print(f"Salt: {salt.hex()}")
print(f"Salted Hash: {hash_with_salt}")
```

Without the salt, attackers could use precomputed hashes (rainbow tables). With it, every password hash is unique.

### Pepper

A pepper is like a salt, but it’s a secret value stored separately (e.g., in server configuration, not in the database). Even if the database leaks, attackers don’t have the pepper.

```python
pepper = "my_secret_pepper"  # kept secret on server
password = "mypassword"

hash_with_pepper = hashlib.sha256((password + pepper).encode()).hexdigest()

print(f"Peppered Hash: {hash_with_pepper}")
```

This makes precomputed attacks much harder, since the attacker doesn’t know the pepper.

### Use Key Derivation Functions (KDFs)

Regular hash functions (like SHA-256) are fast, which makes brute-force attacks easier. Password hashing algorithms (like PBKDF2, bcrypt, scrypt, Argon2) deliberately slow down hashing, making large-scale attacks impractical.

```python
import hashlib
import os

password = "mypassword".encode()
salt = os.urandom(16)

# Apply PBKDF2 with SHA-256, 100,000 iterations
hash_bytes = hashlib.pbkdf2_hmac("sha256", password, salt, 100000)

print(f"Salt: {salt.hex()}")
print(f"Derived key: {hash_bytes.hex()}")
```

The iterations parameter controls how slow the function is. More iterations = more resistance against brute-force.

## Tools

Some commonly used tools with Hash Functions & Hashes are:
* **Hashcat**: GPU-accelerated password cracker. Used for cracking password hashes by brute-force, dictionary, mask, or hybrid attacks. Extremely fast thanks to GPU support. Supports hundreds of hash algorithms (MD5, SHA families, bcrypt, etc.).
* **John the Ripper**: CPU-based password cracker. Similar to Hashcat but more flexible in scripting and wordlist management. Often used in CTFs and pentesting for cracking password hashes. Good for smaller datasets or when GPU isn’t available.
* **hashid**: Hash identifier. Used for identifying the possible algorithm of a given hash string (e.g., distinguishing whether a hash is MD5, SHA-1, SHA-256, etc.).
* **HashPump**: Hash length extension attack tool. Used for exploiting certain algorithms (like MD5 or SHA-1) that are vulnerable to length extension attacks. Commonly used in CTFs to forge HMAC-like constructs.
* **md5sum / sha256sum (Linux utilities)**: Command-line utilities. Used for generating and verifying file hashes. Typically used for integrity checks when downloading software.
* **CyberChef (Web Tool)**: Web-based cryptography and encoding toolkit. Used for generating, decoding, and transforming hashes (MD5, SHA variants, etc.). Handy for quick experiments or conversions in-browser.
* **CrackStation**: Online hash cracking service. Used for checking if a given hash (MD5, SHA1, SHA256, etc.) corresponds to a known string. Backed by a massive database of precomputed hashes (dictionary + common passwords).
* **Hashes.com**: Online collaborative hash lookup service. Used for searching for known plaintexts corresponding to a hash. Also allows community contributions, so its database is continuously growing.

## References

* [MDN Web Docs: Hash Functions](https://developer.mozilla.org/en-US/docs/Glossary/Hash_function)
* [NIST: Hash Functions](https://csrc.nist.gov/projects/hash-functions)
* [Python haslib](https://docs.python.org/3/library/hashlib.html)