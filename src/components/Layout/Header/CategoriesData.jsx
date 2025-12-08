// src/components/Header/categoriesData.js
export const categories = [
  {
    name: "Apparel",
    path: "/category/apparel",
    submenu: [
      { label: "Shirts", path: "/category/apparel/shirts" },
      { label: "Pants", path: "/category/apparel/pants" },
      { label: "Shoes", path: "/category/apparel/shoes" },
    ],
  },
  {
    name: "Performance",
    path: "/category/performance",
    submenu: [
      { label: "Running", path: "/category/performance/running" },
      { label: "Sneakers", path: "/category/performance/sneakers" },
      { label: "Football", path: "/category/performance/football" },
      { label: "Basket", path: "/category/performance/basket" },
      { label: "Formals", path: "/category/performance/formal" },
    ],
  },
  {
    name: "Brand",
    path: "/category/brand",
    submenu: [
      { label: "Nike", path: "/category/nike" },
      { label: "Puma", path: "/category/puma" },
      { label: "Adidas", path: "/category/adidas" },
      { label: "Reebok", path: "/category/reebok" },
      { label: "Asics", path: "/category/asics" },
      { label: "New Balance", path: "/category/newbalance" },
    ],
  },
  {
    name: "Accessories",
    path: "/category/accessories",
    submenu: [
      { label: "Socks", path: "/category/accessories/socks" },
      { label: "Bags", path: "/category/accessories/bags" },
      { label: "Hat", path: "/category/accessories/hat" },
      { label: "Bandana", path: "/category/accessories/bandana" },
    ],
  },
];
