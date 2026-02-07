import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Zap, 
  MessageCircle, 
  CreditCard, 
  Globe, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Package,
  Users
} from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('landing');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">JeePoo</span>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                {t('common.login')}
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                {t('common.register')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {t('hero.cta')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  {t('hero.learnMore')}
                </Link>
              </div>
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <div className="text-gray-600">{t('stats.stores')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">10K+</div>
                  <div className="text-gray-600">{t('stats.orders')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">98%</div>
                  <div className="text-gray-600">{t('stats.satisfaction')}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-8 shadow-2xl transform rotate-3">
                <div className="bg-white rounded-2xl p-8 transform -rotate-3 shadow-xl">
                  <ShoppingBag className="h-32 w-32 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    {t('hero.cardTitle')}
                  </h3>
                  <p className="text-center text-gray-600">
                    {t('hero.cardSubtitle')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('features.easySetup.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('features.easySetup.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('features.whatsapp.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('features.whatsapp.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('features.multiPayment.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('features.multiPayment.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('features.customDomain.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('features.customDomain.description')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Package className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('features.inventory.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('features.inventory.description')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('features.analytics.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('features.analytics.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('howItWorks.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step1.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('howItWorks.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step2.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('howItWorks.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-green-100 mb-8">
            {t('cta.subtitle')}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-semibold"
          >
            {t('cta.button')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-8 w-8 text-green-500" />
                <span className="text-xl font-bold text-white">JeePoo</span>
              </div>
              <p className="text-sm">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-green-500 transition-colors">{t('footer.about')}</Link></li>
                <li><Link href="/team" className="hover:text-green-500 transition-colors">{t('footer.team')}</Link></li>
                <li><Link href="/careers" className="hover:text-green-500 transition-colors">{t('footer.careers')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">{t('footer.product')}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-green-500 transition-colors">{t('footer.features')}</Link></li>
                <li><Link href="/pricing" className="hover:text-green-500 transition-colors">{t('footer.pricing')}</Link></li>
                <li><Link href="/docs" className="hover:text-green-500 transition-colors">{t('footer.docs')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-green-500 transition-colors">{t('footer.help')}</Link></li>
                <li><Link href="/contact" className="hover:text-green-500 transition-colors">{t('footer.contact')}</Link></li>
                <li><Link href="/privacy" className="hover:text-green-500 transition-colors">{t('footer.privacy')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© 2026 JeePoo. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
