/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],
  tabWidth: 2,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'none',
  bracketSameLine: false,
  semi: true,
  quoteProps: 'consistent',
  importOrder: ['<THIRD_PARTY_MODULES>', '', '^@/', '', '^[../]', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.5.3',
  experimentalTernaries: true
};

export default config;
