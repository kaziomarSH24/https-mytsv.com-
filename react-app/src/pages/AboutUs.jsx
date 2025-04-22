import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-lg shadow-md mt-10 mb-1">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>

      <section className="mb-8 text-gray-700">
        <p className="mb-4">
          Welcome to <span className="font-semibold italic">mytsv.com</span> – your destination for connection, creativity, and community.
        </p>
        <p>
          At <span className="font-semibold italic">MyTSV</span>, we believe that powerful ideas deserve a platform. Whether you’re an individual looking to share your voice, a business seeking exposure, or a curious mind in search of new opportunities, we provide the digital space and tools to help you thrive.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
        <p className="text-gray-700">
          To empower individuals and businesses through a dynamic, user-focused platform that fosters growth, creativity, and meaningful connections across communities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Story</h2>
        <p className="text-gray-700 mb-3">
          Founded with a vision to bring people and ideas together, <span className="font-semibold italic">MyTSV</span> began as a local project with a big dream. What started as a small initiative to highlight community talent and services in Chicagoland has now grown into a multi-faceted platform serving users from all walks of life.
        </p>
        <p className="text-gray-700 mb-3">
          We noticed a gap in platforms that balance visibility, usability, and community. So, we set out to build a space that not only showcases talent and services but also encourages collaboration and innovation.
        </p>
        <p className="text-gray-700">
          Over the years, we’ve expanded our offerings, refined our technology, and stayed committed to the needs of our growing user base—all while keeping our core values front and center.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Meet the Team</h2>
        <p className="text-gray-700">
          Behind <span className="font-semibold italic">MyTSV</span> is a passionate team of creators, developers, and community builders. We come from diverse backgrounds, but we’re united by one goal: to make <span className="italic">mytsv.com</span> a place where ideas come to life and connections lead to real impact.
        </p>
        <p className="text-gray-700 mt-3">
          We’re designers and storytellers, strategists and support heroes, all working together to make your experience seamless, enriching, and inspiring.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Why Choose MyTSV?</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li><strong>User-First Design:</strong> We’re constantly evolving to make sure your experience is smooth and meaningful.</li>
          <li><strong>Community Focused:</strong> We highlight real people, real businesses, and real stories.</li>
          <li><strong>Versatility:</strong> Whether you're promoting a service, launching a project, or exploring new trends, there’s a place for you here.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Join Us</h2>
        <p className="text-gray-700">
          Whether you’re a local business owner, a creative mind, or someone searching for inspiration—<strong>MyTSV</strong> is your stage. Explore, connect, grow. We’re glad you’re here.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
