const fs = require('fs');
const path = require('path');

// 读取模板文件
const templatePath = path.join(__dirname, 'template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// 读取工具数据
const toolsDataPath = path.join(__dirname, 'tools.json');
const toolsData = JSON.parse(fs.readFileSync(toolsDataPath, 'utf8'));

// 为每个工具生成页面
toolsData.tools.forEach(tool => {
    let pageContent = template;
    
    // 替换所有占位符
    pageContent = pageContent.replace(/{{title}}/g, tool.title);
    pageContent = pageContent.replace(/{{description}}/g, tool.description);
    pageContent = pageContent.replace(/{{keywords}}/g, tool.keywords);
    pageContent = pageContent.replace(/{{logo_url}}/g, tool.logo_url);
    pageContent = pageContent.replace(/{{category}}/g, tool.category);
    pageContent = pageContent.replace(/{{category_icon}}/g, tool.category_icon);
    pageContent = pageContent.replace(/{{rating}}/g, tool.rating);
    pageContent = pageContent.replace(/{{views}}/g, tool.views);
    pageContent = pageContent.replace(/{{overview}}/g, tool.overview);
    
    // 替换功能列表
    const capabilitiesHtml = tool.capabilities.map(cap => `<li>${cap}</li>`).join('');
    pageContent = pageContent.replace(/{{capabilities}}/g, capabilitiesHtml);
    
    // 替换价格计划
    const pricingPlansHtml = tool.pricing_plans.map(plan => `
        <div class="pricing-card ${plan.is_popular ? 'popular' : ''}">
            <h3>${plan.name}</h3>
            <div class="price">${plan.price}</div>
            <ul>
                ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <a href="${plan.action_url}" class="btn ${plan.is_popular ? 'btn-primary' : 'btn-secondary'}">${plan.action_text}</a>
        </div>
    `).join('');
    pageContent = pageContent.replace(/{{pricing_plans}}/g, pricingPlansHtml);
    
    // 替换评分和评论
    pageContent = pageContent.replace(/{{rating_stars}}/g, tool.rating_stars);
    pageContent = pageContent.replace(/{{review_count}}/g, tool.review_count);
    
    // 替换快速信息
    pageContent = pageContent.replace(/{{launch_date}}/g, tool.launch_date);
    pageContent = pageContent.replace(/{{company}}/g, tool.company);
    pageContent = pageContent.replace(/{{website}}/g, tool.website);
    pageContent = pageContent.replace(/{{user_count}}/g, tool.user_count);
    pageContent = pageContent.replace(/{{extra_info}}/g, tool.extra_info);
    
    // 替换分享信息
    pageContent = pageContent.replace(/{{share_text}}/g, tool.share_text);
    pageContent = pageContent.replace(/{{website_url}}/g, tool.website_url);
    
    // 生成输出文件
    const outputPath = path.join(__dirname, `${tool.id}.html`);
    fs.writeFileSync(outputPath, pageContent);
    console.log(`Generated page for ${tool.title} at ${outputPath}`);
});

console.log('All pages generated successfully!'); 