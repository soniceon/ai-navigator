// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for AI tools (in a real app, this would come from a database)
    const aiTools = [
        {
            id: 1,
            name: 'ChatGPT',
            description: 'Powerful language model that can answer questions, write content, and assist with various tasks.',
            category: 'Text Generation',
            rating: 4.9,
            image: 'https://via.placeholder.com/300x200?text=ChatGPT',
            isSponsored: true
        },
        {
            id: 2,
            name: 'DALL-E 3',
            description: 'Create realistic images and art from natural language descriptions.',
            category: 'Image Generation',
            rating: 4.8,
            image: 'https://via.placeholder.com/300x200?text=DALL-E',
            isNew: true
        },
        {
            id: 3,
            name: 'Claude',
            description: 'AI assistant that can understand complex instructions and complete them thoroughly.',
            category: 'Text Generation',
            rating: 4.7,
            image: 'https://via.placeholder.com/300x200?text=Claude'
        },
        {
            id: 4,
            name: 'Midjourney',
            description: 'AI art generator that creates beautiful imagery from text descriptions.',
            category: 'Image Generation',
            rating: 4.9,
            image: 'https://via.placeholder.com/300x200?text=Midjourney'
        }
    ];

    // Function to create and display tool cards
    function displayTools(tools, container) {
        const toolsContainer = document.querySelector(container);
        
        // Only proceed if the container exists on this page
        if (!toolsContainer) return;
        
        tools.forEach(tool => {
            // Create tool card
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            
            // Create HTML for the tool card
            toolCard.innerHTML = `
                <div class="tool-image">
                    <img src="${tool.image}" alt="${tool.name}">
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f39c12" stroke="#f39c12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            ${tool.rating}
                        </span>
                    </div>
                </div>
            `;
            
            // Add click event to the tool card
            toolCard.addEventListener('click', function() {
                // In a real app, this would navigate to the tool's detail page
                alert(`You clicked on ${tool.name}`);
            });
            
            // Add the tool card to the container
            toolsContainer.appendChild(toolCard);
        });
    }

    // Function to handle search
    function setupSearch() {
        const searchInputs = document.querySelectorAll('.search input, .search-large input');
        const searchButtons = document.querySelectorAll('.search button, .search-large button');
        
        // Function to perform search
        function performSearch(searchTerm) {
            if (searchTerm.trim() === '') {
                alert('Please enter a search term');
                return;
            }
            
            // In a real app, this would search through your database
            // For now, just show an alert
            alert(`You searched for: ${searchTerm}`);
        }
        
        // Add event listeners to search inputs and buttons
        searchInputs.forEach((input, index) => {
            // Submit search when Enter key is pressed
            input.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    performSearch(input.value);
                }
            });
            
            // Connect button to corresponding input when possible
            if (searchButtons[index]) {
                searchButtons[index].addEventListener('click', function() {
                    performSearch(input.value);
                });
            }
        });
    }

    // Function to make categories interactive
    function setupCategories() {
        const categories = document.querySelectorAll('.category');
        
        categories.forEach(category => {
            category.addEventListener('click', function() {
                const categoryName = category.textContent.trim();
                // In a real app, this would filter tools by category
                alert(`You clicked on ${categoryName} category`);
            });
        });
    }

    // Initialize functionality
    displayTools(aiTools, '.tools-grid');
    setupSearch();
    setupCategories();
});
