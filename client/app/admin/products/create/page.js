"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/services/categoryService";
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
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories();
        setCategories(Array.isArray(cats) ? cats : cats.categories || []);
      } catch {
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Failed");
      router.replace("/products");
    } catch (err) {
      console.error(err);
      alert("❌ Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-product">

      {/* Dark Header */}
      <div className="admin-header">
        <h4 className="mb-0">Create New Product</h4>
      </div>

      <div className="container py-5">

        <form
          className="card shadow-sm border-0 p-4 product-form"
          onSubmit={handleSubmit}
        >

          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Name</label>
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
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              rows="3"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          {/* Row Inputs */}
          <div className="row">

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id || cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Stock</label>
              <input
                type="number"
                name="countInStock"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Product Image</label>

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImage}
              required
            />

            {preview && (
              <div className="image-preview mt-3">
                <img src={preview} alt="preview" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 py-2"
            disabled={loading}
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>

        </form>
      </div>
    </div>
  );
}