import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNearbyShops, getProducts } from '../services/api';

const ProductList = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // Get user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setUserLocation(location);
            resolve(location);
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  const findNearByShop = async () => {
    try {
      setLoading(true);
      let location = userLocation;

      // Get location if not already available
      if (!location) {
        location = await getUserLocation();
      }

      const response = await getNearbyShops(location.latitude, location.longitude);
      if (response.success) {
        setShops(response.shops || []);
        // After getting nearby shops, fetch their products
        await fetchProductsFromNearbyShops(response.shops || []);
      }
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      alert('Please enable location access to find nearby shops');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsFromNearbyShops = async (nearbyShops) => {
    try {
      if (nearbyShops.length === 0) {
        setProducts([]);
        return;
      }

      // Fetch products from all nearby shops
      const productPromises = nearbyShops.map(shop =>
        getProducts({ shopId: shop._id })
      );

      const productResponses = await Promise.all(productPromises);

      // Combine all products and add shop info
      const allProducts = [];
      productResponses.forEach((response, index) => {
        if (response.success && response.products) {
          response.products.forEach(product => {
            allProducts.push({
              ...product,
              shopDistance: nearbyShops[index].distance
            });
          });
        }
      });

      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.shop?.shopName?.toLowerCase().includes(query)
    );
  });

  // Filter shops based on search query
  const filteredShops = shops.filter(shop => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      shop.shopName?.toLowerCase().includes(query) ||
      shop.address?.street?.toLowerCase().includes(query) ||
      shop.address?.city?.toLowerCase().includes(query)
    );
  }); 

  //
  const handleProductDetails = (product) => {
    navigate(`/products/${product._id}`, { state: { product } });
  }

  // Load shops on component mount
  useEffect(() => {
    findNearByShop();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">LocalShop</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'products'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'shops'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Shops
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            {/* Centered Search Bar */}
            <div className="flex-1 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search products or shops..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 px-5 text-lg py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'products' ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Products from Nearby Shops</h2>
              {loading ? (
                <p className="text-gray-500">Loading products...</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-500">
                  {searchQuery ? `No products found matching "${searchQuery}"` : 'No products found from nearby shops'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                          <div className="space-y-1 mb-4">
                            <p className="text-2xl font-bold text-indigo-600">₹{product.price}</p>
                            <p className="text-sm text-gray-600">Stock: {product.quantity}</p>
                            <p className="text-sm text-gray-500">{product.shop?.shopName}</p>
                            <p className="text-xs text-gray-400">📍 {product.shopDistance?.toFixed(2)} km away</p>
                          </div>
                        </div>
                        <button
                          className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                          onClick={() => handleProductDetails(product)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Nearby Shops</h2>
              {loading ? (
                <p className="text-gray-500">Loading shops...</p>
              ) : filteredShops.length === 0 ? (
                <p className="text-gray-500">
                  {searchQuery ? `No shops found matching "${searchQuery}"` : 'No shops found'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShops.map((shop) => (
                    <div
                      key={shop._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{shop.shopName}</h3>
                      <p className="text-gray-600 mb-3">
                        {shop.address?.street && `${shop.address.street}, `}
                        {shop.address?.city}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">📞 {shop.mobile}</p>
                        <p className="text-sm text-gray-500">📍 {shop.distance?.toFixed(2)} km away</p>
                        <button className="w-full mt-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
                          View Shop
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
