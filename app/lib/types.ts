import { ObjectId } from 'mongodb'

export interface Project {
  _id?: ObjectId
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  demoUrl?: string
  imageUrl: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Admin {
  _id?: ObjectId
  email: string
  password: string
  name: string
  createdAt: Date
}

export interface ContactMessage {
  _id?: ObjectId
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}