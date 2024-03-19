import 'react-native-gesture-handler';

import React from 'react';
import {setupReactNativeUILibraryTheme} from './app/theme/setup';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppNavigator} from './app/navigators/AppNavigator';

setupReactNativeUILibraryTheme();

const App = () => {
  return (
    <GestureHandlerRootView style={$container}>
      <BottomSheetModalProvider>
        <AppNavigator />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const $container = {flex: 1};

export default App;
