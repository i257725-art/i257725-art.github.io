/* ============================================================
   SOC PORTFOLIO — SEED DATA
   This is the data that ships with the site the first time it
   loads in any browser. After that, the live copy lives in
   localStorage (see app.js). To make an edit permanent for every
   visitor, use "Export Data" in Manage Mode and paste the result
   back in here, then commit + push to GitHub.
   ============================================================ */

window.SOC_SEED = {

  profile: {
    name: "Hina Khan",
    title: "SOC Analyst | Threat Detection & Incident Response",
    tagline: "Building detections, breaking labs, and documenting everything in between.",
    location: "Add your city",
    email: "you@example.com",
    github: "https://github.com/i257725-art",
    linkedin: "https://www.linkedin.com/in/imhinnakhan2001/",
    resumeUrl: "assets/resume.pdf",
    blogUrl: "#",
    about: "Every alert on this page started as a question I refused to leave unanswered. I've spent countless hours in isolated labs — deploying firewalls, standing up honeypots, dissecting malware samples, and writing detection rules line by line until they actually caught what they were meant to catch. This portfolio is proof of that work: not a résumé claim, but a running log of labs completed, incidents investigated, and rules that fire correctly. If you're reading this and wondering whether hands-on SOC skills can be built from scratch through sheer persistence — they can. This is what that looks like in progress.",
    skills: [
      "Wazuh (SIEM/XDR)", "pfSense / OPNsense", "Malware Analysis",
      "Incident Response", "MITRE ATT&CK Mapping", "Honeypot Deployment",
      "Log Analysis", "Linux & Windows Forensics", "Detection Engineering"
    ]
  },

  // ---------------- PROJECTS ----------------
  projects: [
    {
      id: "proj-1",
      title: "Firewall Integration & Monitoring",
      subtitle: "Task #1 — SOC Team",
      status: "In Progress",
      summary: "Deployed a software firewall and integrated it with Wazuh for centralized monitoring, then built and validated security policies against live traffic.",
      tools: ["pfSense", "OPNsense", "Wazuh"],
      mitre: ["T1046"],
      steps: [
        "Deploy and configure a software firewall (pfSense, OPNsense, Sophos, or FortiGate)",
        "Integrate the firewall with Wazuh for log forwarding and monitoring",
        "Create and test firewall security policies: block traffic from specific countries (e.g. China, Russia), restrict access to specified websites, configure admin privilege and access control rules",
        "Generate network traffic and validate rule enforcement",
        "Monitor firewall logs and security events in Wazuh"
      ],
      reportId: "rep-1"
    },
    {
      id: "proj-2",
      title: "Malware Analysis & Incident Response",
      subtitle: "Task #2 — SOC Team",
      status: "In Progress",
      summary: "Analyzed a malware sample inside an isolated VM + pfSense lab, correlated the resulting Wazuh alerts, and produced a full incident response plan.",
      tools: ["VM (isolated)", "pfSense", "Wazuh"],
      mitre: ["T1204", "T1059"],
      steps: [
        "Configure a secure lab environment using a VM and pfSense firewall",
        "Obtain a malware sample from an approved research source",
        "Monitor and document firewall activity related to the download",
        "Observe and collect malware-related alerts from Wazuh",
        "Analyze logs for IOCs, IOAs, malware behavior and affected assets",
        "Develop an Incident Response Plan: Detection, Analysis, Containment, Eradication, Recovery, Lessons Learned"
      ],
      reportId: "rep-2"
    },
    {
      id: "proj-3",
      title: "Honeypot Monitoring with Wazuh",
      subtitle: "Task #3 — SOC Team",
      status: "In Progress",
      summary: "Stood up a honeypot in an isolated lab, wired it into Wazuh, and analyzed attacker activity captured in the dashboard.",
      tools: ["Honeypot", "Wazuh"],
      mitre: ["T1595"],
      steps: [
        "Deploy a Honeypot in a controlled lab environment",
        "Integrate the Honeypot with Wazuh",
        "Monitor and collect Honeypot events in the Wazuh Dashboard",
        "Analyze attacker activities and generated alerts",
        "Submit screenshots, configurations, and findings"
      ],
      reportId: "rep-3"
    },
    {
      id: "proj-4",
      title: "HTB Blue Team Labs (17 Labs)",
      subtitle: "Hack The Box — SOC Skills Track",
      status: "In Progress",
      summary: "Worked through 17 Hack The Box blue-team labs, each mapped to a MITRE ATT&CK technique and the corresponding log source to investigate.",
      tools: ["Hack The Box", "Wazuh", "Various log sources"],
      mitre: ["T1021", "T1133", "T1190", "T1046", "T1078", "T1557", "T1530", "T1068", "T1105"],
      steps: [],
      htbTable: [
        { lab: "Meow", technique: "Telnet", attck: "T1021", skill: "Service Enumeration", investigation: "Detect Telnet connections" },
        { lab: "Fawn", technique: "Anonymous FTP", attck: "T1133", skill: "File Transfer Monitoring", investigation: "FTP authentication logs" },
        { lab: "Dancing", technique: "SMB Enumeration", attck: "T1021.002", skill: "Windows File Share Monitoring", investigation: "SMB Event IDs" },
        { lab: "Appointment", technique: "SQL Injection", attck: "T1190", skill: "Web Attack Detection", investigation: "Web server logs" },
        { lab: "Sequel", technique: "MySQL Enumeration", attck: "T1046", skill: "Database Monitoring", investigation: "Database authentication logs" },
        { lab: "Crocodile", technique: "FTP Credential Abuse", attck: "T1078", skill: "Credential Monitoring", investigation: "Failed/successful FTP logins" },
        { lab: "Redeemer", technique: "Redis Misconfiguration", attck: "T1190", skill: "Service Misconfiguration Detection", investigation: "Redis logs" },
        { lab: "Mongod", technique: "MongoDB Enumeration", attck: "T1046", skill: "Database Exposure Detection", investigation: "MongoDB audit logs" },
        { lab: "Synced", technique: "rsync Enumeration", attck: "T1105", skill: "File Synchronization Monitoring", investigation: "Linux authentication logs" },
        { lab: "Responder", technique: "LLMNR/NBT-NS Poisoning", attck: "T1557", skill: "Credential Theft Detection", investigation: "Windows Event Logs + Sysmon" },
        { lab: "Three", technique: "AWS S3 Misconfiguration", attck: "T1530", skill: "Cloud Security Monitoring", investigation: "CloudTrail investigation" },
        { lab: "Bike", technique: "SSTI", attck: "T1190", skill: "Web Exploit Detection", investigation: "Apache/Nginx logs" },
        { lab: "Funnel", technique: "SQL Enumeration", attck: "T1046", skill: "Database Activity Monitoring", investigation: "SQL logs" },
        { lab: "Archetype", technique: "SMB + WinRM", attck: "T1021", skill: "Lateral Movement Detection", investigation: "PowerShell & Security logs" },
        { lab: "Oopsie", technique: "IDOR + Web Exploitation", attck: "T1190", skill: "HTTP Log Analysis", investigation: "Web access logs" },
        { lab: "Vaccine", technique: "SQLi + Privilege Escalation", attck: "T1068", skill: "Multi-stage Attack Analysis", investigation: "Correlate web + Linux logs" },
        { lab: "Unified", technique: "Log4Shell", attck: "T1190", skill: "Log4j Detection", investigation: "IDS + web logs" }
      ],
      reportId: "rep-4"
    },
    {
      id: "proj-5",
      title: "Enterprise Detection Engineering Challenge",
      subtitle: "Lab 3 — Wazuh Custom Rules",
      status: "In Progress",
      summary: "Wrote custom Wazuh detection rules for the fictional 'Axeronix' SOC: encoded PowerShell, brute-force logins, and administrator account creation — with rule logic, MITRE mapping and live validation.",
      tools: ["Wazuh", "Windows Event Logs", "Sysmon"],
      mitre: ["T1059.001", "T1110", "T1136"],
      steps: [
        "Detect suspicious PowerShell (encoded commands)",
        "Detect multiple failed logins (brute force)",
        "Detect Administrator account creation",
        "Deliverables: rule logic, XML, MITRE mapping, severity, testing validation, live demo"
      ],
      reportId: "rep-5"
    }
  ],

  // ---------------- SOC REPORTS ----------------
  reports: [
    {
      id: "rep-1",
      projectId: "proj-1",
      title: "Firewall Integration & Monitoring — Report",
      date: "",
      summary: "Add your write-up: firewall configuration, security rules created, traffic analysis, Wazuh alerts and logs, findings and recommendations.",
      fileUrl: "",
      tags: ["Firewall", "Wazuh", "Network Security"]
    },
    {
      id: "rep-2",
      projectId: "proj-2",
      title: "Malware Analysis & Incident Response — Report",
      date: "",
      summary: "Add your write-up: detection details, log analysis, observed malware activity, security findings, and the full incident response plan.",
      fileUrl: "",
      tags: ["Malware Analysis", "Incident Response"]
    },
    {
      id: "rep-3",
      projectId: "proj-3",
      title: "Honeypot Monitoring — Report",
      date: "",
      summary: "Add your write-up: honeypot configuration, attacker activity observed, alerts generated, and findings.",
      fileUrl: "",
      tags: ["Honeypot", "Wazuh"]
    },
    {
      id: "rep-4",
      projectId: "proj-4",
      title: "HTB Blue Team Labs — Consolidated Report",
      date: "",
      summary: "Add your write-up summarizing the 17 labs: techniques observed, MITRE mapping, and blue-team investigation notes for each.",
      fileUrl: "",
      tags: ["HTB", "Blue Team"]
    },
    {
      id: "rep-5",
      projectId: "proj-5",
      title: "Enterprise Detection Engineering — Report",
      date: "",
      summary: "Add your write-up: rule logic, XML rules, MITRE mapping, severity levels, and testing/validation results for each of the three detections.",
      fileUrl: "",
      tags: ["Wazuh", "Detection Engineering"]
    }
  ],

  // ---------------- DETECTION RULES ----------------
  detectionRules: [
    {
      id: "rule-1",
      name: "Suspicious Encoded PowerShell Execution",
      mitre: "T1059.001",
      severity: "High",
      logSource: "Windows Event Log / PowerShell Operational + Sysmon",
      description: "Flags PowerShell processes launched with -enc / -EncodedCommand or Base64-encoded arguments, a common obfuscation technique.",
      status: "Draft"
    },
    {
      id: "rule-2",
      name: "Multiple Failed Logins (Brute Force)",
      mitre: "T1110",
      severity: "Medium",
      logSource: "Windows Security Log (4625) / Auth logs",
      description: "Correlates repeated authentication failures from the same source within a short window to flag brute-force attempts.",
      status: "Draft"
    },
    {
      id: "rule-3",
      name: "New Administrator Account Created",
      mitre: "T1136.001",
      severity: "Critical",
      logSource: "Windows Security Log (4720 / 4732)",
      description: "Alerts when a new user is created and added to the local/domain Administrators group — a common privilege escalation and persistence step.",
      status: "Draft"
    }
  ],

  // ---------------- PLAYBOOKS ----------------
  playbooks: [
    {
      id: "pb-1",
      title: "Malware Incident Response Playbook",
      relatedProject: "proj-2",
      phases: [
        { name: "Detection", detail: "Identify malware-related alerts from Wazuh and firewall logs." },
        { name: "Analysis", detail: "Analyze collected logs for IOCs, IOAs, and malware behavior; identify affected assets." },
        { name: "Containment", detail: "Isolate affected hosts/VMs from the network to stop lateral movement." },
        { name: "Eradication", detail: "Remove the malware and close the entry vector used for initial access." },
        { name: "Recovery", detail: "Restore affected systems and validate normal operation." },
        { name: "Lessons Learned", detail: "Document findings and update detections/policies to prevent recurrence." }
      ]
    }
  ],

  // ---------------- CERTIFICATIONS ----------------
  certifications: []
};
