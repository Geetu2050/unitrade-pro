import { Link } from 'react-router-dom'
import { CurrencyDollarIcon, ShieldCheckIcon, CpuChipIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const gradient = 'bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900'

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="glass-effect rounded-2xl p-6 h-full card-hover">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-dark-300">{desc}</p>
  </div>
)

const Home = () => {
  return (
    <div className={`${gradient}`}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: "radial-gradient(600px 300px at 10% 10%, rgba(0,212,255,0.15), transparent 60%), radial-gradient(600px 300px at 90% 40%, rgba(139,92,246,0.15), transparent 60%)"
        }} />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-dark-700 text-dark-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-neon-green mr-2 animate-pulse" />
                Live demo — No signup required
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Trade Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">UniTrade Pro</span>
              </h1>
              <p className="mt-6 text-lg text-dark-300 max-w-xl">
                A next‑gen fintech simulator with real‑time‑style markets, portfolio analytics, and a stunning dark UI.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary inline-flex items-center">
                  Get Started Free <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/login" className="btn-secondary inline-flex items-center">
                  Sign In
                </Link>
              </div>
              <div className="mt-10 flex items-center text-dark-400 space-x-6">
                <div className="flex items-center"><ShieldCheckIcon className="w-5 h-5 mr-2"/>Secure</div>
                <div className="flex items-center"><CpuChipIcon className="w-5 h-5 mr-2"/>Fast</div>
                <div className="flex items-center"><ChartBarIcon className="w-5 h-5 mr-2"/>Insightful</div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-tr from-neon-blue/20 via-neon-purple/20 to-transparent blur-3xl" />
              <div className="relative glass-effect rounded-3xl p-4 border-dark-700">
                <img
                  src="https://images.unsplash.com/photo-1551281044-8d8c5c2f7f87?q=80&w=1974&auto=format&fit=crop"
                  alt="Trading dashboard"
                  className="rounded-2xl object-cover w-full h-[360px]"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-dark-900/70 border border-dark-700 rounded-xl p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <CurrencyDollarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-dark-300">Portfolio Value</p>
                        <p className="text-lg font-semibold text-white">$50,000.00</p>
                      </div>
                    </div>
                    <Link to="/register" className="btn-primary py-2 px-4">Try Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Built for Modern Traders</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard icon={ShieldCheckIcon} title="Secure by Design" desc="Local demo with best practices ready for real API integration." />
            <FeatureCard icon={CpuChipIcon} title="Blazing Fast" desc="Vite, React 18, Zustand and Tailwind for instant feedback." />
            <FeatureCard icon={ChartBarIcon} title="Actionable Insights" desc="Beautiful charts and a clean information hierarchy." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-dark-800">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold text-white mb-4">Start Trading in Minutes</h3>
          <p className="text-dark-300 mb-8">Create a free demo account and experience a pro‑grade trading UI.</p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn-primary inline-flex items-center">
              Create Account <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
