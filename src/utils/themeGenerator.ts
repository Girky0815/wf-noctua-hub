import {
  argbFromHex,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  TonalPalette,
  DynamicScheme
} from '@material/material-color-utilities';

// Type definition for CSS variables map
export type ThemeVariables = Record<string, string>;

/**
 * Generates CSS variables for a Material 3 theme based on a seed color.
 * Uses SchemeTonalSpot for natural color generation specifically avoiding SchemeExpressive.
 * 
 * @param seedColor Hex color string (e.g. "#00FF00")
 * @param mode 'light' | 'dark' | 'black'
 * @returns Map of CSS variable names to Hex color values
 */
export const generateTheme = (
  seedColor: string,
  mode: 'light' | 'dark' | 'black'
): ThemeVariables => {
  let sourceColorInt: number;
  try {
    sourceColorInt = argbFromHex(seedColor);
  } catch (e) {
    // Fallback to a safe green if invalid hex
    sourceColorInt = argbFromHex('#286A56');
  }

  const isDark = mode !== 'light';
  const hct = Hct.fromInt(sourceColorInt);

  // Use SchemeTonalSpot for accurate M3 color generation
  // 3rd argument is contrastLevel (0.0 is standard)
  const scheme = new SchemeTonalSpot(hct, isDark, 0.0);

  const variables: ThemeVariables = {};

  // Helper to convert ARGB to Hex and set to variable
  const set = (name: string, argb: number) => {
    variables[`--color-${name}`] = hexFromArgb(argb);
  };

  // Map Scheme colors to CSS variables matching tailwind.config / index.css
  set('primary', scheme.primary);
  set('on-primary', scheme.onPrimary);
  set('primary-container', scheme.primaryContainer);
  set('on-primary-container', scheme.onPrimaryContainer);
  set('inverse-primary', scheme.inversePrimary);

  set('secondary', scheme.secondary);
  set('on-secondary', scheme.onSecondary);
  set('secondary-container', scheme.secondaryContainer);
  set('on-secondary-container', scheme.onSecondaryContainer);

  set('tertiary', scheme.tertiary);
  set('on-tertiary', scheme.onTertiary);
  set('tertiary-container', scheme.tertiaryContainer);
  set('on-tertiary-container', scheme.onTertiaryContainer);

  set('error', scheme.error);
  set('on-error', scheme.onError);
  set('error-container', scheme.errorContainer);
  set('on-error-container', scheme.onErrorContainer);

  set('background', scheme.background);
  set('on-background', scheme.onBackground);

  set('surface', scheme.surface);
  set('on-surface', scheme.onSurface);
  set('surface-variant', scheme.surfaceVariant);
  set('on-surface-variant', scheme.onSurfaceVariant);
  set('inverse-surface', scheme.inverseSurface);
  set('inverse-on-surface', scheme.inverseOnSurface);

  set('outline', scheme.outline);
  set('outline-variant', scheme.outlineVariant);
  set('scrim', scheme.scrim);

  // Surface Containers (M3)
  // Material Color Utilities Scheme object doesn't directly expose all surface container roles in older versions,
  // but TonalSpot/DynamicScheme holds the palettes.
  // We can access palettes to generate surface tokens accurately if they are missing from strict properties.
  // However, SchemeTonalSpot properties list usually includes them in recent versions.
  // Let's check strict type availability or fall back to palette.

  // Note: @material/material-color-utilities types might vary. 
  // If scheme.surfaceContainer is available we use it. 
  // Otherwise we manually derive from neutral palette.
  // Standard mapping for Dark mode:
  // Surface Container Lowest: Neutral 4
  // Surface Container Low: Neutral 10
  // Surface Container: Neutral 12
  // Surface Container High: Neutral 17
  // Surface Container Highest: Neutral 22

  // Standard mapping for Light mode:
  // Surface Container Lowest: Neutral 100
  // Surface Container Low: Neutral 96
  // Surface Container: Neutral 94
  // Surface Container High: Neutral 92
  // Surface Container Highest: Neutral 90

  const n = scheme.neutralPalette;

  if (isDark) {
    set('surface-container-lowest', n.tone(4));
    set('surface-container-low', n.tone(10));
    set('surface-container', n.tone(12));
    set('surface-container-high', n.tone(17));
    set('surface-container-highest', n.tone(22));
    set('surface-dim', n.tone(6));
    set('surface-bright', n.tone(24));
  } else {
    set('surface-container-lowest', n.tone(100));
    set('surface-container-low', n.tone(96));
    set('surface-container', n.tone(94));
    set('surface-container-high', n.tone(92));
    set('surface-container-highest', n.tone(90));
    set('surface-dim', n.tone(87));
    set('surface-bright', n.tone(98));
  }

  // Handle 'Black' mode overrides overrides (OLED friendly)
  if (mode === 'black') {
    const black = '#000000';
    variables['--color-background'] = black;
    variables['--color-surface'] = black;
    variables['--color-surface-container-lowest'] = black;
    variables['--color-surface-container-low'] = black;
    variables['--color-surface-container'] = black;
    variables['--color-surface-container-high'] = black;
    variables['--color-surface-container-highest'] = black;
    variables['--color-surface-dim'] = black;
    variables['--color-surface-bright'] = black;
    variables['--color-scrim'] = black;
  }

  return variables;
};
