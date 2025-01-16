document.addEventListener('DOMContentLoaded', () => {
    const phoneNumberDisplay = document.getElementById('phone-number-display');
    let phoneNumber = "";

    // Handle dialpad number clicks
    document.querySelectorAll('.num-btn').forEach((button) => {
        button.addEventListener('click', () => {
            phoneNumber += button.textContent;
            phoneNumberDisplay.textContent = phoneNumber;
        });
    });

    // Handle call button
    document.getElementById('call-btn').addEventListener('click', () => {
        if (!phoneNumber) {
            alert("Please enter a phone number.");
            return;
        }

        // Retrieve the selected country code
        const countryCode = document.getElementById('country-code').value;
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        // Retrieve settings from Chrome storage
        chrome.storage.sync.get(['subdomain', 'email', 'apiToken', 'talkLineId', 'groupId'], (result) => {
            const { subdomain, email, apiToken, talkLineId, groupId } = result;

            // Validate user settings
            if (!subdomain || !email || !apiToken || !talkLineId || !groupId) {
                alert("Please configure your Zendesk settings first.");
                return;
            }

            console.log("Preparing to make API request with:", { subdomain, email, phoneNumber: fullPhoneNumber, talkLineId, groupId });

            // Prepare API request
            const url = `https://${subdomain}.zendesk.com/api/v2/channels/voice/callback_requests`;
            const headers = {
                Authorization: `Basic ${btoa(`${email}/token:${apiToken}`)}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            };
            const body = JSON.stringify({
                callback_request: {
                    phone_number_id: talkLineId,
                    requester_phone_number: fullPhoneNumber,
                    group_ids: [groupId]
                }
            });

            console.log("API Request Details:", {
                url,
                headers,
                body: JSON.parse(body) // Log body as an object for readability
            });

            // Make API request
            fetch(url, {
                method: "POST",
                headers,
                body
            })
                .then((response) => {
                    console.log("Raw Response:", response);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    // Check if the response has a body
                    const contentLength = response.headers.get("Content-Length");
                    if (contentLength && parseInt(contentLength) > 0) {
                        return response.json();
                    } else {
                        return {}; // Return an empty object if there's no response body
                    }
                })
                .then((data) => {
                    console.log("API Response Data:", data);
                    alert("Callback request initiated successfully!");
                    phoneNumberDisplay.textContent = "";
                    phoneNumber = "";
                })
                .catch((error) => {
                    console.error("Error during API request:", error);
                    alert("Failed to initiate callback request. Check your settings or try again.");
                });
        });
    });

    // Handle hang-up button
    document.getElementById('hangup-btn').addEventListener('click', () => {
        console.log("Call terminated.");
        phoneNumberDisplay.textContent = "";
        phoneNumber = "";
    });

    // Handle backspace button
    document.getElementById('backspace-btn').addEventListener('click', () => {
        phoneNumber = phoneNumber.slice(0, -1); // Remove the last character
        phoneNumberDisplay.textContent = phoneNumber;
    });

    // Handle settings icon click
    document.getElementById('settings-icon').addEventListener('click', () => {
        const settingsPage = chrome.runtime.getURL('src/settings/settings.html');
        window.location.href = settingsPage; // Redirect to the Settings page
    });

    // Populate settings form on the settings page
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        chrome.storage.sync.get(['subdomain', 'email', 'apiToken', 'talkLineId', 'groupId'], (result) => {
            document.getElementById('subdomain').value = result.subdomain || "";
            document.getElementById('email').value = result.email || "";
            document.getElementById('api-token').value = result.apiToken || "";
            document.getElementById('talk-line-id').value = result.talkLineId || "";
            document.getElementById('group-id').value = result.groupId || "";
        });

        settingsForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const subdomain = document.getElementById('subdomain').value;
            const email = document.getElementById('email').value;
            const apiToken = document.getElementById('api-token').value;
            const talkLineId = document.getElementById('talk-line-id').value;
            const groupId = document.getElementById('group-id').value;

            chrome.storage.sync.set({ subdomain, email, apiToken, talkLineId, groupId }, () => {
                alert('Settings saved successfully!');
            });
        });
    }
});
