import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from "./guards/authGuard";

const IndexComponent = () => import('@/views/customer/IndexComponent.vue');
const CreateEvent = () => import('@/views/organizer/CreateEvent.vue');
const ExportFile = () => import('@/views/organizer/ExportFile.vue');
const LegalDocument = () => import('@/views/organizer/LegalDocument.vue');
const Pending = () => import('@/views/organizer/Pending.vue');
const Events = () => import('@/views/organizer/Events.vue');
const EventSearchPage = () => import('@/views/customer/EventSearchPage.vue');
const EventDetail = () => import('@/views/customer/EventDetail.vue');
const Dashboard = () => import('@/views/admin/Dashboard.vue');
const AdminLayout = () => import('@/components/admin/layouts/AdminLayout.vue');
const ApproveEvent = () => import('@/views/admin/ApproveEvent.vue');
const Order = () => import('@/views/admin/Order.vue');
const Organizer = () => import('@/views/admin/Organizer.vue');
const EventsDetail = () => import('@/views/admin/EventsDetail.vue');
const Reviews = () => import('@/views/admin/Reviews.vue');
const Reports = () => import('@/views/admin/Reports.vue');
const Cart = () => import('@/views/customer/Cart.vue');
const Login = () => import('@/components/auth/Login.vue');
const Register = () => import('@/components/auth/Register.vue');
const ForgotPassword = () => import('@/components/auth/ForgotPassword.vue');
const Checkout = () => import('@/views/customer/Checkout.vue');
const MyOrders = () => import('@/views/customer/MyOrders.vue');
const MyProfile = () => import('@/views/customer/MyProfile.vue');
const MyTicket = () => import('@/views/customer/MyTicket.vue');

const routes = [
    // --- PUBLIC ROUTES ---
    { path: '/', name: 'home', component: IndexComponent },
    { path: '/index', name: 'Index', component: IndexComponent },
    { path: '/search', name: 'EventSearchPage', component: EventSearchPage },
    { path: '/event', name: 'EventDetail', component: EventDetail },

    // --- GUEST ONLY ---
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { guestOnly: true },
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: { guestOnly: true },
    },

    // --- CUSTOMER ROUTES ---
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
        meta: { requiresAuth: true },
    },
    {
        path: '/checkout',
        name: 'CheckOut',
        component: Checkout,
        meta: { requiresAuth: true },
    },
    {
        path: '/my-order',
        name: 'MyOrder',
        component: MyOrders,
        meta: { requiresAuth: true },
    },
    {
        path: '/my-profile',
        name: 'MyProfile',
        component: MyProfile,
        meta: { requiresAuth: true },
    },
    {
        path: '/my-tickets',
        name: 'MyTicket',
        component: MyTicket,
        meta: { requiresAuth: true },
    },

    // --- ORGANIZER ROUTES ---
    {
        path: '/organizer/create-event',
        name: 'CreateEvent',
        component: CreateEvent,
        meta: { requiresAuth: true },
    },
    {
        path: '/organizer/export-file',
        name: 'ExportFile',
        component: ExportFile,
        meta: { requiresAuth: true },
    },
    {
        path: '/organizer/legal-document',
        name: 'LegalDocument',
        component: LegalDocument,
        meta: { requiresAuth: true },
    },
    {
        path: "/organizer/pending",
        name: "EventPending",
        component: Pending,
        meta: { requiresAuth: true },
    },
    {
        path: '/organizer/events',
        name: 'Events',
        component: Events,
        meta: { requiresAuth: true },
    },

    // --- ADMIN ROUTES ---
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            { path: 'dashboard', name: "AdminDashboard", component: Dashboard },
            { path: 'approve-events', name: "AdminApproveEvents", component: ApproveEvent },
            { path: 'approve-events/:id', name: "AdminEventDetail", component: EventsDetail },
            { path: 'orders', name: "AdminOrders", component: Order },
            { path: 'organizers', name: "AdminOrganizers", component: Organizer },
            { path: 'reviews', name: "AdminReviews", component: Reviews },
            { path: 'reports', name: "AdminReports", component: Reports },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(authGuard);
export default router;
