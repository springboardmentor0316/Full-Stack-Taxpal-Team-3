const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const {
  getCategories,
  addCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", verifyToken, getCategories);
router.post("/", verifyToken, addCategory);
router.delete("/:id", verifyToken, deleteCategory);

module.exports = router;
