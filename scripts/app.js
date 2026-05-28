(function () {
    let hasInitialized = false;

    window.initializeProjectFilters = function () {
        if (hasInitialized) {
            return;
        }

        const filterToggle = document.querySelector(".filter-input");
        const filterMenu = document.querySelector(".filter-menu");
        const tagButtons = Array.from(document.querySelectorAll(".tag-button"));
        const clearButton = document.querySelector(".tag-button--clear");
        const grid = document.querySelector(".projects-grid");

        if (!filterToggle || !filterMenu || !grid || !grid.querySelector(".project-card")) {
            return;
        }

        hasInitialized = true;

        const activeFilters = new Set();

        function setOpenState(isOpen) {
            filterMenu.classList.toggle("is-open", isOpen);
            filterToggle.setAttribute("aria-expanded", String(isOpen));
        }

        function syncButtonStates() {
            tagButtons.forEach(function (button) {
                const isActive = !button.classList.contains("tag-button--clear") && activeFilters.has(button.getAttribute("data-filter"));
                button.classList.toggle("is-active", isActive);
                button.setAttribute("aria-pressed", String(isActive));
            });
        }

        function applyFilters() {
            const cards = Array.from(grid.querySelectorAll(".project-card"));

            cards.forEach(function (card) {
                const shouldShow = activeFilters.size === 0 || Array.from(activeFilters).every(function (className) {
                    return card.matches(className);
                });

                card.classList.toggle("is-filter-hidden", !shouldShow);
                card.setAttribute("aria-hidden", String(!shouldShow));

                if (shouldShow) {
                    card.removeAttribute("tabindex");
                } else {
                    card.setAttribute("tabindex", "-1");
                }
            });
        }

        filterToggle.addEventListener("click", function () {
            setOpenState(!filterMenu.classList.contains("is-open"));
        });

        tagButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                if (button.classList.contains("tag-button--clear")) {
                    activeFilters.clear();
                } else {
                    const filterValue = button.getAttribute("data-filter");

                    if (!filterValue) {
                        return;
                    }

                    if (activeFilters.has(filterValue)) {
                        activeFilters.delete(filterValue);
                    } else {
                        activeFilters.add(filterValue);
                    }
                }

                syncButtonStates();
                applyFilters();
            });
        });

        if (clearButton) {
            clearButton.setAttribute("aria-pressed", "false");
        }

        setOpenState(false);
        syncButtonStates();
        applyFilters();
    };

    window.initializeProjectFilters();
})();
