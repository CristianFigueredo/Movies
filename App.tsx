import 'react-native-gesture-handler';
import React from 'react';
import {setupReactNativeUILibraryTheme} from './app/theme/setup';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SearchScreen} from './app/screens/Search';
setupReactNativeUILibraryTheme();

const App = () => {
  return (
    <GestureHandlerRootView style={$container}>
      <BottomSheetModalProvider>
        <SearchScreen />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const $container = {flex: 1};

export default App;
