import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaBook, FaClock, FaUsers, FaStar } from "react-icons/fa";

const AboutUsPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [counterStarted, setCounterStarted] = useState(false);

  const stats = [
    { icon: <FaUsers />, count: 50000, label: "Students Enrolled" },
    { icon: <FaBook />, count: 200, label: "Courses Offered" },
    { icon: <FaClock />, count: 10, label: "Years Experience" },
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Learning Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      bio: "15+ years experience in educational technology",
    },
    {
      name: "Mark Anderson",
      role: "Head of Technology",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      bio: "Former Google engineer passionate about EdTech",
    },
    {
      name: "Emily Chen",
      role: "Content Director",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      bio: "Curriculum development specialist",
    },
  ];

  const testimonials = [
    {
      name: "James Wilson",
      course: "Data Science",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      text: "The platform transformed my career path completely.",
    },
    {
      name: "Lisa Zhang",
      course: "Web Development",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      text: "Outstanding course quality and support system.",
    },
  ];

  useEffect(() => {
    if (inView && !counterStarted) {
      controls.start("visible");
      setCounterStarted(true);
    }
  }, [inView, controls, counterStarted]);

  return (
    <div className="bg-background min-h-screen">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[600px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655"
            alt="Education Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/50"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Transforming Education for Tomorrow
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Empowering learners worldwide through innovative online education
          </motion.p>
        </div>
      </motion.section>

      <section className="py-20 px-4 bg-card">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-foreground mb-12">
            Our Mission
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-lg bg-secondary shadow-sm"
              >
                <div className="text-4xl text-primary mb-4">{stat.icon}</div>
                <motion.div
                  className="text-4xl font-bold text-foreground"
                  initial={{ number: 0 }}
                  animate={{ number: counterStarted ? stat.count : 0 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  {Math.round(stat.count)}
                </motion.div>
                <p className="text-accent mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="bg-card rounded-lg overflow-hidden shadow-sm"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-accent mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-secondary border-b border-accent border-opacity-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            Student Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-card p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-foreground">
                      {testimonial.name}
                    </h3>
                    <p className="text-accent">{testimonial.course}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
                <div className="flex mt-4 text-chart-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.div
        className="fixed bottom-8 right-8"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg font-bold">
          Join Our Community
        </button>
      </motion.div>
    </div>
  );
};

export default AboutUsPage;
