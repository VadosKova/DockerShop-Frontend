export const translations = {
  en: {
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
  return translations[lang][key];
};