const Workout = require("../models/Workout");

const addWorkout = async (req, res) => {

    try {

        const {
            exercise,
            sets,
            reps,
            duration
        } = req.body;

        const workout = await Workout.create({
            user: req.user.id,
            exercise,
            sets,
            reps,
            duration
        });

        res.status(201).json(workout);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getWorkouts = async (req, res) => {

    try {

        const workouts = await Workout.find({
            user: req.user.id
        });

        res.status(200).json(workouts);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const updateWorkout = async (req, res) => {

    try {

        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                message: "Workout not found"
            });
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedWorkout);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteWorkout = async (req, res) => {

    try {

        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                message: "Workout not found"
            });
        }

        await Workout.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Workout Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {
    addWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout
};