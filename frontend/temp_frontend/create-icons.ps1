Add-Type -AssemblyName System.Drawing

# First ensure assets directory exists
if (-not (Test-Path "assets")) {
    New-Item -Path "assets" -ItemType Directory
}

$sizes = @{
    "icon.png" = @(1024, 1024)
    "adaptive-icon.png" = @(1024, 1024)
    "splash.png" = @(2048, 2048)
    "favicon.png" = @(48, 48)
}

foreach ($icon in $sizes.Keys) {
    $width = $sizes[$icon][0]
    $height = $sizes[$icon][1]
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.FillRectangle([System.Drawing.Brushes]::White, 0, 0, $width, $height)
    $bmp.Save("assets/$icon", [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
}

Write-Host "Icons created successfully in the assets directory!"