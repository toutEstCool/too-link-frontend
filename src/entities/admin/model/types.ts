export interface Admin {
  id: string;
  username: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'TECHNICIAN';
  createdAt?: string;
}
