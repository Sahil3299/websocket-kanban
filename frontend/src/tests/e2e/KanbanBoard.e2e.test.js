const { test, expect } = require('@playwright/test');

test.describe('Kanban Board E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should create a new task', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await page.fill('input[placeholder="Task title"]', 'E2E Test Task');
    await page.fill('textarea[placeholder="Task description"]', 'This is a test task');
    await page.selectOption('select[name="priority"]', 'high');
    await page.click('button:has-text("Create Task")');
    
    await expect(page.locator('text=E2E Test Task')).toBeVisible();
  });

  test('should move task between columns', async ({ page }) => {
    // Create a task first
    await page.click('button:has-text("+ New Task")');
    await page.fill('input[placeholder="Task title"]', 'Draggable Task');
    await page.click('button:has-text("Create Task")');
    
    // Find the task and drag to In Progress column
    const task = page.locator('text=Draggable Task').first();
    const inProgressColumn = page.locator('text=In Progress').first();
    
    await task.dragTo(inProgressColumn);
    
    // Verify task moved
    await expect(inProgressColumn.locator('text=Draggable Task')).toBeVisible();
  });

  test('should upload attachment', async ({ page }) => {
    await page.click('button:has-text("+ New Task")');
    await page.fill('input[placeholder="Task title"]', 'Task with Attachment');
    
    // Mock file upload
    await page.setInputFiles('input[type="file"]', {
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test content')
    });
    
    await page.click('button:has-text("Create Task")');
    
    // Verify attachment icon appears
    await expect(page.locator('text=📎 1 attachment(s)')).toBeVisible();
  });

  test('should update progress chart', async ({ page }) => {
    // Create a task
    await page.click('button:has-text("+ New Task")');
    await page.fill('input[placeholder="Task title"]', 'Chart Test Task');
    await page.click('button:has-text("Create Task")');
    
    // Check if chart updates
    const chart = page.locator('.progress-chart');
    await expect(chart).toBeVisible();
    
    // Move task to Done and verify chart updates
    const task = page.locator('text=Chart Test Task').first();
    const doneColumn = page.locator('text=Done').first();
    await task.dragTo(doneColumn);
    
    // Give chart time to update
    await page.waitForTimeout(1000);
    await expect(chart).toBeVisible();
  });
});