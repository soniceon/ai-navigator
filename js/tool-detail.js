class ToolDetail {
    constructor() {
        this.toolId = this.getToolIdFromUrl();
        this.toolData = null;
        this.reviewsPage = 1;
        this.reviewsPerPage = 5;
        this.isLoading = false;
        this.initialize();
    }

    // 从URL获取工具ID
    getToolIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // 初始化
    async initialize() {
        if (!this.toolId) {
            this.showError('未找到工具ID');
            return;
        }

        try {
            await this.loadToolData();
            this.setupEventListeners();
            this.setupIntersectionObserver();
        } catch (error) {
            this.showError('加载工具数据失败');
            console.error('Error:', error);
        }
    }

    // 加载工具数据
    async loadToolData() {
        try {
            const response = await fetch(`/api/tools/${this.toolId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            this.toolData = await response.json();
            this.renderToolData();
        } catch (error) {
            throw new Error('Failed to load tool data');
        }
    }

    // 渲染工具数据
    renderToolData() {
        if (!this.toolData) return;

        // 更新工具头部信息
        document.querySelector('.tool-image img').src = this.toolData.image;
        document.querySelector('.tool-title').textContent = this.toolData.name;
        document.querySelector('.tool-category span').textContent = this.toolData.category;
        document.querySelector('.tool-rating span').textContent = this.toolData.rating;
        document.querySelector('.tool-views span').textContent = this.formatNumber(this.toolData.views);
        
        // 更新工具描述
        document.querySelector('.tool-description p').textContent = this.toolData.description;
        
        // 更新功能列表
        const featuresList = document.querySelector('.tool-features ul');
        featuresList.innerHTML = this.toolData.features.map(feature => `
            <li>
                <i class="fas fa-check-circle"></i>
                <span>${feature}</span>
            </li>
        `).join('');

        // 更新价格方案
        this.renderPricingCards();

        // 更新教程步骤
        this.renderTutorialSteps();

        // 更新评价
        this.renderReviews();
    }

    // 渲染价格方案
    renderPricingCards() {
        const pricingCards = document.querySelector('.pricing-cards');
        pricingCards.innerHTML = this.toolData.pricing.map(plan => `
            <div class="pricing-card ${plan.featured ? 'featured' : ''}">
                <h3>${plan.name}</h3>
                <div class="price">${plan.price}</div>
                <ul>
                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <button class="tool-button primary" data-plan="${plan.id}">
                    ${plan.buttonText}
                </button>
            </div>
        `).join('');
    }

    // 渲染教程步骤
    renderTutorialSteps() {
        const tutorialSteps = document.querySelector('.tutorial-steps');
        tutorialSteps.innerHTML = this.toolData.tutorial.map((step, index) => `
            <div class="step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <h3>${step.title}</h3>
                    <p>${step.description}</p>
                </div>
            </div>
        `).join('');
    }

    // 渲染评价
    renderReviews() {
        const reviewsList = document.querySelector('.reviews-list');
        const reviews = this.toolData.reviews.slice(0, this.reviewsPage * this.reviewsPerPage);
        
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review">
                <div class="review-header">
                    <div class="user-info">
                        <img src="${review.user.avatar}" alt="${review.user.name}" class="user-avatar">
                        <div class="user-name">${review.user.name}</div>
                    </div>
                    <div class="review-rating">
                        ${this.renderStars(review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.content}</p>
                </div>
                <div class="review-footer">
                    <span class="review-date">${this.formatDate(review.date)}</span>
                    <button class="review-helpful" data-review-id="${review.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span>有帮助 (${review.helpful})</span>
                    </button>
                </div>
            </div>
        `).join('');

        // 更新加载更多按钮状态
        const loadMoreButton = document.querySelector('.load-more-reviews');
        if (reviews.length >= this.toolData.reviews.length) {
            loadMoreButton.style.display = 'none';
        }
    }

    // 渲染星级评分
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 收藏按钮
        document.getElementById('saveTool').addEventListener('click', () => this.toggleSaveTool());

        // 分享按钮
        document.getElementById('shareTool').addEventListener('click', () => this.shareTool());

        // FAQ 展开/收起
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => this.toggleFaq(question));
        });

        // 评价有帮助按钮
        document.querySelectorAll('.review-helpful').forEach(button => {
            button.addEventListener('click', (e) => this.handleHelpfulClick(e));
        });

        // 加载更多评价
        document.querySelector('.load-more-reviews').addEventListener('click', () => this.loadMoreReviews());

        // 价格方案按钮
        document.querySelectorAll('.pricing-card .tool-button').forEach(button => {
            button.addEventListener('click', (e) => this.handlePricingButtonClick(e));
        });
    }

    // 设置交叉观察器
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoading) {
                    this.loadMoreReviews();
                }
            });
        }, {
            rootMargin: '100px'
        });

        const loadMoreButton = document.querySelector('.load-more-reviews');
        if (loadMoreButton) {
            observer.observe(loadMoreButton);
        }
    }

    // 切换收藏状态
    async toggleSaveTool() {
        const saveButton = document.getElementById('saveTool');
        const isSaved = saveButton.classList.contains('saved');

        try {
            const response = await fetch(`/api/tools/${this.toolId}/save`, {
                method: isSaved ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                saveButton.classList.toggle('saved');
                saveButton.innerHTML = `
                    <i class="${isSaved ? 'far' : 'fas'} fa-bookmark"></i>
                    ${isSaved ? '收藏' : '已收藏'}
                `;
            }
        } catch (error) {
            this.showError('操作失败，请重试');
        }
    }

    // 分享工具
    shareTool() {
        if (navigator.share) {
            navigator.share({
                title: this.toolData.name,
                text: this.toolData.description,
                url: window.location.href
            }).catch(error => {
                console.error('Error sharing:', error);
            });
        } else {
            // 回退方案：复制链接
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    this.showToast('链接已复制到剪贴板');
                })
                .catch(() => {
                    this.showError('复制链接失败');
                });
        }
    }

    // 切换FAQ展开/收起
    toggleFaq(question) {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    }

    // 处理评价有帮助点击
    async handleHelpfulClick(event) {
        const button = event.currentTarget;
        const reviewId = button.dataset.reviewId;

        try {
            const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const countSpan = button.querySelector('span');
                countSpan.textContent = `有帮助 (${data.helpful})`;
                button.disabled = true;
            }
        } catch (error) {
            this.showError('操作失败，请重试');
        }
    }

    // 加载更多评价
    loadMoreReviews() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.reviewsPage++;
        this.renderReviews();
        this.isLoading = false;
    }

    // 处理价格方案按钮点击
    handlePricingButtonClick(event) {
        const button = event.currentTarget;
        const planId = button.dataset.plan;
        
        // 根据不同的价格方案执行不同的操作
        switch (planId) {
            case 'free':
                window.location.href = this.toolData.freePlanUrl;
                break;
            case 'pro':
                window.location.href = this.toolData.proPlanUrl;
                break;
            case 'enterprise':
                window.location.href = this.toolData.enterprisePlanUrl;
                break;
        }
    }

    // 格式化数字
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // 显示错误信息
    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // 显示提示信息
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// 初始化工具详情页面
document.addEventListener('DOMContentLoaded', () => {
    new ToolDetail();
}); 