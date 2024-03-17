import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MovieCard} from './app/components/MovieCard';
import {SearchBar} from './app/components/SearchBar';
import Spacer from './app/components/Spacer';
import {Colors, Spacings} from 'react-native-ui-lib';
import {ViewStyle} from 'react-native';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={$container}>
      <Spacer height={Spacings.s5} />
      <SearchBar />
      <Spacer height={Spacings.s8} />
      <MovieCard
        posterURL="https://image.tmdb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
        title="The Tomorrow War"
        rating={7.4}
        overview="The world is stunned when a group of time travelers arrive from the year 2051 to deliver an urgent message: Thirty years in the future, mankind is losing a global war against a deadly alien species."
        index={0}
      />
    </GestureHandlerRootView>
  );
}

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: 10,
  backgroundColor: Colors.$backgroundNeutral,
};

export default App;
