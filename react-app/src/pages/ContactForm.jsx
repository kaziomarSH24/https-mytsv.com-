import React from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactUs = () => {
    const [loading, setLoading] = React.useState(false);
  const onFinish = async (values) => {

    try {
        setLoading(true);
        const response = await axios.post('/ContactForm', values);
        if(response){
            setLoading(false);
            if(response.data.success) {
                toast.success('Message sent successfully!');
            }
        }
    } catch (error) {
        console.log(error);
            setLoading(false);
        toast.error('Failed to send message. Please try again later.');
    }

  };

  return (
    <div className="max-w-5xl mx-auto my-12 px-6 py-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Contact Us</h2>

      <div className="grid md:grid-cols-2 gap-10">
            <div>
              <Form
                name="contact"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  name: '',
                  email: '',
                  subject: '',
                  message: '',
                }}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter your name!' }]}
                >
                  <Input placeholder="Your Name" className="p-2 text-base" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input placeholder="Your Email" className="p-2 text-base" />
                </Form.Item>

                <Form.Item
                  label="Subject"
                  name="subject"
                  rules={[{ required: true, message: 'Please enter the subject!' }]}
                >
                  <Input placeholder="Subject" className="p-2 text-base" />
                </Form.Item>

                <Form.Item
                  label="Message"
                  name="message"
                  rules={[{ required: true, message: 'Please enter your message!' }]}
                >
                  <Input.TextArea rows={4} placeholder="Your Message" className="text-base" />
                </Form.Item>

                <Form.Item>
                  <Button
                type="primary"
                htmlType="submit"
                className="w-full h-11 text-base font-medium bg-primary"
                disabled={loading}
                  >
                {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Form.Item>
              </Form>
            </div>

            {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Get in Touch</h3>
          <p className="text-gray-600 mb-6">We’d love to hear from you! Reach out to us through any of the following methods:</p>

          <div className="space-y-4 text-gray-700">
            <div>
              <span className="font-semibold">📍 Address:</span><br />
             20570 N Milwaukee Ave Deerfield IL 60015
            </div>

            <div>
              <span className="font-semibold">📞 Phone:</span><br />
              <a href="tel:+16302977501" className="text-blue-600 hover:underline">+1 630 297 7501</a>
            </div>

            <div>
              <span className="font-semibold">✉️ Email:</span><br />
              <a href="mailto:info@mytsv.com" className="text-blue-600 hover:underline">info@mytsv.com</a>
            </div>

            {/* <div>
              <span className="font-semibold">🕒 Office Hours:</span><br />
              Mon – Fri: 9:00 AM – 5:00 PM (CST)
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

