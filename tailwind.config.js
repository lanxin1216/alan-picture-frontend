/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 蓝色系主色调
        'primary-blue': '#1890ff',
        'primary-blue-hover': '#40a9ff',
        'light-blue': '#e6f7ff',
        'dark-blue': '#0050b3',
        
        // 中性色系
        'text-primary': 'rgba(0, 0, 0, 0.85)',
        'text-secondary': 'rgba(0, 0, 0, 0.65)',
        'text-tertiary': 'rgba(0, 0, 0, 0.45)',
        
        // 背景色
        'bg-white': '#ffffff',
        'bg-gray-1': '#fafafa',
        'bg-gray-2': '#f5f5f5',
        'bg-gray-3': '#f0f0f0',
        
        // 玻璃质感专用
        'glass-bg-light': 'rgba(255, 255, 255, 0.7)',
        'glass-bg-dark': 'rgba(255, 255, 255, 0.15)',
        'glass-border': 'rgba(255, 255, 255, 0.3)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      borderRadius: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}