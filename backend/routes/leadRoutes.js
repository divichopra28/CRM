const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");

// All lead routes require authentication
router.use(auth);

// GET /api/leads — list all leads (optional ?status= filter)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leads/:id — get single lead
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leads — create a new lead
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const lead = await Lead.create({ name, email, phone, company, message });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/leads/:id — update lead fields / status
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, company, message, status } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, message, status },
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leads/:id/followup — add a follow-up note
router.post("/:id/followup", async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ error: "Note is required" });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    lead.followUps.push({ note });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/leads/:id — delete a lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
