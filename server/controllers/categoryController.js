const Category = require("../models/Category");

/* CREATE CATEGORY */
exports.createCategory = async (req, res) => {
  try {
    // Accept name and optional parent
    const { name, parent } = req.body || {};
    const category = await Category.create({ name, parent: parent || null });
    // Populate parent name for client convenience
    await category.populate("parent", "name");
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL CATEGORIES
   - If query param `parent` is provided, return only categories with that parent
   - Otherwise return full flat list with parent populated
*/
exports.getCategories = async (req, res) => {
  try {
    const { parent } = req.query || {};
    let query = {};
    if (parent) query.parent = parent === "null" ? null : parent;
    const categories = await Category.find(query).populate("parent", "name").lean();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE CATEGORY + its children */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent", "name").lean();
    if (!category) return res.status(404).json({ message: "Category not found" });
    const children = await Category.find({ parent: category._id }).lean();
    res.json({ ...category, children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE CATEGORY */
exports.updateCategory = async (req, res) => {
  try {
    const { name, parent } = req.body || {};
    // Prevent category being its own parent
    if (parent && parent === req.params.id) {
      return res.status(400).json({ message: "Category cannot be its own parent" });
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, parent: parent || null },
      { new: true }
    ).populate("parent", "name");
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE CATEGORY */
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    // Cascade delete: remove the category and all its descendant subcategories
    const toDelete = [id];
    // find descendants iteratively (BFS)
    for (let i = 0; i < toDelete.length; i++) {
      const parentId = toDelete[i];
      const children = await Category.find({ parent: parentId }).select("_id").lean();
      for (const c of children) {
        const cid = String(c._id);
        if (!toDelete.includes(cid)) toDelete.push(cid);
      }
    }

    await Category.deleteMany({ _id: { $in: toDelete } });
    res.json({ message: `Deleted ${toDelete.length} categories` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
