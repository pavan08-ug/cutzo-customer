# setup_cutzo_icons.ps1
# Run this script once to copy the Cutzo icon images to their correct locations.
# Usage: .\setup_cutzo_icons.ps1

$artifactsDir = "C:\Users\Omen\.gemini\antigravity-ide\brain\e6da877a-a64e-4091-8b1a-75a15cc6349f"
$publicDir = "c:\Users\Omen\Downloads\cutzo01-main (4)\cutzo01-main\public"

Write-Host "Copying Cutzo icons to public/ directory..." -ForegroundColor Cyan

# apple-touch-icon.png (180x180)
Copy-Item "$artifactsDir\cutzo_apple_touch_icon_1783083021450.png" "$publicDir\apple-touch-icon.png" -Force
Write-Host "✓ apple-touch-icon.png" -ForegroundColor Green

# pwa-192.png
Copy-Item "$artifactsDir\cutzo_pwa_192_1783083348275.png" "$publicDir\pwa-192.png" -Force
Write-Host "✓ pwa-192.png" -ForegroundColor Green

# pwa-512.png
Copy-Item "$artifactsDir\cutzo_icon_512_1783082802685.png" "$publicDir\pwa-512.png" -Force
Write-Host "✓ pwa-512.png" -ForegroundColor Green

Write-Host ""
Write-Host "Now generating favicon.ico from the SVG..." -ForegroundColor Cyan
Write-Host ""

# Use Node.js to build the ICO from PNG data
# We'll use npx sharp-cli or fall back to just copying the 32px PNG as a basic .ico
$node32pxPath = "$artifactsDir\cutzo_favicon_32_1783083002134.png"

if (Test-Path $node32pxPath) {
    # Simple approach: copy the 32px PNG as favicon.ico
    # Most modern browsers accept PNG inside .ico
    Copy-Item $node32pxPath "$publicDir\favicon.ico" -Force
    Write-Host "✓ favicon.ico (from 32px PNG)" -ForegroundColor Green
}

Write-Host ""
Write-Host "All Cutzo icons installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Check the browser tab — it should now show the Cutzo Z icon" -ForegroundColor White
