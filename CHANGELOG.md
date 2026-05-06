# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-05-06

### Added

- Initial release of Neiki Code Editor.
- Web Component registration for `<neiki-code-editor>`.
- Shadow DOM based editor UI with isolated styling.
- Syntax highlighting for JavaScript, HTML, CSS, JSON and Markdown.
- Editable code area with native textarea behavior.
- Line numbers with active line indication.
- Built-in dark and light themes.
- Auto indentation for new lines.
- Tab key support with two-space indentation.
- Auto closing brackets for `()`, `{}`, `[]`, `""` and `''`.
- Basic search functionality with previous and next navigation.
- Copy code button with visual feedback.
- Readonly mode for static code snippets.
- Responsive layout for desktop and mobile use.
- Optional minimap support.
- Optional fullscreen mode.
- Public component methods: `getValue()`, `setValue(value)`, `focus()` and `format()`.
- Public events: `change`, `focus` and `blur`.
- Global API exposed as `window.NeikiCodeEditor`.
- Usage examples for markup-based and programmatic initialization.
