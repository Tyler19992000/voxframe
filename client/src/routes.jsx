import React from 'react';
import { Navigate } from 'react-router-dom';
import RootLayout from './RootLayout';
import { ProtectedRoute, PublicOnlyRoute } from './guards';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';
import Account from './pages/Account';
import Pricing from './pages/Pricing';
import Landing from './pages/Landing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Route tree consumed by vite-react-ssg's ViteReactSSG(). Only "/" is
// prerendered at build time (see ssgOptions.includedRoutes in vite.config.js) —
// every other route still resolves purely client-side, exactly as before.
export const routes = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Landing },
      { path: 'pricing', Component: Pricing },
      { path: 'privacy', Component: PrivacyPolicy },
      { path: 'terms', Component: Terms },
      { path: 'blog', Component: Blog },
      { path: 'blog/:slug', Component: BlogPost },
      {
        path: 'login',
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'signup',
        element: (
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'project/:id',
        element: (
          <ProtectedRoute>
            <Layout>
              <ProjectPage />
            </Layout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <Layout>
              <Account />
            </Layout>
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];
