// Function to load AI tools from JSON file
async function loadAITools() {
    try {
        const response = await fetch('data/ai-tools.json');
        if (!response.ok) {
            throw new Error('Failed to load AI tools data');
        }
        const tools = await response.json();
        return tools;
    } catch (error) {
        console.error('Error loading AI tools:', error);
        return [];
    }
}

// Function to create an AI tool card
function createAIToolCard(tool) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'ai-tool-card';
    card.setAttribute('data-category', tool.category);
    
    // Create card content
    card.innerHTML = `
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
            <div class="card-icon">
                <img src="${tool.icon}" alt="${tool.name} icon">
            </div>
            <div class="card-info">
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
            </div>
        </a>
    `;
    
    return card;
}

// Function to render all AI tool cards
async function renderAIToolCards() {
    const container = document.getElementById('ai-tools-container');
    if (!container) {
        console.error('AI tools container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Load tools data
    const tools = await loadAITools();
    
    // Create and append cards
    tools.forEach(tool => {
        const card = createAIToolCard(tool);
        container.appendChild(card);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderAIToolCards();
    
    // Add category filter functionality
    const filterButtons = document.querySelectorAll('.category-filter');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter cards
                const cards = document.querySelectorAll('.ai-tool-card');
                cards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});

// AI Cards Component
class AICards {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            apiUrl: options.apiUrl || '/api/ai-tools',
            itemsPerPage: options.itemsPerPage || 12,
            loadingDelay: options.loadingDelay || 300,
            ...options
        };
        this.tools = [];
        this.currentPage = 1;
        this.isLoading = false;
        this.observer = null;
        this.init();
    }

    // 初始化组件
    init() {
        if (!this.container) {
            console.error('Container element not found');
            return;
        }

        this.setupIntersectionObserver();
        this.loadTools();
        this.setupEventListeners();
    }

    // 设置 Intersection Observer
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isLoading) {
                        this.loadMoreTools();
                    }
                });
            },
            {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
            }
        );
    }

    // 设置事件监听器
    setupEventListeners() {
        // 搜索功能
        const searchInput = document.querySelector('.search input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filterTools(e.target.value);
            }, 300));
        }

        // 分类过滤
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                this.filterByCategory(filter.dataset.category);
            });
        });

        // 排序功能
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortTools(e.target.value);
            });
        }
    }

    // 加载工具数据
    async loadTools() {
        try {
            this.showLoading();
            const response = await fetch(this.options.apiUrl);
            const data = await response.json();
            this.tools = data;
            this.renderTools();
        } catch (error) {
            console.error('Error loading tools:', error);
            this.showError('Failed to load tools');
        } finally {
            this.hideLoading();
        }
    }

    // 加载更多工具
    async loadMoreTools() {
        if (this.isLoading) return;

        this.isLoading = true;
        try {
            const start = (this.currentPage - 1) * this.options.itemsPerPage;
            const end = start + this.options.itemsPerPage;
            const toolsToLoad = this.tools.slice(start, end);

            if (toolsToLoad.length === 0) {
                this.observer.disconnect();
                return;
            }

            await this.renderTools(toolsToLoad);
            this.currentPage++;
        } catch (error) {
            console.error('Error loading more tools:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // 渲染工具卡片
    async renderTools(tools = this.tools) {
        const fragment = document.createDocumentFragment();
        
        tools.forEach(tool => {
            const card = this.createToolCard(tool);
            fragment.appendChild(card);
        });

        this.container.appendChild(fragment);
        
        // 观察新添加的卡片
        const lastCard = this.container.lastElementChild;
        if (lastCard) {
            this.observer.observe(lastCard);
        }
    }

    // 创建工具卡片
    createToolCard(tool) {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.dataset.id = tool.id;

        const imageContainer = this.createImageContainer(tool.image);
        const content = this.createToolContent(tool);

        card.appendChild(imageContainer);
        card.appendChild(content);

        return card;
    }

    // 创建图片容器
    createImageContainer(imageUrl) {
        const container = document.createElement('div');
        container.className = 'tool-image';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Tool Preview';
        img.loading = 'lazy';

        img.onload = () => {
            img.classList.add('loaded');
        };

        container.appendChild(img);
        return container;
    }

    // 创建工具内容
    createToolContent(tool) {
        const content = document.createElement('div');
        content.className = 'tool-content';

        const header = this.createToolHeader(tool);
        const description = this.createToolDescription(tool);
        const meta = this.createToolMeta(tool);
        const actions = this.createToolActions(tool);

        content.appendChild(header);
        content.appendChild(description);
        content.appendChild(meta);
        content.appendChild(actions);

        return content;
    }

    // 创建工具头部
    createToolHeader(tool) {
        const header = document.createElement('div');
        header.className = 'tool-header';

        const title = document.createElement('h3');
        title.className = 'tool-title';
        title.textContent = tool.name;

        const badges = this.createBadges(tool);

        header.appendChild(title);
        header.appendChild(badges);

        return header;
    }

    // 创建徽章
    createBadges(tool) {
        const badges = document.createElement('div');
        badges.className = 'badges';

        if (tool.sponsored) {
            const sponsoredBadge = document.createElement('span');
            sponsoredBadge.className = 'badge sponsored';
            sponsoredBadge.textContent = 'Sponsored';
            badges.appendChild(sponsoredBadge);
        }

        if (tool.isNew) {
            const newBadge = document.createElement('span');
            newBadge.className = 'badge new';
            newBadge.textContent = 'New';
            badges.appendChild(newBadge);
        }

        return badges;
    }

    // 创建工具描述
    createToolDescription(tool) {
        const description = document.createElement('p');
        description.className = 'tool-description';
        description.textContent = tool.description;
        return description;
    }

    // 创建工具元数据
    createToolMeta(tool) {
        const meta = document.createElement('div');
        meta.className = 'tool-meta';

        const category = this.createToolCategory(tool.category);
        const rating = this.createToolRating(tool.rating);
        const tags = this.createToolTags(tool.tags);

        meta.appendChild(category);
        meta.appendChild(rating);
        meta.appendChild(tags);

        return meta;
    }

    // 创建工具分类
    createToolCategory(category) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'tool-category';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-folder';
        
        const text = document.createElement('span');
        text.textContent = category;

        categoryElement.appendChild(icon);
        categoryElement.appendChild(text);

        return categoryElement;
    }

    // 创建工具评分
    createToolRating(rating) {
        const ratingElement = document.createElement('div');
        ratingElement.className = 'tool-rating';

        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            star.className = i < rating ? 'fas fa-star' : 'far fa-star';
            ratingElement.appendChild(star);
        }

        return ratingElement;
    }

    // 创建工具标签
    createToolTags(tags) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tool-tags';

        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tool-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });

        return tagsContainer;
    }

    // 创建工具操作按钮
    createToolActions(tool) {
        const actions = document.createElement('div');
        actions.className = 'tool-actions';

        const visitButton = document.createElement('button');
        visitButton.className = 'tool-button primary';
        visitButton.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit';
        visitButton.onclick = () => window.open(tool.url, '_blank');

        const saveButton = document.createElement('button');
        saveButton.className = 'tool-button secondary';
        saveButton.innerHTML = '<i class="far fa-bookmark"></i> Save';
        saveButton.onclick = () => this.saveTool(tool);

        actions.appendChild(visitButton);
        actions.appendChild(saveButton);

        return actions;
    }

    // 保存工具
    saveTool(tool) {
        // 实现保存功能
        console.log('Saving tool:', tool);
    }

    // 过滤工具
    filterTools(query) {
        const filteredTools = this.tools.filter(tool => 
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase()) ||
            tool.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        this.clearContainer();
        this.renderTools(filteredTools);
    }

    // 按分类过滤
    filterByCategory(category) {
        const filteredTools = category === 'all' 
            ? this.tools 
            : this.tools.filter(tool => tool.category === category);

        this.clearContainer();
        this.renderTools(filteredTools);
    }

    // 排序工具
    sortTools(criteria) {
        const sortedTools = [...this.tools].sort((a, b) => {
            switch (criteria) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

        this.clearContainer();
        this.renderTools(sortedTools);
    }

    // 清除容器
    clearContainer() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    // 显示加载状态
    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.container.appendChild(loading);
    }

    // 隐藏加载状态
    hideLoading() {
        const loading = this.container.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }

    // 显示错误信息
    showError(message) {
        const error = document.createElement('div');
        error.className = 'error';
        error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        this.container.appendChild(error);
    }

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 初始化组件
document.addEventListener('DOMContentLoaded', () => {
    const aiCards = new AICards('ai-tools-container', {
        itemsPerPage: 12,
        loadingDelay: 300
    });
});
