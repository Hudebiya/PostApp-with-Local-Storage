             //      PostApp with Local Storage

function register(){
    event.preventDefault()
    var name = document.getElementById("name").value
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    var cpassword = document.getElementById("cpassword").value

    var data = {
        name,
        email,
        password,
        cpassword
    }
}