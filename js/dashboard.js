// ============================================================
// DASHBOARD INTERACTIONS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAnimations();
  initProgressAnimations();
  initAchievementHovers();
  loadUserData();
});

// ------------------------------------------------------------
// THEME TOGGLE
// ------------------------------------------------------------
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Load saved theme
  const currentTheme = localStorage.getItem('theme') || 'dark';
  html.classList.toggle('light', currentTheme === 'light');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = html.classList.toggle('light');
      const newTheme = isLight ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      
      // Smooth transition
      html.style.transition = 'background-color 0.3s ease';
      setTimeout(() => {
        html.style.transition = '';
      }, 300);
    });
  }
}

// ------------------------------------------------------------
// ENTRANCE ANIMATIONS
// ------------------------------------------------------------
function initAnimations() {
  // Fade in elements on load
  const animatedElements = document.querySelectorAll('.card, .welcome-section, .streak-banner');
  
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 50);
  });
}

// ------------------------------------------------------------
// PROGRESS BAR ANIMATIONS
// ------------------------------------------------------------
function initProgressAnimations() {
  const progressBars = document.querySelectorAll('.xp-bar-fill');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.style.width;
        
        // Start from 0 and animate to target
        bar.style.width = '0%';
        bar.style.transition = 'none';
        
        setTimeout(() => {
          bar.style.transition = 'width 1s ease-out';
          bar.style.width = targetWidth;
        }, 100);
        
        observer.unobserve(bar);
      }
    });
  }, observerOptions);
  
  progressBars.forEach(bar => observer.observe(bar));
}

// ------------------------------------------------------------
// ACHIEVEMENT BADGE INTERACTIONS
// ------------------------------------------------------------
function initAchievementHovers() {
  const badges = document.querySelectorAll('.badge');
  
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      if (this.classList.contains('earned')) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-radius: inherit;
          background: rgba(16, 185, 129, 0.3);
          animation: ripple-out 0.6s ease-out;
          pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      }
    });
    
    // Show tooltip on click (could expand to show achievement details)
    badge.addEventListener('click', function(e) {
      if (this.classList.contains('earned')) {
        showAchievementTooltip(this, e);
      }
    });
  });
  
  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-out {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

function showAchievementTooltip(badge, event) {
  // Simple tooltip (could be expanded to modal)
  const title = badge.getAttribute('title');
  if (!title) return;
  
  const tooltip = document.createElement('div');
  tooltip.className = 'achievement-tooltip';
  tooltip.textContent = title;
  tooltip.style.cssText = `
    position: fixed;
    top: ${event.clientY + 10}px;
    left: ${event.clientX + 10}px;
    padding: 8px 16px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--text-primary);
    box-shadow: var(--shadow-md);
    z-index: 10000;
    pointer-events: none;
    animation: fadeIn 0.2s ease;
  `;
  
  document.body.appendChild(tooltip);
  
  setTimeout(() => {
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s ease';
    setTimeout(() => tooltip.remove(), 200);
  }, 2000);
}

// ------------------------------------------------------------
// CONFETTI EFFECT (Achievement Unlock)
// ------------------------------------------------------------
function triggerConfetti() {
  const colors = ['#6366F1', '#10B981', '#06B6D4', '#F59E0B'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }, i * 30);
  }
}

// Example: Trigger confetti when achievements are earned
// (In a real app, this would be triggered by actual achievement unlock events)
window.celebrateAchievement = triggerConfetti;

// ------------------------------------------------------------
// LOAD USER DATA (Mock - would be from API)
// ------------------------------------------------------------
function loadUserData() {
  // In a real app, this would fetch from an API
  // For now, we're using static HTML data
  
  // Simulate checking for new achievements
  setTimeout(() => {
    // Example: Show a notification if user earned something
    // showNotification('New achievement unlocked: Network Ninja 🥷');
  }, 1000);
}

// ------------------------------------------------------------
// NOTIFICATION SYSTEM
// ------------------------------------------------------------
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: calc(var(--topbar-height) + 16px);
    right: 24px;
    padding: 16px 24px;
    background: var(--bg-surface);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    font-size: var(--text-base);
    color: var(--text-primary);
    max-width: 400px;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Add icon based on type
  const icon = type === 'success' ? '✅' : type === 'achievement' ? '🏆' : 'ℹ️';
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 24px;">${icon}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto dismiss after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
  
  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ------------------------------------------------------------
// DAILY CHALLENGE TIMER (Real-time countdown)
// ------------------------------------------------------------
function initChallengeTimer() {
  const timerElements = document.querySelectorAll('.challenge-timer span');
  
  timerElements.forEach(timerEl => {
    if (!timerEl.textContent.includes('left')) return;
    
    // Parse the initial time (e.g., "18h 42m left")
    const text = timerEl.textContent;
    const hoursMatch = text.match(/(\d+)h/);
    const minutesMatch = text.match(/(\d+)m/);
    
    if (hoursMatch || minutesMatch) {
      let hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      let minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
      let totalMinutes = hours * 60 + minutes;
      
      // Update every minute
      setInterval(() => {
        totalMinutes--;
        
        if (totalMinutes <= 0) {
          timerEl.textContent = 'Expired';
          return;
        }
        
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        timerEl.textContent = `${h}h ${m}m left`;
      }, 60000);
    }
  });
}

initChallengeTimer();

// ------------------------------------------------------------
// SMOOTH SCROLLING
// ------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#!') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ------------------------------------------------------------
// PROFILE DROPDOWN (Simple toggle)
// ------------------------------------------------------------
const profileButton = document.querySelector('.profile-button');
if (profileButton) {
  profileButton.addEventListener('click', function(e) {
    e.stopPropagation();
    // In a real app, this would show a dropdown menu
    // For now, just a placeholder
    console.log('Profile dropdown clicked');
  });
}

// ------------------------------------------------------------
// XP COUNTER ANIMATION
// ------------------------------------------------------------
function animateCounter(element, target, duration = 2000) {
  const start = parseInt(element.textContent) || 0;
  const increment = (target - start) / (duration / 16);
  let current = start;
  
  const updateCounter = () => {
    current += increment;
    if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
      element.textContent = Math.round(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  };
  
  updateCounter();
}

// Observe stat values and animate when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValue = entry.target;
      const text = statValue.textContent;
      const number = parseInt(text.replace(/[^0-9]/g, ''));
      
      if (number && !isNaN(number) && !statValue.dataset.animated) {
        statValue.dataset.animated = 'true';
        animateCounter(statValue, number, 1500);
      }
      
      statsObserver.unobserve(statValue);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value-large').forEach(stat => {
  statsObserver.observe(stat);
});

// ------------------------------------------------------------
// KEYBOARD SHORTCUTS
// ------------------------------------------------------------
document.addEventListener('keydown', (e) => {
  // Press 'C' to continue learning
  if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const continueButton = document.querySelector('.continue-card .btn-primary');
    if (continueButton && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      continueButton.click();
    }
  }
  
  // Press 'T' to toggle theme
  if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      themeToggle.click();
    }
  }
});

console.log('💡 Keyboard shortcuts: Press "C" to continue learning, "T" to toggle theme');
