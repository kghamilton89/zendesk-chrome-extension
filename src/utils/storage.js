export const saveToStorage = (key, value, callback) => {
    chrome.storage.sync.set({ [key]: value }, callback);
};

export const getFromStorage = (key, callback) => {
    chrome.storage.sync.get([key], (result) => callback(result[key]));
};
