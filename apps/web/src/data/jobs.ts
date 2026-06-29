export type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  level: string;
  skills: string[];
  salary?: string;
  url?: string;
};

// Vacantes de ejemplo en empresas tech reales de Vancouver / Canadá.
export const SAMPLE_JOBS: Job[] = [
  { id: 'j-mogo', title: 'Junior Java Developer', company: 'Mogo', city: 'Vancouver', level: 'Junior', skills: ['Java', 'Spring Boot', 'SQL', 'Git'], salary: 'CAD 65-80k' },
  { id: 'j-clio', title: 'Backend Developer (Java)', company: 'Clio', city: 'Vancouver', level: 'Junior', skills: ['Java', 'Spring Boot', 'REST', 'SQL'], salary: 'CAD 75-90k' },
  { id: 'j-sap', title: 'Software Developer Co-op', company: 'SAP Labs', city: 'Vancouver', level: 'Junior', skills: ['Java', 'Git', 'SQL'], salary: 'CAD 60-70k' },
  { id: 'j-hoot', title: 'Full Stack Developer', company: 'Hootsuite', city: 'Vancouver', level: 'Intermediate', skills: ['Java', 'React', 'Docker', 'SQL', 'Git'], salary: 'CAD 80-100k' },
  { id: 'j-trulioo', title: 'Junior Backend Engineer', company: 'Trulioo', city: 'Vancouver', level: 'Junior', skills: ['Java', 'Spring Boot', 'Docker', 'SQL', 'Git'], salary: 'CAD 70-85k' },
  { id: 'j-later', title: 'Full Stack Engineer (Remoto Canadá)', company: 'Later', city: 'Remoto Canadá', level: 'Intermediate', skills: ['React', 'Java', 'Docker', 'Git', 'Inglés'], salary: 'CAD 85-110k' },
];

// Enlaces de búsqueda real con filtro Vancouver + Java ya aplicado.
export const JOB_SEARCH_LINKS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search/?keywords=Java%20Developer&location=Vancouver%2C%20British%20Columbia%2C%20Canada' },
  { name: 'Indeed CA', url: 'https://ca.indeed.com/jobs?q=Java+Developer&l=Vancouver%2C+BC' },
  { name: 'Job Bank Canada', url: 'https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=java+developer&locationstring=Vancouver%2C+BC' },
];
