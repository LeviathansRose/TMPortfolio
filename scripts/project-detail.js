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
            element.textContent = value || "";
        }
    }

    function escapeAttribute(value) {
        return String(value).replace(/"/g, "&quot;");
    }

    function isVideoPath(path) {
        return /\.(mp4|webm|ogg)$/i.test(path);
    }

    function getProjectBannerAlt(project) {
        return "Banner image for the " + project.title + " Project";
    }

    function getProjectVideoLabel(project) {
        return project.title + " project video";
    }

    function getLinkType(link) {
        const url = link.url || "";
        const icon = link.icon || "";
        const label = link.label || "";
        const linkText = (url + " " + icon + " " + label).toLowerCase();

        if (linkText.includes("github")) {
            return "GitHub repository";
        }

        if (linkText.includes("itch")) {
            return "Itch.io page";
        }

        if (label) {
            return label.toLowerCase() === "website" ? "project website" : label;
        }

        return "project link";
    }

    function getLinkAriaLabel(project, link) {
        return "Open " + project.title + " " + getLinkType(link);
    }

    function renderHero(project) {
        const hero = document.querySelector("#project-hero");

        if (!hero || !project.banner) {
            return;
        }

        hero.innerHTML = "";

        if (isVideoPath(project.banner)) {
            const video = document.createElement("video");
            video.src = project.banner;
            video.setAttribute("aria-label", getProjectVideoLabel(project));
            video.controls = true;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            hero.appendChild(video);
            return;
        }

        const image = document.createElement("img");
        image.src = project.banner;
        image.alt = getProjectBannerAlt(project);
        hero.appendChild(image);
    }

    function renderLinks(project) {
        const linkRow = document.querySelector("#project-links");
        const linksSection = document.querySelector("#project-links-section");
        const links = project.links || [];

        if (!linkRow) {
            return;
        }

        if (linksSection) {
            linksSection.hidden = links.length === 0;
        }

        linkRow.innerHTML = links.map(function (link) {
            const modifier = link.style === "itch-logo" ? "project-link--itch-logo" : "project-link--icon";
            const iconClass = link.style === "itch-logo" ? "project-link-itch-logo" : "project-link-icon";
            const label = link.label ? "<span>" + link.label + "</span>" : "";

            return [
                '<a class="project-link ' + modifier + '" href="' + link.url + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeAttribute(getLinkAriaLabel(project, link)) + '">',
                '    <img class="' + iconClass + '" src="' + link.icon + '" alt="">',
                "    " + label,
                "</a>"
            ].join("");
        }).join("");
    }

    function renderHighlights(project) {
        const highlights = document.querySelector("#project-role-highlights");
        const roleHighlights = project.roleHighlights || [];

        if (!highlights) {
            return;
        }

        highlights.innerHTML = roleHighlights.map(function (highlight) {
            return "<li>" + highlight + "</li>";
        }).join("");
    }

    function renderProject(project) {
        document.title = project.title + " | Tristan Mattole Portfolio";
        page.setAttribute("aria-label", project.title + " project page");

        renderHero(project);
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
