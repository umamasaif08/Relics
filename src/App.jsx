import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './favourites/FavoritesContext';
import { ArtifactsProvider } from './context/ArtifactsContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './favourites/FavoritesPage';
import ComparePage from './pages/ComparePage';
import TimelinePage from './pages/TimelinePage';

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <ArtifactsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="artifact/:id" element={<DetailPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="compare" element={<ComparePage />} />
                <Route path="timeline" element={<TimelinePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ArtifactsProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
