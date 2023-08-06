document.getElementById("urlForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const url = document.getElementById("url").value;
    const interval = parseInt(document.getElementById("interval").value) * 60; // Convert minutes to seconds
    const duration = parseInt(document.getElementById("duration").value) * 86400; // Convert days to seconds

    const end_time = Date.now() + duration * 1000;
    const results = [];

    function checkUrlStatus() {
        fetch(url)
            .then(function (response) {
                // HTTP status code
                const status_code = response.status;

                // Availability status
                const availability = status_code === 200 ? "Available" : "Not Available";

                // Response time
                const end_request_time = Date.now();
                const response_time = (end_request_time - start_time) / 1000;

                results.push({
                    status_code,
                    availability,
                    response_time,
                });

                updateResults();

                if (Date.now() < end_time) {
                    setTimeout(checkUrlStatus, interval * 1000);
                } else {
                    showSuccessRate();
                }
            })
            .catch(function (error) {
                results.push({
                    status_code: null,
                    availability: "Not Available",
                    response_time: null,
                });

                updateResults();

                if (Date.now() < end_time) {
                    setTimeout(checkUrlStatus, interval * 1000);
                } else {
                    showSuccessRate();
                }
            });
    }

    function updateResults() {
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "<h2>Results:</h2><ul>";

        for (const result of results) {
            resultsDiv.innerHTML +=
                "<li><strong>HTTP Status Code:</strong> " +
                result.status_code +
                "<br>" +
                "<strong>Availability:</strong> " +
                result.availability +
                "<br>" +
                "<strong>Response Time:</strong> " +
                result.response_time +
                " seconds<br></li>";
        }

        resultsDiv.innerHTML += "</ul>";
    }

    function showSuccessRate() {
        const successCount = results.filter((result) => result.availability === "Available").length;
        const totalRuns = results.length;
        const successRate = (successCount / totalRuns) * 100;

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML += "<h2>Success Rate:</h2>";
        resultsDiv.innerHTML += `<p>The average success rate over ${totalRuns} runs is ${successRate.toFixed(2)}%</p>`;
    }

    const start_time = Date.now();
    checkUrlStatus();
});