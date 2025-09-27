// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to corresponding nav link
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Week Selector for Küchendienst
document.querySelectorAll('.week-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.week-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show/hide corresponding week content
        const week = btn.dataset.week;
        if (week === 'current') {
            document.querySelector('.current-week').style.display = 'block';
            document.querySelector('.next-week').style.display = 'none';
        } else {
            document.querySelector('.current-week').style.display = 'none';
            document.querySelector('.next-week').style.display = 'block';
        }
    });
});

// Task Tag Selection
document.querySelectorAll('.task-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        // Remove active class from all tags
        document.querySelectorAll('.task-tag').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tag
        tag.classList.add('active');
    });
});

// Add Task Function
function addTask() {
    const who = document.getElementById('who').value;
    const what = document.querySelector('.task-tag.active').textContent;
    
    if (!who) {
        alert('Bitte wähle eine Person aus!');
        return;
    }
    
    // Create new task element
    const taskElement = document.createElement('div');
    taskElement.className = 'duty-item';
    taskElement.innerHTML = `
        <span class="duty-icon">✅</span>
        <div class="duty-content">
            <strong>${what}</strong>
            <span class="duty-people">${who}</span>
        </div>
    `;
    
    // Add to current week duties
    const dutyList = document.querySelector('.current-week .duty-list');
    dutyList.appendChild(taskElement);
    
    // Reset form
    document.getElementById('who').value = '';
    document.querySelectorAll('.task-tag').forEach(t => t.classList.remove('active'));
    document.querySelector('.task-tag').classList.add('active');
    
    // Show success message
    showNotification('Aufgabe erfolgreich hinzugefügt!', 'success');
}

// Submit Task Function
function submitTask() {
    addTask();
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Touch gestures for mobile
let startX = 0;
let startY = 0;
let currentSection = 0;
const sections = ['home', 'kuechendienst', 'aufgaben', 'einstellungen'];

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (!startX || !startY) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            // Swipe left - next section
            currentSection = Math.min(currentSection + 1, sections.length - 1);
        } else {
            // Swipe right - previous section
            currentSection = Math.max(currentSection - 1, 0);
        }
        
        showSection(sections[currentSection]);
    }
    
    startX = 0;
    startY = 0;
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        currentSection = Math.max(currentSection - 1, 0);
        showSection(sections[currentSection]);
    } else if (e.key === 'ArrowRight') {
        currentSection = Math.min(currentSection + 1, sections.length - 1);
        showSection(sections[currentSection]);
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Set initial section
    showSection('home');
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
    
    // Add touch feedback
    document.querySelectorAll('.action-btn, .task-tag, .week-btn').forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', () => {
            element.style.transform = 'scale(1)';
        });
    });
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
