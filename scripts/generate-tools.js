const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// 注册一个辅助函数来生成星星评分
Handlebars.registerHelper('generateStars', function(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '½';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    return stars;
});

// 读取模板文件
const templatePath = path.join(__dirname, 'template.html');
const templateContent = fs.readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(templateContent);

// 读取工具数据
const toolsData = require('./tools.json');

// 生成页面的函数
function generatePage(tool) {
    const data = {
        title: tool.title,
        description: tool.description,
        keywords: tool.keywords,
        logo_url: tool.logo_url,
        category: tool.category,
        category_icon: tool.category_icon || 'fas fa-cog',
        rating: tool.rating,
        views: tool.views,
        overview: tool.overview,
        capabilities: tool.capabilities,
        pricing_plans: tool.pricing_plans.map(plan => ({
            ...plan,
            is_popular: plan.name === 'Pro' || plan.name === 'Standard'
        })),
        rating_stars: Handlebars.helpers.generateStars(tool.rating),
        review_count: tool.review_count,
        launch_date: tool.launch_date,
        company: tool.company,
        website: tool.website,
        website_url: tool.website_url,
        user_count: tool.user_count,
        extra_info: tool.extra_info,
        share_text: `Check out ${tool.title} - ${tool.description}`
    };

    const html = template(data);
    const outputPath = path.join(__dirname, `${tool.id}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated ${tool.id}.html`);
}

// 批量生成所有工具页面
toolsData.forEach(tool => {
    generatePage(tool);
});

console.log('All tool pages have been generated successfully!'); 