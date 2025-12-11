"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    onDeepLink: (callback) => {
        electron_1.ipcRenderer.on('deep-link', (_event, url) => callback(url));
        return () => electron_1.ipcRenderer.removeAllListeners('deep-link');
    },
    startOAuth: () => electron_1.ipcRenderer.invoke('start-oauth'),
    onOAuthSuccess: (callback) => {
        electron_1.ipcRenderer.on('oauth-success', (_event, token) => callback(token));
        return () => electron_1.ipcRenderer.removeAllListeners('oauth-success');
    },
    login: () => {
        // Can verify logic here
    },
    vectorize: (args) => electron_1.ipcRenderer.invoke('vectorize-image', args),
});
