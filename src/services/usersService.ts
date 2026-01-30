/**
 * Users API Service
 * Handles all user-related API calls with mock fallback
 */

import config from '@/config/env';
import api from '@/lib/api';
import { User, PaginatedResponse } from '@/types';
import { mockUsers } from '@/services/mockData';

// Simulate API delay for mock mode
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get paginated list of users
 */
export const getUsers = async (
  page = 1,
  pageSize = 10,
  search?: string
): Promise<PaginatedResponse<User>> => {
  if (config.enableMock) {
    await delay(500);

    let filtered = [...mockUsers];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  }

  const response = await api.get<PaginatedResponse<User>>('/users', {
    params: { page, pageSize, search },
  });
  return response.data;
};

/**
 * Get single user by ID
 */
export const getUserById = async (id: string): Promise<User | null> => {
  if (config.enableMock) {
    await delay(300);
    return mockUsers.find((u) => u.id === id) || null;
  }

  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

/**
 * Create a new user
 */
export const createUser = async (
  user: Omit<User, 'id' | 'createdAt'>
): Promise<User> => {
  if (config.enableMock) {
    await delay(500);
    const newUser: User = {
      ...user,
      id: String(mockUsers.length + 1),
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  const response = await api.post<User>('/users', user);
  return response.data;
};

/**
 * Update an existing user
 */
export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User> => {
  if (config.enableMock) {
    await delay(500);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');

    mockUsers[index] = {
      ...mockUsers[index],
      ...updates,
    };
    return mockUsers[index];
  }

  const response = await api.patch<User>(`/users/${id}`, updates);
  return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (id: string): Promise<void> => {
  if (config.enableMock) {
    await delay(500);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
    return;
  }

  await api.delete(`/users/${id}`);
};
