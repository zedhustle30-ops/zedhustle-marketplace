import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">ZED HUSTLE</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            ZED HUSTLE
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Zambia's premier freelance marketplace connecting talent with opportunity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/catalog" className="hover:text-primary-600">Find Jobs</Link></li>
                <li><Link href="/trade" className="hover:text-primary-600">Trading</Link></li>
                <li><Link href="/referrals" className="hover:text-primary-600">Referrals</Link></li>
                <li><Link href="/wallet" className="hover:text-primary-600">Wallet</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/help" className="hover:text-primary-600">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary-600">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>+260 955 123 456</li>
                <li>info@zedhustle.com</li>
                <li>Lusaka, Zambia</li>
              </ul>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600">© 2024 ZED HUSTLE. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}



