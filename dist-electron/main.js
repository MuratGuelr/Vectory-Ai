"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const http_1 = __importDefault(require("http"));
const url_2 = __importDefault(require("url"));
const fs_1 = __importDefault(require("fs"));
// @ts-ignore
const imagetracerjs_1 = __importDefault(require("imagetracerjs"));
// Load Environment Variables
const possibleEnvPaths = [
    path_1.default.join(__dirname, "../.env.local"),
    path_1.default.join(process.cwd(), ".env.local"),
];
for (const envPath of possibleEnvPaths) {
    if (fs_1.default.existsSync(envPath)) {
        require("dotenv").config({ path: envPath, override: true });
        break;
    }
}
let mainWindow = null;
let authServer = null;
const isDev = !electron_1.app.isPackaged;
// --- AUTH HTML TEMPLATES ---
const getLoginHtml = (apiKey, authDomain) => `
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Vectory AI Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: { "primary": "#13ec37", "background-dark": "#102213" },
                    fontFamily: { "display": ["Manrope", "sans-serif"] },
                },
            },
        }
    </script>
</head>
<body class="bg-[#f6f8f6] dark:bg-[#102213] text-white font-display min-h-screen flex items-center justify-center p-4">
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#13ec37]/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#13ec37]/5 rounded-full blur-[100px]"></div>
    </div>
    <div class="relative z-10 w-full max-w-[480px] bg-[#151f16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
        <div class="relative h-48 w-full bg-cover bg-center flex flex-col justify-end p-6" style="background-image: linear-gradient(180deg, rgba(16, 34, 19, 0) 0%, #151f16 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCaKFIo0I6UsqGLqbvdwPH2PiYv24fd8ypDhH-32jPZk1mdrzKp7hrcxIqhAQ5imvY_x4rsgCIhPAFrzEdbX8MNKjZeuhYY4FUtzZZ4LAWTalZlXu_0QZ-4XKIueAK14DiolEXVIJ7Ls_Wkwu4VU027B6II10YbCnX7pZgpDd5LMUC3-DQqeWYVnpgsI-Jqc3S0i0I-_cjg3A4Kj9UpfZ_LJb4yDHZeCVmWEnBTprjDxmXELuC4ir_-jI4sc57VV943RjEBJvAlA8fr');">
            <div class="absolute top-6 left-6 flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-[#13ec37] flex items-center justify-center text-[#102213]">
                    <span class="material-symbols-outlined text-xl">polyline</span>
                </div>
                <span class="text-white font-bold text-lg tracking-tight">Vectory AI</span>
            </div>
            <h1 class="text-3xl font-bold text-white leading-tight">Welcome Back</h1>
        </div>
        <div class="p-6 pt-2 flex flex-col gap-5 pb-8">
            <button id="loginBtn" class="flex w-full items-center justify-center gap-3 rounded-full h-12 px-5 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200 group">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24"><path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"></path><path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.2812H1.46395V17.4218C3.53296 21.5366 7.63288 24.0008 12.2401 24.0008Z" fill="#34A853"></path><path d="M5.50253 14.2812C5.00309 12.7805 5.00309 11.2195 5.50253 9.71885V6.57828H1.46395C-0.422078 10.3342 -0.422078 14.6658 1.46395 18.4218L5.50253 14.2812Z" fill="#FBBC05"></path><path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.63288 0.000808666 3.53296 2.46498 1.46395 6.57999L5.50262 9.72056C6.45064 6.86188 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"></path></svg>
               <span id="btnText" class="text-sm font-bold tracking-wide">Continue with Google</span>
            </button>
            <div id="errorMsg" class="text-red-400 text-sm hidden"></div>
        </div>
    </div>
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
        const app = initializeApp({ apiKey: "${apiKey}", authDomain: "${authDomain}" });
        const auth = getAuth(app);
        const loginBtn = document.getElementById('loginBtn');
        const btnText = document.getElementById('btnText');
        const errorMsg = document.getElementById('errorMsg');
        
        loginBtn.onclick = async () => {
          loginBtn.disabled = true;
          loginBtn.classList.add('opacity-50');
          btnText.textContent = 'Sign In...';
          errorMsg.classList.add('hidden');
          try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const cred = GoogleAuthProvider.credentialFromResult(result);
            if (cred && cred.idToken) {
                btnText.textContent = 'Redirecting...';
                window.location.href = "/oauth/callback?token=" + cred.idToken;
            } else {
                throw new Error("No credential found");
            }
          } catch (error) {
            loginBtn.disabled = false;
            loginBtn.classList.remove('opacity-50');
            btnText.textContent = 'Continue with Google';
            errorMsg.textContent = error.message;
            errorMsg.classList.remove('hidden');
          }
        };
    </script>
</body>
</html>
`;
const getSuccessHtml = () => `
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8"/><title>Success</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#102213] text-white flex items-center justify-center min-h-screen">
    <div class="text-center">
        <h1 class="text-3xl font-bold text-[#13ec37] mb-2">Login Successful!</h1>
        <p class="text-gray-400">You can close this tab now.</p>
        <script>setTimeout(() => window.close(), 1500);</script>
    </div>
</body>
</html>
`;
const startLocalAuthServer = () => {
    return new Promise((resolve) => {
        if (authServer) {
            authServer.close();
            authServer = null;
        }
        const server = http_1.default.createServer((req, res) => {
            const parsedUrl = url_2.default.parse(req.url || '', true);
            if (parsedUrl.pathname === "/login") {
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(getLoginHtml(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''));
            }
            else if (parsedUrl.pathname === "/oauth/callback") {
                const token = parsedUrl.query.token;
                if (token && mainWindow)
                    mainWindow.webContents.send("oauth-success", token);
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(getSuccessHtml());
            }
            else {
                res.writeHead(404);
                res.end("Not Found");
            }
        });
        server.listen(0, "127.0.0.1", () => {
            authServer = server;
            resolve(server);
        });
    });
};
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#0f172a',
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        },
    });
    const startUrl = isDev
        ? 'http://localhost:3000'
        : (0, url_1.pathToFileURL)(path_1.default.join(__dirname, '../out/index.html')).href;
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            electron_1.shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });
}
electron_1.app.on('window-all-closed', () => { if (process.platform !== 'darwin')
    electron_1.app.quit(); });
electron_1.app.on('activate', () => { if (electron_1.BrowserWindow.getAllWindows().length === 0)
    createWindow(); });
electron_1.app.whenReady().then(() => {
    createWindow();
    // IPC for Auth
    electron_1.ipcMain.handle("start-oauth", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const server = yield startLocalAuthServer();
            const address = server.address();
            if (address && typeof address !== 'string') {
                yield electron_1.shell.openExternal(`http://127.0.0.1:${address.port}/login`);
            }
        }
        catch (e) {
            console.error("Auth server error:", e);
        }
    }));
    // IPC for Vectorization
    electron_1.ipcMain.handle('vectorize-image', (event, args) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                console.log('Vectorize request received:', args.type);
                const options = args.options || { numberofcolors: 16 };
                let tempPath = "";
                let shouldCleanup = false;
                if (args.type === 'base64') {
                    const base64Data = args.content.replace(/^data:image\/\w+;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    tempPath = path_1.default.join(electron_1.app.getPath('temp'), `vectory_temp_${Date.now()}.png`);
                    try {
                        fs_1.default.writeFileSync(tempPath, buffer);
                        shouldCleanup = true;
                    }
                    catch (err) {
                        console.error("Temp file write error:", err);
                        return resolve({ success: false, error: "Failed to create temp file" });
                    }
                }
                else if (args.type === 'path') {
                    tempPath = args.path;
                    if (!fs_1.default.existsSync(tempPath)) {
                        return resolve({ success: false, error: "File does not exist: " + tempPath });
                    }
                }
                else {
                    return resolve({ success: false, error: "Invalid input type: " + args.type });
                }
                // Run ImageTracer
                try {
                    // Start a timeout to prevent infinite hanging
                    const timeout = setTimeout(() => {
                        if (shouldCleanup)
                            try {
                                fs_1.default.unlinkSync(tempPath);
                            }
                            catch (e) { }
                        resolve({ success: false, error: "Vectorization timed out" });
                    }, 30000);
                    imagetracerjs_1.default.imageToSVG(tempPath, function (svgstr) {
                        clearTimeout(timeout);
                        if (shouldCleanup) {
                            try {
                                fs_1.default.unlinkSync(tempPath);
                            }
                            catch (e) { }
                        }
                        if (svgstr) {
                            resolve({ success: true, content: svgstr });
                        }
                        else {
                            resolve({ success: false, error: "Vectorization result was empty" });
                        }
                    }, options);
                }
                catch (tracerErr) {
                    if (shouldCleanup)
                        try {
                            fs_1.default.unlinkSync(tempPath);
                        }
                        catch (e) { }
                    console.error("ImageTracer sync error:", tracerErr);
                    resolve({ success: false, error: "ImageTracer failed: " + tracerErr.message });
                }
            }
            catch (error) {
                console.error("Vectorize handler error:", error);
                resolve({ success: false, error: error.toString() });
            }
        });
    }));
});
