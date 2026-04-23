// Script to ensure 'General' parent category exists, is default, and cannot be deleted
const mongoose = require("mongoose");
const Category = require("../models/Category");

const ensureGeneralCategory = async () => {
  let general = await Category.findOne({ name: "General", parent: null });
  if (!general) {
    general = await Category.create({ name: "General", parent: null });
    console.log("Created 'General' parent category");
  } else {
    console.log("'General' parent category already exists");
  }
  return general;
};

// Set all categories with no parent to have 'General' as parent (except 'General' itself)
const setDefaultParent = async (generalId) => {
  await Category.updateMany(
    { parent: null, name: { $ne: "General" } },
    { $set: { parent: generalId } }
  );
  console.log("Set 'General' as parent for all top-level categories except itself");
};

// Prevent deletion of 'General' category (to be used in controller)
const isGeneralCategory = async (id) => {
  const cat = await Category.findById(id);
  return cat && cat.name === "General" && !cat.parent;
};

module.exports = { ensureGeneralCategory, setDefaultParent, isGeneralCategory };