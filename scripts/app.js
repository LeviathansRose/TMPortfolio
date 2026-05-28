(function () {
    const filterToggle = document.querySelector(".filter-input");
    const filterMenu = document.querySelector(".filter-menu");
    const tagButtons = Array.from(document.querySelectorAll(".tag-button"));
    const clearButton = document.querySelector(".tag-button--clear");
    const grid = document.querySelector(".projects-grid");

    if (!filterToggle || !filterMenu || !grid || typeof Isotope === "undefined") {
        return;
    }

    const isotope = new Isotope(grid, {
        itemSelector: ".project-card",
        layoutMode: "vertical"
    });
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
        if (activeFilters.size === 0) {
            isotope.arrange({ filter: "*" });
            return;
        }

        isotope.arrange({
            filter: function (itemElement) {
                return Array.from(activeFilters).every(function (className) {
                    return itemElement.matches(className);
                });
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
})();
