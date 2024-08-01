Setting up a CI/CD pipeline for React Native projects using GitHub Actions for both Android and iOS involves several steps. Here's a step-by-step guide along with the necessary files, paths, and commands:

### Prerequisites

1. **React Native Project**: Ensure you have a React Native project set up.
2. **GitHub Repository**: Your project should be hosted on GitHub.
3. **GitHub Actions**: Enable GitHub Actions for your repository.

### Step 1: Create `.github/workflows` Directory

Create a directory named `.github/workflows` in the root of your project. This is where you will store your GitHub Actions workflow files.

### Step 2: Create Workflow File

Create a file named `ci.yml` inside the `.github/workflows` directory. This file will define your CI/CD pipeline.

### Step 3: Configure `ci.yml`

Here's a basic example of a GitHub Actions workflow for a React Native project:

```yaml
...
jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        platform: [ios, android]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22.3.0'

      - name: Install dependencies
        run: npm install

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set up environment for ${{ matrix.platform }}
        run: |
          if [ "${{ matrix.platform }}" == "android" ]; then
            sudo apt-get update
            sudo apt-get install -y android-sdk
            curl -s "https://get.sdkman.io" | bash
            source "$HOME/.sdkman/bin/sdkman-init.sh"
            sdk install gradle 8.0.2
            sdk install java 17.0.1-tem
          elif [ "${{ matrix.platform }}" == "ios" ]; then
            sudo gem install cocoapods
            brew install fastlane
          fi

      - name: Run tests
        run: |
          if [ "${{ matrix.platform }}" == "android" ]; then
            ./gradlew test
          elif [ "${{ matrix.platform }}" == "ios" ]; then
            xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 14,OS=17.2' test
          fi

      - name: Deploy to TestFlight
        if: matrix.platform == 'ios'
        run: |
          fastlane beta
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_ID_PASSWORD: ${{ secrets.APPLE_ID_PASSWORD }}
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
```

### Step 4: Add Secrets for iOS Deployment

For iOS, you'll need to add secrets for signing your app. Go to your GitHub repository, navigate to `Settings` > `Secrets and variables` > `Actions`, and add the following secrets:

- `APPLE_ID`: Your Apple Developer account email.
- `APPLE_ID_PASSWORD`: Your Apple Developer account password.
- `MATCH_PASSWORD`: The password for the match repository if you are using `fastlane match`.

### Step 5: Configure Fastlane for iOS

Create a `Fastfile` in the `ios/fastlane` directory with the following content:

```ruby
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    match(type: "appstore")
    build_app(scheme: "YourApp")
    upload_to_testflight
  end
end
```

### Step 6: Trigger the Workflow

Push your changes to the `main` branch or open a pull request to trigger the workflow. GitHub Actions will automatically run the pipeline based on the configuration in `ci.yml`.

This setup will ensure that your React Native project is tested and deployed for both Android and iOS using GitHub Actions. Adjust the commands and configurations based on your specific project requirements.
