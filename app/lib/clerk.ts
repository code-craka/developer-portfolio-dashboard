import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

/**
 * Server-side authentication utilities for Clerk
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
 * Get the current user data
 */
export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated() {
  const { userId } = await auth()
  return !!userId
}

/**
 * Get user session information
 */
export async function getAuthSession() {
  const { userId, sessionId } = await auth()
  return { userId, sessionId }
}