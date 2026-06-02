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

    function getMediaType(path) {
        return isVideoPath(path) ? "video" : "image";
    }

    function getProjectMedia(project) {
        const media = Array.isArray(project.media) && project.media.length > 0 ? project.media : [project.banner];

        return media
            .map(function (item) {
                if (typeof item === "string") {
                    return {
                        src: item,
                        type: getMediaType(item)
                    };
                }

                return {
                    src: item.src,
                    type: item.type || getMediaType(item.src || ""),
                    alt: item.alt,
                    label: item.label
                };
            })
            .filter(function (item) {
                return item.src;
            });
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

    function createMediaElement(project, item) {
        if (item.type === "video") {
            const video = document.createElement("video");
            video.src = item.src;
            video.setAttribute("aria-label", item.label || getProjectVideoLabel(project));
            video.controls = true;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            return video;
        }

        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.alt || getProjectBannerAlt(project);
        return image;
    }

    function renderHero(project) {
        const hero = document.querySelector("#project-hero");
        const mediaItems = getProjectMedia(project);
        let activeIndex = 0;

        if (!hero || mediaItems.length === 0) {
            return;
        }

        function renderActiveMedia() {
            const mediaFrame = hero.querySelector(".project-carousel-media");
            const counter = hero.querySelector(".project-carousel-counter");
            const dots = Array.from(hero.querySelectorAll(".project-carousel-dot"));

            if (!mediaFrame) {
                return;
            }

            mediaFrame.innerHTML = "";
            mediaFrame.appendChild(createMediaElement(project, mediaItems[activeIndex]));

            if (counter) {
                counter.textContent = activeIndex + 1 + " / " + mediaItems.length;
            }

            dots.forEach(function (dot, index) {
                const isActive = index === activeIndex;
                dot.classList.toggle("is-active", isActive);
                dot.setAttribute("aria-current", String(isActive));
            });
        }

        function showMedia(index) {
            activeIndex = (index + mediaItems.length) % mediaItems.length;
            renderActiveMedia();
        }

        hero.innerHTML = "";
        hero.classList.toggle("has-carousel", mediaItems.length > 1);

        const mediaFrame = document.createElement("div");
        mediaFrame.className = "project-carousel-media";
        hero.appendChild(mediaFrame);

        if (mediaItems.length > 1) {
            const previousButton = document.createElement("button");
            previousButton.className = "project-carousel-button project-carousel-button--previous";
            previousButton.type = "button";
            previousButton.setAttribute("aria-label", "Show previous project media");
            previousButton.innerHTML = '<span class="project-carousel-icon" aria-hidden="true"></span>';
            previousButton.addEventListener("click", function () {
                showMedia(activeIndex - 1);
            });

            const nextButton = document.createElement("button");
            nextButton.className = "project-carousel-button project-carousel-button--next";
            nextButton.type = "button";
            nextButton.setAttribute("aria-label", "Show next project media");
            nextButton.innerHTML = '<span class="project-carousel-icon" aria-hidden="true"></span>';
            nextButton.addEventListener("click", function () {
                showMedia(activeIndex + 1);
            });

            const status = document.createElement("div");
            status.className = "project-carousel-status";

            const counter = document.createElement("span");
            counter.className = "project-carousel-counter";

            const dots = document.createElement("div");
            dots.className = "project-carousel-dots";
            dots.setAttribute("aria-label", "Project media slides");

            mediaItems.forEach(function (item, index) {
                const dot = document.createElement("button");
                dot.className = "project-carousel-dot";
                dot.type = "button";
                dot.setAttribute("aria-label", "Show project media " + (index + 1));
                dot.addEventListener("click", function () {
                    showMedia(index);
                });
                dots.appendChild(dot);
            });

            status.appendChild(counter);
            status.appendChild(dots);
            hero.appendChild(previousButton);
            hero.appendChild(nextButton);
            hero.appendChild(status);
        }

        renderActiveMedia();
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
