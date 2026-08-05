const listElement = document.getElementById('starred-list');
const errorElement = document.getElementById('error-message');

function createRepoListItem(repo) {
  const repoName = repo.repo || 'Unknown repository';
  const repoUrl = repo.url || '#';
  const repoDescription = repo.description || 'No description available.';
  const starredAtDate = new Date(repo.starred_at);
  const starredAt = Number.isNaN(starredAtDate.getTime())
    ? 'Unknown date'
    : starredAtDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

  const listItem = document.createElement('li');
  const link = document.createElement('a');
  link.className = 'repo-name';
  link.href = repoUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = repoName;

  const description = document.createElement('p');
  description.className = 'repo-description';
  description.textContent = repoDescription;

  const meta = document.createElement('p');
  meta.className = 'repo-meta';
  meta.innerHTML = `Starred on <span class="status">${starredAt}</span>`;

  listItem.append(link, description, meta);
  return listItem;
}

function renderStarredRepositories(repos) {
  listElement.innerHTML = '';
  listElement.setAttribute('aria-busy', 'false');

  if (!Array.isArray(repos) || repos.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No starred repositories found.';
    listElement.appendChild(emptyItem);
    return;
  }

  repos.forEach((repo) => {
    listElement.appendChild(createRepoListItem(repo));
  });
}

function showError(message) {
  listElement.innerHTML = '';
  errorElement.textContent = message;
  errorElement.classList.add('visible');
}

async function loadStarredEvents() {
  listElement.setAttribute('aria-busy', 'true');
  errorElement.classList.remove('visible');
  errorElement.textContent = '';

  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Failed to load starred repositories: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    renderStarredRepositories(repos);
  } catch (error) {
    showError(error.message);
  }
}

window.addEventListener('DOMContentLoaded', loadStarredEvents);
