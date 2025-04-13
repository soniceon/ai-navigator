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
