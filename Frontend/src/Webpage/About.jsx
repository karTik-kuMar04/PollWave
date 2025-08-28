// src/pages/About.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {  Mail } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { VscGithubAlt } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">
            Hi, I’m <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Kartik Kumar</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            A self-taught frontend developer passionate about crafting interactive, modern, and user-friendly experiences.
          </p>
        </motion.div>

        {/* Journey Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold">My Journey</h2>
          <p className="text-gray-300 leading-relaxed">
            I started with HTML, CSS, and JavaScript, then explored React.js, Tailwind CSS,
            and frontend project building. I love blending design with logic.
            Currently, I’m working on projects like a console-style gaming hub, a
            real-time polling app, and a manga storefront.
          </p>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-4">What I Do</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Frontend Development</h3>
              <p className="text-gray-300 text-sm">React.js, JavaScript (ES6+), Tailwind CSS, responsive UI design, component-based architecture.</p>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Backend (Learning)</h3>
              <p className="text-gray-300 text-sm">Node.js, Express.js, MongoDB, API design, authentication basics.</p>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Other Tools</h3>
              <p className="text-gray-300 text-sm">Git & GitHub, REST APIs, Axios, deployment on Vercel/Netlify.</p>
            </div>
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Project Highlights</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li> <span className="font-medium">Gaming Hub</span> – a web console for games like Tic Tac Toe, Rock Paper Scissors, and Sudoku.</li>
            <li> <span className="font-medium">PollWave</span> – a real-time polling app with instant results.</li>
            <li> <span className="font-medium">Manga Storefront</span> – frontend design for browsing and searching manga collections.</li>
          </ul>

          {/*           
          <Link to="/projects" className="inline-block mt-2 text-blue-400 hover:underline">
            Explore all projects →
          </Link> */}
        </motion.div>

        {/* Beyond Tech */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-semibold">Beyond Code</h2>
          <p className="text-gray-300">
            When I’m not coding, I’m exploring manga storytelling, experimenting with UI animations, 
            or enjoying strategy games. I believe creativity and logic go hand-in-hand, and I bring that into my projects.
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-2xl font-semibold">Let’s Connect</h2>
          <p className="text-gray-300">I’m looking for frontend development internship opportunities to apply my skills in real projects and grow with a passionate team.</p>
          <div className="flex justify-center gap-6">
            <a href="https://github.com/karTik-kuMar04" target="_blank">
                <div
                className="text-[#ab9cba]"
                data-icon="GithubLogo"
                data-size="24px"
                data-weight="regular"
                >
                <span
                    className="text-white text-2xl font-bold"
                >
                    <VscGithubAlt />
                </span>
                </div>
            </a>
            <a href="https://www.linkedin.com/in/kartik-kumar-2264662a9/" target="_blank">
                <div
                className="text-[#ab9cba]"
                data-icon="LinkedinLogo"
                data-size="24px"
                data-weight="regular"
                >
                <span
                    className="text-white text-2xl "
                >
                    <FaLinkedin />
                </span>
                </div>
            </a>
                <a href="mailto:mysoulisinfinity1@gmail.com" className="hover:text-blue-400">
                <Mail size={28} />
                </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
