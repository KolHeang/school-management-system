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
