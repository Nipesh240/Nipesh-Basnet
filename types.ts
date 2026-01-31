
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
