
const test = require('ava')
const junitFormatter = require('./build/index')

//todo Shoud add a full input file mock too.

// Example input from https://stylelint.io/developer-guide/formatters
const mockLintResults = [
  {
    "source": "path/to/file.css", // The filepath or PostCSS identifier like <input css 1>
    "errored": true, // This is `true` if at least one rule with an "error"-level severity triggered a warning
    "warnings": [
      // Array of rule problem warning objects, each like the following ...
      {
        "line": 3,
        "column": 12,
        "endLine": 4,
        "endColumn": 15,
        "rule": "block-no-empty",
        "severity": "error",
        "text": "You should not have an empty block (block-no-empty)"
      }
    ],
    "deprecations": [
      // Array of deprecation warning objects, each like the following ...
      {
        "text": "Feature X has been deprecated and will be removed in the next major version.",
        "reference": "https://stylelint.io/docs/feature-x.md"
      }
    ],
    "invalidOptionWarnings": [
      // Array of invalid option warning objects, each like the following ...
      {
        "text": "Invalid option X for rule Y"
      }
    ],
    "ignored": false // This is `true` if the file's path matches a provided ignore pattern
  }
]
const mockLinterResult = {
  "errored": false, // `true` if there were any warnings with "error" severity
  "maxWarningsExceeded": {
    // Present if Stylelint was configured with a `maxWarnings` count
    "maxWarnings": 10,
    "foundWarnings": 15
  },
  "ruleMetadata": {
    "block-no-empty": {
      "url": "https://stylelint.io/user-guide/rules/block-no-empty"
    },
    // other rules...
  }
}

const expectedOutput =
`<?xml version="1.0" encoding="UTF-8"?>
<testsuites package="stylelint">
  <testsuite name="path/to/file.css" errors="1" failures="1" tests="1">
    <testcase name="path/to/file.css (3:12)" classname="block-no-empty" file="path/to/file.css">
      <failure type="error">You should not have an empty block (block-no-empty)</failure>
    </testcase>
  </testsuite>
</testsuites>`

test('junitFormatter() XML output', t => {
  t.is(
    junitFormatter(mockLintResults, mockLinterResult),
    expectedOutput
  )
})
