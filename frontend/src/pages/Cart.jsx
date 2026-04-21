import api from "../api/api";

export default function Cart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const createOrder = async () => {
    await api.post("/orders", {
      items: cart.map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price
      }))
    });

    localStorage.removeItem("cart");
    alert("Order created");
    window.location.reload();
  };

  return (
    <div className="page">
      <h1>Cart</h1>

      {cart.map((item, index) => (
        <div className="card" key={index}>
          <h3>{item.title}</h3>
          <p>${item.price}</p>
        </div>
      ))}

      {cart.length > 0 && (
        <button onClick={createOrder}>Create Order</button>
      )}
    </div>
  );
}