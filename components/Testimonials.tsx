export default function Testimonials() {
  const reviews = [
    {
      name: "Rahul",
      rating: 5,
      review: "Excellent quality products. Fast delivery!"
    },
    {
      name: "Suresh",
      rating: 5,
      review: "Best barber tools at affordable prices."
    },
    {
      name: "Mahesh",
      rating: 4,
      review: "Very satisfied with the customer service."
    },
  ];

  return (
    <section className="px-4 mt-10">
      <h2 className="text-2xl font-bold mb-4">
        ⭐ Customer Reviews
      </h2>

      <div className="space-y-4">
        {reviews.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow p-5"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{item.name}</h3>
              <span>{"⭐".repeat(item.rating)}</span>
            </div>

            <p className="text-gray-600 mt-2">
              {item.review}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}