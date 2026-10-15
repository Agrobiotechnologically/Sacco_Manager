# Android APK

The Android app is a Capacitor wrapper around the SACCO workspace. Its records and preferences use the Android WebView's local storage, so they remain on that device between app launches and upgrades. Uninstalling the app or clearing its storage removes them.

## Build

### No local Android tools (recommended)

GitHub Actions can build the APK without installing Android Studio, Java, or the Android SDK on your computer:

1. Push the project files, including `.github/workflows/android-apk.yml`, to the `main` branch of the GitHub repository.
2. On GitHub, open **Actions** and select **Build Android APK**.
3. Select **Run workflow** and start the build.
4. When it finishes, open the workflow run and download the **umoja-sacco-apk** artifact, or download `umoja-sacco.apk` from the latest GitHub release.
5. Install the APK on your Android device.

The workflow provisions Java and Android SDK in GitHub's build environment, publishes each successful build as a GitHub release, and updates the app's APK download link. Nothing needs to be installed locally apart from GitHub access.

### Build on this computer

Install Node.js, Java 21, and the Android SDK command-line tools (Android Studio is not required). From the project directory, run:

```sh
npm install
npm run android:apk
```

If the project does not yet contain an `android/` directory, run `npx cap add android` once before building.

The installable debug APK is written to `downloads/umoja-sacco.apk`. It stores SACCO records and preferences on the device using Android WebView's local storage; uninstalling or clearing the app's storage removes them.
