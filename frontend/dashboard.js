const API_BASE = "/api";
const token = localStorage.getItem("crm_token");

// ─── Auth Guard ──────────────────────────────────
if (!token) {
  window.location.href = "login.html";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─── State ───────────────────────────────────────
let allLeads = [];
let currentFilter = "";
let currentDetailId = null;

// ─── DOM Elements ────────────────────────────────
const leadsBody = document.getElementById("leadsBody");
const emptyState = document.getElementById("emptyState");
const leadModal = document.getElementById("leadModal");
const detailModal = document.getElementById("detailModal");
const leadForm = document.getElementById("leadForm");
const modalTitle = document.getElementById("modalTitle");
const statusGroup = document.getElementById("statusGroup");

// ─── Init ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  fetchLeads();
  bindEvents();
});

// ─── Fetch Leads ─────────────────────────────────
async function fetchLeads() {
  try {
    const res = await fetch(`${API_BASE}/leads`, { headers: authHeaders() });
    if (res.status === 401) {
      localStorage.removeItem("crm_token");
      window.location.href = "login.html";
      return;
    }
    allLeads = await res.json();
    renderStats();
    renderLeads();
  } catch (err) {
    console.error("Failed to fetch leads:", err);
  }
}

// ─── Render Stats ────────────────────────────────
function renderStats() {
  document.getElementById("statTotal").textContent = allLeads.length;
  document.getElementById("statNew").textContent = allLeads.filter(
    (l) => l.status === "new"
  ).length;
  document.getElementById("statContacted").textContent = allLeads.filter(
    (l) => l.status === "contacted"
  ).length;
  document.getElementById("statConverted").textContent = allLeads.filter(
    (l) => l.status === "converted"
  ).length;
}

// ─── Render Leads Table ──────────────────────────
function renderLeads() {
  const filtered = currentFilter
    ? allLeads.filter((l) => l.status === currentFilter)
    : allLeads;

  if (filtered.length === 0) {
    leadsBody.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  leadsBody.innerHTML = filtered
    .map(
      (lead) => `
    <tr>
      <td><strong>${esc(lead.name)}</strong></td>
      <td>${esc(lead.email)}</td>
      <td>${esc(lead.phone || "—")}</td>
      <td>${esc(lead.company || "—")}</td>
      <td><span class="badge badge-${lead.status}">${lead.status}</span></td>
      <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="action-btn" title="View" onclick="viewLead('${lead._id}')">👁️</button>
        <button class="action-btn" title="Edit" onclick="editLead('${lead._id}')">✏️</button>
        <button class="action-btn delete" title="Delete" onclick="deleteLead('${lead._id}')">🗑️</button>
      </td>
    </tr>`
    )
    .join("");
}

// ─── Escape HTML ─────────────────────────────────
function esc(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ─── Bind Events ─────────────────────────────────
function bindEvents() {
  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("crm_token");
    window.location.href = "login.html";
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.status;
      renderLeads();
    });
  });

  // Add lead button
  document.getElementById("addLeadBtn").addEventListener("click", () => {
    openLeadModal();
  });

  // Cancel modal
  document.getElementById("cancelModal").addEventListener("click", closeLeadModal);

  // Close detail
  document.getElementById("closeDetail").addEventListener("click", () => {
    detailModal.classList.remove("active");
  });

  // Lead form submit
  leadForm.addEventListener("submit", handleLeadSubmit);

  // Follow-up add
  document.getElementById("addFollowupBtn").addEventListener("click", addFollowUp);

  // Close modals on overlay click
  leadModal.addEventListener("click", (e) => {
    if (e.target === leadModal) closeLeadModal();
  });
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) detailModal.classList.remove("active");
  });
}

// ─── Add / Edit Modal ────────────────────────────
function openLeadModal(lead = null) {
  leadForm.reset();
  document.getElementById("leadId").value = "";

  if (lead) {
    modalTitle.textContent = "Edit Lead";
    document.getElementById("leadId").value = lead._id;
    document.getElementById("leadName").value = lead.name;
    document.getElementById("leadEmail").value = lead.email;
    document.getElementById("leadPhone").value = lead.phone || "";
    document.getElementById("leadCompany").value = lead.company || "";
    document.getElementById("leadMessage").value = lead.message || "";
    document.getElementById("leadStatus").value = lead.status;
    statusGroup.style.display = "block";
  } else {
    modalTitle.textContent = "Add New Lead";
    statusGroup.style.display = "none";
  }

  leadModal.classList.add("active");
}

function closeLeadModal() {
  leadModal.classList.remove("active");
}

// ─── Submit Lead (Create / Update) ───────────────
async function handleLeadSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("leadId").value;
  const body = {
    name: document.getElementById("leadName").value.trim(),
    email: document.getElementById("leadEmail").value.trim(),
    phone: document.getElementById("leadPhone").value.trim(),
    company: document.getElementById("leadCompany").value.trim(),
    message: document.getElementById("leadMessage").value.trim(),
  };

  if (id) {
    body.status = document.getElementById("leadStatus").value;
  }

  try {
    const url = id ? `${API_BASE}/leads/${id}` : `${API_BASE}/leads`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (res.ok) {
      closeLeadModal();
      fetchLeads();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to save lead");
    }
  } catch (err) {
    alert("Failed to save lead. Check server connection.");
  }
}

// ─── Edit Lead ───────────────────────────────────
function editLead(id) {
  const lead = allLeads.find((l) => l._id === id);
  if (lead) openLeadModal(lead);
}

// ─── Delete Lead ─────────────────────────────────
async function deleteLead(id) {
  if (!confirm("Are you sure you want to delete this lead?")) return;

  try {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.ok) fetchLeads();
  } catch (err) {
    alert("Failed to delete lead");
  }
}

// ─── View Lead Detail ────────────────────────────
async function viewLead(id) {
  try {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      headers: authHeaders(),
    });
    const lead = await res.json();
    currentDetailId = id;

    document.getElementById("detailContent").innerHTML = `
      <div style="margin-bottom:6px"><strong>Name:</strong> ${esc(lead.name)}</div>
      <div style="margin-bottom:6px"><strong>Email:</strong> ${esc(lead.email)}</div>
      <div style="margin-bottom:6px"><strong>Phone:</strong> ${esc(lead.phone || "—")}</div>
      <div style="margin-bottom:6px"><strong>Company:</strong> ${esc(lead.company || "—")}</div>
      <div style="margin-bottom:6px"><strong>Message:</strong> ${esc(lead.message || "—")}</div>
      <div style="margin-bottom:6px"><strong>Status:</strong> <span class="badge badge-${lead.status}">${lead.status}</span></div>
      <div><strong>Created:</strong> ${new Date(lead.createdAt).toLocaleString()}</div>
    `;

    renderFollowUps(lead.followUps || []);
    document.getElementById("followupInput").value = "";
    detailModal.classList.add("active");
  } catch (err) {
    alert("Failed to load lead details");
  }
}

// ─── Follow-ups ──────────────────────────────────
function renderFollowUps(followUps) {
  const list = document.getElementById("followupList");
  if (followUps.length === 0) {
    list.innerHTML = '<li class="followup-item" style="color:#aaa">No follow-up notes yet.</li>';
    return;
  }
  list.innerHTML = followUps
    .slice()
    .reverse()
    .map(
      (f) => `
    <li class="followup-item">
      ${esc(f.note)}
      <div class="followup-date">${new Date(f.date).toLocaleString()}</div>
    </li>`
    )
    .join("");
}

async function addFollowUp() {
  const input = document.getElementById("followupInput");
  const note = input.value.trim();
  if (!note || !currentDetailId) return;

  try {
    const res = await fetch(`${API_BASE}/leads/${currentDetailId}/followup`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ note }),
    });

    if (res.ok) {
      const lead = await res.json();
      renderFollowUps(lead.followUps || []);
      input.value = "";
      fetchLeads(); // refresh table too
    }
  } catch (err) {
    alert("Failed to add follow-up");
  }
}
