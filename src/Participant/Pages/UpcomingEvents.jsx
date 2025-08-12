import React from "react";
import Header from "../Component/Header";
import { NavLink } from "react-router-dom";
import { FaPoll } from "react-icons/fa";
import { CiBellOn, CiUser } from "react-icons/ci";
import { MdOutlineQuiz } from "react-icons/md";

function UpcomingEvents() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Weekly Tech Trivia",
      description: "Starts in 2 days",
      type: "quiz",
      date: "2023-10-15",
    },
    {
      id: 2,
      title: "Monthly Poll on Tech Trends",
      description: "Starts in 5 days",
      type: "poll",
      date: "2023-10-18",
    },
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#101323] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
            {/* Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Upcoming Events
              </p>
            </div>

            {/* Events List */}
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <table className="w-full text-left text-white border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-sm font-semibold text-[#8e99cc]">
                    <th className="px-4 py-2 bg-[#21284a] rounded-l-lg">
                      Type
                    </th>
                    <th className="px-4 py-2 bg-[#21284a]">
                      Title & Description
                    </th>
                    <th className="px-4 py-2 bg-[#21284a]">Scheduled On</th>
                    <th className="px-8 py-2 bg-[#21284a]  rounded-r-lg">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((event) => (
                    <tr key={event.id} className="bg-[#101323] rounded-lg">
                      {/* Type (Icon) */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center justify-center rounded-lg bg-[#21284a] size-10">
                          {event.type === "poll" && (
                            <FaPoll className="text-xl" />
                          )}
                          {event.type === "quiz" && (
                            <MdOutlineQuiz className="text-xl" />
                          )}
                        </div>
                      </td>

                      {/* Title + Description */}
                      <td className="px-4 py-3">
                        <p className="text-white font-medium line-clamp-1">
                          {event.title}
                        </p>
                        <p className="text-[#8e99cc] text-sm line-clamp-2">
                          {event.description}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="flex items-center px-4 py-3">
                        <p className="text-[#8e99cc] text-sm">{event.date}</p>
                      </td>

                      {/* Action Button */}
                      <td className="px-4 py-3">
                        <button className="flex items-center justify-center rounded-full h-8 px-4 bg-[#21284a] text-white text-sm font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col px-4 py-6">
                <div className="flex flex-col items-center gap-6">
                  <div
                    className="aspect-video w-full max-w-[360px] rounded-xl bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHQomzzNtUS9Umby2KZFuCABj_U9FlxzXnh1bYjVDpKl3cvMcLSxwZ_vcVfNschgAh70rrZIT9LKnHDCjT511wFFBMwmFgoAwNRiV8uHJrkzNxapJrjHNM70hvxLAG1LVdFLa6ZvsM-SUmXqXLVn2MECmUurcmBBxBjv5spjy5fNyqYTtHVyULJ-uFZ8MC299LGenKbL0mtnuEOph2J27a-OTNd4DYPVu8v6IQS6dCFOSbHJmlg4zUWACoY2aK-7H3gwsLuvIYUsSY")',
                    }}
                  ></div>
                  <div className="flex max-w-[480px] flex-col items-center gap-2">
                    <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em] text-center">
                      You haven't joined any upcoming polls or quizzes yet.
                    </p>
                    <p className="text-white text-sm font-normal leading-normal text-center">
                      Explore events to join or create your own.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingEvents;
