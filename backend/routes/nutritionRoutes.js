const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addMeal, getMeals, deleteMeal, updateMeal } = require("../controllers/nutritionController");

router.post("/", protect, addMeal);
router.get("/", protect, getMeals);
router.delete("/:id", protect, deleteMeal);
router.put("/:id", protect, updateMeal); // ➕ YE LINE ADD KARO

module.exports = router;