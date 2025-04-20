# AI工具管理

此目录包含SoniceAi网站的所有AI工具页面。

## 目录结构

- `/pages/tools/` - 包含所有AI工具页面和相关文件
  - `*.html` - 各个AI工具的详情页面（如chatgpt.html, gemini.html等）
  - `all-tools.html` - 显示所有AI工具的集合页面
  - `tools.json` - 包含所有工具元数据的JSON文件
  - `README.md` - 本说明文件

## 文件说明

- **tools.json**: 包含所有AI工具的元数据，包括名称、描述、分类等信息
- **all-tools.html**: 集中显示所有AI工具的页面，包含分类和搜索功能
- **工具页面文件**: 每个AI工具都有一个对应的HTML文件，如chatgpt.html、gemini.html等

## 工作流程

### 浏览所有工具
访问`all-tools.html`页面可以浏览所有AI工具，并支持按类别过滤和搜索

### 添加新工具
1. 在`tools.json`中添加工具元数据
2. 在`/pages/tools/`目录中创建新的工具页面HTML文件
3. 新工具将自动出现在all-tools.html页面中

### 更新现有工具
直接编辑对应的HTML文件或更新`tools.json`中的元数据

## 统一页面模板

我们提供了一个工具，可以将所有工具页面统一为模板的风格和布局，并自动下载工具图标到本地：

```bash
# 运行页面更新工具
.\scripts\update-tool-pages.bat
```

此工具将：

1. 读取`tools.json`中的所有工具元数据
2. 将每个工具页面更新为与`templates/template.html`模板一致
3. 自动下载工具logo到`/images/tools/`目录（如logo_url在工具元数据中指定）
4. 如果下载失败，将创建自动生成的占位图标

### 为新工具添加图标

在`tools.json`中为工具添加`logo_url`属性：

```json
{
  "id": "tool-id",
  "title": "Tool Name",
  "logo_url": "https://example.com/favicon.ico",
  ...
}
```

然后运行更新工具，它将自动下载图标并更新页面使用本地图标路径。

## 模板文件

详细的模板文件位于`/templates/template.html`，它使用变量占位符（如`{{ title }}`, `{{ description }}`）来表示工具特定的内容。 