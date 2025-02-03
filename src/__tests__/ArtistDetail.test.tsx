import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ArtistDetail } from '../pages/ArtistDetail/ArtistDetail';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const mockArtistData = {
  data: {
    id: '1',
    title: 'Pablo Picasso',
    birth_date: '1881',
    death_date: '1973',
    description: '<p>Famous Spanish artist</p>',
  },
};

const mockArtworksData = {
  data: [
    { id: '101', title: 'Guernica', image_id: 'img1' },
    { id: '102', title: 'The Old Guitarist', image_id: 'img2' },
  ],
};

describe('ArtistDetail', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/artist/1']}>
        <Routes>
          <Route path='/artist/:id' element={<ArtistDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('fetches and displays artist details', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockArtistData));
    fetchMock.mockResponseOnce(JSON.stringify(mockArtworksData));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Pablo Picasso | 1881 - 1973')
      ).toBeInTheDocument();
      expect(screen.getByText('Famous Spanish artist')).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('displays artworks', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockArtistData));
    fetchMock.mockResponseOnce(JSON.stringify(mockArtworksData));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Guernica')).toBeInTheDocument();
      expect(screen.getByText('The Old Guitarist')).toBeInTheDocument();
    });
  });

  test('handles image load errors', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockArtistData));
    fetchMock.mockResponseOnce(JSON.stringify(mockArtworksData));

    renderComponent();

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        img.dispatchEvent(new Event('error'));
      });
    });

    expect(
      screen.getAllByText('No Image Available for this image ID.').length
    ).toBe(2);
  });
});
