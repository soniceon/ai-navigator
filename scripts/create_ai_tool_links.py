import json
from pathlib import Path

def load_tools():
    tools_path = Path('data/new-ai-tools.json')
    with open(tools_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_links():
    tools = load_tools()
    
    html_output = '<h2>Featured AI Tools</h2>\n<div class="featured-tools">\n'
    
    for tool in tools:
        html_output += f'''  <div class="tool-card">
    <div class="tool-header">
      <img src="{tool['logo_url']}" alt="{tool['title']}" class="tool-image">
      <h3 class="tool-title">{tool['title']}</h3>
    </div>
    <span class="tool-category">{tool['category']}</span>
    <p class="tool-description">{tool['description']}</p>
    <div class="tool-meta">
      <span class="tool-rating">{tool['rating_stars'] if 'rating_stars' in tool else '★' * int(tool['rating'])} {tool['rating']}</span>
    </div>
    <a href="pages/tools/output/{tool['id']}.html" class="tool-link">Learn More</a>
  </div>\n'''
    
    html_output += '</div>'
    
    # Write to output file
    output_path = Path('featured-tools.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_output)
    
    print(f"Generated HTML links in {output_path}")

if __name__ == '__main__':
    generate_links() 