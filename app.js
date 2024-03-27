document.addEventListener("DOMContentLoaded", async function () {
    const filtersContainer = document.getElementById("filters");
    const jobsListContainer = document.getElementById("jobs-list");
    const modal = document.getElementById("jobModal");
    const modalContent = document.querySelector(".modal-content");
    const modalJobDetails = document.getElementById("modal-job-details");

    //Json fetch
    try {
        const response = await fetch('jobs.json');
        const jobData = await response.json();

        // make the jobs
        function renderJobs(jobs) {
            jobsListContainer.innerHTML = "";
            jobs.forEach((job, index) => {
                const jobCard = document.createElement("div");
                jobCard.classList.add("job-card");
                jobCard.innerHTML = `
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                    <p>${job.location}</p>
                    <p>${job.description}</p>
                `;
                jobCard.addEventListener("click", function () {
                    openModal(job);
                });
                jobsListContainer.appendChild(jobCard);
            });
        }

        // filters here
        function renderFilters() {
            const allFilters = [...new Set(jobData.flatMap(job => job.tags))];
            filtersContainer.innerHTML = `
                <label for="filter-select">Filter by:</label>
                <select id="filter-select">
                    <option value="all">All</option>
                    ${allFilters.map(filter => `<option value="${filter}">${filter}</option>`).join("")}
                </select>
            `;
            document.getElementById("filter-select").addEventListener("change", function () {
                const selectedFilter = this.value;
                if (selectedFilter === "all") {
                    renderJobs(jobData);
                } else {
                    const filteredJobs = jobData.filter(job => job.tags.includes(selectedFilter));
                    renderJobs(filteredJobs);
                }
            });
        }

        // open modul function
        function openModal(job) {
            modalJobDetails.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.company}</p>
                <p>${job.location}</p>
                <p>${job.description}</p>
                <button>click here to apply</button>
            `;
            modal.style.display = "block";
        }

        // close modul 
        modalContent.addEventListener("click", function (event) {
            if (event.target.classList.contains("close")) {
                closeModal();
            }
        });

        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });


        function closeModal() {
            modal.style.display = "none";
        }

        //create everything
        renderJobs(jobData);
        renderFilters();
    } catch (error) {
        console.error('Error fetching job data:', error);
    }
});