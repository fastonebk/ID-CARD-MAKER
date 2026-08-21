# ID CARD MAKER SOLUTION — v3

## New in v3
- AI face-focused crop using MediaPipe Face Detector.
- Crop composition targets the supplied school-ID reference style: face is prominent, centered horizontally, hair near the upper portion, shoulders retained.
- If no face is detected or the AI model cannot load, the tool falls back to a center crop.
- Cropped photos preserve the **exact original filename**.
- Download All creates `Cropped-Photos.zip` containing one folder: `Cropped Photos/`.
- Added account/trial/premium UI. Active premium accounts hide payment buttons/options.

## Premium activation flow
1. User creates/logs into an account.
2. User gets a 1-day trial.
3. User chooses Monthly Rs. 99, Yearly Rs. 999, or Lifetime Rs. 4,999.
4. User pays and sends payment proof plus registered email to WhatsApp +977 9707943095.
5. Admin activates the account in the production database.
6. The account displays its active plan/expiry and payment options are hidden.

## Production security
This GitHub Pages version is a front-end prototype. LocalStorage cannot securely enforce paid access. For real protection, connect Google/email authentication, a database, server-side authorization, and an admin dashboard (Firebase/Supabase or another backend). The admin dashboard should set `plan`, `expiresAt`, and `active` for each user. The tools should then be authorized server-side.

## AI dependency
The browser loads MediaPipe Tasks Vision from jsDelivr and the BlazeFace short-range model from Google-hosted model storage. Internet access is required for AI face detection. Google documents the Face Detector Web API at https://developers.google.com/edge/mediapipe/solutions/vision/face_detector/web_js

## GitHub Pages
Upload the files in this folder to a GitHub repository and enable GitHub Pages.
