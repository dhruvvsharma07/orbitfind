# OrbitFind

OrbitFind is a visual-search app that lets users enter a topic and discover a responsive wall of images from the Wikimedia Commons API. Part 2 connects the search form to the API, fetches real image data, and renders image cards into the existing responsive grid. I kept the warm cream-and-orange editorial design from Part 1 and added working quick-pick chips so common topics can be searched in one click. Each image card also links to the full Wikimedia image in a new tab.

## Part 2 — Fetch & Render

The app uses plain HTML, CSS and JavaScript with the Wikimedia Commons API. It prevents the form's default reload, ignores blank searches, safely encodes search queries, checks `response.ok`, parses JSON, clears previous results, and renders new cards dynamically.
