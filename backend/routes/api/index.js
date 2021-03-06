const router = require("express").Router();

const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const notesRouter = require("./notes.js");
const notebooksRouter = require("./notebooks");

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/note", notesRouter);

router.use("/notebook", notebooksRouter);

module.exports = router;

// const asyncHandler = require("express-async-handler");
// const { setTokenCookie } = require("../../utils/auth.js");
// const { User } = require("../../db/models");

// router.post("/test", function (req, res) {
//   res.json({ requestBody: req.body });
// });

// router.get(
//   "/set-token-cookie",
//   asyncHandler(async (req, res) => {
//     const user = await User.findOne({
//       where: {
//         username: "Demo-lition",
//       },
//     });
//     setTokenCookie(res, user);
//     return res.json({ user });
//   })
// );

// // GET /api/restore-user
// const { restoreUser } = require("../../utils/auth.js");
// router.get("/restore-user", restoreUser, (req, res) => {
//   return res.json(req.user);
// });

// const { requireAuth } = require("../../utils/auth.js");
// router.get("/require-auth", requireAuth, (req, res) => {
//   return res.json(req.user);
// });
