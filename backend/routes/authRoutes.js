const express = require("express");
const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  res.json({ success: true, token: password });
});

module.exports = router;
