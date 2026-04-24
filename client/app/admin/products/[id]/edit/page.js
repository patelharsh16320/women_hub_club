"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAPI } from "../../../../../services/api";
import { getCategories } from "@/services/categoryService";

export default function EditProductPage() {
  const p = useParams();
  const id = p?.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [parents, setParents] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Missing product id in route");
        return;
      }
      try {
        setLoading(true);
        // log the full URL we're requesting for easier debugging
        console.log("Fetching product:", process.env.NEXT_PUBLIC_API_URL, `/products/${id}`);
        const [p, cats] = await Promise.all([
          fetchAPI(`/products/${id}`),
          getCategories()
        ]);
        if (!p) {
          throw new Error("Product not found");
        }
        setProduct(p);
        const allCats = Array.isArray(cats) ? cats : cats.categories || [];
        setCategories(allCats);
        const top = allCats.filter((c) => !c.parent);
        setParents(top);
        // Determine selected parent & subcategory based on product.category
        try {
          const prodCat = p?.category;
          // find matching category by id or name
          const matched = allCats.find(
            (c) => c._id === prodCat || c._id === (prodCat?._id) || c.name === prodCat
          );
          if (matched) {
            if (matched.parent) {
              const parentId = matched.parent._id || matched.parent;
              setSubcategories(allCats.filter((c) => (c.parent && (c.parent._id === parentId || c.parent === parentId))));
              setProduct((prev) => ({ ...prev, parentCategory: parentId, category: matched._id }));
            } else {
              // product's category is a parent category
              setSubcategories(allCats.filter((c) => (c.parent && (c.parent._id === matched._id || c.parent === matched._id))));
              setProduct((prev) => ({ ...prev, parentCategory: matched._id, category: prev.category }));
            }
          } else {
            // no match, leave as-is
          }
        } catch (e) {}
        // set preview to resolved image url for current product
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
          const apiOrigin = (apiBase || "").replace(/\/?api\/?$/i, "");
          const img = p?.image || "";
          if (img.startsWith("/uploads") || img.startsWith("uploads")) {
            setPreviewUrl(img.startsWith("/") ? `${apiOrigin}${img}` : `${apiOrigin}/${img}`);
          } else {
            setPreviewUrl(img);
          }
        } catch (e) {}
      } catch (err) {
        console.error("Load product error:", err);
        setError(err?.message || String(err));
        alert("Failed to load product: " + (err?.message || "Unknown error"));
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // server expects POST for update in routes
      if (selectedFile) {
        const fd = new FormData();
        fd.append("name", product.name);
        fd.append("description", product.description || "");
        fd.append("price", product.price);
        fd.append("category", product.category || "");
        fd.append("countInStock", product.countInStock || 0);
        fd.append("image", selectedFile);

        await fetchAPI(`/products/${id}`, {
          method: "POST",
          body: fd,
        });
      } else {
        await fetchAPI(`/products/${id}`, {
          method: "POST",
          body: JSON.stringify({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            countInStock: product.countInStock,
          }),
        });
      }
      router.push("/admin/products/manage");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed: " + (err?.message || "Unknown error"));
    } finally { setLoading(false); }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return (
    <div className="container py-5">
      <h2 className="text-center text-danger">Error loading product</h2>
      <p className="text-center">{error}</p>
    </div>
  );
  if (!product) return <p>Loading...</p>;

 return (
  <div className="edit-product-page container py-5">

    {/* Header */}
    <div className="bg-dark text-white p-3 rounded mb-4 d-flex justify-content-between align-items-center">
      <h4 className="mb-0">Edit Product</h4>
      <button
        className="btn btn-light btn-sm"
        onClick={() => router.push("/admin/products/manage")}
      >
        Back
      </button>
    </div>

    {/* Card */}
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">

        <form onSubmit={handleSubmit}>


          {/* Product Name */}
          <div className="mb-3">
            <label className=" fw-semibold text-light">Product Name</label>
            <input
              type="text"
              className="form-control"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
              required
            />
          </div>

          {/* Image */}
          <div className="mb-3">
            <label className=" fw-semibold text-light">Product Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                setSelectedFile(file || null);
                if (file) {
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />

            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="img-thumbnail"
                  style={{ maxHeight: 200 }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className=" fw-semibold text-light">Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          {/* Price, Sell Price, Category */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className=" fw-semibold text-light">Price</label>
              <input
                type="number"
                className="form-control"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                required
              />
            </div>

            {/* Sell Price */}
            <div className="col-md-4 mb-3">
              <label className=" fw-semibold text-light">Sell Price</label>
              <input
                type="number"
                className="form-control"
                value={product.sellPrice || ""}
                onChange={(e) =>
                  setProduct({ ...product, sellPrice: e.target.value })
                }
                min={0}
                max={product.price ? product.price - 1 : undefined}
                placeholder="Enter sell price (less than price)"
              />
              {product.sellPrice !== undefined && product.sellPrice !== "" && Number(product.sellPrice) >= Number(product.price) && (
                <div className="text-danger small mt-1">
                  Sell price must be less than original price.
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className=" fw-semibold text-light">Category</label>
              <select
                className="form-select"
                value={product.category || ""}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
              >
                <option value="">Select Category (optional)</option>
                {/* Group categories: parents first, then children indented */}
                {categories
                  .filter(cat => !cat.parent || (Array.isArray(cat.parent) && cat.parent.length === 0) || (Array.isArray(cat.parent) && cat.parent.some(p => p && p.name === "General")) || (cat.parent && cat.parent.name === "General"))
                  .map(parent => [
                    <option key={parent._id} value={parent._id}>{parent.name}</option>,
                    ...categories
                      .filter(child => {
                        if (Array.isArray(child.parent)) return child.parent.some(p => p && p._id === parent._id);
                        return child.parent && child.parent._id === parent._id;
                      })
                      .map(child => (
                        <option key={child._id} value={child._id}>&nbsp;&nbsp;&nbsp;↳ {child.name}</option>
                      ))
                  ])}
              </select>
            </div>
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label className=" fw-semibold text-light">Stock</label>
            <input
              type="number"
              className="form-control"
              value={product.countInStock}
              onChange={(e) =>
                setProduct({ ...product, countInStock: e.target.value })
              }
            />
          </div>

          {/* Submit */}
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-dark"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>

        </form>

      </div>
    </div>
  </div>
);
}
