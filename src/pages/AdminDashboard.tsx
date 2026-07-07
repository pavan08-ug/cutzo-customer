import { Routes, Route } from "react-router-dom";
import AdminGuard from "../components/admin/AdminGuard";
import AdminLayout from "../components/admin/AdminLayout";
import OverviewPage from "../components/admin/overview/OverviewPage";
import UsersPage from "../components/admin/users/UsersPage";
import ShopsPage from "../components/admin/shops/ShopsPage";
import BookingsPage from "../components/admin/bookings/BookingsPage";
import ReviewsPage from "../components/admin/reviews/ReviewsPage";
import GrowthPage from "../components/admin/analytics/GrowthPage";
import LiveOpsPage from "../components/admin/liveops/LiveOpsPage";
import OffersPage from "../components/admin/offers/OffersPage";
import NotificationsPage from "../components/admin/notifications/NotificationsPage";
import SystemHealthPage from "../components/admin/health/SystemHealthPage";
import AppConfigPage from "../components/admin/config/AppConfigPage";
import ActivityLogPage from "../components/admin/logs/ActivityLogPage";

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="shops" element={<ShopsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="analytics" element={<GrowthPage />} />
          <Route path="live" element={<LiveOpsPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="health" element={<SystemHealthPage />} />
          <Route path="config" element={<AppConfigPage />} />
          <Route path="logs" element={<ActivityLogPage />} />
          <Route path="*" element={<OverviewPage />} />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
}
