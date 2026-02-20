
Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param (
        [string]$sourcePath,
        [string]$destPath,
        [int]$maxWidth = 1000
    )
    
    try {
        $img = [System.Drawing.Image]::FromFile($sourcePath)
        $useWidth = $img.Width
        $useHeight = $img.Height
        
        if ($img.Width -gt $maxWidth) {
            $ratio = $maxWidth / $img.Width
            $useWidth = $maxWidth
            $useHeight = [int]($img.Height * $ratio)
        }
        
        $bmp = new-object System.Drawing.Bitmap($useWidth, $useHeight)
        $graph = [System.Drawing.Graphics]::FromImage($bmp)
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.DrawImage($img, 0, 0, $useWidth, $useHeight)
        
        # Save based on extension
        $ext = [System.IO.Path]::GetExtension($destPath).ToLower()
        if ($ext -eq ".jpg" -or $ext -eq ".jpeg") {
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            $myp = [System.Drawing.Imaging.Encoder]::Quality
            $ems = new-object System.Drawing.Imaging.EncoderParameters(1)
            $ems.Param[0] = new-object System.Drawing.Imaging.EncoderParameter($myp, [long]85)
            $bmp.Save($destPath, $codec, $ems)
        }
        else {
            $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        
        $img.Dispose()
        $bmp.Dispose()
        $graph.Dispose()
        Write-Host "Optimized: $sourcePath -> $destPath"
    }
    catch {
        Write-Error "Failed to optimize $sourcePath : $_"
    }
}

# Ensure directories exist
$starImagesDir = "public\star-images"
$starImagesDest = "public\star-images\optimized"
if (-not (Test-Path $starImagesDest)) {
    New-Item -ItemType Directory -Force -Path $starImagesDest | Out-Null
}

$startScreenDir = "public\start-screen"
$startScreenDest = "public\start-screen\optimized"
if (-not (Test-Path $startScreenDest)) {
    New-Item -ItemType Directory -Force -Path $startScreenDest | Out-Null
}

# Optimize Star Images
Get-ChildItem $starImagesDir -Filter *.png | ForEach-Object {
    $dest = Join-Path $starImagesDest $_.Name
    Optimize-Image -sourcePath $_.FullName -destPath $dest -maxWidth 800
}

# Optimize Start Screen Background
$bg = Join-Path $startScreenDir "background.jpg"
if (Test-Path $bg) {
    $dest = Join-Path $startScreenDest "background.jpg"
    Optimize-Image -sourcePath $bg -destPath $dest -maxWidth 1200
}

Write-Host "Optimization Complete!"
