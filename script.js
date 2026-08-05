const listElement = document.getElementById('starred-list');
const errorElement = document.getElementById('error-message');

function renderStarredRepositories(repos) {
  if (!Array.isArray(repos) || repos.length === 0) {
    listElement.innerHTML = '<li>No starred repositories found.</li>';
    return;
  }

  listElement.innerHTML = repos
    .map((repo) => {
      const starredAt = new Date(repo.starred_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return `
        <li>
          <a class="repo-name" href="${repo.url}" target="_blank" rel="noopener noreferrer">
            ${repo.repo}
          </a>
          <p class="repo-description">${repo.description}</p>
          <p class="repo-meta">Starred on <span class="status">${starredAt}</span></p>
        </li>
      `;
    })
    .join('');
}

async function loadStarredEvents() {
  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Failed to load starred repositories: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    renderStarredRepositories(repos);
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.style.display = 'block';
  }
}

window.addEventListener('DOMContentLoaded', loadStarredEvents);
