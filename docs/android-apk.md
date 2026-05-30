# DoneTown Android APK Build

This project uses Capacitor to package the Vite React app as an Android APK.

## Local Debug APK

Run from the repository root:

```powershell
npm run apk:debug
```

The script will:

- build the web app with `npm run build`
- sync the web assets into the Android project with Capacitor
- run Gradle `assembleDebug`
- copy the APK to `dist-apk/DoneTown-debug.apk`

For convenience, the current local build can also be copied to:

```text
C:\Users\zachary\Desktop\DoneTown-debug.apk
```

## Verify The APK

```powershell
$apk = "dist-apk\DoneTown-debug.apk"
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$javaHome = "$env:LOCALAPPDATA\DoneTownToolchain\jdk21"
$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"

& "$sdk\build-tools\36.0.0\apksigner.bat" verify --print-certs $apk
& "$sdk\build-tools\36.0.0\aapt.exe" dump badging $apk
```

Expected package metadata:

- package: `com.donetown.app`
- application label: `DoneTown`
- min SDK: `24`
- target SDK: `36`

## Install On A Connected Android Phone

Enable developer mode and USB debugging on the phone, then connect it by USB.

The project shortcut is:

```powershell
npm run apk:install
```

To rebuild first and then install:

```powershell
npm run apk:install -- -Build
```

Manual install commands:

```powershell
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
& "$sdk\platform-tools\adb.exe" devices
& "$sdk\platform-tools\adb.exe" install -r "dist-apk\DoneTown-debug.apk"
```

If the phone asks for USB debugging permission, allow it and run the install command again.

## GitHub Actions

The workflow at `.github/workflows/build-debug-apk.yml` builds the same debug APK on pushes to `main` and through manual `workflow_dispatch`.

The generated artifact is named:

```text
DoneTown-debug-apk
```

This debug APK is suitable for internal testing. A production release later needs a release signing key and an `assembleRelease` flow.
