async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) {
        console.error('News container not found');
        return;
    }

    try {
        console.log('Loading news from ./static/news.json...');
        const response = await fetch('./static/news.json');
        console.log('Response status:', response.status, response.ok);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const news = await response.json();
        console.log('News loaded:', news.length, 'items');
        container.innerHTML = news.map(item => renderNewsItem(item)).join('');
    } catch (error) {
        console.error('Error loading news:', error);
        container.innerHTML = '<p class="text-center" style="color: red; padding: 20px;">Ошибка загрузки новостей: ' + error.message + '</p>';
    }
}

function renderNewsItem(item) {
    if (item.type === 'certificates') {
        return renderCertificates(item);
    }
    return renderNewsCard(item);
}

function renderNewsCard(item) {
    let html = `
        <div class="news-card fade-in">
            <div class="news-card-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
                <h3>${item.title}</h3>
            </div>
            <div class="news-card-body">
    `;

    if (item.description) {
        html += `<p>${item.description}</p>`;
    }
    
    if (item.details) {
        html += `<p class="details-text">${item.details}</p>`;
    }

    if (item.certificates && item.certificates.length > 0) {
        html += '<div class="certificates-list">';
        item.certificates.forEach(cert => {
            html += `<a href="${cert.link}" target="_blank">📜 ${cert.name}</a>`;
        });
        html += '</div>';
    }

    const allPhotos = [...(item.photos || []), ...(item.extraPhotos || [])];
    if (allPhotos.length > 0) {
        html += '<div class="news-card-photos">';
        html += allPhotos.map(photo => `
            <img src="${photo}" alt="Фото" data-bs-toggle="modal" data-bs-target="#imageModal" onclick="updateModalImage('${photo}')">
        `).join('');
        html += '</div>';
    }

    if (item.programLink) {
        const btnText = item.programText || 'Программа конференции';
        html += `
            <div class="text-center">
                <a class="btn" target="_blank" href="${item.programLink}">
                    📄 ${btnText}
                </a>
            </div>
        `;
    }

    html += '</div></div>';
    return html;
}

function renderCertificates(item) {
    let html = `
        <div class="certificates-card fade-in">
            <h4>${item.title}</h4>
    `;

    html += item.certificates.map(cert => `
        <a href="${cert.link}" target="_blank">
            📜 Сертификат участника (${cert.name})
        </a>
    `).join('');

    html += '</div>';
    return html;
}

document.addEventListener('DOMContentLoaded', loadNews);
