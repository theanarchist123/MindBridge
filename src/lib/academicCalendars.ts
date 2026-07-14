export interface AcademicEvent {
  type: "midterms" | "finals" | "placements";
  name: string;
}

export function getAcademicStressPeriod(college: string, date: Date = new Date()): AcademicEvent | null {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  
  // Normalize college name for matching
  const c = college.toLowerCase();

  // If the college is explicitly "NIT Trichy" or similar engineering college
  if (c.includes("nit") || c.includes("iit") || c.includes("bits") || c.includes("engineering")) {
    if (month === 9 || month === 2) return { type: "midterms", name: "Midterm Season" }; // Oct, Mar
    if (month === 10 || month === 11) return { type: "finals", name: "Fall Finals Week" }; // Nov, Dec
    if (month === 3 || month === 4) return { type: "finals", name: "Spring Finals Week" }; // Apr, May
    if (month === 7 || month === 8) return { type: "placements", name: "Placement Season" }; // Aug, Sep
  }
  
  // Delhi University (DU)
  if (c.includes("du") || c.includes("delhi university")) {
    if (month === 10 || month === 11) return { type: "finals", name: "Semester Finals" }; // Nov/Dec
    if (month === 4 || month === 5) return { type: "finals", name: "Semester Finals" }; // May/Jun
  }

  // Generic / Default Fallback
  if (month === 11 || month === 4) return { type: "finals", name: "Finals Week" }; // Dec, May
  if (month === 9 || month === 2) return { type: "midterms", name: "Midterms" }; // Oct, Mar
  
  return null;
}
