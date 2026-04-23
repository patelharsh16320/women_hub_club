"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "../../../../services/api";
import { getCategories } from "../../../../services/categoryService";
import { toastMessage } from "../../../../utils/toastMessage";

const ITEMS_PER_PAGE = 10;

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);


  const load = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchAPI("/products"),
        getCategories()
      ]);
      setProducts(productsData || []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
    } catch (err) {
      console.error(err);
      toastMessage.error("Failed to load products or categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
  toastMessage.info("Delete this product?");
  if (!window.confirm("Delete this product?")) return;

    try {
      await fetchAPI(`/products/${id}`, { method: "DELETE" });
      setProducts((s) => {
        const updated = s.filter((p) => p._id !== id);
        // Adjust page if the current page becomes empty after deletion
        const totalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        return updated;
      });
    } catch (err) {
  toastMessage.error("Delete failed");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Build page number array with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="admin-products container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Manage Products</h3>
          <p className="text-muted mb-0">
            Total Products : <strong>{products.length}</strong>
          </p>
        </div>

        <Link href="/admin/products/create" className="btn btn-dark px-4">
          + Create Product
        </Link>

      </div>

      {loading && <p>Loading products...</p>}

      {/* Product Table */}
      <div className="card border-0 shadow-sm">

        <div className="table-responsive">

          <table className="table align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>Name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Category</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {paginatedProducts.map((p, index) => {

                const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
                const apiOrigin = (apiBase || "").replace(/\/?api\/?$/i, "");

                let imgSrc = p.image || "";
                if (imgSrc.startsWith("/uploads")) imgSrc = `${apiOrigin}${imgSrc}`;
                if (imgSrc.startsWith("uploads")) imgSrc = `${apiOrigin}/${imgSrc}`;

                // Global index across all pages
                const globalIndex = startIndex + index + 1;

                // Handle category and parent display for both string and object
                let categoryName = "";
                let parentNames = [];
                if (typeof p.category === "object" && p.category !== null) {
                  categoryName = p.category.name || "";
                  if (Array.isArray(p.category.parent)) {
                    parentNames = p.category.parent.map(parent => parent && parent.name ? parent.name : "").filter(Boolean);
                  }
                } else {
                  categoryName = p.category || "";
                }

                return (
                  <tr key={p._id}>
                    <td className="fw-semibold">{globalIndex}</td>
                    <td className="fw-medium">{p.name}</td>
                    <td>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={p.name}
                          className="product-thumb"
                        />
                      ) : (
                        <span className="text-muted">No image</span>
                      )}
                    </td>
                    <td className="fw-semibold">₹ {p.price}</td>
                    <td>
                      <span className="badge bg-dark">
                        {categoryName}
                        {parentNames.length > 0 && (
                          <span className="badge bg-secondary ms-2">
                            Parent{parentNames.length > 1 ? 's' : ''}: {parentNames.join(", ")}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="btn btn-sm btn-outline-dark me-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                );
              })}

              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No products available
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">

            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              Showing <strong>{startIndex + 1}</strong>–<strong>{Math.min(endIndex, products.length)}</strong> of <strong>{products.length}</strong> products
            </p>

            <nav>
              <ul className="pagination pagination-sm mb-0">

                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </button>
                </li>

                {/* Page Numbers */}
                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <li key={`ellipsis-${i}`} className="page-item disabled">
                      <span className="page-link">…</span>
                    </li>
                  ) : (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                        style={currentPage === page ? { backgroundColor: "#212529", borderColor: "#212529" } : {}}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &raquo;
                  </button>
                </li>

              </ul>
            </nav>

          </div>
        )}

      </div>
    </div>
  );
}