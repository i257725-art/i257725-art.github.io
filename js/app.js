/* ============================================================
   SOC PORTFOLIO — APP LOGIC
   All content lives in one JS object (STORE.data), persisted to
   localStorage so edits survive a refresh on the SAME browser.
   Manage Mode reveals add/edit/delete controls. Use Export/Import
   to move data between browsers or bake it back into data.js.
   ============================================================ */

const STORAGE_KEY = "socPortfolioData_v1";

const STORE = {
  data: null,
  load(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { this.data = JSON.parse(saved); return; }
      catch(e) { console.warn("Corrupt saved data, falling back to seed."); }
    }
    this.data = JSON.parse(JSON.stringify(window.SOC_SEED));
  },
  save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  },
  resetToSeed(){
    this.data = JSON.parse(JSON.stringify(window.SOC_SEED));
    this.save();
  }
};

let MANAGE_MODE = false;
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const uid = (prefix) => prefix + "-" + Math.random().toString(36).slice(2,9);
const escapeHtml = (str="") => String(str).replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  STORE.load();
  renderProfile();
  renderProjects();
  renderReports();
  renderRules();
  renderPlaybooks();
  renderCerts();
  wireGlobalControls();
  applyManageVisibility();
});

/* ============================================================
   GLOBAL CONTROLS (manage toggle, nav, export/import)
   ============================================================ */
function wireGlobalControls(){
  $("#manageToggle").addEventListener("click", () => {
    MANAGE_MODE = !MANAGE_MODE;
    $("#manageToggle").classList.toggle("active", MANAGE_MODE);
    $("#manageBanner").hidden = !MANAGE_MODE;
    applyManageVisibility();
  });

  $("#navToggle").addEventListener("click", () => {
    $("#siteNav").classList.toggle("open");
  });
  $$("#siteNav a").forEach(a => a.addEventListener("click", () => {
    $("#siteNav").classList.remove("open");
  }));

  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(STORE.data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "soc-portfolio-data.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  $("#importBtn").addEventListener("click", () => $("#importFileInput").click());
  $("#importFileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      STORE.data = parsed;
      STORE.save();
      renderAll();
      alert("Data imported successfully.");
    } catch(err){
      alert("That file couldn't be read as valid JSON.");
    }
    e.target.value = "";
  });

  $("#resetBtn").addEventListener("click", () => {
    if (confirm("Reset all content back to the original seed data? This clears anything saved in this browser.")) {
      STORE.resetToSeed();
      renderAll();
    }
  });

  $("#addProjectBtn").addEventListener("click", () => openProjectForm());
  $("#addReportBtn").addEventListener("click", () => openReportForm());
  $("#addRuleBtn").addEventListener("click", () => openRuleForm());
  $("#addPlaybookBtn").addEventListener("click", () => openPlaybookForm());
  $("#addCertBtn").addEventListener("click", () => openCertForm());
  $("#editProfileBtn").addEventListener("click", () => openProfileForm());

  $("#modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalCancel").addEventListener("click", closeModal);
}

function applyManageVisibility(){
  $$(".manage-only").forEach(el => el.hidden = !MANAGE_MODE);
  // rule table Actions column header
  const ruleActionsHead = $("#ruleTable thead .manage-only");
  if (ruleActionsHead) ruleActionsHead.hidden = !MANAGE_MODE;
}

function renderAll(){
  renderProfile(); renderProjects(); renderReports();
  renderRules(); renderPlaybooks(); renderCerts();
  applyManageVisibility();
}

/* ============================================================
   PROFILE / HERO / FOOTER
   ============================================================ */
function renderProfile(){
  const p = STORE.data.profile;
  $("#brandName").textContent = p.name;
  $("#heroTitle").textContent = p.name;
  $("#heroRole").textContent = p.title;
  $("#heroTagline").textContent = p.tagline;
  $("#resumeLink").href = p.resumeUrl || "#";
  $("#githubLink").href = p.github || "#";
  $("#linkedinLink").href = p.linkedin || "#";
  $("#blogLink").href = p.blogUrl || "#";
  $("#aboutText").textContent = p.about;
  $("#skillsList").innerHTML = (p.skills||[]).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("");
  $("#footerName").textContent = p.name;
  $("#footerGithub").href = p.github || "#";
  $("#footerLinkedin").href = p.linkedin || "#";
  $("#footerResume").href = p.resumeUrl || "#";
  $("#footerBlog").href = p.blogUrl || "#";
}

function openProfileForm(){
  const p = STORE.data.profile;
  openModal("Edit Profile", [
    {key:"name", label:"Name", value:p.name},
    {key:"title", label:"Title", value:p.title},
    {key:"tagline", label:"Tagline", value:p.tagline, type:"textarea"},
    {key:"about", label:"About", value:p.about, type:"textarea"},
    {key:"skills", label:"Skills (comma-separated)", value:(p.skills||[]).join(", ")},
    {key:"github", label:"GitHub URL", value:p.github},
    {key:"linkedin", label:"LinkedIn URL", value:p.linkedin},
    {key:"resumeUrl", label:"Résumé URL", value:p.resumeUrl},
    {key:"blogUrl", label:"Blog URL", value:p.blogUrl},
  ], (vals) => {
    Object.assign(p, vals);
    p.skills = vals.skills.split(",").map(s=>s.trim()).filter(Boolean);
    STORE.save(); renderProfile();
  });
}

/* ============================================================
   PROJECTS
   ============================================================ */
function renderProjects(){
  const grid = $("#projectGrid");
  grid.innerHTML = STORE.data.projects.map(proj => {
    const statusClass = proj.status && proj.status.toLowerCase().includes("done") ? "" : "pending";
    const tags = (proj.tools||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")
      + (proj.mitre||[]).map(m=>`<span class="tag mitre">${escapeHtml(m)}</span>`).join("");
    const steps = (proj.steps && proj.steps.length)
      ? `<ol class="project-steps">${proj.steps.map(s=>`<li>${escapeHtml(s)}</li>`).join("")}</ol>` : "";
    const htb = (proj.htbTable && proj.htbTable.length) ? renderHtbTable(proj.htbTable) : "";
    const wideClass = (proj.htbTable && proj.htbTable.length) ? " project-card-wide" : "";
    return `
      <div class="project-card${wideClass}" data-id="${proj.id}">
        <div class="project-card-top">
          <div>
            <p class="project-subtitle">${escapeHtml(proj.subtitle||"")}</p>
            <h3>${escapeHtml(proj.title)}</h3>
          </div>
          <span class="status-pill ${statusClass}">${escapeHtml(proj.status||"")}</span>
        </div>
        <p class="project-summary">${escapeHtml(proj.summary||"")}</p>
        <div class="tag-row">${tags}</div>
        ${steps}
        ${htb}
        <div class="card-actions manage-only" ${MANAGE_MODE?"":"hidden"}>
          <button class="icon-btn" data-action="edit-project" data-id="${proj.id}">Edit</button>
          <button class="icon-btn danger" data-action="delete-project" data-id="${proj.id}">Delete</button>
        </div>
      </div>`;
  }).join("");

  $$('[data-action="edit-project"]', grid).forEach(b => b.addEventListener("click", () => openProjectForm(b.dataset.id)));
  $$('[data-action="delete-project"]', grid).forEach(b => b.addEventListener("click", () => {
    if (confirm("Delete this project? Its linked report will stay but lose the link.")) {
      STORE.data.projects = STORE.data.projects.filter(p => p.id !== b.dataset.id);
      STORE.save(); renderProjects();
    }
  }));
}

function renderHtbTable(rows){
  return `<div class="htb-table-scroll"><table class="htb-mini-table"><thead><tr>
    <th>Lab</th><th>Technique</th><th>ATT&CK</th><th>Investigation</th>
  </tr></thead><tbody>
    ${rows.map(r=>`<tr><td>${escapeHtml(r.lab)}</td><td>${escapeHtml(r.technique)}</td><td class="mono">${escapeHtml(r.attck)}</td><td>${escapeHtml(r.investigation)}</td></tr>`).join("")}
  </tbody></table></div>`;
}

function openProjectForm(id){
  const existing = id ? STORE.data.projects.find(p=>p.id===id) : null;
  openModal(existing ? "Edit Project" : "Add Project", [
    {key:"title", label:"Title", value:existing?.title||""},
    {key:"subtitle", label:"Subtitle", value:existing?.subtitle||""},
    {key:"status", label:"Status", value:existing?.status||"In Progress"},
    {key:"summary", label:"Summary", value:existing?.summary||"", type:"textarea"},
    {key:"tools", label:"Tools (comma-separated)", value:(existing?.tools||[]).join(", ")},
    {key:"mitre", label:"MITRE ATT&CK IDs (comma-separated)", value:(existing?.mitre||[]).join(", ")},
    {key:"steps", label:"Steps (one per line)", value:(existing?.steps||[]).join("\n"), type:"textarea"},
  ], (vals) => {
    const record = {
      id: existing?.id || uid("proj"),
      title: vals.title,
      subtitle: vals.subtitle,
      status: vals.status,
      summary: vals.summary,
      tools: vals.tools.split(",").map(s=>s.trim()).filter(Boolean),
      mitre: vals.mitre.split(",").map(s=>s.trim()).filter(Boolean),
      steps: vals.steps.split("\n").map(s=>s.trim()).filter(Boolean),
      htbTable: existing?.htbTable || [],
      reportId: existing?.reportId || null
    };
    if (existing) {
      Object.assign(existing, record);
    } else {
      STORE.data.projects.push(record);
    }
    STORE.save(); renderProjects();
  });
}

/* ============================================================
   REPORTS
   ============================================================ */
function renderReports(){
  const list = $("#reportList");
  list.innerHTML = STORE.data.reports.map(rep => {
    const project = STORE.data.projects.find(p => p.id === rep.projectId);
    const tags = (rep.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("");
    return `
      <div class="report-row" data-id="${rep.id}">
        <div>
          <h4>${escapeHtml(rep.title)}</h4>
          <p class="report-meta">${project ? "Linked project: " + escapeHtml(project.title) : "No linked project"}${rep.date ? " · " + escapeHtml(rep.date) : ""}</p>
          <p class="report-summary">${escapeHtml(rep.summary||"")}</p>
          <div class="report-tags">${tags}</div>
        </div>
        <div class="report-actions">
          ${rep.fileUrl ? `<a class="btn btn-ghost small" style="color:var(--navy-800);border-color:var(--paper-line);" href="${escapeHtml(rep.fileUrl)}" target="_blank" rel="noopener">View report</a>` : ""}
          <div class="card-actions manage-only" ${MANAGE_MODE?"":"hidden"}>
            <button class="icon-btn" data-action="edit-report" data-id="${rep.id}">Edit</button>
            <button class="icon-btn danger" data-action="delete-report" data-id="${rep.id}">Delete</button>
          </div>
        </div>
      </div>`;
  }).join("");

  $$('[data-action="edit-report"]', list).forEach(b => b.addEventListener("click", () => openReportForm(b.dataset.id)));
  $$('[data-action="delete-report"]', list).forEach(b => b.addEventListener("click", () => {
    if (confirm("Delete this report?")) {
      STORE.data.reports = STORE.data.reports.filter(r => r.id !== b.dataset.id);
      STORE.save(); renderReports();
    }
  }));
}

function openReportForm(id){
  const existing = id ? STORE.data.reports.find(r=>r.id===id) : null;
  const projectOptions = STORE.data.projects.map(p => `<option value="${p.id}" ${existing?.projectId===p.id?"selected":""}>${escapeHtml(p.title)}</option>`).join("");
  openModal(existing ? "Edit Report" : "Add Report", [
    {key:"title", label:"Report Title", value:existing?.title||""},
    {key:"projectId", label:"Linked Project", type:"select", html:`<option value="">— None —</option>${projectOptions}`},
    {key:"date", label:"Date", value:existing?.date||"", placeholder:"e.g. 2026-07-20"},
    {key:"summary", label:"Summary / Findings", value:existing?.summary||"", type:"textarea"},
    {key:"fileUrl", label:"Report file link (PDF / Drive / GitHub)", value:existing?.fileUrl||""},
    {key:"tags", label:"Tags (comma-separated)", value:(existing?.tags||[]).join(", ")},
  ], (vals) => {
    const record = {
      id: existing?.id || uid("rep"),
      title: vals.title,
      projectId: vals.projectId || null,
      date: vals.date,
      summary: vals.summary,
      fileUrl: vals.fileUrl,
      tags: vals.tags.split(",").map(s=>s.trim()).filter(Boolean)
    };
    if (existing) Object.assign(existing, record);
    else STORE.data.reports.push(record);
    STORE.save(); renderReports();
  });
}

/* ============================================================
   DETECTION RULES
   ============================================================ */
function renderRules(){
  const tbody = $("#ruleTableBody");
  tbody.innerHTML = STORE.data.detectionRules.map(r => `
    <tr data-id="${r.id}">
      <td><div class="rule-name">${escapeHtml(r.name)}</div><div class="rule-desc">${escapeHtml(r.description||"")}</div></td>
      <td class="mono">${escapeHtml(r.mitre)}</td>
      <td><span class="sev ${escapeHtml(r.severity)}">${escapeHtml(r.severity)}</span></td>
      <td>${escapeHtml(r.logSource)}</td>
      <td><span class="status-chip">${escapeHtml(r.status)}</span></td>
      <td class="manage-only" ${MANAGE_MODE?"":"hidden"}>
        <div class="card-actions">
          <button class="icon-btn" data-action="edit-rule" data-id="${r.id}">Edit</button>
          <button class="icon-btn danger" data-action="delete-rule" data-id="${r.id}">Delete</button>
        </div>
      </td>
    </tr>`).join("");

  $$('[data-action="edit-rule"]', tbody).forEach(b => b.addEventListener("click", () => openRuleForm(b.dataset.id)));
  $$('[data-action="delete-rule"]', tbody).forEach(b => b.addEventListener("click", () => {
    if (confirm("Delete this detection rule?")) {
      STORE.data.detectionRules = STORE.data.detectionRules.filter(r => r.id !== b.dataset.id);
      STORE.save(); renderRules();
    }
  }));
}

function openRuleForm(id){
  const existing = id ? STORE.data.detectionRules.find(r=>r.id===id) : null;
  openModal(existing ? "Edit Detection Rule" : "Add Detection Rule", [
    {key:"name", label:"Rule Name", value:existing?.name||""},
    {key:"mitre", label:"MITRE ATT&CK ID", value:existing?.mitre||""},
    {key:"severity", label:"Severity", type:"select", html:["Low","Medium","High","Critical"].map(s=>`<option ${existing?.severity===s?"selected":""}>${s}</option>`).join("")},
    {key:"logSource", label:"Log Source", value:existing?.logSource||""},
    {key:"status", label:"Status", type:"select", html:["Draft","Testing","Deployed"].map(s=>`<option ${existing?.status===s?"selected":""}>${s}</option>`).join("")},
    {key:"description", label:"Description", value:existing?.description||"", type:"textarea"},
  ], (vals) => {
    const record = { id: existing?.id || uid("rule"), ...vals };
    if (existing) Object.assign(existing, record);
    else STORE.data.detectionRules.push(record);
    STORE.save(); renderRules();
  });
}

/* ============================================================
   PLAYBOOKS
   ============================================================ */
function renderPlaybooks(){
  const list = $("#playbookList");
  list.innerHTML = STORE.data.playbooks.map(pb => `
    <div class="playbook-card" data-id="${pb.id}">
      <div class="project-card-top">
        <h3>${escapeHtml(pb.title)}</h3>
        <div class="card-actions manage-only" ${MANAGE_MODE?"":"hidden"}>
          <button class="icon-btn" data-action="edit-playbook" data-id="${pb.id}">Edit</button>
          <button class="icon-btn danger" data-action="delete-playbook" data-id="${pb.id}">Delete</button>
        </div>
      </div>
      ${(pb.phases||[]).map(ph => `
        <div class="phase-row">
          <div class="phase-name">${escapeHtml(ph.name)}</div>
          <div class="phase-detail">${escapeHtml(ph.detail)}</div>
        </div>`).join("")}
    </div>`).join("");

  $$('[data-action="edit-playbook"]', list).forEach(b => b.addEventListener("click", () => openPlaybookForm(b.dataset.id)));
  $$('[data-action="delete-playbook"]', list).forEach(b => b.addEventListener("click", () => {
    if (confirm("Delete this playbook?")) {
      STORE.data.playbooks = STORE.data.playbooks.filter(p => p.id !== b.dataset.id);
      STORE.save(); renderPlaybooks();
    }
  }));
}

function openPlaybookForm(id){
  const existing = id ? STORE.data.playbooks.find(p=>p.id===id) : null;
  const phasesText = (existing?.phases||[]).map(ph => `${ph.name}: ${ph.detail}`).join("\n");
  openModal(existing ? "Edit Playbook" : "Add Playbook", [
    {key:"title", label:"Playbook Title", value:existing?.title||""},
    {key:"phasesText", label:"Phases — one per line as \"Name: Detail\"", value:phasesText, type:"textarea"},
  ], (vals) => {
    const phases = vals.phasesText.split("\n").map(line=>{
      const idx = line.indexOf(":");
      if (idx === -1) return null;
      return {name: line.slice(0,idx).trim(), detail: line.slice(idx+1).trim()};
    }).filter(Boolean);
    const record = { id: existing?.id || uid("pb"), title: vals.title, phases };
    if (existing) Object.assign(existing, record);
    else STORE.data.playbooks.push(record);
    STORE.save(); renderPlaybooks();
  });
}

/* ============================================================
   CERTIFICATIONS
   ============================================================ */
function renderCerts(){
  const grid = $("#certGrid");
  const certs = STORE.data.certifications || [];
  $("#certEmptyNote").hidden = certs.length > 0;
  grid.innerHTML = certs.map(c => `
    <div class="cert-card" data-id="${c.id}">
      <h4>${escapeHtml(c.name)}</h4>
      <p class="cert-issuer">${escapeHtml(c.issuer||"")}</p>
      <p class="cert-date">${escapeHtml(c.date||"")}</p>
      <div class="card-actions manage-only" ${MANAGE_MODE?"":"hidden"}>
        <button class="icon-btn" data-action="edit-cert" data-id="${c.id}">Edit</button>
        <button class="icon-btn danger" data-action="delete-cert" data-id="${c.id}">Delete</button>
      </div>
    </div>`).join("");

  $$('[data-action="edit-cert"]', grid).forEach(b => b.addEventListener("click", () => openCertForm(b.dataset.id)));
  $$('[data-action="delete-cert"]', grid).forEach(b => b.addEventListener("click", () => {
    if (confirm("Delete this certification?")) {
      STORE.data.certifications = STORE.data.certifications.filter(c => c.id !== b.dataset.id);
      STORE.save(); renderCerts();
    }
  }));
}

function openCertForm(id){
  const existing = id ? (STORE.data.certifications||[]).find(c=>c.id===id) : null;
  openModal(existing ? "Edit Certification" : "Add Certification", [
    {key:"name", label:"Certification Name", value:existing?.name||""},
    {key:"issuer", label:"Issuer", value:existing?.issuer||""},
    {key:"date", label:"Date Earned", value:existing?.date||""},
  ], (vals) => {
    const record = { id: existing?.id || uid("cert"), ...vals };
    if (!STORE.data.certifications) STORE.data.certifications = [];
    if (existing) Object.assign(existing, record);
    else STORE.data.certifications.push(record);
    STORE.save(); renderCerts();
  });
}

/* ============================================================
   GENERIC MODAL FORM BUILDER
   ============================================================ */
let currentSaveHandler = null;

function openModal(title, fields, onSave){
  try {
    $("#modalTitle").textContent = title || "Edit";
    if (!fields || !fields.length){
      $("#modalBody").innerHTML = `<p class="field-hint">Nothing to edit here yet.</p>`;
    } else {
      $("#modalBody").innerHTML = fields.map(f => {
        const id = "f_" + f.key;
        if (f.type === "textarea"){
          return `<div class="field"><label for="${id}">${escapeHtml(f.label)}</label><textarea id="${id}" data-key="${f.key}">${escapeHtml(f.value||"")}</textarea></div>`;
        }
        if (f.type === "select"){
          return `<div class="field"><label for="${id}">${escapeHtml(f.label)}</label><select id="${id}" data-key="${f.key}">${f.html}</select></div>`;
        }
        return `<div class="field"><label for="${id}">${escapeHtml(f.label)}</label><input id="${id}" data-key="${f.key}" type="text" value="${escapeHtml(f.value||"")}" placeholder="${escapeHtml(f.placeholder||"")}"></div>`;
      }).join("");
    }
  } catch(err){
    console.error("Modal render error:", err);
    $("#modalBody").innerHTML = `<p class="field-hint">Something went wrong opening this editor. Close this, refresh the page, and try again.</p>`;
  }

  currentSaveHandler = () => {
    if (!fields || !fields.length) { closeModal(); return; }
    const vals = {};
    fields.forEach(f => {
      const el = $("#f_" + f.key);
      vals[f.key] = el ? el.value : "";
    });
    onSave(vals);
    closeModal();
  };

  $("#modalSave").onclick = currentSaveHandler;
  $("#modalOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal(){
  $("#modalOverlay").hidden = true;
  $("#modalBody").innerHTML = "";
  currentSaveHandler = null;
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("#modalOverlay").hidden) closeModal();
});
