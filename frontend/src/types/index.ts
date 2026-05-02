export interface Teacher {
  id: number;
  full_name_en: string;
  full_name_kh: string;
  email: string;
  phone: string;
  subjects: string[];
  bio?: string;
  photo?: string;
}

export interface Classroom {
  id: number;
  name: string;
  grade: string;
  teacher?: Teacher;
  students?: Student[];
}

export interface Province {
  id: number;
  name_km: string;
  name_en: string;
}

export interface District {
  id: number;
  name_km: string;
  name_en: string;
}

export interface Commune {
  id: number;
  name_km: string;
  name_en: string;
}

export interface Village {
  id: number;
  name_km: string;
  name_en: string;
}

export interface Student {
  id: number;
  student_code: string;
  full_name_en: string;
  full_name_kh: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  classroom?: Classroom;
  province?: Province;
  district?: District;
  commune?: Commune;
  village?: Village;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}

export interface User {
  id: number;
  username: string;
  role?: Role;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

export interface Attendance {
  id: number;
  date: string;
  morning_status: AttendanceStatus;
  afternoon_status: AttendanceStatus;
  remarks?: string;
  student?: Student;
}
