---
title: "JSON Web Token (JWT)"
description: "A straightforward guide to understanding what JWTs are, how they work, and how to create and verify them in Python."
authors: ["Akreed"]
tags: ["jwt", "authentication", "web-security", "python"]
pubDate: "12 Oct 2025"
image: "../../assets/posts/jwt.png"
---

A **JSON Web Token (JWT)** is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs are often used for authentication and authorization in web applications.

The key advantage of a JWT is that it is stateless. Traditional server-side sessions require the server to maintain a record of the user's session state (e.g., in memory or a database). With JWTs, all the necessary user information is contained within the token itself, which is sent by the client with every request. This makes them ideal for distributed systems and microservices architectures.

A JWT consists of three parts separated by dots (`.`): `HEADER.PAYLOAD.SIGNATURE`

1. **Header**: Typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA. This JSON is then Base64Url encoded to form the first part of the JWT.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

2. **Payload**: Contains the claims, which are statements about an entity (typically the user) and additional data. There are registered claims (like `iss` for issuer, `exp` for expiration time, `sub` for subject), public claims, and private claims. The payload is also Base64Url encoded.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022
}
```

3. **Signature**: To create the signature, you take the encoded header, the encoded payload, a secret, and sign them with the algorithm specified in the header. The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way. For example, using HMAC-SHA256, the signature is created like this:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Use Cases

* **Authentication**: This is the most common scenario. When a user logs in with their credentials, the server returns a JWT. The client then stores this token (e.g., in `localStorage` or a cookie) and includes it in the `Authorization` header of subsequent requests (usually using the `Bearer` schema). The server can then verify the token and grant access to protected routes.
* **Authorization**: The JWT payload can contain user roles and permissions. Once the server verifies the token's signature, it can inspect the claims in the payload to determine what resources the user is permitted to access without needing a database query.
* **Information Exchange**: JWTs are a good way of securely transmitting information between parties. Because they can be signed, you can be sure the senders are who they say they are. And because the signature is calculated using the header and payload, you can also verify that the content hasn't been tampered with.

## Practical Example

Here’s a simple, hands-on example in Python showing how to create and verify a JWT. We'll use the `PyJWT` library.

First, you need to install the library: `pip install PyJWT`.

Now, let's create a Python script to demonstrate the process. Before you save the code below, it's important that you do not name your Python script `jwt.py`. If you do, Python's import system will see your own file first when it encounters `import jwt`. This causes the script to import itself instead of the PyJWT library, leading to an `AttributeError` because your file doesn't contain the encode and decode functions. Save the file with a different name, such as `jwt_test.py`.

```python
import jwt
import time
from datetime import datetime, timedelta, timezone

# A secret key is needed to sign and verify the token.
# In a real application, this should be a strong, private key and kept secure.
SECRET_KEY = "your-super-secret-key"
ALGORITHM = "HS256"

# 1. --- CREATE (ENCODE) A JWT ---
print("--- 1. Encoding a JWT ---")

# The payload contains the claims for the token.
# 'exp' (expiration time) is a registered claim. It's good practice to set one.
# We'll set it to 30 minutes from now.
payload = {
    "user_id": 123,
    "username": "alice",
    "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
    "iat": datetime.now(timezone.utc) # Issued at time
}

# Encode the payload to create the JWT string.
try:
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    print("Successfully created JWT:")
    print(encoded_jwt)
    print("\n")
except Exception as e:
    print(f"Error encoding JWT: {e}")


# 2. --- VERIFY (DECODE) A JWT ---
print("--- 2. Decoding a valid JWT ---")
try:
    # Decode the token. This will also verify the signature and expiration.
    decoded_payload = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=[ALGORITHM])
    print("Successfully decoded payload:")
    print(decoded_payload)
    print("\n")
except Exception as e:
    print(f"Error decoding JWT: {e}")


# 3. --- ATTEMPT TO VERIFY WITH THE WRONG SECRET ---
print("--- 3. Attempting to decode with the wrong secret ---")
WRONG_SECRET_KEY = "this-is-not-the-correct-key"
try:
    jwt.decode(encoded_jwt, WRONG_SECRET_KEY, algorithms=[ALGORITHM])
except jwt.InvalidSignatureError as e:
    print(f"Caught expected error: {e}")
    print("This confirms the signature verification is working.\n")


# 4. --- ATTEMPT TO VERIFY AN EXPIRED TOKEN ---
print("--- 4. Attempting to decode an expired JWT ---")

# Create a payload with an expiration time in the past.
expired_payload = {
    "user_id": 456,
    "username": "bob",
    "exp": datetime.now(timezone.utc) - timedelta(minutes=1)
}

expired_jwt = jwt.encode(expired_payload, SECRET_KEY, algorithm=ALGORITHM)
print(f"Created an expired token: {expired_jwt}")

# Let's wait a second to ensure the timestamps are different
time.sleep(1)

try:
    jwt.decode(expired_jwt, SECRET_KEY, algorithms=[ALGORITHM])
except jwt.ExpiredSignatureError as e:
    print(f"Caught expected error: {e}")
    print("This confirms the expiration time check is working.")
```

## Common JWT Vulnerabilities and How To Fix Them

A JWT is only as secure as its implementation. While the standard is solid, common mistakes can lead to vulnerabilities. From an attacker's perspective, a JWT is a primary target because if it can be broken or forged, it provides a direct key to a user's account and data. Here's how to spot and prevent the most common flaws.

### Token Replay

This attack occurs when an attacker intercepts a valid JWT and reuses it to impersonate the legitimate user. Even a short-lived token can be replayed as many times as desired before it expires. This is especially damaging for actions that should only happen once, like a payment transaction.

An attacker can use a proxy tool to execute this attack.
1. Intercept: Using a proxy like Burp Suite, the attacker captures a request containing a valid JWT for a specific action (e.g., a POST request to `/api/transfer_funds`).
2. Replay: The attacker forwards this same, unmodified request to the server multiple times.

The vulnerability exists because the server only checks the token's signature and expiration; it has no mechanism to ensure that a specific token is only used once.

```python
# VULNERABILITY: The server has no way of knowing if this token has been used before.
def process_payment(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        # No check for token uniqueness.
        charge_user(payload['user_id'], amount=100)
    except jwt.InvalidTokenError:
        # Handle error
```

To fix this vulnerability, the server must ensure that each token can only be used once. This is achieved by including a unique identifier (`jti` claim) in the token and maintaining a server-side denylist of used `jti` values.

```python
# GOOD PRACTICE: Check for a unique token ID (`jti`)
import redis
db = redis.Redis() # Use a fast cache like Redis to store used jti's

def process_payment_secure(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        jti = payload.get('jti')

        # FIX: Check if this jti has already been processed.
        if not jti or db.get(jti):
            raise Exception("Invalid or replayed token")

        # Mark this jti as used, with a TTL matching the token's expiry.
        db.set(jti, "used", ex=payload['exp'] - int(time.time()))
        charge_user(payload['user_id'], amount=100)

    except jwt.InvalidTokenError:
        # Handle error
```

### Weak Secret Key and Brute-Forcing

This vulnerability applies to tokens signed with a symmetric algorithm (e.g., HS256) where the secret key is weak, guessable, or has been exposed. An attacker's goal is to discover this secret, which grants them the power to forge any token with any claims, effectively impersonating any user.

An attacker can test for this by capturing a single valid token and launching an offline brute-force attack. They don't need to interact with the server again.
1. Capture: The attacker intercepts a valid JWT.
2. Prepare: They save the full token string into a file.
3. Brute-Force: They use a powerful cracking tool like Hashcat. The command would look like this, using a wordlist of common passwords:
```bash
# -a 0 = Straight (dictionary) attack mode
# -m 16500 = Module for JWT
hashcat -a 0 -m 16500 captured_token.txt /usr/share/wordlists/rockyou.txt
```
4. Forge: If the command succeeds, it reveals the secret key (e.g., `"secret123"`). The attacker can now use this key to generate their own valid tokens with any payload they wish.

The vulnerability exists because a low-entropy secret was chosen and often hardcoded directly into the application's source code.

```python
# VULNERABILITY: The secret key is weak, short, and hardcoded.
# It can be easily brute-forced or discovered via source code analysis.
SECRET_KEY = "secret"

def create_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token
```

To fix this vulnerability, the application must use a long, high-entropy, randomly generated secret key that is stored securely, not in the codebase.

```python
# GOOD PRACTICE: Load a strong secret from environment variables or a secrets manager.
# A strong key can be generated with `openssl rand -hex 32`
import os
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

def create_token_secure(user_id):
    if not SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY is not set!")

    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token
```

### Asymmetric Key Confusion

This attack tricks a server into using a public key (intended for asymmetric algorithms like RS256) as a secret key for a symmetric algorithm (like HS256). The attacker's goal is to forge a token with arbitrary claims without needing access to the server's private key.

An attacker would perform the following steps:
1. Discover Key: The attacker obtains the server's public RSA key. This is often publicly available at a `.well-known/jwks.json` endpoint.
2. Craft Token: They modify a captured token or create a new one. They change the header to specify a symmetric algorithm, `{"alg":"HS256"}`.
3. Sign with Public Key: This is the core of the attack. They sign the token using the HS256 algorithm, but provide the entire content of the public key as the secret.
4. Execute: They send the forged token to the server. The server's flawed logic sees HS256, loads the public key as the secret for verification, and since the attacker used the same key, the signature validates.

The vulnerability exists because the code is too flexible and trusts the token's `alg` header to determine how to perform verification, leading it to use the wrong key type for the specified algorithm.

```python
# VULNERABILITY: The code dynamically selects the key based on the token's header.
header_data = jwt.get_unverified_header(token)
if header_data['alg'] == 'RS256':
    decoded = jwt.decode(token, RSA_PUBLIC_KEY, algorithms=['RS256'])
elif header_data['alg'] == 'HS256':
    # An attacker can force this path and make the app use the
    # public key as the secret.
    decoded = jwt.decode(token, RSA_PUBLIC_KEY, algorithms=['HS256'])
```

To fix this vulnerability, the code must be explicit about the algorithm and key it expects for a given validation scenario.

```python
# GOOD PRACTICE: This function ONLY validates RS256 tokens.
# There is no path for ambiguity.
try:
    decoded = jwt.decode(token, RSA_PUBLIC_KEY, algorithms=['RS256'])
except jwt.InvalidTokenError:
    # Handle error
```


### None Hashing Algorithm

This vulnerability tricks the server into processing a token without verifying its signature. For an attacker, the goal is a full authentication bypass, allowing them to forge a token with any claims they desire, such as impersonating an admin.

An attacker first needs any valid token from the application. They can then use a tool like the online debugger at jwt.io or Burp Suite's JWT Editor extension. The process is:
1. Decode: Paste the captured token into the tool to decode the header and payload.
2. Modify Header: Change the header JSON from `{"alg":"HS256", "typ":"JWT"}` to `{"alg":"none", "typ":"JWT"}`.
3. Modify Payload: Alter the payload to escalate privileges. For example, change `{"sub":"101", "isAdmin":false}` to `{"sub":"1", "isAdmin":true}`.
4. Forge Token: The tool will re-encode the parts. The final token will look like `encoded_header.encoded_payload.`, with the signature part being empty.
5. Execute: The attacker sends a request to a protected endpoint, replacing the original token in the `Authorization: Bearer` header with their forged, signature-less token. A vulnerable server will accept it.

The vulnerability exists when the server's code doesn't enforce a specific algorithm, trusting the header instead.

```python
# VULNERABILITY: The `algorithms` parameter is missing or improperly used in the `decode` call.
# An older library or flawed logic might default to trusting the header.
try:
    # Some libraries might have an explicit option to disable signature verification, which is extremely dangerous.
    decoded_token = jwt.decode(token, key, options={"verify_signature": False})
except Exception as e:
    return jsonify({"error": f"Invalid token: {e}"}), 401
```

To fix this vulnerability, the server must enforce a static list of allowed algorithms.

```python
# GOOD PRACTICE: Always provide a list of expected algorithms.
EXPECTED_ALGS = ["HS256"]
try:
    # FIX: The `algorithms` parameter ensures that only tokens signed
    # with HS256 will be processed. A token with `alg:"none"` will be rejected.
    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=EXPECTED_ALGS)
except jwt.InvalidTokenError as e:
    return jsonify({"error": f"Invalid token: {e}"}), 401
```

### `jku` Header Injection (JWKS Spoofing)

The `jku` ([JSON Web Key Set URL](https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.2)) header claim specifies a URL where the server can find the key needed to verify the token. If a server blindly trusts this URL, an attacker can forge a token and host their own key set.

An attacker can exploit this with the following steps:
1. Setup: The attacker generates their own RSA key pair (public and private).
2. Host JWKS: They create a JSON Web Key Set (JWKS) file containing their public key and host it on a server they control (e.g., `https://attacker.com/keys.json`).
3. Forge Token: They craft a token with a malicious payload and a header pointing the jku claim to their server: `{"alg":"RS256", "jku":"https://attacker.com/keys.json"}`.
4. Sign: They sign this token with their own private key.
5. Execute: The vulnerable server receives the token, sees the `jku` header, fetches the key from the attacker's URL, and uses the attacker's public key to "successfully" verify the token's signature.

The vulnerability is caused by the server trusting user-controllable input (the `jku` header) to locate a security-critical resource like a public key.

```python
# VULNERABILITY: The server blindly trusts the URL from the token.
header = jwt.get_unverified_header(token)
jku_url = header['jku']

# The server fetches the key from a user-supplied URL.
jwks_client = jwt.PyJWKClient(jku_url)
signing_key = jwks_client.get_signing_key_from_jwt(token)
data = jwt.decode(token, signing_key.key, algorithms=["RS256"])
```

To fix this vulnerability, the server must validate the jku header against a strict allow-list of trusted URLs.

```python
# GOOD PRACTICE: The server uses a hardcoded, trusted URL.
TRUSTED_JWKS_URL = "https://legitimate-server.com/.well-known/jwks.json"

header = jwt.get_unverified_header(token)

# FIX: The server ignores the token's jku header if it is not in an allow-list.
if header.get('jku') != TRUSTED_JWKS_URL:
    raise Exception("Untrusted jku header")

jwks_client = jwt.PyJWKClient(TRUSTED_JWKS_URL)
# ... proceed with verification
```

### `kid` Header Path Traversal

The kid ([Key ID](https://www.rfc-editor.org/rfc/rfc7515.html#section-4.1.4)) header claim helps a server identify which key to use for verification. A vulnerability arises when the kid value is used to construct a file path on the server without proper sanitization.

An attacker can exploit this to read arbitrary files or bypass authentication.
1. Probe: The attacker crafts a token with a kid value designed to traverse the filesystem, such as `../../../../../../../../dev/null`.
2. Forge: They sign this token with an empty or predictable key (e.g., an empty string).
3. Execute: They send the token. The server's backend code concatenates the `kid` value into a path like `/var/www/keys/ + ../../../../../../../../dev/null`, which resolves to `/dev/null`. The server reads `/dev/null` as the verification key, which is an empty value. If the attacker also signed their token with an empty key, the signature may validate.

The vulnerability is caused by concatenating user input directly into a file path.

```python
# VULNERABILITY: The `kid` parameter is concatenated directly into a file path.
header = jwt.get_unverified_header(token)
kid = header['kid']

key_file_path = f"/var/www/keys/{kid}.pem"
with open(key_file_path, 'r') as key_file:
    public_key = key_file.read()
    jwt.decode(token, public_key, algorithms=["RS256"])
```

To fix this vulnerability, the `kid` should be treated as an identifier, not a filename, and mapped to a known, safe file path.

```python
# GOOD PRACTICE: Map the `kid` to a known file path on the server.
KEY_MAPPING = {
    "key1": "/var/www/keys/prod-key-1.pem",
    "key2": "/var/www/keys/prod-key-2.pem"
}

header = jwt.get_unverified_header(token)
kid = header['kid']

# FIX: The `kid` is used as a key in a dictionary.
# Any value not in the mapping is rejected.
if kid not in KEY_MAPPING:
    raise Exception("Invalid kid")

key_file_path = KEY_MAPPING[kid]
# ... proceed with reading the file and verifying
```


## References & Further Reading

* [jwt.io](https://jwt.io): The official website for JWTs, which includes a handy debugger for encoding and decoding tokens.
* [RFC 7519](https://tools.ietf.org/html/rfc7519): The official IETF specification for JSON Web Tokens.
* [Auth0 - "JSON Web Token Introduction"](https://auth0.com/docs/secure/tokens/json-web-tokens): A great introduction and overview of JWT concepts and use cases from a leading identity management company.
* [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet_for_Java.html): An essential security resource listing common attacks and countermeasures in detail.
* (**Recommended**) [PortSwigger - JWT Vulnerabilities](https://portswigger.net/web-security/jwt): The Web Security Academy provides excellent explanations and hands-on labs to practice exploiting these vulnerabilities.

