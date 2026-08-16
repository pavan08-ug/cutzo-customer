const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Check if sharp is installed, it is common in Vite/React projects
  const sharp = require('sharp');
  
  sharp('assets/icon-foreground.png')
    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    // Turn all non-transparent pixels to white
    .linear(0, 255) // This makes everything white but preserves alpha
    .toFile('android/app/src/main/res/drawable/ic_stat_name.png')
    .then(() => {
       console.log("Successfully generated ic_stat_name.png using sharp");
    })
    .catch(err => {
       console.error("Sharp failed:", err);
    });

} catch (e) {
  console.log("Sharp not available, please use a different method.");
}
