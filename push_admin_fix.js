const { execSync } = require('child_process');

try {
  console.log("Staging changes...");
  execSync('git add .', { stdio: 'inherit' });

  console.log("Committing changes...");
  execSync('git commit -m "fix: filter legacy test events from admin control center and ensure seamless multi-view real-time sync"', { stdio: 'inherit' });

  console.log("Pushing to GitHub...");
  execSync('git push origin main', { stdio: 'inherit' });

  console.log("SUCCESSFULLY PUSHED TO GITHUB!");
} catch (err) {
  console.log("Git sync info:", err.message);
}
