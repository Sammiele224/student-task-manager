import React, { useEffect, useState } from "react";
import "../styles/overview.css";

const stats = {
  totalTasks: 35,
  completedCount: 22,
  overdueCount: 3,
  dueThisWeekCount: 8,
  completionRate: 63,
};

const upcomingTasks = [
  {
    id: 102,
    title: "Build prototype presentation",
    courseName: "Web Engineering",
    courseCode: "IT3080",
    courseColor: "#3B82F6",
    dueDate: "Sep 10",
  },
  {
    id: 103,
    title: "Prepare capstone slides",
    courseName: "Web Engineering",
    courseCode: "IT3080",
    courseColor: "#3B82F6",
    dueDate: "Sep 11",
  },
  {
    id: 104,
    title: "Complete database assignment",
    courseName: "Database Systems",
    courseCode: "IT3020",
    courseColor: "#10B981",
    dueDate: "Sep 12",
  },
  {
    id: 105,
    title: "Review system design notes",
    courseName: "Software Engineering",
    courseCode: "IT3040",
    courseColor: "#8B5CF6",
    dueDate: "Sep 14",
  },
];

const overdueTasks = [
  {
    id: 101,
    title: "Submit capstone report",
    courseCode: "IT3080",
    courseColor: "#3B82F6",
    days: "4 days overdue",
  },
  {
    id: 106,
    title: "Finish SQL exercises",
    courseCode: "IT3020",
    courseColor: "#10B981",
    days: "3 days overdue",
  },
  {
    id: 107,
    title: "Upload weekly reflection",
    courseCode: "IT3040",
    courseColor: "#8B5CF6",
    days: "2 days overdue",
  },
];

// -----------------------------------------------------------------------
// FIXED: removed the hardcoded courses array, now fetches real data
// from /api/v1/courses (Day 4 task — Trân + Nhân)
// -----------------------------------------------------------------------

function Overview() {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  useEffect(() => {
    fetch("/api/v1/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load courses");
        return res.json();
      })
      .then((json) => setCourses(json.data)) // backend wraps response as { success, data }
      .catch((err) => setCoursesError(err.message))
      .finally(() => setCoursesLoading(false));
  }, []);

  return (
    <main className="dashboard">
      <div className="dashboard-container">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="header-label">OVERVIEW</p>
            <h1>Good to see you.</h1>
            <p className="header-subtitle">
              Here&apos;s what&apos;s happening with your studies.
            </p>
          </div>

          
        </header>

        {/* Stats */}
        <section className="stats-bar">
          <div className="stat-item">
            <strong>{stats.totalTasks}</strong>
            <span>Total tasks</span>
          </div>

          <div className="stat-item">
            <strong>{stats.completedCount}</strong>
            <span>Completed</span>
          </div>

          <div className="stat-item stat-danger">
            <strong>{stats.overdueCount}</strong>
            <span>Overdue</span>
          </div>

          <div className="stat-item">
            <strong>{stats.dueThisWeekCount}</strong>
            <span>Due this week</span>
          </div>
        </section>

        {/* Main content */}
        <section className="content-grid">

          {/* Upcoming */}
          <section className="section-card upcoming-card">
            <div className="section-heading">
              <div>
                <span>YOUR WORK</span>
                <h2>Upcoming tasks</h2>
              </div>

              <button>View all →</button>
            </div>

            <div className="task-list">
              {upcomingTasks.map((task) => (
                <div className="task-item" key={task.id}>
                  <span
                    className="task-dot"
                    style={{ backgroundColor: task.courseColor }}
                  />

                  <div className="task-info">
                    <h3>{task.title}</h3>

                    <p>
                      {task.courseName}
                      <span>·</span>
                      {task.courseCode}
                    </p>
                  </div>

                  <span className="task-due">
                    {task.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Progress */}
          <section className="section-card progress-card">
            <div className="section-heading">
              <div>
                <span>PROGRESS</span>
                <h2>This week</h2>
              </div>
            </div>

            <div className="progress-content">
              <div className="progress-number">
                <strong>{stats.completionRate}%</strong>
                <span>completed</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${stats.completionRate}%`,
                  }}
                />
              </div>

              <p>
                <strong>{stats.completedCount}</strong> of{" "}
                <strong>{stats.totalTasks}</strong> tasks completed
              </p>
            </div>
          </section>

          {/* Attention */}
          <section className="section-card attention-card">
            <div className="section-heading">
              <div>
                <span>OVERDUE</span>
                <h2>Needs attention</h2>
              </div>

              <button>View all →</button>
            </div>

            <div className="attention-list">
              {overdueTasks.map((task) => (
                <div className="attention-item" key={task.id}>
                  <span className="attention-icon">!</span>

                  <div className="attention-info">
                    <h3>{task.title}</h3>

                    <p>
                      <span
                        className="mini-dot"
                        style={{
                          backgroundColor: task.courseColor,
                        }}
                      />

                      {task.courseCode}
                      <span>·</span>
                      {task.days}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Courses */}
          <section className="section-card courses-card">
            <div className="section-heading">
              <div>
                <span>STUDY</span>
                <h2>Courses</h2>
              </div>

              <button>View all →</button>
            </div>

            <div className="course-list">
              {coursesLoading && <p>Loading courses...</p>}

              {coursesError && (
                <p style={{ color: "red" }}>{coursesError}</p>
              )}

              {!coursesLoading && !coursesError && courses.length === 0 && (
                <p>No courses yet.</p>
              )}

              {!coursesLoading && !coursesError &&
                courses.map((course) => (
                  <div className="course-item" key={course.id}>
                    <span
                      className="course-dot"
                      style={{
                        backgroundColor: course.color,
                      }}
                    />

                    <div>
                      <h3>{course.name}</h3>
                      <p>{course.code}</p>
                    </div>

                    <span className="course-arrow">→</span>
                  </div>
                ))}
            </div>
          </section>

        </section>
      </div>
    </main>
  );
}

export default Overview;
