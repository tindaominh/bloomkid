import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

import { CelebrationScreen } from '../CelebrationScreen';

describe('CelebrationScreen', () => {
  it('renders a congratulations message', () => {
    const { getByTestId } = render(<CelebrationScreen />);
    expect(getByTestId('celebration-message')).toBeTruthy();
  });

  it('navigates home when Play Again is pressed', () => {
    const replaceMock = jest.fn();
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({ replace: replaceMock });
    const { getByTestId } = render(<CelebrationScreen />);
    fireEvent.press(getByTestId('play-again-btn'));
    expect(replaceMock).toHaveBeenCalledWith('/');
  });
});
