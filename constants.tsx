
import React from 'react';
import { 
  Code2, 
  Cloud, 
  ShieldAlert, 
  Cpu, 
  Database, 
  Workflow, 
  Zap, 
  Globe, 
  Layers, 
  Building2, 
  Users2, 
  FileText, 
  CreditCard, 
  Car, 
  ClipboardList, 
  Layout, 
  Wifi, 
  ShieldCheck, 
  Globe2, 
  Smartphone, 
  HardDrive,
  Gamepad2,
  Trophy,
  Sword,
  Target
} from 'lucide-react';
import { Service, Testimonial } from './types';

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(50, 50)">
      {[0, 120, 240].map((rotation) => (
        <g key={rotation} transform={`rotate(${rotation})`}>
          <path
            d="M-2 -40 C 12 -40, 32 -25, 32 0 L 14 0 C 14 -12, 6 -20, -2 -20 Z"
            fill="currentColor"
          />
          <path
            d="M 4 -32 C 12 -32, 24 -22, 24 -4 L 18 -4 C 18 -14, 10 -22, 4 -22 Z"
            fill="white"
            fillOpacity="0.25"
          />
        </g>
      ))}
    </g>
  </svg>
);

export const SERVICES: Service[] = [
  {
    id: 'web-dev',
    title: 'Custom Web Development',
    description: 'High-performance, SEO-optimized websites built with modern frameworks for domestic growth.',
    icon: 'Code2',
    color: 'blue'
  },
  {
    id: 'gov-forms',
    title: 'Gov-Form Facilitation',
    description: 'Expert assistance in filling out Passport, Driving License, and Citizenship forms accurately.',
    icon: 'ClipboardList',
    color: 'blue'
  },
  {
    id: 'wifi-topup',
    title: 'Wifi Topup Services',
    description: 'Instant online recharge for major domestic ISPs including WorldLink, Vianet, and Subisu.',
    icon: 'Wifi',
    color: 'emerald'
  },
  {
    id: 'game-topup',
    title: 'Game Topup Hub',
    description: 'Fast and secure UC, Diamonds, and Credits for PUBG, Free Fire, and Mobile Legends.',
    icon: 'Gamepad2',
    color: 'purple'
  },
  {
    id: 'fintech',
    title: 'FinTech for Nepal',
    description: 'Customized payment gateways optimized for the domestic banking ecosystem.',
    icon: 'Zap',
    color: 'emerald'
  },
  {
    id: 'sme',
    title: 'SME Digitalization',
    description: 'Empowering domestic businesses with modern ERP, inventory, and POS solutions.',
    icon: 'Users2',
    color: 'red'
  }
];

export const WIFI_ISPS = [
  { id: 'worldlink', name: 'WorldLink', icon: 'Globe2', requirements: ['Customer ID / Username', 'Plan Selection', 'Mobile Number'] },
  { id: 'vianet', name: 'Vianet', icon: 'Smartphone', requirements: ['Customer ID', 'Mobile Number', 'Amount'] },
  { id: 'subisu', name: 'Subisu Cablenet', icon: 'Layers', requirements: ['Customer ID', 'Subscriber Name'] },
  { id: 'ntftth', name: 'NT FTTH (Nepal Telecom)', icon: 'Cpu', requirements: ['FTTH Number (e.g., 01XXXXXXX)', 'Mobile Number'] },
  { id: 'classictech', name: 'Classic Tech', icon: 'HardDrive', requirements: ['Customer ID / Username', 'Plan'] },
  { id: 'dishhome', name: 'DishHome Fibernet', icon: 'Globe', requirements: ['Customer ID / CAS ID', 'Contact Number'] }
];

export const GAME_LIST = [
  { id: 'pubg', name: 'PUBG Mobile', icon: 'Target', requirements: ['Player ID', 'Character Name', 'UC Package'] },
  { id: 'freefire', name: 'Free Fire', icon: 'Trophy', requirements: ['Player ID', 'Diamond Amount'] },
  { id: 'mlbb', name: 'Mobile Legends', icon: 'Sword', requirements: ['User ID', 'Zone ID', 'Diamond Amount'] },
  { id: 'coc', name: 'Clash of Clans', icon: 'Building2', requirements: ['Player Tag (#)', 'Gems Amount'] }
];

export const GOV_FORMS = [
  {
    id: 'passport',
    title: 'Passport Application',
    description: 'E-Passport pre-enrollment assistance.',
    icon: 'Globe',
    docs: ['Citizenship Card', 'Old Passport (if renewal)', 'Payment Voucher']
  },
  {
    id: 'license',
    title: 'Driving License',
    description: 'New application & renewal portal guidance.',
    icon: 'Car',
    docs: ['Citizenship Card', 'Medical Report', 'Blood Group Card']
  },
  {
    id: 'pan',
    title: 'PAN Registration',
    description: 'Individual and business PAN enrollment.',
    icon: 'FileText',
    docs: ['Photo', 'Citizenship Card', 'Business Reg (if applicable)']
  },
  {
    id: 'national_id',
    title: 'National ID (NID)',
    description: 'Biometric enrollment scheduling and form fillup.',
    icon: 'CreditCard',
    docs: ['Citizenship Card', 'Marriage Cert (if changed)']
  }
];

export const TECH_STACK = [
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Python', category: 'AI/Data' },
  { name: 'Cloud Infra', category: 'DevOps' },
  { name: 'Mobile Apps', category: 'iOS/Android' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'TypeScript', category: 'Standard' },
  { name: 'API Security', category: 'Security' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Binaya Shrestha',
    role: 'IT Director, Municipal Governance',
    text: "Sajilo Project Hub has been instrumental in digitizing our public service delivery. Their form fillup assistance has saved thousands of hours for our citizens.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: '2',
    name: 'Anjali Gurung',
    role: 'Founder, Himalayan Trade Link',
    text: "Moving our domestic distribution chain to the cloud with Sajilo's local team reduced our overhead by 40%. Direct on-site support was key.",
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

export const getIcon = (name: string, className?: string) => {
  const icons: Record<string, any> = {
    Cloud, Code2, ShieldAlert, Cpu, Database, Workflow, Zap, Globe, Layers, Building2, Users2, FileText, CreditCard, Car, ClipboardList, Layout, Wifi, ShieldCheck, Globe2, Smartphone, HardDrive, Gamepad2, Trophy, Sword, Target
  };
  const IconComponent = icons[name] || Zap;
  return <IconComponent className={className} />;
};
