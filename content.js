console.log("Content script loaded and ready.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content.js:", message);

    if (message.action === "startScan") {
        console.log("Start Scan action triggered.");

        const productTitle = document.querySelector("#productTitle")?.innerText.trim();
        if (!productTitle) {
            console.error("No product title found.");
            sendResponse({ error: "No product found on this page." });
            return true; 
        }

        console.log("Product Title Found:", productTitle);

        fetchEthicalData(productTitle).then((data) => {
            console.log("Ethical Data Fetched:", data);
            sendResponse(data);
        }).catch((error) => {
            console.error("Error fetching ethical data:", error);
            sendResponse({ error: "Unable to fetch ethical data." });
        });

        return true;
    }
});

async function fetchEthicalData(productName) {
    const API_URL = "http://localhost:3000/ethical-scores";
    try {
        const response = await fetch(`${API_URL}?product=${encodeURIComponent(productName)}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.score) {
            return {
                product: productName,
                score: "Not Available",
                alternatives: []
            };
        }

        return data;
    } catch (error) {
        console.error("Error during API fetch:", error);
        return {
            product: productName,
            score: "Error retrieving data",
            alternatives: []
        };
    }
}
