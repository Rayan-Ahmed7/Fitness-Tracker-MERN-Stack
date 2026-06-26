const Nutrition = require("../models/Nutrition");

// @desc    Add a meal log
const addMeal = async (req, res) => {
    try {
        const { foodItem, mealType, quantity, calories, protein, carbs, fats } = req.body;

        if (!foodItem || !mealType || !quantity || !calories) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const meal = await Nutrition.create({
            user: req.user.id,
            foodItem,
            mealType,
            quantity,
            calories: Number(calories),
            protein: Number(protein || 0),
            carbs: Number(carbs || 0),
            fats: Number(fats || 0)
        });

        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's meal logs
const getMeals = async (req, res) => {
    try {
        const meals = await Nutrition.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a meal log
const deleteMeal = async (req, res) => {
    try {
        const meal = await Nutrition.findById(req.params.id);
        if (!meal) return res.status(404).json({ message: "Meal log not found" });

        if (meal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await Nutrition.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Meal log removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a meal log
const updateMeal = async (req, res) => {
    try {
        const { foodItem, mealType, quantity, calories } = req.body;
        const meal = await Nutrition.findById(req.params.id);

        if (!meal) {
            return res.status(404).json({ message: "Meal log not found" });
        }

        // Check if the meal belongs to the logged-in user
        if (meal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // Fields ko update karna
        meal.foodItem = foodItem || meal.foodItem;
        meal.mealType = mealType || meal.mealType;
        meal.quantity = quantity || meal.quantity;
        meal.calories = calories !== undefined ? Number(calories) : meal.calories;

        const updatedMeal = await meal.save();
        res.status(200).json(updatedMeal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// module.exports me updateMeal ko bhi add kar lena:
module.exports = { addMeal, getMeals, deleteMeal, updateMeal };