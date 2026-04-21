const API_BASE = "/api";


function setAdminMessage(message, isError = false) {
  const adminMessage = document.getElementById("adminMessage");
  if (!adminMessage) return;

  adminMessage.textContent = message;
  adminMessage.style.color = isError ? "#f87171" : "#ffffff";
}

// FIELD BUILDERS

function createInput(labelText, value = "", placeholder = "", type = "text") {
  const wrapper = document.createElement("div");
  wrapper.classList.add("admin-field");

  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.value = value || "";
  input.placeholder = placeholder;

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return { wrapper, input };
}

function createTextarea(labelText, value = "", placeholder = "") {
  const wrapper = document.createElement("div");
  wrapper.classList.add("admin-field");

  const label = document.createElement("label");
  label.textContent = labelText;

  const textarea = document.createElement("textarea");
  textarea.value = value || "";
  textarea.placeholder = placeholder;

  wrapper.appendChild(label);
  wrapper.appendChild(textarea);

  return { wrapper, textarea };
}

function createDeleteButton(onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Delete";
  button.classList.add("btn", "secondary");
  button.style.marginTop = "12px";
  button.addEventListener("click", onClick);
  return button;
}

// ITEM BUILDERS

function buildSkillItem(skill = { name: "", category: "", level: "" }) {
  const item = document.createElement("div");
  item.classList.add("project-card", "admin-item");

  if (skill.id) item.dataset.id = skill.id;

  const nameField = createInput("Skill Name", skill.name, "e.g. Kubernetes");
  const categoryField = createInput("Category", skill.category, "e.g. Cloud / DevOps");
  const levelField = createInput("Level", skill.level, "e.g. Beginner / Intermediate");

  item.appendChild(nameField.wrapper);
  item.appendChild(categoryField.wrapper);
  item.appendChild(levelField.wrapper);
  item.appendChild(createDeleteButton(() => item.remove()));

  return item;
}

function buildProjectItem(project = {
  title: "",
  problem: "",
  action: "",
  result: "",
  github_url: "",
  linkedin_url: ""
}) {
  const item = document.createElement("div");
  item.classList.add("project-card", "admin-item");

  if (project.id) item.dataset.id = project.id;

  const titleField = createInput("Project Title", project.title, "Project title");
  const problemField = createTextarea("Problem", project.problem, "What problem does it solve?");
  const actionField = createTextarea("Action", project.action, "What did you build or do?");
  const resultField = createTextarea("Result", project.result, "Outcome or impact");
  const githubField = createInput("GitHub URL", project.github_url, "https://github.com/...");
  const linkedinField = createInput("LinkedIn URL", project.linkedin_url, "https://linkedin.com/...");

  item.appendChild(titleField.wrapper);
  item.appendChild(problemField.wrapper);
  item.appendChild(actionField.wrapper);
  item.appendChild(resultField.wrapper);
  item.appendChild(githubField.wrapper);
  item.appendChild(linkedinField.wrapper);
  item.appendChild(createDeleteButton(() => item.remove()));

  return item;
}

function buildCertificateItem(cert = {
  name: "",
  issuer: "",
  issue_date: "",
  credential_url: ""
}) {
  const item = document.createElement("div");
  item.classList.add("project-card", "admin-item");

  if (cert.id) item.dataset.id = cert.id;

  const nameField = createInput("Certificate Name", cert.name, "Certificate name");
  const issuerField = createInput("Issuer", cert.issuer, "Issuer name");
  const issueDateField = createInput("Issue Date", cert.issue_date || "", "", "date");
  const urlField = createInput("Credential URL", cert.credential_url, "https://...");

  item.appendChild(nameField.wrapper);
  item.appendChild(issuerField.wrapper);
  item.appendChild(issueDateField.wrapper);
  item.appendChild(urlField.wrapper);
  item.appendChild(createDeleteButton(() => item.remove()));

  return item;
}

function buildEducationItem(edu = {
  school_name: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: ""
}) {
  const item = document.createElement("div");
  item.classList.add("project-card", "admin-item");

  if (edu.id) item.dataset.id = edu.id;

  const schoolField = createInput("School Name", edu.school_name, "School name");
  const degreeField = createInput("Degree", edu.degree, "e.g. Bachelor");
  const fieldField = createInput("Field of Study", edu.field_of_study, "e.g. Cybersecurity");
  const startDateField = createInput("Start Date", edu.start_date || "", "", "date");
  const endDateField = createInput("End Date", edu.end_date || "", "", "date");

  item.appendChild(schoolField.wrapper);
  item.appendChild(degreeField.wrapper);
  item.appendChild(fieldField.wrapper);
  item.appendChild(startDateField.wrapper);
  item.appendChild(endDateField.wrapper);
  item.appendChild(createDeleteButton(() => item.remove()));

  return item;
}

function buildWorkingOnItem(itemData = {
  title: "",
  description: "",
  github_url: ""
}) {
  const item = document.createElement("div");
  item.classList.add("project-card", "admin-item");

  if (itemData.id) item.dataset.id = itemData.id;

  const titleField = createInput("Title", itemData.title, "What are you working on?");
  const descriptionField = createTextarea("Description", itemData.description, "Describe it");
  const githubField = createInput("GitHub URL", itemData.github_url, "https://github.com/...");

  item.appendChild(titleField.wrapper);
  item.appendChild(descriptionField.wrapper);
  item.appendChild(githubField.wrapper);
  item.appendChild(createDeleteButton(() => item.remove()));

  return item;
}

function buildFeaturedProjectItem(itemData = {
  title: "",
  description: "",
  github_url: ""
}) {
  const item = document.createElement("div");
  item.classList.add("project-card", "admin-item");

  if (itemData.id) item.dataset.id = itemData.id;

  const titleField = createInput("Title", itemData.title, "Featured project title");
  const descriptionField = createTextarea("Description", itemData.description, "Short description");
  const githubField = createInput("GitHub URL", itemData.github_url, "https://github.com/...");

  item.appendChild(titleField.wrapper);
  item.appendChild(descriptionField.wrapper);
  item.appendChild(githubField.wrapper);
  item.appendChild(createDeleteButton(() => item.remove()));

  return item;
}

function buildWhyWorkWithMeItem(itemData = {
  title: "",
  description: ""
}) {
  const item = document.createElement("div");
  item.classList.add("project-card", "admin-item");

  if (itemData.id) item.dataset.id = itemData.id;

  const titleField = createInput("Title", itemData.title, "Reason title");
  const descriptionField = createTextarea("Description", itemData.description, "Explain this reason");

  item.appendChild(titleField.wrapper);
  item.appendChild(descriptionField.wrapper);
  item.appendChild(createDeleteButton(() => item.remove()));

  return item;
}


//   FETCH HELPERS

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (response.status === 401) {
    alert("Session expired. Please log in again.");
    window.location.href = "/";
    return;
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed: ${response.status}`);
  }

  return data;
}

//   LOAD ADMIN DATA

async function loadAdminData() {
  try {
    setAdminMessage("Loading data...");

    const data = await fetchJson(`${API_BASE}/site-data`);

    const skillsContainer = document.getElementById("adminSkillsContainer");
    const projectsContainer = document.getElementById("adminProjectsContainer");
    const certificatesContainer = document.getElementById("adminCertificatesContainer");
    const educationContainer = document.getElementById("adminEducationContainer");
    const workingOnContainer = document.getElementById("adminCurrentWorkContainer");
    const featuredProjectsContainer = document.getElementById("adminFeaturedProjectsContainer");
    const whyWorkWithMeContainer = document.getElementById("adminWhyWorkWithMeContainer");

    if (!skillsContainer || !projectsContainer || !certificatesContainer || !educationContainer) {
      setAdminMessage("Some required admin sections are missing in admin.html.", true);
      return;
    }

    skillsContainer.innerHTML = "";
    projectsContainer.innerHTML = "";
    certificatesContainer.innerHTML = "";
    educationContainer.innerHTML = "";

    if (workingOnContainer) workingOnContainer.innerHTML = "";
    if (featuredProjectsContainer) featuredProjectsContainer.innerHTML = "";
    if (whyWorkWithMeContainer) whyWorkWithMeContainer.innerHTML = "";

    (data.skills || []).forEach((skill) => {
      skillsContainer.appendChild(buildSkillItem(skill));
    });

    (data.projects || []).forEach((project) => {
      projectsContainer.appendChild(buildProjectItem(project));
    });

    (data.certifications || []).forEach((cert) => {
      certificatesContainer.appendChild(buildCertificateItem(cert));
    });

    (data.education || []).forEach((edu) => {
      educationContainer.appendChild(buildEducationItem(edu));
    });

    (data.working_on || []).forEach((itemData) => {
      if (workingOnContainer) {
        workingOnContainer.appendChild(buildWorkingOnItem(itemData));
      }
    });

    (data.featured_projects || []).forEach((itemData) => {
      if (featuredProjectsContainer) {
        featuredProjectsContainer.appendChild(buildFeaturedProjectItem(itemData));
      }
    });

    (data.why_work_with_me || []).forEach((itemData) => {
      if (whyWorkWithMeContainer) {
        whyWorkWithMeContainer.appendChild(buildWhyWorkWithMeItem(itemData));
      }
    });

    setAdminMessage("Data loaded successfully.");
  } catch (error) {
    console.error("Load error:", error);
    setAdminMessage(`Failed to load data: ${error.message}`, true);
  }
}

//   FEEDBACK ACTIONS

async function toggleFeedbackRead(feedbackId, isRead) {
  try {
    await fetchJson(`${API_BASE}/feedback/${feedbackId}/read`, {
      method: "PUT",
      body: JSON.stringify({ is_read: isRead })
    });

    await loadAdminFeedback();
  } catch (error) {
    console.error("Failed to update feedback read status:", error);
    setAdminMessage(`Failed to update feedback: ${error.message}`, true);
  }
}

async function hideFeedbackItem(feedbackId) {
  try {
    await fetchJson(`${API_BASE}/feedback/${feedbackId}/hide`, {
      method: "PUT",
      body: JSON.stringify({ is_hidden: true })
    });

    await loadAdminFeedback();
  } catch (error) {
    console.error("Failed to hide feedback:", error);
    setAdminMessage(`Failed to hide feedback: ${error.message}`, true);
  }
}

async function deleteFeedbackItem(feedbackId) {
  try {
    await fetchJson(`${API_BASE}/feedback/${feedbackId}`, {
      method: "DELETE"
    });

    await loadAdminFeedback();
  } catch (error) {
    console.error("Failed to delete feedback:", error);
    setAdminMessage(`Failed to delete feedback: ${error.message}`, true);
  }
}

//   READ FORM DATA 

function readSkills() {
  const items = document.querySelectorAll("#adminSkillsContainer .admin-item");

  return Array.from(items)
    .map((item) => {
      const inputs = item.querySelectorAll("input");
      return {
        name: inputs[0]?.value.trim() || "",
        category: inputs[1]?.value.trim() || "",
        level: inputs[2]?.value.trim() || ""
      };
    })
    .filter((item) => item.name || item.category || item.level);
}

function readProjects() {
  const items = document.querySelectorAll("#adminProjectsContainer .admin-item");

  return Array.from(items)
    .map((item) => {
      const fields = item.querySelectorAll("input, textarea");
      return {
        title: fields[0]?.value.trim() || "",
        problem: fields[1]?.value.trim() || "",
        action: fields[2]?.value.trim() || "",
        result: fields[3]?.value.trim() || "",
        github_url: fields[4]?.value.trim() || "",
        linkedin_url: fields[5]?.value.trim() || ""
      };
    })
    .filter((item) =>
      item.title ||
      item.problem ||
      item.action ||
      item.result ||
      item.github_url ||
      item.linkedin_url
    );
}

function readCertificates() {
  const items = document.querySelectorAll("#adminCertificatesContainer .admin-item");

  return Array.from(items)
    .map((item) => {
      const inputs = item.querySelectorAll("input");
      return {
        name: inputs[0]?.value.trim() || "",
        issuer: inputs[1]?.value.trim() || "",
        issue_date: inputs[2]?.value.trim() || "",
        credential_url: inputs[3]?.value.trim() || ""
      };
    })
    .filter((item) =>
      item.name ||
      item.issuer ||
      item.issue_date ||
      item.credential_url
    );
}

function readEducation() {
  const items = document.querySelectorAll("#adminEducationContainer .admin-item");

  return Array.from(items)
    .map((item) => {
      const inputs = item.querySelectorAll("input");
      return {
        school_name: inputs[0]?.value.trim() || "",
        degree: inputs[1]?.value.trim() || "",
        field_of_study: inputs[2]?.value.trim() || "",
        start_date: inputs[3]?.value.trim() || "",
        end_date: inputs[4]?.value.trim() || ""
      };
    })
    .filter((item) =>
      item.school_name ||
      item.degree ||
      item.field_of_study ||
      item.start_date ||
      item.end_date
    );
}

function readWorkingOn() {
  const items = document.querySelectorAll("#adminCurrentWorkContainer .admin-item");

  return Array.from(items)
    .map((item) => {
      const fields = item.querySelectorAll("input, textarea");
      return {
        title: fields[0]?.value.trim() || "",
        description: fields[1]?.value.trim() || "",
        github_url: fields[2]?.value.trim() || ""
      };
    })
    .filter((item) => item.title || item.description || item.github_url);
}

function readFeaturedProjects() {
  const items = document.querySelectorAll("#adminFeaturedProjectsContainer .admin-item");

  return Array.from(items)
    .map((item) => {
      const fields = item.querySelectorAll("input, textarea");
      return {
        title: fields[0]?.value.trim() || "",
        description: fields[1]?.value.trim() || "",
        github_url: fields[2]?.value.trim() || ""
      };
    })
    .filter((item) => item.title || item.description || item.github_url);
}

function readWhyWorkWithMe() {
  const items = document.querySelectorAll("#adminWhyWorkWithMeContainer .admin-item");

  return Array.from(items)
    .map((item) => {
      const fields = item.querySelectorAll("input, textarea");
      return {
        title: fields[0]?.value.trim() || "",
        description: fields[1]?.value.trim() || ""
      };
    })
    .filter((item) => item.title || item.description);
}

//   SAVE HELPERS

async function deleteAllFromEndpoint(endpoint) {
    const currentItems = await fetchJson(`${API_BASE}${endpoint}`);

    for (const item of currentItems) {
        if (item && item.id) {
            await fetchJson(`${API_BASE}${endpoint}/${item.id}`, {
                method: "DELETE"
            });
        }
    }
}

async function postAllToEndpoint(endpoint, items) {
    for (const item of items) {
        await fetchJson(`${API_BASE}${endpoint}`, {
            method: "POST",
            body: JSON.stringify(item)
        });
    }
}

//  SAVE

async function handleSave(event) {
  event.preventDefault();

  try {
    setAdminMessage("Saving changes...");

    const skills = readSkills();
    const projects = readProjects();
    const certificates = readCertificates();
    const education = readEducation();
    const workingOn = readWorkingOn();
    const featuredProjects = readFeaturedProjects();
    const whyWorkWithMe = readWhyWorkWithMe();

    await deleteAllFromEndpoint("/skills");
    await postAllToEndpoint("/skills", skills);

    await deleteAllFromEndpoint("/projects");
    await postAllToEndpoint("/projects", projects);

    await deleteAllFromEndpoint("/certifications");
    await postAllToEndpoint("/certifications", certificates);

    await deleteAllFromEndpoint("/education");
    await postAllToEndpoint("/education", education);

    await deleteAllFromEndpoint("/working_on");
    await postAllToEndpoint("/working_on", workingOn);

    await deleteAllFromEndpoint("/featured_projects");
    await postAllToEndpoint("/featured_projects", featuredProjects);

    await deleteAllFromEndpoint("/why_work_with_me");
    await postAllToEndpoint("/why_work_with_me", whyWorkWithMe);

    await loadAdminData();
    setAdminMessage("All changes saved successfully.");
  } catch (error) {
    console.error("Save error:", error);
    setAdminMessage(`Failed to save changes: ${error.message}`, true);
  }
}

// UI HELPERS
  
function appendToContainer(containerId, builder) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.appendChild(builder());
}

function setupAddButtons() {
  const addSkillBtn = document.getElementById("addSkillBtn");
  const addProjectBtn = document.getElementById("addProjectBtn");
  const addCertificateBtn = document.getElementById("addCertificateBtn");
  const addEducationBtn = document.getElementById("addEducationBtn");
  const addCurrentWorkBtn = document.getElementById("addCurrentWorkBtn");
  const addFeaturedProjectBtn = document.getElementById("addFeaturedProjectBtn");
  const addWhyWorkWithMeBtn = document.getElementById("addWhyWorkWithMeBtn");

  if (addSkillBtn) {
    addSkillBtn.addEventListener("click", () => {
      appendToContainer("adminSkillsContainer", () => buildSkillItem());
    });
  }

  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", () => {
      appendToContainer("adminProjectsContainer", () => buildProjectItem());
    });
  }

  if (addCertificateBtn) {
    addCertificateBtn.addEventListener("click", () => {
      appendToContainer("adminCertificatesContainer", () => buildCertificateItem());
    });
  }

  if (addEducationBtn) {
    addEducationBtn.addEventListener("click", () => {
      appendToContainer("adminEducationContainer", () => buildEducationItem());
    });
  }

  if (addCurrentWorkBtn) {
    addCurrentWorkBtn.addEventListener("click", () => {
      appendToContainer("adminCurrentWorkContainer", () => buildWorkingOnItem());
    });
  }

  if (addFeaturedProjectBtn) {
    addFeaturedProjectBtn.addEventListener("click", () => {
      appendToContainer("adminFeaturedProjectsContainer", () => buildFeaturedProjectItem());
    });
  }

  if (addWhyWorkWithMeBtn) {
    addWhyWorkWithMeBtn.addEventListener("click", () => {
      appendToContainer("adminWhyWorkWithMeContainer", () => buildWhyWorkWithMeItem());
    });
  }
}

function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

//  FEEDBACK LOAD

async function loadAdminFeedback() {
  try {
    const container = document.getElementById("adminFeedbackContainer");
    const badge = document.getElementById("feedbackBadge");

    if (!container) {
      console.warn("adminFeedbackContainer not found in admin.html");
      return;
    }

    container.innerHTML = "<p>Loading feedback...</p>";

    const feedbacks = await fetchJson(`${API_BASE}/feedback`);

    if (badge) {
      const unreadCount = (feedbacks || []).filter(
        (feedback) => !feedback.is_read && !feedback.is_hidden
      ).length;
      badge.textContent = `New: ${unreadCount}`;
    }

    if (!feedbacks || feedbacks.length === 0) {
      container.innerHTML = "<p>No feedback found.</p>";
      return;
    }

    container.innerHTML = "";

    feedbacks.forEach((feedback) => {
      const card = document.createElement("div");
      card.classList.add("project-card", "admin-item");
      card.style.marginBottom = "16px";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
          <div>
            <h3 style="margin-bottom:8px;">${feedback.name || "Anonymous"}</h3>

            <p style="margin-bottom:8px;">
              <strong>Role / LinkedIn:</strong>
              ${feedback.role_or_linkedin || "N/A"}
            </p>

            <p style="margin-bottom:8px;">
              <strong>Comment:</strong>
              ${feedback.comment || ""}
            </p>

            <p style="margin-bottom:8px;">
              <strong>Created:</strong>
              ${feedback.created_at || "N/A"}
            </p>

            <p style="margin-bottom:8px;">
              <strong>Status:</strong>
              ${feedback.is_read ? "Read" : "Unread"} |
              ${feedback.is_hidden ? "Hidden" : "Visible"}
            </p>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn secondary read-btn">
              ${feedback.is_read ? "Mark Unread" : "Mark Read"}
            </button>

            <button type="button" class="btn secondary hide-btn">
              Hide
            </button>

            <button type="button" class="btn secondary delete-btn">
              Delete
            </button>
          </div>
        </div>
      `;

      card.querySelector(".read-btn").addEventListener("click", () => {
        toggleFeedbackRead(feedback.id, !feedback.is_read);
      });

      card.querySelector(".hide-btn").addEventListener("click", () => {
        hideFeedbackItem(feedback.id);
      });

      card.querySelector(".delete-btn").addEventListener("click", () => {
        deleteFeedbackItem(feedback.id);
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load feedback:", error);
    setAdminMessage(`Failed to load feedback: ${error.message}`, true);
  }
}


async function checkSession(response) {
    if (response.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "/kharelsundeep7@_admin_login_page";
    }
    return response;
}


//   STARTUP

document.addEventListener("DOMContentLoaded", () => {
  setupAddButtons();
  setupMobileMenu();

  const adminForm = document.getElementById("adminForm");
  if (adminForm) {
    adminForm.addEventListener("submit", handleSave);
  }

  loadAdminData();
  loadAdminFeedback();
});