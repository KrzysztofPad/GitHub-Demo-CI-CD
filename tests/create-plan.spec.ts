import { test, expect } from '@playwright/test';
import { hasCredentials, login } from './helpers/auth';
import { createOneLegTruckPlan, yesterdayAt9am, plusDaysAfterYesterdayAt9am } from './helpers/plan';

test('creates a one-leg truck plan: Houston TX to Kansas City MO with verified details', async ({ page }) => {
  test.skip(!hasCredentials, 'Set GRI_USERNAME and GRI_PASSWORD in .env');
  // Login + the multi-step plan wizard is slow, more so under parallel projects.
  test.setTimeout(180_000);

  const origin = 'Houston, TX';
  const destination = 'Kansas City, MO';
  const tripId = 'QA-AUTO One Leg Test';
  const departureDate = yesterdayAt9am();
  const arrivalDate = plusDaysAfterYesterdayAt9am(1);

  console.log(`Creating plan "${tripId}": ${origin} → ${destination}`);
  console.log(`Departure: ${departureDate}, Arrival: ${arrivalDate}`);

  await login(page);
  await createOneLegTruckPlan(page, { tripId, origin, destination });

  // Verify saved plan details
  await expect(page.locator('body')).toContainText('Houston');
  await expect(page.locator('body')).toContainText('Kansas City');
  await expect(page.locator('body')).toContainText(departureDate.split(' ')[0]); // date part: MM/DD/YYYY
  await expect(page.locator('body')).toContainText(arrivalDate.split(' ')[0]); // arrival date
  await expect(page.locator('body')).toContainText('1 day 6 hours'); // travel time
  await expect(page.locator('body')).toContainText(/1 day 6 hours\s*\/\s*791 miles/); // distance

  const path = `out/created-plan-${test.info().project.name}.png`;
  await page.screenshot({ path, fullPage: true });
  await test.info().attach('created-plan', { path, contentType: 'image/png' });
});
