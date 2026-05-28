(function () {
    const dataUrl = "data/projects.json";
    let projectDataPromise;

    window.loadPortfolioProjects = function () {
        if (!projectDataPromise) {
            projectDataPromise = fetch(dataUrl).then(function (response) {
                if (!response.ok) {
                    throw new Error("Could not load project data.");
                }

                return response.json();
            });
        }

        return projectDataPromise;
    };
})();
