import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ImageDataType } from '../../types';
export const ArtDetail = () => {
  const { id } = useParams();
  const [imageData, setImageData] = useState<ImageDataType>();
  const [imageLoadError, setImageLoadError] = useState(false);
  const navigate = useNavigate();

  async function fetchImageDetail(id: string) {
    await fetch(
      `https://api.artic.edu/api/v1/artworks/${id}?fields=title,image_id,medium_display,thumbnail,artist_display,short_description,description`
    )
      .then((res) => res.json())
      .then((jsonObj) => setImageData(jsonObj.data));
  }

  useEffect(() => {
    if (id) {
      fetchImageDetail(id);
    }
  }, [id]);

  return (
    <div>
      <div className='sticky top-0 h-auto mb-0 p-6 border-b-2 border-gray-200 bg-black'>
        <button
          className='text-gray-200 hover:text-yellow-300 transition-colors mb-2'
          onClick={() => navigate(-1)}
          data-testid='back-to-artist-button'
        >
          Back to artist detail
        </button>
      </div>
      {imageData && (
        <div className='h-full flex flex-col items-center justify-center gap-4 p-12'>
          <h1 className='text-gray-200 font-semibold sm:text-2xl italic'>
            {imageData.title} by {imageData.artist_display}
          </h1>
          {!imageLoadError ? (
            <img
              className='rounded-lg max-h-full'
              alt={imageData.title}
              src={`https://www.artic.edu/iiif/2/${imageData.image_id}/full/843,/0/default.jpg`}
              onError={() => setImageLoadError(true)}
            />
          ) : (
            <div className='bg-linear-to-r from-cyan-500 to-blue-500 p-2 rounded-lg flex flex-col justify-center items-center'>
              <p className='text-white'>Woops! This image isn't available</p>
              <Link className='text-white' to={'/artists'}>
                back to the artists page
              </Link>
            </div>
          )}
          {imageData.description && (
            <p
              className='text-gray-200 my-2'
              dangerouslySetInnerHTML={{ __html: imageData.description }}
            ></p>
          )}
          {imageData.medium_display && (
            <p className='text-gray-200 italic'>{imageData.medium_display}</p>
          )}
        </div>
      )}
    </div>
  );
};
