'use client'

import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto m-4 p-4 bg-white rounded shadow">
      <h1>LocalShop - Find Products from Nearby Shops</h1>
      <p>Welcome! Browse products from local shops near you.</p>
      {/* TODO: Add featured products, search bar, shop list */}

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate('/dashboard')}>
        Explore Products
      </button>
    </div>
  );
};

export default Home;
