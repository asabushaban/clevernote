const express = require("express");
const asyncHandler = require("express-async-handler");
const { Notebook } = require("../../db/models");

const router = express.Router();

router.post(
  "/",
  asyncHandler(async function (req, res) {
    const { name, userId } = req.body;
    const notebook = await Notebook.create({
      userId,
      name,
    });
    return res.json(notebook);
  })
);

// router.get(
//   "/:id",
//   asyncHandler(async function (req, res) {
//     const notes = await Notebook.findAll({
//       where: {
//         userId: req.params.id,
//       },
//     });
//     return res.json(notes);
//   })
// );

// router.put(
//   "/edit/:id",
//   asyncHandler(async function (req, res) {
//     const { content, title } = req.body;
//     const values = { title: title, content: content };
//     const options = { multi: true };
//     const condition = { where: { id: req.params.id } };
//     const note = await Note.update(values, condition, options);
//     return res.json(note);
//   })
// );

// router.delete(
//   "/:id",
//   asyncHandler(async function (req, res) {
//     const condition = { where: { id: req.params.id } };
//     const note = await Note.destroy(condition);
//     return res.json(note);
//   })
// );

module.exports = router;
