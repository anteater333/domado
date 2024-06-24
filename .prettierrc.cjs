/** @type {import("prettier").Options} */
const config = {
  singleQuote: true,
  jsxSingleQuote: false,
  useTabs: false,
  trailingComma: 'all',
  semi: true,
  printWidth: 80,
  tabWidth: 2,
  // plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
