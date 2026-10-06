const form = document.getElementById("search-form");
const input = document.getElementById("topic-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const clearButton = document.getElementById("clear-button");
const status = document.getElementById("status");
const chips = document.querySelectorAll(".chip");

function render(items, query) {
  results.innerHTML = "";
  items.forEach((item) => {
    const info = item.imageinfo && item.imageinfo[0];
    if (!info || !info.thumburl) return;
    const card = document.createElement("article");
    card.className = "card";
    const link = document.createElement("a");
    link.className = "card-link";
    link.href = info.url || info.thumburl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const img = document.createElement("img");
    img.src = info.thumburl;
    img.alt = item.title;
    const caption = document.createElement("div");
    caption.className = "card-caption";
    const title = document.createElement("p");
    title.textContent = item.title;
    const hint = document.createElement("small");
    hint.textContent = "Open full image ↗";
    caption.appendChild(title);
    caption.appendChild(hint);
    link.appendChild(img);
    link.appendChild(caption);
    card.appendChild(link);
    results.appendChild(card);
  });
  emptyState.hidden = items.length > 0;
  resultCount.textContent = `Showing ${items.length} results for "${query}"`;
}

function showLoading() {
  results.innerHTML = "";
  emptyState.hidden = true;
  resultCount.textContent = "Searching...";
  status.innerHTML = '<div class="loading"><span class="spinner"></span> Searching…</div>';
}

function showError() {
  results.innerHTML = "";
  emptyState.hidden = false;
  emptyState.innerHTML = '<p class="empty-icon">!</p><h2>Something went wrong.</h2><p>Please try again in a moment.</p>';
  resultCount.textContent = "Search failed";
  status.textContent = "";
}

function showNoResults(query) {
  results.innerHTML = "";
  emptyState.hidden = false;
  emptyState.innerHTML = `<p class="empty-icon">⌕</p><h2>No results for "${query}".</h2><p>Try another search term.</p>`;
  resultCount.textContent = "Showing 0 results";
  status.textContent = "";
}

async function search(query) {
  showLoading();
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query" +
    "&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6" +
    "&gsrlimit=12" +
    "&prop=imageinfo" +
    "&iiprop=url" +
    "&iiurlwidth=300" +
    "&format=json" +
    "&origin=*";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    const items = data.query ? Object.values(data.query.pages) : [];
    if (items.length === 0) {
      showNoResults(query);
      return;
    }
    status.textContent = "";
    render(items, query);
  } catch (error) {
    console.error(error);
    showError();
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  await search(query);
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.query;
    form.requestSubmit();
  });
});

clearButton.addEventListener("click", () => {
  input.value = "";
  results.innerHTML = "";
  resultCount.textContent = "Showing 0 results";
  status.textContent = "";
  emptyState.hidden = false;
  emptyState.innerHTML = '<p class="empty-icon">✦</p><h2>Nothing here yet.</h2><p>Type a topic above and start exploring.</p>';
  input.focus();
});
