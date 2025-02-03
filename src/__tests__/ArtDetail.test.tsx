import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ArtDetail } from '../pages/ArtDetail/ArtDetail';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const mockArtworkData = {
  data: {
    id: '1',
    title: 'Guernica',
    artist_display: 'Pablo Picasso',
    image_id: 'img1',
    description: '<p>A powerful anti-war painting</p>',
    medium_display: 'Oil on canvas',
  },
};

describe('ArtDetail', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    mockedNavigate.mockReset();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/art/1']}>
        <Routes>
          <Route path='/art/:id' element={<ArtDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('fetches and displays artwork details', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockArtworkData));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Guernica by Pablo Picasso')).toBeInTheDocument();
      expect(
        screen.getByText('A powerful anti-war painting')
      ).toBeInTheDocument();
      expect(screen.getByText('Oil on canvas')).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('displays image', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockArtworkData));

    renderComponent();

    await waitFor(() => {
      const image = screen.getByAltText('Guernica');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        'https://www.artic.edu/iiif/2/img1/full/843,/0/default.jpg'
      );
    });
  });

  test('handles image load error', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockArtworkData));

    renderComponent();

    await waitFor(() => {
      const image = screen.getByAltText('Guernica');
      fireEvent.error(image);
    });

    expect(
      screen.getByText("Woops! This image isn't available")
    ).toBeInTheDocument();
    expect(screen.getByText('back to the artists page')).toBeInTheDocument();
  });

  test('navigates back when back button is clicked', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockArtworkData));
    renderComponent();

    const backButton = screen.getByTestId('back-to-artist-button');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});
