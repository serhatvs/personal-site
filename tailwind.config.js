/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './blog/**/*.html', './projects/**/*.html', './tools/**/*.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#0f0518',
          900: '#15091f',
          850: '#1d0c2b',
          800: '#2B0D3E',
        },
        amethyst: {
          50: '#F2EAF7',
          100: '#E4D3EC',
          200: '#C59DD9',
          600: '#7A3F91',
          900: '#2B0D3E',
        },
        topaz: {
          50: '#FFF8E7',
          100: '#FCECC1',
          300: '#FFD77A',
          500: '#E6A520',
          900: '#7A4A00',
        },
        mist: {
          50: '#F5F6F7',
          100: '#E5E7EA',
          200: '#C1C4C8',
          500: '#7B7F85',
          900: '#2E2E33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'void-glow': '0 24px 80px rgba(122, 63, 145, 0.22)',
        'topaz-glow': '0 24px 80px rgba(230, 165, 32, 0.18)',
        panel: '0 25px 70px rgba(7, 4, 14, 0.46)',
      },
      backdropBlur: {
        glass: '16px',
      },
      backgroundImage: {
        'void-gradient':
          'radial-gradient(circle at 20% 20%, rgba(122, 63, 145, 0.32), transparent 38%), radial-gradient(circle at 80% 0%, rgba(230, 165, 32, 0.16), transparent 32%), linear-gradient(160deg, #0f0518 0%, #12071b 35%, #09030e 100%)',
        'aurora-text':
          'linear-gradient(120deg, #F2EAF7 0%, #C59DD9 22%, #E6A520 50%, #F2EAF7 76%, #C59DD9 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        meteor: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(220%)', opacity: '0' },
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        aurora: 'aurora 10s linear infinite',
        meteor: 'meteor 2.4s ease-in-out infinite',
        scanline: 'scanline 6s linear infinite',
      },
    },
  },
  plugins: [],
}
