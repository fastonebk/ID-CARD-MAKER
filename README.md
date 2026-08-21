# ID CARD MAKER SOLUTION — GitHub Pages v2

### New changes
- Cropped images keep the **exact original filename**.
- **Download All as ZIP** creates `Cropped-Photos.zip` with one folder: `Cropped Photos`.
- Added top account/login interface.
- Added email create/login UI, 1-day trial state and premium plan display.
- Premium plans: Rs. 99 monthly, Rs. 999 yearly, Rs. 4,999 lifetime.
- WhatsApp manual premium activation remains available.

### Production authentication / paid lock
The account interface in this static GitHub Pages build is a prototype only. LocalStorage is not secure and cannot enforce paid access. For a real paid service, connect Firebase Authentication or Supabase Auth, a database, server-side authorization, and an admin dashboard. Google login/email verification and eSewa/Khalti payment verification should be handled by that backend.

### GitHub Pages
Upload all files to a GitHub repository and enable GitHub Pages.
