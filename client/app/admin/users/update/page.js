"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/services/categoryService";
import { toastMessage } from "../../../../utils/toastMessage";
import { useRouter } from "next/navigation";


export default function CreateProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sellPrice: "",
    category: "",
    countInStock: "",
    role: "user",
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      // Ensure price > 0, sellPrice < price, countInStock >= 1
      const safePrice = Math.max(Number(formData.price), 1);
      let safeSellPrice = Number(formData.sellPrice);
      if (isNaN(safeSellPrice) || safeSellPrice < 0) safeSellPrice = 0;
      if (safeSellPrice >= safePrice) safeSellPrice = safePrice - 1;
      const safeFormData = {
        ...formData,
        price: safePrice,
        sellPrice: safeSellPrice,
        countInStock: Math.max(Number(formData.countInStock), 1),
      };
      const data = new FormData();
      Object.keys(safeFormData).forEach((key) => {
        data.append(key, safeFormData[key]);
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
          className="card shadow-sm border-0 p-4"
          onSubmit={handleSubmit}
        >

          {/* Name */}
          <div className="mb-3">
            <label className="form-label-light fw-semibold">Product Name</label>
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
            <label className="form-label-light fw-semibold">Description</label>
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
              <label className="form-label-light fw-semibold">Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                min={1}
                step="any"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label-light fw-semibold">Sell Price</label>
              <input
                type="number"
                name="sellPrice"
                className="form-control"
                min={0}
                max={formData.price ? formData.price - 1 : undefined}
                step="any"
                value={formData.sellPrice}
                onChange={handleChange}
                
                placeholder="Enter sell price (less than price)"
              />
              {formData.sellPrice !== "" && Number(formData.sellPrice) >= Number(formData.price) && (
                <div className="text-danger small mt-1">
                  Sell price must be less than original price.
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label-light fw-semibold">Stock</label>
              <input
                type="number"
                name="countInStock"
                className="form-control"
                min={1}
                step="1"
                value={formData.countInStock}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="form-label-light fw-semibold">Product Image</label>

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

          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label-light fw-semibold">Role</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="author">Author</option>
              <option value="user">User</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 py-2 "
            disabled={loading}
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>

        </form>
      </div>
    </div>
  );
}