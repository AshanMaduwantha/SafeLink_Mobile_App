# ci automation script runs after Xcode Cloud clones the main repository
# It installs CocoaPods dependencies needed for the build

set -e  # Exit on any error

echo "Setting up Node.js environment..."

# Install Node.js if not available
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing via Homebrew..."
    brew install node
fi

# Set NODE_BINARY for React Native
export NODE_BINARY=$(command -v node)
echo "Node.js location: $NODE_BINARY"
echo "Node.js version: $(node --version)"

echo "Installing JavaScript dependencies..."

# Navigate to project root and install dependencies
cd "$CI_PRIMARY_REPOSITORY_PATH" || cd ..

# Check if yarn.lock exists (indicating project uses Yarn)
if [ -f "yarn.lock" ]; then
    echo "Installing with Yarn..."
    npm install -g yarn
    yarn install --frozen-lockfile || yarn install
else
    echo "Installing with npm..."
    npm install --legacy-peer-deps
fi

echo "Installing CocoaPods dependencies..."

# Navigate to the ios directory
cd "$CI_PRIMARY_REPOSITORY_PATH/ios" || cd ios

# Check if Podfile exists
if [ ! -f "Podfile" ]; then
    echo "Error: Podfile not found!"
    exit 1
fi

# Install or update CocoaPods
echo "Checking CocoaPods installation..."
if ! command -v pod &> /dev/null; then
    echo "Installing CocoaPods..."
    sudo gem install cocoapods
else
    echo "CocoaPods is already installed"
fi

# Install pods
echo "Running pod install..."
pod install --repo-update

echo "CocoaPods installation completed successfully!"

