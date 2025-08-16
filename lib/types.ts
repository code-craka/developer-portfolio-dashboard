// Core data models for the developer portfolio dashboard
// Using PostgreSQL with NeonDB and Clerk authentication

export interface Project {
  id: number;                 // PostgreSQL auto-increment primary key
  title: string;
  description: string;
  techStack: string[];        // JSON array in PostgreSQL
  githubUrl?: string;
  demoUrl?: string;
  imageUrl: string;           // Relative path: /uploads/projects/filename.jpg
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: number;                 // PostgreSQL auto-increment primary key
  clerkId: string;            // Clerk user ID
  email: string;              // From Clerk
  name: string;               // From Clerk
  role: 'admin';              // Application-specific role
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: number;                 // PostgreSQL auto-increment primary key
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Experience {
  id: number;                 // PostgreSQL auto-increment primary key
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;             // null for current position
  description: string;
  achievements: string[];     // JSON array in PostgreSQL
  technologies: string[];     // JSON array in PostgreSQL
  companyLogo?: string;       // Optional company logo path
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

// Form validation interfaces
export interface ProjectFormData {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  imageUrl: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ExperienceFormData {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements: string[];
  technologies: string[];
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
}