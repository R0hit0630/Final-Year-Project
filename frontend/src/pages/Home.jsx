import React from "react";
import { useNavigate } from "react-router-dom";


export default function TravolinHome() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      {/* Header / Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-emerald-200/60 dark:border-white/10">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center">
              <span className="material-icons text-white">terrain</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tighter">
              TRAVOLIN
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
  onClick={() => navigate("/destinations")}
  className="bg-emerald-400 px-6 py-3 rounded-lg font-bold"
>
  Destinations
</button>


            <a className="font-medium hover:text-emerald-500 transition-colors" href="#">
              Packages
            </a>
            <a className="font-medium hover:text-emerald-500 transition-colors" href="#">
              Adventure
            </a>
            <a className="font-medium hover:text-emerald-500 transition-colors" href="#">
              About Us
            </a>
          </div>

          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2.5 font-semibold hover:text-emerald-500 transition-colors">
              Sign up
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-400 hover:bg-emerald-500 text-slate-900 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-emerald-300/40"
            >
              Book a Trip
            </button>
          </div>

        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Majestic Himalayas at dawn"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdsZ_YYBzXcdyoFl-ZYxxRYH61xhJQhn7kjVmF7WLmeBGWioFHs8y0kCElRCvnxh8II4daxcWwDghzxg6-q1XMd32xZYc9RN84xGZDTLrQZ630tH39KT0I7gjrBpE66LG7ma71yTFxv1GPVDoViyzALbRzwa49nmsaRaq8rjSFJByngrGJEwdvZ_CsQ3LliFQ5m6-iCGJCNC84gjgStZ6j13RMyT_C-UGxY0d7eggYJsHACgYyeR7ZMZ7pihUvT6MAM5x-QqoquTs"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl pt-20">
          <span className="inline-block px-4 py-1.5 bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 font-bold rounded-full text-sm mb-6">
            EXPLORE NEPAL 2024
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1]">
            Experience the Roof <br /> of the World
          </h1>

          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            From the peaks of Everest to the jungles of Chitwan, discover the
            ultimate adventure in the heart of the Himalayas.
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-5xl mx-auto border border-white/20">
            <div className="flex-1 w-full flex items-center gap-3 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200">
              <span className="material-icons text-emerald-500">location_on</span>
              <div className="text-left w-full">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Destination
                </p>
                <input
                  className="bg-transparent border-none p-0 focus:ring-0 text-slate-900 font-semibold placeholder:text-gray-400 w-full"
                  placeholder="Where to?"
                  type="text"
                />
              </div>
            </div>

            <div className="flex-1 w-full flex items-center gap-3 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-200">
              <span className="material-icons text-emerald-500">calendar_today</span>
              <div className="text-left w-full">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Date
                </p>
                <input
                  className="bg-transparent border-none p-0 focus:ring-0 text-slate-900 font-semibold placeholder:text-gray-400 w-full"
                  placeholder="When?"
                  type="text"
                />
              </div>
            </div>

            <div className="flex-1 w-full flex items-center gap-3 px-6 py-3">
              <span className="material-icons text-emerald-500">hiking</span>
              <div className="text-left w-full">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Activity
                </p>
                <select className="bg-transparent border-none p-0 focus:ring-0 text-slate-900 font-semibold w-full">
                  <option>Trekking</option>
                  <option>Sightseeing</option>
                  <option>Wildlife Safari</option>
                  <option>Rafting</option>
                </select>
              </div>
            </div>

            <button className="w-full md:w-auto bg-emerald-400 hover:bg-emerald-500 text-slate-900 h-14 px-10 rounded-full font-bold transition-all flex items-center justify-center gap-2">
              <span className="material-icons">search</span>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold mb-4">Popular Destinations</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the most sought-after locations across Nepal, each offering a unique
              blend of culture, nature, and adventure.
            </p>
          </div>

          <button className="flex items-center gap-2 font-bold text-emerald-500 group">
            View All Destinations
            <span className="material-icons group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-xl h-[500px] cursor-pointer shadow-lg">
            <img
              alt="Everest Base Camp"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmPNzYRkKjqCh4bJ7jsL8XFC9Sf2ZXqpU71ZDhPYeHLz2C8nCO8r2nFXxj_JMHLqWYXGuBaoSCKURsebGMljINF74lep2uvx1mdWh8cyIfy1Hqd5mjQsgPJ4F6oNrphDbP_K9DJ5ZFcVxNXmzwdFFypuimu6a1BaSz3eFU-PrsmYBJrtVr0NFZxz_kOw_MgBSDL171WecePxGS7t02lexikTL4-qUnlVrzKYe9gXjQbhA2Cr4QHqP4OYXZ3TL8VrKBLLBBrkc4Mjk"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded mb-3 inline-block uppercase tracking-widest">
                    Iconic
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Everest Base Camp</h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-xs">schedule</span> 14 Days
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-xs">terrain</span> Extreme
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs uppercase font-bold">From</p>
                  <p className="text-emerald-300 text-2xl font-black">$1,499</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-xl h-[500px] cursor-pointer shadow-lg">
            <img
              alt="Pokhara Valley"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXxV40sQnHmnRDdvE5UFD2zmtYQs2UIJ1hYpvTV7CjCDglxUX_2ejpOeZNYoyL5cCG9BVo6ect07Rf10JYU__tC5k0ihDh7nLQTDdM_nQ_seCc2yLrq5fEQG8yqJo1_xFdavyaGXPRZ4PrIegyNj7EZk16TBpfMkJahF32al2pveZC30NxjkfnOsakkdM_wnTIfptlntR2vRWSt2FO6At0KUJzVJRNT3pRgmV6_cxo7hTDQ20pbm4Pr9l0peaDtZNpzgYuaZxaqyY"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <span className="bg-emerald-300 text-slate-900 text-[10px] font-black px-2 py-1 rounded mb-3 inline-block uppercase tracking-widest">
                    Leisure
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Pokhara Valley</h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-xs">schedule</span> 3 Days
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-xs">terrain</span> Easy
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs uppercase font-bold">From</p>
                  <p className="text-emerald-300 text-2xl font-black">$299</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-xl h-[500px] cursor-pointer shadow-lg">
            <img
              alt="Chitwan National Park"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtiwVl_XA149RFBp6r2z9zIEZTUxI4txENfQmIcvmDhe22dMcYZDuw7ppj3_wi-4SbApxS1UZiPr0Zou3dQ1s6NNtdyJxp1HEGYOXSbeO9gOUQafQiEC0XMRH4RH1AJXW_jG4CyaLPxWShT0-X5NTw5H5fgBHC4f2cuQ5sDK0Ka7MaT0rzCg8Gx5Xd05-B6HXvpl35JOPZg8n0092lpYt-sLFCDRsVaPDrB_Ict_Mu12V8G3CeNIXR1t3gYQkqZZNPOOdpCvZxQsI"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded mb-3 inline-block uppercase tracking-widest">
                    Wildlife
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Chitwan National Park</h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-xs">schedule</span> 4 Days
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-xs">pets</span> Jungle Safari
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs uppercase font-bold">From</p>
                  <p className="text-emerald-300 text-2xl font-black">$450</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white dark:bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Why Choose Travolin</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide more than just tours; we create unforgettable lifelong
              experiences with deep respect for the land and its people.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-emerald-200/60 dark:border-white/10 hover:border-emerald-400 transition-colors">
              <div className="w-16 h-16 bg-emerald-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-emerald-500 text-3xl">verified</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Local Expertise</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Guided by Sherpas and local experts with decades of mountaineering and cultural experience.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-emerald-200/60 dark:border-white/10 hover:border-emerald-400 transition-colors">
              <div className="w-16 h-16 bg-emerald-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-emerald-500 text-3xl">security</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Booking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Verified payment gateways and 24/7 on-trip emergency support for your peace of mind.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-emerald-200/60 dark:border-white/10 hover:border-emerald-400 transition-colors">
              <div className="w-16 h-16 bg-emerald-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-emerald-500 text-3xl">eco</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainable Travel</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Eco-friendly tours focusing on low-impact tourism that gives back to local communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Packages */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold mb-4">Trending Packages</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Hand-picked experiences that our travelers love the most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Package 1 */}
          <div className="bg-white dark:bg-slate-800 border border-emerald-200/40 dark:border-white/10 rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all">
            <div className="relative h-48">
              <img
                alt="Annapurna Circuit"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDllSfIrNcZy9MJJnGvH6HNUE1Se6tV0Pw7BIukkcDGXNu5dm5NYnz4Li0rVHE1sUtOW27Kv7uPN7i1mP1dV78GaG0o4PuxYuZSoi-scUInjDBncBYrZinPy55Av0u2tRklfCZGSbvd9YmDZdbQETqTxJzF8Fb6MfZ8jO5vhZylTNvMeHu1QjFA7omfDtg4wPsmlgmmbr7x15CUusXP0VkOucf0iPEY6M4ciJKXFJqKKESm7Q5YLneUcKn9JwN5KlHRxqy8XrUvXQI"
              />
              <div className="absolute top-4 left-4 bg-emerald-400 text-slate-900 text-[10px] font-black px-2 py-1 rounded uppercase">
                Hot Deal
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-icons text-orange-500 text-sm">
                    star
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">(120 Reviews)</span>
              </div>
              <h4 className="font-bold text-lg mb-4 group-hover:text-emerald-500 transition-colors">
                Annapurna Circuit Trek
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black">$1,199</span>
                  <span className="text-gray-400 line-through text-sm ml-1">$1,450</span>
                </div>
                <button className="w-10 h-10 rounded-full border border-emerald-200/70 dark:border-white/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-400 hover:text-slate-900 transition-all">
                  <span className="material-icons text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Package 2 */}
          <div className="bg-white dark:bg-slate-800 border border-emerald-200/40 dark:border-white/10 rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all">
            <div className="relative h-48">
              <img
                alt="Kathmandu Cultural Tour"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcRhWwvZHTJFQEWGBuoQVD2wYRvz-GI-zi_HymuTkZN9FFA6sVBo8G6kqwDNYlpHro7EO_BkX5Yhln2qbA2adynMLpc05WY7Tf1k1UV46t0QFbR-sW_mXnllJJhSNdUnV2HQ46BKL5fISwQftRkvap14GsW5UV37_YCkIv51rg5qVtD3O3xy3YD34xxieQRp8P0gsYHdg33fJY8Wgajew1JNCo6TiGEEBZLEi5D46zl4_1C6GEtKE27XyhQ3L_fxYwfY-2m9UjdyQ"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`material-icons text-sm ${
                      i < 4 ? "text-orange-500" : "text-gray-300"
                    }`}
                  >
                    star
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">(85 Reviews)</span>
              </div>
              <h4 className="font-bold text-lg mb-4 group-hover:text-emerald-500 transition-colors">
                Heritage Sites of Kathmandu
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black">$349</span>
                </div>
                <button className="w-10 h-10 rounded-full border border-emerald-200/70 dark:border-white/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-400 hover:text-slate-900 transition-all">
                  <span className="material-icons text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Package 3 */}
          <div className="bg-white dark:bg-slate-800 border border-emerald-200/40 dark:border-white/10 rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all">
            <div className="relative h-48">
              <img
                alt="Ghorepani Trek"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDelqCQX2DFWPryWXoBz3NribSH6Pg_Eb7WYo-DG8v48SW66qQChTMhFBk9U2oH5ByaCAU2YUhVCY71U9_VdwlywbTsjHv4_Xs-Sd6asYTZJ9erAZ_B_pJFObTj4_X5wbCs2gFPBQZbWqkR26UTySZWw18oPoXnXu4PkOYVc-paLDHIIA0xzm_wtg5rtiTFKQThMy4uvBA08WnqTchwdHN1Sg9qiS-WgyHYSNfJ1MBuMlMVCpTuCXYmAeCEHDc6EvNDLF0t29hdaAc"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-icons text-orange-500 text-sm">
                    star
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">(210 Reviews)</span>
              </div>
              <h4 className="font-bold text-lg mb-4 group-hover:text-emerald-500 transition-colors">
                Ghorepani Poon Hill Trek
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black">$780</span>
                </div>
                <button className="w-10 h-10 rounded-full border border-emerald-200/70 dark:border-white/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-400 hover:text-slate-900 transition-all">
                  <span className="material-icons text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Package 4 */}
          <div className="bg-white dark:bg-slate-800 border border-emerald-200/40 dark:border-white/10 rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all">
            <div className="relative h-48">
              <img
                alt="Lumbini Pilgrimage"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQNFOyNwPwz0G8tqjEHpFAReAMl_1RUeMRQZDJqzl6CiGiSC7MVorWxGtDPgfYEknvwNFLI1dkivDLsdt-BOVJ1wWMTTd98V6LZ9CqSpQKHBr3JwKqCqujbCAhgI2to22mTz6gdL85UTThXRwG8q8utWgCwwoRJ1QqziqaNafSZjZs7Er9kwB48ChKGaTUp04M-_4P4rdydGdZX-1wgmTcHoytRNSddAMyyuFVOv5Z8a4xAnV7YsGx8NKA0RnfnYAVqVlxIDqc0IE"
              />
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                New
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-icons text-orange-500 text-sm">
                    star
                  </span>
                ))}
                <span className="text-xs text-gray-500 ml-1">(42 Reviews)</span>
              </div>
              <h4 className="font-bold text-lg mb-4 group-hover:text-emerald-500 transition-colors">
                Lumbini Spiritual Journey
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black">$520</span>
                </div>
                <button className="w-10 h-10 rounded-full border border-emerald-200/70 dark:border-white/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-400 hover:text-slate-900 transition-all">
                  <span className="material-icons text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-slate-900">terrain</span>
                </div>
                <span className="text-2xl font-extrabold tracking-tighter">
                  TRAVOLIN
                </span>
              </div>
              <p className="text-white/60 mb-8">
                Your trusted companion for exploring the hidden gems and majestic peaks of Nepal since 2012.
              </p>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-400 hover:text-slate-900 transition-all" href="#">
                  <span className="material-icons text-lg">facebook</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-400 hover:text-slate-900 transition-all" href="#">
                  <span className="material-icons text-lg">camera_alt</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-400 hover:text-slate-900 transition-all" href="#">
                  <span className="material-icons text-lg">alternate_email</span>
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-lg">Quick Links</h5>
              <ul className="space-y-4 text-white/60">
                <li><a className="hover:text-emerald-300 transition-colors" href="#">Destinations</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="#">Adventure Tours</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="#">Cultural Experiences</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="#">Travel Insurance</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-lg">Support</h5>
              <ul className="space-y-4 text-white/60">
                <li><a className="hover:text-emerald-300 transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-emerald-300 transition-colors" href="#">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-lg">Newsletter</h5>
              <p className="text-white/60 mb-6">
                Subscribe to get the latest travel updates and exclusive offers.
              </p>
              <div className="flex gap-2">
                <input
                  className="bg-white/10 border-white/20 rounded-lg px-4 py-2 flex-1 focus:ring-emerald-400 focus:border-emerald-400 text-sm"
                  placeholder="Your email"
                  type="email"
                />
                <button className="bg-emerald-400 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-emerald-500 transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm">
            <p>© 2024 Travolin Nepal. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="material-icons text-sm">location_on</span>
              <span>Thamel, Kathmandu, Nepal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
