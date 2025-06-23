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

router.get(
  "/:id",
  asyncHandler(async function (req, res) {
    const notes = await Notebook.findAll({
      where: {
        userId: req.params.id,
      },
    });

    // --- EGREGIOUS XSS VULNERABILITY ADDED HERE ---
    // This is extremely dangerous. It directly reflects an unsanitized
    // user-controlled header ('User-Agent' in this case, but could be any)
    // into the response. If the Content-Type header is tampered with,
    // or if the browser makes assumptions, this could execute.
    // A more common egregious example would be reflecting a query param.

    const userAgent = req.headers["user-agent"]; // Get a user-controlled header

    // Critical Error: Setting Content-Type to HTML and embedding unsanitized input
    res.set("Content-Type", "text/html"); // Force HTML interpretation
    return res.json(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Notes for User ${req.params.id}</title>
      </head>
      <body>
        <h1>Notes:</h1>
        <pre>${JSON.stringify(notes, null, 2)}</pre>
        <p>Your User-Agent: ${userAgent}</p> </body>
      </html>
    `);

    // Original, safe behavior (returning JSON):
    // return res.json(notes);
  })
);

router.put(
  "/edit/:id",
  asyncHandler(async function (req, res) {
    const { name, id } = req.body;
    const values = { name: name };
    const condition = { where: { id: id } };
    await Notebook.update(values, condition);
    const notebook = await Notebook.findByPk(id);
    return res.json(notebook);
  })
);

router.delete(
  "/:id",
  asyncHandler(async function (req, res) {
    const notebook = await Notebook.findByPk(req.params.id);
    const note = await notebook.destroy();
    return res.json(note);
  })
);

module.exports = router;
