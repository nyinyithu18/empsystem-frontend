module.exports = {
  content: ['node_modules/flowbite-react/lib/esm/**/*.js',
  './src/**/*.{js,jsx,ts,tsx}' /* src folder, for example */],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
};
