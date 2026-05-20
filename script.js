// Video ID received from API or database
const rawVideoId = "lr1gApNmFog"; // Replace with any valid 11-character YouTube ID

// Validate YouTube video ID to prevent malicious input
function isValidYouTubeId(id) {
    return /^[A-Za-z0-9_-]{11}$/.test(id);
}

// Display fallback message
function showFallback(container) {
    container.innerHTML = "";

    const fallback = document.createElement("div");
    fallback.className = "fallback";
    fallback.textContent = "Trailer unavailable. Please check back later.";

    container.appendChild(fallback);
}

// Create secure iframe
function createIframe(videoId) {
    const iframe = document.createElement("iframe");

    iframe.src =
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`;

    iframe.loading = "lazy";
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.title = "Movie Trailer";

    return iframe;
}

// Render trailer thumbnail with play button
function renderTrailer(videoId) {
    const container = document.getElementById("trailer");

    if (!container) return;

    if (!isValidYouTubeId(videoId)) {
        console.warn("Invalid YouTube video ID.");
        showFallback(container);
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "trailer-wrapper";

    const thumbnail = document.createElement("img");
    thumbnail.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    thumbnail.alt = "Movie Trailer Thumbnail";
    thumbnail.className = "placeholder";
    thumbnail.loading = "lazy";

    // If thumbnail fails to load, show fallback
    thumbnail.onerror = () => showFallback(container);

    const playButton = document.createElement("div");
    playButton.className = "play-button";
    playButton.textContent = "▶";

    wrapper.appendChild(thumbnail);
    wrapper.appendChild(playButton);
    container.appendChild(wrapper);

    // Load iframe only when user clicks
    wrapper.addEventListener("click", () => {
        const iframe = createIframe(videoId);
        wrapper.replaceChildren(iframe);
    });
}

// Use IntersectionObserver to load only when trailer enters viewport
document.addEventListener("DOMContentLoaded", () => {
    const trailerElement = document.getElementById("trailer");

    if (!trailerElement) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    renderTrailer(rawVideoId);
                    obs.disconnect();
                }
            });
        },
        {
            rootMargin: "200px"
        }
    );

    observer.observe(trailerElement);
});
