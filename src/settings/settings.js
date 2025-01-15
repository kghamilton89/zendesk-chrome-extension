document.addEventListener('DOMContentLoaded', () => {
    // Navigate back to the popup on clicking the back icon
    const backIcon = document.getElementById('back-icon');
    backIcon.addEventListener('click', () => {
        const popupPage = chrome.runtime.getURL('src/popup/popup.html');
        window.location.href = popupPage;
    });

    // Save settings on form submission
    const settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const subdomain = document.getElementById('subdomain').value;
        const email = document.getElementById('email').value;
        const apiToken = document.getElementById('api-token').value;

        chrome.storage.sync.set({ subdomain, email, apiToken }, () => {
            alert('Settings saved successfully!');
        });
    });
});
