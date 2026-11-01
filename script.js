async function getPosts() {
  const container = document.getElementById("blogg");

  try {
    const res = await fetch("https://dummyjson.com/posts?limit=10");

    if (!res.ok) {
      throw new Error("Kunde inte hämta blogginläggen");
    }

    const data = await res.json();

    displayPosts(data.posts);  //array med mina 10 blogginlägg
  } catch (error) {
    container.textContent = error.message;
  }
}

getPosts();

function createCard(post) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <p>👍🏼 ${post.reactions.likes} likes</p>
    <p>👎🏼${post.reactions.dislikes} dislikes</p>
    <p>Antal som läst inlägget : ${post.views} st</p>
    <button>Läs mer</button>
  `;

  const button = card.querySelector("button");

  button.addEventListener("click", () => {
    //sida två html
    window.location.href = `posts.html?id=${post.id}`;
  });

  return card;
}

function displayPosts(list) {
  const container = document.getElementById("blogg");

  container.innerHTML = ""; //töm kortet

  list.forEach((post) => {
    const card = createCard(post);

    container.append(card);
  });
}
const mobileMenu = document.querySelector(".mobil-menu"); //mobil menu hämta från html
const nav = document.querySelector(".nav"); //nav meny hämta från html
mobileMenu.addEventListener("click", () => {
  nav.classList.toggle("open"); //hoppa mellan ovan
});
