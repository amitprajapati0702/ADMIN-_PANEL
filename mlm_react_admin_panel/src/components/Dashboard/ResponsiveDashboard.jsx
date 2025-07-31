import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  TrendingUpIcon,
  BellIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ResponsiveDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { name: 'Total Users', value: '12,345', icon: UsersIcon, change: '+12%', changeType: 'increase' },
    { name: 'Revenue', value: '$89,432', icon: CurrencyDollarIcon, change: '+8%', changeType: 'increase' },
    { name: 'Active Sessions', value: '2,345', icon: ChartBarIcon, change: '-2%', changeType: 'decrease' },
    { name: 'Growth Rate', value: '24.5%', icon: TrendingUpIcon, change: '+5%', changeType: 'increase' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new account', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '5 minutes ago' },
    { id: 3, user: 'Mike Johnson', action: 'Made a purchase', time: '10 minutes ago' },
    { id: 4, user: 'Sarah Wilson', action: 'Logged in', time: '15 minutes ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <nav className="mt-5 space-y-1 px-2">
                <a href="#" className="bg-primary-100 text-primary-700 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                  <ChartBarIcon className="text-primary-500 mr-4 h-6 w-6" />
                  Dashboard
                </a>
                <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                  <UsersIcon className="text-gray-400 mr-4 h-6 w-6" />
                  Users
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              <a href="#" className="bg-primary-100 text-primary-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <ChartBarIcon className="text-primary-500 mr-3 h-6 w-6" />
                Dashboard
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <UsersIcon className="text-gray-400 mr-3 h-6 w-6" />
                Users
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <CurrencyDollarIcon className="text-gray-400 mr-3 h-6 w-6" />
                Revenue
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <Cog6ToothIcon className="text-gray-400 mr-3 h-6 w-6" />
                Settings
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          {/* Page header */}
          <div className="bg-white shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Dashboard
                  </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <BellIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                    Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <stat.icon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <div className="bg-white shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {recentActivities.map((activity, activityIdx) => (
                        <li key={activity.id}>
                          <div className="relative pb-8">
                            {activityIdx !== recentActivities.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                                  <UsersIcon className="h-5 w-5 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-900">{activity.user}</span> {activity.action}
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {activity.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveDashboard;
