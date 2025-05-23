import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold">📞 Contact Us</h1>
          <p className="mt-2 text-gray-600">
            We'd love to hear from you! Reach out through any of these channels.
          </p>
        </div>

        <div className="grid gap-8 mt-12 md:grid-cols-2">
          {/* Contact Form */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Our Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-500" />
                <div>
                  <h3 className="font-medium">Headquarters</h3>
                  <p className="text-gray-600">
                    123 Tech Avenue, Silicon Valley<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-500" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">
                    US: +1 (555) 123-4567<br />
                    UK: +44 20 1234 5678<br />
                    Support available 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-500" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">
                    support@jason-commerce.com<br />
                    sales@jason-commerce.com<br />
                    careers@jason-commerce.com
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <h3 className="mb-3 font-medium">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Offices */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold text-center">Our Global Offices</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { city: "New York", country: "USA", address: "456 Business St, NY 10001" },
              { city: "London", country: "UK", address: "78 Innovation Rd, EC1A" },
              { city: "Tokyo", country: "Japan", address: "1-2-3 Shibuya, Tokyo" },
              { city: "Sydney", country: "Australia", address: "100 Tech Park, NSW 2000" },
              { city: "Berlin", country: "Germany", address: "45 Digital Allee, 10117" },
              { city: "Singapore", country: "Singapore", address: "10 Marina Blvd, 018983" },
            ].map((office) => (
              <div key={office.city} className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold">{office.city}</h3>
                <p className="text-sm text-gray-500">{office.country}</p>
                <p className="mt-1 text-sm text-gray-600">{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}