const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'default-tool.png'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    viewCount: {
        type: Number,
        default: 0
    },
    features: [{
        type: String
    }],
    pricing: {
        free: {
            type: Boolean,
            default: false
        },
        plans: [{
            name: String,
            price: Number,
            features: [String]
        }]
    },
    tutorials: [{
        title: String,
        content: String,
        videoUrl: String
    }],
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    faqs: [{
        question: String,
        answer: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 更新时自动更新 updatedAt
toolSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Tool', toolSchema); 