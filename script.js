const form = document.getElementById("search-form");
const input = document.getElementById("topic-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const clearButton = document.getElementById("clear-button");
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

async function search(query) {
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

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.status);
  }

  const data = await response.json();
  const items = data.query ? Object.values(data.query.pages) : [];

  render(items, query);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    return;
  }

  await search(query);
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.query;
    form.requestSubmit();
  });
});

clearButton.addEventListener("click", () => {
  results.innerHTML = "";
  resultCount.textContent = "Showing 0 results";
  emptyState.hidden = false;
});
