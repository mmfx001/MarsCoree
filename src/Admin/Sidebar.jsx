import { Coins, Group, LayoutDashboard, Mail, ShoppingBag, ShoppingBasket, User, Users } from 'lucide-react';
import React from 'react';

const Sidebar = () => {
    const routes = [
        { name: 'Dashboard', icon: LayoutDashboard, link: '/dashboard' },
        { name: 'Studentlar', icon: Users, link: '/students' },
        { name: 'Guruhlar', icon: Group, link: '/groups' },
        { name: 'Magazin', icon: ShoppingBasket, link: '/shop' },
        { name: 'Mentorlar', icon: User, link: '/mentors' },
        { name: 'Coins', icon: Coins, link: '/coins' },
    ];

    return (
        <div className="w-24 h-screen bg-gray-800 sticky top-0 flex flex-col items-center py-4">
            {routes.map((route, index) => (
                <a
                    key={index}
                    href={route.link}
                    className="group flex flex-col items-center text-gray-400 text-sm font-medium py-3 rounded-lg hover:bg-gray-700 hover:text-white w-full"
                >
                    <route.icon className="h-6 w-6 mb-1" />
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 transform translate-y-2">
                        {route.name}
                    </span>
                </a>
            ))}
        </div>
    );
};

export default Sidebar;
