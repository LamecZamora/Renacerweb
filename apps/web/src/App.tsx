import { lazy, Suspense, type ReactElement } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import { Skeleton } from './components/ui';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Learning = lazy(() => import('./pages/Learning'));
const Career = lazy(() => import('./pages/Career'));
const Interview = lazy(() => import('./pages/Interview'));
const CV = lazy(() => import('./pages/CV'));
const GitHub = lazy(() => import('./pages/GitHub'));
const Characters = lazy(() => import('./pages/Characters'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Fitness = lazy(() => import('./pages/Fitness'));
const English = lazy(() => import('./pages/English'));
const Projects = lazy(() => import('./pages/Projects'));
const Roblox = lazy(() => import('./pages/Roblox'));
const Journal = lazy(() => import('./pages/Journal'));
const Reading = lazy(() => import('./pages/Reading'));
const Finance = lazy(() => import('./pages/Finance'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

const Loading = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3.5">
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-72" />
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-56 rounded-2xl" />
    </div>
  </div>
);
const wrap = (el: ReactElement) => <Suspense fallback={<Loading />}>{el}</Suspense>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: wrap(<Dashboard />) },
      { path: 'learning', element: wrap(<Learning />) },
      { path: 'career', element: wrap(<Career />) },
      { path: 'interview', element: wrap(<Interview />) },
      { path: 'cv', element: wrap(<CV />) },
      { path: 'github', element: wrap(<GitHub />) },
      { path: 'characters', element: wrap(<Characters />) },
      { path: 'achievements', element: wrap(<Achievements />) },
      { path: 'fitness', element: wrap(<Fitness />) },
      { path: 'english', element: wrap(<English />) },
      { path: 'projects', element: wrap(<Projects />) },
      { path: 'roblox', element: wrap(<Roblox />) },
      { path: 'journal', element: wrap(<Journal />) },
      { path: 'reading', element: wrap(<Reading />) },
      { path: 'finance', element: wrap(<Finance />) },
      { path: 'reports', element: wrap(<Reports />) },
      { path: 'settings', element: wrap(<Settings />) },
    ],
  },
], {
  future: { v7_relativeSplatPath: true },
});

export default function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
