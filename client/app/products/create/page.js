"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (image) {
      data.append("image", image);
    }

    // Use NEXT_PUBLIC_API_URL (from client/.env.local) or fallback to localhost
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) throw new Error("Failed");

    alert("✅ Product Created");

    router.push("/products");

  } catch (err) {
    console.error(err);
    alert("❌ Error creating product");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Add New Product</h2>

      <form
        className="card p-4 shadow-sm"
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        {/* Stock */}
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            name="countInStock"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}