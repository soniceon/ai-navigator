// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // API endpoint for fetching tools
    const API_ENDPOINT = '/api/tools';
    
    // Loading state
    let isLoading = false;
    
    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                
                if (src) {
                    img.src = src;
                    img.onload = () => {
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    };
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    // Intersection Observer for lazy loading sections
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.1
    });
    
    // Function to show loading state
    function showLoading(container) {
        const loadingHtml = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading tools...</p>
            </div>
        `;
        container.innerHTML = loadingHtml;
    }
    
    // Function to show error state
    function showError(container, message) {
        const errorHtml = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button class="retry-btn">Retry</button>
            </div>
        `;
        container.innerHTML = errorHtml;
        
        // Add retry functionality
        const retryBtn = container.querySelector('.retry-btn');
        retryBtn.addEventListener('click', () => {
            loadTools(container);
        });
    }
    
    // Function to fetch tools from API with caching
    async function fetchTools() {
        const cacheKey = 'tools_cache';
        const cache = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const now = Date.now();
        
        // Check if cache is valid (less than 1 hour old)
        if (cache && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 3600000) {
            return JSON.parse(cache);
        }
        
        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                throw new Error('Failed to fetch tools');
            }
            const tools = await response.json();
            
            // Cache the results
            localStorage.setItem(cacheKey, JSON.stringify(tools));
            localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
            
            return tools;
        } catch (error) {
            console.error('Error fetching tools:', error);
            throw error;
        }
    }
    
    // Function to create and display tool cards
    function displayTools(tools, container) {
        const toolsContainer = document.querySelector(container);
        
        // Only proceed if the container exists on this page
        if (!toolsContainer) return;
        
        // Clear existing content
        toolsContainer.innerHTML = '';
        
        if (tools.length === 0) {
            toolsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No tools found</p>
                </div>
            `;
            return;
        }
        
        tools.forEach(tool => {
            // Create tool card
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card lazy-load';
            
            // Create HTML for the tool card
            toolCard.innerHTML = `
                <div class="tool-image">
                    <img data-src="${tool.image}" alt="${tool.name}">
                </div>
                <div class="tool-content">
                    <div class="tool-title">
                        ${tool.name}
                        ${tool.isSponsored ? '<span class="sponsored">Sponsored</span>' : ''}
                        ${tool.isNew ? '<span class="new-label">New</span>' : ''}
                    </div>
                    <div class="tool-description">${tool.description}</div>
                    <div class="tool-meta">
                        <span class="tool-category">${tool.category}</span>
                        <span class="tool-rating">
                            <i class="fas fa-star"></i>
                            ${tool.rating}
                        </span>
                    </div>
                </div>
            `;
            
            // Add click event to the tool card
            toolCard.addEventListener('click', function() {
                // Create a URL based on the tool name
                const toolUrl = `/pages/tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}.html`;
                window.location.href = toolUrl;
            });
            
            // Add the tool card to the container
            toolsContainer.appendChild(toolCard);
            
            // Observe the card for lazy loading
            sectionObserver.observe(toolCard);
            
            // Observe the image for lazy loading
            const img = toolCard.querySelector('img');
            imageObserver.observe(img);
        });
    }
    
    // Function to load tools
    async function loadTools(container) {
        if (isLoading) return;
        
        isLoading = true;
        showLoading(container);
        
        try {
            const tools = await fetchTools();
            displayTools(tools, container);
        } catch (error) {
            showError(container, 'Failed to load tools. Please try again later.');
        } finally {
            isLoading = false;
        }
    }
    
    // Function to handle search with debounce
    function setupSearch() {
        const searchInputs = document.querySelectorAll('.search input, .search-large input');
        const searchButtons = document.querySelectorAll('.search button, .search-large button');
        
        let searchTimeout;
        
        // Function to perform search with debounce
        async function performSearch(searchTerm) {
            if (searchTerm.trim() === '') {
                showError(document.querySelector('.tools-grid'), 'Please enter a search term');
                return;
            }
            
            try {
                const response = await fetch(`${API_ENDPOINT}?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) {
                    throw new Error('Search failed');
                }
                const results = await response.json();
                displayTools(results, '.tools-grid');
            } catch (error) {
                showError(document.querySelector('.tools-grid'), 'Search failed. Please try again.');
            }
        }
        
        // Add event listeners to search inputs and buttons
        searchInputs.forEach((input, index) => {
            // Submit search when Enter key is pressed
            input.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    clearTimeout(searchTimeout);
                    performSearch(input.value);
                } else {
                    // Debounce the search
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        performSearch(input.value);
                    }, 300);
                }
            });
            
            // Connect button to corresponding input when possible
            if (searchButtons[index]) {
                searchButtons[index].addEventListener('click', function() {
                    clearTimeout(searchTimeout);
                    performSearch(input.value);
                });
            }
        });
    }
    
    // Function to make categories interactive
    function setupCategories() {
        const categories = document.querySelectorAll('.category');
        const categoryFilters = document.querySelectorAll('.category-filter, .filter-btn');
        
        // Handle category clicks
        categories.forEach(category => {
            category.addEventListener('click', async function() {
                const categoryName = category.textContent.trim();
                
                try {
                    const response = await fetch(`${API_ENDPOINT}?category=${encodeURIComponent(categoryName)}`);
                    if (!response.ok) {
                        throw new Error('Failed to filter by category');
                    }
                    const tools = await response.json();
                    displayTools(tools, '.tools-grid');
                } catch (error) {
                    showError(document.querySelector('.tools-grid'), 'Failed to filter tools. Please try again.');
                }
            });
        });
        
        // Handle filter button clicks
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                categoryFilters.forEach(f => f.classList.remove('active'));
                // Add active class to clicked filter
                this.classList.add('active');
                
                const category = this.dataset.category || this.textContent.trim();
                if (category === 'all') {
                    loadTools('.tools-grid');
                } else {
                    // Filter tools by category
                    fetch(`${API_ENDPOINT}?category=${encodeURIComponent(category)}`)
                        .then(response => {
                            if (!response.ok) throw new Error('Failed to filter');
                            return response.json();
                        })
                        .then(tools => displayTools(tools, '.tools-grid'))
                        .catch(error => {
                            showError(document.querySelector('.tools-grid'), 'Failed to filter tools. Please try again.');
                        });
                }
            });
        });
    }
    
    // Initialize functionality
    loadTools('.tools-grid');
    setupSearch();
    setupCategories();
    
    // Add loading animation styles
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            text-align: center;
            padding: 40px;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto 20px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            text-align: center;
            padding: 40px;
            color: #e74c3c;
        }
        
        .error i {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .retry-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
        }
        
        .no-results {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .no-results i {
            font-size: 3rem;
            margin-bottom: 20px;
            color: var(--primary-color);
        }
    `;
    document.head.appendChild(style);
});
