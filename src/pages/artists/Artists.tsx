import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Artist, ArtworkItem } from '../../types';
import { ImageGridComponent } from '../../components/ImageGrid/ImageGrid';

interface GroupedArtists {
  letter: string;
  artists: Artist[];
}

export const ArtistsScreen = () => {
  const location = useLocation();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [artistData, setArtistData] = useState<Artist[]>(() => {
    const cached = localStorage.getItem('artistsData');
    return cached ? JSON.parse(cached) : [];
  });
  const [hoverOverArtist, setHoverOverArtist] = useState<Artist>();

  async function processArt(data: ArtworkItem[]) {
    const artistMap = data.reduce((acc: Artist[], item) => {
      const existingArtist = acc.find(
        (artist) => artist.artist_id === item.artist_id
      );

      if (existingArtist) {
        existingArtist.art_list.push({
          title: item.title || 'Untitled',
          id: item.id,
          imageId: item.image_id,
        });
      } else {
        acc.push({
          artist_title: item.artist_title || 'Unknown Artist',
          artist_id: item.artist_id,
          art_list: [
            {
              title: item.title || 'Untitled',
              id: item.id,
              imageId: item.image_id,
            },
          ],
        });
      }
      return acc;
    }, []);

    const sortedArtists = artistMap.sort((a, b) => {
      const getLastName = (fullName: string) => {
        const nameParts = fullName.split(' ');
        return nameParts.length > 1
          ? nameParts[nameParts.length - 1]
          : fullName;
      };
      const lastNameA = getLastName(a.artist_title || '');
      const lastNameB = getLastName(b.artist_title || '');

      return lastNameA.localeCompare(lastNameB);
    });

    localStorage.setItem('artistsData', JSON.stringify(sortedArtists));
    setArtistData(sortedArtists);
  }

  async function getPagination() {
    await fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=theme_id:PC-831&fields=id,title,artist_title,artist_id,image_id,date_display&limit=100`
    )
      .then((res) => res.json())
      .then((jsonObj) => {
        setTotalPages(jsonObj.pagination.total_pages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getArtists(page: number): Promise<ArtworkItem[]> {
    return fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=theme_id:PC-831&fields=id,title,artist_title,artist_id,image_id,date_display&limit=100&page=${page}`
    )
      .then((res) => res.json())
      .then((jsonObj) => {
        return jsonObj.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const groupArtistsByLetter = (artists: Artist[]): GroupedArtists[] => {
    const groupedMap = artists.reduce(
      (groups: { [key: string]: Artist[] }, artist) => {
        if (artist.artist_title && artist.artist_title !== 'Unknown Artist') {
          const name = artist.artist_title;
          const lastName = name.split(' ').pop() || name;
          const letter = lastName.charAt(0).toUpperCase();

          if (!groups[letter]) {
            groups[letter] = [];
          }
          groups[letter].push(artist);
        }
        return groups;
      },
      {}
    );
    return Object.keys(groupedMap)
      .sort()
      .map((letter) => ({
        letter,
        artists: groupedMap[letter],
      }));
  };

  const handleOnActivated = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.FocusEvent<HTMLAnchorElement>
  ) => {
    const innerText = event.currentTarget.text;
    const foundArtist = artistData.find(
      (artist) => artist.artist_title === innerText
    );
    setHoverOverArtist(foundArtist);
  };

  useEffect(() => {
    const cached = localStorage.getItem('artistsData');
    if (totalPages === 0 && !cached) {
      getPagination();
    }
    return () => {
      setHoverOverArtist(undefined);
    };
  }, [totalPages]);

  useEffect(() => {
    async function consolidateArtists() {
      let allData: ArtworkItem[] = [];
      for (let page = 1; page <= totalPages; page++) {
        const pageData = await getArtists(page);
        if (pageData && Array.isArray(pageData)) {
          allData = [...allData, ...pageData];
        }
      }
      processArt(allData);
    }
    if (totalPages > 0) {
      consolidateArtists();
    }
  }, [totalPages]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div data-testid='artists-list'>
      <div className='w-full z-10 sticky top-0 bg-black mb-2 sm:mb-8 p-4 h-24'>
        <h1 className='text-3xl font-bold text-gray-200 mb-2'>
          Explore the artists
        </h1>
        <p className='text-yellow-300'>Click on an artist to explore more</p>
      </div>
      <div className='flex flex-row justify-start items-start'>
        <div className='flex-1 flex flex-col items-center justify-center h-full w-full p-6'>
          <div className='w-full max-w-4xl'>
            {groupArtistsByLetter(artistData).map(({ letter, artists }) => (
              <div key={letter} className='mb-8'>
                <h2
                  className='text-2xl font-bold text-yellow-300 border-b-2 border-gray-200 mb-4 sticky top-24 bg-black py-2'
                  accessKey={letter.toLowerCase()}
                >
                  {letter}
                </h2>
                <ul className='flex flex-col gap-2 pl-4'>
                  {artists.map((artist) => (
                    <li key={artist.artist_id}>
                      <Link
                        to={`/artist/${artist.artist_id}`}
                        className='hover:text-yellow-300 transition-colors duration-200 ease-in-out text-gray-200'
                        onMouseOver={handleOnActivated}
                        onFocus={handleOnActivated}
                        title={`Link to detail about ${artist.artist_title}`}
                      >
                        {artist.artist_title || 'Unknown Artist'}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <ImageGridComponent
          key={hoverOverArtist?.artist_id}
          artist={hoverOverArtist}
        />
      </div>
    </div>
  );
};
