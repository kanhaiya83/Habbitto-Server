
const express = require("express");


const verifyJWT = require("../middlewares/verifyJWT");
//mongoose task models
const { HabitModel } = require("../config/database");


const app = express();

app.use(express.json());

const router = express.Router();

router.get("/habits", verifyJWT, async (req, res) => {
  try {
    const habits = await HabitModel.find({ userId: req.userId });
    return res.send({ habits: habits, success: true ,username:req.username});
  } catch (e) {
    res
      .status(500)
      .send({
        error: e,
        message: "Some error occurred while fetching data!!",
        success: false,
      });
  }
});

router.post("/habits", verifyJWT, async (req, res) => {
  habitData=req.body
  habitData.userId=req.userId
  const newHabit = new HabitModel(habitData);
  try {
    const savedHabit = await newHabit.save();
    
    return res.send({savedHabit});
  } catch (e) {
    console.log({ errror: e });
    return res
      .status(500)
      .send({
        error: e,
        message: "Some error occurred while saving!!",
        success: false,
      });
  }
});



router.patch("/habits/:id", verifyJWT, async (req, res) => {
  console.log({ toBePatched: req.body });
  try {
    const patchedHabit = await HabitModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    //if no task found to be patched,return 404
    if (!patchedHabit) {
      return res
        .status(404)
        .send({
          error: "Requested task not found",
          message: "Requested task not found",
          success: false,
        });
    }
    return res.send({ success: true, patchedHabit });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ error: e, message: "Some error occurred!!", success: false });
  }
});
router.delete("/habits/:id", verifyJWT, async (req, res) => {
  try {
    const deletedHabit = await HabitModel.findByIdAndRemove(
      req.params.id
    );
    //if no task found to be patched,return 404
    if (!deletedHabit) {
      return res
        .status(404)
        .send({
          error: "Requested task not found",
          message: "Requested task not found",
          success: false,
        });
    }
    return res.send({ success: true, deletedHabit });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ error: e, message: "Some error occurred!!", success: false });
  }
});

module.exports = router;
