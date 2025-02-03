import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { ArtistsScreen } from './pages/artists/Artists.tsx';
import { ArtistDetail } from './pages/ArtistDetail/ArtistDetail.tsx';
import { ArtDetail } from './pages/ArtDetail/ArtDetail.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/artists' element={<ArtistsScreen />} />
      <Route path='/artist/:id' element={<ArtistDetail />} />
      <Route path='/art/:id' element={<ArtDetail />} />
    </Routes>
  </BrowserRouter>
);
