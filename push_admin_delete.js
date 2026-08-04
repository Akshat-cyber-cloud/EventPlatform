const { execSync } = require('child_process');

try {
  console.log("Staging changes...");
  execSync('git add .', { stdio: 'inherit' });

  console.log("Committing changes...");
  execSync('git commit -m "fix: robust instant event deletion and default event listing in Admin Dashboard"', { stdio: 'inherit' });

  console.log("Pushing to GitHub...");
  execSync('git push origin main', { stdio: 'inherit' });

  console.log("SUCCESSFULLY PUSHED TO GITHUB!");
} catch (err) {
  console.log("Git status:", err.message);
}
