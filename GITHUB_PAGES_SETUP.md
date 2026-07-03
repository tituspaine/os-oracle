# GitHub Pages Setup Instructions

## ⚙️ **ENABLE GITHUB PAGES IN YOUR REPOSITORY SETTINGS**

Follow these exact steps:

### Step 1: Go to Repository Settings
1. Open: https://github.com/tituspaine/os-oracle/settings
2. Scroll down to **"Pages"** section (left sidebar)

### Step 2: Configure Publishing Source
1. Under **"Build and deployment"** → **"Source"**
2. Select **"Deploy from a branch"** (not GitHub Actions)
3. Under **"Branch"** dropdown:
   - Select: **main**
   - Select folder: **/docs**
4. Click **Save**

### Step 3: Wait for Deployment
- GitHub will automatically build and deploy
- Look for the green checkmark ✅
- You'll see a message: "Your site is live at https://tituspaine.github.io/os-oracle"

### Step 4: Visit Your Site
```
https://tituspaine.github.io/os-oracle
```

---

## 🔍 **If Still Not Working:**

### Check These:
1. **Is the file case-sensitive?** - Must be lowercase: `index.html` (not `Index.html`)
2. **Is it in /docs folder?** - Must be at `docs/index.html`
3. **Is it on main branch?** - Must be pushed to `main`
4. **Clear browser cache:** Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
5. **Check GitHub Status:** https://githubstatus.com

### Verify File Exists:
```bash
# In your local repo
ls -la docs/index.html
git status
git push origin main
```

---

## ✅ **Verification Checklist:**

- [ ] Went to `/settings/pages`
- [ ] Selected "Deploy from a branch"
- [ ] Selected "main" branch and "/docs" folder
- [ ] Clicked Save
- [ ] Waited 1-2 minutes
- [ ] Cleared browser cache
- [ ] Visited https://tituspaine.github.io/os-oracle
- [ ] ✅ Site is live!

---

## 📍 **Your GitHub Pages URL:**

```
https://tituspaine.github.io/os-oracle
```

(Note: For project repositories like yours, the URL includes the repo name)

---

**If you're still having issues, please:**
1. Screenshot the Settings > Pages section
2. Check GitHub Status page for incidents
3. Try a hard refresh: Ctrl+F5

See official docs: [Troubleshooting 404 errors for GitHub Pages sites](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)
