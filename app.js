//                    (Log In/Sign Up) 

function register(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;
    var cpassword = document.getElementById("cpassword").value;

    if (!name.trim()) {
        alert("Name is required");
        return;
    } else if (password !== cpassword) {
        alert("Passwords should be identical");
        return;
    }

    var userData = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };
    
    localStorage.setItem("userData", JSON.stringify(userData));
    
    localStorage.setItem("isLoggedIn", "true"); 

    alert(name + " Registered Successfully. Redirecting to Post App.");
    window.location.href = "dashboard.html"; 
}

function login(event) {
    event.preventDefault();

    var loginEmail = document.getElementById("loginEmail").value;
    var loginPass = document.getElementById("loginPass").value;

    var storedData = JSON.parse(localStorage.getItem("userData"));

    if (!storedData) {
        alert("No user registered. Please Sign Up first.");
        return;
    }

    if (storedData.email !== loginEmail) {
        alert("Invalid Email");
    } else if (storedData.password !== loginPass) {
        alert("Invalid Password");
    } else {
        
        localStorage.setItem("isLoggedIn", "true"); 
        
        alert("Login Successful. Redirecting to Post App.");
        window.location.href = "dashboard.html";
    }
}

function logout() {
    
    localStorage.removeItem("isLoggedIn");
    
    alert("Logged Out Successfully.");
    window.location.href = "index.html"; 
}

function renderUserData() {
    var storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
        var displayData = document.getElementById("displayData");
        if(displayData) {
             displayData.innerHTML = `
                <li class="list-group-item">Name: <strong>${storedData.name}</strong></li>
                <li class="list-group-item">Email: <strong>${storedData.email}</strong></li>
                <li class="list-group-item">Phone: <strong>${storedData.phone}</strong></li>
            `;
        }
    }
}

var cardBg = "assets/img-1.jpg";
var editMode = false;
var editPostId = null;

function selectImg(src) {
    cardBg = src;
    var bgImgs = document.getElementsByClassName("bgImg");
    for (var i = 0; i < bgImgs.length; i++) {
        bgImgs[i].classList.remove("selectedImg");
    }
    
    event.target.classList.add("selectedImg"); 
}

function savePost() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;

    if (!title.trim() || !description.trim()) {
        Swal.fire("Error", "Please enter title & description", "error");
        return;
    }

    var posts = JSON.parse(localStorage.getItem('posts')) || [];

    if (editMode) {
        var postIndex = posts.findIndex(p => p.id === editPostId);
        if (postIndex !== -1) {
            posts[postIndex].title = title;
            posts[postIndex].description = description;
            posts[postIndex].cardBg = cardBg;
        }
        Swal.fire("Updated!", "Your post has been updated.", "success");

    } else {
        var newPost = {
            id: Date.now(),
            title: title,
            description: description,
            cardBg: cardBg
        };
        posts.push(newPost);
        Swal.fire("Posted!", "Your post has been added.", "success");
    }

    localStorage.setItem('posts', JSON.stringify(posts));

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    
    editMode = false;
    editPostId = null;
    document.getElementById("postButton").innerText = "Post";

    renderPosts();

    document.getElementById("formDiv").style.display = "none";
    document.getElementById("postsSection").style.display = "block";
}

function renderPosts() {
    var postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    var posts = JSON.parse(localStorage.getItem('posts')) || [];

    posts.forEach(function (post) {
        postsContainer.innerHTML += `
            <div class="card m-2 shadow" data-post-id="${post.id}">
                <div style="background-image: url('${post.cardBg}'); background-color: rgba(0,0,0,0.5);" class="card-body p-3">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                </div>
                <div class="d-flex justify-content-end p-2">
                    <button onclick="editPost(${post.id})" class="btn btn-success btn-sm me-2">Edit</button>
                    <button onclick="deletePost(${post.id})" class="btn btn-danger btn-sm">Delete</button>
                </div>
            </div>
        `;
    });
}

function deletePost(postId) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            var posts = JSON.parse(localStorage.getItem('posts')) || [];
            var updatedPosts = posts.filter(p => p.id !== postId);
            
            localStorage.setItem('posts', JSON.stringify(updatedPosts));
            renderPosts();
            
            Swal.fire("Deleted!", "Your post has been removed.", "success");
        }
    });
}

function editPost(postId) {
    var posts = JSON.parse(localStorage.getItem('posts')) || [];
    var postToEdit = posts.find(p => p.id === postId);

    if (postToEdit) {
        document.getElementById("title").value = postToEdit.title;
        document.getElementById("description").value = postToEdit.description;
        
        cardBg = postToEdit.cardBg;
        var bgImgs = document.getElementsByClassName("bgImg");
        for (var i = 0; i < bgImgs.length; i++) {
             bgImgs[i].classList.remove("selectedImg");
             if(bgImgs[i].getAttribute('src') === cardBg) {
                 bgImgs[i].classList.add("selectedImg");
             }
        }
        
        document.getElementById("postButton").innerText = "Update Post";
        editMode = true;
        editPostId = postId; 

        showForm();
        Swal.fire("Edit Mode", "You can now edit your post.", "info");
    }
}

function showForm() {
    document.getElementById("formDiv").style.display = "block";
    var postsSection = document.getElementById("postsSection");
    if(postsSection) {
        postsSection.style.display = "none";
    }
}

function changeTheme() {
    document.body.classList.toggle("dark-theme");
}

function checkLoginAndRenderPosts() {
    var isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
        
        window.location.href = "index.html"; 
        return;
    }
    
    renderUserData(); 
    renderPosts();
}