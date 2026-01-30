/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * This module provides permission checking for the application.
 * Roles: admin > staff > viewer
 * 
 * Permissions matrix:
 * - admin: Full access to everything
 * - staff: Can view dashboard, manage tickets (no delete), view users (no manage)
 * - viewer: Read-only access to dashboard and tickets list
 */

import { UserRole } from '@/types';

// Resource types that can be accessed
export type Resource = 'dashboard' | 'tickets' | 'users' | 'settings';

// Actions that can be performed on resources
export type Action = 'view' | 'create' | 'update' | 'delete';

// Permission definition type
interface Permission {
  role: UserRole;
  resource: Resource;
  action: Action;
}

// Define all permissions in the system
const permissions: Permission[] = [
  // Admin - full access
  { role: 'admin', resource: 'dashboard', action: 'view' },
  { role: 'admin', resource: 'tickets', action: 'view' },
  { role: 'admin', resource: 'tickets', action: 'create' },
  { role: 'admin', resource: 'tickets', action: 'update' },
  { role: 'admin', resource: 'tickets', action: 'delete' },
  { role: 'admin', resource: 'users', action: 'view' },
  { role: 'admin', resource: 'users', action: 'create' },
  { role: 'admin', resource: 'users', action: 'update' },
  { role: 'admin', resource: 'users', action: 'delete' },
  { role: 'admin', resource: 'settings', action: 'view' },
  { role: 'admin', resource: 'settings', action: 'update' },

  // Staff - can manage tickets, view users
  { role: 'staff', resource: 'dashboard', action: 'view' },
  { role: 'staff', resource: 'tickets', action: 'view' },
  { role: 'staff', resource: 'tickets', action: 'create' },
  { role: 'staff', resource: 'tickets', action: 'update' },
  { role: 'staff', resource: 'users', action: 'view' },
  { role: 'staff', resource: 'settings', action: 'view' },
  { role: 'staff', resource: 'settings', action: 'update' },

  // Viewer - read-only
  { role: 'viewer', resource: 'dashboard', action: 'view' },
  { role: 'viewer', resource: 'tickets', action: 'view' },
  { role: 'viewer', resource: 'settings', action: 'view' },
  { role: 'viewer', resource: 'settings', action: 'update' },
];

/**
 * Check if a role has permission to perform an action on a resource
 * @param role - The user's role
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @returns boolean - Whether the user has permission
 */
export const canAccess = (
  role: UserRole | undefined,
  resource: Resource,
  action: Action
): boolean => {
  if (!role) return false;
  
  return permissions.some(
    (p) => p.role === role && p.resource === resource && p.action === action
  );
};

/**
 * Get all allowed actions for a role on a resource
 * @param role - The user's role
 * @param resource - The resource
 * @returns Array of allowed actions
 */
export const getAllowedActions = (
  role: UserRole | undefined,
  resource: Resource
): Action[] => {
  if (!role) return [];
  
  return permissions
    .filter((p) => p.role === role && p.resource === resource)
    .map((p) => p.action);
};

/**
 * Check if a role is at least a certain level
 * admin > staff > viewer
 */
export const hasRoleLevel = (
  userRole: UserRole | undefined,
  requiredRole: UserRole
): boolean => {
  if (!userRole) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    admin: 3,
    staff: 2,
    viewer: 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
