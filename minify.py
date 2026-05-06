import requests
import subprocess
import os
import re

# =========================
# KONFIG
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INPUT_DIR = os.path.join(BASE_DIR, "src")
OUTPUT_DIR = os.path.join(BASE_DIR, "dist")

CSS_INPUT = os.path.join(INPUT_DIR, "neiki-code-editor.css")
JS_INPUT = os.path.join(INPUT_DIR, "neiki-code-editor.js")

CSS_OUTPUT = os.path.join(OUTPUT_DIR, "neiki-code-editor.min.css")
JS_OUTPUT = os.path.join(OUTPUT_DIR, "neiki-code-editor.min.js")

JS_TEMP = os.path.join(OUTPUT_DIR, "neiki-code-editor.temp.js")

# =========================
# TEMPLATE PRO INJECT
# =========================
INJECT_TEMPLATE = """
// ============================================
// AUTO-INJECT CSS
// ============================================
(function() {{
    if (document.getElementById('neiki-editor-styles')) return;
    const style = document.createElement('style');
    style.id = 'neiki-editor-styles';
    style.textContent = `{css}`;
    document.head.appendChild(style);
}})();
"""

# =========================
# 1️⃣ OUTPUT SLOŽKA
# =========================
os.makedirs(OUTPUT_DIR, exist_ok=True)

# =========================
# 2️⃣ NAČTENÍ CSS
# =========================
with open(CSS_INPUT, "r", encoding="utf-8") as f:
    css_content = f.read()

print("Minifikuju CSS...")

response = requests.post(
    "https://www.toptal.com/developers/cssminifier/api/raw",
    data={"input": css_content}
)

minified_css = response.text.strip()

# uložit min CSS
with open(CSS_OUTPUT, "w", encoding="utf-8") as f:
    f.write(minified_css)

# escape pro JS template string
minified_css = minified_css.replace("\\", "\\\\").replace("`", "\\`")

# =========================
# 3️⃣ NAČTENÍ JS
# =========================
with open(JS_INPUT, "r", encoding="utf-8") as f:
    js_content = f.read()

print("Hledám marker v JS...")

# =========================
# 4️⃣ NALEZENÍ MARKERU (ROBUSTNÍ)
# =========================
pattern = r"(/\*\s*=+\s*\r?\n\s*\*\s*SECTION 2:\s*Syntax Highlighting Engine\s*\r?\n\s*\*\s*=+\s*\*/)"

match = re.search(pattern, js_content)

if not match:
    raise Exception("❌ Marker pro vložení nebyl nalezen ani přes regex!")

print("✔ Marker nalezen, vkládám CSS...")

insert_pos = match.start()

injected_code = INJECT_TEMPLATE.format(css=minified_css)

js_modified = (
    js_content[:insert_pos] +
    injected_code +
    js_content[insert_pos:]
)

# =========================
# 5️⃣ ULOŽ TEMP JS
# =========================
with open(JS_TEMP, "w", encoding="utf-8") as f:
    f.write(js_modified)

# =========================
# 6️⃣ MINIFIKACE JS (TERSER)
# =========================
print("Minifikuju JS přes terser...")

subprocess.run([
    r"C:\Program Files\nodejs\npx.cmd",
    "terser",
    JS_TEMP,
    "-o", JS_OUTPUT,
    "--compress",
    "--mangle"
], check=True)

# =========================
# 7️⃣ CLEANUP
# =========================
os.remove(JS_TEMP)

print("\n✅ HOTOVO")
print(f"📦 CSS: {CSS_OUTPUT}")
print(f"📦 JS:  {JS_OUTPUT}")