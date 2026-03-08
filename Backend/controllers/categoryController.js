const Category = require("../models/Category");

// GET categories by type
exports.getCategories = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = {
      userId: req.user.userId,
    };

    if (type) filter.type = type;

    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// ADD category
exports.addCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type required" });
    }

    const exists = await Category.findOne({
      userId: req.user.userId,
      name,
      type,
    });

    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      userId: req.user.userId,
      name,
      type,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to add category" });
  }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category" });
  }
};
