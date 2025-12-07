// ---------------------- SIGNUP & LOGIN LOGIC ----------------------
function signup(event) {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;
    let cpass = document.getElementById("cpass").value;

    if (pass !== cpass) { alert("Passwords do not match!"); return; }

    let users = JSON.parse(localStorage.getItem("users")) || []; 
    if (users.find(u => u.email === email)) {
        alert("This email is already registered. Please login."); return;
    }

    let newUser = { id: Date.now(), name, email, pass };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Now login.");
    // Signup ke baad, default hash (#) par bhejte hain jo login form dikhayega
    window.location.href = "index.html#"; 
}

function login(event) {
    event.preventDefault();
    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPass").value;

    let users = JSON.parse(localStorage.getItem("users")) || []; 
    const foundUser = users.find(u => u.email === email && u.pass === pass);

    if (foundUser) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(foundUser)); 
        alert("Login Successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Incorrect email or password");
    }
}

// ---------------------- DASHBOARD SECURITY AND INIT ----------------------
// Ensure this code only runs on the dashboard page
if (window.location.pathname.includes("dashboard.html")) {
    
    // Security Check: Agar login nahi hai, toh index.html par bhej do
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "index.html"; 
    } else {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            document.getElementById("welcomeUser").innerText = `Welcome, ${currentUser.name}!`;
        }
        showPosts(); // Posts ko load karna
    }
    
    document.getElementById("logoutBtn").onclick = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser"); 
        window.location.href = "index.html";
    };
}


// ---------------------- POST APP LOGIC (WITH LOCAL STORAGE) ----------------------
let selectedImage = "assets/img-1.jpg";
let editMode = false;
let editingPostId = null;

// Image selection logic
function selectImg(img, element) {
    selectedImage = img;
    document.querySelectorAll(".bgImg").forEach((item) =>
        item.classList.remove("selectedImg")
    );
    element.classList.add("selectedImg"); 
}

// Post Creation and Update logic
function post() {
    let title = document.getElementById("title").value;
    let desc = document.getElementById("description").value;

    if (!title || !desc) {
        alert("Please fill all fields");
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    if (editMode) {
        // --- EDIT LOGIC ---
        const postIndex = posts.findIndex(p => p.id === editingPostId);
        if (postIndex !== -1) {
            posts[postIndex].title = title;
            posts[postIndex].desc = desc;
            posts[postIndex].img = selectedImage;
        }
        document.getElementById("postBtn").classList.remove('d-none');
        document.getElementById("updateBtn").classList.add('d-none');
        document.getElementById("cancelEditBtn").classList.add('d-none');
        editMode = false;
        editingPostId = null;
        alert("Post Updated!");
        
    } else {
        // --- NEW POST LOGIC ---
        posts.push({
            id: Date.now(),
            userId: currentUser.id,
            title,
            desc,
            img: selectedImage
        });
        alert("Post Added!");
    }

    // Local Storage ko update karo
    localStorage.setItem("posts", JSON.stringify(posts));

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    showPosts(); // Updated posts ko display karo
}

// Update button ka handler
function updatePost() {
    post(); 
}

// Post display logic
function showPosts() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    let allPosts = JSON.parse(localStorage.getItem("posts")) || [];
    let div = document.getElementById("posts");

    // Current user ki posts filter karo
    const userPosts = allPosts.filter(p => p.userId === currentUser.id);

    div.innerHTML = "";

    if (userPosts.length === 0) {
        div.innerHTML = '<p class="text-center text-muted">Aapne abhi tak koi post nahi kiya hai.</p>';
        return;
    }

    userPosts.forEach((p) => {
        div.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4" data-post-id="${p.id}">
                <div class="card shadow">
                    <div class="card-body" style="background-image:url('${p.img}'); background-size: cover; background-position:center;">
                        <div class="post-card-overlay">
                            <h5 class="text-white">${p.title}</h5>
                            <p class="text-white">${p.desc}</p>
                            <div class="post-card-actions">
                                <button onclick="editPost(${p.id})" class="btn btn-success btn-sm">Edit</button>
                                <button onclick="deletePost(${p.id})" class="btn btn-danger btn-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Post deletion logic
function deletePost(id) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    
    // Woh post htao jiski ID match karti ho
    const updatedPosts = posts.filter(p => p.id !== id);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    alert("Post Deleted!");
    showPosts();
}

// Post edit setup logic
function editPost(id) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postToEdit = posts.find(p => p.id === id);

    if (postToEdit) {
        // Form mein data load karo
        document.getElementById("title").value = postToEdit.title;
        document.getElementById("description").value = postToEdit.desc;
        
        // Image selection ko update karo
        selectedImage = postToEdit.img;
        
        // Buttons ko update karo
        document.getElementById("postBtn").classList.add('d-none');
        document.getElementById("updateBtn").classList.remove('d-none');
        document.getElementById("cancelEditBtn").classList.remove('d-none');

        // Edit mode variables set karo
        editMode = true;
        editingPostId = id;
        
        alert("Edit Mode Active. Please use Update Post button.");
    }
}

// Cancel edit logic
function cancelEdit() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    
    document.getElementById("postBtn").classList.remove('d-none');
    document.getElementById("updateBtn").classList.add('d-none');
    document.getElementById("cancelEditBtn").classList.add('d-none');
    
    editMode = false;
    editingPostId = null;
    alert("Edit Cancelled.");
}

// Theme change logic
function changeTheme() {
    document.body.classList.toggle("dark-theme");
}