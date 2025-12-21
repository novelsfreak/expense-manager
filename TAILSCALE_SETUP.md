# 🚀 Tailscale Access Setup

Your server is now configured to be accessible via Tailscale!

## ✅ What's Been Configured

1. **Backend Server** (`server/index.js`):
   - ✅ Listening on `0.0.0.0` (all network interfaces)
   - ✅ CORS allows Tailscale IPs (100.x.x.x range)
   - ✅ CORS allows any local network IP

2. **Frontend Dev Server** (`vite.config.ts`):
   - ✅ Listening on `0.0.0.0` (all network interfaces)
   - ✅ Port 5173 exposed

## 📱 How to Access via Tailscale

### Step 1: Get Your Tailscale IP

On your Mac (where the server is running):
```bash
tailscale ip
```

You'll get something like: `100.x.x.x`

### Step 2: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Expense Manager API Server running on port 3001
🔗 Accessible at:
   - http://localhost:3001
   - http://0.0.0.0:3001
   - http://<your-tailscale-ip>:3001
💡 Use 'tailscale ip' to get your Tailscale IP address
```

### Step 3: Access from Another Device

**Option A: Use the Tailscale IP directly**

1. Get your Tailscale IP: `tailscale ip` (e.g., `100.64.1.2`)
2. On your mobile/other device, open browser:
   - Frontend: `http://100.64.1.2:5173`
   - Backend API: `http://100.64.1.2:3001`

**Option B: Use Tailscale MagicDNS (Recommended)**

If you have MagicDNS enabled:
1. Get your machine name: `tailscale status`
2. Access via: `http://your-machine-name:5173`

### Step 4: Configure Frontend for Tailscale IP

If you're accessing from another device, you may need to set the API URL:

**On your mobile device:**
1. Open browser dev tools (if possible)
2. Set localStorage: `VITE_API_URL=http://100.64.1.2:3001`
3. Or create a `.env.local` file (for development)

**Or use environment variable:**
```bash
VITE_API_URL=http://100.64.1.2:3001 npm run dev
```

## 🔧 Troubleshooting

### Can't connect from mobile device?

1. **Check Tailscale is connected on both devices:**
   ```bash
   tailscale status
   ```

2. **Check firewall:**
   - macOS: System Settings → Network → Firewall
   - Make sure Node.js/Vite is allowed

3. **Check server is running:**
   ```bash
   curl http://localhost:3001/api/health
   ```

4. **Test from mobile:**
   ```bash
   # Replace with your Tailscale IP
   curl http://100.64.1.2:3001/api/health
   ```

### CORS errors?

The server now allows:
- ✅ Localhost (127.0.0.1)
- ✅ Tailscale IPs (100.x.x.x)
- ✅ Any IP address (for local network)

If you still get CORS errors, check the browser console for the exact origin being blocked.

### Port not accessible?

Make sure:
- ✅ Server is listening on `0.0.0.0` (not just `localhost`)
- ✅ Firewall allows connections on ports 3001 and 5173
- ✅ Tailscale is active on both devices

## 🎯 Quick Test

1. **On your Mac:**
   ```bash
   npm run dev
   tailscale ip  # Note this IP
   ```

2. **On your mobile (connected to same Tailscale network):**
   - Open browser: `http://<tailscale-ip>:5173`
   - Should see the Expense Manager app!

## 📝 Notes

- The backend API is at port **3001**
- The frontend dev server is at port **5173**
- Both are now accessible via Tailscale IP
- CORS is configured to allow Tailscale connections
- For production (Vercel), this doesn't apply - use the Vercel URL

---

**Need help?** Check the server logs for connection details!

