class CommentSystem {
    constructor(toolId) {
        this.toolId = toolId;
        this.comments = [];
        this.currentPage = 1;
        this.commentsPerPage = 10;
        this.isLoading = false;
        this.initialize();
    }

    // 初始化
    async initialize() {
        try {
            await this.loadComments();
            this.setupEventListeners();
            this.setupIntersectionObserver();
        } catch (error) {
            console.error('Failed to initialize comment system:', error);
        }
    }

    // 加载评论
    async loadComments() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const response = await fetch(`/api/tools/${this.toolId}/comments?page=${this.currentPage}&limit=${this.commentsPerPage}`);
            if (!response.ok) throw new Error('Failed to load comments');
            
            const data = await response.json();
            this.comments = [...this.comments, ...data.comments];
            this.renderComments();
            
            // 更新分页信息
            this.updatePagination(data.total, data.page, data.pages);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // 渲染评论
    renderComments() {
        const commentsContainer = document.querySelector('.comments-list');
        if (!commentsContainer) return;

        const commentsHTML = this.comments.map(comment => this.createCommentHTML(comment)).join('');
        commentsContainer.innerHTML = commentsHTML;

        // 重新绑定事件
        this.bindCommentEvents();
    }

    // 创建评论 HTML
    createCommentHTML(comment) {
        return `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <div class="user-info">
                        <img src="${comment.user.avatar}" alt="${comment.user.name}" class="user-avatar">
                        <div class="user-name">${comment.user.name}</div>
                    </div>
                    <div class="comment-meta">
                        <span class="comment-date">${this.formatDate(comment.createdAt)}</span>
                        ${comment.isEdited ? '<span class="edited-badge">已编辑</span>' : ''}
                    </div>
                </div>
                <div class="comment-content">
                    <p>${this.escapeHTML(comment.content)}</p>
                </div>
                <div class="comment-actions">
                    <button class="like-button" data-comment-id="${comment.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${comment.likes}</span>
                    </button>
                    <button class="reply-button" data-comment-id="${comment.id}">
                        <i class="fas fa-reply"></i>
                        <span>回复</span>
                    </button>
                    ${comment.isOwner ? `
                        <button class="edit-button" data-comment-id="${comment.id}">
                            <i class="fas fa-edit"></i>
                            <span>编辑</span>
                        </button>
                        <button class="delete-button" data-comment-id="${comment.id}">
                            <i class="fas fa-trash"></i>
                            <span>删除</span>
                        </button>
                    ` : ''}
                </div>
                ${comment.replies && comment.replies.length > 0 ? `
                    <div class="replies">
                        ${comment.replies.map(reply => this.createReplyHTML(reply)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // 创建回复 HTML
    createReplyHTML(reply) {
        return `
            <div class="reply" data-reply-id="${reply.id}">
                <div class="reply-header">
                    <div class="user-info">
                        <img src="${reply.user.avatar}" alt="${reply.user.name}" class="user-avatar">
                        <div class="user-name">${reply.user.name}</div>
                    </div>
                    <div class="reply-meta">
                        <span class="reply-date">${this.formatDate(reply.createdAt)}</span>
                        ${reply.isEdited ? '<span class="edited-badge">已编辑</span>' : ''}
                    </div>
                </div>
                <div class="reply-content">
                    <p>${this.escapeHTML(reply.content)}</p>
                </div>
                <div class="reply-actions">
                    <button class="like-button" data-reply-id="${reply.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${reply.likes}</span>
                    </button>
                    ${reply.isOwner ? `
                        <button class="edit-button" data-reply-id="${reply.id}">
                            <i class="fas fa-edit"></i>
                            <span>编辑</span>
                        </button>
                        <button class="delete-button" data-reply-id="${reply.id}">
                            <i class="fas fa-trash"></i>
                            <span>删除</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 评论表单提交
        const commentForm = document.querySelector('.comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        }

        // 回复表单提交
        const replyForm = document.querySelector('.reply-form');
        if (replyForm) {
            replyForm.addEventListener('submit', (e) => this.handleReplySubmit(e));
        }

        // 绑定评论事件
        this.bindCommentEvents();
    }

    // 绑定评论事件
    bindCommentEvents() {
        // 点赞按钮
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleLikeClick(e));
        });

        // 回复按钮
        document.querySelectorAll('.reply-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleReplyClick(e));
        });

        // 编辑按钮
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleEditClick(e));
        });

        // 删除按钮
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleDeleteClick(e));
        });
    }

    // 处理评论提交
    async handleCommentSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const content = form.querySelector('textarea').value.trim();

        if (!content) {
            this.showError('请输入评论内容');
            return;
        }

        try {
            const response = await fetch(`/api/tools/${this.toolId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) throw new Error('Failed to post comment');

            const newComment = await response.json();
            this.comments.unshift(newComment);
            this.renderComments();
            form.reset();
            this.showToast('评论发布成功');
        } catch (error) {
            this.showError('评论发布失败，请重试');
        }
    }

    // 处理回复提交
    async handleReplySubmit(event) {
        event.preventDefault();
        const form = event.target;
        const commentId = form.dataset.commentId;
        const content = form.querySelector('textarea').value.trim();

        if (!content) {
            this.showError('请输入回复内容');
            return;
        }

        try {
            const response = await fetch(`/api/tools/${this.toolId}/comments/${commentId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) throw new Error('Failed to post reply');

            const newReply = await response.json();
            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
                if (!comment.replies) comment.replies = [];
                comment.replies.push(newReply);
                this.renderComments();
            }
            form.reset();
            this.showToast('回复发布成功');
        } catch (error) {
            this.showError('回复发布失败，请重试');
        }
    }

    // 处理点赞点击
    async handleLikeClick(event) {
        const button = event.currentTarget;
        const commentId = button.dataset.commentId;
        const replyId = button.dataset.replyId;

        try {
            const url = replyId 
                ? `/api/tools/${this.toolId}/comments/${commentId}/replies/${replyId}/like`
                : `/api/tools/${this.toolId}/comments/${commentId}/like`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to like');

            const data = await response.json();
            const countSpan = button.querySelector('span');
            countSpan.textContent = data.likes;
            button.disabled = true;
        } catch (error) {
            this.showError('操作失败，请重试');
        }
    }

    // 处理回复点击
    handleReplyClick(event) {
        const button = event.currentTarget;
        const commentId = button.dataset.commentId;
        const comment = document.querySelector(`.comment[data-comment-id="${commentId}"]`);

        // 移除现有的回复表单
        const existingForm = comment.querySelector('.reply-form');
        if (existingForm) {
            existingForm.remove();
            return;
        }

        // 创建新的回复表单
        const form = document.createElement('form');
        form.className = 'reply-form';
        form.dataset.commentId = commentId;
        form.innerHTML = `
            <textarea placeholder="写下你的回复..." required></textarea>
            <div class="form-actions">
                <button type="button" class="cancel-button">取消</button>
                <button type="submit" class="submit-button">回复</button>
            </div>
        `;

        // 插入回复表单
        const repliesContainer = comment.querySelector('.replies') || document.createElement('div');
        if (!comment.querySelector('.replies')) {
            repliesContainer.className = 'replies';
            comment.appendChild(repliesContainer);
        }
        repliesContainer.insertBefore(form, repliesContainer.firstChild);

        // 绑定取消按钮事件
        form.querySelector('.cancel-button').addEventListener('click', () => form.remove());
    }

    // 处理编辑点击
    handleEditClick(event) {
        const button = event.currentTarget;
        const commentId = button.dataset.commentId;
        const replyId = button.dataset.replyId;
        const element = replyId 
            ? document.querySelector(`.reply[data-reply-id="${replyId}"]`)
            : document.querySelector(`.comment[data-comment-id="${commentId}"]`);

        const contentElement = element.querySelector('.comment-content p, .reply-content p');
        const currentContent = contentElement.textContent;

        // 创建编辑表单
        const form = document.createElement('form');
        form.className = 'edit-form';
        form.innerHTML = `
            <textarea>${currentContent}</textarea>
            <div class="form-actions">
                <button type="button" class="cancel-button">取消</button>
                <button type="submit" class="submit-button">保存</button>
            </div>
        `;

        // 替换内容
        contentElement.parentElement.replaceWith(form);

        // 绑定事件
        form.addEventListener('submit', (e) => this.handleEditSubmit(e, commentId, replyId));
        form.querySelector('.cancel-button').addEventListener('click', () => {
            form.replaceWith(contentElement.parentElement);
        });
    }

    // 处理编辑提交
    async handleEditSubmit(event, commentId, replyId) {
        event.preventDefault();
        const form = event.target;
        const content = form.querySelector('textarea').value.trim();

        if (!content) {
            this.showError('请输入内容');
            return;
        }

        try {
            const url = replyId
                ? `/api/tools/${this.toolId}/comments/${commentId}/replies/${replyId}`
                : `/api/tools/${this.toolId}/comments/${commentId}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) throw new Error('Failed to update');

            const updatedContent = await response.json();
            const contentElement = document.createElement('div');
            contentElement.className = replyId ? 'reply-content' : 'comment-content';
            contentElement.innerHTML = `<p>${this.escapeHTML(updatedContent.content)}</p>`;
            form.replaceWith(contentElement);
            this.showToast('更新成功');
        } catch (error) {
            this.showError('更新失败，请重试');
        }
    }

    // 处理删除点击
    async handleDeleteClick(event) {
        if (!confirm('确定要删除吗？')) return;

        const button = event.currentTarget;
        const commentId = button.dataset.commentId;
        const replyId = button.dataset.replyId;

        try {
            const url = replyId
                ? `/api/tools/${this.toolId}/comments/${commentId}/replies/${replyId}`
                : `/api/tools/${this.toolId}/comments/${commentId}`;

            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete');

            if (replyId) {
                const comment = this.comments.find(c => c.id === commentId);
                if (comment && comment.replies) {
                    comment.replies = comment.replies.filter(r => r.id !== replyId);
                }
            } else {
                this.comments = this.comments.filter(c => c.id !== commentId);
            }

            this.renderComments();
            this.showToast('删除成功');
        } catch (error) {
            this.showError('删除失败，请重试');
        }
    }

    // 设置交叉观察器
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoading) {
                    this.currentPage++;
                    this.loadComments();
                }
            });
        }, {
            rootMargin: '100px'
        });

        const loadMoreButton = document.querySelector('.load-more-comments');
        if (loadMoreButton) {
            observer.observe(loadMoreButton);
        }
    }

    // 更新分页信息
    updatePagination(total, currentPage, totalPages) {
        const pagination = document.querySelector('.comments-pagination');
        if (!pagination) return;

        pagination.innerHTML = `
            <div class="pagination-info">
                共 ${total} 条评论，第 ${currentPage}/${totalPages} 页
            </div>
            <div class="pagination-controls">
                ${currentPage > 1 ? `
                    <button class="prev-page" ${currentPage === 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                        上一页
                    </button>
                ` : ''}
                ${currentPage < totalPages ? `
                    <button class="next-page" ${currentPage === totalPages ? 'disabled' : ''}>
                        下一页
                        <i class="fas fa-chevron-right"></i>
                    </button>
                ` : ''}
            </div>
        `;

        // 绑定分页按钮事件
        pagination.querySelector('.prev-page')?.addEventListener('click', () => {
            if (currentPage > 1) {
                this.currentPage = currentPage - 1;
                this.loadComments();
            }
        });

        pagination.querySelector('.next-page')?.addEventListener('click', () => {
            if (currentPage < totalPages) {
                this.currentPage = currentPage + 1;
                this.loadComments();
            }
        });
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // HTML 转义
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
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

// 初始化评论系统
document.addEventListener('DOMContentLoaded', () => {
    const toolId = new URLSearchParams(window.location.search).get('id');
    if (toolId) {
        new CommentSystem(toolId);
    }
}); 