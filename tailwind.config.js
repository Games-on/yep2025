/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'manwah-red': '#8B0000',    // Đỏ mận/đỏ đậm đặc trưng
        'manwah-gold': '#D4AF37',   // Vàng đồng sang trọng
        'manwah-wood': '#2C1810',   // Nâu gỗ trầm
        'manwah-cream': '#FDF5E6',  // Trắng kem (giống màu bát đĩa/khăn trải bàn)
      },
    },
  },
  plugins: [],
}