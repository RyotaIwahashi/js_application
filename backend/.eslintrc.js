module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "es2021": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    // 同等性が三重等号演算子以外でチェックされた場合に警告する
    'eqeqeq': 'error',
    // 行末に不要な末尾スペースを入れないように
    'no-trailing-spaces': 'error',
    // 中かっこの前後に常にスペースを入れる
    'object-curly-spacing': [
      'error', 'always'
    ],
    // アロー関数の関数パラメーターで空白を一貫して使用する
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    // "extends": "eslint:recommended"で事前定義されたルールの、console.logコマンドをエラーにするルールを消す。
    'no-console': 0,
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    // 'quotes': [
    //     'error',
    //     'single'
    // ],
    'semi': [
      'error',
      'never'
    ]
  }
}
