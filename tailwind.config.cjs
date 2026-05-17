module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#f2f3f5',
          surface: '#ffffff',
          elevated: '#f8f9fb',
          text: '#121417',
          muted: '#616770',
          stroke: '#d8dce2',
          accent: '#1f7a5a',
          accentSoft: '#e8f4ef',
          successSoft: '#eaf7ef',
          successStroke: '#cde8d8',
          successText: '#245d45',
          warningSoft: '#fff7ed',
          warningStroke: '#f0dcc2',
          warningText: '#8f6530',
          dangerSoft: '#fff2f2',
          dangerStroke: '#f0cfd2',
          dangerText: '#8d3e49'
        }
      },
      boxShadow: {
        apple: '0 16px 40px rgba(15, 23, 42, 0.12)'
      },
      borderRadius: {
        apple: '20px'
      }
    }
  },
  plugins: [],
};
