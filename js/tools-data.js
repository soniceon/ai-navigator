const aiTools = [
    {
        id: 1,
        name: "ChatGPT",
        description: "Powerful AI chat assistant that can answer questions, write content and provide information",
        image: "images/tool1.webp",
        rating: 4.9,
        stars: 5,
        tags: ["Chat", "Writing", "Free"],
        url: "https://chat.openai.com"
    },
    {
        id: 2,
        name: "Midjourney",
        description: "Premier AI image generation tool for creating high-quality artistic images and photorealistic works",
        image: "images/tool2.webp",
        rating: 4.7,
        stars: 4,
        tags: ["Images", "Art", "Paid"],
        url: "https://www.midjourney.com"
    },
    {
        id: 3,
        name: "Claude",
        description: "Advanced AI assistant from Anthropic that excels at thoughtful conversation and complex content creation",
        image: "images/claude.webp",
        rating: 4.9,
        stars: 5,
        tags: ["Chat", "Research", "Freemium"],
        url: "https://claude.ai"
    },
    {
        id: 4,
        name: "Deepseek",
        description: "Advanced AI model specialized in code, reasoning and knowledge-intensive tasks",
        image: "images/deepseek.webp",
        rating: 4.7,
        stars: 4,
        tags: ["Coding", "Research", "Free"],
        url: "https://deepseek.com"
    },
    {
        id: 5,
        name: "Douban AI",
        description: "Chinese AI assistant that provides conversational support, content creation and information retrieval",
        image: "images/douban.webp",
        rating: 4.6, 
        stars: 4,
        tags: ["Chinese", "Chat", "Content"],
        url: "https://ai.douban.com"
    }
];

// Text and writing tools
const textWritingTools = [
    {
        id: 101,
        name: "Claude",
        description: "Advanced AI assistant from Anthropic that excels at thoughtful, nuanced writing and analysis",
        image: "images/text-tool1.webp",
        rating: 4.8,
        stars: 5,
        tags: ["Writing", "Research", "Analysis"],
        url: "https://claude.ai"
    },
    {
        id: 102,
        name: "Jasper",
        description: "AI marketing copywriter that helps create blog articles, ads, emails and social media content",
        image: "images/text-tool2.webp",
        rating: 4.5,
        stars: 4,
        tags: ["Marketing", "Copywriting", "Paid"],
        url: "https://www.jasper.ai"
    }
];

// Image generation tools
const imageGenerationTools = [
    {
        id: 201,
        name: "Stable Diffusion",
        description: "Open-source AI image generation model that creates detailed images from text descriptions",
        image: "images/img-tool1.webp",
        rating: 4.7,
        stars: 5,
        tags: ["Images", "Open Source", "Free"],
        url: "https://stability.ai"
    },
    {
        id: 202,
        name: "Leonardo.ai",
        description: "AI image generator designed for creative professionals and game developers",
        image: "images/img-tool2.webp",
        rating: 4.5,
        stars: 4,
        tags: ["Creative", "Gaming", "Freemium"],
        url: "https://leonardo.ai"
    }
];

// Export data so other scripts can use it
export { aiTools, textWritingTools, imageGenerationTools };
