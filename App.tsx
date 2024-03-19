import 'react-native-gesture-handler';

import React from 'react';
import {setupReactNativeUILibraryTheme} from './app/theme/setup';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SearchScreen} from './app/screens/Search';
import {NavigationContainer} from '@react-navigation/native';

setupReactNativeUILibraryTheme();

const App = () => {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={$container}>
        <BottomSheetModalProvider>
          <SearchScreen />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

const $container = {flex: 1};

export default App;
