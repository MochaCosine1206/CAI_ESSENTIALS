import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArtistDetailAgent, ArtworkItem } from '../../types';

export const ArtistDetail = () => {
  const { id } = useParams();
  const [artistData, setArtistData] = useState<ArtistDetailAgent>();
  const [artData, setArtData] = useState<ArtworkItem[]>();
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  async function fetchArtistDetail(id: string) {
    await fetch(`https://api.artic.edu/api/v1/artists/${id}`)
      .then((res) => res.json())
      .then((jsonObj) => setArtistData(jsonObj.data));
  }

  async function fetchArtItems(id: string) {
    await fetch(
      `https://api.artic.edu/api/v1/artworks/search?query[term][artist_id]=${id}&fields=image_id,title,id&limit=50`
    )
      .then((res) => res.json())
      .then((jsonObj) => setArtData(jsonObj.data));
  }

  const handleError =
    (artId: string) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setErrorImages((prev) => new Set([...prev, artId]));
      const imgElement = e.currentTarget;
      imgElement.style.display = 'none';
    };

  useEffect(() => {
    if (id) {
      fetchArtistDetail(id);
      fetchArtItems(id);
    }
  }, [id]);

  return (
    <div className='p-2'>
      {artistData && (
        <div className='sticky top-0 h-auto mb-6 p-6 border-b-2 border-gray-200 bg-black'>
          <h1 className='text-gray-200 text-4xl mb-2'>
            {artistData && artistData.title} {artistData.birth_date && '|'}{' '}
            {artistData.birth_date}
            {artistData.death_date ? ` - ${artistData.death_date}` : ''}
          </h1>
          <Link
            className='text-gray-200 hover:text-yellow-300 transition-colors mb-2'
            to='/artists'
            data-testid='back-to-artist-list-button'
          >
            Back to Artists
          </Link>
          {artistData.description && (
            <p
              className='text-gray-200 mb-2'
              dangerouslySetInnerHTML={{ __html: artistData.description }}
            ></p>
          )}
        </div>
      )}
      {artData && artData.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 grid-rows-max gap-6 p-6'>
          {artData.map((art, index) =>
            !errorImages.has(art.id.toString()) ? (
              <div
                key={art.id + index}
                className='flex flex-col justify-end items-start'
              >
                <Link to={`/art/${art.id}`}>
                  <img
                    className='h-auto w-auto rounded-lg'
                    alt={art.title}
                    src={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                    onError={handleError(art.id.toString())}
                  />
                </Link>
                <p className='text-gray-200'>
                  {art.title || 'No description available'}
                </p>
              </div>
            ) : (
              <div
                key={art.id + index}
                className='flex flex-col justify-end items-start'
              >
                <div className='text-white w-auto max-w-96 h-96 bg-linear-to-r from-cyan-500 to-blue-500 p-2 rounded-lg'>
                  <h1 className='text-2xl'>
                    No Image Available for this image ID.
                  </h1>
                </div>
                <p className='text-gray-200'>No description available</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
