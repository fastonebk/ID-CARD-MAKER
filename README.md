# ID CARD MAKER SOLUTION

Responsive static website prototype for GitHub Pages.

## Included
- Bulk JPG/JPEG crop to 300 × 378 px (1 × 1.26 inch at 300 DPI)
- Clean center crop with a "smart" crop mode
- Bulk output download
- XLSX → Common Delimited CSV
- Chromium File System Access save dialog where supported
- Light/dark mode
- English/नेपाली UI toggle
- Monthly / Yearly / Lifetime pricing
- WhatsApp premium contact
- Responsive mobile/tablet/desktop layout

## Run on GitHub Pages
1. Upload `index.html`, `style.css`, and `script.js` to a GitHub repository.
2. Enable GitHub Pages from Settings → Pages.
3. Open the published site.

## Important prototype limitations
This is a front-end/static version. Real account creation, email verification, 1-day trial enforcement, persistent premium access, admin activation, and automatic eSewa/Khalti/bank payment verification require a backend/database and payment integration.

The crop tool currently uses a clean center/subject-ready crop, not a trained face-recognition model. A real face detector can be added later with a browser model or backend.

The original Excel file cannot normally be automatically deleted from a user's computer because browser security prevents websites from deleting arbitrary user files. The app therefore warns the user when deletion was requested.

`xlsx` is loaded from jsDelivr in `index.html`. For a completely offline/self-contained deployment, download and host the library locally.
