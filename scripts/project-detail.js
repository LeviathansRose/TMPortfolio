(function () {
    const page = document.querySelector("[data-project-page]");

    if (!page || typeof window.loadPortfolioProjects !== "function") {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");

    function setText(selector, value) {
        const element = document.querySelector(selector);

        if (element) {
            element.textContent = value;
        }
    }

    function renderLinks(project) {
        const linkRow = document.querySelector("#project-links");

        if (!linkRow) {
            return;
        }

        linkRow.innerHTML = project.links.map(function (link) {
            const modifier = link.style === "itch-logo" ? "project-link--itch-logo" : "project-link--icon";
            const iconClass = link.style === "itch-logo" ? "project-link-itch-logo" : "project-link-icon";
            const label = link.label ? "<span>" + link.label + "</span>" : "";

            return [
                '<a class="project-link ' + modifier + '" href="' + link.url + '" target="_blank" rel="noopener noreferrer" aria-label="' + link.ariaLabel + '">',
                '    <img class="' + iconClass + '" src="' + link.icon + '" alt="' + link.iconAlt + '">',
                "    " + label,
                "</a>"
            ].join("");
        }).join("");
    }

    function renderHighlights(project) {
        const highlights = document.querySelector("#project-role-highlights");

        if (!highlights) {
            return;
        }

        highlights.innerHTML = project.roleHighlights.map(function (highlight) {
            return "<li>" + highlight + "</li>";
        }).join("");
    }

    function renderProject(project) {
        const banner = document.querySelector("#project-banner");

        document.title = project.title + " | Tristan Mattole Portfolio";
        page.setAttribute("aria-label", project.title + " project page");

        if (banner) {
            banner.src = project.banner;
            banner.alt = project.bannerAlt;
        }

        setText("#project-abstract", project.abstract);
        setText("#project-role", project.role + ", " + project.date);
        renderLinks(project);
        renderHighlights(project);
    }

    window.loadPortfolioProjects()
        .then(function (projects) {
            const project = projects.find(function (item) {
                return item.id === projectId;
            });

            if (!project) {
                window.location.replace("index.html");
                return;
            }

            renderProject(project);
        })
        .catch(function () {
            setText("#project-abstract", "This project could not be loaded. Please return to the homepage and try again.");
        });
})();
