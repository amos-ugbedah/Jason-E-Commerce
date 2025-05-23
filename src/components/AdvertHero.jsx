import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaStar,
  FaGift,
  FaHeart,
} from "react-icons/fa";

const AdvertHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const slideInterval = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      image: "/images/summer.jpg",
      title: "Summer Mega Sale!",
      description: "Up to 50% off selected items. Limited time only.",
      buttonText: "Shop Now",
      link: "/summer-sale",
    },
    {
      image: "/images/arrival.jpg",
      title: "New Arrivals Every Week",
      description: "Discover the latest trends in fashion and tech",
      buttonText: "Explore",
      link: "/new-arrivals",
    },
    {
      image: "/images/best.jpg",
      title: "Best Weekly Deals",
      description: "Don't miss out on our highest discounts of the week!",
      buttonText: "Discover",
      link: "/best-deals",
    },
  ];

  const startSlideShow = () => {
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);
  };

  const handleClose = () => {
    setIsCollapsed(true);
    clearInterval(slideInterval.current);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startSlideShow();
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startSlideShow();
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startSlideShow();
  };

  useEffect(() => {
    startSlideShow();
    return () => clearInterval(slideInterval.current);
  }, [isHovered]);

  if (isCollapsed) return null;

  const marqueeText = (
    <span className="flex items-center gap-6 text-xl font-bold text-yellow-300 uppercase whitespace-nowrap animate-marquee">
      <FaStar className="text-pink-500" /> Catch The Hottest Deals Now!{" "}
      <FaGift className="text-blue-500" /> Exclusive Offers Just For You!{" "}
      <FaHeart className="text-red-500" /> Shop Smart, Shop Style!{" "}
    </span>
  );

  return (
    <div
      className="relative w-full h-[70vh] overflow-hidden mt-20 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Marquee */}
      <div className="absolute top-0 left-0 right-0 z-30 h-10 overflow-hidden bg-black bg-opacity-80">
        <div className="flex items-center w-full h-full">
          <div className="animate-marquee whitespace-nowrap">{marqueeText}</div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 z-10 bg-black bg-opacity-30"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="z-0 object-cover w-full h-full"
              onError={(e) => {
                e.target.src = "/images/placeholder.jpg";
              }}
            />
            <div className="absolute left-0 right-0 mx-auto text-center text-white transform -translate-y-1/2 top-1/2 max-w-[90%] md:max-w-[80%] lg:max-w-[60%] z-20">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                {slide.title}
              </h2>
              <p className="mb-6 text-lg md:text-xl lg:text-2xl">
                {slide.description}
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <button
                  onClick={() => navigate(slide.link)}
                  className="px-8 py-3 text-lg font-semibold transition-transform transform bg-blue-600 rounded-lg hover:bg-blue-700 hover:scale-105"
                >
                  {slide.buttonText}
                </button>
                <button
                  onClick={() => navigate("/best-deals")}
                  className="px-8 py-3 text-lg font-semibold text-white transition-transform transform bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 hover:scale-105"
                >
                  Discover More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-10 overflow-hidden bg-black bg-opacity-80">
        <div className="flex items-center w-full h-full">
          <div className="animate-marquee whitespace-nowrap">{marqueeText}</div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute z-20 p-3 text-white transition-all transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full left-4 top-1/2 hover:bg-opacity-80"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute z-20 p-3 text-white transition-all transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full right-4 top-1/2 hover:bg-opacity-80"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute z-30 flex items-center justify-center w-10 h-10 text-lg text-white transition-all bg-black bg-opacity-50 rounded-full cursor-pointer top-4 right-4 hover:bg-opacity-80"
      >
        <FaTimes size={18} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute z-30 flex gap-3 transform -translate-x-1/2 bottom-16 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-gray-300"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdvertHero;
