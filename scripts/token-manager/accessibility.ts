/**
 * Accessibility Checker for Design Tokens
 * WCAG compliance validation for color tokens
 */

import { TokenDefinition, AccessibilityInfo } from './types.js';

interface ColorValue {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export class AccessibilityChecker {
  /**
   * Calculate contrast ratio between two colors
   */
  calculateContrastRatio(foreground: string, background: string): number {
    const fg = this.parseColor(foreground);
    const bg = this.parseColor(background);
    
    if (!fg || !bg) return 0;
    
    const fgLuminance = this.getRelativeLuminance(fg);
    const bgLuminance = this.getRelativeLuminance(bg);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check WCAG compliance level for contrast ratio
   */
  getWCAGLevel(contrastRatio: number, fontSize: 'normal' | 'large' = 'normal'): 'AAA' | 'AA' | 'FAIL' {
    if (fontSize === 'large') {
      if (contrastRatio >= 4.5) return 'AAA';
      if (contrastRatio >= 3) return 'AA';
    } else {
      if (contrastRatio >= 7) return 'AAA';
      if (contrastRatio >= 4.5) return 'AA';
    }
    return 'FAIL';
  }

  /**
   * Generate accessibility information for a token
   */
  analyzeToken(token: TokenDefinition, backgroundColors: string[] = ['#ffffff', '#000000']): AccessibilityInfo {
    if (token.type !== 'color') {
      return { usage: this.inferColorUsage(token.name) };
    }

    const info: AccessibilityInfo = {
      usage: this.inferColorUsage(token.name)
    };

    // Calculate contrast ratios against common backgrounds
    const contrastResults: Array<{ bg: string; ratio: number; level: string }> = [];
    
    for (const bg of backgroundColors) {
      const ratio = this.calculateContrastRatio(token.value, bg);
      const level = this.getWCAGLevel(ratio);
      contrastResults.push({ bg, ratio, level });
    }

    // Use the best contrast ratio found
    const bestContrast = contrastResults.reduce((best, current) => 
      current.ratio > best.ratio ? current : best
    );

    info.contrastRatio = bestContrast.ratio;
    info.wcagLevel = bestContrast.level as 'AAA' | 'AA' | 'FAIL';
    info.backgroundColor = bestContrast.bg;
    info.foregroundColor = token.value;

    return info;
  }

  /**
   * Generate accessibility report for all color tokens
   */
  generateAccessibilityReport(tokens: TokenDefinition[]): {
    compliant: TokenDefinition[];
    warnings: TokenDefinition[];
    violations: TokenDefinition[];
    summary: {
      total: number;
      aaa: number;
      aa: number;
      fail: number;
    };
  } {
    const colorTokens = tokens.filter(t => t.type === 'color');
    const compliant: TokenDefinition[] = [];
    const warnings: TokenDefinition[] = [];
    const violations: TokenDefinition[] = [];

    for (const token of colorTokens) {
      if (!token.accessibility?.wcagLevel) continue;

      switch (token.accessibility.wcagLevel) {
        case 'AAA':
          compliant.push(token);
          break;
        case 'AA':
          warnings.push(token);
          break;
        case 'FAIL':
          violations.push(token);
          break;
      }
    }

    return {
      compliant,
      warnings,
      violations,
      summary: {
        total: colorTokens.length,
        aaa: compliant.length,
        aa: warnings.length,
        fail: violations.length
      }
    };
  }

  /**
   * Suggest color adjustments for better accessibility
   */
  suggestAccessibleAlternatives(color: string, targetBackground: string): {
    lighter: string;
    darker: string;
    adjustedContrast: number;
  } {
    const baseColor = this.parseColor(color);
    if (!baseColor) {
      return {
        lighter: color,
        darker: color,
        adjustedContrast: 0
      };
    }

    // Generate lighter and darker variants
    const lighter = this.adjustLightness(baseColor, 20);
    const darker = this.adjustLightness(baseColor, -20);

    const lighterContrast = this.calculateContrastRatio(this.colorToHex(lighter), targetBackground);
    const darkerContrast = this.calculateContrastRatio(this.colorToHex(darker), targetBackground);

    const bestContrast = Math.max(lighterContrast, darkerContrast);

    return {
      lighter: this.colorToHex(lighter),
      darker: this.colorToHex(darker),
      adjustedContrast: bestContrast
    };
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): ColorValue | null {
    // Remove whitespace
    color = color.trim();

    // Hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16)
        };
      } else if (hex.length === 6) {
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16)
        };
      }
    }

    // RGB/RGBA colors
    const rgbMatch = color.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)(?:\\s*,\\s*([\\d.]+))?\\s*\\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
      };
    }

    // HSL colors (basic conversion)
    const hslMatch = color.match(/hsla?\\(\\s*(\\d+)\\s*,\\s*(\\d+)%\\s*,\\s*(\\d+)%(?:\\s*,\\s*([\\d.]+))?\\s*\\)/);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]);
      const s = parseInt(hslMatch[2]) / 100;
      const l = parseInt(hslMatch[3]) / 100;
      const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;

      return { ...this.hslToRgb(h, s, l), a };
    }

    return null;
  }

  /**
   * Convert HSL to RGB
   */
  private hslToRgb(h: number, s: number, l: number): ColorValue {
    h /= 360;
    
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    if (s === 0) {
      const gray = Math.round(l * 255);
      return { r: gray, g: gray, b: gray };
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
      r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
    };
  }

  /**
   * Calculate relative luminance
   */
  private getRelativeLuminance(color: ColorValue): number {
    const normalize = (channel: number): number => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const r = normalize(color.r);
    const g = normalize(color.g);
    const b = normalize(color.b);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Adjust color lightness
   */
  private adjustLightness(color: ColorValue, adjustment: number): ColorValue {
    // Convert RGB to HSL, adjust lightness, convert back
    const { h, s, l } = this.rgbToHsl(color.r, color.g, color.b);
    const newL = Math.max(0, Math.min(100, l + adjustment));
    return this.hslToRgb(h, s / 100, newL / 100);
  }

  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * Convert color object to hex string
   */
  private colorToHex(color: ColorValue): string {
    const toHex = (c: number): string => {
      const hex = Math.round(c).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }

  /**
   * Infer appropriate usage for color tokens based on name
   */
  private inferColorUsage(name: string): string[] {
    const usage: string[] = [];

    if (name.includes('background') || name.includes('bg')) {
      usage.push('background');
    }
    if (name.includes('text') || name.includes('foreground')) {
      usage.push('text');
    }
    if (name.includes('border')) {
      usage.push('border');
    }
    if (name.includes('primary')) {
      usage.push('primary-action');
    }
    if (name.includes('error') || name.includes('danger')) {
      usage.push('error-state');
    }
    if (name.includes('success')) {
      usage.push('success-state');
    }
    if (name.includes('warning')) {
      usage.push('warning-state');
    }
    if (name.includes('info')) {
      usage.push('info-state');
    }

    return usage.length > 0 ? usage : ['general'];
  }
}