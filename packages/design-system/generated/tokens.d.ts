// Vergil Design System - Generated TypeScript Types

// Primitive token types
export interface PrimitiveTokens {
  colors: {
    purple: string;
    red: string;
    yellow: string;
    green: string;
    blue: string;
    gray: string;
    white: string;
    black: string;
    transparent: string;
    current: string;
    vergilPurple: string;
    vergilOffBlack: string;
    vergilOffWhite: string;
    cosmicPurple: string;
    electricViolet: string;
    luminousIndigo: string;
    phosphorCyan: string;
    synapticBlue: string;
    neuralPink: string;
  };
  spacing: {
    'xs': string;
    'sm': string;
    'md': string;
    'lg': string;
    'xl': string;
    '2xl': string;
    '3xl': string;
  };
  fontSize: {
    'xs': string;
    'sm': string;
    'base': string;
    'lg': string;
    'xl': string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
  borderRadius: {
    'none': string;
    'xs': string;
    'sm': string;
    'md': string;
    'lg': string;
    'xl': string;
    '2xl': string;
    'full': string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    brandSm: string;
    brandMd: string;
    brandLg: string;
    brandGlow: string;
  };
  duration: {
    instant: string;
    fast: string;
    normal: string;
    slow: string;
    slower: string;
    slowest: string;
  };
  easing: {
    out: string;
    inOut: string;
    outBack: string;
    outQuart: string;
    linear: string;
  };
  gradients: {
    consciousness: string;
    ambient: string;
    awakening: string;
    synaptic: string;
    lightRay: string;
  };
}

// Semantic token types
export interface SemanticTokens {
  colors: {
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      emphasis: string;
      inverse: string;
      brand: string;
      brandLight: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      disabled: string;
    };
    background: {
      primary: string;
      secondary: string;
      emphasis: string;
      emphasisInput: string;
      inverse: string;
      brand: string;
      brandLight: string;
      elevated: string;
      overlay: string;
      disabled: string;
      errorLight: string;
      warningLight: string;
      successLight: string;
      infoLight: string;
    };
    border: {
      default: string;
      subtle: string;
      emphasis: string;
      focus: string;
      brand: string;
      error: string;
      warning: string;
      success: string;
      info: string;
      disabled: string;
    };
  };
  shadows: {
    card: string;
    cardHover: string;
    dropdown: string;
    modal: string;
    popover: string;
    toast: string;
    brandSm: string;
    brandMd: string;
    brandLg: string;
    brandGlow: string;
    focus: string;
    focusError: string;
    focusSuccess: string;
  };
}

// Component token types
export interface ComponentTokens {
  button: {
    size: {
      sm: { height: string; paddingX: string; paddingY: string; fontSize: string; borderRadius: string; };
      md: { height: string; paddingX: string; paddingY: string; fontSize: string; borderRadius: string; };
      lg: { height: string; paddingX: string; paddingY: string; fontSize: string; borderRadius: string; };
    };
    variant: {
      primary: object;
      secondary: object;
      ghost: object;
      destructive: object;
      success: object;
    };
  };
  card: {
    variant: {
      default: object;
      interactive: object;
      neural: object;
      outlined: object;
    };
  };
  input: {
    size: {
      sm: object;
      md: object;
      lg: object;
    };
    state: {
      default: object;
      hover: object;
      focus: object;
      error: object;
      disabled: object;
    };
  };
  modal: {
    size: {
      sm: object;
      md: object;
      lg: object;
      xl: object;
      fullscreen: object;
    };
  };
  toast: {
    variant: {
      default: object;
      success: object;
      error: object;
      warning: object;
      info: object;
    };
  };
  badge: {
    size: {
      sm: object;
      md: object;
      lg: object;
    };
    variant: {
      default: object;
      primary: object;
      success: object;
      warning: object;
      error: object;
      outlined: object;
    };
  };
}

// All tokens
export interface DesignTokens {
  primitives: PrimitiveTokens;
  semantic: SemanticTokens;
  components: ComponentTokens;
}
