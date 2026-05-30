export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17212b',
        brand: '#0f9f8f',
        coral: '#ff6b57',
        saffron: '#f6b73c'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(23, 33, 43, 0.12)'
      },
      animation: {
        float: 'float 5s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
};

