const { execSync } = require('child_process');

try {
  console.log("Staging Jenkinsfile...");
  execSync('git add Jenkinsfile', { stdio: 'inherit' });

  console.log("Committing changes...");
  execSync('git commit -m "fix: update Jenkinsfile for Windows environment (bat steps)"', { stdio: 'inherit' });

  console.log("Pushing to GitHub repository...");
  execSync('git push', { stdio: 'inherit' });

  console.log("SUCCESS: Code pushed successfully!");
} catch (error) {
  console.error("Git execution error:", error.message);
}
