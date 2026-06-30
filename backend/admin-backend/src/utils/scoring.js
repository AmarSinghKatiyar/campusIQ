export const SCORE_WEIGHTS = {
  cgpa: 0.4,
  aptitude: 0.25,
  communication: 0.2,
  projects: 0.15,
};

const safeNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 0;
  }
  return Number(value);
};

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

export const computeCompositeScore = (student = {}) => {
  const data = student.toObject ? student.toObject() : student;

  const cgpa = clamp(safeNumber(data.cgpa) / 10);
  const aptitude = clamp(safeNumber(data.aptitude) / 100);
  const communication = clamp(safeNumber(data.communication) / 100);
  const projects = clamp(safeNumber(data.projects) / 100);

  const score =
    cgpa * SCORE_WEIGHTS.cgpa +
    aptitude * SCORE_WEIGHTS.aptitude +
    communication * SCORE_WEIGHTS.communication +
    projects * SCORE_WEIGHTS.projects;

  return Math.round(score * 100);
};

export const withScore = (student) => {
  const data = student.toObject ? student.toObject() : student;
  return {
    ...data,
    score: computeCompositeScore(data),
  };
};
