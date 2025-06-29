import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Shield, Clock, Star, Tractor, Users, MapPin, CreditCard } from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary-600" />,
      title: 'Easy Search & Filter',
      description: 'Find the perfect equipment with our advanced search and filtering system.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Secure Transactions',
      description: 'All payments are processed securely with full insurance coverage.'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: 'Flexible Rental Periods',
      description: 'Rent for days, weeks, or months based on your project needs.'
    },
    {
      icon: <Star className="h-8 w-8 text-primary-600" />,
      title: 'Verified Reviews',
      description: 'Make informed decisions with authentic reviews from real users.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Equipment Listed' },
    { number: '5,000+', label: 'Happy Farmers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '4.8/5', label: 'Average Rating' }
  ]

  const categories = [
    { name: 'Tractors', count: '2,500+', image: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Harvesters', count: '800+', image: 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Tillers', count: '1,200+', image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Sprayers', count: '600+', image: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg section-padding">
        <div className="container-max text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Rent Premium Farm Equipment
              <span className="block text-gradient">Anytime, Anywhere</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with trusted equipment owners and access high-quality agricultural machinery 
              for your farming needs. From tractors to harvesters, find everything you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/equipment" className="btn-primary text-lg px-8 py-4">
                <Search className="inline h-5 w-5 mr-2" />
                Browse Equipment
              </Link>
              <Link to="/register" className="btn-outline text-lg px-8 py-4">
                <Tractor className="inline h-5 w-5 mr-2" />
                List Your Equipment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="gradient-bg section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FarmRent?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make equipment rental simple, secure, and affordable for farmers everywhere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card p-6 text-center animate-bounce-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Equipment Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover a wide range of agricultural equipment available for rent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/equipment?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-gray-200">{category.count} available</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="gradient-bg section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with FarmRent in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Search & Browse
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find the perfect equipment using our advanced search filters and browse detailed listings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Book & Pay
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Select your rental dates, make secure payment, and get instant confirmation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tractor className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Use & Return
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pick up or get delivery, use the equipment for your project, and return when done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of farmers who trust FarmRent for their equipment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/equipment" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Renting
            </Link>
            <Link to="/register" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200">
              List Equipment
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home