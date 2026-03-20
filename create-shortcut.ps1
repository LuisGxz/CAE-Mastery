# create-shortcut.ps1 - Crea el acceso directo en el Escritorio.
# Ejecutar una sola vez desde PowerShell:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\create-shortcut.ps1

$projectDir = "C:\Aprendizaje\Ingles\cae-mastery"
$vbsPath    = "$projectDir\launch.vbs"
$desktop    = [Environment]::GetFolderPath("Desktop")
$shortcut   = "$desktop\CAE Mastery.lnk"

$WshShell = New-Object -ComObject WScript.Shell
$link     = $WshShell.CreateShortcut($shortcut)

$link.TargetPath       = "wscript.exe"
$link.Arguments        = "`"$vbsPath`""
$link.WorkingDirectory = $projectDir
$link.Description      = "CAE Mastery - English Study App"

$chromeIcon = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$edgeIcon   = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

if (Test-Path $chromeIcon) {
    $link.IconLocation = "$chromeIcon, 0"
} elseif (Test-Path $edgeIcon) {
    $link.IconLocation = "$edgeIcon, 0"
}

$link.Save()

Write-Host "Acceso directo creado en el Escritorio: CAE Mastery" -ForegroundColor Green
Write-Host "Doble clic para abrir la app." -ForegroundColor Cyan
