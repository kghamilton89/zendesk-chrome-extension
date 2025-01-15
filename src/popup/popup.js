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
        if (phoneNumber) {
            console.log("Calling:", phoneNumber);
        } else {
            alert("Please enter a phone number.");
        }
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
});
