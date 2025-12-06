// ---------------------- SIGNUP ----------------------
function signup(event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let pass = document.getElementById("pass").value;
  let cpass = document.getElementById("cpass").value;

  if (pass !== cpass) {
    alert("Passwords do not match!");
    return;
  }

  let user = { name, email, pass };
  localStorage.setItem("user", JSON.stringify(user));

  alert("Signup successful! Now login.");
  window.location.href = "index.html#signin";
}



// ---------------------- LOGIN ----------------------
function login(event) {
  event.preventDefault();

  let email = document.getElementById("loginEmail").value;
  let pass = document.getElementById("loginPass").value;

  let data = localStorage.getItem("user");
  if (!data) return alert("No user found. Signup first.");

  let user = JSON.parse(data);

  if (email === user.email && pass === user.pass) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect email or password");
  }
}



// ---------------------- SHOW USER NAME ----------------------
if (window.location.pathname.includes("dashboard.html")) {
  let user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("welcomeUser").innerText = `Welcome, ${user.name}!`;

  showPosts();
}



// ---------------------- POST APP ----------------------
let selectedImage = "assets/img-1.jpg";

function selectImg(img) {
  selectedImage = img;

  document.querySelectorAll(".bgImg").forEach(e => e.classList.remove("selectedImg"));
  event.target.classList.add("selectedImg");
}

function post() {
  let title = document.getElementById("title").value;
  let desc = document.getElementById("description").value;

  if (!title || !desc) {
    alert("Please fill all fields");
    return;
  }

  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  posts.push({
    title,
    desc,
    img: selectedImage
  });

  localStorage.setItem("posts", JSON.stringify(posts));

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";

  showPosts();
}

function showPosts() {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let div = document.getElementById("posts");
  div.innerHTML = "";

  posts.forEach((p, index) => {
    div.innerHTML += `
      <div class="card mb-3">
        <div class="card-body" style="background-image:url('${p.img}')">
          <h5>${p.title}</h5>
          <p>${p.desc}</p>
        </div>
      </div>
    `;
  });
}



// ---------------------- THEME CHANGE ----------------------
function changeTheme() {
  document.body.classList.toggle("dark-theme");
}
