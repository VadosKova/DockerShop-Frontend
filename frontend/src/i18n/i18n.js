export const translations = {
  en: {
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    products: "Products",
    cart: "Cart",
    orders: "Orders",
    admin: "Admin Panel",
    add: "Add",
    logout: "Logout"
  },
  uk: {
    login: "Вхід",
    register: "Реєстрація",
    email: "Пошта",
    password: "Пароль",
    products: "Товари",
    cart: "Кошик",
    orders: "Замовлення",
    admin: "Адмін панель",
    add: "Додати",
    logout: "Вийти"
  }
};

export const t = (key) => {
  const lang = localStorage.getItem("lang") || "en";
  return translations[lang][key] || key;
};