export type ProjectResponse = {
  id: string;
  name: string;
  description: string | null;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectRequest = {
  name: string;
  description?: string | null;
};

export type UpdateProjectRequest = {
  name: string;
  description?: string | null;
  status: ProjectResponse['status'];
};
