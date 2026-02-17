# Build
npm run build

# Navigate to build output directory
cd dist

# Initialize a new git repo
git init
git config user.email "deploy@example.com"
git config user.name "Deploy Script"
git checkout -b gh-pages

# Add all files
git add -A
git commit -m "Deploy"

# Push to gh-pages branch
# Note: Using the full URL to avoid configuring remote
echo "Pushing to GitHub..."
git push -f https://github.com/kiyggffyjgj11-stack/todolist.git gh-pages

cd ..
echo "Deployment complete!"
