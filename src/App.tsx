import { Navigate, Route, Routes } from 'react-router-dom';
import { ScanPage } from './pages/ScanPage';
import { routes } from './content/appContent';

export default function App() {
  return (
    <Routes>
      <Route path={routes.root} element={<Navigate to={routes.scan} replace />} />
      <Route path={routes.scan} element={<ScanPage />} />
      <Route path="*" element={<Navigate to={routes.scan} replace />} />
    </Routes>
  );
}
