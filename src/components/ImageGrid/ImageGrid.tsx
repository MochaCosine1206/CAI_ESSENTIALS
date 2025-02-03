import { useState } from 'react';
import { Artist } from '../../types';
import { Link } from 'react-router-dom';

export const ImageGridComponent = ({
  artist,
}: {
  artist: Artist | undefined;
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    const imgElement = e.currentTarget;
    imgElement.style.display = 'none';
  };

  return (
    <div
      data-testid='image-grid'
      className='hidden md:block flex-1 sticky top-24'
    >
      <div
        className={`grid gap-4 space-y-4 ${
          artist && artist.art_list && artist.art_list.length > 1
            ? 'grid-cols-1 xl:grid-cols-2'
            : 'grid-cols-1'
        } grid-rows-auto`}
      >
        {artist &&
          artist.art_list.map((image, index) =>
            !hasError ? (
              <div
                key={image.id + index}
                className='h-max max-w-fit rounded-lg'
              >
                <img
                  className='max-w-full max-h-[calc(100vh-8rem)] object-cover'
                  src={`https://www.artic.edu/iiif/2/${image.imageId}/full/843,/0/default.jpg`}
                  alt={`An image of ${image.title} by ${artist.artist_title}`}
                  onError={handleError}
                />
              </div>
            ) : (
              <Link
                className='cursor-pointer hover:opacity-85'
                key={image.id + index}
                to={`/artist/${artist.artist_id}`}
              >
                <div className='text-white w-auto max-w-96 h-96 bg-linear-to-r from-cyan-500 to-blue-500 p-2 rounded-lg'>
                  <h1 className='text-2xl'>No Image Available,</h1>
                  <p>Click to explore more</p>
                </div>
              </Link>
            )
          )}
      </div>
    </div>
  );
};
