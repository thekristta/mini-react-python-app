import { useEffect, useState } from "react";
import axios from "axios";

const API = "/api";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // 📖 Fetch products
  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products`);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ Add product
  const addProduct = async () => {
    await axios.post(`${API}/products`, {
      name,
      price: Number(price)
    });

    setName("");
    setPrice("");
    fetchProducts();
  };

  // ❌ Delete product
  const deleteProduct = async (id) => {
    await axios.delete(`${API}/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Manager</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={addProduct}>Add</button>

      <hr />

      {products.map((p) => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
          <button onClick={() => deleteProduct(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;