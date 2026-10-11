// ================= MOBILE MENU =================

function toggleMenu() {

    const nav = document.querySelector("nav");

    nav.classList.toggle("active");

}


// ================= PERSONALITY CAROUSEL =================

const people = [

    {
        image: "images/vc_photo.jpg",
        name: "Meritorious Professor Dr. Yousuf Khushk",
        description:
            "Meritorious Professor Dr. Yousuf Khushk is the Vice Chancellor of Shah Abdul Latif University, Khairpur. He leads the university's academic and administrative activities and focuses on improving education, research, student facilities, and university development."
    },

    {
        image: "images/mam_samina.jpg",
        name: "Prof. Dr. Samina Rajpar",
        description:
            "Prof. Dr. Samina Rajpar is a Professor at the Institute of Computer Science, Shah Abdul Latif University. She holds a PhD and has contributed to teaching and academic activities in Computer Science. She has also served as Project Director of NAVTTC and Director of the Institute of Computer Science."
    },

    {
        image: "images/noor_ahmed_shaikh.jpg",
        name: "Prof. Dr. Noor Ahmed Shaikh",
        description:
            "Dean, Faculty of Physical Sciences,Prof. Dr. Noor Ahmed Shaikh is a Professor at Shah Abdul Latif University and currently serves as Dean of the Faculty of Physical Sciences. He has also held academic and administrative responsibilities at SALU, including leadership roles in the Institute of Computer Science."
    }

];


let currentSlide = 0;


function showSlide() {

    const image = document.getElementById("person-image");

    const name = document.getElementById("person-name");

    const description =
        document.getElementById("person-description");


    image.src = people[currentSlide].image;

    name.textContent = people[currentSlide].name;

    description.textContent =
        people[currentSlide].description;

}


function nextSlide() {
    currentSlide++;
    if (currentSlide >= people.length) {
        currentSlide = 0;
    }

    showSlide();

}


function previousSlide() {

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = people.length - 1;
    }

    showSlide();

}


// Automatically change slide every 4 seconds

setInterval(nextSlide, 4000);


// ================= AUTHENTICATION =================

const authOverlay = document.getElementById("auth-overlay");
const authModal = authOverlay ? authOverlay.querySelector(".auth-modal") : null;
const successModal = document.getElementById("success-modal");

function setAuthView(view) {
    authOverlay.classList.add("is-open");
    authOverlay.setAttribute("aria-hidden", "false");
    authModal.classList.toggle("show-register", view === "register");
    document.body.classList.add("auth-open");
}

function closeAuth() {
    authOverlay.classList.remove("is-open");
    authOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("auth-open");
}

function showSuccess(message) {
    document.getElementById("success-message").textContent = message;
    successModal.classList.add("is-open");
    successModal.setAttribute("aria-hidden", "false");
}

function closeSuccess() {
    successModal.classList.remove("is-open");
    successModal.setAttribute("aria-hidden", "true");
}

function clearFieldError(field) {
    field.classList.remove("input-error");
    field.setAttribute("aria-invalid", "false");

    const error = field.closest(".terms-field")?.nextElementSibling?.classList.contains("field-error")
        ? field.closest(".terms-field").nextElementSibling
        : field.parentElement.querySelector(`.field-error[data-for="${field.id}"]`);

    if (error) error.remove();
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add("input-error");
    field.setAttribute("aria-invalid", "true");

    const error = document.createElement("small");
    error.className = "field-error";
    error.dataset.for = field.id;
    error.textContent = message;

    if (field.type === "checkbox") {
        field.closest(".terms-field").insertAdjacentElement("afterend", error);
    } else {
        field.insertAdjacentElement("afterend", error);
    }
}

function validateForm(form) {
    let firstInvalidField = null;

    form.querySelectorAll("input, select").forEach((field) => {
        clearFieldError(field);

        let message = "";
        const value = field.type === "checkbox" ? field.checked : field.value.trim();

        if (field.required && !value) {
            message = field.type === "checkbox"
                ? "Please confirm the information is correct."
                : "This field is required.";
        } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
            message = "Enter a valid email address.";
        } else if (field.minLength > 0 && field.value.length < field.minLength) {
            message = `Use at least ${field.minLength} characters.`;
        } else if (field.pattern && !new RegExp(`^(?:${field.pattern})$`).test(field.value.trim())) {
            message = field.title || "Use the required format.";
        }

        if (message) {
            showFieldError(field, message);
            if (!firstInvalidField) firstInvalidField = field;
        }
    });

    const password = form.elements.password;
    const confirmPassword = form.elements.confirmPassword;

    if (password && confirmPassword && password.value && password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, "Passwords must match.");
        firstInvalidField = firstInvalidField || confirmPassword;
    }

    if (firstInvalidField) {
        firstInvalidField.focus();
        return false;
    }

    return true;
}

document.querySelectorAll("#login-form input, #register-form input, #register-form select").forEach((field) => {
    field.addEventListener(field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input", () => {
        clearFieldError(field);
    });
});

document.querySelectorAll("[data-auth-view]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
        event.preventDefault();
        setAuthView(trigger.dataset.authView);
    });
});

document.querySelector(".auth-close").addEventListener("click", closeAuth);
document.getElementById("success-close").addEventListener("click", closeSuccess);

authOverlay.addEventListener("click", (event) => {
    if (event.target === authOverlay) closeAuth();
});

successModal.addEventListener("click", (event) => {
    if (event.target === successModal) closeSuccess();
});

document.getElementById("register-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!validateForm(form)) {
        return;
    }

    const formData = new FormData(form);
    localStorage.setItem("saluAccount", JSON.stringify({
        name: formData.get("name"),
        fatherName: formData.get("fatherName"),
        cnic: formData.get("cnic"),
        phone: formData.get("phone"),
        dateOfBirth: formData.get("dateOfBirth"),
        gender: formData.get("gender"),
        address: formData.get("address"),
        city: formData.get("city"),
        department: formData.get("department"),
        qualification: formData.get("qualification"),
        admissionType: formData.get("admissionType"),
        session: formData.get("session"),
        email: formData.get("email").toLowerCase(),
        password: formData.get("password")
    }));

    form.reset();
    closeAuth();
    showSuccess("Your SALU account has been registered successfully.");
});

document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!validateForm(form)) {
        return;
    }

    const account = JSON.parse(localStorage.getItem("saluAccount") || "null");
    const email = form.elements.email.value.toLowerCase();
    const password = form.elements.password.value;

    if (!account || account.email !== email || account.password !== password) {
        form.elements.email.classList.add("input-error");
        form.elements.password.classList.add("input-error");
        alert("Please check your email and password, or register a new account first.");
        return;
    }

    form.reset();
    closeAuth();
    showSuccess(`Welcome back, ${account.name}. You have logged in successfully.`);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAuth();
        closeSuccess();
    }
});