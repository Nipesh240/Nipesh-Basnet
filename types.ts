
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
}

export interface UserActivity {
  id: string;
  type: 'gov_form' | 'wifi' | 'game' | 'uni_project';
  title: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'dispatched';
  details: string;
}
