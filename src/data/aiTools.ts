import { Sparkles, MessageSquare, Image as ImageIcon, Code2, Music, Video } from "lucide-react";

export interface AITool {
  name: string;
  description: string;
  url: string;
  category: string;
  icon: typeof Sparkles;
}

export const aiTools: AITool[] = [
  { name: "ChatGPT", description: "The conversational AI that started the modern wave.", url: "https://chat.openai.com", category: "Chat", icon: MessageSquare },
  { name: "Midjourney", description: "Stunning AI-generated imagery for creators and brands.", url: "https://www.midjourney.com", category: "Image", icon: ImageIcon },
  { name: "Claude", description: "Thoughtful AI assistant for long-form research and writing.", url: "https://claude.ai", category: "Chat", icon: Sparkles },
  { name: "GitHub Copilot", description: "Your AI pair programmer, built into your editor.", url: "https://github.com/features/copilot", category: "Code", icon: Code2 },
  { name: "Suno", description: "Generate full original songs from a single text prompt.", url: "https://suno.ai", category: "Audio", icon: Music },
  { name: "Runway", description: "Cinematic AI video generation and editing tools.", url: "https://runwayml.com", category: "Video", icon: Video },
];