const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    foodItem: { // Food Name (e.g., Oats, Chicken Rice)
        type: String,
        required: true
    },
    mealType: { // Meal Type
        type: String,
        required: true,
        enum: ["Breakfast", "Lunch", "Dinner", "Snacks"]
    },
    quantity: { // e.g., 200g, 2 eggs
        type: String,
        required: true
    },
    calories: { // Total Calories
        type: Number,
        required: true
    },
    protein: { // Macros - Protein
        type: Number,
        default: 0
    },
    carbs: { // Macros - Carbs
        type: Number,
        default: 0
    },
    fats: { // Macros - Fats
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Nutrition", nutritionSchema);