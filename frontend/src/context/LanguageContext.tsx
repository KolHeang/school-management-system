'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'km';

interface Translations {
  [key: string]: {
    en: string;
    km: string;
  };
}

export const translations: Translations = {
  // Sidebar & Navigation
  dashboard: { en: 'Dashboard', km: 'ផ្ទាំងគ្រប់គ្រង' },
  students: { en: 'Students', km: 'សិស្ស' },
  teachers: { en: 'Teachers', km: 'គ្រូបង្រៀន' },
  classes: { en: 'Classes', km: 'ថ្នាក់រៀន' },
  attendance: { en: 'Attendance', km: 'វត្តមាន' },
  users: { en: 'Users', km: 'អ្នកប្រើប្រាស់' },
  roles: { en: 'Roles', km: 'តួនាទី' },
  logout: { en: 'Logout', km: 'ចាកចេញ' },

  // Common Actions
  add: { en: 'Add New', km: 'បន្ថែមថ្មី' },
  edit: { en: 'Edit', km: 'កែសម្រួល' },
  delete: { en: 'Delete', km: 'លុប' },
  save: { en: 'Save', km: 'រក្សាទុក' },
  cancel: { en: 'Cancel', km: 'បោះបង់' },
  back: { en: 'Back', km: 'ត្រឡប់ក្រោយ' },
  search: { en: 'Search...', km: 'ស្វែងរក...' },
  loading: { en: 'Loading...', km: 'កំពុងផ្ទុក...' },
  unassigned: { en: 'Unassigned', km: 'មិនទាន់មានថ្នាក់' },

  // Students Page
  studentsManagement: { en: 'Students Management', km: 'ការគ្រប់គ្រងសិស្ស' },
  studentSubtitle: { en: 'Manage and view all students in the academy.', km: 'គ្រប់គ្រង និងមើលព័ត៌មានសិស្សទាំងអស់ក្នុងសាលា។' },
  addStudent: { en: 'Add Student', km: 'បន្ថែមសិស្ស' },
  subject: { en: 'Subject', km: 'មុខវិជ្ជា' },
  className: { en: 'Class Name', km: 'ឈ្មោះថ្នាក់' },
  grade: { en: 'Grade', km: 'កម្រិត' },
  noTeacher: { en: 'No Teacher Assigned', km: 'មិនទាន់មានគ្រូ' },
  studentCount: { en: 'Students Count', km: 'ចំនួនសិស្ស' },
  classSubtitle: { en: 'Organize and manage academy classes.', km: 'រៀបចំ និងគ្រប់គ្រងថ្នាក់រៀនក្នុងសាលា។' },
  username: { en: 'Username', km: 'ឈ្មោះអ្នកប្រើប្រាស់' },
  noRole: { en: 'No Role Assigned', km: 'មិនទាន់មានតួនាទី' },
  userSubtitle: { en: 'System access and user accounts.', km: 'គ្រប់គ្រងគណនី និងការចូលប្រើប្រាស់ប្រព័ន្ធ។' },
  roleName: { en: 'Role Name', km: 'ឈ្មោះតួនាទី' },
  permissionCount: { en: 'Permissions Count', km: 'ចំនួនសិទ្ធិ' },
  roleSubtitle: { en: 'Define and assign system permissions.', km: 'កំណត់ និងផ្ដល់សិទ្ធិប្រើប្រាស់ប្រព័ន្ធ។' },
  attendanceSubtitle: { en: 'Track and manage daily student attendance.', km: 'តាមដាន និងគ្រប់គ្រងវត្តមានសិស្សប្រចាំថ្ងៃ។' },
  saveAttendance: { en: 'Save Attendance', km: 'រក្សាទុកវត្តមាន' },
  status: { en: 'Status', km: 'ស្ថានភាព' },
  present: { en: 'Present', km: 'វត្តមាន' },
  absent: { en: 'Absent', km: 'អវត្តមាន' },
  late: { en: 'Late', km: 'មកយឺត' },
  remarks: { en: 'Remarks', km: 'សម្គាល់' },
  addNote: { en: 'Add note...', km: 'បន្ថែមចំណាំ...' },
  noStudentsFound: { en: 'No students found in this class.', km: 'រកមិនឃើញសិស្សក្នុងថ្នាក់នេះទេ។' },
  selectClassToView: { en: 'Please select a class to view attendance.', km: 'សូមជ្រើសរើសថ្នាក់ដើម្បីមើលវត្តមាន។' },
  saveSuccess: { en: 'Attendance saved successfully!', km: 'រក្សាទុកវត្តមានបានជោគជ័យ!' },
  saveError: { en: 'Failed to save attendance.', km: 'មិនអាចរក្សាទុកវត្តមានបានទេ។' },
  date: { en: 'Date', km: 'កាលបរិច្ឆេទ' },
  viewAttendance: { en: 'View Attendance', km: 'មើលវត្តមាន' },
  actions: { en: 'Actions', km: 'សកម្មភាព' },
  personalInfo: { en: 'Personal Information', km: 'ព័ត៌មានផ្ទាល់ខ្លួន' },
  dob: { en: 'Date of Birth', km: 'ថ្ងៃខែឆ្នាំកំណើត' },
  province: { en: 'Province/City', km: 'ខេត្ត/ក្រុង' },
  district: { en: 'District/Khan', km: 'ស្រុក/ខណ្ឌ' },
  commune: { en: 'Commune/Sangkat', km: 'ឃុំ/សង្កាត់' },
  village: { en: 'Village', km: 'ភូមិ' },
  photo: { en: 'Photo', km: 'រូបថត' },
  addressInfo: { en: 'Address Information', km: 'ព័ត៌មានអាសយដ្ឋាន' },
  uploadPhoto: { en: 'Upload Photo', km: 'បង្ហោះរូបថត' },

  // Forms
  fullName: { en: 'Full Name', km: 'ឈ្មោះពេញ' },
  email: { en: 'Email Address', km: 'អាសយដ្ឋានអ៊ីមែល' },
  phone: { en: 'Phone Number', km: 'លេខទូរស័ព្ទ' },
  gender: { en: 'Gender', km: 'ភេទ' },
  male: { en: 'Male', km: 'ប្រុស' },
  female: { en: 'Female', km: 'ស្រី' },
  other: { en: 'Other', km: 'ផ្សេងៗ' },
  classroom: { en: 'Classroom', km: 'ថ្នាក់រៀន' },
  selectClass: { en: 'Select a class...', km: 'ជ្រើសរើសថ្នាក់រៀន...' },
  studentCode: { en: 'Student Code', km: 'លេខកូដសិស្ស' },
  fullNameEn: { en: 'Full Name (English)', km: 'ឈ្មោះពេញ (អង់គ្លេស)' },
  fullNameKh: { en: 'Full Name (Khmer)', km: 'ឈ្មោះពេញ (ខ្មែរ)' },
  morning: { en: 'Morning', km: 'ព្រឹក' },
  afternoon: { en: 'Afternoon', km: 'ល្ងាច' },
  address: { en: 'Address', km: 'អាសយដ្ឋាន' },
  action: { en: 'Action', km: 'សកម្មភាព' },
  subjects: { en: 'Subjects', km: 'មុខវិជ្ជា' },
  addSubject: { en: 'Add subject...', km: 'បន្ថែមមុខវិជ្ជា...' },
  bio: { en: 'Biography', km: 'ប្រវត្តិ' },
  teacherSubtitle: { en: 'Manage and view all teachers in the academy.', km: 'គ្រប់គ្រង និងមើលព័ត៌មានគ្រូបង្រៀនទាំងអស់ក្នុងសាលា។' },
  addTeacher: { en: 'Add Teacher', km: 'បន្ថែមគ្រូបង្រៀន' },
  subjectCode: { en: 'Subject Code', km: 'លេខកូដមុខវិជ្ជា' },
  subjectsManagement: { en: 'Subjects Management', km: 'ការគ្រប់គ្រងមុខវិជ្ជា' },
  subjectSubtitle: { en: 'Manage academic subjects and curriculum.', km: 'គ្រប់គ្រងមុខវិជ្ជាសិក្សា និងកម្មវិធីសិក្សា។' },
  description: { en: 'Description', km: 'ការពិពណ៌នា' },
  viewReport: { en: 'View Report', km: 'មើលរបាយការណ៍' },
  attendanceReport: { en: 'Attendance Report', km: 'របាយការណ៍វត្តមាន' },
  startDate: { en: 'Start Date', km: 'ថ្ងៃចាប់ផ្ដើម' },
  endDate: { en: 'End Date', km: 'ថ្ងៃបញ្ចប់' },
  presentCount: { en: 'Present', km: 'វត្តមាន' },
  absentCount: { en: 'Absent', km: 'អវត្តមាន' },
  lateCount: { en: 'Late', km: 'យឺត' },
  excusedCount: { en: 'Excused', km: 'ច្បាប់' },
  reports: { en: 'Reports', km: 'របាយការណ៍' },
  reportsSubtitle: { en: 'Access comprehensive academy reports and analytics.', km: 'ចូលប្រើរបាយការណ៍សាលា និងការវិភាគគ្រប់ជ្រុងជ្រោយ។' },
  studentReport: { en: 'Student Report', km: 'របាយការណ៍សិស្ស' },
  teacherReport: { en: 'Teacher Report', km: 'របាយការណ៍គ្រូ' },
  reportsDashboard: { en: 'Reports Dashboard', km: 'ផ្ទាំងគ្រប់គ្រងរបាយការណ៍' },
  workload: { en: 'Workload', km: 'បន្ទុកការងារ' },
  studentStats: { en: 'Student Statistics', km: 'ស្ថិតិសិស្ស' },
  teacherStats: { en: 'Teacher Statistics', km: 'ស្ថិតិគ្រូ' },
  totalCount: { en: 'Total Count', km: 'ចំនួនសរុប' },
  welcomeBack: { en: 'Welcome back', km: 'សូមស្វាគមន៍ត្រឡប់មកវិញ' },
  admin: { en: 'Admin', km: 'អ្នកគ្រប់គ្រង' },
  dashboardSubtitle: { en: "Here is what's happening today.", km: 'នេះគឺជាអ្វីដែលកំពុងកើតឡើងនៅថ្ងៃនេះ។' },
  totalStudents: { en: 'Total Students', km: 'សិស្សសរុប' },
  totalTeachers: { en: 'Total Teachers', km: 'គ្រូបង្រៀនសរុប' },
  totalClassrooms: { en: 'Total Classes', km: 'ថ្នាក់រៀនសរុប' },
  attendanceRate: { en: 'Attendance Rate', km: 'អត្រាវត្តមាន' },
  recentActivity: { en: 'Recent Activity', km: 'សកម្មភាពថ្មីៗ' },
  upcomingEvents: { en: 'Upcoming Events', km: 'ព្រឹត្តិការណ៍ខាងមុខ' },
  noRecentActivity: { en: 'No recent activity to show.', km: 'មិនមានសកម្មភាពថ្មីៗបង្ហាញទេ។' },
  noUpcomingEvents: { en: 'No upcoming events.', km: 'មិនមានព្រឹត្តិការណ៍ខាងមុខទេ។' },
  addClassroom: { en: 'Add New Classroom', km: 'បន្ថែមថ្នាក់រៀនថ្មី' },
  classroomInfo: { en: 'Classroom Information', km: 'ព័ត៌មានថ្នាក់រៀន' },
  className: { en: 'Class Name', km: 'ឈ្មោះថ្នាក់' },
  classNamePlaceholder: { en: 'e.g. Grade 10 A', km: 'ឧទាហរណ៍៖ ថ្នាក់ទី ១០ អា' },
  gradeLevel: { en: 'Grade Level', km: 'កម្រិតថ្នាក់' },
  gradeLevelPlaceholder: { en: 'e.g. 10', km: 'ឧទាហរណ៍៖ ១០' },
  assignTeacher: { en: 'Assign Teacher', km: 'ចាត់តាំងគ្រូបង្រៀន' },
  selectTeacher: { en: 'Select a teacher...', km: 'ជ្រើសរើសគ្រូបង្រៀន...' },
  creating: { en: 'Creating...', km: 'កំពុងបង្កើត...' },
  createClass: { en: 'Create Class', km: 'បង្កើតថ្នាក់' },
  addUser: { en: 'Add New User', km: 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី' },
  accountInfo: { en: 'Account Information', km: 'ព័ត៌មានគណនី' },
  username: { en: 'Username', km: 'ឈ្មោះអ្នកប្រើប្រាស់' },
  password: { en: 'Password', km: 'លេខសម្ងាត់' },
  assignRole: { en: 'Assign Role', km: 'ចាត់តាំងតួនាទី' },
  selectRole: { en: 'Select a role...', km: 'ជ្រើសរើសតួនាទី...' },
  createUser: { en: 'Create User', km: 'បង្កើតអ្នកប្រើប្រាស់' },
  enterUsername: { en: 'Enter username', km: 'បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់' },
  enterPassword: { en: 'Enter password', km: 'បញ្ចូលលេខសម្ងាត់' },
  addRole: { en: 'Add New Role', km: 'បន្ថែមតួនាទីថ្មី' },
  roleDetails: { en: 'Role Details', km: 'ព័ត៌មានលម្អិតអំពីតួនាទី' },
  roleName: { en: 'Role Name', km: 'ឈ្មោះតួនាទី' },
  roleNamePlaceholder: { en: 'e.g. Moderator', km: 'ឧទាហរណ៍៖ អ្នកសម្របសម្រួល' },
  assignPermissions: { en: 'Assign Permissions', km: 'ចាត់តាំងសិទ្ធិអនុញ្ញាត' },
  createRole: { en: 'Create Role', km: 'បង្កើតតួនាទី' },
  daySun: { en: 'Sun', km: 'អា' },
  dayMon: { en: 'Mon', km: 'ច' },
  dayTue: { en: 'Tue', km: 'អ' },
  dayWed: { en: 'Wed', km: 'ព' },
  dayThu: { en: 'Thu', km: 'ព្រ' },
  dayFri: { en: 'Fri', km: 'សុ' },
  daySat: { en: 'Sat', km: 'ស' },
  month1: { en: 'January', km: 'មករា' },
  month2: { en: 'February', km: 'កុម្ភៈ' },
  month3: { en: 'March', km: 'មីនា' },
  month4: { en: 'April', km: 'មេសា' },
  month5: { en: 'May', km: 'ឧសភា' },
  month6: { en: 'June', km: 'មិថុនា' },
  month7: { en: 'July', km: 'កក្កដា' },
  month8: { en: 'August', km: 'សីហា' },
  month9: { en: 'September', km: 'កញ្ញា' },
  month10: { en: 'October', km: 'តុលា' },
  month11: { en: 'November', km: 'វិច្ឆិកា' },
  month12: { en: 'December', km: 'ធ្នូ' },
  showingAllStudents: { en: 'Showing all students from all classes.', km: 'កំពុងបង្ហាញសិស្សទាំងអស់មកពីគ្រប់ថ្នាក់។' },
  
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
