/** @type {import('tailwindcss').Config} */
const {fontFamily} = require('tailwindcss/defaultTheme')
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                main: ['Montserrat', 'sans-serif']
            },
            fontWeight: {
                // Добавляем настройки для font-weight
                thin: 100,
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800,
                black: 900,
            },
            colors:{
                current: 'currentColor',
                'accent': {
                    100: 'rgba(16,185,129,0.1)',
                    200: 'rgba(16,185,129,0.2)',
                    300: 'rgba(16,185,129,0.3)',
                    400: 'rgba(16,185,129,0.4)',
                    500: 'rgba(16,185,129,0.5)',
                    600: 'rgba(16,185,129,0.6)',
                    700: 'rgba(16,185,129,0.7)',
                    800: 'rgba(16,185,129,0.8)',
                    900: 'rgba(16,185,129,0.9)',
                    DEFAULT: '#10B981',
                }, 'white': {
                    100: 'rgba(255,255,255,0.1)',
                    200: 'rgba(255,255,255,0.2)',
                    300: 'rgba(255,255,255,0.3)',
                    400: 'rgba(255,255,255,0.4)',
                    500: 'rgba(255,255,255,0.5)',
                    600: 'rgba(255,255,255,0.6)',
                    700: 'rgba(255,255,255,0.7)',
                    800: 'rgba(255,255,255,0.8)',
                    900: 'rgba(255,255,255,0.9)',
                    DEFAULT: '#ffffff',
                },'gray': {
                    100: 'rgba(51,51,51,0.1)',
                    200: 'rgba(51,51,51,0.2)',
                    300: 'rgba(51,51,51,0.3)',
                    400: 'rgba(51,51,51,0.4)',
                    500: 'rgba(51,51,51,0.5)',
                    600: 'rgba(51,51,51,0.6)',
                    700: 'rgba(51,51,51,0.7)',
                    800: 'rgba(51,51,51,0.8)',
                    900: 'rgba(51,51,51,0.9)',
                    DEFAULT: '#333333',
                },
            },
            spacing: {
                'header-height': "75px",
                'space-s': "15px",
                'space-m': "25px",
                'space-l': "50px"
            }
        },
    },
    plugins: [],
}

