
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
    return res.send({ habits: habits, success: true });
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

router.post("/addhabit", verifyJWT, async (req, res) => {
  habitData=req.body
  habitData.userId=req.userId
  const newHabit = new HabitModel(habitData);
  try {
    const savedHabit = await newHabit.save();
   
    return res.send({ savedHabit, success: true });
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
// router.delete("/tasks/:id", async (req, res) => {
//   try {
//     const deleted = await taskModel.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).send("Requested task not found");
//     }
//     res.send({ deleted, success: true });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .send({ error: e, message: "Some error occurred!!", success: false });
//   }
// });

// router.patch("/tasks/:id", fetchUser, async (req, res) => {
//   console.log({ toBePatched: req.body });
//   try {
//     const toBePatched = await taskModel.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     );
//     //if no task found to be patched,return 404
//     if (!toBePatched) {
//       return res
//         .status(404)
//         .send({
//           error: "Requested task not found",
//           message: "Requested task not found",
//           success: false,
//         });
//     }
//     res.send({ success: true, toBePatched });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .send({ error: e, message: "Some error occurred!!", success: false });
//   }
// });

module.exports = router;
