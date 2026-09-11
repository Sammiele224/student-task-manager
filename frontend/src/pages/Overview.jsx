import { useTasks } from "../components/features/Tasks/TaskContext";
import {
  daysOverdue,
  getDashboardStats,
  getOverdueTasks,
  getUpcomingTasks,
} from "../components/features/Tasks/taskStats";
import "../styles/overview.css";

/** "Sep 10" — the compact due date the dashboard lists use. */
function shortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function Overview() {
  /* Every figure below is derived from the shared task list, so marking a task
     done anywhere in the app moves these numbers straight away. */
  const { tasks, courses } = useTasks();

  const stats = getDashboardStats(tasks);
  const upcomingTasks = getUpcomingTasks(tasks);
  const overdueTasks = getOverdueTasks(tasks);

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
                    {shortDate(task.dueDate)}
                  </span>
                </div>
              ))}

              {upcomingTasks.length === 0 && (
                <p className="dashboard-empty">Nothing due yet. Enjoy the quiet.</p>
              )}
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
                      {daysOverdue(task)} days overdue
                    </p>
                  </div>
                </div>
              ))}

              {overdueTasks.length === 0 && (
                <p className="dashboard-empty">Nothing overdue. You&apos;re on top of it.</p>
              )}
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
              {courses.map((course) => (
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
