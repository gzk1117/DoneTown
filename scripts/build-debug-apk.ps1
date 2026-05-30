param(
  [string]$OutputDir = "dist-apk"
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
$androidRoot = Join-Path $repoRoot "android"
$toolRoot = Join-Path $env:LOCALAPPDATA "DoneTownToolchain"

function Resolve-JavaHome {
  $candidates = @(
    $env:JAVA_HOME,
    (Join-Path $toolRoot "jdk21"),
    (Join-Path $env:ProgramFiles "Android\Android Studio\jbr"),
    (Join-Path $env:ProgramFiles "Java\jdk-21")
  ) | Where-Object { $_ }

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath (Join-Path $candidate "bin\java.exe")) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }

  throw "JDK 21 not found. Install Android Studio or place JDK 21 at $toolRoot\jdk21."
}

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

  throw "Android SDK not found. Install Android SDK Platform Tools and set ANDROID_SDK_ROOT."
}

$javaHome = Resolve-JavaHome
$sdkRoot = Resolve-AndroidSdk
$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:Path = "$(Join-Path $javaHome 'bin');$(Join-Path $sdkRoot 'platform-tools');$env:Path"

$localProperties = Join-Path $androidRoot "local.properties"
$sdkDirEscaped = $sdkRoot.Replace("\", "\\")
Set-Content -LiteralPath $localProperties -Value "sdk.dir=$sdkDirEscaped" -Encoding ASCII

Push-Location $repoRoot
try {
  npm run android:sync
} finally {
  Pop-Location
}

Push-Location $androidRoot
try {
  .\gradlew.bat assembleDebug
} finally {
  Pop-Location
}

$sourceApk = Join-Path $androidRoot "app\build\outputs\apk\debug\app-debug.apk"
if (-not (Test-Path -LiteralPath $sourceApk)) {
  throw "Debug APK was not generated at $sourceApk"
}

$resolvedOutputDir = Join-Path $repoRoot $OutputDir
New-Item -ItemType Directory -Force -Path $resolvedOutputDir | Out-Null
$targetApk = Join-Path $resolvedOutputDir "DoneTown-debug.apk"
Copy-Item -LiteralPath $sourceApk -Destination $targetApk -Force

Write-Output "Debug APK created:"
Write-Output $targetApk
