import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(['animals', 'colors', 'family']),
    });
  });

  it('renders a tile for each category', async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId('category-tile-animals')).toBeTruthy();
      expect(getByTestId('category-tile-colors')).toBeTruthy();
      expect(getByTestId('category-tile-family')).toBeTruthy();
    });
  });

  it('navigates to FlashcardScreen when a category tile is pressed', async () => {
    const pushMock = jest.fn();
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({ push: pushMock });
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => getByTestId('category-tile-animals'));
    fireEvent.press(getByTestId('category-tile-animals'));
    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: expect.stringContaining('flashcard') }),
    );
  });

  it('shows a loading indicator while categories are loading', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('home-loading')).toBeTruthy();
  });
});
