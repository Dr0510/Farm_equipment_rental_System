document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("search");
    
    if (searchButton) {
        searchButton.addEventListener("click", function () {
            let query = searchInput.value.trim();
            if (query) {
                alert("Searching for: " + query);
            } else {
                alert("Please enter a search term.");
            }
        });
    }
    
    const rentButtons = document.querySelectorAll(".equipment-item button");
    
    rentButtons.forEach(button => {
        button.addEventListener("click", function () {
            let itemName = this.parentElement.querySelector("h3").textContent;
            alert("You have selected to rent: " + itemName);
        });
    });

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("Signup Successful!");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("Login Successful!");
        });
    }
});
