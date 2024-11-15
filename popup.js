document.getElementById("startScan").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            document.getElementById("ethicalScore").innerText = "No active tab found.";
            return;
        }

        chrome.tabs.sendMessage(tabs[0].id, { action: "startScan" }, (response) => {
            if (chrome.runtime.lastError) {
                document.getElementById("ethicalScore").innerText = "Error connecting to content script.";
                return;
            }

            if (!response) {
                document.getElementById("ethicalScore").innerText = "No response from content script.";
                return;
            }

            if (response.error) {
                document.getElementById("ethicalScore").innerText = response.error;
                return;
            }

            document.getElementById("productName").innerText = response.product || "Unknown Product";
            document.getElementById("ethicalScore").innerText = `Ethical Score: ${response.score || "Not Available"}`;

            const alternativesList = document.getElementById("alternatives");
            alternativesList.innerHTML = "";
            if (response.alternatives && response.alternatives.length > 0) {
                response.alternatives.forEach((alt) => {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="${alt.url}" target="_blank">${alt.name} (Score: ${alt.score})</a>`;
                    alternativesList.appendChild(li);
                });
            } else {
                alternativesList.innerHTML = "<li>No alternatives found.</li>";
            }
        });
    });
});
