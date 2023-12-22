import type { Formatter, LintResult, LinterResult, Warning } from 'stylelint'
import path from 'path'
import xmlbuilder from 'xmlbuilder2'

function parseWarning(warning: Warning, source: string) {
  const {
    rule,
    severity,
    line,
    column,
    text
  } = warning

  return {
    '@name': `${source} (${line}:${column})`,
    // Gitlab output "classname" as "suite" - sigh...
    '@classname': rule,
    '@file': source,
    failure: {
      '@type': severity,
      '#text': text
    }
  }
}

function parseLintResult(lintResult: LintResult, returnValue: LinterResult) {
  // CI_PROJECT_DIR is presented in GitlabCI's env and will be prioritized.
  const cwd = process.env.CI_PROJECT_DIR || returnValue.cwd || process.cwd()
  const sourceFile = path.relative(cwd, lintResult.source!).split(path.sep).join('/');
  const failuresCount = lintResult.warnings.length
  const testCases = lintResult.errored
    ? lintResult.warnings.map((warning) => parseWarning(warning, sourceFile))
    : { '@name': 'passed' }

  return {
    testsuite: {
      '@name': sourceFile,
      '@errors': failuresCount,
      '@failures': failuresCount,
      '@tests': failuresCount,
      testcase: testCases
    }
  }
}

const junitFormatter: Formatter = function(results, returnValue) {
  const testSuites = results.map((lintResult) => parseLintResult(lintResult, returnValue))

  const xml = xmlbuilder.create({ encoding: 'UTF-8' })
    .ele('testsuites', { package: 'stylelint'})

  const junitResult = testSuites.length
    ? xml.ele(testSuites).end({ prettyPrint: true })
    : xml.end({ prettyPrint: true })

  return junitResult
}

export default junitFormatter
