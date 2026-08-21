# ID CARD MAKER SOLUTION — v5 GitHub-ready package

## Admin Portal
The admin portal is a separate page included in the repository:

`https://fastonebk.github.io/ID-CARD-MAKER/admin.html`

After publishing all files, open the exact URL above. The customer site also has an **Admin Portal** link in the top navigation and footer.

### Demo admin login
- Email: `admin@idcardmakersolution.com`
- Password: `admin1234`

## Admin features
- Dashboard counts for customers, pending requests, active premium and expired accounts.
- Pending request Activate / Reject buttons.
- Quick Activate Customer: enter the customer's registered email and choose Monthly / Yearly / Lifetime.
- Activate / Extend customer.
- Deactivate premium.
- Customer site hides premium payment controls while the account is active.

## Very important limitation
This GitHub Pages package is a **demo/prototype**. `localStorage` is browser-specific. Therefore, if a customer pays from their phone and you open the Admin Portal on your computer, the browser data will NOT automatically appear on your computer.

For a real paid launch, the next step is to connect Firebase Authentication + Firestore (or Supabase Auth + database). Then customer accounts, payment requests, subscription status and admin activation will be shared securely across devices.

Do not use the demo admin password for a real paid service.

## Publish on GitHub Pages
Upload **all files** from this folder to the repository root:
- `index.html`
- `admin.html`
- `style.css`
- `admin.css`
- `script.js`
- `admin.js`
- `README.md`

Then enable GitHub Pages.

## Existing functionality
- AI face-focused 1 × 1.26 inch crop at 300 DPI (300 × 378 px).
- Exact original filenames preserved.
- All cropped photos downloaded in one `Cropped-Photos.zip` containing a `Cropped Photos` folder.
- Excel `.xlsx` to Common Delimited CSV.
- Light/dark mode and English/नेपाली toggle.
- 1-day trial UI and Monthly / Yearly / Lifetime plans.
