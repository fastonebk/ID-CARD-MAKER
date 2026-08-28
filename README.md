# ID Snap — ID Photo Cropper

A small static website that crops uploaded photos to **1 in × 1.26 in at 300 DPI**
(exactly **300 × 378 pixels**), centers the crop on the detected face, and lets
you export one photo or a whole batch as a `.zip`.

Everything runs in the browser. No backend, no upload to any server — it's
plain HTML/CSS/JS plus two CDN libraries (face detection and zipping).

## Files

```
index.html    the page structure
styles.css    all styling (design tokens at the top of the file)
cropper.js    the draggable/resizable crop-box component
imaging.js    crop/resize/sharpen + DPI-metadata writing + the auto-crop heuristic
app.js        wires the UI together (single-photo editor + bulk workflow)
```

## Run it locally

Just open `index.html` in a browser — but most browsers block `file://`
camera/canvas operations in odd ways, so it's more reliable to serve it:

```bash
cd photocrop
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a new GitHub repo (or use an existing one) and push these files to
   the root of the branch you'll publish (usually `main`):

   ```bash
   git init
   git add .
   git commit -m "ID photo cropper"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment → Source** = "Deploy
   from a branch", **Branch** = `main` / `/(root)`. Save.

3. GitHub gives you a URL like `https://<your-username>.github.io/<your-repo>/`
   within a minute or two. That's the live site.

No build step, no `npm install` — it's static files.

## How the auto-crop works

1. [face-api.js](https://github.com/justadudewhohacks/face-api.js) (loaded
   from a CDN) runs its "tiny face detector" plus a lightweight 68-point
   landmark model on the uploaded image, right in the browser.
2. The frame is centered and sized off the **eyes**, not the raw detector
   box: eye position and the distance between the eyes barely move
   regardless of hairstyle, fringe, tikka/accessories, or head tilt, so this
   stays far more consistent across a whole batch than sizing off the
   detector's bounding box would. Eyes land ~42% down from the top of the
   frame, with head width set relative to the eye spacing — the same
   convention passport/ID photo software uses.
3. If the landmark model doesn't load for some reason, it falls back to a
   heuristic based on the raw detector box; if no face is found at all, it
   falls back to a centered crop.
4. You can drag the frame to move it, or drag a corner to resize it — the
   shape always stays locked to the correct ratio, so you can never export a
   wrong-shaped crop by accident. The tool is fully usable by hand at every
   fallback level; auto-detection is a head start, not a requirement.

## Bulk-mode performance

Photos are processed **4 at a time** (not all at once, and not strictly one
by one) — this keeps memory use sane on large batches while still running
close to as fast as the browser's face detector allows. A "Detecting
faces… x/y" counter shows progress while it runs. The detector's input size
is tuned to 320px (`DETECTOR_INPUT_SIZE` in `imaging.js`) for a good
speed/accuracy balance on headshot-style photos — raise it if you're
processing photos where faces are small in the frame and detection is
missing them; lower it for more speed if faces are always large and
centered to begin with.

## Output quality

* Downscaling is done in halving steps (rather than one big resize) for a
  cleaner result, and a light sharpen pass (an unsharp-mask-style filter,
  toggleable) is applied afterward to keep facial detail crisp at the small
  final size.
* The exported PNG/JPG has real **300 DPI** metadata written into the file
  (a `pHYs` chunk for PNG, a JFIF density header for JPG) — so image viewers,
  printers, and photo-ID software that read resolution metadata will report
  300 DPI, not just "300×378 pixels".

## A note on the CDN dependencies

`index.html` loads two libraries from jsDelivr at runtime:

* `face-api.js` — face detection
* `jszip` — building the `.zip` for bulk downloads

If your network blocks jsDelivr, face detection and bulk-zip downloads won't
work, but single-photo manual cropping still will (everything except those
two features is plain vanilla JS). If face detection specifically fails to
load, the banner under the upload box will say so, and every photo just
starts with a manual centered crop instead.

If you'd rather not depend on a CDN for face detection, you can download the
`tiny_face_detector_model-*` files from the face-api.js repo's `weights/`
folder, drop them in a `models/` folder next to `index.html`, and change the
`CDN_ROOTS` array at the top of `imaging.js` to include `"models"`.

## Customizing

* **Target size**: change `TARGET_W` / `TARGET_H` / `DPI` at the top of
  `imaging.js` if you ever need a different photo spec.
* **Framing**: the heuristic constants (head size ratio, top margin) are in
  `autoCropBox()` in `imaging.js` — nudge them if you want more/less headroom
  by default.
* **Look and feel**: all colors, fonts, and spacing are CSS custom properties
  at the top of `styles.css`.
