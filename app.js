
let currentPage = 'home';
let filteredEpisodes = [...portfolioData.episodes];
let filteredPublications = [...portfolioData.publications];
let filteredAwards = [...portfolioData.awards];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initNetworkBackground();
    navigateTo('home');
    setupEventListeners();
});

// ===== ANIMATED NETWORK BACKGROUND =====
function initNetworkBackground() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 60;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 1 + 0.4;
            this.opacity = Math.random() * 0.2 + 0.1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = `rgba(150, 150, 150, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 300) {
                    ctx.strokeStyle = `rgba(150, 150, 150, ${0.05 * (1 - distance / 250)})`;
                    ctx.lineWidth = 0.1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== NAVIGATION =====
function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const pageEl = document.getElementById(page + 'Page');
    if (pageEl) pageEl.style.display = 'block';
    
    // Update active nav
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    const activeLink = Array.from(document.querySelectorAll('nav a')).find(a => 
        a.getAttribute('onclick') && a.getAttribute('onclick').includes(`'${page}'`)
    );
    if (activeLink) activeLink.classList.add('active');
    
    // Render page content
    if (page === 'publications') renderPublications();
    if (page === 'episodes') renderEpisodes();
    if (page === 'awards') renderAwards();
    if (page === 'testimonials') renderTestimonials();
    if (page === 'bio') renderBio();
    if (page === 'creative') renderCreativePursuits();
    if (page === 'tools') renderToolsProjects();
    
    window.scrollTo(0, 0);
}

// ===== PUBLICATIONS PAGE =====
function renderPublications() {
    const container = document.getElementById('publicationsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    filteredPublications.forEach((pub, idx) => {
        const card = document.createElement('div');
        card.className = 'publication-card';
        card.innerHTML = `
            <h3>${pub.title}</h3>
            <p class="authors">${pub.authors}</p>
            <p class="journal"><strong>${pub.journal}</strong> (${pub.year})</p>
            <button class="btn btn-sm btn-primary" onclick="showPublicationModal(${idx})">View Details</button>
        `;
        container.appendChild(card);
    });
}

function showPublicationModal(idx) {
    const pub = filteredPublications[idx];
    
    let tagsHtml = '';
    if (pub.keywords && pub.keywords.length > 0) {
        tagsHtml += `<div class="tags-section">
            <h5>Keywords</h5>
            <div class="tags">${pub.keywords.map(k => `<span class="tag">${k}</span>`).join('')}</div>
        </div>`;
    }
    
    if (pub.bodysite) {
        tagsHtml += `<p><strong>Body Site:</strong> ${pub.bodysite}</p>`;
    }
    
    if (pub.technologies && pub.technologies.length > 0) {
        tagsHtml += `<p><strong>Technologies:</strong> ${pub.technologies.join(', ')}</p>`;
    }
    
    if (pub.diseasearea) {
        tagsHtml += `<p><strong>Disease Area:</strong> ${pub.diseasearea}</p>`;
    }
    
    if (pub.theme) {
        tagsHtml += `<p><strong>Theme:</strong> ${pub.theme}</p>`;
    }
    
    const htmlContent = `
        <div class="modal-content-enhanced">
            <h2>${pub.title}</h2>
            <p class="authors"><strong>Authors:</strong> ${pub.authors}</p>
            <p><strong>Journal:</strong> ${pub.journal} (${pub.year})</p>
            <p><strong>DOI:</strong> <a href="${pub.doi}" target="_blank">${pub.doi}</a></p>
            
            <h4>Abstract</h4>
            <p>${pub.abstract || 'Abstract not available'}</p>
            
            ${tagsHtml}
        </div>
    `;
    
    Swal.fire({
        title: 'Publication Details',
        html: htmlContent,
        width: '90%',
        maxHeight: '90vh',
        didOpen: (modal) => {
            modal.querySelector('.swal2-html-container').style.textAlign = 'left';
        }
    });
}

// ===== MICROBIOME MONDAYS PAGE =====
function renderEpisodes() {
    const container = document.getElementById('episodesContainer');
    if (!container) return;
    container.innerHTML = '';
    
    filteredEpisodes.forEach((ep, idx) => {
        const card = document.createElement('div');
        card.className = 'episode-card';
        card.innerHTML = `
            <div class="episode-number">Episode ${ep.number}</div>
            <h3>${ep.title}</h3>
            <p class="episode-theme"><strong>Theme:</strong> ${ep.theme}</p>
            <button class="btn btn-sm btn-info" onclick="showEpisodeModal(${idx})">View Description</button>
            <a href="${ep.link}" target="_blank" class="btn btn-sm btn-outline-primary">View on LinkedIn</a>
        `;
        container.appendChild(card);
    });
}

function showEpisodeModal(idx) {
    const ep = filteredEpisodes[idx];
    
    Swal.fire({
        title: `Episode ${ep.number}: ${ep.title}`,
        html: `
            <div style="text-align: left;">
                <p><strong>Theme:</strong> ${ep.theme}</p>
                <hr>
                <p>${ep.description}</p>
                <hr>
                <a href="${ep.link}" target="_blank" class="btn btn-primary">View on LinkedIn</a>
            </div>
        `,
        width: '90%',
        maxHeight: '90vh'
    });
}

function filterEpisodesByTheme(theme) {
    if (theme === 'all') {
        filteredEpisodes = [...portfolioData.episodes];
    } else {
        filteredEpisodes = portfolioData.episodes.filter(ep => ep.theme === theme);
    }
    renderEpisodes();
}

function searchEpisodes(query) {
    const searchTerm = query.toLowerCase().trim();
    if (searchTerm === '') {
        filteredEpisodes = [...portfolioData.episodes];
    } else {
        filteredEpisodes = portfolioData.episodes.filter(ep => 
            ep.title.toLowerCase().includes(searchTerm) || 
            ep.description.toLowerCase().includes(searchTerm) ||
            ep.theme.toLowerCase().includes(searchTerm)
        );
    }
    renderEpisodes();
}

// ===== AWARDS PAGE =====
function renderAwards() {
    const container = document.getElementById('awardsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    filteredAwards.forEach((award, idx) => {
        const card = document.createElement('div');
        card.className = 'award-card';
        card.innerHTML = `
            <div class="award-year">${award.year}</div>
            <h3>${award.title}</h3>
            <p class="award-org">${award.organization}</p>
            <button class="btn btn-sm btn-primary" onclick="showAwardModal(${idx})">View Details</button>
        `;
        container.appendChild(card);
    });
}

function showAwardModal(idx) {
    const award = filteredAwards[idx];
    
    Swal.fire({
        title: award.title,
        html: `
            <div style="text-align: left;">
                <p><strong>Year:</strong> ${award.year}</p>
                <p><strong>Organization:</strong> ${award.organization}</p>
                <p><strong>Category:</strong> ${award.category}</p>
                <hr>
                <p>${award.description}</p>
            </div>
        `,
        width: '90%'
    });
}

function filterAwardsByCategory(category) {
    if (category === 'all') {
        filteredAwards = [...portfolioData.awards];
    } else {
        filteredAwards = portfolioData.awards.filter(a => a.category === category);
    }
    renderAwards();
}

// ===== TESTIMONIALS PAGE =====
function renderTestimonials() {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    portfolioData.testimonials.forEach(testimonial => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <p class="testimonial-quote">"${testimonial.quote}"</p>
            <p class="testimonial-author"><strong>${testimonial.author}</strong></p>
            <p class="testimonial-role">${testimonial.role}</p>
            <p class="testimonial-affiliation">${testimonial.affiliation}</p>
        `;
        container.appendChild(card);
    });
}

// ===== BIO PAGE =====
function renderBio() {
    const container = document.getElementById('bioContainer');
    if (!container) return;
    const bio = portfolioData.bio;
    
    let html = `
        <div class="bio-section">
            <h2>Professional Summary</h2>
            <p>${bio.summary}</p>
        </div>
        
        <div class="bio-section">
            <h3>Education</h3>
    `;
    
    bio.education.forEach(edu => {
        html += `
            <div class="education-item">
                <h4>${edu.degree} in ${edu.field}</h4>
                <p><strong>${edu.institution}</strong>, ${edu.location}</p>
                <p>${edu.year} | GPA: ${edu.gpa}</p>
                ${edu.thesis ? `<p><em>Thesis: ${edu.thesis}</em></p>` : ''}
                ${edu.supervisors ? `<p><strong>Supervisors:</strong> ${edu.supervisors.join(', ')}</p>` : ''}
            </div>
        `;
    });
    
    html += `</div><div class="bio-section"><h3>Experience</h3>`;
    
    bio.experience.forEach(exp => {
        html += `
            <div class="experience-item">
                <h4>${exp.title}</h4>
                <p><strong>${exp.company}</strong>, ${exp.location}</p>
                <p>${exp.period}</p>
                ${exp.specialization ? `<p><em>${exp.specialization}</em></p>` : ''}
                <ul>
                    ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    
    html += `</div><div class="bio-section"><h3>Specializations</h3><ul>`;
    bio.specializations.forEach(spec => {
        html += `<li>${spec}</li>`;
    });
    
    html += `</ul></div><div class="bio-section"><h3>Technical Skills</h3>`;
    html += `<p><strong>AI/ML:</strong> ${bio.skills.technical[0]}</p>`;
    html += `<p><strong>Data Science:</strong> ${bio.skills.technical[1]}</p>`;
    html += `<p><strong>Computational Biology:</strong> ${bio.skills.technical[2]}</p>`;
    html += `<p><strong>Programming:</strong> ${bio.skills.technical[3]}</p>`;
    html += `<p><strong>Platforms:</strong> ${bio.skills.technical[4]}</p>`;
    html += `<p><strong>Tools:</strong> ${bio.skills.technical[5]}</p>`;
    
    html += `</div><div class="bio-section"><h3>Leadership & Creative Skills</h3>`;
    html += `<p><strong>Leadership:</strong> ${bio.skills.leadership.join(', ')}</p>`;
    html += `<p><strong>Creative:</strong> ${bio.skills.creative.join(', ')}</p>`;
    html += `</div>`;
    
    container.innerHTML = html;
}

// ===== CREATIVE PURSUITS PAGE =====
function renderCreativePursuits() {
    const container = document.getElementById('creativePursuitsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    portfolioData.creativePursuits.forEach(pursuit => {
        const card = document.createElement('div');
        card.className = 'creative-card';
        card.innerHTML = `
            <h3>${pursuit.title}</h3>
            <p class="pursuit-type"><strong>${pursuit.type}</strong> • ${pursuit.platform}</p>
            <p>${pursuit.description}</p>
            ${pursuit.stats ? `<p class="stats">${pursuit.stats}</p>` : ''}
            ${pursuit.award ? `<p class="award-badge">🏆 ${pursuit.award}</p>` : ''}
            ${pursuit.topics ? `<p><strong>Topics:</strong> ${pursuit.topics.join(', ')}</p>` : ''}
            ${pursuit.tools ? `<p><strong>Tools:</strong> ${pursuit.tools.join(', ')}</p>` : ''}
            ${pursuit.technologies ? `<p><strong>Technologies:</strong> ${pursuit.technologies.join(', ')}</p>` : ''}
            ${pursuit.link ? `<a href="${pursuit.link}" target="_blank" class="btn btn-sm btn-primary">Visit</a>` : ''}
        `;
        container.appendChild(card);
    });
}

// ===== TOOLS & PROJECTS PAGE =====
function renderToolsProjects() {
    const container = document.getElementById('toolsProjectsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    portfolioData.toolsProjects.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.innerHTML = `
            <h3>${tool.name}</h3>
            <p class="tool-type"><strong>${tool.type}</strong> • ${tool.status}</p>
            <p>${tool.description}</p>
            <p><strong>Year:</strong> ${tool.year}</p>
            ${tool.publication ? `<p><strong>Published in:</strong> ${tool.publication}</p>` : ''}
            ${tool.organization ? `<p><strong>Organization:</strong> ${tool.organization}</p>` : ''}
            <p><strong>Impact:</strong> ${tool.impact}</p>
            <p><strong>Technologies:</strong> ${tool.technologies.join(', ')}</p>
            ${tool.applications ? `<p><strong>Applications:</strong> ${tool.applications.join(', ')}</p>` : ''}
            ${tool.link ? `<a href="${tool.link}" target="_blank" class="btn btn-sm btn-primary">View Publication</a>` : ''}
        `;
        container.appendChild(card);
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Theme dropdown for episodes
    const themeSelect = document.getElementById('themeFilter');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            filterEpisodesByTheme(e.target.value);
        });
    }
    
    // Award category buttons
    const awardButtons = document.querySelectorAll('.award-filter-btn');
    awardButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            awardButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAwardsByCategory(btn.getAttribute('data-category'));
        });
    });
}

// Handle window resize for canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('networkCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
