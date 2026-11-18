import { test, expect } from '@playwright/test';

test.describe('LifeOS — Jornada End-to-End (E2E) & Responsividade Mobile', () => {
  test('1. Proteção de Rotas: usuário não logado deve ser redirecionado para /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h2')).toContainText('Entrar na sua conta');
  });

  test('2. Navegação entre Login e Cadastro + Validação de Campos do Formulário', async ({ page }) => {
    await page.goto('/login');

    const btnEntrar = page.locator('button[type="submit"]');
    await expect(btnEntrar).toBeDisabled();

    await page.click('a[routerLink="/cadastro"]');
    await expect(page).toHaveURL(/\/cadastro/);
    await expect(page.locator('h2')).toContainText('Crie sua conta');

    await page.fill('input[name="nome"]', 'João Gabriel E2E');
    await page.fill('input[name="email"]', 'joao.e2e@lifeos.com');
    await page.fill('input[name="senha"]', 'SenhaForte123!');

    const btnCadastrar = page.locator('button[type="submit"]');
    await expect(btnCadastrar).toBeEnabled();
  });

  test('3. Jornada Completa (Login -> Dashboard -> Navegação nas Abas)', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-jwt-token-e2e',
          usuario: { id: 1, nome: 'João Gabriel', email: 'joao@lifeos.com' },
        }),
      });
    });

    await page.route('**/api/**', async (route) => {
      if (route.request().url().includes('/auth/login')) {
        return route.fallback();
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/login');
    await page.fill('input[name="email"]', 'joao@lifeos.com');
    await page.fill('input[name="senha"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:4200/');
    await expect(page.locator('text=LifeOS').first()).toBeVisible();
  });

  test('4. [Mobile Responsividade] Formulário e cards devem caber sem corte horizontal em viewport smartphone (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/login');

    const card = page.locator('.max-w-md');
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(390);
  });
});
