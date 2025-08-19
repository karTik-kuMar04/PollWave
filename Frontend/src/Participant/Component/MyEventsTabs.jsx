import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventsTab.css';
import axios from 'axios';

const MyEventsTabs = () => {
  const [activeTab, setActiveTab] = useState('quizzes');

  const quizzes = [
    { title: 'Tech Trivia Night', date: 'July 15, 2024', score: '92%' },
    { title: 'Marketing Mastermind Quiz', date: 'June 20, 2024', score: '78%' },
    { title: 'Global Affairs Challenge', date: 'May 5, 2024', score: '88%' },
  ];

  const [polls, setPolls] = useState([])

  useEffect(() => {
    const fetchPollResponses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/users/mypolls/responses",
          { withCredentials: true }
        )

        setPolls(res.data.responseOnPoll);
      } catch (error) {
        console.error('Error fetching poll responses:', error);
      }

    }
    if (activeTab === "polls") {
      fetchPollResponses();
    }
  }, [activeTab]);

  return (
    <div className="text-white px-6 py-4">
      {/* Tabs */}
      <div className="flex items-center space-x-6 border-b border-gray-700 mb-6">
        <button
          className={`pb-2 text-lg font-medium ${
            activeTab === 'quizzes' ? 'border-b-2 border-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
        <button
          className={`pb-2 text-lg font-medium ${
            activeTab === 'polls' ? 'border-b-2 border-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('polls')}
        >
          Polls
        </button>
      </div>

      {/* Quizzes Section */}
      {activeTab === 'quizzes' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1c1e32] p-6 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Quizzes Joined</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-[#1c1e32] p-6 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Average Quiz Score</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
          </div>

          <div className="bg-[#1c1e32] p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Joined Quizzes</h2>
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400">
                <tr>
                  <th className="py-2">Event Title</th>
                  <th className="py-2">Date of Participation</th>
                  <th className="py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    <td className="py-2">{quiz.title}</td>
                    <td className="py-2">{quiz.date}</td>
                    <td className="py-2">{quiz.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </>
      )}

      {/* Polls Section */}
      {activeTab === 'polls' && (
        <>
          <div className="bg-[#1c1e32] p-6 rounded-lg mb-6">
            <p className="text-gray-400 text-sm mb-1">Total Polls Participated</p>
            <p className="text-2xl font-bold">8</p>
          </div>

          <div className="bg-[#1c1e32] p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Joined Polls</h2>
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400">
                <tr>
                  <th className="py-2">Event Title</th>
                  <th className="py-2">Date of Participation</th>
                  <th className="py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {polls.map((poll, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    <td className="py-2">{poll.poll?.title}</td>
                    <td className="py-2">
                      {new Date(poll.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </>
      )}
    </div>
  );
};

export default MyEventsTabs;
