import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { Admin } from './types'

// Get database URL from environment variables
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || process.env.DATABASE_AUTHENTICATED_URL
  if (!url) {
    throw new Error('No database connection string found. Please set DATABASE_URL or DATABASE_AUTHENTICATED_URL environment variable.')
  }
  return url
}

// Initialize database connection lazily
let sql: NeonQueryFunction<boolean, boolean> | null = null

const getSql = (): NeonQueryFunction<boolean, boolean> => {
  if (!sql) {
    sql = neon(getDatabaseUrl())
  }
  return sql
}

/**
 * Admin Service for managing admin users and role-based access control
 */
export class AdminService {
  /**
   * Get admin user by Clerk ID
   */
  static async getAdminByClerkId(clerkId: string): Promise<Admin | null> {
    try {
      const sql = getSql()
      const result = await sql`
        SELECT 
          id,
          clerk_id as "clerkId",
          email,
          name,
          role,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM admins 
        WHERE clerk_id = ${clerkId}
      ` as Admin[]
      
      return result[0] || null
    } catch (error) {
      console.error('Error fetching admin by Clerk ID:', error)
      throw new Error('Failed to fetch admin user')
    }
  }

  /**
   * Create or update admin user from Clerk webhook
   */
  static async upsertAdmin(clerkId: string, email: string, name: string): Promise<Admin> {
    try {
      const sql = getSql()
      const result = await sql`
        INSERT INTO admins (clerk_id, email, name, role, created_at, updated_at)
        VALUES (${clerkId}, ${email}, ${name}, 'admin', NOW(), NOW())
        ON CONFLICT (clerk_id) 
        DO UPDATE SET 
          email = EXCLUDED.email,
          name = EXCLUDED.name,
          updated_at = NOW()
        RETURNING 
          id,
          clerk_id as "clerkId",
          email,
          name,
          role,
          created_at as "createdAt",
          updated_at as "updatedAt"
      ` as Admin[]
      
      return result[0]
    } catch (error) {
      console.error('Error upserting admin user:', error)
      throw new Error('Failed to create/update admin user')
    }
  }

  /**
   * Delete admin user
   */
  static async deleteAdmin(clerkId: string): Promise<boolean> {
    try {
      const sql = getSql()
      const result = await sql`
        DELETE FROM admins WHERE clerk_id = ${clerkId}
        RETURNING id
      ` as { id: number }[]
      
      return result.length > 0
    } catch (error) {
      console.error('Error deleting admin user:', error)
      throw new Error('Failed to delete admin user')
    }
  }

  /**
   * Check if user has admin role
   */
  static async isAdmin(clerkId: string): Promise<boolean> {
    try {
      const admin = await this.getAdminByClerkId(clerkId)
      return admin?.role === 'admin'
    } catch (error) {
      console.error('Error checking admin role:', error)
      return false
    }
  }

  /**
   * Get all admin users
   */
  static async getAllAdmins(): Promise<Admin[]> {
    try {
      const sql = getSql()
      const result = await sql`
        SELECT 
          id,
          clerk_id as "clerkId",
          email,
          name,
          role,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM admins 
        ORDER BY created_at DESC
      ` as Admin[]
      
      return result
    } catch (error) {
      console.error('Error fetching all admins:', error)
      throw new Error('Failed to fetch admin users')
    }
  }

  /**
   * Update admin role (for future role management)
   */
  static async updateAdminRole(clerkId: string, role: string): Promise<Admin | null> {
    try {
      const sql = getSql()
      const result = await sql`
        UPDATE admins 
        SET 
          role = ${role},
          updated_at = NOW()
        WHERE clerk_id = ${clerkId}
        RETURNING 
          id,
          clerk_id as "clerkId",
          email,
          name,
          role,
          created_at as "createdAt",
          updated_at as "updatedAt"
      ` as Admin[]
      
      return result[0] || null
    } catch (error) {
      console.error('Error updating admin role:', error)
      throw new Error('Failed to update admin role')
    }
  }

  /**
   * Get admin statistics
   */
  static async getAdminStats(): Promise<{
    totalAdmins: number
    recentLogins: number
    activeAdmins: number
  }> {
    try {
      const sql = getSql()
      const totalResult = await sql`
        SELECT COUNT(*) as count FROM admins
      ` as { count: string }[]
      
      const recentResult = await sql`
        SELECT COUNT(*) as count 
        FROM admins 
        WHERE updated_at >= NOW() - INTERVAL '7 days'
      ` as { count: string }[]
      
      return {
        totalAdmins: parseInt(totalResult[0]?.count || '0'),
        recentLogins: parseInt(recentResult[0]?.count || '0'),
        activeAdmins: parseInt(totalResult[0]?.count || '0') // For now, all admins are considered active
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      throw new Error('Failed to fetch admin statistics')
    }
  }
}