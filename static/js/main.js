/**
 * UI/UX Portfolio - Main JavaScript
 * Handles all interactive functionality
 */

(function() {
    'use strict';

    // ============================================
    // State Management
    // ============================================
    const state = {
        currentFilter: 'all',
        chatbotOpen: false,
        mobileMenuOpen: false
    };

    // ============================================
    // DOM Ready
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initProjectFilters();
        initChatbot();
        initScrollEffects();
        initAnimations();
        initMobileMenu();
    });

    // ============================================
    // Navigation
    // ============================================
    function initNavigation() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close mobile menu if open
                    if (state.mobileMenuOpen) {
                        toggleMobileMenu();
                    }
                    
                    // Calculate offset for fixed header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });

        // Active navigation highlighting
        window.addEventListener('scroll', highlightActiveNav);
    }

    function highlightActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
        
        let current = '';
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Mobile Menu
    // ============================================
    function initMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', toggleMobileMenu);
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (state.mobileMenuOpen && 
                    !menuToggle.contains(e.target) && 
                    !mobileNav.contains(e.target)) {
                    toggleMobileMenu();
                }
            });
            
            // Close menu on ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && state.mobileMenuOpen) {
                    toggleMobileMenu();
                }
            });
        }
    }

    function toggleMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        
        state.mobileMenuOpen = !state.mobileMenuOpen;
        
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.mobileMenuOpen ? 'hidden' : '';
    }

    // ============================================
    // Project Filtering
    // ============================================
    function initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterBtns.length === 0) return;
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update state
                state.currentFilter = filter;
                
                // Filter projects with animation
                filterProjects(filter, projectCards);
            });
        });
    }

    function filterProjects(filter, projectCards) {
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                // Show with staggered animation
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                }, index * 50);
            } else {
                // Hide
                card.style.display = 'none';
            }
        });
    }

    // ============================================
    // Chatbot
    // ============================================
    function initChatbot() {
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotContainer = document.getElementById('chatbot-container');
        const chatbotClose = document.getElementById('chatbot-close');
        
        if (!chatbotToggle || !chatbotContainer) return;
        
        // Toggle chatbot
        chatbotToggle.addEventListener('click', toggleChatbot);
        
        // Close button
        if (chatbotClose) {
            chatbotClose.addEventListener('click', function(e) {
                e.stopPropagation();
                if (state.chatbotOpen) {
                    toggleChatbot();
                }
            });
        }
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (state.chatbotOpen && 
                !chatbotContainer.contains(e.target) && 
                !chatbotToggle.contains(e.target)) {
                toggleChatbot();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && state.chatbotOpen) {
                toggleChatbot();
            }
        });
    }

    function toggleChatbot() {
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotContainer = document.getElementById('chatbot-container');
        
        state.chatbotOpen = !state.chatbotOpen;
        
        chatbotContainer.classList.toggle('active');
        chatbotToggle.textContent = state.chatbotOpen ? '✕' : '💬';
        
        // Add animation
        if (state.chatbotOpen) {
            chatbotContainer.style.animation = 'fadeInUp 0.3s ease';
        }
    }

    // ============================================
    // Scroll Effects
    // ============================================
    function initScrollEffects() {
        let lastScroll = 0;
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Header hide/show on scroll
            if (currentScroll <= 0) {
                header.classList.remove('scroll-up', 'scroll-down');
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll) {
                // Scrolling up
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                hero.style.transform = `translateY(${parallax}px)`;
            });
        }
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate children with stagger
                    const children = entry.target.querySelectorAll('.skill-card, .project-card, .contact-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
            
            // Set initial state for animated elements
            const animatedChildren = section.querySelectorAll('.skill-card, .project-card, .contact-item');
            animatedChildren.forEach(child => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        });
    }

    // ============================================
    // API Functions (for future use)
    // ============================================
    async function loadProjects() {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to load projects');
            
            const projects = await response.json();
            console.log('Projects loaded:', projects);
            return projects;
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    }

    async function loadProjectById(id) {
        try {
            const response = await fetch(`/api/projects/${id}`);
            if (!response.ok) throw new Error('Project not found');
            
            const project = await response.json();
            return project;
        } catch (error) {
            console.error('Error loading project:', error);
            return null;
        }
    }

    async function submitContactForm(formData) {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) throw new Error('Failed to submit form');
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error submitting form:', error);
            throw error;
        }
    }

    // ============================================
    // Utility Functions
    // ============================================
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

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // Export for potential module use
    // ============================================
    window.portfolioApp = {
        loadProjects,
        loadProjectById,
        submitContactForm,
        toggleChatbot,
        toggleMobileMenu
    };

})();