const Shop = require('../models/Shop');
const axios = require('axios');

// @desc    Register shop
// @route   POST /api/shops
// @access  Private (Shop Owner)
exports.registerShop = async (req, res, next) => {
  try {
    const { shopName, address, mobile } = req.body;

    // Check if shop already exists for this user
    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'Shop already registered for this account',
      });
    }

    // Geocode address to get coordinates
    if (!address?.city || !address?.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide city and pincode',
      });
    }

    // Build address string for geocoding
    const addressString = `${address.street || ''} ${address.city} ${address.state || ''} ${address.pincode}`.trim();

    try {
      // Use free Nominatim geocoding service (OpenStreetMap)
      const geocodeResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: addressString,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'LocalShopApp/1.0' // Required by Nominatim
        }
      });

      if (!geocodeResponse.data || geocodeResponse.data.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Could not find coordinates for the provided address. Please verify the address.',
        });
      }

      // Add coordinates to address
      address.coordinates = {
        lat: parseFloat(geocodeResponse.data[0].lat),
        lng: parseFloat(geocodeResponse.data[0].lon)
      };
    } catch (geocodeError) {
      return res.status(500).json({
        success: false,
        message: 'Error geocoding address. Please try again.',
      });
    }

    const shop = await Shop.create({
      owner: req.user.id,
      shopName,
      address,
      mobile,
    });

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my shop
// @route   GET /api/shops/my-shop
// @access  Private (Shop Owner)
exports.getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shop
// @route   PUT /api/shops/my-shop
// @access  Private (Shop Owner)
exports.updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { owner: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby shops
// @route   GET /api/shops/nearby?lat=LAT&lng=LNG&radius=RADIUS
// @access  Public
exports.getNearbyShops = async (req, res, next) => {
  try {
    const { lat, lng, radius = 1.1 } = req.query; // radius in km, default 1.1km

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude',
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxDistance = parseFloat(radius);

    // Get all active shops
    const shops = await Shop.find({ isActive: true });

    // Calculate distance and filter
    const nearbyShops = shops
      .map(shop => {
        if (!shop.address?.coordinates?.lat || !shop.address?.coordinates?.lng) {
          return null; // Skip shops without coordinates
        }

        // Haversine formula to calculate distance
        const R = 6371; // Earth's radius in km
        const dLat = (shop.address.coordinates.lat - userLat) * Math.PI / 180;
        const dLng = (shop.address.coordinates.lng - userLng) * Math.PI / 180;
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(userLat * Math.PI / 180) * Math.cos(shop.address.coordinates.lat * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return {
          ...shop.toObject(),
          distance: parseFloat(distance.toFixed(2)) // Distance in km
        };
      })
      .filter(shop => shop && shop.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    res.json({
      success: true,
      count: nearbyShops.length,
      radius: `${maxDistance} km`,
      shops: nearbyShops,
    });
  } catch (error) {
    next(error);
  }
};
