module.exports = {
  purge: [
      './src/**/*.html',
      './src/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        'header': '56px',
        'content': '64px',
      },
    },
  },
  variants: {
    extend: {
      margin: ['first', 'last'],
      borderRadius: ['first', 'last'],
      borderWidth: ['first', 'last'],
    },
  },
  plugins: [],
}
