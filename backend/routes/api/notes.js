const express = require("express");
const asyncHandler = require("express-async-handler");
const { Note } = require("../../db/models");

const router = express.Router();

router.post(
  "/",
  asyncHandler(async function (req, res) {
    const { title, content, user_id } = req.body;
    const note = await Note.create({
      user_id,
      content,
      title,
    });
    return res.json(note);
  })
);

router.get(
  "/:id",
  asyncHandler(async function (req, res) {
    const notes = await Note.findAll({
      where: {
        user_id: req.params.id,
      },
    });
    return res.json(notes);
  })
);

module.exports = router;
