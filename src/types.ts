export interface User {
  id: number;
  fullName: string;
  matricNumber?: string;
  email: string;
  role: 'student' | 'admin';
  status?: 'active' | 'suspended';
}

export interface Item {
  id: number;
  name: string;
  category: string;
  description: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  user_id: number;
  posted_by?: string;
  contact_email?: string;
  created_at: string;
}

export type Category = 'Phone' | 'ID Card' | 'Laptop' | 'Bag' | 'Books' | 'Others';
