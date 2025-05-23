/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Award,
  Shield,
  Truck,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
//           toast.success("Password recovery email sent. Please check your inbox.");

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const teamMembers = [
    {
      name: "Amos Jason",
      role: "Founder & CEO",
      bio: "Serial entrepreneur with 10+ years in e-commerce innovation. Passionate about AI-driven shopping experiences.",
      image: "images/jason.jpg",
    },
    {
      name: "Amos Jareth",
      role: "CTO",
      bio: "Tech visionary specializing in machine learning and scalable architectures. Built 3 successful tech startups.",
      image: "images/Jareth.jpg",
    },
    {
      name: "Amos Javon",
      role: "Head of Design",
      bio: "Award-winning UX designer focused on creating intuitive shopping journeys. Former lead designer at Amazon.",
      image: "images/jason.jpg",
    },
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Safety",
      description:
        "Your security is our priority. We use bank-level encryption for all transactions.",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Lightning Delivery",
      description:
        "90% of orders arrive within 24 hours. Free shipping on all orders over $50.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Sustainable Shopping",
      description:
        "Carbon-neutral shipping and eco-friendly packaging since day one.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Guaranteed",
      description:
        "Every product vetted by our team. 30-day no-questions-asked returns.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Jason's AI assistant found me the perfect gift when I was completely stuck!",
      author: "Emily R., New York",
    },
    {
      quote:
        "Fastest delivery I've ever experienced. Will shop here exclusively now.",
      author: "David T., San Francisco",
    },
    {
      quote: "The personalized recommendations save me hours every week.",
      author: "Priya K., London",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  return (
    <div className="mt-10 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-blue-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 text-4xl font-bold text-white md:text-6xl"
            >
              Revolutionizing Shopping
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8 text-xl text-blue-100"
            >
              Where AI meets your shopping needs for a seamless, personalized
              experience
            </motion.p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 origin-top-left transform bg-white skew-y-1"></div>
      </section>

      {/* Our Story */}
      {/* Our Story Section - Updated Image Container */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
              OUR JOURNEY
            </span>
            <h2 className="text-3xl font-bold text-center text-gray-900 md:text-4xl">
              From Garage to Global
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <p className="mb-6 text-lg text-gray-600">
                Founded in 2018, Jason began as a passion project in a college
                dorm room. Frustrated with impersonal shopping experiences, our
                founder Alex set out to create something different.
              </p>
              <p className="mb-6 text-lg text-gray-600">
                Today, we serve over 2 million customers worldwide with our
                AI-powered platform that learns your style, predicts your needs,
                and delivers joy to your doorstep.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium text-gray-900">
                  Winner of "Most Innovative E-Commerce Platform 2023"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex items-center justify-center overflow-hidden bg-gray-100 rounded-xl">
                <img
                  src="images/off.png"
                  alt="Our first office"
                  className="object-cover w-full h-auto max-h-[500px]"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm text-white">
                  Our first office space in 2019
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
              MEET THE TEAM
            </span>
            <h2 className="text-3xl font-bold text-center text-gray-900 md:text-4xl">
              The Minds Behind Jason
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex-shrink-0 w-full px-4">
                    <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-xl md:flex-row">
                      <div className="w-48 h-48 mb-6 overflow-hidden rounded-full md:mb-0 md:mr-8">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {member.name}
                        </h3>
                        <p className="mb-4 text-blue-600">{member.role}</p>
                        <p className="text-gray-600">{member.bio}</p>
                        <div className="flex justify-center mt-6 space-x-4 md:justify-start">
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <span className="sr-only">Twitter</span>
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          </a>
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <span className="sr-only">LinkedIn</span>
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-0 flex items-center justify-center w-10 h-10 -translate-x-5 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 flex items-center justify-center w-10 h-10 translate-x-5 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex justify-center mt-6 space-x-2">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
              WHAT WE STAND FOR
            </span>
            <h2 className="text-3xl font-bold text-center text-gray-900 md:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-8 text-center transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-blue-600 bg-blue-100 rounded-full">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
              LOVE FROM OUR CUSTOMERS
            </span>
            <h2 className="text-3xl font-bold text-center text-gray-900 md:text-4xl">
              What People Say
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="flex-shrink-0 w-full px-4">
                      <div className="p-8 bg-white rounded-xl">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-6 text-blue-600 bg-blue-100 rounded-full">
                          <Quote className="w-6 h-6" />
                        </div>
                        <blockquote className="mb-6 text-xl italic text-center text-gray-700">
                          "{testimonial.quote}"
                        </blockquote>
                        <p className="text-center text-gray-600">
                          — {testimonial.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Experience the Future of Shopping?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join millions of happy customers enjoying personalized shopping
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100"
              >
                Shop Now
              </a>
              <a
                href="/sell-with-us"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-transparent border border-white rounded-lg hover:bg-white/10"
              >
                Sell With Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
