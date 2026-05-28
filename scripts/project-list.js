(function () {
    const grid = document.querySelector(".projects-grid");

    if (!grid || typeof window.loadPortfolioProjects !== "function") {
        return;
    }

    function escapeAttribute(value) {
        return String(value).replace(/"/g, "&quot;");
    }

    function getProjectThumbnailAlt(project) {
        return project.title + " Project Thumbnail";
    }

    function renderProjectCard(project) {
        const tagClasses = project.tags.map(function (tag) {
            return "tag-" + tag;
        }).join(" ");

        return [
            '<a class="project-card ' + tagClasses + '" href="project.html?id=' + encodeURIComponent(project.id) + '" aria-label="Open ' + escapeAttribute(project.title) + ' project page">',
            '    <img class="project-card-image" src="' + project.thumbnail + '" alt="' + escapeAttribute(getProjectThumbnailAlt(project)) + '">',
            "    <p><span>" + project.cardTitle + "</span></p>",
            "</a>"
        ].join("");
    }

    window.loadPortfolioProjects()
        .then(function (projects) {
            grid.innerHTML = projects.map(renderProjectCard).join("");

            if (typeof window.initializeProjectFilters === "function") {
                window.initializeProjectFilters();
            }
        })
        .catch(function () {
            grid.innerHTML = '<p class="project-load-error">Projects could not be loaded. Please refresh the page.</p>';
        });
})();
