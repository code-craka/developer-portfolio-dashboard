import { db } from './db';
import { Project, Experience, ContactMessage, Admin } from './types';

// Project CRUD Operations
export class ProjectService {
  // Get all projects
  static async getAllProjects(): Promise<Project[]> {
    const query = `
      SELECT 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM projects 
      ORDER BY featured DESC, created_at DESC
    `;
    return await db.query<Project>(query);
  }

  // Get featured projects
  static async getFeaturedProjects(): Promise<Project[]> {
    const query = `
      SELECT 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM projects 
      WHERE featured = true
      ORDER BY created_at DESC
    `;
    return await db.query<Project>(query);
  }

  // Get project by ID
  static async getProjectById(id: number): Promise<Project | null> {
    const query = `
      SELECT 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM projects 
      WHERE id = $1
    `;
    const results = await db.query<Project>(query, [id]);
    return results.length > 0 ? results[0] : null;
  }

  // Create new project
  static async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const query = `
      INSERT INTO projects (title, description, tech_stack, github_url, demo_url, image_url, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
    const results = await db.query<Project>(query, [
      project.title,
      project.description,
      JSON.stringify(project.techStack),
      project.githubUrl || null,
      project.demoUrl || null,
      project.imageUrl,
      project.featured
    ]);
    return results[0];
  }

  // Update project
  static async updateProject(id: number, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project | null> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      setClause.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.techStack !== undefined) {
      setClause.push(`tech_stack = $${paramIndex++}`);
      values.push(JSON.stringify(updates.techStack));
    }
    if (updates.githubUrl !== undefined) {
      setClause.push(`github_url = $${paramIndex++}`);
      values.push(updates.githubUrl);
    }
    if (updates.demoUrl !== undefined) {
      setClause.push(`demo_url = $${paramIndex++}`);
      values.push(updates.demoUrl);
    }
    if (updates.imageUrl !== undefined) {
      setClause.push(`image_url = $${paramIndex++}`);
      values.push(updates.imageUrl);
    }
    if (updates.featured !== undefined) {
      setClause.push(`featured = $${paramIndex++}`);
      values.push(updates.featured);
    }

    if (setClause.length === 0) {
      return await ProjectService.getProjectById(id);
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE projects 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        title,
        description,
        tech_stack as "techStack",
        github_url as "githubUrl",
        demo_url as "demoUrl",
        image_url as "imageUrl",
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const results = await db.query<Project>(query, values);
    return results.length > 0 ? results[0] : null;
  }

  // Delete project
  static async deleteProject(id: number): Promise<boolean> {
    const query = `DELETE FROM projects WHERE id = $1`;
    const results = await db.query(query, [id]);
    return (results as any).rowCount > 0;
  }
}

// Experience CRUD Operations
export class ExperienceService {
  // Get all experiences
  static async getAllExperiences(): Promise<Experience[]> {
    const query = `
      SELECT 
        id,
        company,
        position,
        start_date as "startDate",
        end_date as "endDate",
        description,
        achievements,
        technologies,
        company_logo as "companyLogo",
        location,
        employment_type as "employmentType",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM experiences 
      ORDER BY start_date DESC
    `;
    return await db.query<Experience>(query);
  }

  // Get experience by ID
  static async getExperienceById(id: number): Promise<Experience | null> {
    const query = `
      SELECT 
        id,
        company,
        position,
        start_date as "startDate",
        end_date as "endDate",
        description,
        achievements,
        technologies,
        company_logo as "companyLogo",
        location,
        employment_type as "employmentType",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM experiences 
      WHERE id = $1
    `;
    const results = await db.query<Experience>(query, [id]);
    return results.length > 0 ? results[0] : null;
  }

  // Create new experience
  static async createExperience(experience: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experience> {
    const query = `
      INSERT INTO experiences (company, position, start_date, end_date, description, achievements, technologies, company_logo, location, employment_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING 
        id,
        company,
        position,
        start_date as "startDate",
        end_date as "endDate",
        description,
        achievements,
        technologies,
        company_logo as "companyLogo",
        location,
        employment_type as "employmentType",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
    const results = await db.query<Experience>(query, [
      experience.company,
      experience.position,
      experience.startDate,
      experience.endDate || null,
      experience.description,
      JSON.stringify(experience.achievements),
      JSON.stringify(experience.technologies),
      experience.companyLogo || null,
      experience.location,
      experience.employmentType
    ]);
    return results[0];
  }

  // Update experience
  static async updateExperience(id: number, updates: Partial<Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Experience | null> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    if (updates.company !== undefined) {
      setClause.push(`company = $${paramIndex++}`);
      values.push(updates.company);
    }
    if (updates.position !== undefined) {
      setClause.push(`position = $${paramIndex++}`);
      values.push(updates.position);
    }
    if (updates.startDate !== undefined) {
      setClause.push(`start_date = $${paramIndex++}`);
      values.push(updates.startDate);
    }
    if (updates.endDate !== undefined) {
      setClause.push(`end_date = $${paramIndex++}`);
      values.push(updates.endDate);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.achievements !== undefined) {
      setClause.push(`achievements = $${paramIndex++}`);
      values.push(JSON.stringify(updates.achievements));
    }
    if (updates.technologies !== undefined) {
      setClause.push(`technologies = $${paramIndex++}`);
      values.push(JSON.stringify(updates.technologies));
    }
    if (updates.companyLogo !== undefined) {
      setClause.push(`company_logo = $${paramIndex++}`);
      values.push(updates.companyLogo);
    }
    if (updates.location !== undefined) {
      setClause.push(`location = $${paramIndex++}`);
      values.push(updates.location);
    }
    if (updates.employmentType !== undefined) {
      setClause.push(`employment_type = $${paramIndex++}`);
      values.push(updates.employmentType);
    }

    if (setClause.length === 0) {
      return await ExperienceService.getExperienceById(id);
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE experiences 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        company,
        position,
        start_date as "startDate",
        end_date as "endDate",
        description,
        achievements,
        technologies,
        company_logo as "companyLogo",
        location,
        employment_type as "employmentType",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const results = await db.query<Experience>(query, values);
    return results.length > 0 ? results[0] : null;
  }

  // Delete experience
  static async deleteExperience(id: number): Promise<boolean> {
    const query = `DELETE FROM experiences WHERE id = $1`;
    const results = await db.query(query, [id]);
    return (results as any).rowCount > 0;
  }
}

// Contact Message CRUD Operations
export class ContactService {
  // Get all contact messages
  static async getAllMessages(): Promise<ContactMessage[]> {
    const query = `
      SELECT 
        id,
        name,
        email,
        message,
        read,
        created_at as "createdAt"
      FROM contacts 
      ORDER BY created_at DESC
    `;
    return await db.query<ContactMessage>(query);
  }

  // Get unread messages
  static async getUnreadMessages(): Promise<ContactMessage[]> {
    const query = `
      SELECT 
        id,
        name,
        email,
        message,
        read,
        created_at as "createdAt"
      FROM contacts 
      WHERE read = false
      ORDER BY created_at DESC
    `;
    return await db.query<ContactMessage>(query);
  }

  // Create new contact message
  static async createMessage(message: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> {
    const query = `
      INSERT INTO contacts (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING 
        id,
        name,
        email,
        message,
        read,
        created_at as "createdAt"
    `;
    const results = await db.query<ContactMessage>(query, [
      message.name,
      message.email,
      message.message
    ]);
    return results[0];
  }

  // Mark message as read
  static async markAsRead(id: number): Promise<boolean> {
    const query = `UPDATE contacts SET read = true WHERE id = $1`;
    const results = await db.query(query, [id]);
    return (results as any).rowCount > 0;
  }

  // Delete message
  static async deleteMessage(id: number): Promise<boolean> {
    const query = `DELETE FROM contacts WHERE id = $1`;
    const results = await db.query(query, [id]);
    return (results as any).rowCount > 0;
  }
}

// Admin CRUD Operations (for Clerk integration)
export class AdminService {
  // Get admin by Clerk ID
  static async getAdminByClerkId(clerkId: string): Promise<Admin | null> {
    const query = `
      SELECT 
        id,
        clerk_id as "clerkId",
        email,
        name,
        role,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM admins 
      WHERE clerk_id = $1
    `;
    const results = await db.query<Admin>(query, [clerkId]);
    return results.length > 0 ? results[0] : null;
  }

  // Create or update admin from Clerk webhook
  static async upsertAdmin(admin: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>): Promise<Admin> {
    const query = `
      INSERT INTO admins (clerk_id, email, name, role)
      VALUES ($1, $2, $3, $4)
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
    `;
    const results = await db.query<Admin>(query, [
      admin.clerkId,
      admin.email,
      admin.name,
      admin.role || 'admin'
    ]);
    return results[0];
  }

  // Delete admin
  static async deleteAdmin(clerkId: string): Promise<boolean> {
    const query = `DELETE FROM admins WHERE clerk_id = $1`;
    const results = await db.query(query, [clerkId]);
    return (results as any).rowCount > 0;
  }
}