const params = new URLSearchParams(window.location.search); //nywebbsida med id alltså sida 2

const id = params.get("id"); //id behövs för att hämta rätt inlägg från dummyjason. ex id5=inlägg 5

async function getPost() {
  const container = document.getElementById("post-container");

  try {
    const res = await fetch(`https://dummyjson.com/posts/${id}`);

    if (!res.ok) {
      throw new Error("Kunde inte hämta blogginlägget");
    }

    const post = await res.json();

    displayPost(post);
  } catch (error) {
    container.textContent = error.message; //visa felmeddelande
  }
}

getPost(); //anropa

function createCard(post) {
  //skapa blogginlägg

  const card = document.createElement("div");
  card.classList.add("post-card");

  card.innerHTML = `
        <img src="images/remove.png" alt="Ta bort" class="delete-blogg">
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <p>👍🏼 ${post.reactions.likes} likes</p>
        <p>👎🏼 ${post.reactions.dislikes} dislikes</p>
        <p>Antal visningar: ${post.views} st</p>
        <button class="edit-blogg">Redigera inlägget</button>
    `;
  const editButton = card.querySelector(".edit-blogg"); //redigera knappen egen händelse
  editButton.addEventListener("click", () => {
    editPost(post, card, editButton);
  });

  const deleteButton = card.querySelector(".delete-blogg"); //tabort knapp egen händelse

  deleteButton.addEventListener("click", () => {
    deletePost(post, card);
  });

  return card;
}

function editPost(post, card, editButton) {
  //redigera inlägg

  const titleInput = document.createElement("input");
  titleInput.value = post.title;  //value ändrar innehåll

  const bodyInput = document.createElement("textarea");
  bodyInput.value = post.body;  //value ändrar innehåll

  const title = card.querySelector("h2");
  const body = card.querySelector("p");

  title.replaceWith(titleInput);  //ersätt rubrik med egen text
  body.replaceWith(bodyInput);  //ersätt innehåll med egen text

  const saveButton = document.createElement("button"); //Ny knapp tillbaka
  saveButton.textContent = "Ändra inlägg";

  saveButton.classList.add("save-post"); //knappens cssclass

  editButton.replaceWith(saveButton);  //ersätt knappen med redigera/spara

  saveButton.addEventListener("click", async () => {
    const newTitle = titleInput.value;
    const newBody = bodyInput.value;

    const updatedPost = await updatePost(post, newTitle, newBody);

    post.title = updatedPost.title;
    post.body = updatedPost.body;

    title.textContent = post.title;
    body.textContent = post.body;

    titleInput.replaceWith(title);
    bodyInput.replaceWith(body);

    saveButton.replaceWith(editButton);
  });
}
//uppdatera kort
async function updatePost(post, newTitle, newBody) {
  try {
    const res = await fetch(`https://dummyjson.com/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        body: newBody,
      }),
    });

    if (!res.ok) {
      throw new Error("Kunde inte uppdatera blogginlägget");
    }

    const updatedPost = await res.json();

    return updatedPost;
  } catch (error) {
    alert(error.message);
    return null;
  }
}

async function deletePost(post, card) {
  //ta bort inlägget

  try {
    const res = await fetch(`https://dummyjson.com/posts/${post.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Kunde inte ta bort inlägget");
    }

    card.remove();
  } catch (error) {
    alert(error.message);
  }
}

function displayPost(post) {
  //skapa kortet

  const container = document.getElementById("post-container");

  container.innerHTML = "";

  const card = createCard(post);

  container.append(card);
}

const mobileMenu = document.querySelector(".mobil-menu"); //mobil menu hämta från html
const nav = document.querySelector(".nav"); //nav meny hämta från html
mobileMenu.addEventListener("click", () => {
  nav.classList.toggle("open"); //hoppa mellan ovan
});

async function getComments() {
  //hämta kommentarer som ovan med inlägg

  const container = document.getElementById("comments-container");
  container.textContent = "Laddar kommentarer...";

  try {
    const res = await fetch(`https://dummyjson.com/posts/${id}/comments`);

    if (!res.ok) {
      throw new Error("Kunde inte hämta kommentarerna");
    }

    const data = await res.json();

    displayComments(data.comments);
  } catch (error) {
    container.textContent = error.message;
  }
}

getComments();

function createComments(comment) {
  const card = document.createElement("div");
  card.classList.add("comment-card");

  card.innerHTML = `
    <h3>${comment.user.fullName}</h3>
    <p>${comment.body}</p>
    <p>Likes: ${comment.likes} 👍🏼</p>
    `;

  return card;
}

function displayComments(comments) {
  const container = document.getElementById("comments-container");

  container.innerHTML = "";

  comments.forEach((comment) => {  //kör koden så många gånger det finns kommentar att hämta.loop
    const card = createComments(comment);
    container.append(card);
  });
}

const newComment = document.querySelector("#newComment");
const addComment = document.querySelector("#addComment");
const comments = document.querySelector("#comments-container");

addComment.addEventListener("click", async () => {
  const text = newComment.value; //value-hämta värdet som man skriver

  if (text.trim() === "") {
    //inga tomma kommentarer
    return;
  }
  try {
    const res = await fetch("https://dummyjson.com/comments/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: text,
        postId: Number(id),
        userId: 1,
      }),
    });

    if (!res.ok) {
      throw new Error("Kunde inte skicka kommentaren");
    }
    const data = await res.json(); //skapa ny användare
    const savedComment = {
      ...data,
      user: {
        fullName: "Ny medlem",
      },
      likes: 0,
    };
    const comment = createComments(savedComment);
    comments.append(comment); //lägg ut på sidan

    newComment.value = "";  //töm kommentarsfältet efter skickat inlägg
  } catch (error) {
    alert(error.message);
  }
});
