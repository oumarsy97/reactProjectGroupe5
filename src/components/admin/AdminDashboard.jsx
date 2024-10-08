import React, { useState } from 'react';
import {
    Users,
    Scissors,
    ShoppingBag,
    MessageSquare,
    Heart,
    TrendingUp,
    Calendar,
    DollarSign,
    Star,
    Activity
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#14b8a6'];

const AdminDashboard = () => {
    // États pour les données (à remplacer par vos vraies données d'API)
    const [stats, setStats] = useState({
        totalUsers: 1250,
        totalTailors: 85,
        totalPosts: 324,
        totalReactions: 2156,
        newUsersToday: 12,
        activeOrders: 45,
        revenue: 15680,
        customerSatisfaction: 4.8
    });

    const [recentActivity] = useState([
        { id: 1, type: 'new_user', user: 'Sophie Martin', action: "s'est inscrite", time: 'Il y a 5 min' },
        { id: 2, type: 'new_order', user: 'Jean Dupont', action: 'a commandé une robe', time: 'Il y a 15 min' },
        { id: 3, type: 'review', user: 'Marie Claire', action: 'a laissé un avis 5★', time: 'Il y a 30 min' },
    ]);

    const monthlyData = [
        { name: 'Jan', users: 65, orders: 45, revenue: 12500 },
        { name: 'Fév', users: 78, orders: 52, revenue: 15000 },
        { name: 'Mar', users: 90, orders: 60, revenue: 17800 },
        { name: 'Avr', users: 105, orders: 75, revenue: 21000 },
        { name: 'Mai', users: 125, orders: 85, revenue: 24500 },
        { name: 'Juin', users: 145, orders: 95, revenue: 28000 },
    ];

    const userTypeData = [
        { name: 'Clients', value: 850 },
        { name: 'Tailleurs', value: 85 },
        { name: 'Vendeurs', value: 45 },
        { name: 'Admin', value: 5 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
                <p className="text-gray-600 mt-2">Vue d'ensemble de l'activité de la plateforme</p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Utilisateurs totaux"
                    value={stats.totalUsers}
                    icon={<Users className="text-purple-500" />}
                    increase="+12% ce mois"
                />
                <StatCard
                    title="Tailleurs actifs"
                    value={stats.totalTailors}
                    icon={<Scissors className="text-indigo-500" />}
                    increase="+5% ce mois"
                />
                <StatCard
                    title="Commandes actives"
                    value={stats.activeOrders}
                    icon={<ShoppingBag className="text-pink-500" />}
                    increase="+8% ce mois"
                />
                <StatCard
                    title="Chiffre d'affaires"
                    value={`${stats.revenue}€`}
                    icon={<DollarSign className="text-teal-500" />}
                    increase="+15% ce mois"
                />
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Graphique d'évolution */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Évolution mensuelle</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#8b5cf6" name="Utilisateurs" />
                            <Line type="monotone" dataKey="orders" stroke="#ec4899" name="Commandes" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Répartition des utilisateurs */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Répartition des utilisateurs</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Activité récente et métriques détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activité récente */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <ActivityIcon type={activity.type} />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.user} {activity.action}
                                    </p>
                                    <p className="text-sm text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Métriques clés */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Métriques clés</h2>
                    <div className="space-y-4">
                        <MetricItem
                            icon={<TrendingUp className="text-green-500" />}
                            label="Taux de conversion"
                            value="8.5%"
                        />
                        <MetricItem
                            icon={<Calendar className="text-blue-500" />}
                            label="Commandes du jour"
                            value="24"
                        />
                        <MetricItem
                            icon={<Star className="text-yellow-500" />}
                            label="Satisfaction client"
                            value="4.8/5"
                        />
                        <MetricItem
                            icon={<Activity className="text-red-500" />}
                            label="Taux d'engagement"
                            value="12.3%"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composants utilitaires
const StatCard = ({ title, value, icon, increase }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
            <span className="text-sm text-green-500 font-medium">{increase}</span>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);

const MetricItem = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
            {icon}
            <span className="ml-3 text-sm font-medium text-gray-600">{label}</span>
        </div>
        <span className="font-semibold text-gray-900">{value}</span>
    </div>
);

const ActivityIcon = ({ type }) => {
    const iconMap = {
        new_user: <Users className="text-purple-500" />,
        new_order: <ShoppingBag className="text-pink-500" />,
        review: <Star className="text-yellow-500" />
    };
    return (
        <div className="p-2 bg-gray-100 rounded-lg">
            {iconMap[type]}
        </div>
    );
};

export default AdminDashboard;