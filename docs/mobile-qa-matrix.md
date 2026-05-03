# Mobile QA Matrix

## Minimum device targets
- Latest Chrome on Android
- Latest Safari on iPhone

## Required pass scenarios
- Intro view loads cleanly with one clear primary CTA.
- Tapping `Start AR Scan` immediately transitions to AR view.
- Camera permission allow/deny both provide clear runtime feedback.
- Marker lock works under good lighting.
- Marker lost transitions back to searching with clear guidance.
- Hotspots remain tappable and readable on narrow screens.
- Chatbot appears only on post-scan view and responds from local FAQ.
- Offer CTA remains visible in post-scan support view.

## Validation notes
- Desktop is preview mode only; tracking validation must be done on mobile.
- Glossy, blurry, or undersized markers reduce lock stability.
