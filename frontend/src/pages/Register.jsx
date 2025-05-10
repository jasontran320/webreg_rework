import React, { useState, useContext } from 'react';
import { CourseContext } from '../data/CourseContext.jsx'
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  function format_time(timeStr) {
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'pm' : 'am';
  
    if (hour === 0) {
      hour = 12; // midnight
    } else if (hour > 12) {
      hour -= 12;
    }
  
    return `${hour}:${minute}${period}`;
  }
  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Enhanced mock data with prerequisites and departments
  const { courses, setCourses, registeredCourses, setRegisteredCourses, waitlistedCourses, setWaitlistedCourses, blocks, setBlocks } = useContext(CourseContext)
  const checkOverlap = (newBlock) => {
  const overlappingBlocks = blocks.filter(block => {
    if (block.day !== newBlock.day) return false;
    
    const blockStart = convertTimeToMinutes(block.startTime);
    const blockEnd = convertTimeToMinutes(block.endTime);
    const newStart = convertTimeToMinutes(newBlock.startTime);
    const newEnd = convertTimeToMinutes(newBlock.endTime);
    return (newStart < blockEnd && newEnd > blockStart);
  });
  return overlappingBlocks.length > 0 ? overlappingBlocks : null;
};

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);

  // Available departments derived from courses
  const departments = ['all', ...new Set(courses.map(course => course.department))];

  // Progress towards degree with more details
  const degreeRequirements = {
    CS: {
      required: 40,
      completed: 12,
      description: "Lower-division computer science courses including introductory programming (ICS 31–33 or H32–33), C/C++ (ICS 45C), data structures (ICS 46), computer organization (ICS 51), systems design (ICS 53), and software engineering (IN4MATX 43)."
    },
    MATH: {
      required: 15,
      completed: 8,
      description: "Mathematics for CS majors including single-variable calculus (MATH 2A–2B), discrete math (ICS 6B & 6D), linear algebra (ICS 6N or MATH 3A), and statistics (STATS 67)."
    },
    ENG: {
      required: 6,
      completed: 3,
      description: "Two approved General Education Category II writing courses not offered by ICS, Engineering, Math, or Economics. University Studies courses allowed with approval."
    },
    Electives: {
      required: 30,
      completed: 12,
      description: "Upper-division CS electives and other approved courses beyond the core, supporting breadth and specialization in areas like AI, systems, or theory. Also supports out of major scope classes."
    }
  };

      const handleItemClick = (itemType) => {
      // Toggle active state for the clicked item
      // Example actions based on which item was clicked
      switch(itemType) {
        case 'completed':
          setSelectedDept('');
          setActiveTab('search');
          setSelectedFilter('completed')
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
          });
          // Add your functionality here - e.g., open a modal, navigate to details page
          break;
        case 'registered':
          setSelectedDept('');
          setActiveTab('registered');
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
          });

          break;
        case 'total':
          setSelectedDept('');
          setActiveTab('search');
          setSelectedFilter('required');

          setTimeout(() => {
            window.scrollTo({
              top: 700,
              behavior: 'smooth',
            });
          }, 50); // Adjust delay if needed

          break;
        case 'remaining':
          setSelectedDept('');
          setActiveTab('search');
          setSelectedFilter('required');

          setTimeout(() => {
            window.scrollTo({
              top: 700,
              behavior: 'smooth',
            });
          }, 50); // Adjust delay if needed

          break;
      }
    }
  
  const degreeProgress = {
    totalCredits: 120,
    completedCredits: 35,
    currentlyRegistered: registeredCourses.reduce((sum, course) => sum + course.credits, 0),
    remainingRequired: 120 - 35 - registeredCourses.reduce((sum, course) => sum + course.credits, 0),
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
    
    if (selectedFilter === 'all') return matchesSearch && matchesDepartment;
    if (selectedFilter === 'available') return matchesSearch && course.status === 'Available' && matchesDepartment && !course.completed;
    if (selectedFilter === 'required') return matchesSearch && course.required && matchesDepartment;
    if (selectedFilter === 'completed') return matchesSearch && course.completed && matchesDepartment;
    
    return matchesSearch && matchesDepartment;
  });

const requiredDepartments = ['CS', 'MATH', 'ENG'];

const groupedDegreeCourses = {
  CS: courses.filter(course => course.required && course.department === 'CS'),
  MATH: courses.filter(course => course.required && course.department === 'MATH'),
  ENG: courses.filter(course => course.required && course.department === 'ENG'),
  Electives: courses.filter(course => 
    !requiredDepartments.includes(course.department)
  )
};





  const handleDeptClick = (event, dept, reqData) => {
      // Toggle selection state
      console.log(groupedDegreeCourses)
      setSelectedDept(selectedDept === dept ? null : dept);
      setSelectedReq(selectedDept === dept ? null : reqData);
      
      // Example actions when a department is clicked
      console.log(`Department ${dept} clicked`);
      console.log(`Completion: ${reqData.completed}/${reqData.required}`);
      
      // Additional actions you might want to take:
      // - Navigate to department details page
      // - Open a modal with course listings
      // - Fetch additional data about this department
      // - Show a tooltip with more information
    }

  const handleRegister = (course) => {
    // Check if prerequisites are met
    const prereqsMet = checkPrerequisites(course);
    if (!prereqsMet) {
      alert(`You must complete the prerequisites for ${course.id} first!`);
      return;
    }
    const collision_block = checkOverlap(course.block);
    if (collision_block) {
      const blockTitles = collision_block
        .map(block => `${block.title}@${block.day}: ${format_time(block.startTime)} - ${format_time(block.endTime)}`)
        .join(', ');

      alert(`This course conflicts with your current schedule for the following event block(s): ${blockTitles}`);
      return;
    }


    if (course.status === 'Available') {
      // Mock registration - would be API call in real implementation
      setCourses(courses.map(c => 
        c.id === course.id 
          ? {...c, enrolled: c.enrolled + 1, status: 'Registered'}  // Update status to 'Registered'
          : c
      ));

      setBlocks(prevBlocks => [...prevBlocks, course.block]);
      
      setRegisteredCourses([...registeredCourses, {
        id: course.id,
        name: course.name,
        credits: course.credits,
        status: 'Registered',
        section: '001', // Default section
        department: course.department,
        block: course.block,
        location: course.location,
        description: course.description,
        prerequisites: course.prerequisites
      }]);
    } else if ((course.status === 'Full' || course.status === 'Waitlisted') && 
              !waitlistedCourses.some(c => c.id === course.id)) {
      // Join waitlist only if not already waitlisted
      setCourses(courses.map(c => 
        c.id === course.id 
          ? {...c, waitlist: c.waitlist + 1, status: 'Waitlisted'} 
          : c
      ));

      setBlocks(prevBlocks => [...prevBlocks, course.block]);
      
      setWaitlistedCourses([...waitlistedCourses, {
        id: course.id,
        name: course.name,
        credits: course.credits,
        waitlistPosition: course.waitlist + 1,
        section: '001', // Default section
        department: course.department,
        block: course.block,
        location: course.location,
        description: course.description,
        prerequisites: course.prerequisites
      }]);
    }
  };

  const handleDrop = (courseId) => {
    const course = courses.find(course => course.id === courseId);
    // Temporary array to store deleted courses
    let deleted_courses = [];

    // Preprocess: find all courses to delete from both lists
    registeredCourses.forEach(course => {
      if (course.id === courseId || course.prerequisites.includes(courseId)) {
        deleted_courses.push(course);
      }
    });

    waitlistedCourses.forEach(course => {
      if (course.prerequisites.includes(courseId)) {
        deleted_courses.push(course);
      }
    });
    const deletedString = deleted_courses.length > 1
      ? deleted_courses.slice(1).map(course => course.id).join(', ')
      : '';

    const confirmed = !deletedString || window.confirm(`Are you sure you want to delete ${course.id}? This is a prerequisite to these classes which will also be all dropped: ${deletedString}`);
      if (confirmed) {

        // Now filter the state lists
        setRegisteredCourses(
          registeredCourses.filter(course =>
            course.id !== courseId && !course.prerequisites.includes(courseId)
          )
        );

        setWaitlistedCourses(
          waitlistedCourses.filter(course =>
            !course.prerequisites.includes(courseId)
          )
        );

        const blockIdsToRemove = deleted_courses.map(course => course.block.id);
        const courseIdsToUpdate = deleted_courses.map(course => course.id);
        setBlocks(prevBlocks =>
          prevBlocks.filter(block => !blockIdsToRemove.includes(block.id))
        );

        setCourses(prevCourses =>
          prevCourses.map(course => {
            if (!courseIdsToUpdate.includes(course.id)) return course;

            if (course.status === 'Waitlisted') {
              return {
                ...course,
                waitlist: course.waitlist - 1,
                status: course.waitlist - 1 > 0 ? 'Waitlisted' : 'Available'
              };
            } else {
              const newEnrolled = course.enrolled - 1;
              return {
                ...course,
                enrolled: newEnrolled,
                status: newEnrolled < course.seats ? 'Available' : 'Waitlisted'
              };
            }
          })
        );
      }
    };

  const handleRemoveWaitlist = (courseId) => {
    const waitlistedCourse = waitlistedCourses.find(c => c.id === courseId);
    if (!waitlistedCourse) return;
    const course = courses.find(course => course.id === courseId);
    if (course) {
        const blockId = course.block.id;
        setBlocks(blocks.filter(block => block.id !== blockId));
    }
    setWaitlistedCourses(waitlistedCourses.filter(course => course.id !== courseId));
    
    // Update available courses
    setCourses(courses.map(c => 
      c.id === courseId 
        ? {...c, status: 'Waitlisted', waitlist: c.waitlist - 1} 
        : c
    ));
  };

  const checkPrerequisites = (course) => {
    if (!course.prerequisites || course.prerequisites.length === 0) return true;
    
    // Check if prerequisites are completed or currently registered
    return course.prerequisites.every(prereqId => 
      courses.find(c => c.id === prereqId && c.completed) || 
      registeredCourses.some(c => c.id === prereqId)
    );
  };

  const getStatusClass = (status, completed) => {
    if (completed) return 'status-completed'
    switch(status) {
      case 'Available': return 'status-available';
      case 'Waitlisted': return 'status-waitlisted';
      case 'Full': return 'status-full';
      case 'Registered': return 'status-registered';
      default: return '';
    }
  };

  const toggleCourseDetails = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  return (
    <div className="registration-container">
      <h1>Course Registration</h1>
      
      <div className="degree-progress">
        <h2>Degree Progress</h2>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${(degreeProgress.completedCredits / degreeProgress.totalCredits) * 100}%` }}
          >
            {Math.round((degreeProgress.completedCredits / degreeProgress.totalCredits) * 100)}%
          </div>
        </div>



                
        <div className="progress-details">
          <div 
            className={`progress-item`}
            onClick={() => handleItemClick('completed')}
          >
            <span>Completed Credits:</span>
            <span>{degreeProgress.completedCredits}</span>
          </div>
          <div 
            className={`progress-item`}
            onClick={() => handleItemClick('registered')}
          >
            <span>Credits Currently Registered:</span>
            <span>{degreeProgress.currentlyRegistered}</span>
          </div>
          <div 
            className={`progress-item`}
            onClick={() => handleItemClick('total')}
          >
            <span>Total Credits Required:</span>
            <span>{degreeProgress.totalCredits}</span>
          </div>
          <div 
            className={`progress-item`}
            onClick={() => handleItemClick('remaining')}
          >
            <span>Remaining Credits Required:</span>
            <span>{degreeProgress.remainingRequired}</span>
          </div>
        </div>
        



        {/* Detailed degree requirements by department */}
        <div className="degree-requirements">
  <h3>Department Requirements</h3>
  <div className="requirements-list">
    {Object.entries(degreeRequirements).map(([dept, req]) => (
      <div 
        key={dept} 
        className={`requirement-item ${selectedDept === dept ? 'active' : ''}`}
        onClick={(e) => handleDeptClick(e, dept, req)}
      >
        <span>{dept}:</span>
        <div className="req-progress">
          <div
            className="req-progress-bar"
            style={{ width: `${(req.completed / req.required) * 100}%` }}
          ></div>
        </div>
        <span>{req.completed}/{req.required} credits</span>
      </div>
    ))}
  </div>
  
  {/* Optional: Detail panel that appears when a department is clicked */}
      {selectedDept && selectedReq &&(
        <div className="requirement-details">
          {/* Simple styled department details */}
          <h4 className="dept-detail-heading">{selectedDept} Details</h4>
          <p className="dept-desc">{selectedReq.description}</p>
          {groupedDegreeCourses[selectedDept].length > 0 && (<div className="divider"></div>)}
  



        {groupedDegreeCourses[selectedDept]?.length > 0 ? (
      groupedDegreeCourses[selectedDept].map(course => (
                <React.Fragment key={course.id}>

                  <div className="course-item" onClick={() => toggleCourseDetails(course.id)}>
                    <span className="course-id">{course.id}</span>
                    <span className="course-name">
                      {course.name}
                      {course.required && <span className="required-badge">Required</span>}
                      {course.completed && <span className="completed-badge">Completed</span>}
                    </span>
                    <span className="course-credits">{course.credits}</span>
                    <span className={`course-status ${getStatusClass(course.status, course.completed)}`}>
                      {course.completed ? 'Complete': course.status}
                    </span>
                    <span className="course-availability">
                      {course.seats - course.enrolled} / {course.seats} seats
                      {course.waitlist > 0 && <span> (Waitlist: {course.waitlist})</span>}
                    </span>
                    <span className="course-action" onClick={(e) => e.stopPropagation()}>
                      {course.completed ? (
                        <button disabled className="button-disabled">Completed</button>
                      ) : registeredCourses.some(c => c.id === course.id) ? (
                        <button disabled className="button-disabled">Registered</button>
                      ) : waitlistedCourses.some(c => c.id === course.id) ? (
                        <button disabled className="button-disabled">On Waitlist</button>
                      ) : (
                        <button 
                          onClick={() => handleRegister(course)}
                          className={checkPrerequisites(course) ? (course.status === 'Available' ? 'button-register' : 'button-waitlist'): 'button-restricted'}
                          disabled={!checkPrerequisites(course)}
                          title={!checkPrerequisites(course) ? "Prerequisites not met" : ""}
                        >
                          {checkPrerequisites(course) ? (course.status === 'Available' ? 'Register' : 'Join Waitlist') : 'Restricted'}
                        </button>
                      )}
                    </span>
                  </div>
                  
                  {expandedCourseId === course.id && (
                    <div className="course-details">
                      <div className="details-section">
                        <h4>Course Details</h4>
                        <p>{course.description}</p>
                        <p><strong>Day:</strong> {course.block.day.charAt(0).toUpperCase() + course.block.day.slice(1)}</p>
                        <p><strong>Time:</strong> {format_time(course.block.startTime)} - {format_time(course.block.endTime)}</p>
                        <p><strong>Location:</strong> {course.location}</p>
                        <p><strong>Department:</strong> {course.department}</p>
                        <p><strong>Prerequisites:</strong> {course.prerequisites.length > 0 ? 
                          course.prerequisites.join(', ') : 'None'}
                        </p>
                        <div className="prerequisite-status">
                          {course.prerequisites.map(prereq => {
                            const prereqCourse = courses.find(c => c.id === prereq);
                            const isCompleted = prereqCourse && prereqCourse.completed;
                            const isRegistered = registeredCourses.some(c => c.id === prereq);
                            return (
                              <div key={prereq} className={`prereq-item ${isCompleted ? 'completed' : isRegistered ? 'registered' : 'missing'}`}>
                                {prereq}: {isCompleted ? 'Completed' : isRegistered ? 'Currently Registered' : 'Not Completed'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="no-results">No courses matching your search criteria</div>
            )}

          
          {/* You could add a list of courses taken or still needed here */}
          {selectedReq.courses && (
            <div>
              <h5>Courses Taken:</h5>
              <ul>
                {selectedReq.courses.map(course => (
                  <li key={course.id}>{course.code}: {course.name} ({course.credits} cr)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>











      </div>





      <div className="tabs">
        <button 
          className={activeTab === 'search' ? 'active' : ''} 
          onClick={() => setActiveTab('search')}
        >
          Course Search
        </button>
        <button 
          className={activeTab === 'registered' ? 'active' : ''} 
          onClick={() => setActiveTab('registered')}
        >
          Registered Courses
        </button>
        <button 
          className={activeTab === 'waitlisted' ? 'active' : ''} 
          onClick={() => setActiveTab('waitlisted')}
        >
          Waitlisted Courses
        </button>
      </div>

      {activeTab === 'search' && (
        <div className="search-section">
          <div className="search-controls">
            <input
              type="text"
              placeholder="Search courses by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="filter-options">
              <button 
                className={selectedFilter === 'all' ? 'active' : ''} 
                onClick={() => setSelectedFilter('all')}
              >
                All
              </button>
              <button 
                className={selectedFilter === 'available' ? 'active' : ''} 
                onClick={() => setSelectedFilter('available')}
              >
                Available
              </button>
              <button 
                className={selectedFilter === 'required' ? 'active' : ''} 
                onClick={() => setSelectedFilter('required')}
              >
                Required
              </button>
              <button 
                className={selectedFilter === 'completed' ? 'active' : ''} 
                onClick={() => setSelectedFilter('completed')}
              >
                Completed
              </button>
            </div>
            
            {/* Department filter */}
            <div className="department-filter">
              <label>Department:</label>
              <select 
                className='department-options'
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="course-list">
            <div className="course-header">
              <span className="course-id">Course ID</span>
              <span className="course-name">Course Name</span>
              <span className="course-credits">Credits</span>
              <span className="course-status">Status</span>
              <span className="course-availability">Availability</span>
              <span className="course-action">Action</span>
            </div>












            
            
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <React.Fragment key={course.id}>
                  <div className="course-item" onClick={() => toggleCourseDetails(course.id)}>
                    <span className="course-id">{course.id}</span>
                    <span className="course-name">
                      {course.name}
                      {course.required && <span className="required-badge">Required</span>}
                      {course.completed && <span className="completed-badge">Completed</span>}
                    </span>
                    <span className="course-credits">{course.credits}</span>
                    <span className={`course-status ${getStatusClass(course.status, course.completed)}`}>
                      {course.completed ? 'Complete': course.status}
                    </span>
                    <span className="course-availability">
                      {course.seats - course.enrolled} / {course.seats} seats
                      {course.waitlist > 0 && <span> (Waitlist: {course.waitlist})</span>}
                    </span>
                    <span className="course-action" onClick={(e) => e.stopPropagation()}>
                      {course.completed ? (
                        <button disabled className="button-disabled">Completed</button>
                      ) : registeredCourses.some(c => c.id === course.id) ? (
                        <button disabled className="button-disabled">Registered</button>
                      ) : waitlistedCourses.some(c => c.id === course.id) ? (
                        <button disabled className="button-disabled">On Waitlist</button>
                      ) : (
                        <button 
                          onClick={() => handleRegister(course)}
                          className={checkPrerequisites(course) ? (course.status === 'Available' ? 'button-register' : 'button-waitlist'): 'button-restricted'}
                          disabled={!checkPrerequisites(course)}
                          title={!checkPrerequisites(course) ? "Prerequisites not met" : ""}
                        >
                          {checkPrerequisites(course) ? (course.status === 'Available' ? 'Register' : 'Join Waitlist') : 'Restricted'}
                        </button>
                      )}
                    </span>
                  </div>
                  
                  {expandedCourseId === course.id && (
                    <div className="course-details">
                      <div className="details-section">
                        <h4>Course Details</h4>
                        <p>{course.description}</p>
                        <p><strong>Day:</strong> {course.block.day.charAt(0).toUpperCase() + course.block.day.slice(1)}</p>
                        <p><strong>Time:</strong> {format_time(course.block.startTime)} - {format_time(course.block.endTime)}</p>
                        <p><strong>Location:</strong> {course.location}</p>
                        <p><strong>Department:</strong> {course.department}</p>
                        <p><strong>Prerequisites:</strong> {course.prerequisites.length > 0 ? 
                          course.prerequisites.join(', ') : 'None'}
                        </p>
                        <div className="prerequisite-status">
                          {course.prerequisites.map(prereq => {
                            const prereqCourse = courses.find(c => c.id === prereq);
                            const isCompleted = prereqCourse && prereqCourse.completed;
                            const isRegistered = registeredCourses.some(c => c.id === prereq);
                            return (
                              <div key={prereq} className={`prereq-item ${isCompleted ? 'completed' : isRegistered ? 'registered' : 'missing'}`}>
                                {prereq}: {isCompleted ? 'Completed' : isRegistered ? 'Currently Registered' : 'Not Completed'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="no-results">No courses matching your search criteria</div>
            )}
          </div>
        </div>
      )}













      {activeTab === 'registered' && (
  <div className="registered-section">
    <h2>Your Registered Courses</h2>
    
    {registeredCourses.length > 0 ? (
      <div className="registered-courses">
        <div className="course-header">
          <span className="course-id">Course ID</span>
          <span className="course-name">Course Name</span>
          <span className="course-credits">Credits</span>
          <span className="course-section">Section</span>
          <span className="course-action">Action</span>
        </div>
        
        {registeredCourses.map(course => {
          // Find the original course with full details
          const courseDetails = courses.find(c => c.id === course.id) || {
            prerequisites: [],
            department: course.department || 'Unknown'
          };
          
          return (
            <React.Fragment key={course.id}>
              <div 
                className="course-item" 
                onClick={() => toggleCourseDetails(`registered-${course.id}`)}
              >
                <span className="course-id">{course.id}</span>
                <span className="course-name">{course.name}</span>
                <span className="course-credits">{course.credits}</span>
                <span className="course-section">{course.section}</span>
                <span className="course-action" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleDrop(course.id)} className="button-drop">
                    Drop Course
                  </button>
                </span>
              </div>
              
              {expandedCourseId === `registered-${course.id}` && (
                <div className="course-details">
                  <div className="details-section">
                    <h4>Course Details</h4>
                    <p>{course.description}</p>
                    <p><strong>Day:</strong> {course.block.day.charAt(0).toUpperCase() + course.block.day.slice(1)}</p>
                    <p><strong>Time:</strong> {format_time(course.block.startTime)} - {format_time(course.block.endTime)}</p>
                    <p><strong>Location:</strong> {course.location}</p>
                    <p><strong>Department:</strong> {courseDetails.department}</p>
                    <p><strong>Section:</strong> {course.section}</p>
                    <p><strong>Status:</strong> <span className="status-registered2">Registered</span></p>
                    
                    {courseDetails.prerequisites && courseDetails.prerequisites.length > 0 && (
                      <>
                        <p><strong>Prerequisites:</strong> {courseDetails.prerequisites.join(', ')}</p>
                        <div className="prerequisite-status">
                          {courseDetails.prerequisites.map(prereq => {
                            const prereqCourse = courses.find(c => c.id === prereq);
                            const isCompleted = prereqCourse && prereqCourse.completed;
                            const isRegistered = registeredCourses.some(c => c.id === prereq);
                            return (
                              <div key={prereq} className={`prereq-item ${isCompleted ? 'completed' : isRegistered ? 'registered' : 'missing'}`}>
                                {prereq}: {isCompleted ? 'Completed' : isRegistered ? 'Currently Registered' : 'Not Completed'}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                    
                    <div className="course-actions">
                      <p><strong>Actions:</strong></p>
                      <div className="additional-actions">
                        <button onClick={() => navigate('/plan')} className="button-secondary">View Schedule</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        
        <div className="course-summary">
          <span>Total Courses: {registeredCourses.length}</span>
          <span>Total Credits: {registeredCourses.reduce((sum, course) => sum + course.credits, 0)}</span>
        </div>
      </div>
    ) : (
      <div className="no-results">You haven't registered for any courses yet</div>
    )}
  </div>
)}
      















{activeTab === 'waitlisted' && (
  <div className="waitlisted-section">
    <h2>Your Waitlisted Courses</h2>
    
    {waitlistedCourses.length > 0 ? (
      <div className="waitlisted-courses">
        <div className="course-header">
          <span className="course-id">Course ID</span>
          <span className="course-name">Course Name</span>
          <span className="course-credits">Credits</span>
          <span className="course-waitlist">Waitlist Position</span>
          <span className="course-action">Action</span>
        </div>
        
        {waitlistedCourses.map(course => {
          // Find the original course with full details
          const courseDetails = courses.find(c => c.id === course.id) || {
            prerequisites: [],
            department: course.department || 'Unknown',
            seats: 0,
            enrolled: 0
          };
          
          return (
            <React.Fragment key={course.id}>
              <div 
                className="course-item" 
                onClick={() => toggleCourseDetails(`waitlist-${course.id}`)}
              >
                <span className="course-id">{course.id}</span>
                <span className="course-name">{course.name}</span>
                <span className="course-credits">{course.credits}</span>
                <span className="course-waitlist">{course.waitlistPosition}</span>
                <span className="course-action" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleRemoveWaitlist(course.id)} className="button-drop">
                    Remove from Waitlist
                  </button>
                </span>
              </div>
              
              {expandedCourseId === `waitlist-${course.id}` && (
                <div className="course-details">
                  <div className="details-section">
                    <h4>Course Details</h4>
                    <p>{course.description}</p>
                    <p><strong>Day:</strong> {course.block.day.charAt(0).toUpperCase() + course.block.day.slice(1)}</p>
                    <p><strong>Time:</strong> {format_time(course.block.startTime)} - {format_time(course.block.endTime)}</p>
                    <p><strong>Location:</strong> {course.location}</p>
                    <p><strong>Department:</strong> {courseDetails.department}</p>
                    <p><strong>Waitlist Position:</strong> {course.waitlistPosition}</p>
                    <p><strong>Course Status:</strong> <span className="status-waitlisted2">Waitlisted</span></p>
                    <p><strong>Enrollment:</strong> {courseDetails.enrolled} / {courseDetails.seats} (Full)</p>
                    
                    {courseDetails.prerequisites && courseDetails.prerequisites.length > 0 && (
                      <>
                        <p><strong>Prerequisites:</strong> {courseDetails.prerequisites.join(', ')}</p>
                        <div className="prerequisite-status">
                          {courseDetails.prerequisites.map(prereq => {
                            const prereqCourse = courses.find(c => c.id === prereq);
                            const isCompleted = prereqCourse && prereqCourse.completed;
                            const isRegistered = registeredCourses.some(c => c.id === prereq);
                            return (
                              <div key={prereq} className={`prereq-item ${isCompleted ? 'completed' : isRegistered ? 'registered' : 'missing'}`}>
                                {prereq}: {isCompleted ? 'Completed' : isRegistered ? 'Currently Registered' : 'Not Completed'}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                    
                    <div className="waitlist-info">
                      <p><strong>Estimated Time to Registration:</strong> Based on your position, you may be able to register in 1-2 weeks</p>
                      <p><strong>Notification:</strong> You will be notified when a spot becomes available</p>
                    </div>
                    
                    <div className="course-actions">
                      <p><strong>Actions:</strong></p>
                      <div className="additional-actions">
                        <button onClick={() => navigate('/plan')} className="button-secondary">View Schedule</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    ) : (
      <div className="no-results">You aren't on any waitlists</div>
    )}
  </div>
)}
      














      <div className="registration-legend">
        <h3>Status Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color status-available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-color status-waitlisted"></span>
            <span>Waitlisted</span>
          </div>
          <div className="legend-item">
            <span className="legend-color status-full"></span>
            <span>Full</span>
          </div>
          <div className="legend-item">
            <span className="legend-color status-registered"></span>
            <span>Registered</span>
          </div>
          <div className="legend-item">
            <span className="legend-color status-complete"></span>
            <span>Complete</span>
          </div>
          <div className="legend-item">
            <span className="legend-color status-restricted"></span>
            <span>Prerequisites not met</span>
          </div>
        </div>
      </div>
    </div>
  );
}