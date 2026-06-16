/**
 * Commitlint configuration — enforces Conventional Commits.
 *
 * Loaded by the `commit-msg` git hook (see lefthook.yml).
 * `.cjs` is used because the root package.json has no `"type"` field, so Node
 * treats `.js` as CommonJS by default; `.cjs` makes the CommonJS `module.exports`
 * unambiguous regardless of any future `"type": "module"` addition.
 */

/** @type {import("@commitlint/types").UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Restrict the allowed commit types to the set documented in CLAUDE.md.
    "type-enum": [2, "always", ["feat", "fix", "refactor", "chore", "docs", "style", "test"]],
  },
};
