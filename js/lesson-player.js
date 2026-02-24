// ============================================================
// LESSON PLAYER INTERACTIONS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initReadingProgress();
  initSidebar();
  initQuiz();
  initCompletionButton();
  initCodeCopyButtons();
  initBookmark();
  initKeyboardShortcuts();
  restoreLessonProgress();
});

// ------------------------------------------------------------
// THEME TOGGLE
// ------------------------------------------------------------
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  const currentTheme = localStorage.getItem('theme') || 'dark';
  html.classList.toggle('light', currentTheme === 'light');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = html.classList.toggle('light');
      const newTheme = isLight ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      
      html.style.transition = 'background-color 0.3s ease';
      setTimeout(() => html.style.transition = '', 300);
    });
  }
}

// ------------------------------------------------------------
// READING PROGRESS TRACKER
// ------------------------------------------------------------
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  const main = document.querySelector('.lesson-main');
  
  if (!progressBar || !main) return;
  
  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    
    // Save scroll position
    localStorage.setItem('lesson-scroll', scrolled);
  }
  
  window.addEventListener('scroll', updateProgress);
  updateProgress();
}

// ------------------------------------------------------------
// SIDEBAR TOGGLE
// ------------------------------------------------------------
function initSidebar() {
  const sidebar = document.getElementById('lesson-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  
  if (!sidebar || !sidebarToggle) return;
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  sidebarToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
  
  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }
  
  overlay.addEventListener('click', closeSidebar);
  
  // Close on mobile when clicking a link
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    });
  });
}

// ------------------------------------------------------------
// QUIZ INTERACTIONS
// ------------------------------------------------------------
function initQuiz() {
  const quizOptions = document.querySelectorAll('.quiz-option');
  const quizFeedback = document.getElementById('quiz-feedback');
  
  if (!quizOptions.length) return;
  
  quizOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Disable all options
      quizOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
      });
      
      const isCorrect = this.dataset.correct === 'true';
      
      // Mark selected answer
      this.classList.add('selected');
      
      // Show correct/incorrect
      setTimeout(() => {
        if (isCorrect) {
          this.classList.add('correct');
          quizFeedback.className = 'quiz-feedback correct';
          quizFeedback.textContent = '✓ Correct! 403 Forbidden is returned when a user is authenticated but doesn\'t have permission to access a resource.';
          
          // Award bonus XP (visual only for static site)
          showNotification('Quiz completed! +10 XP bonus', 'success');
        } else {
          this.classList.add('incorrect');
          
          // Show the correct answer
          quizOptions.forEach(opt => {
            if (opt.dataset.correct === 'true') {
              opt.classList.add('correct');
            }
          });
          
          quizFeedback.className = 'quiz-feedback incorrect';
          quizFeedback.textContent = '✗ Not quite. 401 is for authentication issues, while 403 is for authorization (permission) issues.';
        }
      }, 200);
    });
  });
}

// ------------------------------------------------------------
// COMPLETION BUTTON & MODAL
// ------------------------------------------------------------
function initCompletionButton() {
  const completeBtn = document.getElementById('complete-lesson-btn');
  const modal = document.getElementById('completion-modal');
  
  if (!completeBtn || !modal) return;
  
  completeBtn.addEventListener('click', () => {
    // Mark lesson as complete
    markLessonComplete();
    
    // Show completion modal with animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Trigger confetti
    triggerConfetti();
    
    // Update user's XP and progress in localStorage
    updateUserProgress();
  });
  
  // Close modal on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeCompletionModal();
    }
  });
}

function markLessonComplete() {
  const lessonId = window.location.pathname.split('/').pop().replace('.html', '');
  const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
  
  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
  }
}

function updateUserProgress() {
  const currentXP = parseInt(localStorage.getItem('userXP') || '2820');
  const newXP = currentXP + 20;
  localStorage.setItem('userXP', newXP);
}

function closeCompletionModal() {
  const modal = document.getElementById('completion-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ------------------------------------------------------------
// CODE COPY BUTTONS
// ------------------------------------------------------------
function initCodeCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const codeBlock = this.closest('.code-example').querySelector('code');
      const text = codeBlock.textContent;
      
      // Copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const originalHTML = this.innerHTML;
        this.innerHTML = '<span style="color: var(--emerald);">✓ Copied!</span>';
        
        setTimeout(() => {
          this.innerHTML = originalHTML;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    });
  });
}

// ------------------------------------------------------------
// BOOKMARK FEATURE
// ------------------------------------------------------------
function initBookmark() {
  const bookmarkBtn = document.getElementById('bookmark-btn');
  if (!bookmarkBtn) return;
  
  const lessonId = window.location.pathname.split('/').pop().replace('.html', '');
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  
  // Check if already bookmarked
  if (bookmarks.includes(lessonId)) {
    bookmarkBtn.classList.add('active');
    bookmarkBtn.querySelector('svg path').setAttribute('fill', 'currentColor');
  }
  
  bookmarkBtn.addEventListener('click', () => {
    const isBookmarked = bookmarks.includes(lessonId);
    
    if (isBookmarked) {
      // Remove bookmark
      const index = bookmarks.indexOf(lessonId);
      bookmarks.splice(index, 1);
      bookmarkBtn.classList.remove('active');
      bookmarkBtn.querySelector('svg path').setAttribute('fill', 'none');
      showNotification('Bookmark removed', 'info');
    } else {
      // Add bookmark
      bookmarks.push(lessonId);
      bookmarkBtn.classList.add('active');
      bookmarkBtn.querySelector('svg path').setAttribute('fill', 'currentColor');
      showNotification('Lesson bookmarked!', 'success');
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  });
}

// ------------------------------------------------------------
// KEYBOARD SHORTCUTS
// ------------------------------------------------------------
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in an input
    if (e.target.matches('input, textarea')) return;
    
    // N - Next lesson
    if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
      const nextBtn = document.querySelector('.lesson-nav-btn.next');
      if (nextBtn) nextBtn.click();
    }
    
    // P - Previous lesson
    if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey) {
      const prevBtn = document.querySelector('.lesson-nav-btn.prev');
      if (prevBtn) prevBtn.click();
    }
    
    // S - Toggle sidebar
    if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const sidebarToggle = document.getElementById('sidebar-toggle');
      if (sidebarToggle) sidebarToggle.click();
    }
    
    // B - Bookmark
    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey) {
      const bookmarkBtn = document.getElementById('bookmark-btn');
      if (bookmarkBtn) bookmarkBtn.click();
    }
    
    // T - Toggle theme
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) themeToggle.click();
    }
    
    // C - Complete lesson
    if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
      const completeBtn = document.getElementById('complete-lesson-btn');
      if (completeBtn) completeBtn.click();
    }
    
    // ESC - Close modal or sidebar
    if (e.key === 'Escape') {
      closeCompletionModal();
      const sidebar = document.getElementById('lesson-sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        document.getElementById('sidebar-toggle').click();
      }
    }
  });
  
  console.log('💡 Keyboard shortcuts: N (next), P (prev), S (sidebar), B (bookmark), T (theme), C (complete)');
}

// ------------------------------------------------------------
// RESTORE LESSON PROGRESS
// ------------------------------------------------------------
function restoreLessonProgress() {
  const savedScroll = localStorage.getItem('lesson-scroll');
  
  if (savedScroll) {
    // Wait a bit for page to fully load
    setTimeout(() => {
      window.scrollTo({
        top: parseInt(savedScroll),
        behavior: 'smooth'
      });
    }, 100);
  }
}

// ------------------------------------------------------------
// CONFETTI EFFECT
// ------------------------------------------------------------
function triggerConfetti() {
  const colors = ['#6366F1', '#10B981', '#06B6D4', '#F59E0B'];
  const confettiCount = 60;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        z-index: 10000;
        pointer-events: none;
        animation: confetti-fall ${Math.random() * 2 + 2}s linear;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }, i * 30);
  }
  
  // Add animation CSS if not already added
  if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-100vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ------------------------------------------------------------
// NOTIFICATION SYSTEM
// ------------------------------------------------------------
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 24px;
    padding: 16px 24px;
    background: var(--bg-surface);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    font-size: var(--text-base);
    color: var(--text-primary);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
  `;
  
  const icon = type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : '⚠️';
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span>${icon}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
  
  // Add slide animations
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
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
}

// ------------------------------------------------------------
// SMOOTH SCROLL TO ANCHORS
// ------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ------------------------------------------------------------
// READING TIME ESTIMATE (Show on scroll)
// ------------------------------------------------------------
function estimateReadingTime() {
  const content = document.querySelector('.prose');
  if (!content) return;
  
  const text = content.textContent;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average 200 words per minute
  
  console.log(`📖 Reading time: ${readingTime} minutes (${wordCount} words)`);
}

estimateReadingTime();

// Auto-save scroll position periodically
setInterval(() => {
  localStorage.setItem('lesson-scroll', window.scrollY);
}, 5000);
