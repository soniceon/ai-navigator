export interface AiTool {
  id: string;
  name: { [lang: string]: string };
  desc: { [lang: string]: string };
  type: string;
  icon: string;
  iconUrl?: string;
  rating: number;
  users: string;
  tags: string[];
  featured?: boolean;
  website?: string;
} 