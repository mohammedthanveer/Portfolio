// Global variables
let configData = null;
let currentMode = 'ai';
let isDarkMode = false;

// Load configuration data
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        configData = await response.json();
        initializeWebsite();
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Initialize website with loaded data
function initializeWebsite() {
    loadPersonalInfo();
    loadSkills();
    loadExperience();
    loadProjects();
    loadContactInfo();
    setupEventListeners();
    setupScrollAnimations();
}

// Load personal information based on current mode
function loadPersonalInfo() {
    const personal = configData.personal;

    document.getElementById('headerName').textContent = personal.name;
    document.getElementById('heroTitle').textContent = personal.title[currentMode];
    document.getElementById('heroTagline').textContent = personal.tagline[currentMode];
    document.getElementById('aboutDescription').textContent = personal.description[currentMode];
    document.getElementById('resumeBtn').textContent = `Download ${currentMode === 'ai' ? 'AI' : 'Data'} Resume`;
}

// Create skill card with progress visualization
function createSkillCard(skill) {
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-card';
    skillCard.innerHTML = `
        <div class="skill-header">
            <div class="skill-icon">${skill.icon}</div>
            <div class="skill-info">
                <h3>${skill.name}</h3>
                <div class="proficiency">
                    <span class="percentage">${skill.proficiency}%</span>
                </div>
            </div>
        </div>
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="circular-progress">
                <svg class="progress-ring" width="80" height="80">
                    <circle class="progress-ring-circle-bg" cx="40" cy="40" r="35"></circle>
                    <circle class="progress-ring-circle" cx="40" cy="40" r="35"
                            style="stroke-dasharray: ${2 * Math.PI * 35}; stroke-dashoffset: ${2 * Math.PI * 35}"></circle>
                </svg>
                <div class="circular-text">${skill.proficiency}%</div>
            </div>
        </div>
        <div class="skill-details">
            <p class="skill-description">${skill.description}</p>
            <p class="skill-experience"><strong>Experience:</strong> ${skill.experience}</p>
        </div>
    `;

    // Animate progress bars on hover
    skillCard.addEventListener('mouseenter', () => {
        animateProgress(skillCard, skill.proficiency);
    });

    return skillCard;
}

// Animate progress indicators
function animateProgress(card, percentage) {
    const progressFill = card.querySelector('.progress-fill');
    const progressRing = card.querySelector('.progress-ring-circle');
    const radius = 35;
    const circumference = 2 * Math.PI * radius;

    // Animate linear progress bar
    progressFill.style.width = '0%';
    setTimeout(() => {
        progressFill.style.transition = 'width 1.5s ease-in-out';
        progressFill.style.width = `${percentage}%`;
    }, 100);

    // Animate circular progress
    if (progressRing) {
        const offset = circumference - (percentage / 100) * circumference;
        progressRing.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        progressRing.style.strokeDashoffset = offset;
    }
}

// Load skills for all categories
function loadSkills() {
    const skillCategories = ['programming', 'ai', 'analytics', 'tools'];

    skillCategories.forEach(category => {
        const container = document.getElementById(`${category}Skills`);
        container.innerHTML = '';

        configData.skills[category].skills.forEach(skill => {
            const skillCard = createSkillCard(skill);
            container.appendChild(skillCard);
        });
    });
}

// Load experience timeline
function loadExperience() {
    const timeline = document.getElementById('experienceTimeline');
    timeline.innerHTML = '';

    configData.experience.forEach((exp, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h3>${exp.title}</h3>
                <p class="timeline-period">${exp.period}</p>
                <ul>
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });
}

// Load projects based on current mode
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';

    const filteredProjects = configData.projects.filter(project =>
        currentMode === 'ai' ? project.category === 'ai' : project.category === 'data' || project.category === 'ai'
    );

    filteredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p class="project-tools"><strong>Tools:</strong> ${project.tools}</p>
                <p class="project-description">${project.description}</p>
                <ul class="project-achievements">
                    ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });

    document.getElementById('projectsTitle').textContent =
        currentMode === 'ai' ? 'AI Engineering Projects' : 'Data Analytics Projects';
}

// Load contact information
function loadContactInfo() {
    const personal = configData.personal;
    document.getElementById('contactEmail').textContent = `Email: ${personal.email}`;
    document.getElementById('contactPhone').textContent = `Phone: ${personal.phone}`;
    document.getElementById('contactLinkedIn').textContent = `LinkedIn: ${personal.linkedin}`;
}

// Setup event listeners
function setupEventListeners() {
    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.currentTarget.dataset.mode;
            switchMode(mode);
        });
    });

    // Skills tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Switch between AI Engineer and Data Analyst modes
function switchMode(mode) {
    currentMode = mode;

    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Update theme colors
    document.documentElement.style.setProperty('--primary-color',
        mode === 'ai' ? '#667eea' : '#5dade2');
    document.documentElement.style.setProperty('--secondary-color',
        mode === 'ai' ? '#764ba2' : '#2c3e50');

    // Reload content
    loadPersonalInfo();
    loadProjects();
}

// Toggle between light and dark themes
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);

    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// Setup scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.animationDelay = '0.2s';
                }

                // Animate skill cards
                if (entry.target.classList.contains('skill-card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.skill-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .timeline-item, .skill-card, .project-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadConfig);