const asyncHandler = require("express-async-handler");

const Goal = require("../model/goalModel");
const User = require("../model/userModel");
// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  return res.status(200).json(goals);
});
// @desc Set goal
// @route POST /api/goals
// @access Private

const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }

  const goal = await Goal.create({
    user: req.user.id,
    text: req.body.text,
  });
  res.status(200).json(goal);
});

// @desc Get goals
// @route PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
  let dbUser;

  const goal = Goal.findById(req.params.id, function (err, goal) {
    if (err) {
      console.log(err);
    }
    dbUser = goal.user.toString();
  });
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  const user = await User.findById(req.user.id);
  //Check if user exist
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches goal user
  if (dbUser !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.status(200).json(updatedGoal);
});

// @desc Get goals
// @route GET /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
  let dbUser;

  const goal = Goal.findById(req.params.id, function (err, goal) {
    if (err) {
      console.log(err);
    }
    dbUser = goal.user.toString();
  });

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  const user = await User.findById(req.user.id);
  //Check if user exist
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // console.log(goal);
  // Make sure the logged in user matches goal user

  if (dbUser !== user.id) {
    res.status(401);
    throw new Error("cant delete");
  }

  await Goal.findByIdAndDelete(req.params.id);
  return res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
