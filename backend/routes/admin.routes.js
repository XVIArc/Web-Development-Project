const express = require("express");
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestion,
  bulkImport,
} = require("../controllers/admin.controller");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.use(auth, admin); // all admin routes require auth + admin role

router.get("/questions", getQuestions);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);
router.patch("/questions/:id/toggle", toggleQuestion);
router.post("/questions/bulk", bulkImport);

module.exports = router;
