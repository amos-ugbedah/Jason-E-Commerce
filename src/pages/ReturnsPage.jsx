export default function ReturnsPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold">🔄 Returns & Exchanges</h1>
          <p className="mt-2 text-gray-600">
            Our hassle-free return policy ensures you can shop with confidence.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">Return Policy</h2>
            <div className="mt-4 space-y-4 text-gray-600">
              <p>
                We want you to be completely satisfied with your purchase. If you're not happy with an item, you may return it within 30 days of delivery for a full refund or exchange.
              </p>
              <ul className="pl-5 space-y-2 list-disc">
                <li>Items must be unused, unworn, and in their original condition with all tags attached</li>
                <li>Original packaging must be included</li>
                <li>Proof of purchase is required</li>
                <li>Some items are final sale and cannot be returned (marked on product page)</li>
              </ul>
            </div>
          </section>

          <section className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">How to Return an Item</h2>
            <div className="mt-4 space-y-4 text-gray-600">
              <ol className="pl-5 space-y-3 list-decimal">
                <li>
                  <strong>Initiate your return:</strong> Log in to your account and go to "Order History" to start the return process. If you checked out as a guest, use the return form on our website.
                </li>
                <li>
                  <strong>Package your item:</strong> Securely pack the item in its original packaging with all accessories and tags.
                </li>
                <li>
                  <strong>Ship your return:</strong> Print the prepaid return label that will be emailed to you and attach it to your package. Drop it off at any authorized shipping location.
                </li>
                <li>
                  <strong>Receive your refund:</strong> Once we receive and inspect your return, we'll process your refund within 3-5 business days.
                </li>
              </ol>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">Refund Information</h2>
              <div className="mt-4 space-y-3 text-gray-600">
                <p>Refunds will be issued to the original payment method.</p>
                <p>Shipping costs are non-refundable unless the return is due to our error.</p>
                <p>International customers: Duties and taxes are non-refundable.</p>
                <p>Processing time: 3-5 business days after we receive your return.</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">Exchanges</h2>
              <div className="mt-4 space-y-3 text-gray-600">
                <p>We currently offer exchanges for size and color only.</p>
                <p>Exchange items must meet all return criteria.</p>
                <p>If the item you want is out of stock, we'll issue a refund instead.</p>
                <p>Exchanges may take 7-10 business days to process.</p>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-lg bg-blue-50">
            <h2 className="text-xl font-semibold">Need Help With Your Return?</h2>
            <div className="mt-4 space-y-3 text-gray-600">
              <p>Our customer service team is happy to assist with any return questions.</p>
              <p>Contact us at <a href="mailto:returns@jason-commerce.com" className="text-blue-600">returns@jason-commerce.com</a> or call +1 (555) 987-6543.</p>
              <p>Hours: Monday-Friday, 8am-8pm EST</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 