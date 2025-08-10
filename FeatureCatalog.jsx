import React from 'react';

const FeatureCatalog = () => {
  const features = [
    { name: "Browse Jobs", icon: "📁", color: "text-gray-800" },
    { name: "Post Job", icon: "➕", color: "bg-green-600 text-white" },
    { name: "Wage Jobs", icon: "⚒", color: "text-gray-800" },
    { name: "Employment", icon: "🏢", color: "text-gray-800" },
    { name: "Online", icon: "💻", color: "text-gray-800" },
    { name: "Referrals", icon: "🎁", color: "text-gray-800" },
    { name: "AI Tools", icon: "🤖", color: "text-gray-800" },
    { name: "Map", icon: "🗺", color: "text-gray-800" },
    { name: "ZedTrading", icon: "📈", color: "text-gray-800" },
    { name: "Withdrawal", icon: "💰", color: "text-gray-800" },
    { name: "Messages", icon: "💬", color: "text-gray-800" },
    { name: "Payment", icon: "💳", color: "text-gray-800" },
    { name: "Profile", icon: "⚙", color: "text-gray-800" },
    { name: "Logout", icon: "🚪", color: "text-red-600 border border-red-300" }
  ];

  const handleFeatureClick = (featureName) => {
    console.log(`Clicked on: ${featureName}`);
    // Add your navigation logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ZED HUSTLE
          </h1>
          <p className="text-lg text-gray-600">
            Your complete freelance marketplace dashboard
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature.name)}
              className={`
                bg-white rounded-xl p-4 cursor-pointer transition-all duration-200 
                hover:scale-105 hover:shadow-lg border border-gray-100
                ${feature.color}
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="font-medium text-sm">{feature.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome back, there!
            </h2>
            <p className="text-lg text-gray-600">
              Here's what's happening with your ZedHustle journey
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm text-blue-800">Available Bids</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-2">K0.00</div>
              <div className="text-sm text-green-800">Wallet Balance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-sm text-purple-800">Active Jobs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCatalog;
