module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: { extend: {
    colors: {creator: {background:'#0C0C0C',ink:'#D7E2EA'}},
    fontFamily:{kanit:['Kanit','sans-serif']}
  }},
  plugins: []
};
