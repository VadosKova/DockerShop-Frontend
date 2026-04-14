export const translations = {
  en: {
    change_language: "Lang",
    login: "Login",
    register: "Register",
    products: "Products",
    cart: "Cart",
    orders: "Orders",
    admin: "Admin Panel",
    add: "Add",
    logout: "Logout"
  },
  ru: {
    change_language: "Язык",
    login: "Вход",
    register: "Регистрация",
    products: "Товары",
    cart: "Корзина",
    orders: "Заказы",
    admin: "Админ панель",
    add: "Добавить",
    logout: "Выйти"
  }
};

export const t = (key) => {
  const lang = localStorage.getItem("lang") || "en";
  return translations[lang][key] || key;
};