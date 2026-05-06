# Security Policy

## 🛡️ Supported Versions

The following versions of Neiki's Code Editor are currently supported with security updates:

| Version | Supported |
| ------- | --------- |
| 1.0.x   | ✅ Yes     |
| < 1.0   | ❌ No      |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public issue**.

Instead, report it responsibly:

* 📧 Email: **[dev@neiki.eu](mailto:dev@neiki.eu)**
* 💬 Or open a **private GitHub security advisory**

---

## 📋 What to include

Please provide as much detail as possible:

* Description of the vulnerability
* Steps to reproduce
* Browser and version used
* Affected editor language or mode, if relevant
* Potential impact

---

## ⏱️ Response Time

* Initial response: **within 48 hours**
* Fix timeline: depends on severity

---

## ⚠️ Scope

Neiki's Code Editor is a **client-side Web Component** that runs entirely in the browser. It does not have a backend server, database, authentication layer or remote code execution functionality.

The following areas are considered **in-scope**:

* **XSS / code injection** — malicious input rendered through syntax highlighting or editor UI
* **Unsafe DOM handling** — cases where user-provided code could be inserted without proper escaping
* **Clipboard abuse** — unexpected or modified content written to the clipboard through the Copy function
* **Readonly bypass** — cases where readonly mode can be unintentionally edited through normal user interaction
* **Shadow DOM isolation issues** — style or DOM leakage that could affect host pages in a security-relevant way
* **Denial of service in browser** — input patterns that freeze or severely degrade the page due to editor processing

The following are **out of scope**:

* Issues caused by a website embedding untrusted third-party scripts
* Self-hosted deployment configuration, HTTPS setup or server hardening
* Browser extension interference
* Vulnerabilities in browsers or developer tools
* Social engineering or phishing unrelated to the editor implementation

---

## 🙏 Responsible Disclosure

We appreciate responsible disclosure and will credit reporters where appropriate.
