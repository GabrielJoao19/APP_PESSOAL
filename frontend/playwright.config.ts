import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright (Testes End-to-End e Mobile) para o LifeOS
 * Simula a jornada real do usuário no navegador (Desktop Chrome e Mobile Viewport)
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env['E2E_BASE_URL'] || 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile iPhone 14',
      use: { ...devices['iPhone 14'] },
    },
  ],
});
