export interface UserStatus {
  id: string;
  user_id: string;
  email: string;
  is_active: boolean;
  activated_at?: string;
  activated_by?: string;
  deactivated_at?: string;
  deactivated_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// 기존 UserApproval은 호환성을 위해 유지
export interface UserApproval {
  id: string;
  email: string;
  password_hash?: string;
  provider_id?: string;
  requested_at: string;
  approved_at?: string;
  approved_by?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface Admin {
  id: string;
  user_id: string;
  created_at: string;
}
