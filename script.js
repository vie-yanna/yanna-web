const themeToggle = document.getElementById("themeToggle");
const platformTitle = document.getElementById("platformTitle");
const platformDescription = document.getElementById("platformDescription");
const platformButtons = document.getElementById("platformButtons");
const postsContainer = document.getElementById("postsContainer");
const hobbyCardsSection = document.getElementById("hobbyCards");
const platformPanel = document.querySelector(".platform-panel");
const postsSection = document.querySelector(".posts-section");
const backButton = document.getElementById("backButton");
const ownerButton = document.getElementById("ownerButton");
const viewerButton = document.getElementById("viewerButton");
const newPostForm = document.getElementById("newPostForm");
const newPostPlatformInput = document.getElementById("newPostPlatform");
const newPostTitleInput = document.getElementById("newPostTitle");
const newPostMediaTypeInput = document.getElementById("newPostMediaType");
const newPostMediaInput = document.getElementById("newPostMedia");
const newPostTextInput = document.getElementById("newPostText");
const hobbyCards = document.querySelectorAll("#hobbyCards .card");

let selectedPlatform = "All";
let platformViewActive = false;
let currentRole = "Viewer";
const posts = [
  {
    id: "post-sew-1",
    platform: "Sewing",
    title: "Patchwork in progress",
    body: "I started a new mix-and-match patchwork skirt with warm pastels and soft lace edging.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    reactions: { like: 12, heart: 8, clap: 5 },
    comments: [
      { name: "Ari", text: "That skirt looks so dreamy!" },
      { name: "Sam", text: "I love the color palette." }
    ]
  },
  {
    id: "post-cosplay-1",
    platform: "Cosplaying",
    title: "New wig styling",
    body: "Just finished styling a wig for my next cosplay. The curls held perfectly after adding the pink highlights.",
    image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=1200&q=80",
    reactions: { like: 20, heart: 11, clap: 7 },
    comments: [
      { name: "Mia", text: "The highlights are gorgeous!" }
    ]
  },
  {
    id: "post-journal-1",
    platform: "Journaling",
    title: "Morning pages",
    body: "Today I wrote about sunlight through curtains, quiet routines, and the small joys that make the day feel gentle.",
    image: "",
    reactions: { like: 9, heart: 6, clap: 3 },
    comments: [
      { name: "Lia", text: "Love this reflective mood." }
    ]
  },
  {
    id: "post-writing-1",
    platform: "Writing",
    title: "New short story idea",
    body: "I'm drafting a cozy fantasy scene where a handmade costume becomes part of a character's adventure.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
    reactions: { like: 15, heart: 10, clap: 4 },
    comments: [
      { name: "Noah", text: "That's such a cute concept!" }
    ]
  },
  {
    id: "post-vlog-1",
    platform: "Vlogging",
    title: "Behind the scenes vlog",
    body: "Filmed my latest process video while sewing a costume. I shared the soundtrack and my favorite color combo.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    reactions: { like: 13, heart: 7, clap: 6 },
    comments: [
      { name: "June", text: "I can't wait to watch it!" }
    ]
  },
  {
    id: "post-crochet-1",
    platform: "Crochet",
    title: "Soft amigurumi practice",
    body: "Working on a little pastel amigurumi friend with embroidered details and chunky yarn.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    reactions: { like: 11, heart: 5, clap: 4 },
    comments: [
      { name: "Tess", text: "That sounds so cozy!" }
    ]
  }
];

function updatePlatformDescription() {
  platformTitle.textContent = selectedPlatform === "All" ? "Latest updates" : `${selectedPlatform} updates`;
  const baseDescription = selectedPlatform === "All"
    ? "Browse all posts, comment on updates, and react to your favorite hobby moments."
    : `Showing the latest ${selectedPlatform.toLowerCase()} updates — tap to react or leave a comment.`;
  platformDescription.textContent = currentRole === "Owner"
    ? baseDescription.replace("comment", "reply") + " Owner mode is active."
    : baseDescription;
}

function updateCommentPlaceholders() {
  postsContainer.querySelectorAll(".comment-form input[name='comment']").forEach(input => {
    input.placeholder = currentRole === "Owner" ? "Reply as owner..." : "Add a comment...";
  });
}

function updateRoleUI() {
  const isOwner = currentRole === "Owner";
  ownerButton.classList.toggle("active", isOwner);
  viewerButton.classList.toggle("active", !isOwner);
  document.querySelector(".new-post-card").classList.toggle("hidden", !isOwner);
}

function getVisiblePosts() {
  return selectedPlatform === "All"
    ? posts
    : posts.filter(post => post.platform === selectedPlatform);
}

function formatComments(comments) {
  if (!comments.length) {
    return `<p class="empty-comments">No comments yet. Be the first to share your thoughts!</p>`;
  }
  return comments.map(comment => `<div class="comment-item"><span>${comment.name}:</span> ${comment.text}</div>`).join("");
}

function renderMedia(post) {
  const media = post.media || (post.image ? { type: "image", url: post.image } : null);
  if (!media || !media.url) return "";
  if (media.type === "video") {
    if (/youtu(be\.com|\.be)/i.test(media.url)) {
      const youtubeId = media.url.match(/(?:v=|\/)([\w-]{11})/i);
      return youtubeId
        ? `<div class="post-video"><iframe src="https://www.youtube.com/embed/${youtubeId[1]}" title="${post.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
        : `<p><a href="${media.url}" target="_blank" rel="noreferrer">Watch video</a></p>`;
    }
    return `<div class="post-video"><video controls src="${media.url}"></video></div>`;
  }
  return `<img class="post-image" src="${media.url}" alt="${post.title}" />`;
}

function renderPosts() {
  updatePlatformDescription();
  const visible = getVisiblePosts();
  if (!visible.length) {
    postsContainer.innerHTML = `
      <div class="post-card empty-card">
        <h3>No updates yet</h3>
        <p>Share the first post for ${selectedPlatform.toLowerCase()} and invite readers to comment.</p>
      </div>
    `;
    return;
  }

  postsContainer.innerHTML = visible
    .map(post => `
      <article class="post-card">
        ${renderMedia(post)}
        <div class="post-card-header">
          <div>
            <span class="platform-badge">${post.platform}</span>
            <h3>${post.title}</h3>
          </div>
        </div>
        <p class="post-body">${post.body}</p>
        <div class="reaction-bar">
          <button class="reaction-button" data-action="like" data-id="${post.id}">❤️ ${post.reactions.like}</button>
          <button class="reaction-button" data-action="heart" data-id="${post.id}">💗 ${post.reactions.heart}</button>
          <button class="reaction-button" data-action="clap" data-id="${post.id}">👏 ${post.reactions.clap}</button>
        </div>
        <div class="comment-list">
          ${formatComments(post.comments)}
        </div>
        <form class="comment-form" data-post-id="${post.id}">
          <input type="text" name="comment" placeholder="${currentRole === "Owner" ? "Reply as owner..." : "Add a comment..."}" required />
          <button type="submit">Comment</button>
        </form>
      </article>
    `)
    .join("");
}

function setActivePlatformButton() {
  platformButtons.querySelectorAll(".platform-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.platform === selectedPlatform);
  });
}

function setPlatform(platform) {
  selectedPlatform = platform;
  newPostPlatformInput.value = platform === "All" ? "Sewing" : platform;
  setActivePlatformButton();
  renderPosts();
}

function showPlatformView(platform = "All") {
  platformViewActive = true;
  hobbyCardsSection.classList.add("hidden");
  platformPanel.classList.remove("hidden");
  postsSection.classList.remove("hidden");
  backButton.classList.remove("hidden");
  setPlatform(platform);
}

function showPlatformSelection() {
  platformViewActive = false;
  hobbyCardsSection.classList.remove("hidden");
  platformPanel.classList.add("hidden");
  postsSection.classList.add("hidden");
  backButton.classList.add("hidden");
  selectedPlatform = "All";
  setActivePlatformButton();
  updatePlatformDescription();
  postsContainer.innerHTML = "";
}

platformButtons.addEventListener("click", event => {
  const button = event.target.closest(".platform-btn");
  if (!button) return;
  const platform = button.dataset.platform;
  if (!platformViewActive) {
    showPlatformView(platform);
    return;
  }
  setPlatform(platform);
});

hobbyCards.forEach(card => {
  card.addEventListener("click", () => {
    showPlatformView(card.dataset.platform);
  });
});

ownerButton.addEventListener("click", () => setRole("Owner"));
viewerButton.addEventListener("click", () => setRole("Viewer"));

function setRole(role) {
  currentRole = role;
  updateRoleUI();
  renderPosts();
}

backButton.addEventListener("click", showPlatformSelection);

postsContainer.addEventListener("click", event => {
  const button = event.target.closest(".reaction-button");
  if (!button) return;
  const postId = button.dataset.id;
  const action = button.dataset.action;
  const post = posts.find(item => item.id === postId);
  if (!post) return;
  post.reactions[action] += 1;
  renderPosts();
});

postsContainer.addEventListener("submit", event => {
  const form = event.target.closest(".comment-form");
  if (!form) return;
  event.preventDefault();
  const postId = form.dataset.postId;
  const commentField = form.querySelector("input[name='comment']");
  const text = commentField.value.trim();
  if (!text) return;
  const post = posts.find(item => item.id === postId);
  if (!post) return;
  post.comments.push({ name: currentRole === "Owner" ? "Owner" : "Reader", text });
  commentField.value = "";
  renderPosts();
});

newPostForm.addEventListener("submit", event => {
  if (currentRole !== "Owner") return;
  event.preventDefault();
  const platform = newPostPlatformInput.value;
  const title = newPostTitleInput.value.trim();
  const mediaType = newPostMediaTypeInput.value;
  const mediaUrl = newPostMediaInput.value.trim();
  const body = newPostTextInput.value.trim();
  if (!title || !body) return;
  const newPost = {
    id: `post-${platform.toLowerCase()}-${Date.now()}`,
    platform,
    title,
    body,
    media: { type: mediaType, url: mediaUrl },
    reactions: { like: 0, heart: 0, clap: 0 },
    comments: []
  };
  posts.unshift(newPost);
  newPostTitleInput.value = "";
  newPostMediaInput.value = "";
  newPostTextInput.value = "";
  setPlatform(platform);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("glow");
  themeToggle.textContent = document.body.classList.contains("glow") ? "Gentle mode" : "Soft glow";
});

updateRoleUI();
showPlatformSelection();
