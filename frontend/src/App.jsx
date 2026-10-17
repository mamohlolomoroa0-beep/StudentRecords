
import { useState, useEffect } from 'react';
import './App.css';

const INITIAL_STUDENTS = [];

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('students');
      return saved !== null ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState('Enrolled');

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  function clearForm() {
    setStudentId('');
    setStudentName('');
    setAge('');
    setEmail('');
    setCourse('');
    setStatus('Enrolled');
    setEditingStudent(null);
  }

  function openAddForm() {
    clearForm();
    setShowModal(true);
  }

  function validateStudent() {
    const cleanId = studentId.trim();
    const cleanName = studentName.trim();
    const cleanEmail = email.trim();
    const cleanCourse = course.trim();
    const numericAge = Number(age);

    if (!cleanId || !cleanName || !cleanEmail || !cleanCourse) {
      alert('Please complete all student fields.');
      return null;
    }

    if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
      alert('Age must be a whole number between 1 and 120.');
      return null;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      alert('Please enter a valid email address.');
      return null;
    }

    const duplicate = students.some(
      (student) =>
        String(student.id).toLowerCase() === cleanId.toLowerCase() &&
        (!editingStudent || String(student.id) !== String(editingStudent.id))
    );

    if (duplicate) {
      alert('This Student ID already exists.');
      return null;
    }

    return {
      id: cleanId,
      fullName: cleanName,
      age: numericAge,
      email: cleanEmail,
      course: cleanCourse,
      status,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const studentData = validateStudent();
    if (!studentData) return;

    if (editingStudent) {
      setStudents((current) =>
        current.map((student) =>
          String(student.id) === String(editingStudent.id)
            ? studentData
            : student
        )
      );
    } else {
      setStudents((current) => [...current, studentData]);
    }

    clearForm();
    setShowModal(false);
  }

  function editStudent(student) {
    setEditingStudent(student);
    setStudentId(String(student.id));
    setStudentName(student.fullName);
    setAge(String(student.age));
    setEmail(student.email);
    setCourse(student.course);
    setStatus(student.status);
    setShowModal(true);
  }

  function requestDelete(student) {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  }
  
  function confirmDelete() {
    if (!studentToDelete) return;
  
    setStudents((current) =>
      current.filter(
        (student) =>
          String(student.id) !== String(studentToDelete.id)
      )
    );
  
    setShowDeleteModal(false);
    setStudentToDelete(null);
  }
  
  function cancelDelete() {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  }


  const filteredStudents = students.filter((student) => {
    const search = searchTerm.trim().toLowerCase();

    return [
      student.id,
      student.fullName,
      student.email,
      student.course,
    ].some((value) => String(value ?? '').toLowerCase().includes(search));
  });

  const enrolledCount = students.filter(
    (student) => student.status === 'Enrolled'
  ).length;

  const notEnrolledCount = students.length - enrolledCount;

  return (
    <div className="app">
      
      <header className="topbar">
  
</header> 
      

      <main className="dashboard">
        <section className="welcome-panel">
          <div>
          
            <h1>Student Records</h1>
            
          </div>
          <button className="add-button" onClick={openAddForm}>
            + Add Student
          </button>
        </section>

        <section className="stats-grid">
          <article className="stat-card total-card">
            <div className="stat-icon">♙</div>
            <div>
              <p>Total Students</p>
              <h2>{students.length}</h2>
              <span>All student records</span>
            </div>
          </article>

          <article className="stat-card enrolled-card">
            <div className="stat-icon">✓</div>
            <div>
              <p>Enrolled Students</p>
              <h2>{enrolledCount}</h2>
              <span>Currently enrolled</span>
            </div>
          </article>

          <article className="stat-card pending-card">
            <div className="stat-icon">◷</div>
            <div>
              <p>Not Enrolled</p>
              <h2>{notEnrolledCount}</h2>
              <span>Not currently enrolled</span>
            </div>
          </article>
        </section>

        <section className="records-panel">
          <div className="records-heading">
            <div>
              <h2>Manage Students</h2>
              <p>{filteredStudents.length} records shown</p>
            </div>
          
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search by name, ID, email or course..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>STUDENT ID</th>
                  <th>AGE</th>
                  <th>EMAIL ADDRESS</th>
                  <th>COURSE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-message">
                      <div className="empty-icon">♙</div>
                      <strong>
                        {students.length === 0
                          ? 'No student records yet'
                          : 'No matching students'}
                      </strong>
                      <p>
                        {students.length === 0
                          ? 'Add your first student to get started.'
                          : 'Try another name, ID, email, or course.'}
                      </p>
                      {students.length === 0 && (
                        <button className="add-button" onClick={openAddForm}>
                          + Add Your First Student
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name">
                          <div className="avatar">
                            {student.fullName
                              .split(' ')
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join('')
                              .toUpperCase()}
                          </div>
                          <strong>{student.fullName}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="student-id">{student.id}</span>
                      </td>
                      <td>{student.age}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>
                        <span
                          className={`status ${
                            student.status === 'Enrolled'
                              ? 'enrolled'
                              : 'not-enrolled'
                          }`}
                        >
                          <span className="status-dot"></span>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => editStudent(student)}
                          >
                            Edit
                          </button>
                          <button
                             className="delete-button"
                               onClick={() => requestDelete(student)}
                               >
                               Delete
                             </button> 
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="page-footer">
          <span>Student Management System</span>
          <span>Made for better student record management</span>
        </footer>
      </main>

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              clearForm();
              setShowModal(false);
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  STUDENT INFORMATION
                </span>
                <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
                <p>Enter the student's details below.</p>
              </div>
              <button
                type="button"
                className="close-button"
                aria-label="Close form"
                onClick={() => {
                  clearForm();
                  setShowModal(false);
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                placeholder="e.g. 1248"
                required
              />

              <label htmlFor="studentName">Full Name</label>
              <input
                id="studentName"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Enter full name"
                required
              />

              <div className="form-row">
                <div>
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    step="1"
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    placeholder="Age"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status">Enrollment Status</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="Enrolled">Enrolled</option>
                    <option value="Not Enrolled">Not Enrolled</option>
                  </select>
                </div>
              </div>

              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@example.com"
                required
              />

              <label htmlFor="course">Course of Study</label>
              <input
                id="course"
                value={course}
                onChange={(event) => setCourse(event.target.value)}
                placeholder="e.g. Business Information Technology"
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    clearForm();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="add-button">
                  {editingStudent ? 'Save Changes' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && studentToDelete && (
        <div className="modal-overlay">
          <div
            className="modal delete-confirmation-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">CONFIRM DELETION</span>
                <h2 id="delete-modal-title">Delete Student?</h2>
                <p id="delete-modal-description">
                  Are you sure you want to delete{" "}
                  <strong>{studentToDelete.fullName}</strong>?
                  This action cannot be undone.
                </p>
              </div>
      
              <button
                type="button"
                className="close-button"
                aria-label="Cancel deletion"
                onClick={cancelDelete}
              >
                ×
              </button>
            </div>
      
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={cancelDelete}
              >
                Cancel
              </button>
      
              <button
                type="button"
                className="delete-button"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;
