import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
