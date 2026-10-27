export const ENGINEERING_DEPARTMENTS = [
  {
    code: 'CSE',
    name: 'Computer Science and Engineering (CSE)',
    aliases: [
      'CSE',
      'Computer Science',
      'Computer Science & Engineering',
      'Computer Science and Engineering',
      'Computer Science and Engineering (CSE)',
    ],
  },
  {
    code: 'ECE',
    name: 'Electronics and Communication Engineering (ECE)',
    aliases: [
      'ECE',
      'Electronics',
      'Electronics & Communication Engineering',
      'Electronics and Communication Engineering',
      'Electronics and Communication Engineering (ECE)',
    ],
  },
  {
    code: 'EEE',
    name: 'Electrical and Electronics Engineering (EEE)',
    aliases: [
      'EEE',
      'Electrical',
      'Electrical & Electronics Engineering',
      'Electrical and Electronics Engineering',
      'Electrical and Electronics Engineering (EEE)',
    ],
  },
  {
    code: 'IT',
    name: 'Information Technology (IT)',
    aliases: [
      'IT',
      'Information Technology',
      'Information Technology (IT)',
    ],
  },
  {
    code: 'AI_DS',
    name: 'Artificial Intelligence and Data Science (AI & DS)',
    aliases: [
      'AI_DS',
      'AI & DS',
      'AIDS',
      'AI and Data Science',
      'Artificial Intelligence and Data Science',
      'Artificial Intelligence & Data Science',
      'Artificial Intelligence and Data Science (AI & DS)',
    ],
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering (MECH)',
    aliases: [
      'MECH',
      'Mechanical',
      'Mechanical Engineering',
      'Mechanical Engineering (MECH)',
    ],
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering (CIVIL)',
    aliases: [
      'CIVIL',
      'Civil',
      'Civil Engineering',
      'Civil Engineering (CIVIL)',
    ],
  },
];

export const formatDepartmentDisplay = (deptNameOrCode) => {
  if (!deptNameOrCode) return '';
  const trimmed = String(deptNameOrCode).trim();
  for (const dept of ENGINEERING_DEPARTMENTS) {
    if (
      dept.code.toLowerCase() === trimmed.toLowerCase() ||
      dept.name.toLowerCase() === trimmed.toLowerCase() ||
      dept.aliases.some((a) => a.toLowerCase() === trimmed.toLowerCase())
    ) {
      return dept.name;
    }
  }
  return deptNameOrCode;
};

export const matchesDepartmentFilter = (notice, selectedDeptCode) => {
  if (!selectedDeptCode) return true;
  const deptConfig = ENGINEERING_DEPARTMENTS.find((d) => d.code === selectedDeptCode);
  if (!deptConfig) return true;

  // Check notice.departmentCode / notice.department?.code
  const noticeCode = notice.departmentCode || notice.department?.code;
  if (noticeCode && noticeCode.toUpperCase() === deptConfig.code) {
    return true;
  }

  // Check notice.departmentName / notice.department?.departmentName
  const deptName = notice.departmentName || notice.department?.departmentName || '';
  if (!deptName) return false;

  const normalized = String(deptName).toLowerCase().trim();
  return (
    deptConfig.aliases.some((a) => a.toLowerCase().trim() === normalized) ||
    normalized.includes(deptConfig.code.toLowerCase())
  );
};
