export const education = {
  institution: "Chaitanya Bharathi Institute of Technology",
  shortInstitution: "CBIT",
  location: "Hyderabad, Telangana, India",
  city: "Hyderabad",
  region: "Telangana",
  country: "India",
  degree: "Bachelor of Technology",
  degreeShort: "B.Tech",
  department: "Artificial Intelligence and Data Science",
  specialization: "Artificial Intelligence & Data Science",
  specializationLines: ["Artificial Intelligence", "& Data Science"],
  streamShort: "AI & Data Science",
  stream:
    "Computer Science / Artificial Intelligence and Data Science specialization",
  status: "Graduated",
  graduation: 2026,
  cgpa: 7.5,
  cgpaScale: 10,
  approximate: true,
  source:
    "Academic information supplied by the portfolio owner, November 2026.",
  disciplines: [
    {
      id: "01",
      title: "Artificial Intelligence",
      subjects: [
        "Artificial Intelligence",
        "Machine Learning",
        "Deep Learning",
      ],
    },
    {
      id: "02",
      title: "Computational Foundation",
      subjects: [
        "Python Programming",
        "Data Structures and Algorithms",
        "Object-Oriented Programming",
      ],
    },
    {
      id: "03",
      title: "Data and Information Systems",
      subjects: ["Data Science", "Database Management Systems"],
    },
    {
      id: "04",
      title: "Systems and Applications",
      subjects: [
        "Backend Development",
        "Mobile Application Development",
        "Cloud Infrastructure",
      ],
    },
  ],
  achievements: [
    {
      id: "01",
      title: "Aurora University Hackathon",
      recognition: "Winner",
      year: 2024,
    },
    {
      id: "02",
      title: "Smart India Hackathon",
      recognition: "Finalist",
      year: 2023,
    },
    {
      id: "03",
      title: "BITS AI Hackathon",
      recognition: "Finalist",
      year: 2023,
    },
  ],
};

export function educationCaseAt(progress) {
  return Math.max(0, Math.min(3, Math.floor((progress - .18) / .21)));
}

export function fitEducationFrame(width, height, caseMode = false) {
  const w = Math.max(1, width), h = Math.max(1, height), mobile = w <= 820;
  let scale = Math.max(w / 1440, h / 810), x = (w - 1440 * scale) / 2, y = 0;
  if (mobile && !caseMode) { scale = Math.min(w / 650, .62 * h / 810); x = w / 2 - 805 * scale; y = h - 790 * scale; }
  else if (caseMode) {
    const u = Math.min(w / 1440, h / 900), top = 66 * u, fit = (h - top - 28 * u) / (762 - 79);
    if (fit >= scale) y = Math.min(0, Math.max(h - 810 * scale, top - 79 * scale));
    else { scale = Math.max(.01, fit); y = top - 79 * scale; }
    x = (w - 1440 * scale) / 2;
  }
  const vl = Math.max(0, -x / scale), vr = Math.min(1440, (w - x) / scale), pad = 18 / scale, vb = (h - y) / scale;
  return { scale, x, y, visibleLeft: vl, wordmarkWidth: Math.max(1, vr - vl - 1.2 * pad), badgeLeft: Math.min(986, vr - pad - 417), badgeTop: Math.min(-165, vb - 56 / scale - 935), scriptLeft: vl + pad + 70 };
}
