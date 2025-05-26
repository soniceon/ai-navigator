import { AiTool } from '@/types/aiTool';

export const aiTools: AiTool[] = [
  {
    id: "chatgpt",
    name: {
      zh: "ChatGPT", en: "ChatGPT", ja: "ChatGPT", ko: "ChatGPT", de: "ChatGPT", fr: "ChatGPT", es: "ChatGPT", ru: "ChatGPT"
    },
    desc: {
      zh: "OpenAI 的强大对话模型。",
      en: "OpenAI's powerful conversational AI.",
      ja: "OpenAIの強力な対話AI。",
      ko: "OpenAI의 강력한 대화형 AI.",
      de: "Leistungsstarke Konversations-KI von OpenAI.",
      fr: "L'IA conversationnelle puissante d'OpenAI.",
      es: "La potente IA conversacional de OpenAI.",
      ru: "Мощный разговорный ИИ от OpenAI."
    },
    type: "chatbot",
    icon: "💬",
    iconUrl: "/icons/chatgpt.svg",
    rating: 4.9,
    users: "1M+",
    tags: ["dialogue", "openai"],
    featured: true,
    website: "https://chat.openai.com/",
  },
  {
    id: "midjourney",
    name: {
      zh: "Midjourney", en: "Midjourney", ja: "Midjourney", ko: "Midjourney", de: "Midjourney", fr: "Midjourney", es: "Midjourney", ru: "Midjourney"
    },
    desc: {
      zh: "AI 图像生成工具，创造令人惊艳的艺术作品。",
      en: "AI image generator for stunning art.",
      ja: "驚くべきアートを生み出すAI画像生成ツール。",
      ko: "놀라운 예술을 창조하는 AI 이미지 생성기.",
      de: "KI-Bildgenerator für beeindruckende Kunstwerke.",
      fr: "Générateur d'images IA pour des œuvres d'art époustouflantes.",
      es: "Generador de imágenes IA para arte impresionante.",
      ru: "Генератор изображений ИИ для потрясающего искусства."
    },
    type: "image",
    icon: "🖼️",
    iconUrl: "/icons/midjourney.svg",
    rating: 4.8,
    users: "800k+",
    tags: ["imagegeneration", "art"],
    featured: true,
    website: "https://www.midjourney.com/",
  },
  {
    id: "dalle",
    name: {
      zh: "DALL·E 3", en: "DALL·E 3", ja: "DALL·E 3", ko: "DALL·E 3", de: "DALL·E 3", fr: "DALL·E 3", es: "DALL·E 3", ru: "DALL·E 3"
    },
    desc: {
      zh: "OpenAI 的文本到图像生成模型。",
      en: "OpenAI's text-to-image generation model.",
      ja: "OpenAIのテキストから画像生成モデル。",
      ko: "OpenAI의 텍스트-이미지 생성 모델.",
      de: "Text-zu-Bild-Generator von OpenAI.",
      fr: "Générateur d'images à partir de texte d'OpenAI.",
      es: "Generador de imágenes a partir de texto de OpenAI.",
      ru: "Генератор изображений по тексту от OpenAI."
    },
    type: "image",
    icon: "🎨",
    iconUrl: "/icons/dalle.svg",
    rating: 4.7,
    users: "700k+",
    tags: ["imagegeneration", "openai"],
    featured: true,
    website: "https://openai.com/dall-e-3",
  },
  {
    id: "github-copilot",
    name: {
      zh: "GitHub Copilot", en: "GitHub Copilot", ja: "GitHub Copilot", ko: "GitHub Copilot", de: "GitHub Copilot", fr: "GitHub Copilot", es: "GitHub Copilot", ru: "GitHub Copilot"
    },
    desc: {
      zh: "AI 编程助手，提升开发效率。",
      en: "AI coding assistant to boost productivity.",
      ja: "開発効率を高めるAIコーディングアシスタント。",
      ko: "개발 효율을 높이는 AI 코딩 어시스턴트.",
      de: "KI-Coding-Assistent zur Steigerung der Produktivität.",
      fr: "Assistant de codage IA pour améliorer la productivité.",
      es: "Asistente de codificación IA para aumentar la productividad.",
      ru: "ИИ-помощник для повышения эффективности разработки."
    },
    type: "coding",
    icon: "💻",
    iconUrl: "/icons/github_copilot.svg",
    rating: 4.7,
    users: "600k+",
    tags: ["code", "dev", "github"],
    featured: true,
    website: "https://github.com/features/copilot",
  },
  {
    id: "gemini",
    name: {
      zh: "Google Gemini", en: "Google Gemini", ja: "Google Gemini", ko: "Google Gemini", de: "Google Gemini", fr: "Google Gemini", es: "Google Gemini", ru: "Google Gemini"
    },
    desc: {
      zh: "谷歌推出的多模态AI聊天助手。",
      en: "Google's multimodal AI chat assistant.",
      ja: "GoogleのマルチモーダルAIチャットアシスタント。",
      ko: "구글의 멀티모달 AI 챗 어시스턴트.",
      de: "Googles multimodaler KI-Chat-Assistent.",
      fr: "Assistant de chat IA multimodal de Google.",
      es: "Asistente de chat IA multimodal de Google.",
      ru: "Мультимодальный чат-ассистент Google."
    },
    type: "chatbot",
    icon: "🤖",
    iconUrl: "/icons/gemini.svg",
    rating: 4.6,
    users: "500k+",
    tags: ["dialogue", "google"],
    featured: true,
    website: "https://gemini.google.com/",
  },
  {
    id: "claude",
    name: {
      zh: "Claude", en: "Claude", ja: "Claude", ko: "Claude", de: "Claude", fr: "Claude", es: "Claude", ru: "Claude"
    },
    desc: {
      zh: "Anthropic 推出的安全对话AI。",
      en: "Safe conversational AI by Anthropic.",
      ja: "Anthropicの安全な対話AI。",
      ko: "Anthropic의 안전한 대화형 AI.",
      de: "Sichere Konversations-KI von Anthropic.",
      fr: "IA conversationnelle sûre d'Anthropic.",
      es: "IA conversacional segura de Anthropic.",
      ru: "Безопасный разговорный ИИ от Anthropic."
    },
    type: "chatbot",
    icon: "🧠",
    iconUrl: "/icons/claude.svg",
    rating: 4.6,
    users: "400k+",
    tags: ["dialogue", "anthropic"],
    featured: true,
    website: "https://claude.ai/",
  },
  {
    id: "notion-ai",
    name: {
      zh: "Notion AI", en: "Notion AI", ja: "Notion AI", ko: "Notion AI", de: "Notion AI", fr: "Notion AI", es: "Notion AI", ru: "Notion AI"
    },
    desc: {
      zh: "集成于Notion的AI写作与效率工具。",
      en: "AI writing and productivity tool in Notion.",
      ja: "Notionに統合されたAIライティング＆生産性ツール。",
      ko: "Notion에 통합된 AI 작문 및 생산성 도구.",
      de: "In Notion integriertes KI-Schreib- und Produktivitätstool.",
      fr: "Outil d'écriture et de productivité IA intégré à Notion.",
      es: "Herramienta de escritura y productividad IA integrada en Notion.",
      ru: "Интегрированный в Notion инструмент ИИ для письма и продуктивности."
    },
    type: "productivity",
    icon: "📝",
    iconUrl: "/icons/notion_ai.svg",
    rating: 4.5,
    users: "350k+",
    tags: ["writing", "productivity", "notion"],
    featured: true,
    website: "https://www.notion.so/product/ai",
  },
  {
    id: "canva-ai",
    name: {
      zh: "Canva AI", en: "Canva AI", ja: "Canva AI", ko: "Canva AI", de: "Canva AI", fr: "Canva AI", es: "Canva AI", ru: "Canva AI"
    },
    desc: {
      zh: "Canva 平台的AI设计与生成工具。",
      en: "AI design and generation tools in Canva.",
      ja: "CanvaのAIデザイン＆生成ツール。",
      ko: "Canva의 AI 디자인 및 생성 도구.",
      de: "KI-Design- und Generierungstools in Canva.",
      fr: "Outils de conception et de génération IA dans Canva.",
      es: "Herramientas de diseño y generación IA en Canva.",
      ru: "Инструменты ИИ для дизайна и генерации в Canva."
    },
    type: "design",
    icon: "🎨",
    iconUrl: "/icons/canva_ai.svg",
    rating: 4.5,
    users: "300k+",
    tags: ["design", "canva"],
    featured: true,
    website: "https://www.canva.com/ai/",
  },
  {
    id: "jasper",
    name: {
      zh: "Jasper AI", en: "Jasper AI", ja: "Jasper AI", ko: "Jasper AI", de: "Jasper AI", fr: "Jasper AI", es: "Jasper AI", ru: "Jasper AI"
    },
    desc: {
      zh: "AI写作与内容生成平台。",
      en: "AI writing and content generation platform.",
      ja: "AIライティング＆コンテンツ生成プラットフォーム。",
      ko: "AI 작문 및 콘텐츠 생성 플랫폼.",
      de: "KI-Schreib- und Content-Generierungsplattform.",
      fr: "Plateforme d'écriture et de génération de contenu IA.",
      es: "Plataforma de escritura y generación de contenido IA.",
      ru: "Платформа ИИ для письма и генерации контента."
    },
    type: "writing",
    icon: "✍️",
    iconUrl: "/icons/jasper.svg",
    rating: 4.4,
    users: "250k+",
    tags: ["writing", "content"],
    featured: true,
    website: "https://www.jasper.ai/",
  },
  {
    id: "descript",
    name: {
      zh: "Descript", en: "Descript", ja: "Descript", ko: "Descript", de: "Descript", fr: "Descript", es: "Descript", ru: "Descript"
    },
    desc: {
      zh: "音频与视频编辑的AI平台。",
      en: "AI platform for audio and video editing.",
      ja: "音声・動画編集のAIプラットフォーム。",
      ko: "오디오 및 비디오 편집을 위한 AI 플랫폼.",
      de: "KI-Plattform für Audio- und Videobearbeitung.",
      fr: "Plateforme IA pour l'édition audio et vidéo.",
      es: "Plataforma IA para edición de audio y video.",
      ru: "Платформа ИИ для редактирования аудио и видео."
    },
    type: "media",
    icon: "🎬",
    iconUrl: "/icons/descript.svg",
    rating: 4.4,
    users: "200k+",
    tags: ["audio", "video", "editing"],
    featured: true,
    website: "https://www.descript.com/",
  }
]; 