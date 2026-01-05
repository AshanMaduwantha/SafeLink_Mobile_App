# ci_pre_xcodebuild.sh
# This script runs before Xcode Cloud starts the build
# It sets up the environment and verifies dependencies

set -e  # Exit on any error

echo "Pre-build setup starting..."

# Verify node is available
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    echo "Node.js version: $(node --version)"
else
    echo "Warning: Node.js not found"
fi

# Verify npm/yarn is available
if command -v yarn &> /dev/null; then
    echo "Yarn version: $(yarn --version)"
elif command -v npm &> /dev/null; then
    echo "npm version: $(npm --version)"
fi

# Navigate to project root
cd "$CI_PRIMARY_REPOSITORY_PATH" || cd ..

# Install JavaScript dependencies
if [ -f "package.json" ]; then
    echo "Installing JavaScript dependencies..."
    if command -v yarn &> /dev/null; then
        yarn install --frozen-lockfile || yarn install
    else
        npm ci || npm install
    fi
    echo "JavaScript dependencies installed"
fi

# Verify Pods directory exists
cd ios
if [ -d "Pods" ]; then
    echo "Pods directory exists"
else
    echo "Warning: Pods directory not found. This should have been created by ci_post_clone.sh"
fi

# Verify key pod files exist
if [ -f "Pods/Target Support Files/Pods-studiomate/Pods-studiomate.release.xcconfig" ]; then
    echo "Pod configuration files verified"
else
    echo "Error: Pod configuration files missing!"
    exit 1
fi

echo "Pre-build setup completed successfully!"

