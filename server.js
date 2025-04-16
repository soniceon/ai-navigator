const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression()); // Enable gzip compression
app.use(helmet()); // Add security headers

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Cache control middleware
const cacheControl = (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    next();
};

// Static files with cache control
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1h',
    etag: true
}));

// Sample data (in a real app, this would come from a database)
const tools = [
    {
        id: 1,
        name: 'ChatGPT',
        description: 'Powerful language model that can answer questions, write content, and assist with various tasks.',
        category: 'Text Generation',
        rating: 4.9,
        image: 'https://via.placeholder.com/300x200?text=ChatGPT',
        isSponsored: true
    },
    {
        id: 2,
        name: 'DALL-E 3',
        description: 'Create realistic images and art from natural language descriptions.',
        category: 'Image Generation',
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200?text=DALL-E',
        isNew: true
    },
    {
        id: 3,
        name: 'Claude',
        description: 'AI assistant that can understand complex instructions and complete them thoroughly.',
        category: 'Text Generation',
        rating: 4.7,
        image: 'https://via.placeholder.com/300x200?text=Claude'
    },
    {
        id: 4,
        name: 'Midjourney',
        description: 'AI art generator that creates beautiful imagery from text descriptions.',
        category: 'Image Generation',
        rating: 4.9,
        image: 'https://via.placeholder.com/300x200?text=Midjourney'
    }
];

// Cache for API responses
const apiCache = new Map();

// API Routes with caching
app.get('/api/tools', cacheControl, (req, res) => {
    const { search, category } = req.query;
    const cacheKey = JSON.stringify({ search, category });
    
    // Check cache
    if (apiCache.has(cacheKey)) {
        const { data, timestamp } = apiCache.get(cacheKey);
        if (Date.now() - timestamp < 3600000) { // Cache valid for 1 hour
            return res.json(data);
        }
    }
    
    let filteredTools = [...tools];
    
    // Apply search filter
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredTools = filteredTools.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (category && category !== 'all') {
        filteredTools = filteredTools.filter(tool => 
            tool.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Cache the results
    apiCache.set(cacheKey, {
        data: filteredTools,
        timestamp: Date.now()
    });
    
    // Simulate network delay
    setTimeout(() => {
        res.json(filteredTools);
    }, 500);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Serve index.html for all other routes
app.get('*', cacheControl, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 