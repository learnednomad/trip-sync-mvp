# Section 5: Dark Mode Implementation

## Dynamic Theme System

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  colors: {
    // Semantic colors
    primary: ColorValue;
    onPrimary: ColorValue;
    primaryContainer: ColorValue;
    onPrimaryContainer: ColorValue;
    
    // Surface colors
    surface: ColorValue;
    surfaceVariant: ColorValue;
    surfaceTint: ColorValue;
    
    // State colors
    error: ColorValue;
    warning: ColorValue;
    success: ColorValue;
  };
  
  // Elevation levels for dark mode
  elevation: {
    level0: ColorValue; // 0% white overlay
    level1: ColorValue; // 5% white overlay
    level2: ColorValue; // 8% white overlay
    level3: ColorValue; // 11% white overlay
    level4: ColorValue; // 12% white overlay
    level5: ColorValue; // 14% white overlay
  };
}

// Theme Context Implementation
const ThemeProvider: React.FC = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto');
  
  const activeTheme = useMemo(() => {
    if (themeMode === 'auto') {
      return colorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, colorScheme]);
  
  return (
    <ThemeContext.Provider value={{ theme: activeTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---
