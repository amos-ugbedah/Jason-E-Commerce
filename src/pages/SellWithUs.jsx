import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SellWithUs = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleStartSelling = () => {
    if (userInfo?.role === "seller") {
      navigate("/seller/dashboard");
    } else if (userInfo) {
      navigate("/seller/register");
    } else {
      navigate("/seller/login", { state: { from: "/sell-with-us" } });
    }
  };

  const handleSellerHub = () => {
    if (userInfo?.role === "seller") {
      navigate("/seller/hub");
    } else {
      navigate("/seller/login", { state: { from: "/seller/hub" } });
    }
  };

  return (
    <div className="sell-with-us-page">
      {/* Hero Banner */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-8 md:w-1/2 md:mb-0">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                Sell With Us!
              </h1>
              <p className="mb-4 text-xl">
                Join thousands of sellers growing their business
              </p>
              <p>Reach millions of customers with our platform</p>
            </div>
            <div className="relative md:w-1/2">
              <img
                src="/images/sellers.png"
                alt="Sellers on Jason"
                className="w-full rounded-lg shadow-lg"
              />
              <button
                onClick={handleStartSelling}
                className="absolute px-6 py-3 text-white transition-colors bg-blue-600 rounded-md bottom-4 right-4 hover:bg-blue-700"
              >
                {userInfo?.role === "seller"
                  ? "Seller Dashboard"
                  : "Start Selling"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sell Section */}
      <WhySell />

      {/* Testimonials */}
      <Testimonials />

      {/* How It Works */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-16 text-white bg-blue-600">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Start Selling?</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSellerHub}
              className="px-6 py-3 text-blue-600 transition-colors bg-white rounded-md hover:bg-gray-100"
            >
              Seller Hub
            </button>
            <button
              onClick={handleStartSelling}
              className="px-6 py-3 text-white transition-colors bg-blue-800 rounded-md hover:bg-blue-900"
            >
              {userInfo?.role === "seller"
                ? "Go to Dashboard"
                : "Start Selling"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const WhySell = () => {
  const reasons = [
    {
      icon: "👥",
      title: "Large Customer Base",
      desc: "Access millions of shoppers",
    },
    {
      icon: "🚚",
      title: "Fulfillment Services",
      desc: "We handle storage & shipping",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      desc: "Get paid on time, every time",
    },
    { icon: "📈", title: "Growth Tools", desc: "Advanced analytics dashboard" },
    {
      icon: "🛒",
      title: "Marketplace Exposure",
      desc: "Featured in our marketplace",
    },
    {
      icon: "🛡️",
      title: "Seller Protection",
      desc: "Safe and secure transactions",
    },
    { icon: "🌐", title: "Global Reach", desc: "Sell to customers worldwide" },
    {
      icon: "📱",
      title: "Mobile Friendly",
      desc: "Manage on the go with our app",
    },
    { icon: "🎯", title: "Marketing Support", desc: "Promotional campaigns" },
    { icon: "🔄", title: "Easy Returns", desc: "Streamlined return process" },
  ];

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-center">
          Why Sell on Jason?
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="p-6 text-center bg-white rounded-lg shadow-md"
            >
              <div className="mb-4 text-4xl">{reason.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
              <p className="text-gray-600">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoTestimonial = ({ testimonial }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = async () => {
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Video playback failed:", err);
      setHasError(true);
    }
  };

  const handlePause = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow-md">
      <div className="relative bg-gray-100 aspect-video">
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Media unavailable</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${
                isPlaying ? "block" : "hidden"
              }`}
              controls
              onEnded={handlePause}
              onPause={handlePause}
            >
              <source src={testimonial.video} type="video/mp4" />
              Your browser does not support videos
            </video>

            {!isPlaying && (
              <div className="absolute inset-0">
                <img
                  src={testimonial.poster}
                  alt={`${testimonial.name} testimonial`}
                  className="object-cover w-full h-full"
                  onError={() => setHasError(true)}
                />
                <button
                  onClick={handlePlay}
                  className="absolute inset-0 flex items-center justify-center w-full h-full group"
                  aria-label="Play video"
                >
                  <div className="flex items-center justify-center w-16 h-16 transition-all rounded-full bg-white/80 group-hover:bg-white group-hover:scale-110">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold">{testimonial.name}</h3>
        <p className="mb-2 text-gray-500">{testimonial.category}</p>
        <blockquote className="italic text-gray-700">
          "{testimonial.quote}"
        </blockquote>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah's Boutique",
      category: "Fashion",
      quote: "Our sales tripled within 3 months of joining Jason!",
      video: "/videos/boutique.mp4",
      poster: "/images/fashion.jpg",
    },
    {
      name: "Tech Gadgets Inc.",
      category: "Electronics",
      quote: "The fulfillment services saved us so much time and hassle.",
      video: "/videos/tech.mp4",
      poster: "/images/tech1.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-center">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <VideoTestimonial key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Register in Minutes",
      items: [
        "Complete our simple registration form",
        "Submit required business documents",
        "Provide your bank details for payments",
      ],
    },
    {
      title: "Become an Ecommerce Expert",
      items: [
        "Complete our new seller training program",
        "Activate your Seller Center account",
        "Learn best practices for success",
      ],
    },
    {
      title: "List Your Products",
      items: [
        "Upload your product catalog",
        "Set competitive prices",
        "Launch your storefront",
      ],
    },
    {
      title: "Grow With Our Support",
      items: [
        "Participate in platform promotions",
        "Get marketing insights and analytics",
        "Access premium seller tools",
      ],
    },
  ];

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-center">How It Works</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200 md:left-1/2 md:-ml-1"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`mb-8 flex ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center`}
            >
              <div
                className={`flex-1 ${
                  index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-xl font-bold text-blue-600 bg-blue-100 rounded-full">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <ul className="space-y-2">
                  {step.items.map((item, i) => (
                    <li key={i} className="text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellWithUs;
