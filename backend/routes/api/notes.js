const express = require("express");
const asyncHandler = require("express-async-handler");
const { Note } = require("../../db/models");

const router = express.Router();
console.log("hit");
router.post(
  "/",
  asyncHandler(async function (req, res) {
    const { title, content, user_id } = req.body;
    const note = await Note.create({
      user_id,
      content,
      title,
    });
    console.log(res.status());
    return res.redirect("https://sequelize.org/v5/manual/data-types.html");
  })
);

module.exports = router;
