# frameXTV for Fire TV / Android TV
WebView wrapper around https://framextv.xyz/ (change START_URL in MainActivity.java to point elsewhere).

Build in the cloud (no Android Studio needed):
1. Create a new GitHub repo and upload everything in this folder (including the hidden .github folder).
2. Repo > Actions > "Build APK" > Run workflow (it also runs on every push).
3. When it finishes, download the "frameXTV-apk" artifact and unzip it to get app-debug.apk.
4. On the Firestick: enable Settings > My Fire TV > Developer Options > Install unknown apps for Downloader, then sideload the APK (Downloader with a direct link, or: adb connect <firestick-ip>; adb install app-debug.apk).
