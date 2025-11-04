function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Canix
            </h1>
            <p className="text-xl text-gray-600">
              Hunt for the best yield with Canix
            </p>
          </header>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Welcome to Canix
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Discover optimal yield opportunities across decentralized finance protocols.
              Our platform helps you make informed decisions to maximize your returns.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {/* Feature 1 */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-blue-600 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">High Yields</h3>
                <p className="text-sm text-gray-600">
                  Find the highest APY opportunities across multiple protocols
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-indigo-50 rounded-lg p-6">
                <div className="text-indigo-600 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
                <p className="text-sm text-gray-600">
                  Audited smart contracts and transparent security practices
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-purple-600 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Fast</h3>
                <p className="text-sm text-gray-600">
                  Quick and efficient yield optimization strategies
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
