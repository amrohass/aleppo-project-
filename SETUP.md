# Aleppo Cafe — Website + CMS setup guide

The site is a **static website** (HTML/CSS/JS) hosted on **GitHub Pages**, with a
**Supabase** backend for content and images and a small **admin CMS** at
`admin.html`.

Because GitHub Pages can only serve static files (no server code), all the
"backend" work happens in Supabase, which the browser talks to directly. Until
you connect Supabase, the site still works — it renders the built-in default
content in `js/default-data.js`.

```
index.html        Public website (renders content, falls back to defaults)
admin.html        CMS dashboard (login required)
style.css         Public site styling
css/admin.css     CMS styling (same fonts & palette)
js/config.js      ← paste your Supabase URL + anon key here
js/default-data.js Built-in fallback/seed content
js/render.js      Draws the public site from data
js/site.js        Loads content (Supabase → falls back to defaults)
js/admin.js       CMS logic
supabase/schema.sql  Creates tables, storage bucket, security policies
supabase/seed.sql    Loads the current menu into the database
```

---

## Part 1 — Create the Supabase backend (~10 min, free)

1. Go to **https://supabase.com** → sign in → **New project**.
   Pick a name, a strong database password, and the closest region. Wait for it
   to finish provisioning.

2. In the project, open **SQL Editor → New query**. Open the file
   `supabase/schema.sql` from this repo, copy **all** of it into the editor, and
   press **Run**. This creates every table, a public `media` storage bucket for
   images, and the security rules (public can read, only you can edit).

3. (Recommended) Open **SQL Editor → New query** again, paste all of
   `supabase/seed.sql`, and **Run**. This loads the current menu, locations and
   social links so the CMS starts populated. *(Headings and paragraphs don't
   need seeding — the site already shows the defaults, and you can edit them in
   the CMS.)*

4. Create your admin login: **Authentication → Users → Add user → Create new
   user**. Enter your email and a password, and **turn on "Auto Confirm User"**
   (so you can log in immediately). This is the account you'll use for the CMS.

   > Only people you add here can edit the site. There is no public sign-up.

5. Get your keys: **Project Settings → API** (or **Data API**). Copy:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon / public API key** (a long token)

   > The anon key is meant to be public — it's safe to commit. It can only do
   > what the security policies allow: anyone can read content, but only a
   > logged-in admin can change it.

---

## Part 2 — Connect the website

1. Open `js/config.js` and paste your two values:

   ```js
   window.ALEPPO_CONFIG = {
     SUPABASE_URL: 'https://abcdxyz.supabase.co',
     SUPABASE_ANON_KEY: 'eyJhbGciOi...your-long-anon-key...'
   };
   ```

2. Save and commit. That's it — the site now reads live content from Supabase,
   and the CMS can log in.

---

## Part 3 — Publish on GitHub Pages

This repo already has a `CNAME` file, so it's set up for a custom domain.

1. Push your changes to GitHub (branch `main`).
2. On GitHub: **Settings → Pages**. Under *Build and deployment*, set
   **Source: Deploy from a branch**, **Branch: `main` / root (`/`)**, Save.
3. Wait a minute, then visit your domain (the value inside `CNAME`) or
   `https://<your-user>.github.io/<repo>/`.
4. The CMS lives at **`/admin.html`** on the same domain.

> **Important:** add your GitHub Pages domain to Supabase so auth works from it:
> **Authentication → URL Configuration** → add your site URL (e.g.
> `https://yourdomain.com`) to *Site URL* / *Redirect URLs*.

Nothing about the deploy is special — all files are static. The relative paths
(`js/…`, `css/…`) work from the site root.

---

## Part 4 — Using the CMS

Open `admin.html`, sign in with the user you created, and use the tabs:

| Tab | Controls |
|-----|----------|
| **Text & Images** | Every heading, paragraph, tagline, and background image. Click **Save all changes** to store them. |
| **Branches** | The top-level menu tabs (Ramallah, Berzait…). |
| **Categories** | Category tabs inside a branch — each has **two showcase images**. |
| **Sub-groups** | Optional groups inside a category (Drinks → Hot / Cold…). |
| **Menu Items** | Every dish/drink: English + Arabic name, price, description, image. |
| **Locations** | The "Find Us" cards. |
| **Social & Contacts** | Footer icons + Visit-column links. Use for phone/email too (`tel:` / `mailto:`). |
| **Media** | Upload images once and reuse their URL anywhere. |

### Editing tips
- **English fields** are left-to-right; **Arabic fields** are automatically
  right-to-left with the Amiri font — the layout stays correct.
- **Two images per menu section:** open **Categories**, edit a category, and set
  *Section image 1* and *Section image 2* (upload or paste a URL). Until you do,
  a branded placeholder is shown.
- **Images:** in any image field you can either paste a URL or click the file
  picker to upload straight to Supabase.
- **Prices** are free text, so `10 / 7 ₪` and `30–35 ₪` both work.
- **Ordering** is controlled by the *Order* number (low → first).
- Turning **Active/Available** off hides an item without deleting it.

---

## How the fallback works (why the site never breaks)

`js/site.js` renders the built-in defaults **immediately**, then, if Supabase is
configured, replaces them with live content. If Supabase is unreachable or not
configured, the defaults simply stay. So a broken key or an offline database
never leaves the page blank.

---

## Troubleshooting

- **CMS says "Supabase is not configured"** → you haven't filled in
  `js/config.js` (or the values still contain `YOUR_`).
- **Can't log in** → the user must exist under Authentication → Users and be
  confirmed; also add your domain under Authentication → URL Configuration.
- **Edits don't show on the site** → hard-refresh (Ctrl/Cmd+Shift+R). Reads are
  live but the browser may cache the page.
- **Images 404** → make sure the `media` bucket exists and is public (schema.sql
  does this) and that you're using the URL the Media tab gives you.
- **Menu tab is empty in the CMS** → run `supabase/seed.sql`, or add items
  manually starting from Branches → Categories → Menu Items.
