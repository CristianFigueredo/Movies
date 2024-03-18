import 'react-native-gesture-handler';
import React, {useCallback, useMemo, useRef} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MovieCard} from './app/components/MovieCard';
import {SearchBar} from './app/components/SearchBar';
import Spacer from './app/components/Spacer';
import {Button, Checkbox, Colors, Spacings, Text} from 'react-native-ui-lib';
import {Keyboard, ViewStyle} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

function App(): React.JSX.Element {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['35%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <GestureHandlerRootView style={$container}>
      <BottomSheetModalProvider>
        <Spacer height={Spacings.s5} />
        <SearchBar onFilterPress={handlePresentModalPress} />
        <Spacer height={Spacings.s6} />
        <MovieCard
          posterURL="https://image.tmdb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
          title="The Tomorrow War"
          rating={7.4}
          overview="The world is stunned when a group of time travelers arrive from the year 2051 to deliver an urgent message: Thirty years in the future, mankind is losing a global war against a deadly alien species."
          index={0}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          bottomInset={Spacings.s3}
          backdropComponent={renderBackdrop}
          detached={true}
          style={$sheetContainer}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}>
          <BottomSheetView style={$bottomSheet}>
            <Text text60>Type of content</Text>
            <Spacer height={Spacings.s3} />
            <Checkbox style={$checkbox} label="All" value={true} />
            <Checkbox style={$checkbox} label="Movies" value={true} />
            <Checkbox style={$checkbox} label="Series" value={false} />
            <Checkbox style={$checkbox} label="Episodes" value={false} />
            <Spacer height={Spacings.s4} />
            <Button
              label="Apply"
              onPress={() => bottomSheetModalRef.current?.dismiss()}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: 10,
  backgroundColor: Colors.$backgroundNeutral,
};

const $bottomSheet: ViewStyle = {
  flex: 1,
  padding: Spacings.s4,
};

const $sheetContainer: ViewStyle = {
  marginHorizontal: Spacings.s3,
};

const $checkbox: ViewStyle = {
  marginBottom: Spacings.s1,
};
export default App;
