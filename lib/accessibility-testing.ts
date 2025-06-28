/**
 * Accessibility Testing Utilities
 * Provides functions to test and validate accessibility features
 */

interface A11yTestResult {
  passed: boolean;
  issues: string[];
  warnings: string[];
}

/**
 * Test color contrast ratio between two colors
 */
export function testColorContrast(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA"
): boolean {
  // Convert hex to RGB
  const getRGB = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = getRGB(foreground);
  const bg = getRGB(background);
  
  if (!fg || !bg) return false;

  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  // WCAG AAA requires 7:1 for normal text, 4.5:1 for large text
  const threshold = level === "AA" ? 4.5 : 7;
  return contrast >= threshold;
}

/**
 * Test keyboard navigation
 */
export function testKeyboardNavigation(): A11yTestResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check for keyboard traps
  const interactiveElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const tabIndexes = Array.from(interactiveElements)
    .map((el) => parseInt(el.getAttribute("tabindex") || "0"))
    .filter((index) => index > 0);

  if (tabIndexes.length > 0) {
    warnings.push(
      `Found ${tabIndexes.length} elements with positive tabindex. Consider using tabindex="0" for natural tab order.`
    );
  }

  // Check for focus indicators
  const elementsWithoutFocusStyle = Array.from(interactiveElements).filter(
    (el) => {
      const styles = window.getComputedStyle(el as Element);
      const focusStyles = window.getComputedStyle(el as Element, ":focus");
      return (
        styles.outline === focusStyles.outline &&
        styles.border === focusStyles.border &&
        styles.boxShadow === focusStyles.boxShadow
      );
    }
  );

  if (elementsWithoutFocusStyle.length > 0) {
    issues.push(
      `${elementsWithoutFocusStyle.length} interactive elements lack visible focus indicators`
    );
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

/**
 * Test ARIA implementation
 */
export function testARIA(): A11yTestResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check for missing labels
  const inputsWithoutLabels = document.querySelectorAll(
    'input:not([aria-label]):not([aria-labelledby]):not([id]), select:not([aria-label]):not([aria-labelledby]):not([id]), textarea:not([aria-label]):not([aria-labelledby]):not([id])'
  );

  inputsWithoutLabels.forEach((input) => {
    const label = (input as HTMLElement).closest("label");
    if (!label) {
      issues.push(
        `Input element missing label: ${(input as HTMLElement).outerHTML.substring(0, 50)}...`
      );
    }
  });

  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images missing alt text`);
  }

  // Check for proper heading hierarchy
  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);
    if (level > lastLevel + 1) {
      warnings.push(
        `Heading hierarchy issue: h${level} follows h${lastLevel}`
      );
    }
    lastLevel = level;
  });

  // Check for empty buttons
  const emptyButtons = document.querySelectorAll(
    'button:empty:not([aria-label]), a:empty:not([aria-label])'
  );
  if (emptyButtons.length > 0) {
    issues.push(`${emptyButtons.length} buttons/links have no accessible text`);
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

/**
 * Test form accessibility
 */
export function testFormAccessibility(form: HTMLFormElement): A11yTestResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  const requiredInputs = form.querySelectorAll("[required]");
  requiredInputs.forEach((input) => {
    const label = form.querySelector(`label[for="${input.id}"]`);
    if (label && !label.textContent?.includes("*")) {
      warnings.push(
        `Required field "${input.id}" not visually indicated in label`
      );
    }
  });

  // Check error messages association
  const inputsWithErrors = form.querySelectorAll("[aria-invalid='true']");
  inputsWithErrors.forEach((input) => {
    if (!input.getAttribute("aria-describedby")) {
      issues.push(
        `Input with error missing aria-describedby: ${input.id || "unnamed"}`
      );
    }
  });

  // Check fieldset/legend for radio groups
  const radioGroups = new Set<string>();
  form.querySelectorAll('input[type="radio"]').forEach((radio) => {
    const name = (radio as HTMLInputElement).name;
    if (name) radioGroups.add(name);
  });

  radioGroups.forEach((groupName) => {
    const firstRadio = form.querySelector(`input[type="radio"][name="${groupName}"]`);
    const fieldset = firstRadio?.closest("fieldset");
    if (!fieldset || !fieldset.querySelector("legend")) {
      warnings.push(
        `Radio group "${groupName}" should be wrapped in fieldset with legend`
      );
    }
  });

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

/**
 * Run all accessibility tests
 */
export function runA11yTests(): A11yTestResult {
  const results: A11yTestResult[] = [
    testKeyboardNavigation(),
    testARIA(),
  ];

  // Test all forms
  document.querySelectorAll("form").forEach((form) => {
    results.push(testFormAccessibility(form as HTMLFormElement));
  });

  // Combine results
  const allIssues = results.flatMap((r) => r.issues);
  const allWarnings = results.flatMap((r) => r.warnings);

  console.group("Accessibility Test Results");
  console.log(`✅ Passed: ${allIssues.length === 0}`);
  
  if (allIssues.length > 0) {
    console.group("❌ Issues");
    allIssues.forEach((issue) => console.error(issue));
    console.groupEnd();
  }
  
  if (allWarnings.length > 0) {
    console.group("⚠️ Warnings");
    allWarnings.forEach((warning) => console.warn(warning));
    console.groupEnd();
  }
  
  console.groupEnd();

  return {
    passed: allIssues.length === 0,
    issues: allIssues,
    warnings: allWarnings,
  };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  const liveRegion = document.getElementById("live-region");
  if (liveRegion) {
    liveRegion.setAttribute("aria-live", priority);
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = "";
    }, 1000);
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Get focus trap elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll(focusableSelectors));
}