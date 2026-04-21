const API_BASE = "/api";

let allProjects = [];

function safe(value, fallback = "N/A") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
}

function renderSkills(skills) {
  const container = document.getElementById("skillsContainer");
  if (!container) return;

  if (!skills.length) {
    container.innerHTML = "<p>No skills added yet.</p>";
    return;
  }

  container.innerHTML = skills.map((skill) => `
    <div class="skill-card">
      <h3>${safe(skill.name, "Untitled Skill")}</h3>
      <p><strong>Category:</strong> ${safe(skill.category)}</p>
      <p><strong>Level:</strong> ${safe(skill.level)}</p>
    </div>
  `).join("");
}

function renderProjects(projects) {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  if (!projects.length) {
    container.innerHTML = "<p>No projects added yet.</p>";
    return;
  }

  container.innerHTML = projects.map((project) => `
    <div class="project-card">
      <h3>${safe(project.title, "Untitled Project")}</h3>
      <p><strong>Problem:</strong> ${safe(project.problem)}</p>
      <p><strong>Action:</strong> ${safe(project.action)}</p>
      <p><strong>Result:</strong> ${safe(project.result)}</p>

      <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
        ${project.github_url ? `
          <a href="${project.github_url}" target="_blank" rel="noopener noreferrer">GitHub</a>
        ` : ""}

        ${project.linkedin_url ? `
          <a href="${project.linkedin_url}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        ` : ""}
      </div>
    </div>
  `).join("");
}

function renderCertificates(certifications) {
  const container = document.getElementById("certificatesContainer");
  if (!container) return;

  if (!certifications.length) {
    container.innerHTML = "<p>No certifications added yet.</p>";
    return;
  }

  container.innerHTML = certifications.map((cert) => `
    <div class="cert-card">
      <h3>${safe(cert.name, "Untitled Certificate")}</h3>
      <p><strong>Issuer:</strong> ${safe(cert.issuer)}</p>
      <p><strong>Date:</strong> ${safe(cert.issue_date)}</p>
      ${cert.credential_url ? `
        <a href="${cert.credential_url}" target="_blank" rel="noopener noreferrer">View Certificate</a>
      ` : ""}
    </div>
  `).join("");
}

function renderEducation(education) {
  const container = document.getElementById("educationContainer");
  if (!container) return;

  if (!education.length) {
    container.innerHTML = "<p>No education added yet.</p>";
    return;
  }

  container.innerHTML = education.map((edu) => `
    <div class="project-card">
      <h3>${safe(edu.school_name, "School")}</h3>
      <p><strong>Degree:</strong> ${safe(edu.degree)}</p>
      <p><strong>Field:</strong> ${safe(edu.field_of_study)}</p>
      <p><strong>Start:</strong> ${safe(edu.start_date)}</p>
      <p><strong>End:</strong> ${safe(edu.end_date)}</p>
    </div>
  `).join("");
}

function renderWorkingOn(items) {
  const container = document.getElementById("workingOnContainer");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = "<p>No current work added yet.</p>";
    return;
  }

  container.innerHTML = items.map((item) => `
    <div class="project-card">
      <h3>${safe(item.title, "Untitled")}</h3>
      <p>${safe(item.description)}</p>
      ${item.github_url ? `
        <a href="${item.github_url}" target="_blank" rel="noopener noreferrer">View Link</a>
      ` : ""}
    </div>
  `).join("");
}

function renderFeaturedProjects(items) {
  const container = document.getElementById("featuredProjectsContainer");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = "<p>No featured projects added yet.</p>";
    return;
  }

  container.innerHTML = items.map((item) => `
    <div class="project-card">
      <h3>${safe(item.title, "Untitled")}</h3>
      <p>${safe(item.description)}</p>
      ${item.github_url ? `
        <a href="${item.github_url}" target="_blank" rel="noopener noreferrer">View Project</a>
      ` : ""}
    </div>
  `).join("");
}

function renderWhyWorkWithMe(items) {
  const container = document.getElementById("whyWorkWithMeContainer");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = "<p>No reasons added yet.</p>";
    return;
  }

  container.innerHTML = items.map((item) => `
    <div class="project-card">
      <h3>${safe(item.title, "Untitled")}</h3>
      <p>${safe(item.description)}</p>
    </div>
  `).join("");
}

function renderFeedback(feedbacks) {
  const container = document.getElementById("feedbackContainer");
  if (!container) return;

  const visibleFeedback = (feedbacks || []).filter((item) => !item.is_hidden);

  if (!visibleFeedback.length) {
    container.innerHTML = "<p>No feedback yet.</p>";
    return;
  }

  container.innerHTML = visibleFeedback.map((item) => `
    <div class="feedback-card">
      <h3>${safe(item.name, "Anonymous")}</h3>
      <p><strong>Role / LinkedIn:</strong> ${safe(item.role_or_linkedin)}</p>
      <p><strong>Comment:</strong> ${safe(item.comment)}</p>
      <p><strong>Created:</strong> ${safe(item.created_at)}</p>
    </div>
  `).join("");
}

function filterProjects(searchTerm) {
  const value = searchTerm.trim().toLowerCase();

  if (!value) {
    renderProjects(allProjects);
    return;
  }

  const filtered = allProjects.filter((project) =>
    (project.title || "").toLowerCase().includes(value) ||
    (project.problem || "").toLowerCase().includes(value) ||
    (project.action || "").toLowerCase().includes(value) ||
    (project.result || "").toLowerCase().includes(value)
  );

  renderProjects(filtered);
}

async function loadSiteData() {
  try {
    const response = await fetch(`${API_BASE}/site-data`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load data");
    }

    renderSkills(data.skills || []);

    allProjects = data.projects || [];
    renderProjects(allProjects);

    renderCertificates(data.certifications || []);
    renderEducation(data.education || []);
    renderWorkingOn(data.working_on || []);
    renderFeaturedProjects(data.featured_projects || []);
    renderWhyWorkWithMe(data.why_work_with_me || []);
  } catch (error) {
    console.error("Load error:", error);

    renderSkills([]);
    renderProjects([]);
    renderCertificates([]);
    renderEducation([]);
    renderWorkingOn([]);
    renderFeaturedProjects([]);
    renderWhyWorkWithMe([]);
  }
}

async function loadFeedback() {
  const feedbackContainer = document.getElementById("feedbackContainer");
  if (!feedbackContainer) return;

  try {
    const response = await fetch(`${API_BASE}/feedback`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load feedback");
    }

    renderFeedback(data || []);
  } catch (error) {
    console.error("Feedback load error:", error);
    feedbackContainer.innerHTML = "<p>Failed to load feedback.</p>";
  }
}

function setupProjectSearch() {
  const input = document.getElementById("projectSearch");
  if (!input) return;

  input.addEventListener("input", (e) => {
    filterProjects(e.target.value);
  });
}

function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

function setupFeedbackForm() {
  const submitBtn = document.getElementById("submitComment");
  const nameInput = document.getElementById("commentName");
  const roleInput = document.getElementById("commentRole");
  const commentInput = document.getElementById("commentText");

  if (!submitBtn || !nameInput || !roleInput || !commentInput) return;

  submitBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const role_or_linkedin = roleInput.value.trim();
    const comment = commentInput.value.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    if (!comment) {
      alert("Please enter your feedback.");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      const response = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          role_or_linkedin,
          comment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      nameInput.value = "";
      roleInput.value = "";
      commentInput.value = "";

      alert("Feedback submitted successfully.");
      await loadFeedback();
    } catch (error) {
      console.error("Feedback submit error:", error);
      alert(error.message || "Failed to submit feedback.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Feedback";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadSiteData();
  await loadFeedback();

  setupProjectSearch();
  setupFeedbackForm();
  setupMobileMenu();
});