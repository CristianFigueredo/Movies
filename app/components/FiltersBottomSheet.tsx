import React, {
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import Spacer from '../components/Spacer';
import {
  Button,
  RadioButton,
  RadioGroup,
  Slider,
  Spacings,
  Text,
} from 'react-native-ui-lib';
import {ViewStyle} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {OmdbFilter} from '../services/omdb.types';
import {capitalize} from '../utils/strings';

type Props = {
  yearFilter: number;
  filter: OmdbFilter;
  onApplyPress: (yearFilter: number, filterCandidate: OmdbFilter) => void;
};

type FilterBottomSheetHandle = {
  dismiss: () => void;
  present: () => void;
};

const noop = () => {};

export const FiltersBottomSheet = forwardRef<FilterBottomSheetHandle, Props>(
  ({yearFilter, filter, onApplyPress}, ref) => {
    const snapPoints = useMemo(() => ['41%'], []);
    const filterCandidate = useRef<OmdbFilter | null>(null);
    const [yearFilterCandidate, setYearFilterCandidate] = useState(1900);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          dismiss: bottomSheetModalRef.current?.dismiss || noop,
          present: bottomSheetModalRef.current?.present || noop,
        };
      },
      [],
    );

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        bottomInset={Spacings.s3}
        backdropComponent={renderBackdrop}
        detached={true}
        style={$sheetContainer}
        snapPoints={snapPoints}>
        <BottomSheetView style={$bottomSheet}>
          <Text text60>Type of Media</Text>
          <Spacer height={Spacings.s3} />
          <RadioGroup
            initialValue={filter}
            onValueChange={(value: OmdbFilter) => {
              filterCandidate.current = value;
            }}>
            {FILTERS.map(option => (
              <RadioButton
                key={option}
                label={capitalize(option)}
                value={option}
                style={$checkbox}
              />
            ))}
          </RadioGroup>
          <Spacer height={Spacings.s4} />
          <Text text60>
            Year ({yearFilterCandidate === 1900 ? 'All' : yearFilterCandidate})
          </Text>
          <Slider
            value={yearFilter}
            onValueChange={value => setYearFilterCandidate(value)}
            minimumValue={1900}
            maximumValue={2024}
            step={1}
          />
          <Spacer height={Spacings.s4} />
          <Button
            label="Apply"
            onPress={() => {
              onApplyPress(
                yearFilterCandidate,
                filterCandidate.current || filter,
              );
              filterCandidate.current = null;
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    enableTouchThrough={false}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
  />
);

const FILTERS: OmdbFilter[] = ['all', 'movie', 'series'];

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
