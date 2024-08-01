Setting up test automation for a React Native mobile application using GitHub Actions involves configuring workflows to run tests on both Android and iOS platforms. This setup will focus on running unit tests and end-to-end (E2E) tests using tools like Jest, Detox, or any other preferred testing framework.

### Step-by-Step Guide to Configure GitHub Actions for Test Automation

### Prerequisites

1. **React Native Project**: Ensure you have a React Native project set up with test scripts.
2. **GitHub Repository**: Your project should be hosted on GitHub.
3. **Testing Frameworks**: Ensure your project has testing frameworks like Jest and Detox configured.

### Step 1: Create `.github/workflows` Directory

Create a directory named `.github/workflows` in the root of your project. This is where you will store your GitHub Actions workflow files.

### Step 2: Create Workflow File

Create a file named `test-automation.yml` inside the `.github/workflows` directory. This file will define your test automation pipeline.

### Step 3: Configure `test-automation.yml`

Here's a GitHub Actions workflow configuration for running unit tests with Jest and end-to-end tests with Detox:

```yaml
name: Test Automation

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
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

      - name: Run unit tests
        run: npm test

      - name: Run Detox E2E tests for Android
        if: matrix.platform == 'android'
        run: |
          npx detox build --configuration android.emu.release
          npx detox test --configuration android.emu.release

      - name: Run Detox E2E tests for iOS
        if: matrix.platform == 'ios'
        run: |
          npx detox build --configuration ios.sim.release
          npx detox test --configuration ios.sim.release
```

### Step 4: Detox Configuration

Ensure you have Detox configured in your project. Your `package.json` should include Detox configuration:

```json
{
  "detox": {
    "configurations": {
      "android.emu.release": {
        "device": {
          "avdName": "Pixel_3a_API_30_x86"
        },
        "app": {
          "binaryPath": "android/app/build/outputs/apk/release/app-release.apk",
          "build": "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd .."
        }
      },
      "ios.sim.release": {
        "type": "ios.simulator",
        "binaryPath": "ios/build/Build/Products/Release-iphonesimulator/YourApp.app",
        "build": "xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build"
      }
    }
  }
}
```

### Step 5: Install Detox CLI and Necessary Dependencies

Ensure you have Detox CLI and other necessary dependencies installed in your project:

```sh
npm install --save-dev detox
npm install --save-dev jest
npm install --save-dev jest-circus
```

### Step 6: Add Detox Test Scripts to `package.json`

Add Detox test scripts to your `package.json`:

```json
"scripts": {
  "test": "jest",
  "detox:build:android": "detox build --configuration android.emu.release",
  "detox:test:android": "detox test --configuration android.emu.release",
  "detox:build:ios": "detox build --configuration ios.sim.release",
  "detox:test:ios": "detox test --configuration ios.sim.release"
}
```

### Step 7: Trigger the Workflow

Push your changes to the `main` branch or open a pull request to trigger the workflow. GitHub Actions will automatically run the test automation pipeline based on the configuration in `test-automation.yml`.

This setup will ensure that your React Native project undergoes automated testing for both Android and iOS using Jest for unit tests and Detox for end-to-end tests. Adjust the commands and configurations based on your specific project requirements.
