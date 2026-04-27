import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryTile } from '../CategoryTile';

describe('CategoryTile', () => {
  it('renders the category label', () => {
    const { getByText } = render(
      <CategoryTile category="animals" onPress={jest.fn()} />,
    );
    expect(getByText('animals')).toBeTruthy();
  });

  it('calls onPress with category when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <CategoryTile category="animals" onPress={onPress} />,
    );
    fireEvent.press(getByTestId('category-tile-animals'));
    expect(onPress).toHaveBeenCalledWith('animals');
  });

  it('has a touch target of at least 44px', () => {
    const { getByTestId } = render(
      <CategoryTile category="colors" onPress={jest.fn()} />,
    );
    const tile = getByTestId('category-tile-colors');
    const style = tile.props.style;
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(flatStyle.minHeight ?? flatStyle.height).toBeGreaterThanOrEqual(44);
  });
});
