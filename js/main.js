// Load Components
$(document).ready(function() {
    // Load Header
    $("#header").load("components/header.html", function() {
        // Initialize theme
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        $('#checkbox').prop('checked', theme === 'dark');

        // Theme Switch Handler
        $('#checkbox').change(function() {
            if ($(this).is(':checked')) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });

        // Navbar Scroll Effect
        $(window).scroll(function() {
            if ($(window).scrollTop() > 50) {
                $('.navbar').addClass('scrolled');
            } else {
                $('.navbar').removeClass('scrolled');
            }
        });

        // Mobile Menu
        $('.navbar-toggler').click(function() {
            $('.navbar-collapse').slideToggle(300);
        });

        // Dropdown Hover
        $('.dropdown').hover(
            function() {
                $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(300);
            },
            function() {
                $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(300);
            }
        );
    });

    // Load Footer
    $("#footer").load("components/footer.html");

    // Contact Form Handler
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };

        // Here you would typically send the data to your server
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        this.reset();
    });

    // Search Functionality
    $('.search-input').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        // Here you would typically implement the search logic
        console.log('Searching for:', searchTerm);
    });
});

// Announcement Bar Animation
const announcements = document.querySelectorAll('.announcement-text');
announcements.forEach(announcement => {
    // Clone the text to create a seamless loop
    announcement.innerHTML = announcement.innerHTML + ' ' + announcement.innerHTML;
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Tool search functionality
function initializeToolSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            searchTools(searchTerm);
        }, 300));
    }
}

// Debounce function to limit API calls
function debounce(func, wait) {
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

// Search tools function
function searchTools(searchTerm) {
    // This would typically make an API call to your backend
    // For now, we'll just filter the tools array
    const toolsGrid = document.getElementById('popularToolsGrid');
    if (!toolsGrid) return;

    const toolCards = toolsGrid.getElementsByClassName('tool-card');
    Array.from(toolCards).forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Load popular tools
function loadPopularTools() {
    const toolsGrid = document.getElementById('popularToolsGrid');
    if (!toolsGrid) return;

    // Sample tools data - in a real application, this would come from an API
    const popularTools = [
        {
            title: 'Image to PNG Converter',
            description: 'Convert various image formats to PNG',
            icon: 'fa-image',
            category: 'image-tools'
        },
        {
            title: 'Word Counter',
            description: 'Count words, characters, and sentences in your text',
            icon: 'fa-text-width',
            category: 'text-tools'
        },
        {
            title: 'Unit Converter',
            description: 'Convert between different units of measurement',
            icon: 'fa-exchange-alt',
            category: 'converters'
        },
        {
            title: 'SEO Analyzer',
            description: 'Analyze your website\'s SEO performance',
            icon: 'fa-search',
            category: 'seo-tools'
        }
    ];

    // Create tool cards
    popularTools.forEach(tool => {
        const card = createToolCard(tool);
        toolsGrid.appendChild(card);
    });
}

// Create tool card element
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-3 tool-card fade-in';
    
    card.innerHTML = `
        <div class="text-center">
            <i class="fas ${tool.icon} fa-2x mb-3 text-primary"></i>
            <h3>${tool.title}</h3>
            <p>${tool.description}</p>
            <a href="/tools/${tool.category}/${tool.title.toLowerCase().replace(/\s+/g, '-')}" 
               class="btn btn-primary">Use Tool</a>
        </div>
    `;
    
    return card;
}

// Handle category card clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.category-card')) {
        const category = e.target.closest('.category-card').querySelector('h3').textContent.toLowerCase();
        window.location.href = `/category/${category.replace(/\s+/g, '-')}`;
    }
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    if (!localStorage.getItem('theme') && themeSwitch) {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeSwitch.checked = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeSwitch.checked = false;
        }
    }
}); 