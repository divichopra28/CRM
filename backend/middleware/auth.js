module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized — no token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized — invalid token" });
  }

  next();
};
