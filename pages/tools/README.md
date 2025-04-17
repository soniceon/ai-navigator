# AI Tools Page Generator

This tool generates HTML pages for AI tools based on a template and JSON data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure you have the following files in the directory:
- `template.html` - The HTML template for tool pages
- `tools.json` - The JSON data containing tool information
- `generate-tools.js` - The generator script

## Usage

To generate all tool pages:

```bash
npm run generate
```

This will create HTML files for each tool in the `tools.json` file.

## Data Structure

The `tools.json` file should contain an array of tool objects with the following structure:

```json
{
  "id": "unique-id",
  "title": "Tool Name",
  "description": "Brief description",
  "keywords": "comma,separated,keywords",
  "logo_url": "https://example.com/logo.ico",
  "category": "Tool Category",
  "category_icon": "fas fa-icon",
  "rating": 4.5,
  "views": 100000,
  "overview": "Detailed overview text",
  "capabilities": [
    "Capability 1",
    "Capability 2"
  ],
  "pricing_plans": [
    {
      "name": "Plan Name",
      "price": "$X/month",
      "features": [
        "Feature 1",
        "Feature 2"
      ],
      "action_url": "https://example.com",
      "action_text": "Button Text"
    }
  ],
  "review_count": 1000,
  "launch_date": "Month Year",
  "company": "Company Name",
  "website": "example.com",
  "website_url": "https://example.com",
  "user_count": "X+",
  "extra_info": {
    "label": "Extra Info Label",
    "value": "Extra Info Value"
  }
}
```

## Customization

You can customize the template by editing `template.html`. The template uses Handlebars syntax for variable substitution.

## Adding New Tools

To add a new tool, simply add a new object to the `tools.json` array with the required data structure. 