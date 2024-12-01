import type { UserConfig } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'build', // Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
        'chore', // Changes that don't modify src or test files
        'ci', // Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
        'docs', // Documentation only changes
        'feat', // A new feature
        'fix', // A bug fix
        'perf', // A code change that improves performance
        'refactor', // A code change that neither fixes a bug nor adds a feature
        'revert', // Reverts a previous commit
        'style', // Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
        'test', // Adding missing tests or correcting existing tests
      ],
    ],
    'scope-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'app', // Application related changes
        'config', // Configuration files
        'deps', // Dependencies related changes
        'lib', // Library related changes
        'scripts', // Scripts related changes
        'src', // Source code changes
        'test', // Test related changes
        'types', // Type definition changes
      ],
    ],
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      [
        'sentence-case', // Sentence case
        'start-case', // Start Case
        'pascal-case', // PascalCase
        'upper-case', // UPPERCASE
      ],
    ],
  },
};

module.exports = Configuration;
