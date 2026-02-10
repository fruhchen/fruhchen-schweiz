export type UserRole = 'parent' | 'peer' | 'fachperson' | 'admin' | 'donor';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  region?: string;
  language: string;
  baby_name?: string;
  baby_birth_date?: string;
  gestational_weeks?: number;
  hospital?: string;
  onboarding_complete: boolean;
  created_at: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  simple_definition?: string;
  category: string;
  related_terms?: string[];
  audio_url?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  mood: number;
  photos?: string[];
  milestone_type?: string;
  milestone_label?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location?: string;
  region?: string;
  type: 'workshop' | 'webinar' | 'meetup' | 'conference' | 'other';
  image_url?: string;
  registration_url?: string;
  max_participants?: number;
  current_participants: number;
  is_online: boolean;
}

export interface Grant {
  id: string;
  foundation_name: string;
  contact_person?: string;
  contact_email?: string;
  stage: 'research' | 'contacted' | 'submitted' | 'approved' | 'rejected';
  amount_requested?: number;
  amount_approved?: number;
  deadline?: string;
  submission_window_start?: string;
  submission_window_end?: string;
  next_action?: string;
  next_action_date?: string;
  notes?: string;
  last_contact_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_name?: string;
  donor_email?: string;
  amount: number;
  currency: string;
  method: 'twint' | 'bank' | 'online' | 'other';
  is_recurring: boolean;
  receipt_sent: boolean;
  date: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string }[];
  created_at: string;
}

export interface PeerChat {
  id: string;
  parent_id: string;
  peer_id: string;
  topic?: string;
  status: 'active' | 'closed';
  messages: PeerMessage[];
  created_at: string;
}

export interface PeerMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface NewsletterItem {
  id: string;
  title: string;
  stage: 'idea' | 'draft' | 'review' | 'scheduled' | 'sent';
  content?: string;
  scheduled_date?: string;
  sent_date?: string;
  author_id: string;
  created_at: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  project?: string;
  task?: string;
  duration_minutes: number;
  date: string;
  notes?: string;
}

export interface Volunteer {
  id: string;
  user_id: string;
  full_name: string;
  region: string;
  role: 'peer' | 'senior_peer' | 'trainer';
  training_completed: boolean;
  training_modules: { module: string; completed_at: string }[];
  refresher_due?: string;
  is_active: boolean;
}
