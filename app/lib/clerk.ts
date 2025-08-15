import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminService } from './admin-service'

/**
 * Server-side authentication utilities for Clerk with role-based access control
 */

/**
 * Get the current authenticated user or redirect to sign-in
 */
export async function requireAuth() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/admin/login')
  }
  
  return userId
}

/**
 * Require admin authentication and role verification
 */
export async function requireAdminAuth() {
  const userId = await requireAuth()
  
  // Check if user has admin role in database
  const isAdmin = await AdminService.isAdmin(userId)
  
  if (!isAdmin) {
    // User is authenticated but not an admin
    redirect('/admin/login?error=unauthorized')
  }
  
  return userId
}

/**
 * Get the current user data
 */
export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

/**
 * Get current admin user with role information
 */
export async function getCurrentAdmin() {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }
  
  const admin = await AdminService.getAdminByClerkId(user.id)
  
  return {
    clerkUser: user,
    adminData: admin
  }
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated() {
  const { userId } = await auth()
  return !!userId
}

/**
 * Check if the current user is an admin
 */
export async function isCurrentUserAdmin() {
  const { userId } = await auth()
  
  if (!userId) {
    return false
  }
  
  return await AdminService.isAdmin(userId)
}

/**
 * Get user session information
 */
export async function getAuthSession() {
  const { userId, sessionId } = await auth()
  return { userId, sessionId }
}

/**
 * Get comprehensive auth context for admin operations
 */
export async function getAdminAuthContext() {
  const { userId, sessionId } = await auth()
  
  if (!userId) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      admin: null,
      sessionId: null
    }
  }
  
  const user = await currentUser()
  const admin = await AdminService.getAdminByClerkId(userId)
  
  return {
    isAuthenticated: true,
    isAdmin: !!admin && admin.role === 'admin',
    user,
    admin,
    sessionId
  }
}