import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockPlay = jest.fn().mockResolvedValue(undefined);
const mockStop = jest.fn().mockResolvedValue(undefined);

jest.mock('../../services/audio', () => ({
  AudioService: jest.fn().mockImplementation(() => ({
    play: mockPlay,
    stop: mockStop,
  })),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ category: 'animals' }),
  useRouter: () => ({ back: jest.fn() }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

import { FlashcardScreen } from '../FlashcardScreen';

const MOCK_ITEMS = [
  { word: 'cat', imageUrl: 'https://s3/cat.png', audioUrl: 'https://s3/cat.mp3' },
  { word: 'dog', imageUrl: 'https://s3/dog.png', audioUrl: 'https://s3/dog.mp3' },
];

describe('FlashcardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(MOCK_ITEMS),
    });
  });

  it('displays the first card word and image', async () => {
    const { getByTestId } = render(<FlashcardScreen />);
    await waitFor(() => {
      expect(getByTestId('flashcard-word')).toBeTruthy();
    });
    expect(getByTestId('flashcard-word').props.children).toBe('cat');
  });

  it('plays audio when card is tapped', async () => {
    const { getByTestId } = render(<FlashcardScreen />);
    await waitFor(() => getByTestId('flashcard-card'));
    fireEvent.press(getByTestId('flashcard-card'));
    expect(mockPlay).toHaveBeenCalledWith('https://s3/cat.mp3');
  });

  it('advances to next card on swipe right button press', async () => {
    const { getByTestId } = render(<FlashcardScreen />);
    await waitFor(() => getByTestId('flashcard-next'));
    fireEvent.press(getByTestId('flashcard-next'));
    await waitFor(() => {
      expect(getByTestId('flashcard-word').props.children).toBe('dog');
    });
  });

  it('shows loading indicator while fetching', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { getByTestId } = render(<FlashcardScreen />);
    expect(getByTestId('flashcard-loading')).toBeTruthy();
  });
});
