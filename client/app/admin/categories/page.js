"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "../../../services/api";
import { toastMessage } from "../../../utils/toastMessage";

const ITEMS_PER_PAGE = 10;

export default function CategoriesPage() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI("/categories");
      // data is flat list with parent populated
      setCats(data || []);
    } catch (err) {
      toastMessage.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    toastMessage.info("Delete this category?");
    if (!window.confirm("Delete this category?")) return;

    try {
      await fetchAPI(`/categories/${id}`, { method: "DELETE" });
      setCats((s) => {
        const updated = s.filter((c) => c._id !== id);
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

  // Build a map of parentId -> unique children
  const parentToChildren = {};
  cats.forEach(cat => {
    if (Array.isArray(cat.parent)) {
      cat.parent.forEach(p => {
        if (p && p._id) {
          if (!parentToChildren[p._id]) parentToChildren[p._id] = new Map();
          parentToChildren[p._id].set(cat._id, cat);
        }
      });
    } else if (cat.parent && cat.parent._id) {
      if (!parentToChildren[cat.parent._id]) parentToChildren[cat.parent._id] = new Map();
      parentToChildren[cat.parent._id].set(cat._id, cat);
    }
  });

  // Filter parent categories (no parent or parent is 'General'), remove duplicates by _id
  const parentSeen = new Set();
  const parentCategories = cats.filter(cat => {
    if (parentSeen.has(cat._id)) return false;
    if (!cat.parent || (Array.isArray(cat.parent) && cat.parent.length === 0)) {
      parentSeen.add(cat._id);
      return true;
    }
    if (Array.isArray(cat.parent) && cat.parent.some(p => p && p.name === "General")) {
      parentSeen.add(cat._id);
      return true;
    }
    if (cat.parent && cat.parent.name === "General") {
      parentSeen.add(cat._id);
      return true;
    }
    return false;
  });

  // Filter child categories (has parent, and parent is not only 'General'), remove duplicates by _id
  const childSeen = new Set();
  const childCategories = cats.filter(cat => {
    if (childSeen.has(cat._id)) return false;
    if (Array.isArray(cat.parent) && cat.parent.length > 0 && !cat.parent.some(p => p && p.name === "General")) {
      childSeen.add(cat._id);
      return true;
    }
    if (cat.parent && cat.parent.name !== "General") {
      childSeen.add(cat._id);
      return true;
    }
    return false;
  });

  // Pagination for parent categories only
  const totalPages = Math.ceil(parentCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedParents = parentCategories.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
    <div className="admin-categories">
      {/* Dark Header */}
      <div className="admin-header">
        <h4 className="mb-0">Categories</h4>
      </div>

      <div className="container py-4">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Manage Categories</h3>
            <p className="text-muted mb-0">
              Total Parent Categories: <strong>{parentCategories.length}</strong> &nbsp;|&nbsp; Total Child Categories: <strong>{childCategories.length}</strong>
            </p>
          </div>

          <Link
            href="/admin/categories/parent"
            className="btn btn-dark create-btn"
          >
            + Create Parent Category
          </Link>
          <Link
            href="/admin/categories/child"
            className="btn btn-dark create-btn"
          >
            + Create Child Category
          </Link>
        </div>

        {loading && <p>Loading categories...</p>}

        {/* Table Card */}
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "80px" }}>#</th>
                  <th>Name</th>
                  </tr>
              </thead>

              <tbody>
                {paginatedParents.map((parent, index) => [
                  <tr key={parent._id} style={{ background: '#f8f9fa' }}>
                    <td className="fw-semibold">{startIndex + index + 1}</td>
                    <td className="fw-medium">{parent.name}</td>
                  </tr>,
                  ...((parentToChildren[parent._id] ? Array.from(parentToChildren[parent._id].values()) : []).map(child => (
                    <tr key={child._id}>
                      <td></td>
                      <td style={{ paddingLeft: 32 }}>&#8627; {child.name}</td>
                    </tr>
                  )))
                ])}

                {!loading && parentCategories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
              <p className=" mb-0 text-light" style={{ fontSize: "14px" }}>
                Showing <strong>{startIndex + 1}</strong>–
                <strong>{Math.min(endIndex, cats.length)}</strong> of{" "}
                <strong>{cats.length}</strong> categories
              </p>

              <nav>
                <ul className="pagination pagination-sm mb-0">
                  {/* Previous */}
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
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
                          style={
                            currentPage === page
                              ? {
                                  backgroundColor: "#212529",
                                  borderColor: "#212529",
                                }
                              : {}
                          }
                        >
                          {page}
                        </button>
                      </li>
                    ),
                  )}

                  {/* Next */}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
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
    </div>
  );
}
