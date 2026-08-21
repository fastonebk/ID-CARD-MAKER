# ID CARD MAKER SOLUTION — v4 Admin Panel

## What's new
- Exact original photo filenames preserved.
- All cropped photos download as `Cropped-Photos.zip` with one `Cropped Photos` folder.
- AI face-focused crop using MediaPipe Face Detector, with fallback center crop.
- Account/trial/premium UI.
- Customer **Submit Activation Request** form.
- New `admin.html` dashboard for reviewing requests and activating/deactivating/extending plans.
- Plans: Monthly Rs. 99, Yearly Rs. 999, Lifetime Rs. 4,999.

## Demo admin panel
Open `admin.html`.
Demo credentials:
- Email: `admin@idcardmakersolution.com`
- Password: `admin1234`

The demo panel uses browser `localStorage` so it can be tested immediately. It is **NOT secure enough for a real paid service**.

## Real production activation (recommended)
For customers using different phones/computers, connect the site to a backend:
1. Firebase Authentication (Google + Email/Password) or Supabase Auth.
2. Firestore/Supabase database for `users`, `subscriptions`, and `paymentRequests`.
3. Admin-only security rules.
4. Store plan, activation date, expiry date, status, payment reference, and admin ID.
5. Customer site reads premium status from the database; when active, hide payment UI and allow the tools.
6. Admin activates a customer with one click.

Do not use the demo admin password or localStorage as the production payment lock.

## GitHub Pages
Upload all files to the repository root and enable GitHub Pages. `admin.html` is available at `/admin.html`.

## External libraries
- SheetJS XLSX via jsDelivr
- JSZip via jsDelivr
- MediaPipe Tasks Vision via jsDelivr + Google model hosting
