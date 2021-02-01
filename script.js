const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

function closeModal() {
  modal.classList.remove("show-modal");
}

modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) =>
  e.target === modal ? closeModal() : false
);

function validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address.");
    return false;
  }
  return true;
}

function buildBookmarks() {
  // Remove all bookmark elements
  bookmarksContainer.textContent = "";
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    // Create DOM elements
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times", "delete-bookmark");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Favicon/link container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

function fetchBookmarks() {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create initial bookmark array
    bookmarks["https://eviema.com/"] = {
      name: "EVM Studio",
      url: "https://eviema.com/",
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("http://", "https://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

bookmarkForm.addEventListener("submit", storeBookmark);

// On load
fetchBookmarks();
