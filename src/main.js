// Equipment data
const equipmentData = [
    {
        id: 1,
        name: "Heavy Duty Tractor",
        price: "₹2000/day",
        image: "https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Powerful tractor suitable for heavy farming operations",
        specifications: ["Engine: 75 HP", "Fuel: Diesel", "Transmission: Manual"]
    },
    {
        id: 2,
        name: "Combine Harvester",
        price: "₹5000/day",
        image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Efficient harvester for wheat, rice, and other crops",
        specifications: ["Cutting Width: 4.2m", "Engine: 150 HP", "Grain Tank: 7000L"]
    },
    {
        id: 3,
        name: "Rotary Tiller",
        price: "₹800/day",
        image: "https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Perfect for soil preparation and cultivation",
        specifications: ["Working Width: 2.5m", "Depth: 15-20cm", "PTO: 540 RPM"]
    },
    {
        id: 4,
        name: "Seed Drill",
        price: "₹1200/day",
        image: "https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Precision seeding equipment for optimal crop spacing",
        specifications: ["Rows: 9", "Seed Rate: Adjustable", "Fertilizer Box: 200kg"]
    },
    {
        id: 5,
        name: "Disc Harrow",
        price: "₹1000/day",
        image: "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Heavy-duty disc harrow for field preparation",
        specifications: ["Discs: 24", "Working Width: 3m", "Weight: 800kg"]
    },
    {
        id: 6,
        name: "Sprayer",
        price: "₹600/day",
        image: "https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Efficient crop protection sprayer",
        specifications: ["Tank: 400L", "Boom Width: 12m", "Pump: Diaphragm"]
    }
];

// DOM elements
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("search");
const equipmentGrid = document.getElementById("equipmentGrid");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const modal = document.getElementById("rentalModal");
const closeModal = document.querySelector(".close");
const navLinks = document.querySelectorAll(".nav-link");

// Initialize the application
document.addEventListener("DOMContentLoaded", function() {
    renderEquipment(equipmentData);
    setupEventListeners();
    setupSmoothScrolling();
});

// Render equipment cards
function renderEquipment(equipment) {
    equipmentGrid.innerHTML = '';
    
    equipment.forEach(item => {
        const card = createEquipmentCard(item);
        equipmentGrid.appendChild(card);
    });
}

// Create equipment card element
function createEquipmentCard(item) {
    const card = document.createElement('div');
    card.className = 'equipment-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="card-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price">${item.price}</div>
            <button class="rent-btn" data-id="${item.id}">Rent Now</button>
        </div>
    `;
    
    // Add click event to rent button
    const rentBtn = card.querySelector('.rent-btn');
    rentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openRentalModal(item);
    });
    
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Form submissions
    signupForm.addEventListener("submit", handleSignup);
    loginForm.addEventListener("submit", handleLogin);
    
    // Modal close
    closeModal.addEventListener("click", closeRentalModal);
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeRentalModal();
        }
    });
}

// Handle search functionality
function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        showMessage("Please enter a search term.", "error");
        return;
    }
    
    const filteredEquipment = equipmentData.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
    );
    
    if (filteredEquipment.length === 0) {
        showMessage(`No equipment found for "${query}". Showing all equipment.`, "error");
        renderEquipment(equipmentData);
    } else {
        renderEquipment(filteredEquipment);
        showMessage(`Found ${filteredEquipment.length} equipment(s) for "${query}".`, "success");
    }
    
    // Scroll to equipment section
    document.getElementById('equipment').scrollIntoView({ behavior: 'smooth' });
}

// Handle signup form
function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Basic validation
    if (!fullName || !email || !password) {
        showMessage("Please fill in all fields.", "error");
        return;
    }
    
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters long.", "error");
        return;
    }
    
    // Simulate signup process
    showMessage("Signup successful! Welcome to Farm Equipment Rental.", "success");
    event.target.reset();
    
    // Scroll to login section
    setTimeout(() => {
        document.getElementById('login').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

// Handle login form
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (!email || !password) {
        showMessage("Please fill in all fields.", "error");
        return;
    }
    
    // Simulate login process
    showMessage("Login successful! Welcome back.", "success");
    event.target.reset();
    
    // Scroll to equipment section
    setTimeout(() => {
        document.getElementById('equipment').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

// Open rental modal
function openRentalModal(equipment) {
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="modal-equipment-info">
            <img src="${equipment.image}" alt="${equipment.name}">
            <div class="equipment-details">
                <h3>${equipment.name}</h3>
                <div class="price">${equipment.price}</div>
                <p>${equipment.description}</p>
                <ul>
                    ${equipment.specifications.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <form class="rental-form" id="rentalForm">
            <input type="text" placeholder="Your Name" required>
            <input type="email" placeholder="Your Email" required>
            <input type="tel" placeholder="Phone Number" required>
            <input type="date" placeholder="Rental Start Date" required>
            <select required>
                <option value="">Select Rental Duration</option>
                <option value="1">1 Day</option>
                <option value="3">3 Days</option>
                <option value="7">1 Week</option>
                <option value="30">1 Month</option>
            </select>
            <textarea placeholder="Additional Requirements (Optional)" rows="3"></textarea>
            <button type="submit" class="confirm-rental-btn">Confirm Rental</button>
        </form>
    `;
    
    // Add form submission handler
    const rentalForm = document.getElementById('rentalForm');
    rentalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRentalConfirmation(equipment);
    });
    
    modal.style.display = "block";
}

// Close rental modal
function closeRentalModal() {
    modal.style.display = "none";
}

// Handle rental confirmation
function handleRentalConfirmation(equipment) {
    showMessage(`Rental request for ${equipment.name} has been submitted successfully! We'll contact you soon.`, "success");
    closeRentalModal();
}

// Setup smooth scrolling for navigation
function setupSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insert message at the top of the page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add loading animation for buttons
function addLoadingState(button) {
    const originalText = button.textContent;
    button.innerHTML = '<span class="loading"></span> Processing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Initialize search on page load
window.addEventListener('load', () => {
    // Add some initial animation
    const cards = document.querySelectorAll('.equipment-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});