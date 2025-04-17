import json
import os
from jinja2 import Template
from pathlib import Path

def generate_rating_stars(rating):
    full_stars = int(rating)
    half_star = rating - full_stars >= 0.5
    empty_stars = 5 - full_stars - (1 if half_star else 0)
    
    stars_html = ''
    stars_html += '<i class="fas fa-star"></i>' * full_stars
    if half_star:
        stars_html += '<i class="fas fa-star-half-alt"></i>'
    stars_html += '<i class="far fa-star"></i>' * empty_stars
    return stars_html

def load_template():
    template_path = Path(__file__).parent / 'template.html'
    with open(template_path, 'r', encoding='utf-8') as f:
        return Template(f.read())

def load_tools():
    tools_path = Path(__file__).parent / 'tools.json'
    with open(tools_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        return data['tools']

def generate_page(template, tool):
    # 处理评分星星
    rating_stars = generate_rating_stars(tool['rating'])
    
    # 处理类别图标
    category_icons = {
        'Design': 'fas fa-paint-brush',
        'Productivity': 'fas fa-tasks',
        'Development': 'fas fa-code',
        'Security': 'fas fa-shield-alt',
        'Quality': 'fas fa-check-circle',
        'Video': 'fas fa-video',
        'Audio': 'fas fa-music',
        'Writing': 'fas fa-pen',
        'Image': 'fas fa-image'
    }
    category_icon = category_icons.get(tool['category'], 'fas fa-cube')
    
    # 处理分享文本
    share_text = f"Check out {tool['title']} - {tool['description']}"
    
    # 准备模板变量
    template_vars = {
        'title': tool['title'],
        'description': tool['description'],
        'keywords': tool.get('keywords', ''),
        'logo_url': tool['logo_url'],
        'category': tool['category'],
        'category_icon': category_icon,
        'rating': tool['rating'],
        'rating_stars': rating_stars,
        'views': tool.get('views', 0),
        'overview': tool['overview'],
        'capabilities': tool.get('capabilities', []),
        'pricing_plans': tool['pricing_plans'],
        'review_count': tool.get('review_count', 0),
        'launch_date': tool.get('launch_date', ''),
        'company': tool.get('company', ''),
        'website': tool.get('website', ''),
        'website_url': tool.get('website_url', ''),
        'user_count': tool.get('user_count', ''),
        'extra_info': tool.get('extra_info', {}),
        'share_text': share_text
    }
    
    # 渲染模板
    return template.render(**template_vars)

def main():
    template = load_template()
    tools = load_tools()
    
    # 确保输出目录存在
    output_dir = Path(__file__).parent / 'output'
    output_dir.mkdir(exist_ok=True)
    
    # 为每个工具生成页面
    for tool in tools:
        try:
            page_content = generate_page(template, tool)
            filename = f"{tool['id']}.html"
            output_path = output_dir / filename
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(page_content)
            print(f"Generated {filename}")
        except Exception as e:
            print(f"Error generating {tool['id']}: {str(e)}")

if __name__ == '__main__':
    main() 