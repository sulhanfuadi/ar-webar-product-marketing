import { defineConfig, devices } from '@playwright/test';

/**
 * WebAR Browser Compatibility Testing Configuration
 *
 * Covers browser/platform matrix for the paper:
 * "Development of Interactive WebAR 3D Product Poster"
 *
 * Desktop Browsers:
 *   - Chromium (Chrome)
 *   - Firefox
 *   - WebKit (Safari equivalent)
 *   - Microsoft Edge
 *
 * Mobile Emulation (per platform):
 *   iOS:
 *     - Safari (WebKit) on iPhone 14
 *     - Chrome on iPhone 14 (via WebKit engine, iOS forces it)
 *   Android:
 *     - Chrome on Pixel 7
 *     - Samsung Internet emulation (Pixel 7 UA override)
 *     - Firefox Android emulation
 *     - Opera Android emulation
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  retries: 1,
  workers: 2,
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    // WebAR: disable real camera, inject fake getUserMedia
    permissions: [],
    launchOptions: {
      args: [
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
      ],
    },
  },

  projects: [
    // ──────────────────────────────────────────────────────────────
    // DESKTOP BROWSERS
    // ──────────────────────────────────────────────────────────────
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'Desktop Safari (WebKit)',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    // Desktop Edge: skip on macOS unless Edge is installed locally.
    // Uncomment and install via: npx playwright install msedge
    // {
    //   name: 'Desktop Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },

    // ──────────────────────────────────────────────────────────────
    // MOBILE: iOS Platform
    // ──────────────────────────────────────────────────────────────
    {
      name: 'iPhone 14 – Safari (WebKit)',
      use: {
        ...devices['iPhone 14'],
        // Default iPhone 14 device uses WebKit (Safari engine)
      },
    },
    {
      name: 'iPhone 14 – Chrome iOS (WebKit)',
      use: {
        ...devices['iPhone 14'],
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/122.0.6261.89 Mobile/15E148 Safari/604.1',
      },
    },
    {
      name: 'iPhone 14 – Firefox iOS (WebKit)',
      use: {
        ...devices['iPhone 14'],
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/122.0 Mobile/15E148 Safari/604.1',
      },
    },

    // ──────────────────────────────────────────────────────────────
    // MOBILE: Android Platform
    // ──────────────────────────────────────────────────────────────
    {
      name: 'Pixel 7 – Chrome Android',
      use: {
        ...devices['Pixel 7'],
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },
    {
      name: 'Pixel 7 – Samsung Internet',
      use: {
        ...devices['Pixel 7'],
        userAgent:
          'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },
    {
      // Firefox Android: Firefox does not support isMobile device emulation.
      // We simulate Android Firefox by using Firefox browser with a mobile UA
      // and a fixed viewport matching Pixel 7 dimensions.
      name: 'Pixel 7 – Firefox Android',
      use: {
        browserName: 'firefox',
        viewport: { width: 412, height: 915 },
        deviceScaleFactor: 2.625,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (Android 13; Mobile; rv:122.0) Gecko/122.0 Firefox/122.0',
      },
    },
    {
      name: 'Pixel 7 – Opera Android',
      use: {
        ...devices['Pixel 7'],
        userAgent:
          'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36 OPR/81.0.4244.77517',
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },
    {
      name: 'Pixel 7 – UC Browser Android',
      use: {
        ...devices['Pixel 7'],
        userAgent:
          'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 UCBrowser/13.4.0.1306 Mobile Safari/537.36',
        launchOptions: {
          args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
          ],
        },
      },
    },
  ],

  // Start the Vite preview server before running tests
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
