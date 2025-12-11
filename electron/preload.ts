import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    onDeepLink: (callback: (url: string) => void) => {
        ipcRenderer.on('deep-link', (_event, url) => callback(url));
        return () => ipcRenderer.removeAllListeners('deep-link');
    },
    startOAuth: () => ipcRenderer.invoke('start-oauth'),
    onOAuthSuccess: (callback: (token: string) => void) => {
        ipcRenderer.on('oauth-success', (_event, token) => callback(token));
        return () => ipcRenderer.removeAllListeners('oauth-success');
    },
    login: () => {
        // Can verify logic here
    },
    vectorize: (args: any) => ipcRenderer.invoke('vectorize-image', args),
});
