import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    {
      name: 'Page Views',
      value: '45,231',
      change: '+12.5%',
      changeType: 'increase',
      description: 'vs last period'
    },
    {
      name: 'Unique Visitors',
      value: '12,345',
      change: '+8.2%',
      changeType: 'increase',
      description: 'vs last period'
    },
    {
      name: 'Bounce Rate',
      value: '32.4%',
      change: '-2.1%',
      changeType: 'decrease',
      description: 'vs last period'
    },
    {
      name: 'Avg. Session Duration',
      value: '4m 32s',
      change: '+15.3%',
      changeType: 'increase',
      description: 'vs last period'
    }
  ];

  const topPages = [
    { page: '/dashboard', views: 12543, percentage: 35 },
    { page: '/users', views: 8921, percentage: 25 },
    { page: '/analytics', views: 6754, percentage: 19 },
    { page: '/settings', views: 4321, percentage: 12 },
    { page: '/reports', views: 3210, percentage: 9 }
  ];

  const trafficSources = [
    { source: 'Direct', visitors: 8543, percentage: 42 },
    { source: 'Google Search', visitors: 6234, percentage: 31 },
    { source: 'Social Media', visitors: 3421, percentage: 17 },
    { source: 'Referrals', visitors: 2012, percentage: 10 }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Analytics Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your website performance and user engagement
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <select 
              className="input-field text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
              <div className="flex items-center">
                {metric.changeType === 'increase' ? (
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={`font-medium ${
                metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="ml-1 text-gray-500">{metric.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Placeholder */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Traffic Overview</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Chart visualization would go here</p>
              <p className="text-xs text-gray-400">Integration with chart library needed</p>
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{page.page}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{page.views.toLocaleString()}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources and Device Breakdown */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Sources */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{source.visitors.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">({source.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Real-time Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Active Users</p>
                <p className="text-2xl font-bold text-green-600">247</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Recent Page Views</h4>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>/dashboard</span>
                  <span>2 sec ago</span>
                </div>
                <div className="flex justify-between">
                  <span>/users/profile</span>
                  <span>5 sec ago</span>
                </div>
                <div className="flex justify-between">
                  <span>/analytics</span>
                  <span>12 sec ago</span>
                </div>
                <div className="flex justify-between">
                  <span>/settings</span>
                  <span>18 sec ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export and Actions */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            Export Data
          </button>
          <button className="btn-primary">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
