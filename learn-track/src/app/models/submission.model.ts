export interface Submission {
  id: number;
  user_id: number;
  details: string;
  screenshot_path?: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}
