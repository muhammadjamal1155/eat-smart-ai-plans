import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageTransition from '@/components/PageTransition';

// Lazy Imports
const Index = lazy(() => import('@/pages/Index'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MealPlans = lazy(() => import('@/pages/MealPlans'));
const Insights = lazy(() => import('@/pages/Insights'));
const Analytics = lazy(() => import('@/pages/Analytics'));

const Account = lazy(() => import('@/pages/Account'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));


const NutritionForm = lazy(() => import('@/pages/NutritionForm'));
const Reminders = lazy(() => import('@/pages/Reminders'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                <Route path="/account" element={<ProtectedRoute><PageTransition><Account /></PageTransition></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/meal-plans" element={<ProtectedRoute><PageTransition><MealPlans /></PageTransition></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><PageTransition><Insights /></PageTransition></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><PageTransition><Analytics /></PageTransition></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />

                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

                <Route path="/nutrition-form" element={<ProtectedRoute><PageTransition><NutritionForm /></PageTransition></ProtectedRoute>} />
                <Route path="/reminders" element={<ProtectedRoute><PageTransition><Reminders /></PageTransition></ProtectedRoute>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
