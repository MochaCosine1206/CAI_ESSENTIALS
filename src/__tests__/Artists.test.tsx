import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { ArtistsScreen } from '../pages/artists/Artists';
import { Artist } from '../types';

fetchMock.enableMocks();

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
    removeItem: (...args: string[]) => mockRemoveItem(...args),
  },
});

const mockArtistData: Artist[] = [
  {
    artist_title: 'Pablo Picasso',
    artist_id: '1',
    art_list: [{ title: 'Guernica', id: 1, imageId: 'img1' }],
  },
  {
    artist_title: 'Vincent van Gogh',
    artist_id: '2',
    art_list: [{ title: 'Starry Night', id: 2, imageId: 'img2' }],
  },
];

describe('ArtistsScreen', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
    mockGetItem.mockReturnValue(null);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ArtistsScreen />
      </MemoryRouter>
    );
  };

  describe('Initial render', () => {
    beforeEach(() => {
      renderComponent();
    });

    test('renders header content', () => {
      expect(screen.getByText('Explore the artists')).toBeInTheDocument();
      expect(
        screen.getByText('Click on an artist to explore more')
      ).toBeInTheDocument();
    });
  });

  describe('API data loading', () => {
    beforeEach(() => {
      fetchMock
        .mockResponseOnce(JSON.stringify({ pagination: { total_pages: 1 } }))
        .mockResponseOnce(JSON.stringify({ data: mockArtistData }));
      renderComponent();
    });

    test('loads and displays artists from API when localStorage is empty', async () => {
      await waitFor(() => {
        expect(screen.getByText('Pablo Picasso')).toBeInTheDocument();
        expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument();
      });

      expect(mockSetItem).toHaveBeenCalledWith(
        'artistsData',
        expect.any(String)
      );
    });
  });

  describe('LocalStorage data loading', () => {
    beforeEach(() => {
      mockGetItem.mockReturnValue(JSON.stringify(mockArtistData));
      renderComponent();
    });

    test('loads artists from localStorage if available', async () => {
      await waitFor(() => {
        expect(screen.getByText('Pablo Picasso')).toBeInTheDocument();
        expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument();
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });

    test('groups artists by first letter of last name', async () => {
      await waitFor(() => {
        expect(screen.getByText('P')).toBeInTheDocument();
        expect(screen.getByText('G')).toBeInTheDocument();
      });
    });

    test('updates ImageGridComponent on artist hover', async () => {
      await waitFor(() => {
        const artistLink = screen.getByText('Pablo Picasso');
        fireEvent.mouseOver(artistLink);
        expect(screen.getByTestId('image-grid')).toBeInTheDocument();
      });
    });
  });
});
