document.addEventListener('DOMContentLoaded', () => {
    // References to the input fields
    const subdomainInput = document.getElementById('subdomain');
    const emailInput = document.getElementById('email');
    const apiTokenInput = document.getElementById('api-token');
    const talkLineIdInput = document.getElementById('talk-line-id');
    const groupIdInput = document.getElementById('group-id');

    // Load saved values and populate placeholders
    chrome.storage.sync.get(['subdomain', 'email', 'apiToken', 'talkLineId', 'groupId'], (result) => {
        if (result.subdomain) {
            subdomainInput.placeholder = result.subdomain;
        }
        if (result.email) {
            emailInput.placeholder = result.email;
        }
        if (result.apiToken) {
            apiTokenInput.placeholder = result.apiToken;
        }
        if (result.talkLineId) {
            talkLineIdInput.placeholder = result.talkLineId;
        }
        if (result.groupId) {
            groupIdInput.placeholder = result.groupId;
        }
    });

    // Handle form submission and save new values
    const settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const subdomain = subdomainInput.value.trim();
        const email = emailInput.value.trim();
        const apiToken = apiTokenInput.value.trim();
        const talkLineId = talkLineIdInput.value.trim();
        const groupId = groupIdInput.value.trim();

        chrome.storage.sync.set(
            { subdomain, email, apiToken, talkLineId, groupId },
            () => {
                alert('Settings saved successfully!');
            }
        );
    });

    // Handle Back Button click
    const backIcon = document.getElementById('back-icon');
    backIcon.addEventListener('click', () => {
        const popupPage = chrome.runtime.getURL('src/popup/popup.html');
        window.location.href = popupPage; // Redirect to the homepage
    });
});
