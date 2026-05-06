/**
 * Neiki's  Code Editor - A lightweight embeddable code editor Web Component
 * 
 * Usage:
 *   <script src="neiki-code-editor.js"></script>
 *   <neiki-code-editor language="javascript" theme="dark">
 *     console.log("Hello world");
 *   </neiki-code-editor>
 * 
 * Supports: JavaScript, HTML, CSS, JSON, Markdown
 * Features: Syntax highlighting, line numbers, themes, search, minimap, fullscreen
 */

/* =========================================================================
 * SECTION 1: Default Styles (embedded so single-file CDN mode works)
 * ========================================================================= */

const NEIKI_DEFAULT_STYLES = `
/* ---------- Host & Container ---------- */
:host {
  display: block;
  position: relative;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  line-height: 1.5;
  font-size: 14px;
  contain: content;
}
:host([fullscreen]) {
  position: fixed !important;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 999999;
  border-radius: 0;
  width: 100vw !important;
  height: 100vh !important;
}

/* ---------- Dark Theme ---------- */
:host, .nce-wrap.dark {
  --nce-bg: #1e1e2e;
  --nce-gutter-bg: #181825;
  --nce-gutter-fg: #585b70;
  --nce-fg: #cdd6f4;
  --nce-cursor: #f5e0dc;
  --nce-selection: rgba(137,180,250,0.25);
  --nce-line-hl: rgba(255,255,255,0.04);
  --nce-border: #313244;
  --nce-toolbar-bg: #181825;
  --nce-toolbar-fg: #a6adc8;
  --nce-toolbar-hover: #313244;
  --nce-scrollbar: rgba(166,173,200,0.18);
  --nce-scrollbar-hover: rgba(166,173,200,0.32);
  --nce-search-bg: #313244;
  --nce-search-fg: #cdd6f4;
  --nce-search-match: rgba(249,226,175,0.3);
  --nce-minimap-bg: #181825;
  /* Syntax tokens */
  --nce-keyword: #cba6f7;
  --nce-string: #a6e3a1;
  --nce-number: #fab387;
  --nce-comment: #6c7086;
  --nce-function: #89b4fa;
  --nce-operator: #89dceb;
  --nce-tag: #f38ba8;
  --nce-attr-name: #fab387;
  --nce-attr-value: #a6e3a1;
  --nce-property: #89b4fa;
  --nce-punctuation: #9399b2;
  --nce-selector: #f9e2af;
  --nce-variable: #f5c2e7;
  --nce-heading: #89b4fa;
  --nce-bold: #f5e0dc;
  --nce-italic: #f5c2e7;
  --nce-link: #89b4fa;
  --nce-code-bg: rgba(49,50,68,0.6);
}

/* ---------- Light Theme ---------- */
.nce-wrap.light {
  --nce-bg: #eff1f5;
  --nce-gutter-bg: #e6e9ef;
  --nce-gutter-fg: #8c8fa1;
  --nce-fg: #4c4f69;
  --nce-cursor: #dc8a78;
  --nce-selection: rgba(114,135,253,0.2);
  --nce-line-hl: rgba(0,0,0,0.04);
  --nce-border: #ccd0da;
  --nce-toolbar-bg: #e6e9ef;
  --nce-toolbar-fg: #5c5f77;
  --nce-toolbar-hover: #ccd0da;
  --nce-scrollbar: rgba(76,79,105,0.15);
  --nce-scrollbar-hover: rgba(76,79,105,0.3);
  --nce-search-bg: #ccd0da;
  --nce-search-fg: #4c4f69;
  --nce-search-match: rgba(223,142,29,0.25);
  --nce-minimap-bg: #e6e9ef;
  --nce-keyword: #8839ef;
  --nce-string: #40a02b;
  --nce-number: #fe640b;
  --nce-comment: #9ca0b0;
  --nce-function: #1e66f5;
  --nce-operator: #04a5e5;
  --nce-tag: #d20f39;
  --nce-attr-name: #fe640b;
  --nce-attr-value: #40a02b;
  --nce-property: #1e66f5;
  --nce-punctuation: #6c6f85;
  --nce-selector: #df8e1d;
  --nce-variable: #ea76cb;
  --nce-heading: #1e66f5;
  --nce-bold: #dc8a78;
  --nce-italic: #ea76cb;
  --nce-link: #1e66f5;
  --nce-code-bg: rgba(204,208,218,0.5);
}

/* ---------- Layout ---------- */
.nce-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 150px;
  background: var(--nce-bg);
  color: var(--nce-fg);
  border: 1px solid var(--nce-border);
  border-radius: inherit;
  overflow: hidden;
}

/* Toolbar */
.nce-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--nce-toolbar-bg);
  border-bottom: 1px solid var(--nce-border);
  flex-shrink: 0;
  user-select: none;
  min-height: 32px;
  flex-wrap: wrap;
}
.nce-toolbar-left { display:flex; align-items:center; gap:4px; flex:1; min-width:0; }
.nce-toolbar-right { display:flex; align-items:center; gap:4px; }
.nce-lang-label {
  font-size: 11px;
  color: var(--nce-toolbar-fg);
  background: var(--nce-border);
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.nce-btn {
  background: none;
  border: none;
  color: var(--nce-toolbar-fg);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}
.nce-btn:hover { background: var(--nce-toolbar-hover); color: var(--nce-fg); }
.nce-btn svg { width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.nce-btn.active { color: var(--nce-keyword); }

/* Search Bar */
.nce-search-bar {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--nce-toolbar-bg);
  border-bottom: 1px solid var(--nce-border);
  flex-shrink: 0;
}
.nce-search-bar.open { display: flex; }
.nce-search-input {
  background: var(--nce-search-bg);
  border: 1px solid var(--nce-border);
  color: var(--nce-search-fg);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  min-width: 0;
  flex: 1;
  max-width: 260px;
}
.nce-search-input:focus { border-color: var(--nce-keyword); }
.nce-search-count { font-size: 11px; color: var(--nce-toolbar-fg); white-space:nowrap; }

/* Editor body */
.nce-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Gutter (line numbers) */
.nce-gutter {
  background: var(--nce-gutter-bg);
  color: var(--nce-gutter-fg);
  text-align: right;
  padding: 8px 0;
  user-select: none;
  overflow: hidden;
  flex-shrink: 0;
  font-size: inherit;
  line-height: inherit;
  min-width: 44px;
  box-sizing: border-box;
}
.nce-gutter-line {
  padding: 0 10px 0 6px;
  white-space: pre;
}
.nce-gutter-line.active { color: var(--nce-fg); }

/* Editor area (textarea + highlight overlay) */
.nce-editor {
  flex: 1;
  position: relative;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.nce-editor::-webkit-scrollbar { width:10px; height:10px; }
.nce-editor::-webkit-scrollbar-track { background:transparent; }
.nce-editor::-webkit-scrollbar-thumb { background:var(--nce-scrollbar); border-radius:5px; }
.nce-editor::-webkit-scrollbar-thumb:hover { background:var(--nce-scrollbar-hover); }
.nce-editor::-webkit-scrollbar-corner { background:transparent; }

.nce-code-layer, .nce-textarea {
  position: absolute;
  top: 0; left: 0;
  margin: 0;
  padding: 8px 12px;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  white-space: pre;
  word-wrap: normal;
  tab-size: 2;
  -moz-tab-size: 2;
  border: none;
  outline: none;
  min-width: 100%;
  min-height: 100%;
  box-sizing: border-box;
}

.nce-code-layer {
  pointer-events: none;
  color: var(--nce-fg);
  z-index: 1;
}

.nce-textarea {
  color: transparent;
  caret-color: var(--nce-cursor);
  background: transparent;
  resize: none;
  overflow: hidden;
  z-index: 2;
  -webkit-text-fill-color: transparent;
}
.nce-textarea::selection { background: var(--nce-selection); }
.nce-textarea::-moz-selection { background: var(--nce-selection); }

/* Line highlight */
.nce-line-highlight {
  position: absolute;
  left: 0; right: 0;
  height: 1.5em;
  background: var(--nce-line-hl);
  pointer-events: none;
  z-index: 0;
  transition: top 0.05s;
}

/* Minimap */
.nce-minimap {
  width: 60px;
  background: var(--nce-minimap-bg);
  border-left: 1px solid var(--nce-border);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
  display: none;
}
.nce-minimap.visible { display: block; }
.nce-minimap-canvas {
  width: 100%;
  image-rendering: pixelated;
}
.nce-minimap-viewport {
  position: absolute;
  left: 0; right: 0;
  background: var(--nce-selection);
  border-radius: 2px;
  pointer-events: none;
}

/* Syntax token classes */
.nce-keyword { color: var(--nce-keyword); }
.nce-string { color: var(--nce-string); }
.nce-number { color: var(--nce-number); }
.nce-comment { color: var(--nce-comment); font-style: italic; }
.nce-function { color: var(--nce-function); }
.nce-operator { color: var(--nce-operator); }
.nce-tag { color: var(--nce-tag); }
.nce-attr-name { color: var(--nce-attr-name); }
.nce-attr-value { color: var(--nce-attr-value); }
.nce-property { color: var(--nce-property); }
.nce-punctuation { color: var(--nce-punctuation); }
.nce-selector { color: var(--nce-selector); }
.nce-variable { color: var(--nce-variable); }
.nce-heading { color: var(--nce-heading); font-weight: bold; }
.nce-bold { color: var(--nce-bold); font-weight: bold; }
.nce-italic { color: var(--nce-italic); font-style: italic; }
.nce-link { color: var(--nce-link); text-decoration: underline; }
.nce-code { background: var(--nce-code-bg); border-radius: 3px; padding: 0 3px; }

/* Search match highlights */
.nce-search-hl { background: var(--nce-search-match); border-radius: 2px; }
.nce-search-hl-active { background: rgba(249,226,175,0.55); outline: 1px solid var(--nce-keyword); }

/* Copied toast */
.nce-toast {
  position: absolute;
  top: 44px; right: 12px;
  background: var(--nce-keyword);
  color: var(--nce-bg);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
}
.nce-toast.show { opacity: 1; transform: translateY(0); }

/* Responsive */
@media (max-width: 600px) {
  :host { font-size: 13px; }
  .nce-minimap { display: none !important; }
  .nce-gutter { min-width: 36px; }
}
`;

/* =========================================================================
 * SECTION 2: Syntax Highlighting Engine
 * ========================================================================= */

class SyntaxHighlighter {
  /**
   * Highlights code by returning HTML with <span> tokens.
   * Uses simple but efficient tokenization — avoids heavy regex.
   */

  /** Escape HTML entities */
  static esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** Wrap text in a span with given class */
  static span(cls, text) {
    return '<span class="nce-' + cls + '">' + SyntaxHighlighter.esc(text) + '</span>';
  }

  /* ---- JavaScript Highlighter ---- */
  static javascript(code) {
    const kw = new Set([
      'async','await','break','case','catch','class','const','continue','debugger',
      'default','delete','do','else','export','extends','finally','for','from','function',
      'if','import','in','instanceof','let','new','of','return','static','super',
      'switch','this','throw','try','typeof','var','void','while','with','yield',
      'true','false','null','undefined','NaN','Infinity'
    ]);
    return SyntaxHighlighter._cLike(code, kw, true);
  }

  /* ---- JSON Highlighter ---- */
  static json(code) {
    const out = [];
    const len = code.length;
    let i = 0;
    while (i < len) {
      const ch = code[i];
      // Strings
      if (ch === '"') {
        let j = i + 1;
        while (j < len && code[j] !== '"') { if (code[j] === '\\') j++; j++; }
        j = Math.min(j + 1, len);
        const raw = code.slice(i, j);
        // Check if it's a property key (followed by :)
        let k = j;
        while (k < len && (code[k] === ' ' || code[k] === '\t')) k++;
        if (code[k] === ':') {
          out.push(SyntaxHighlighter.span('property', raw));
        } else {
          out.push(SyntaxHighlighter.span('string', raw));
        }
        i = j;
      } else if (ch === '-' || (ch >= '0' && ch <= '9')) {
        let j = i;
        if (ch === '-') j++;
        while (j < len && ((code[j] >= '0' && code[j] <= '9') || code[j] === '.' || code[j] === 'e' || code[j] === 'E' || code[j] === '+' || code[j] === '-')) j++;
        out.push(SyntaxHighlighter.span('number', code.slice(i, j)));
        i = j;
      } else if (code.slice(i, i + 4) === 'true' || code.slice(i, i + 5) === 'false' || code.slice(i, i + 4) === 'null') {
        const word = code.slice(i, i + 4) === 'null' ? 'null' : (code.slice(i, i + 4) === 'true' ? 'true' : 'false');
        out.push(SyntaxHighlighter.span('keyword', word));
        i += word.length;
      } else if ('{}[]:,'.includes(ch)) {
        out.push(SyntaxHighlighter.span('punctuation', ch));
        i++;
      } else {
        out.push(SyntaxHighlighter.esc(ch));
        i++;
      }
    }
    return out.join('');
  }

  /* ---- HTML Highlighter ---- */
  static html(code) {
    const out = [];
    const len = code.length;
    let i = 0;
    while (i < len) {
      // Comment
      if (code.slice(i, i + 4) === '<!--') {
        let end = code.indexOf('-->', i + 4);
        if (end === -1) end = len; else end += 3;
        out.push(SyntaxHighlighter.span('comment', code.slice(i, end)));
        i = end;
      }
      // Tag
      else if (code[i] === '<' && (i + 1 < len) && (code[i+1] === '/' || code[i+1] === '!' || /[a-zA-Z]/.test(code[i+1]))) {
        let j = i + 1;
        if (code[j] === '/') j++;
        if (code[j] === '!') { // doctype
          let end = code.indexOf('>', j);
          if (end === -1) end = len; else end += 1;
          out.push(SyntaxHighlighter.span('comment', code.slice(i, end)));
          i = end;
          continue;
        }
        // Tag name
        let nameStart = j;
        while (j < len && /[a-zA-Z0-9\-]/.test(code[j])) j++;
        const tagName = code.slice(nameStart, j);
        out.push(SyntaxHighlighter.span('punctuation', code.slice(i, nameStart)));
        if (tagName) out.push(SyntaxHighlighter.span('tag', tagName));
        // Attributes
        while (j < len && code[j] !== '>') {
          if (code[j] === '/' && j + 1 < len && code[j + 1] === '>') {
            out.push(SyntaxHighlighter.span('punctuation', '/>'));
            j += 2;
            break;
          }
          // Whitespace
          if (/\s/.test(code[j])) {
            out.push(SyntaxHighlighter.esc(code[j]));
            j++;
            continue;
          }
          // Attribute name
          let aStart = j;
          while (j < len && /[a-zA-Z0-9\-_:@.]/.test(code[j])) j++;
          if (j > aStart) {
            out.push(SyntaxHighlighter.span('attr-name', code.slice(aStart, j)));
          }
          // =
          if (j < len && code[j] === '=') {
            out.push(SyntaxHighlighter.span('punctuation', '='));
            j++;
            // Value
            if (j < len && (code[j] === '"' || code[j] === "'")) {
              const q = code[j];
              let vEnd = code.indexOf(q, j + 1);
              if (vEnd === -1) vEnd = len; else vEnd += 1;
              out.push(SyntaxHighlighter.span('attr-value', code.slice(j, vEnd)));
              j = vEnd;
            }
          } else if (j === aStart) {
            // Stuck — push char to avoid infinite loop
            out.push(SyntaxHighlighter.esc(code[j]));
            j++;
          }
        }
        if (j < len && code[j] === '>') {
          out.push(SyntaxHighlighter.span('punctuation', '>'));
          j++;
        }
        i = j;
      } else {
        // Plain text
        let j = i;
        while (j < len && code[j] !== '<') j++;
        if (j === i) {
          out.push(SyntaxHighlighter.esc(code[i]));
          i++;
        } else {
          out.push(SyntaxHighlighter.esc(code.slice(i, j)));
          i = j;
        }
      }
    }
    return out.join('');
  }

  /* ---- CSS Highlighter ---- */
  static css(code) {
    const out = [];
    const len = code.length;
    let i = 0;
    while (i < len) {
      // Comments
      if (code[i] === '/' && i + 1 < len && code[i + 1] === '*') {
        let end = code.indexOf('*/', i + 2);
        if (end === -1) end = len; else end += 2;
        out.push(SyntaxHighlighter.span('comment', code.slice(i, end)));
        i = end;
      }
      // Strings
      else if (code[i] === '"' || code[i] === "'") {
        const q = code[i];
        let j = i + 1;
        while (j < len && code[j] !== q) { if (code[j] === '\\') j++; j++; }
        j = Math.min(j + 1, len);
        out.push(SyntaxHighlighter.span('string', code.slice(i, j)));
        i = j;
      }
      // At-rules
      else if (code[i] === '@') {
        let j = i + 1;
        while (j < len && /[a-zA-Z\-]/.test(code[j])) j++;
        out.push(SyntaxHighlighter.span('keyword', code.slice(i, j)));
        i = j;
      }
      // Selectors or properties — simplified approach
      else if (code[i] === '{' || code[i] === '}' || code[i] === ';' || code[i] === ':' || code[i] === ',') {
        out.push(SyntaxHighlighter.span('punctuation', code[i]));
        i++;
      }
      // Numbers
      else if (/[0-9]/.test(code[i]) || (code[i] === '.' && i + 1 < len && /[0-9]/.test(code[i + 1]))) {
        let j = i;
        while (j < len && /[0-9.%a-zA-Z]/.test(code[j])) j++;
        out.push(SyntaxHighlighter.span('number', code.slice(i, j)));
        i = j;
      }
      // Hash colors
      else if (code[i] === '#') {
        let j = i + 1;
        while (j < len && /[0-9a-fA-F]/.test(code[j])) j++;
        if (j > i + 1) {
          out.push(SyntaxHighlighter.span('number', code.slice(i, j)));
        } else {
          // Could be a selector id
          while (j < len && /[a-zA-Z0-9_\-]/.test(code[j])) j++;
          out.push(SyntaxHighlighter.span('selector', code.slice(i, j)));
        }
        i = j;
      }
      // Words (selectors, properties, values)
      else if (/[a-zA-Z_\-.]/.test(code[i])) {
        let j = i;
        while (j < len && /[a-zA-Z0-9_\-]/.test(code[j])) j++;
        const word = code.slice(i, j);
        const cssKw = ['important','inherit','initial','unset','none','auto','block','inline','flex','grid','relative','absolute','fixed','sticky'];
        if (cssKw.includes(word)) {
          out.push(SyntaxHighlighter.span('keyword', word));
        } else {
          out.push(SyntaxHighlighter.span('property', word));
        }
        i = j;
      }
      else {
        out.push(SyntaxHighlighter.esc(code[i]));
        i++;
      }
    }
    return out.join('');
  }

  /* ---- Markdown Highlighter ---- */
  static markdown(code) {
    // Line-based highlighting
    return code.split('\n').map(function (line) {
      // Headings
      if (/^#{1,6}\s/.test(line)) {
        return SyntaxHighlighter.span('heading', line);
      }
      // Code blocks (``` lines)
      if (/^```/.test(line)) {
        return SyntaxHighlighter.span('comment', line);
      }
      // Process inline elements
      let result = SyntaxHighlighter.esc(line);
      // Bold **text**
      result = result.replace(/\*\*(.+?)\*\*/g, '<span class="nce-bold">**$1**</span>');
      // Italic *text*
      result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<span class="nce-italic">*$1*</span>');
      // Inline code `text`
      result = result.replace(/`([^`]+)`/g, '<span class="nce-code">`$1`</span>');
      // Links [text](url)
      result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="nce-link">[$1]($2)</span>');
      // Blockquote
      if (/^&gt;\s/.test(result)) {
        result = '<span class="nce-comment">' + result + '</span>';
      }
      // List markers
      result = result.replace(/^(\s*[-*+]\s)/, '<span class="nce-keyword">$1</span>');
      result = result.replace(/^(\s*\d+\.\s)/, '<span class="nce-keyword">$1</span>');
      return result;
    }).join('\n');
  }

  /* ---- C-like language tokenizer (JS) ---- */
  static _cLike(code, keywords, hasTemplateStrings) {
    const out = [];
    const len = code.length;
    let i = 0;
    while (i < len) {
      const ch = code[i];
      // Single-line comment
      if (ch === '/' && i + 1 < len && code[i + 1] === '/') {
        let end = code.indexOf('\n', i);
        if (end === -1) end = len;
        out.push(SyntaxHighlighter.span('comment', code.slice(i, end)));
        i = end;
      }
      // Multi-line comment
      else if (ch === '/' && i + 1 < len && code[i + 1] === '*') {
        let end = code.indexOf('*/', i + 2);
        if (end === -1) end = len; else end += 2;
        out.push(SyntaxHighlighter.span('comment', code.slice(i, end)));
        i = end;
      }
      // Template literal
      else if (hasTemplateStrings && ch === '`') {
        let j = i + 1;
        let s = SyntaxHighlighter.esc('`');
        while (j < len && code[j] !== '`') {
          if (code[j] === '\\') {
            s += SyntaxHighlighter.esc(code.slice(j, j + 2));
            j += 2;
          } else if (code[j] === '$' && j + 1 < len && code[j + 1] === '{') {
            s += '</span>' + SyntaxHighlighter.span('punctuation', '${');
            j += 2;
            let depth = 1;
            let inner = '';
            while (j < len && depth > 0) {
              if (code[j] === '{') depth++;
              else if (code[j] === '}') { depth--; if (depth === 0) break; }
              inner += code[j];
              j++;
            }
            // Recursively highlight inner expression
            s += SyntaxHighlighter._cLike(inner, keywords, hasTemplateStrings);
            s += SyntaxHighlighter.span('punctuation', '}') + '<span class="nce-string">';
            if (j < len) j++; // skip }
          } else {
            s += SyntaxHighlighter.esc(code[j]);
            j++;
          }
        }
        if (j < len) { s += SyntaxHighlighter.esc('`'); j++; }
        out.push('<span class="nce-string">' + s + '</span>');
        i = j;
      }
      // Strings
      else if (ch === '"' || ch === "'") {
        const q = ch;
        let j = i + 1;
        while (j < len && code[j] !== q && code[j] !== '\n') {
          if (code[j] === '\\') j++;
          j++;
        }
        if (j < len && code[j] === q) j++;
        out.push(SyntaxHighlighter.span('string', code.slice(i, j)));
        i = j;
      }
      // Numbers
      else if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < len && /[0-9]/.test(code[i + 1]))) {
        let j = i;
        if (code[j] === '0' && j + 1 < len && (code[j + 1] === 'x' || code[j + 1] === 'X')) {
          j += 2;
          while (j < len && /[0-9a-fA-F_]/.test(code[j])) j++;
        } else if (code[j] === '0' && j + 1 < len && (code[j + 1] === 'b' || code[j + 1] === 'B')) {
          j += 2;
          while (j < len && /[01_]/.test(code[j])) j++;
        } else {
          while (j < len && /[0-9_.]/.test(code[j])) j++;
          if (j < len && (code[j] === 'e' || code[j] === 'E')) {
            j++;
            if (j < len && (code[j] === '+' || code[j] === '-')) j++;
            while (j < len && /[0-9]/.test(code[j])) j++;
          }
        }
        if (j < len && code[j] === 'n') j++; // BigInt
        out.push(SyntaxHighlighter.span('number', code.slice(i, j)));
        i = j;
      }
      // Regex (simple heuristic)
      else if (ch === '/' && i > 0 && !/[a-zA-Z0-9_$)]/.test(code[i - 1])) {
        let j = i + 1;
        let valid = true;
        while (j < len && code[j] !== '/' && code[j] !== '\n') {
          if (code[j] === '\\') j++;
          j++;
        }
        if (j < len && code[j] === '/') {
          j++;
          while (j < len && /[gimsuy]/.test(code[j])) j++;
          out.push(SyntaxHighlighter.span('string', code.slice(i, j)));
          i = j;
        } else {
          out.push(SyntaxHighlighter.span('operator', ch));
          i++;
        }
      }
      // Words (keywords, functions, identifiers)
      else if (/[a-zA-Z_$]/.test(ch)) {
        let j = i;
        while (j < len && /[a-zA-Z0-9_$]/.test(code[j])) j++;
        const word = code.slice(i, j);
        // Check if followed by (  → function
        let k = j;
        while (k < len && (code[k] === ' ' || code[k] === '\t')) k++;
        if (keywords.has(word)) {
          out.push(SyntaxHighlighter.span('keyword', word));
        } else if (code[k] === '(') {
          out.push(SyntaxHighlighter.span('function', word));
        } else {
          out.push(SyntaxHighlighter.span('variable', word));
        }
        i = j;
      }
      // Operators
      else if ('=+-*/<>!&|^~%?'.includes(ch)) {
        out.push(SyntaxHighlighter.span('operator', ch));
        i++;
      }
      // Punctuation
      else if ('(){}[];:,.'.includes(ch)) {
        out.push(SyntaxHighlighter.span('punctuation', ch));
        i++;
      }
      // Everything else
      else {
        out.push(SyntaxHighlighter.esc(ch));
        i++;
      }
    }
    return out.join('');
  }

  /** Main entry: highlight code based on language */
  static highlight(code, language) {
    switch ((language || '').toLowerCase()) {
      case 'javascript':
      case 'js':
        return SyntaxHighlighter.javascript(code);
      case 'html':
        return SyntaxHighlighter.html(code);
      case 'css':
        return SyntaxHighlighter.css(code);
      case 'json':
        return SyntaxHighlighter.json(code);
      case 'markdown':
      case 'md':
        return SyntaxHighlighter.markdown(code);
      default:
        return SyntaxHighlighter.esc(code);
    }
  }
}

/* =========================================================================
 * SECTION 3: SVG Icons (inline, no external deps)
 * ========================================================================= */

const NCE_ICONS = {
  copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  close: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  maximize: '<svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  minimize: '<svg viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  chevUp: '<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>',
  chevDown: '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
  minimap: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="14" y="5" width="5" height="8" rx="1" opacity="0.5"/></svg>',
};

/* =========================================================================
 * SECTION 4: The Web Component
 * ========================================================================= */

class NeikiCodeEditorElement extends HTMLElement {

  /* ---- Observed attributes ---- */
  static get observedAttributes() {
    return ['language', 'theme', 'readonly', 'line-numbers', 'minimap', 'fullscreen'];
  }

  constructor() {
    super();
    /** @type {ShadowRoot} */
    this._shadow = this.attachShadow({ mode: 'open' });

    // Internal state
    this._code = '';
    this._cursorLine = 0;
    this._searchOpen = false;
    this._searchQuery = '';
    this._searchMatches = [];
    this._searchIndex = -1;
    this._highlightScheduled = false;
    this._gutterScheduled = false;
    this._lineCount = 0;

    // Bracket pairs for auto-closing
    this._brackets = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'" };
  }

  /* ---- Lifecycle: connected ---- */
  connectedCallback() {
    // Grab initial code from textContent
    this._code = this.textContent || '';
    this.textContent = ''; // clear light DOM

    this._buildDOM();
    this._bindEvents();

    // Initial render
    this._textarea.value = this._code;
    this._scheduleHighlight();
    this._scheduleGutter();
    this._syncSize();
  }

  /* ---- Lifecycle: attribute changed ---- */
  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._wrap) return;
    switch (name) {
      case 'theme':
        this._wrap.classList.remove('dark', 'light');
        this._wrap.classList.add(newVal === 'light' ? 'light' : 'dark');
        break;
      case 'language':
        this._langLabel.textContent = (newVal || 'text').toUpperCase();
        this._scheduleHighlight();
        break;
      case 'readonly':
        this._textarea.readOnly = newVal !== null;
        break;
      case 'line-numbers':
        this._gutter.style.display = newVal === 'false' ? 'none' : '';
        break;
      case 'minimap':
        this._minimapEl.classList.toggle('visible', newVal !== null && newVal !== 'false');
        if (newVal !== null && newVal !== 'false') this._renderMinimap();
        break;
      case 'fullscreen':
        this._updateFullscreenBtn();
        break;
    }
  }

  /* ---- Build Shadow DOM ---- */
  _buildDOM() {
    const theme = this.getAttribute('theme') === 'light' ? 'light' : 'dark';
    const lang = this.getAttribute('language') || 'text';
    const ro = this.hasAttribute('readonly');
    const showLines = this.getAttribute('line-numbers') !== 'false';
    const showMinimap = this.hasAttribute('minimap') && this.getAttribute('minimap') !== 'false';

    // Stylesheet
    const style = document.createElement('style');
    style.textContent = NEIKI_DEFAULT_STYLES;
    this._shadow.appendChild(style);

    // Wrapper
    this._wrap = document.createElement('div');
    this._wrap.className = 'nce-wrap ' + theme;
    this._shadow.appendChild(this._wrap);

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'nce-toolbar';
    toolbar.innerHTML = `
      <div class="nce-toolbar-left">
        <span class="nce-lang-label">${SyntaxHighlighter.esc(lang.toUpperCase())}</span>
      </div>
      <div class="nce-toolbar-right">
        <button class="nce-btn nce-btn-search" title="Search (Ctrl+F)">${NCE_ICONS.search}</button>
        <button class="nce-btn nce-btn-minimap" title="Toggle Minimap">${NCE_ICONS.minimap}</button>
        <button class="nce-btn nce-btn-fullscreen" title="Toggle Fullscreen">${NCE_ICONS.maximize}</button>
        <button class="nce-btn nce-btn-copy" title="Copy Code">${NCE_ICONS.copy}<span>Copy</span></button>
      </div>
    `;
    this._wrap.appendChild(toolbar);
    this._langLabel = toolbar.querySelector('.nce-lang-label');

    // Search bar
    this._searchBar = document.createElement('div');
    this._searchBar.className = 'nce-search-bar';
    this._searchBar.innerHTML = `
      <input class="nce-search-input" type="text" placeholder="Search..." />
      <span class="nce-search-count"></span>
      <button class="nce-btn nce-btn-search-prev" title="Previous">${NCE_ICONS.chevUp}</button>
      <button class="nce-btn nce-btn-search-next" title="Next">${NCE_ICONS.chevDown}</button>
      <button class="nce-btn nce-btn-search-close" title="Close">${NCE_ICONS.close}</button>
    `;
    this._wrap.appendChild(this._searchBar);
    this._searchInput = this._searchBar.querySelector('.nce-search-input');
    this._searchCount = this._searchBar.querySelector('.nce-search-count');

    // Body
    const body = document.createElement('div');
    body.className = 'nce-body';
    this._wrap.appendChild(body);

    // Gutter
    this._gutter = document.createElement('div');
    this._gutter.className = 'nce-gutter';
    if (!showLines) this._gutter.style.display = 'none';
    body.appendChild(this._gutter);

    // Editor scroll container
    this._editorWrap = document.createElement('div');
    this._editorWrap.className = 'nce-editor';
    body.appendChild(this._editorWrap);

    // Line highlight
    this._lineHighlight = document.createElement('div');
    this._lineHighlight.className = 'nce-line-highlight';
    this._editorWrap.appendChild(this._lineHighlight);

    // Code layer (highlighted output)
    this._codeLayer = document.createElement('div');
    this._codeLayer.className = 'nce-code-layer';
    this._codeLayer.setAttribute('aria-hidden', 'true');
    this._editorWrap.appendChild(this._codeLayer);

    // Textarea
    this._textarea = document.createElement('textarea');
    this._textarea.className = 'nce-textarea';
    this._textarea.spellcheck = false;
    this._textarea.autocomplete = 'off';
    this._textarea.autocapitalize = 'off';
    this._textarea.setAttribute('autocorrect', 'off');
    this._textarea.setAttribute('data-gramm', 'false');
    if (ro) this._textarea.readOnly = true;
    this._editorWrap.appendChild(this._textarea);

    // Minimap
    this._minimapEl = document.createElement('div');
    this._minimapEl.className = 'nce-minimap' + (showMinimap ? ' visible' : '');
    this._minimapCanvas = document.createElement('canvas');
    this._minimapCanvas.className = 'nce-minimap-canvas';
    this._minimapViewport = document.createElement('div');
    this._minimapViewport.className = 'nce-minimap-viewport';
    this._minimapEl.appendChild(this._minimapCanvas);
    this._minimapEl.appendChild(this._minimapViewport);
    body.appendChild(this._minimapEl);

    // Toast
    this._toast = document.createElement('div');
    this._toast.className = 'nce-toast';
    this._toast.textContent = 'Copied!';
    this._wrap.appendChild(this._toast);
  }

  /* ---- Bind Events ---- */
  _bindEvents() {
    const ta = this._textarea;

    // Input / typing
    ta.addEventListener('input', () => {
      this._code = ta.value;
      this._scheduleHighlight();
      this._scheduleGutter();
      this._syncSize();
      this._updateLineHighlight();
      this._emitChange();
    });

    // Keydown: tabs, auto-close, enter indent, search shortcut
    ta.addEventListener('keydown', (e) => this._onKeyDown(e));

    // Cursor movement
    ta.addEventListener('click', () => this._updateLineHighlight());
    ta.addEventListener('keyup', () => this._updateLineHighlight());

    // Scroll sync (gutter + minimap)
    this._editorWrap.addEventListener('scroll', () => {
      this._gutter.scrollTop = this._editorWrap.scrollTop;
      this._updateMinimapViewport();
    });

    // Focus / blur events
    ta.addEventListener('focus', () => {
      this.dispatchEvent(new Event('focus'));
    });
    ta.addEventListener('blur', () => {
      this.dispatchEvent(new Event('blur'));
    });

    // Toolbar buttons
    this._shadow.querySelector('.nce-btn-copy').addEventListener('click', () => this._copyCode());
    this._shadow.querySelector('.nce-btn-search').addEventListener('click', () => this._toggleSearch());
    this._shadow.querySelector('.nce-btn-fullscreen').addEventListener('click', () => this._toggleFullscreen());
    this._shadow.querySelector('.nce-btn-minimap').addEventListener('click', () => this._toggleMinimap());

    // Search bar
    this._searchInput.addEventListener('input', () => this._onSearch());
    this._searchBar.querySelector('.nce-btn-search-prev').addEventListener('click', () => this._searchNav(-1));
    this._searchBar.querySelector('.nce-btn-search-next').addEventListener('click', () => this._searchNav(1));
    this._searchBar.querySelector('.nce-btn-search-close').addEventListener('click', () => this._toggleSearch(false));
    this._searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { this._searchNav(e.shiftKey ? -1 : 1); e.preventDefault(); }
      if (e.key === 'Escape') this._toggleSearch(false);
    });

    // Minimap click to scroll
    this._minimapEl.addEventListener('click', (e) => {
      const rect = this._minimapEl.getBoundingClientRect();
      const ratio = (e.clientY - rect.top) / rect.height;
      this._editorWrap.scrollTop = ratio * (this._editorWrap.scrollHeight - this._editorWrap.clientHeight);
    });
  }

  /* ---- Keydown Handler ---- */
  _onKeyDown(e) {
    const ta = this._textarea;

    // Ctrl+F / Cmd+F: search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      this._toggleSearch(true);
      return;
    }

    // Escape: close search
    if (e.key === 'Escape' && this._searchOpen) {
      this._toggleSearch(false);
      return;
    }

    // Readonly guard
    if (ta.readOnly) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;

    // Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Outdent: remove leading 2 spaces on current line
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        if (val.slice(lineStart, lineStart + 2) === '  ') {
          ta.value = val.slice(0, lineStart) + val.slice(lineStart + 2);
          ta.selectionStart = ta.selectionEnd = Math.max(start - 2, lineStart);
          this._afterEdit();
        }
      } else {
        this._insert('  ');
      }
      return;
    }

    // Enter: auto indent
    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const line = val.slice(lineStart, start);
      const indent = (line.match(/^(\s*)/) || ['', ''])[1];
      const charBefore = val[start - 1];
      const charAfter = val[start];
      // If between brackets, add extra indent + new line
      if ((charBefore === '{' && charAfter === '}') ||
          (charBefore === '[' && charAfter === ']') ||
          (charBefore === '(' && charAfter === ')')) {
        this._insert('\n' + indent + '  \n' + indent);
        ta.selectionStart = ta.selectionEnd = start + 1 + indent.length + 2;
      } else {
        this._insert('\n' + indent);
      }
      return;
    }

    // Auto-close brackets
    if (this._brackets[e.key] && start === end) {
      const closing = this._brackets[e.key];
      // For quotes, only auto-close if not already adjacent to same quote
      if ((e.key === '"' || e.key === "'") && val[start] === e.key) {
        // Skip over the closing quote
        e.preventDefault();
        ta.selectionStart = ta.selectionEnd = start + 1;
        return;
      }
      e.preventDefault();
      this._insert(e.key + closing);
      ta.selectionStart = ta.selectionEnd = start + 1;
      return;
    }

    // Skip closing bracket if already there
    if ((e.key === ')' || e.key === ']' || e.key === '}') && val[start] === e.key) {
      e.preventDefault();
      ta.selectionStart = ta.selectionEnd = start + 1;
      return;
    }

    // Backspace: delete matching brackets
    if (e.key === 'Backspace' && start === end && start > 0) {
      const before = val[start - 1];
      const after = val[start];
      if (this._brackets[before] && this._brackets[before] === after) {
        e.preventDefault();
        ta.value = val.slice(0, start - 1) + val.slice(start + 1);
        ta.selectionStart = ta.selectionEnd = start - 1;
        this._afterEdit();
        return;
      }
    }
  }

  /** Insert text at cursor and trigger update */
  _insert(text) {
    const ta = this._textarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;
    ta.value = val.slice(0, start) + text + val.slice(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    this._afterEdit();
  }

  /** After manual edit (non-input-event) */
  _afterEdit() {
    this._code = this._textarea.value;
    this._scheduleHighlight();
    this._scheduleGutter();
    this._syncSize();
    this._updateLineHighlight();
    this._emitChange();
  }

  /* ---- Syntax Highlighting ---- */
  _scheduleHighlight() {
    if (this._highlightScheduled) return;
    this._highlightScheduled = true;
    requestAnimationFrame(() => {
      this._highlightScheduled = false;
      this._renderHighlight();
    });
  }

  _renderHighlight() {
    const lang = this.getAttribute('language') || 'text';
    let html = SyntaxHighlighter.highlight(this._code, lang);
    // Apply search highlights on top
    if (this._searchQuery && this._searchMatches.length > 0) {
      html = this._applySearchHighlights(html);
    }
    // Ensure trailing newline so textarea and code layer stay aligned
    if (html.endsWith('\n') || html === '') html += ' ';
    this._codeLayer.innerHTML = html;
    // Update minimap if visible
    if (this._minimapEl.classList.contains('visible')) {
      this._renderMinimap();
    }
  }

  /* ---- Line Numbers / Gutter ---- */
  _scheduleGutter() {
    if (this._gutterScheduled) return;
    this._gutterScheduled = true;
    requestAnimationFrame(() => {
      this._gutterScheduled = false;
      this._renderGutter();
    });
  }

  _renderGutter() {
    const lines = this._code.split('\n');
    const count = lines.length;
    if (count === this._lineCount) {
      // Only update active line highlight
      this._markActiveLine();
      return;
    }
    this._lineCount = count;
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= count; i++) {
      const div = document.createElement('div');
      div.className = 'nce-gutter-line';
      div.textContent = i;
      frag.appendChild(div);
    }
    this._gutter.innerHTML = '';
    this._gutter.appendChild(frag);
    this._markActiveLine();
  }

  _markActiveLine() {
    const lineNum = this._getCurrentLine();
    if (lineNum === this._cursorLine) return;
    const prev = this._gutter.children[this._cursorLine];
    if (prev) prev.classList.remove('active');
    this._cursorLine = lineNum;
    const cur = this._gutter.children[lineNum];
    if (cur) cur.classList.add('active');
  }

  /* ---- Line Highlight ---- */
  _updateLineHighlight() {
    const lineNum = this._getCurrentLine();
    const lineH = parseFloat(getComputedStyle(this._textarea).lineHeight) || 21;
    const padding = 8; // matches CSS padding-top
    this._lineHighlight.style.top = (lineNum * lineH + padding) + 'px';
    this._lineHighlight.style.height = lineH + 'px';
    this._markActiveLine();
  }

  _getCurrentLine() {
    const pos = this._textarea.selectionStart;
    const val = this._textarea.value;
    let line = 0;
    for (let i = 0; i < pos; i++) {
      if (val[i] === '\n') line++;
    }
    return line;
  }

  /* ---- Sync textarea/code-layer size ---- */
  _syncSize() {
    // Make code layer and textarea large enough for content
    const ta = this._textarea;
    // Reset to auto to recalculate
    ta.style.height = 'auto';
    ta.style.width = 'auto';
    const sh = ta.scrollHeight;
    const sw = ta.scrollWidth;
    ta.style.height = sh + 'px';
    ta.style.width = sw + 'px';
    this._codeLayer.style.height = sh + 'px';
    this._codeLayer.style.width = sw + 'px';
  }

  /* ---- Search ---- */
  _toggleSearch(forceOpen) {
    const open = typeof forceOpen === 'boolean' ? forceOpen : !this._searchOpen;
    this._searchOpen = open;
    this._searchBar.classList.toggle('open', open);
    if (open) {
      this._searchInput.focus();
      // Pre-fill with selection
      const ta = this._textarea;
      const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
      if (sel && sel.indexOf('\n') === -1) {
        this._searchInput.value = sel;
      }
      this._onSearch();
    } else {
      this._searchQuery = '';
      this._searchMatches = [];
      this._searchIndex = -1;
      this._searchCount.textContent = '';
      this._scheduleHighlight();
      this._textarea.focus();
    }
  }

  _onSearch() {
    this._searchQuery = this._searchInput.value;
    if (!this._searchQuery) {
      this._searchMatches = [];
      this._searchIndex = -1;
      this._searchCount.textContent = '';
      this._scheduleHighlight();
      return;
    }
    // Find all match indices
    const q = this._searchQuery.toLowerCase();
    const text = this._code.toLowerCase();
    this._searchMatches = [];
    let idx = 0;
    while ((idx = text.indexOf(q, idx)) !== -1) {
      this._searchMatches.push(idx);
      idx += q.length;
    }
    this._searchIndex = this._searchMatches.length > 0 ? 0 : -1;
    this._searchCount.textContent = this._searchMatches.length > 0
      ? (this._searchIndex + 1) + '/' + this._searchMatches.length
      : 'No results';
    this._scheduleHighlight();
    if (this._searchIndex >= 0) this._scrollToMatch();
  }

  _searchNav(dir) {
    if (this._searchMatches.length === 0) return;
    this._searchIndex = (this._searchIndex + dir + this._searchMatches.length) % this._searchMatches.length;
    this._searchCount.textContent = (this._searchIndex + 1) + '/' + this._searchMatches.length;
    this._scheduleHighlight();
    this._scrollToMatch();
  }

  _scrollToMatch() {
    const pos = this._searchMatches[this._searchIndex];
    if (pos === undefined) return;
    this._textarea.focus();
    this._textarea.selectionStart = pos;
    this._textarea.selectionEnd = pos + this._searchQuery.length;
    // Scroll textarea into view at match position
    // Calculate approximate line
    const line = this._code.slice(0, pos).split('\n').length - 1;
    const lineH = parseFloat(getComputedStyle(this._textarea).lineHeight) || 21;
    this._editorWrap.scrollTop = Math.max(0, line * lineH - this._editorWrap.clientHeight / 2);
  }

  /** Overlay search highlights onto already-highlighted HTML.
   *  Works by inserting markers into the plain text content. */
  _applySearchHighlights(html) {
    // For simplicity/performance: re-highlight from scratch with markers
    // We inject search spans into the code-layer after syntax highlighting
    // by operating on the raw code positions and wrapping the highlighted output.
    // This is a simplified approach: we add a second pass overlay.
    const q = this._searchQuery;
    if (!q) return html;

    const qLower = q.toLowerCase();
    const codeLower = this._code.toLowerCase();
    const lang = this.getAttribute('language') || 'text';

    // Build array of {start, end, active}
    const matches = [];
    let idx = 0;
    while ((idx = codeLower.indexOf(qLower, idx)) !== -1) {
      matches.push({ start: idx, end: idx + q.length, active: idx === this._searchMatches[this._searchIndex] });
      idx += q.length;
    }
    if (matches.length === 0) return html;

    // Re-build highlighted code with search spans inserted
    // Strategy: highlight segments between/around matches
    const parts = [];
    let lastEnd = 0;
    for (const m of matches) {
      if (m.start > lastEnd) {
        parts.push(SyntaxHighlighter.highlight(this._code.slice(lastEnd, m.start), lang));
      }
      const cls = m.active ? 'nce-search-hl nce-search-hl-active' : 'nce-search-hl';
      parts.push('<span class="' + cls + '">' + SyntaxHighlighter.highlight(this._code.slice(m.start, m.end), lang) + '</span>');
      lastEnd = m.end;
    }
    if (lastEnd < this._code.length) {
      parts.push(SyntaxHighlighter.highlight(this._code.slice(lastEnd), lang));
    }
    return parts.join('');
  }

  /* ---- Copy ---- */
  _copyCode() {
    navigator.clipboard.writeText(this._code).then(() => {
      this._showToast();
      const btn = this._shadow.querySelector('.nce-btn-copy');
      btn.innerHTML = NCE_ICONS.check + '<span>Copied</span>';
      setTimeout(() => { btn.innerHTML = NCE_ICONS.copy + '<span>Copy</span>'; }, 1500);
    }).catch(() => { /* clipboard not available */ });
  }

  _showToast() {
    this._toast.classList.add('show');
    setTimeout(() => this._toast.classList.remove('show'), 1200);
  }

  /* ---- Fullscreen ---- */
  _toggleFullscreen() {
    if (this.hasAttribute('fullscreen')) {
      this.removeAttribute('fullscreen');
    } else {
      this.setAttribute('fullscreen', '');
    }
    this._updateFullscreenBtn();
  }

  _updateFullscreenBtn() {
    const btn = this._shadow.querySelector('.nce-btn-fullscreen');
    const isFs = this.hasAttribute('fullscreen');
    btn.innerHTML = isFs ? NCE_ICONS.minimize : NCE_ICONS.maximize;
    btn.title = isFs ? 'Exit Fullscreen' : 'Toggle Fullscreen';
  }

  /* ---- Minimap ---- */
  _toggleMinimap() {
    const show = !this._minimapEl.classList.contains('visible');
    this._minimapEl.classList.toggle('visible', show);
    const btn = this._shadow.querySelector('.nce-btn-minimap');
    btn.classList.toggle('active', show);
    if (show) this._renderMinimap();
  }

  _renderMinimap() {
    if (!this._minimapEl.classList.contains('visible')) return;
    const canvas = this._minimapCanvas;
    const lines = this._code.split('\n');
    const lineCount = lines.length;
    const scale = 2; // pixels per line
    const width = 60;
    const height = Math.max(lineCount * scale, 20);
    canvas.width = width;
    canvas.height = height;
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    const isDark = this._wrap.classList.contains('dark');
    ctx.clearRect(0, 0, width, height);
    // Draw each line as a thin colored bar
    const colors = isDark
      ? ['#cdd6f4', '#cba6f7', '#a6e3a1', '#89b4fa', '#fab387']
      : ['#4c4f69', '#8839ef', '#40a02b', '#1e66f5', '#fe640b'];
    for (let i = 0; i < lineCount; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      const len = Math.min(line.length, 50);
      const barW = (len / 50) * (width - 4);
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.45;
      ctx.fillRect(2, i * scale, barW, Math.max(scale - 1, 1));
    }
    ctx.globalAlpha = 1;
    this._updateMinimapViewport();
  }

  _updateMinimapViewport() {
    if (!this._minimapEl.classList.contains('visible')) return;
    const ew = this._editorWrap;
    const totalH = ew.scrollHeight || 1;
    const viewH = ew.clientHeight;
    const scrollT = ew.scrollTop;
    const canvasH = this._minimapCanvas.height;
    const vpTop = (scrollT / totalH) * canvasH;
    const vpH = Math.max((viewH / totalH) * canvasH, 10);
    this._minimapViewport.style.top = vpTop + 'px';
    this._minimapViewport.style.height = vpH + 'px';
  }

  /* ---- Emit change event ---- */
  _emitChange() {
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this._code } }));
  }

  /* ---- Public API: Methods ---- */

  /** Get the current code value */
  getValue() {
    return this._code;
  }

  /** Set the code value programmatically */
  setValue(value) {
    this._code = String(value);
    if (this._textarea) {
      this._textarea.value = this._code;
      this._scheduleHighlight();
      this._scheduleGutter();
      this._syncSize();
    }
  }

  /** Focus the editor */
  focus() {
    if (this._textarea) this._textarea.focus();
  }

  /** Basic format (re-indent JSON) */
  format() {
    const lang = (this.getAttribute('language') || '').toLowerCase();
    if (lang === 'json') {
      try {
        const obj = JSON.parse(this._code);
        this.setValue(JSON.stringify(obj, null, 2));
      } catch (e) { /* not valid JSON, do nothing */ }
    }
  }
}

/* =========================================================================
 * SECTION 5: Register the component & expose global API
 * ========================================================================= */

// Register the custom element
if (!customElements.get('neiki-code-editor')) {
  customElements.define('neiki-code-editor', NeikiCodeEditorElement);
}

// Expose global API
window.NeikiCodeEditor = {
  version: '1.0.0',
  /**
   * Programmatically create an editor instance
   * @param {HTMLElement} container - parent element
   * @param {object} options - { language, theme, value, readonly }
   * @returns {NeikiCodeEditorElement}
   */
  create(container, options) {
    const el = document.createElement('neiki-code-editor');
    if (options) {
      if (options.language) el.setAttribute('language', options.language);
      if (options.theme) el.setAttribute('theme', options.theme);
      if (options.readonly) el.setAttribute('readonly', '');
      if (options.lineNumbers === false) el.setAttribute('line-numbers', 'false');
      if (options.minimap) el.setAttribute('minimap', '');
      if (options.value) el.textContent = options.value;
    }
    container.appendChild(el);
    return el;
  }
};
