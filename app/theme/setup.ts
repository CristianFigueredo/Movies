import {Colors, ThemeManager} from 'react-native-ui-lib';
import {STANDARD_BORDER_RADIUS} from './constants';

export const setupReactNativeUILibraryTheme = () => {
  Colors.loadDesignTokens({
    primaryColor: '#101010',
  });

  ThemeManager.setComponentTheme('Card', {
    borderRadius: STANDARD_BORDER_RADIUS,
  });

  ThemeManager.setComponentTheme('Button', {
    borderRadius: STANDARD_BORDER_RADIUS,
  });
};
