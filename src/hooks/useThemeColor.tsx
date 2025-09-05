import { useThemeConfig } from '@/lib/use-theme-config';

type ThemeProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof ReturnType<typeof useThemeConfig>['colors']
): string {
  const theme = useThemeConfig();
  const colorFromProps = props[theme.dark ? 'dark' : 'light'];
  
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme.colors[colorName];
  }
}