import React, { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/categoryService";
import { toastMessage } from "@/utils/toastMessage";

export default function ChildCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [parents, setParents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editParents, setEditParents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const load = async () => {
    setLoading(true);
    const data = await getCategories();
    setAllCategories(Array.isArray(data) ? data : data.categories || []);
    // Do not filter out categories with 'General' as parent; show all child categories
    setCategories((Array.isArray(data) ? data : data.categories || []).filter(
      (cat) => Array.isArray(cat.parent) && cat.parent.length > 0
    ));
    setSelected([]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toastMessage.error("Name required");
    let usedParents = parents;
    // If no parent selected, assign 'General' as default
    if (!parents.length) {
      const generalCat = allCategories.find(cat => cat.name === "General");
      if (generalCat) usedParents = [generalCat._id];
    }
    if (!usedParents.length) return toastMessage.error("No parent category found");
    // Allow same name if parents are different
    const normalizedName = name.trim().toLowerCase();
    const parentsSet = new Set(usedParents);
    const exists = categories.some(cat => {
      if (cat.name.trim().toLowerCase() !== normalizedName) return false;
      // Compare parent sets
      const catParentIds = (cat.parent || []).map(p => typeof p === 'string' ? p : p?._id).filter(Boolean);
      if (catParentIds.length !== usedParents.length) return false;
      return catParentIds.every(pid => parentsSet.has(pid));
    });
    if (exists) {
      toastMessage.error("Category with this name and parent(s) already exists");
      return;
    }
    await createCategory(name, usedParents);
    setName("");
    setParents([]);
    toastMessage.success("Created");
    load();
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditParents(cat.parent.map(p => p?._id).filter(Boolean));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let usedParents = editParents;
    if (!editParents.length) {
      const generalCat = allCategories.find(cat => cat.name === "General");
      if (generalCat) usedParents = [generalCat._id];
    }
    await updateCategory(editId, editName, usedParents);
    setEditId(null);
    setEditName("");
    setEditParents([]);
    toastMessage.success("Updated");
    load();
  };

  const handleDelete = async (id) => {
    // Prevent deleting 'General' category
    const generalCat = allCategories.find(cat => cat.name === "General");
    if (generalCat && id === generalCat._id) {
      toastMessage.error("Cannot delete the default 'General' category");
      return;
    }
    if (!window.confirm("Delete this child category?")) return;
    await deleteCategory(id);
    toastMessage.success("Deleted");
    load();
  };

  const handleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return toastMessage.error("Select categories to delete");
    if (!window.confirm(`Delete ${selected.length} selected categories?`)) return;
    for (const id of selected) {
      await deleteCategory(id);
    }
    toastMessage.success("Deleted selected categories");
    load();
  };

  // Pagination logic
  // Group categories by name, merging parent names
  const groupedCategories = Object.values(
    categories.reduce((acc, cat) => {
      const key = cat.name.trim().toLowerCase();
      if (!acc[key]) {
        acc[key] = { ...cat, parentNames: new Set((cat.parent || []).map(p => p?.name).filter(Boolean)), ids: [cat._id], parents: [...(cat.parent || [])] };
      } else {
        (cat.parent || []).forEach(p => p?.name && acc[key].parentNames.add(p.name));
        acc[key].ids.push(cat._id);
        acc[key].parents.push(...(cat.parent || []));
      }
      return acc;
    }, {})
  );
  const totalPages = Math.ceil(groupedCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = groupedCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div>
      <form onSubmit={handleCreate} className="mb-3 d-flex gap-2 align-items-center">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New child category" className="form-control" />
        <select multiple value={parents} onChange={e => setParents(Array.from(e.target.selectedOptions, o => o.value))} className="form-select" style={{maxWidth: 250}}>
          {allCategories.filter(c => !c.parent || c.parent.length === 0 || (Array.isArray(c.parent) && c.parent.some(p => p && p.name === "General")) ).map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
              {cat.name === "General" ? " (default)" : ""}
            </option>
          ))}
        </select>
        <button className="btn btn-primary">Add</button>
      </form>
      {selected.length > 0 && (
        <button className="btn btn-danger mb-2" onClick={handleBulkDelete} type="button">
          Delete Selected ({selected.length})
        </button>
      )}
      {loading ? <p>Loading...</p> : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th style={{width:40}}></th>
                <th style={{width:60}}>No</th>
                <th>Name</th>
                <th>Parents</th>
                <th style={{width:180}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((cat, idx) => (
                <tr key={cat.name}>
                  <td>
                    {/* Checkbox selects all merged categories */}
                    <input
                      type="checkbox"
                      checked={cat.ids.every(id => selected.includes(id))}
                      onChange={() => {
                        // Toggle all ids for this name
                        const allSelected = cat.ids.every(id => selected.includes(id));
                        setSelected(prev =>
                          allSelected
                            ? prev.filter(id => !cat.ids.includes(id))
                            : Array.from(new Set([...prev, ...cat.ids]))
                        );
                      }}
                      className="form-check-input"
                    />
                  </td>
                  <td>{startIndex + idx + 1}</td>
                  <td>
                    {/* Only allow editing the first id in the group */}
                    {editId && cat.ids.includes(editId) ? (
                      <form onSubmit={handleUpdate} className="d-flex gap-2 align-items-center">
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="form-control" />
                        <select multiple value={editParents} onChange={e => setEditParents(Array.from(e.target.selectedOptions, o => o.value))} className="form-select" style={{maxWidth: 250}}>
                          {allCategories.filter(c => !c.parent || c.parent.length === 0 || (Array.isArray(c.parent) && c.parent.some(p => p && p.name === "General")) ).map(cat => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                              {cat.name === "General" ? " (default)" : ""}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-success btn-sm">Save</button>
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditId(null)}>Cancel</button>
                      </form>
                    ) : (
                      <span>{cat.name}</span>
                    )}
                  </td>
                  <td>
                    {[...cat.parentNames].join(", ")}
                  </td>
                  <td>
                    {/* Edit/delete only the first id in the group */}
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleEdit({ ...cat, _id: cat.ids[0], parent: cat.parents })}>Edit</button>
                    {/* Prevent delete for 'General' */}
                    {(() => {
                      const generalCat = allCategories.find(c => c.name === "General");
                      if (generalCat && cat.ids[0] === generalCat._id) {
                        return <span className="text-muted" style={{fontSize:'13px'}}>default</span>;
                      }
                      return <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.ids[0])}>Delete</button>;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
              <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                Showing <strong>{startIndex + 1}</strong>–<strong>{Math.min(startIndex + ITEMS_PER_PAGE, categories.length)}</strong> of <strong>{categories.length}</strong> categories
              </p>
              <ul className="pagination pagination-sm mb-0">
                {/* Prev */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
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
                    <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                  )
                )}
                {/* Next */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
