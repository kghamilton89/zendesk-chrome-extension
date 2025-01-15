import { getFromStorage } from './storage.js';

export const makeZendeskAPICall = (phoneNumber) => {
    getFromStorage('subdomain', (subdomain) => {
        getFromStorage('email', (email) => {
            getFromStorage('apiToken', (apiToken) => {
                if (!subdomain || !email || !apiToken) {
                    alert("Please configure your credentials and subdomain in settings.");
                    return;
                }

                const url = `https://${subdomain}.zendesk.com/api/v2/talk/calls`;
                const payload = { phone_number: phoneNumber };

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${btoa(email + ":" + apiToken)}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Call initiated:", data);
                    alert("Call initiated successfully!");
                })
                .catch(error => {
                    console.error("Error initiating call:", error);
                    alert("Failed to initiate the call. Please try again.");
                });
            });
        });
    });
};
