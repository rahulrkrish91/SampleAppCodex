module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        m3Primary: '#6750A4',
        m3Secondary: '#625B71',
        m3Background: '#FFFBFE',
        m3Surface: '#F7F2FA',
        m3SurfaceTint: '#E8DEF8',
      },
      borderRadius: {
        m3: '20px',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        displayLg: ['57px', { lineHeight: '64px', letterSpacing: '-0.25px' }],
        bodyMd: ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
      },
      boxShadow: {
        m3: '0 1px 3px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
