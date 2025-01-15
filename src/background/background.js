console.log("Service worker is running and ready to receive messages.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background script:", message);

    if (!message) {
        console.error("No message received or invalid message format.");
        return;
    }

    if (message.type === "makeZendeskCall") {
        const { subdomain, email, apiToken, phoneNumber } = message.payload;

        console.log("Processing makeZendeskCall message with payload:", {
            subdomain,
            email,
            phoneNumber,
        });

        const url = `https://${subdomain}.zendesk.com/api/v2/channels/voice/calls`;
        const headers = {
            Authorization: `Basic ${btoa(`${email}/token:${apiToken}`)}`,
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
            phone_number: phoneNumber,
            via_id: 1, // Replace with your actual Zendesk Talk via_id
            comment: { body: "Call initiated via browser extension." },
        });

        console.log("API URL:", url);
        console.log("Headers:", headers);
        console.log("Body:", body);

        fetch(url, {
            method: "POST",
            headers,
            body,
        })
            .then((response) => {
                console.log("Raw Response:", response);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("API Response Data:", data);
                sendResponse({ success: true, data });
            })
            .catch((error) => {
                console.error("Error during API request:", error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keeps the message channel open for async response
    } else {
        console.warn("Unknown message type:", message.type);
    }

    // Debug log to catch unexpected scenarios
    console.log("Message processing complete for type:", message.type);
});

console.log("Service worker is running and ready to receive messages.");
