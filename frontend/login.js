const API_BASE = "/api";

// If already logged in, go to dashboard
if (localStorage.getItem("crm_token")) {
  window.location.href = "dashboard.html";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("loginError");
  errorEl.style.display = "none";

  if (!password) return;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem("crm_token", data.token);
      window.location.href = "dashboard.html";
    } else {
      errorEl.textContent = data.error || "Invalid password";
      errorEl.style.display = "block";
    }
  } catch (err) {
    errorEl.textContent = "Cannot connect to server";
    errorEl.style.display = "block";
  }
});
