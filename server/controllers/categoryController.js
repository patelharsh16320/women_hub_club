const Category = require("../models/Category");
const { ensureGeneralCategory, setDefaultParent, isGeneralCategory } = require("../utils/categoryGeneral");

/* CREATE CATEGORY */
exports.createCategory = async (req, res) => {
  try {
    // Ensure 'General' exists
    const general = await ensureGeneralCategory();
    // Accept name and optional parent
  let { name, parent } = req.body || {};
  // Accept parent as array or single value
  if (!parent) parent = [general._id];
  if (!Array.isArray(parent)) parent = [parent];
  const category = await Category.create({ name, parent });
  // Populate parent names for client convenience
  await category.populate("parent", "name");
  res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL CATEGORIES
   - If query param `parent` is provided, return only categories with that parent
   - Otherwise return full flat list with parent populated
   - Ensures 'General' exists and is default parent
*/
exports.getCategories = async (req, res) => {
  try {
    const general = await ensureGeneralCategory();
    await setDefaultParent(general._id);
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
  // Find children: any category where parent array contains this id
  const children = await Category.find({ parent: category._id }).lean();
  res.json({ ...category, children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE CATEGORY */
exports.updateCategory = async (req, res) => {
  try {
    let { name, parent } = req.body || {};
    // Accept parent as array or single value
    if (parent && !Array.isArray(parent)) parent = [parent];
    // Prevent category being its own parent
    if (parent && parent.includes(req.params.id)) {
      return res.status(400).json({ message: "Category cannot be its own parent" });
    }
    const update = { name };
    if (parent) update.parent = parent;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      update,
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
    // Prevent deletion of 'General' parent category
    if (await isGeneralCategory(id)) {
      return res.status(400).json({ message: "Cannot delete the 'General' parent category" });
    }
    // Cascade delete: remove the category and all its descendant subcategories
    const toDelete = [id];
    // find descendants iteratively (BFS)
    for (let i = 0; i < toDelete.length; i++) {
      const parentId = toDelete[i];
      // Find children where parent array contains this id
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
