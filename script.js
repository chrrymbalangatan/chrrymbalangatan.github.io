const PROJECTS_URL = "data/projects.json";
const GITHUB_USERNAME = "chrrymbalangatan";
const REPOS_URL = "https://api.github.com/users/" + GITHUB_USERNAME + "/repos?sort=updated&per_page=5";

function make(tag, text, className) {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
}

function makeMeta(label, value) {
    const paragraph = make("p", "", "project-meta");
    paragraph.appendChild(make("strong", label + ":"));
    paragraph.appendChild(document.createTextNode(" " + value));
    return paragraph;
}

function renderProjects(projects) {
    const container = document.getElementById("projectsContainer");
    const message = document.getElementById("projectsMessage");

    if (!Array.isArray(projects) || !projects.length) {
        message.textContent = "Projects could not be loaded right now.";
        return;
    }

    container.innerHTML = "";
    message.textContent = "";

    projects.forEach((project) => {
        const card = make("article", "", "project-card");

        if (project.image) {
            const image = document.createElement("img");
            image.src = project.image;
            image.alt = project.title;
            // Hide the image if the file does not exist yet
            image.addEventListener("error", () => image.remove());
            card.appendChild(image);
        }

        const technologies = Array.isArray(project.technologies)
            ? project.technologies.join(", ")
            : project.technologies;

        card.appendChild(make("h3", project.title));
        card.appendChild(make("p", project.description));
        card.appendChild(makeMeta("TECHNOLOGIES", technologies));
        card.appendChild(makeMeta("ROLE", project.role));

        if (project.link) {
            const link = make("a", "See Project", "text-link");
            link.href = project.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            card.appendChild(link);
        }

        container.appendChild(card);
    });
}

async function loadProjects() {
    const message = document.getElementById("projectsMessage");
    message.textContent = "Loading projects...";
    try {
        const response = await fetch(PROJECTS_URL);
        if (!response.ok) throw new Error("HTTP " + response.status);
        const data = await response.json();
        renderProjects(Array.isArray(data) ? data : data.projects);
    } catch (error) {
        console.error("Could not load projects:", error);
        message.textContent = "Projects could not be loaded right now.";
    }
}

async function loadRepos() {
    const list = document.getElementById("reposList");
    const message = document.getElementById("reposMessage");
    message.textContent = "Loading repositories...";
    try {
        const response = await fetch(REPOS_URL);
        if (!response.ok) throw new Error("HTTP " + response.status);
        const repos = await response.json();

        if (!Array.isArray(repos) || !repos.length) {
            message.textContent = "No public repositories to show yet.";
            return;
        }

        list.innerHTML = "";
        message.textContent = "";

        repos.forEach((repo) => {
            const item = make("li", "", "repo-item");

            const link = make("a", repo.name, "text-link");
            link.href = repo.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const language = make("span", repo.language || "Language not specified", "repo-language");

            item.appendChild(link);
            item.appendChild(language);
            list.appendChild(item);
        });
    } catch (error) {
        console.error("Could not load repositories:", error);
        message.textContent = "GitHub repositories are unavailable right now. Please try again later.";
    }
}

function setupContactForm() {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = form.visitorName.value.trim();
        const email = form.visitorEmail.value.trim();
        const message = form.visitorMessage.value.trim();

        if (name.length < 2 || message.length < 10 || !emailPattern.test(email)) {
            feedback.textContent = "Please fill in all fields correctly.";
            feedback.className = "error";
            return;
        }

        feedback.textContent = "Thank you, " + name + "! Sending messages is not set up yet, so please email me directly at the address above.";
        feedback.className = "success";
        form.reset();
    });
}

function setupBackToTop() {
    const button = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        button.classList.toggle("show", window.scrollY > 300);
    });

    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
    loadRepos();
    setupContactForm();
    setupBackToTop();
});