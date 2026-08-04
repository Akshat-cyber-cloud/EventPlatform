const { execSync } = require('child_process');

try {
  console.log("Adding Jenkinsfile...");
  execSync('git add Jenkinsfile', { stdio: 'inherit' });

  console.log("Committing Jenkinsfile...");
  execSync('git commit -m "fix: update Jenkinsfile for Windows environment (bat steps)"', { stdio: 'inherit' });

  console.log("Pushing to GitHub...");
  execSync('git push origin main', { stdio: 'inherit' });

  console.log("SUCCESSFULLY PUSHED TO GITHUB!");
} catch (err) {
  console.log("Git sync state:", err.message);
}
