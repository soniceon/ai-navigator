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
    template_path = Path('templates/template.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        return Template(f.read())

def load_tools():
    tools_path = Path('data/new-ai-tools.json')
    with open(tools_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_page(template, tool):
    # Process rating stars
    rating_stars = generate_rating_stars(tool['rating'])
    
    # Prepare template variables
    template_vars = {
        'title': tool['title'],
        'description': tool['description'],
        'keywords': tool.get('keywords', tool['title'] + ', AI, ' + tool['category']),
        'logo_url': tool['logo_url'],
        'category': tool['category'],
        'category_icon': tool['category_icon'],
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
        'share_text': f"Check out {tool['title']} - {tool['description']}"
    }
    
    # Render template
    return template.render(**template_vars)

def main():
    template = load_template()
    tools = load_tools()
    
    # Create output directory
    output_dir = Path('pages/tools/output')
    output_dir.mkdir(exist_ok=True, parents=True)
    
    # Generate pages for each tool
    for i, tool in enumerate(tools):
        try:
            page_content = generate_page(template, tool)
            filename = f"{tool['id']}.html"
            output_path = output_dir / filename
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(page_content)
            print(f"Generated {i+1}/{len(tools)}: {filename}")
        except Exception as e:
            print(f"Error generating {tool['id']}: {str(e)}")

if __name__ == '__main__':
    main() 