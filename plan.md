# shivansh.life — Project Plan

## Feature Roadmap

macOS Yosemite-themed interactive portfolio. Each feature maps to a "native app" on the desktop.

### Done

- [x] **Boot Sequence** — macOS startup animation on load
- [x] **Menu Bar** — top bar with app name, mute toggle, clock
- [x] **Dock** — app launcher with magnification and open indicators
- [x] **Window Manager** — draggable, focusable, closable windows with z-index
- [x] **About Me** (System Preferences) — overview, skills, experience, education tabs
- [x] **Projects** (Finder) — design project browser
- [x] **Contact** (Contacts) — contact info window
- [x] **FaceTime** — video/camera window
- [x] **Spotify Widget** — live now-playing integration
- [x] **Resume** (Preview) — PDF-style resume viewer
- [x] **Video Player** (QuickTime) — work demo playback
- [x] **YouTube Player** (QuickTime) — Zenith project video
- [x] **Calendar** — month view with events
- [x] **Desktop Icons** — Resume.pdf, zenith.mov with double-click to open
- [x] **Context Menu** — right-click wallpaper switcher
- [x] **Sound Design** — Tone.js hover, click, open/close sounds
- [x] **Mobile Gate** — mobile device handling
- [x] **Terminal** — interactive shell with commands (whoami, skills, ls code, neofetch, git log, open \<app\>, etc.) — showcases coding projects

### Up Next — Creative

- [ ] **Stickies** — floating sticky notes with testimonials / design philosophy quotes
- [ ] **Photo Booth** — gallery grid of design work, brand assets, behind-the-scenes
- [ ] **Messages (iMessage)** — scripted conversation guestbook or personality showcase
- [ ] **iBooks** — bookshelf of case studies or design influences reading list
- [ ] **Maps** — Apple Maps window with Bengaluru location pin
- [ ] **Dynamic Wallpaper** — wallpaper auto-shifts based on visitor's local time (dawn/day/dusk/night)

### Up Next — Technical / UX

- [ ] **Spotlight Search** — Cmd+Space fuzzy search across projects, skills, experience; opens relevant window
- [ ] **Launchpad** — overlay grid of all apps for discoverability
- [ ] **Notification Center** — slide-in panel with recent activity / career milestones
- [ ] **Expose / Mission Control** — tile all open windows with keyboard shortcut
- [ ] **Trash Can** — drag desktop icons to trash (easter egg)
- [ ] **Desktop Folders** — grouped content icons (Documents, Downloads)

### Up Next — Widgets

Small, glanceable pieces that live on the desktop or in a Dashboard/Notification Center overlay. Inspired by macOS Dashboard widgets and Yosemite's Today view.

- [ ] **Weather Widget** — shows real weather for Bengaluru (or visitor's location via IP); Yosemite glass style
- [ ] **Clock Widget** — analog clock face with smooth second hand, matches the retro desktop vibe
- [ ] **GitHub Contribution Graph** — live heatmap pulled from your GitHub profile; proves you ship code
- [ ] **Behance Recent Work** — latest 3-4 Behance shots as thumbnail cards with links
- [ ] **Now / Status Widget** — a "/now" page as a widget: what you're currently working on, learning, reading
- [ ] **Visitor Counter** — retro hit counter ("You are visitor #4,827") — nostalgic and fun
- [ ] **Mini Bio Card (vCard)** — draggable business card widget with name, role, photo, and key links
- [ ] **Pomodoro Timer** — a working focus timer; shows you value productivity (and it's actually useful)
- [ ] **Quote of the Day** — rotating design/creativity quotes; subtle personality touch
- [ ] **Calculator** — working retro macOS calculator (you have `Calculator.png` already); pure delight
- [ ] **World Clock** — multiple timezone clocks (Bengaluru, SF, London) — useful if targeting international clients
- [ ] **System Monitor** — fake CPU/RAM/Network graphs that actually show page performance metrics (load time, bundle size)
- [ ] **Sticky Stats** — small stat cards: years of experience, projects shipped, tools mastered, clients worked with

### Backlog / Polish

- [ ] Keyboard shortcuts (Cmd+Q close, Cmd+W close, Cmd+Space spotlight)
- [ ] Window minimize animation to dock
- [ ] Window maximize / fullscreen toggle
- [ ] Dock folder stacks (fan/grid popup)
- [ ] Loading states for external content (Spotify, videos)
- [ ] Accessibility pass (keyboard nav, screen reader labels)
- [ ] SEO meta tags and Open Graph for link previews

---

# Deploy shivansh.life to DigitalOcean

## Phase 1: Simple Deployment (Manual)

CI/CD comes later. First, get the site running on a droplet manually.

---

### Step 1: Code Changes (Local)

#### 1a. Add standalone output to `next.config.ts`
```ts
const nextConfig: NextConfig = {
  output: 'standalone',
};
```
This makes Next.js produce a self-contained `server.js` file (~150MB instead of ~800MB with full node_modules).

#### 1b. Create `Dockerfile`
Multi-stage build:
- Stage 1: Install dependencies with Bun
- Stage 2: Build the Next.js app
- Stage 3: Slim Node.js image with only the standalone output

#### 1c. Create `.dockerignore`
Keeps the Docker build context small by excluding `node_modules`, `.next`, `.git`, etc.

#### 1d. Test locally
```bash
docker build -t portfolio .
docker run -p 3000:3000 --env-file .env portfolio
# Visit http://localhost:3000
```

---

### Step 2: Create a DigitalOcean Droplet

1. Go to https://cloud.digitalocean.com → Create → Droplets
2. Choose:
   - **Region**: Bangalore (closest to you) or wherever your audience is
   - **Image**: Ubuntu 24.04 LTS
   - **Plan**: Basic → Regular → $6/mo (1 vCPU, 1GB RAM, 25GB SSD)
   - **Authentication**: SSH Key (add your public key from `~/.ssh/id_ed25519.pub`)
     - If you don't have one: `ssh-keygen -t ed25519` on your mac
   - **Hostname**: portfolio
3. Click Create Droplet
4. Note the **IP address** (e.g., `164.92.xxx.xxx`)

---

### Step 3: Initial Server Setup

SSH into your droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Run these commands one by one:

#### 3a. System updates
```bash
apt update && apt upgrade -y
```

#### 3b. Create a deploy user (don't run everything as root)
```bash
adduser deploy --disabled-password --gecos ""
usermod -aG sudo deploy
# Copy your SSH key to the deploy user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
```

#### 3c. Install Docker
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
```

#### 3d. Install Nginx
```bash
apt install -y nginx
```

#### 3e. Install Certbot (for free SSL)
```bash
apt install -y certbot python3-certbot-nginx
```

#### 3f. Set up firewall
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

#### 3g. Create swap (critical — 1GB RAM is tight for Docker)
```bash
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

#### 3h. Create app directory
```bash
mkdir -p /opt/portfolio
chown deploy:deploy /opt/portfolio
```

Now **logout** from root and SSH back as deploy:
```bash
exit
ssh deploy@YOUR_DROPLET_IP
```

---

### Step 4: Get Your App on the Server

#### Option A: Build on the server (simpler to learn)
```bash
cd /opt/portfolio

# Clone your repo
git clone https://github.com/YOUR_USER/portfolio2026.git .

# Create .env file with your Spotify credentials
nano .env
```

Add to .env:
```
SPOTIFY_CLIENT_ID=your_id
SPOTIFY_CLIENT_SECRET=your_secret
SPOTIFY_REFRESH_TOKEN=your_token
SPOTIFY_REDIRECT_URI=https://shivansh.life/api/spotify/callback
```

Build and run:
```bash
docker build -t portfolio .
docker run -d \
  --name portfolio \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  portfolio
```

Check it's running:
```bash
docker ps
# Should show "portfolio" container with status "Up"
curl http://localhost:3000
# Should return HTML
```

#### Option B: Use Docker Compose (recommended)
Create `/opt/portfolio/docker-compose.yml`:
```yaml
services:
  portfolio:
    build: .
    ports:
      - "127.0.0.1:3000:3000"
    env_file: .env
    restart: unless-stopped
```

Then:
```bash
docker compose up -d --build
docker compose ps    # check status
docker compose logs  # check for errors
```

---

### Step 5: Set Up Nginx Reverse Proxy

Switch back to root (need sudo for nginx config):
```bash
sudo nano /etc/nginx/sites-available/shivansh.life
```

Paste this:
```nginx
server {
    listen 80;
    server_name shivansh.life www.shivansh.life;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache Next.js static assets (hashed filenames = safe to cache forever)
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache images (your Yosemite icons etc.)
    location ~* \.(png|jpg|jpeg|ico|svg|webp)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/shivansh.life /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default   # remove default site
sudo nginx -t                               # test config (should say "ok")
sudo systemctl reload nginx
```

Test: Visit `http://YOUR_DROPLET_IP` in browser — should see your site.

---

### Step 6: Point Your Domain

In your domain registrar (wherever you bought shivansh.life):
1. **A record**: `@` → `YOUR_DROPLET_IP`
2. **A record**: `www` → `YOUR_DROPLET_IP`
3. Set TTL to 300 (5 min) for faster propagation

Wait a few minutes, then test: `http://shivansh.life` should load your site.

---

### Step 7: Enable HTTPS (SSL)

Once DNS is pointing to your droplet:
```bash
sudo certbot --nginx -d shivansh.life -d www.shivansh.life
```

Certbot will:
- Get a free SSL certificate from Let's Encrypt
- Auto-modify your Nginx config to handle HTTPS
- Set up auto-renewal (certs expire every 90 days, renewal is automatic)

Test: `https://shivansh.life` should work with a padlock icon.

---

### Step 8: Update Spotify Redirect URI

Go to https://developer.spotify.com/dashboard → your app → Edit Settings:
- Add `https://shivansh.life/api/spotify/callback` to Redirect URIs

---

### Step 9: Verify Everything

- [ ] `https://shivansh.life` loads the macOS Yosemite desktop
- [ ] `http://shivansh.life` redirects to HTTPS
- [ ] Spotify widget shows your currently playing track
- [ ] All Yosemite icons load
- [ ] Sound effects work (Tone.js)
- [ ] Windows open/close/drag properly
- [ ] Terminal commands work (whoami, ls code, neofetch, open \<app\>)

---

## Useful Commands (Cheat Sheet)

```bash
# Check if container is running
docker ps

# View logs
docker compose logs -f

# Restart after code changes
cd /opt/portfolio && git pull && docker compose up -d --build

# Check Nginx status
sudo systemctl status nginx

# Renew SSL manually (usually auto)
sudo certbot renew --dry-run

# Check disk space
df -h

# Check memory
free -h
```

---

## Phase 2: CI/CD Pipeline (Later)

Will add GitHub Actions to automate: push to main → build image → push to GHCR → SSH deploy to droplet. For now, manual `git pull && docker compose up -d --build` on the server is fine.

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `next.config.ts` | Modify — add `output: 'standalone'` |
| `Dockerfile` | Create — multi-stage build |
| `.dockerignore` | Create |
| `plan.md` | This file |
