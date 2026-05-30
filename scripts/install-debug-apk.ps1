param(
  [string]$ApkPath = "dist-apk\DoneTown-debug.apk",
  [switch]$Build
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
$resolvedApkPath = Join-Path $repoRoot $ApkPath

function Resolve-AndroidSdk {
  $candidates = @(
    $env:ANDROID_SDK_ROOT,
    $env:ANDROID_HOME,
    (Join-Path $env:LOCALAPPDATA "Android\Sdk")
  ) | Where-Object { $_ }

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath (Join-Path $candidate "platform-tools\adb.exe")) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }

  throw "Android SDK Platform Tools not found. Install Android SDK or set ANDROID_SDK_ROOT."
}

if ($Build -or -not (Test-Path -LiteralPath $resolvedApkPath)) {
  & (Join-Path $PSScriptRoot "build-debug-apk.ps1")
}

if (-not (Test-Path -LiteralPath $resolvedApkPath)) {
  throw "Debug APK not found at $resolvedApkPath"
}

$sdkRoot = Resolve-AndroidSdk
$adb = Join-Path $sdkRoot "platform-tools\adb.exe"
$devicesOutput = & $adb devices -l
$connectedDevices = $devicesOutput | Where-Object { $_ -match "^\S+\s+device(\s|$)" }
$unauthorizedDevices = $devicesOutput | Where-Object { $_ -match "^\S+\s+unauthorized(\s|$)" }
$offlineDevices = $devicesOutput | Where-Object { $_ -match "^\S+\s+offline(\s|$)" }

if ($unauthorizedDevices) {
  Write-Output "Android device is connected but USB debugging is not authorized."
  $unauthorizedDevices | ForEach-Object { Write-Output $_ }
  Write-Output "Unlock the phone, accept the USB debugging prompt, then run:"
  Write-Output "npm run apk:install"
  exit 1
}

if ($offlineDevices) {
  Write-Output "Android device is connected but currently offline."
  $offlineDevices | ForEach-Object { Write-Output $_ }
  Write-Output "Reconnect the USB cable or restart ADB, then run:"
  Write-Output "npm run apk:install"
  exit 1
}

if (-not $connectedDevices) {
  Write-Output "No Android device is connected."
  Write-Output "Enable Developer Options and USB debugging, connect the phone, accept the USB debugging prompt, then run:"
  Write-Output "npm run apk:install"
  exit 1
}

Write-Output "Connected Android device:"
$connectedDevices | ForEach-Object { Write-Output $_ }

& $adb install -r $resolvedApkPath
Write-Output "DoneTown installed from:"
Write-Output $resolvedApkPath
