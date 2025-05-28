import React, { useState, useContext, useCallback, useEffect  } from 'react';
import { CourseContext } from '../data/CourseContext.jsx'
import { useNavigate } from 'react-router-dom';
import { Computer } from 'lucide-react';
import Pagination from '../components/Pagination.jsx';

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
  const { courses, setCourses, registeredCourses, setRegisteredCourses, waitlistedCourses, setWaitlistedCourses, blocks, setBlocks, corequisiteCourses, setCorequisiteCourses } = useContext(CourseContext)
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
  const [expandedCourseId2, setExpandedCourseId2] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);

  // Available departments derived from courses
  const departments = ['all', ...new Set(courses.map(course => course.department))];

  // Progress towards degree with more details
  const degreeRequirements = {
    CS: {
      required: 40,
      completed: 12,
      icon: '💻',
      description: "Lower-division computer science courses including introductory programming (ICS 31–33 or H32–33), C/C++ (ICS 45C), data structures (ICS 46), computer organization (ICS 51), systems design (ICS 53), and software engineering (IN4MATX 43)."
    },
    MATH: {
      required: 15,
      completed: 8,
      icon: '📐',
      description: "Mathematics for CS majors including single-variable calculus (MATH 2A–2B), discrete math (ICS 6B & 6D), linear algebra (ICS 6N or MATH 3A), and statistics (STATS 67)."
    },
    ENG: {
      required: 6,
      completed: 3,
      icon: '📚 ',
      description: "Two approved General Education Category II writing courses not offered by ICS, Engineering, Math, or Economics. University Studies courses allowed with approval."
    },
    Electives: {
      required: 30,
      completed: 12,
      icon: '🌍',
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
          // window.scrollTo({
          //   top: document.body.scrollHeight,
          //   behavior: "smooth"
          // });
        setTimeout(() => {
            const courseList = document.querySelector('.course-list');
            if (courseList) {
              const offset = 100; // scroll 100px *above* the element
              const top = courseList.getBoundingClientRect().top + window.scrollY - offset;

              window.scrollTo({
                top,
                behavior: 'smooth',
              });
            }
          }, 25);
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
              const courseList = document.querySelector('.course-list');
              if (courseList) {
                const offset = 100; // scroll 100px *above* the element
                const top = courseList.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                  top,
                  behavior: 'smooth',
                });
              }
            }, 25);

          break;
        case 'remaining':
          setSelectedDept('');
          setActiveTab('search');
          setSelectedFilter('required');

          setTimeout(() => {
              const courseList = document.querySelector('.course-list');
              if (courseList) {
                const offset = 100; // scroll 100px *above* the element
                const top = courseList.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                  top,
                  behavior: 'smooth',
                });
              }
            }, 25);

          break;
      }
    }
  
  const degreeProgress = {
    totalCredits: 120,
    completedCredits: 35,
    currentlyRegistered: registeredCourses.reduce((sum, course) => sum + course.credits, 0),
    currentlyWaitlisted: waitlistedCourses.reduce((sum, course) => sum + course.credits, 0),
    remainingRequired: 120 - 35 - registeredCourses.reduce((sum, course) => sum + course.credits, 0),
  };

const filteredCourses = courses.filter(course => {
  // Exclude corequisites
  if (course.iscorequisite) return false;
  const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        course.id.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
  if (selectedFilter === 'all') {
    return matchesSearch && matchesDepartment;
  }
  if (selectedFilter === 'available') {
    return matchesSearch && course.status === 'Available' && matchesDepartment && !course.completed;
  }
  if (selectedFilter === 'required') {
    return matchesSearch && course.required && matchesDepartment;
  }
  if (selectedFilter === 'completed') {
    return matchesSearch && course.completed && matchesDepartment;
  }
  return matchesSearch && matchesDepartment;
});


const requiredDepartments = ['CS', 'MATH', 'ENG'];

const groupedDegreeCourses = {
  CS: courses.filter(course => 
    course.required && 
    course.department === 'CS' && 
    !course.iscorequisite // Exclude corequisite-only courses
  ),
  MATH: courses.filter(course => 
    course.required && 
    course.department === 'MATH' && 
    !course.iscorequisite // Exclude corequisite-only courses
  ),
  ENG: courses.filter(course => 
    course.required && 
    course.department === 'ENG' && 
    !course.iscorequisite // Exclude corequisite-only courses
  ),
  Electives: courses.filter(course => 
    !requiredDepartments.includes(course.department) && 
    !course.iscorequisite // Exclude corequisite-only courses
  )
};






  const handleDeptClick = (event, dept, reqData) => {
      // Toggle selection state
      setSelectedDept(selectedDept === dept ? null : dept);
      setSelectedReq(selectedDept === dept ? null : reqData);
    }


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
  if (course.status === 'Full') return false;

  if (course.iscorequisite && course.prerequisites.length === 1) {
    const parentId = course.prerequisites[0];
    const parentCourse = registeredCourses.find(c => c.id === parentId);
    
    if (parentCourse && hasRegisteredCorequisite(parentCourse, registeredCourses)) {
      return false;
    }
  }


  return course.prerequisites.every(prereqId => {
    const prereqCourse = courses.find(c => c.id === prereqId);
    if (!prereqCourse) return false;

    // If the prereq course was completed, we're good.
    if (prereqCourse.completed) return true;

    // If the course is marked as a corequisite, check if the prereq is currently registered.
    if (course.iscorequisite) {
      return registeredCourses.some(rc => rc.id === prereqId);
    }

    // Otherwise, prereq must be completed (already handled), so fail here.
    return false;
  });
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

const getStatusClass2 = (course) => {
  if (course.completed) return 'status-completed';

  switch(course.status) {
    case 'Available':
      return 'status-available';

    case 'Waitlisted':
      return 'status-waitlisted';

    case 'Full':
      return 'status-full';

    case 'Registered': {
      if (hasRegisteredCorequisite(course)) return 'status-registered';
      return 'status-requires-action2'
    }

    default:
      return '';
  }
};


  const toggleCourseDetails = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
    setExpandedCourseId2(null);
  };
  
   const toggleCourseDetails2 = (courseId) => {
    setExpandedCourseId2(expandedCourseId2 === courseId ? null : courseId);
  };
  



  const handleDrop = useCallback((courseId, isPropogation=true) => {
  try {
    const course = courses.find(course => course.id === courseId);
    if (!course) {
      console.error('Course not found:', courseId);
      return false;
    }

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
    

    const confirmed = !deletedString || window.confirm(
      `Are you sure you want to drop ${courseId}? This is a prerequisite to these classes which will also be dropped: ${deletedString}`
    );
    
    if (!deletedString && isPropogation) {
        let confirm = window.confirm(
      `Are you sure you want to drop ${courseId}? This is a registered class, you may not re-register in the future depending on enrollment status`
      );
      if (!confirm) {return false;}
    }
    
    if (confirmed) {
      // Get all block IDs and course IDs to update before state changes
      const blockIdsToRemove = deleted_courses.map(course => course.block.id);
      const courseIdsToUpdate = deleted_courses.map(course => course.id);

      // Batch all state updates together
      setRegisteredCourses(prev =>
        prev.filter(course =>
          course.id !== courseId && !course.prerequisites.includes(courseId)
        )
      );

      setWaitlistedCourses(prev =>
        prev.filter(course =>
          !course.prerequisites.includes(courseId)
        )
      );

      setBlocks(prevBlocks =>
        prevBlocks.filter(block => !blockIdsToRemove.includes(block.id))
      );

      setCourses(prevCourses =>
        prevCourses.map(course => {
          if (!courseIdsToUpdate.includes(course.id)) return course;

          if (course.status === 'Waitlisted') {
            const newWaitlist = course.waitlist - 1;
            return {
              ...course,
              waitlist: Math.max(0, newWaitlist),
              status: newWaitlist > 0 ? 'Waitlisted' : 'Available'
            };
          } else {
            const newEnrolled = Math.max(0, course.enrolled - 1);
            return {
              ...course,
              enrolled: newEnrolled,
              status: newEnrolled < course.seats ? 'Available' : 'Waitlisted'
            };
          }
        })
      );
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error dropping course:', error);
    alert('An error occurred while dropping the course. Please try again.');
    return false;
  }
}, [
  courses, 
  registeredCourses, 
  waitlistedCourses, 
  setRegisteredCourses, 
  setWaitlistedCourses, 
  setBlocks, 
  setCourses
]);

const handleDeleteBlock = useCallback((blockId) => {
  try {
    const findCourseByBlockId = (courses) => {
      return courses.find(course => course.block?.id === blockId);
    };

    const courseInRegistered = findCourseByBlockId(registeredCourses);
    const courseInWaitlisted = findCourseByBlockId(waitlistedCourses);

    let deleted = false;

    if (courseInRegistered) {
      const dropped = handleDrop(courseInRegistered.id, false);
      deleted = dropped;
    } else if (courseInWaitlisted) {
      setWaitlistedCourses(prev =>
        prev.filter(course => course.id !== courseInWaitlisted.id)
      );
      setBlocks(prev => prev.filter(block => block.id !== blockId));
      deleted = true;
    } else {
      // Check if block exists before trying to delete
      const blockExists = blocks.some(block => block.id === blockId);
      if (blockExists) {
        setBlocks(prev => prev.filter(block => block.id !== blockId));
        deleted = true;
      } else {
        deleted = false;
      }
    }

    return deleted;
  } catch (error) {
    console.error('Error deleting block:', error);
    return false;
  }
}, [registeredCourses, waitlistedCourses, blocks, handleDrop]);

const handleRegister = useCallback((course) => {
  try {
    // Check if prerequisites are met
    const prereqsMet = checkPrerequisites(course);
    if (!prereqsMet) {
      alert(`You must complete the prerequisites for ${course.id} first!`);
      return;
    }

    if (degreeProgress.currentlyRegistered + degreeProgress.currentlyWaitlisted + course.credits > 18) {
      let total = degreeProgress.currentlyRegistered + degreeProgress.currentlyWaitlisted
      alert(`You currently have ${total} registered and/or waitlisted units. You can only register maximum 18. Registering in this class will exceed that threshold. Please contact your administrators for special circumstances`);
      return;
    }

    const collision_block = checkOverlap(course.block);
    if (collision_block && collision_block.length > 0) {
      const blockTitles = collision_block
        .map(block => `${block.title}@${block.day}: ${format_time(block.startTime)} - ${format_time(block.endTime)}`)
        .join(', ');

      const confirmed = window.confirm(
        `Are you sure you want to register for ${course.id}? This conflicts with these event blocks which will be replaced and dropped: ${blockTitles}.`
      );
      
      if (confirmed) {
        // Delete all conflicting blocks
        let allDeleted = true;
        const failedBlocks = [];
        
        for (const block of collision_block) {
          console.log('Deleting Block ID:', block.id);
          const result = handleDeleteBlock(block.id);
          if (!result) {
            allDeleted = false;
            failedBlocks.push(block.title || block.id);
          }
        }
        
        if (!allDeleted) {
          return;
        }
      } else {
        return;
      }
    }

    // Proceed with registration
    if (course.status === 'Available') {
      // Create the new registered course object
      const newRegisteredCourse = {
        id: course.id,
        name: course.name,
        credits: course.credits,
        status: 'Registered',
        section: '001',
        department: course.department,
        block: course.block,
        location: course.location,
        description: course.description,
        prerequisites: course.prerequisites,
        corequisites: course.corequisites,
        iscorequisite: course.iscorequisite
      };

      // Batch all state updates together
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === course.id 
            ? {...c, enrolled: c.enrolled + 1, status: 'Registered'}
            : c
        )
      );

      setBlocks(prevBlocks => [...prevBlocks, course.block]);
      setRegisteredCourses(prev => [...prev, newRegisteredCourse]);
      if (course.corequisites.length > 0) window.alert(`Successfully registered for ${course.id} (${course.name}). Please ensure you enroll in all corequisite courses to not be dropped.`);

    } else if ((course.status === 'Waitlisted') && 
              !waitlistedCourses.some(c => c.id === course.id)) {
      
      // Create the new waitlisted course object
      const newWaitlistedCourse = {
        id: course.id,
        name: course.name,
        credits: course.credits,
        waitlistPosition: course.waitlist + 1,
        section: '001',
        department: course.department,
        block: course.block,
        location: course.location,
        description: course.description,
        prerequisites: course.prerequisites
      };

      // Batch all state updates together
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === course.id 
            ? {...c, waitlist: c.waitlist + 1, status: 'Waitlisted'} 
            : c
        )
      );

      setBlocks(prevBlocks => [...prevBlocks, course.block]);
      setWaitlistedCourses(prev => [...prev, newWaitlistedCourse]);
      if (course.corequisites.length > 0) window.alert(`Successfully waitlisted for ${course.id} (${course.name}). Please ensure you enroll in all corequisite courses if you get registered!`);
    }
  } catch (error) {
    console.error('Error registering for course:', error);
    alert('An error occurred while registering for the course. Please try again.');
  }
}, [
  checkPrerequisites, 
  checkOverlap, 
  format_time, 
  handleDeleteBlock, 
  waitlistedCourses, 
  setCourses, 
  setBlocks, 
  setRegisteredCourses, 
  setWaitlistedCourses
]);

const [sortBy, setSortBy] = useState('department-asc');


function hasRegisteredCorequisite(course) {
  if (!course.corequisites || course.corequisites.length === 0) {
    return true;
  }

  return course.corequisites.some(coreqId =>
    registeredCourses.some(registered => registered.id === coreqId)
  );
}




const sortOptions = [
  { value: 'alphabetical-asc', label: 'Course Name (A-Z)' },
  { value: 'alphabetical-desc', label: 'Course Name (Z-A)' },
  { value: 'department-asc', label: 'Course ID (A-Z)' },
  { value: 'department-desc', label: 'Course ID (Z-A)' }
];





  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 per page
  const perPageOptions = [5, 10, 20, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);

// Add this function to handle page changes
const handlePageChange = (page) => {
  setCurrentPage(page);
  console.log(corequisiteCourses)
  
  setTimeout(() => {
    const courseList = document.querySelector('.course-list');
    if (courseList) {
      const offset = 100; // scroll 100px *above* the element
      const top = courseList.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }, 25);
};


// Add this function to get the current list based on active tab
const getCurrentList = () => {
  switch (activeTab) {
    case 'search':
      return filteredCourses;
    case 'registered':
      return registeredCourses;
    case 'waitlisted':
      return waitlistedCourses;
    default:
      return [];
  }
};

// Add this function to get paginated results
const getPaginatedResults = () => {
  const currentList = getCurrentList();
  const sortedList = [...currentList].sort((a, b) => {
  switch (sortBy) {
    case 'alphabetical-asc':
      return a.name.localeCompare(b.name);
    case 'alphabetical-desc':
      return b.name.localeCompare(a.name);
    case 'department-asc':
      return a.id.localeCompare(b.id);
    case 'department-desc':
      return b.id.localeCompare(a.id);
    default:
      return 0;
  }
});
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sortedList.slice(startIndex, endIndex);
};

// Reset currentPage when filters change (add this useEffect)
useEffect(() => {
  setCurrentPage(1);
}, [activeTab, searchTerm, selectedFilter, selectedDepartment, itemsPerPage, sortBy]);

useEffect(() => {
  setSortBy("department-asc");
  setItemsPerPage(10);
}, [activeTab]);

  return (
    <div className="registration-container">
      <h1 className='regist-header'>Course Registration</h1>
      
      <div className="degree-progress">
        <h2 className="degree-heading">Degree Progress - Computer Science B.S.</h2>
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
              <span>{req.icon} {dept}:</span>
              
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
                            {
                              (course.status === "Registered") && !hasRegisteredCorequisite(course) &&
                              <span className="action-required-badge">Waiting for Corequisite(s)</span>
                            }
                          </span>
                          <span className="course-credits">{course.credits}</span>
                          <span className={`course-status ${getStatusClass2(course)}`}>
                            {course.completed ? 'Complete': (course.status === "Registered" ? (hasRegisteredCorequisite(course) ? course.status : "Requires Action"): course.status)}
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
                          <div className="course-details2">
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










                        <p><strong>{course.corequisites?.length > 0 ? "Corequisites for this class:" : ""}</strong></p>
                        {course.corequisites?.length > 0 &&(
                        <div className={"waitlist-info4" }>
                          <div className="course-header4">
                              <span className="course-id">Course ID</span>
                              <span className="course-name">Course Name</span>
                              <span className="course-credits">Credits</span>
                              <span className="course-status">Status</span>
                              <span className="course-availability">Availability</span>
                              <span className="course-action">Action</span>
                            </div>
                            {
                              course.corequisites.map(coreqId => {
                                const coreqCourse = courses.find(c => c.id === coreqId);
                                const isCompleted = coreqCourse?.completed;
                                const isRegistered = registeredCourses.some(c => c.id === coreqId);

                                return (
                                  



                                <React.Fragment key={coreqCourse.id}>

                                  <div className="course-item" onClick={() => toggleCourseDetails2(coreqCourse.id)}>
                                    <span className="course-id">{coreqCourse.id}</span>
                                    <span className="course-name">
                                      {coreqCourse.name}
                                      {coreqCourse.required && <span className="required-badge">Required</span>}
                                      {coreqCourse.completed && <span className="completed-badge">Completed</span>}
                                    </span>
                                    <span className="course-credits">{coreqCourse.credits}</span>
                                    <span className={`course-status ${getStatusClass(coreqCourse.status, coreqCourse.completed)}`}>
                                      {coreqCourse.completed ? 'Complete': coreqCourse.status}
                                    </span>
                                    <span className="course-availability">
                                      {coreqCourse.seats - coreqCourse.enrolled} / {coreqCourse.seats} seats
                                      {coreqCourse.waitlist > 0 && <span> (Waitlist: {coreqCourse.waitlist})</span>}
                                    </span>
                                    <span className="course-action" onClick={(e) => e.stopPropagation()}>
                                      {coreqCourse.completed ? (
                                        <button disabled className="button-disabled">Completed</button>
                                      ) : registeredCourses.some(c => c.id === coreqCourse.id) ? (
                                        <button disabled className="button-disabled">Registered</button>
                                      ) : waitlistedCourses.some(c => c.id === coreqCourse.id) ? (
                                        <button disabled className="button-disabled">On Waitlist</button>
                                      ) : (
                                        <button 
                                          onClick={() => handleRegister(coreqCourse)}
                                          className={checkPrerequisites(coreqCourse) ? (coreqCourse.status === 'Available' ? 'button-register' : 'button-waitlist'): 'button-restricted'}
                                          disabled={!checkPrerequisites(coreqCourse)}
                                          title={!checkPrerequisites(coreqCourse) ? "Prerequisites not met" : ""}
                                        >
                                          {checkPrerequisites(coreqCourse) ? (coreqCourse.status === 'Available' ? 'Register' : 'Join Waitlist') : 'Restricted'}
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                  
                                  {expandedCourseId2 === coreqCourse.id && (
                                    <div className="course-details4">
                                      <div className="details-section">
                                        <h4>Course Details</h4>
                                        <p>{coreqCourse.description}</p>
                                        <p><strong>Day:</strong> {coreqCourse.block.day.charAt(0).toUpperCase() + coreqCourse.block.day.slice(1)}</p>
                                        <p><strong>Time:</strong> {format_time(coreqCourse.block.startTime)} - {format_time(coreqCourse.block.endTime)}</p>
                                        <p><strong>Location:</strong> {coreqCourse.location}</p>
                                        <p><strong>Department:</strong> {coreqCourse.department}</p>
                                        <p><strong>Prerequisites:</strong> {coreqCourse.prerequisites.length > 0 ? 
                                          coreqCourse.prerequisites.join(', ') : 'None'}
                                        </p>
                                        <div className="prerequisite-status">
                                          {coreqCourse.prerequisites.map(prereq => {
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
                                );
                              })}
                        </div>)}


















                              
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


              <label className='page-label'>Sort By:</label>
              <select 
                className='page-options'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}  // <- Correct handler
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>



               <label className='page-label'>Per Page:</label>
              <select 
                className='page-options'
                value={itemsPerPage}
                onChange={(e) => {setItemsPerPage(Number(e.target.value));}}
              >
                {perPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
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
              getPaginatedResults().map(course => (
                <React.Fragment key={course.id}>
                  <div className="course-item" onClick={() => toggleCourseDetails(course.id)}>
                    <span className="course-id">{course.id}</span>
                    <span className="course-name">
                      {course.name}
                      {course.required && <span className="required-badge">Required</span>}
                      {course.completed && <span className="completed-badge">Completed</span>}
                      {
                        (course.status === "Registered") && !hasRegisteredCorequisite(course) &&
                        <span className="action-required-badge">Waiting for Corequisite(s)</span>
                      }
                    </span>
                    <span className="course-credits">{course.credits}</span>
                    <span className={`course-status ${getStatusClass2(course)}`}>
                      {course.completed ? 'Complete': (course.status === "Registered" ? (hasRegisteredCorequisite(course) ? course.status : "Requires Action"): course.status)}
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


















                        <p><strong>{course.corequisites?.length > 0 ? "Corequisites for this class:" : ""}</strong></p>
                        {course.corequisites?.length > 0 &&(
                        <div className={"waitlist-info3" }>
                          <div className="course-header">
                              <span className="course-id">Course ID</span>
                              <span className="course-name">Course Name</span>
                              <span className="course-credits">Credits</span>
                              <span className="course-status">Status</span>
                              <span className="course-availability">Availability</span>
                              <span className="course-action">Action</span>
                            </div>
                            {
                              course.corequisites.map(coreqId => {
                                const coreqCourse = courses.find(c => c.id === coreqId);
                                const isCompleted = coreqCourse?.completed;
                                const isRegistered = registeredCourses.some(c => c.id === coreqId);

                                return (
                                  



                                <React.Fragment key={coreqCourse.id}>

                                  <div className="course-item" onClick={() => toggleCourseDetails2(coreqCourse.id)}>
                                    <span className="course-id">{coreqCourse.id}</span>
                                    <span className="course-name">
                                      {coreqCourse.name}
                                      {coreqCourse.required && <span className="required-badge">Required</span>}
                                      {coreqCourse.completed && <span className="completed-badge">Completed</span>}
                                    </span>
                                    <span className="course-credits">{coreqCourse.credits}</span>
                                    <span className={`course-status ${getStatusClass(coreqCourse.status, coreqCourse.completed)}`}>
                                      {coreqCourse.completed ? 'Complete': coreqCourse.status}
                                    </span>
                                    <span className="course-availability">
                                      {coreqCourse.seats - coreqCourse.enrolled} / {coreqCourse.seats} seats
                                      {coreqCourse.waitlist > 0 && <span> (Waitlist: {coreqCourse.waitlist})</span>}
                                    </span>
                                    <span className="course-action" onClick={(e) => e.stopPropagation()}>
                                      {coreqCourse.completed ? (
                                        <button disabled className="button-disabled">Completed</button>
                                      ) : registeredCourses.some(c => c.id === coreqCourse.id) ? (
                                        <button disabled className="button-disabled">Registered</button>
                                      ) : waitlistedCourses.some(c => c.id === coreqCourse.id) ? (
                                        <button disabled className="button-disabled">On Waitlist</button>
                                      ) : (
                                        <button 
                                          onClick={() => handleRegister(coreqCourse)}
                                          className={checkPrerequisites(coreqCourse) ? (coreqCourse.status === 'Available' ? 'button-register' : 'button-waitlist'): 'button-restricted'}
                                          disabled={!checkPrerequisites(coreqCourse)}
                                          title={!checkPrerequisites(coreqCourse) ? "Prerequisites not met" : ""}
                                        >
                                          {checkPrerequisites(coreqCourse) ? (coreqCourse.status === 'Available' ? 'Register' : 'Join Waitlist') : 'Restricted'}
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                  
                                  {expandedCourseId2 === coreqCourse.id && (
                                    <div className="course-details3">
                                      <div className="details-section">
                                        <h4>Course Details</h4>
                                        <p>{coreqCourse.description}</p>
                                        <p><strong>Day:</strong> {coreqCourse.block.day.charAt(0).toUpperCase() + coreqCourse.block.day.slice(1)}</p>
                                        <p><strong>Time:</strong> {format_time(coreqCourse.block.startTime)} - {format_time(coreqCourse.block.endTime)}</p>
                                        <p><strong>Location:</strong> {coreqCourse.location}</p>
                                        <p><strong>Department:</strong> {coreqCourse.department}</p>
                                        <p><strong>Prerequisites:</strong> {coreqCourse.prerequisites.length > 0 ? 
                                          coreqCourse.prerequisites.join(', ') : 'None'}
                                        </p>
                                        <div className="prerequisite-status">
                                          {coreqCourse.prerequisites.map(prereq => {
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
                                );
                              })}
                        </div>)}


















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
            <div className="course-header2">
              <span className="course-id">Course ID</span>
              <span className="course-name">Course Name</span>
              <span className="course-credits">Credits</span>
              <span className="course-section">Section</span>
              <span className="course-action">Action</span>
            </div>
            
            {getPaginatedResults().map(course => {
              // Find the original course with full details
              const courseDetails = courses.find(c => c.id === course.id) || {
                prerequisites: [],
                corequisites: [],
                department: course.department || 'Unknown'
              };
              
              return (
                <React.Fragment key={course.id}>

                  <div 
                    className={hasRegisteredCorequisite(course) ? "course-item2" : "course-item2 required" }
                    onClick={() => toggleCourseDetails(`registered-${course.id}`)}
                  >
                    <span className="course-id">{course.id}</span>
                    <span className="course-name">
                      {course.name}
                      {
                        !hasRegisteredCorequisite(course) &&
                        <span className="action-required-badge">Waiting for Corequisite(s)</span>
                        }
                      {//course.completed && <span className="completed-badge">Completed</span>
                      }
                    </span>
                    <span className="course-credits">{course.credits}</span>
                    <span className="course-section">{course.section}</span>
                    <span className="course-action" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleDrop(course.id)} className="button-drop">
                        Drop Course
                      </button>
                    </span>
                  </div>
                  
                  {expandedCourseId === `registered-${course.id}` && (
                    <div className={hasRegisteredCorequisite(course) ? "course-details" : "course-details required" }>
                      <div className="details-section">
                        <h4>Course Details</h4>
                        <p>{course.description}</p>
                        <p><strong>Day:</strong> {course.block.day.charAt(0).toUpperCase() + course.block.day.slice(1)}</p>
                        <p><strong>Time:</strong> {format_time(course.block.startTime)} - {format_time(course.block.endTime)}</p>
                        <p><strong>Location:</strong> {course.location}</p>
                        <p><strong>Department:</strong> {courseDetails.department}</p>
                        <p><strong>Section:</strong> {course.section}</p>
                        <p><strong>Status:</strong> <span className={hasRegisteredCorequisite(course) ? "status-registered2" : "status-requires-action" }>{hasRegisteredCorequisite(course) ? "Registered" : "Requires Action" }</span></p>
                        

                        
                        {courseDetails.prerequisites && courseDetails.prerequisites.length > 0 && (
                          <>
                            <p><strong>{course.iscorequisite ? "Corequisites" : "Prerequisites"}:</strong> {courseDetails.prerequisites.join(', ')}</p>
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
                        














































                  
                        <p><strong>{courseDetails.corequisites?.length > 0 ? "Enroll in corequisites:" : ""}</strong></p>
                        {courseDetails.corequisites?.length > 0 &&(
                        <div className={hasRegisteredCorequisite(course) ? "waitlist-info3" : "waitlist-info2" }>
                          <div className="course-header">
                              <span className="course-id">Course ID</span>
                              <span className="course-name">Course Name</span>
                              <span className="course-credits">Credits</span>
                              <span className="course-status">Status</span>
                              <span className="course-availability">Availability</span>
                              <span className="course-action">Action</span>
                            </div>
                            {
                              courseDetails.corequisites.map(coreqId => {
                                const coreqCourse = courses.find(c => c.id === coreqId);
                                const isCompleted = coreqCourse?.completed;
                                const isRegistered = registeredCourses.some(c => c.id === coreqId);

                                return (
                                  



                                <React.Fragment key={coreqCourse.id}>

                                  <div className="course-item" onClick={() => toggleCourseDetails2(coreqCourse.id)}>
                                    <span className="course-id">{coreqCourse.id}</span>
                                    <span className="course-name">
                                      {coreqCourse.name}
                                      {coreqCourse.required && <span className="required-badge">Required</span>}
                                      {coreqCourse.completed && <span className="completed-badge">Completed</span>}
                                    </span>
                                    <span className="course-credits">{coreqCourse.credits}</span>
                                    <span className={`course-status ${getStatusClass(coreqCourse.status, coreqCourse.completed)}`}>
                                      {coreqCourse.completed ? 'Complete': coreqCourse.status}
                                    </span>
                                    <span className="course-availability">
                                      {coreqCourse.seats - coreqCourse.enrolled} / {coreqCourse.seats} seats
                                      {coreqCourse.waitlist > 0 && <span> (Waitlist: {coreqCourse.waitlist})</span>}
                                    </span>
                                    <span className="course-action" onClick={(e) => e.stopPropagation()}>
                                      {coreqCourse.completed ? (
                                        <button disabled className="button-disabled">Completed</button>
                                      ) : registeredCourses.some(c => c.id === coreqCourse.id) ? (
                                        <button disabled className="button-disabled">Registered</button>
                                      ) : waitlistedCourses.some(c => c.id === coreqCourse.id) ? (
                                        <button disabled className="button-disabled">On Waitlist</button>
                                      ) : (
                                        <button 
                                          onClick={() => handleRegister(coreqCourse)}
                                          className={checkPrerequisites(coreqCourse) ? (coreqCourse.status === 'Available' ? 'button-register' : 'button-waitlist'): 'button-restricted'}
                                          disabled={!checkPrerequisites(coreqCourse)}
                                          title={!checkPrerequisites(coreqCourse) ? "Prerequisites not met" : ""}
                                        >
                                          {checkPrerequisites(coreqCourse) ? (coreqCourse.status === 'Available' ? 'Register' : 'Join Waitlist') : 'Restricted'}
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                  
                                  {expandedCourseId2 === coreqCourse.id && (
                                    <div className="course-details3">
                                      <div className="details-section">
                                        <h4>Course Details</h4>
                                        <p>{coreqCourse.description}</p>
                                        <p><strong>Day:</strong> {coreqCourse.block.day.charAt(0).toUpperCase() + coreqCourse.block.day.slice(1)}</p>
                                        <p><strong>Time:</strong> {format_time(coreqCourse.block.startTime)} - {format_time(coreqCourse.block.endTime)}</p>
                                        <p><strong>Location:</strong> {coreqCourse.location}</p>
                                        <p><strong>Department:</strong> {coreqCourse.department}</p>
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                                );
                              })}
                        </div>)}
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
  <div className="registered-section">
    <h2>Your Waitlisted Courses</h2>
    
    {waitlistedCourses.length > 0 ? (
      <div className="registered-courses">
        <div className="course-header">
          <span className="course-id">Course ID</span>
          <span className="course-name">Course Name</span>
          <span className="course-credits">Credits</span>
          <span className="course-waitlist">Waitlist Position</span>
          <span className="course-action">Action</span>
        </div>
        
        {getPaginatedResults().map(course => {
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
                      <p><strong>Required Actions:</strong> Please Enroll in any required corequisites upon registering</p>
                    </div>
                    
                    <div className="course-actions">
                      <p><strong>Actions:</strong></p>
                      <div className="additional-actions">
                        <button onClick={() => navigate('/plan')} className="button-secondary">View Schedule</button>
                      </div>
                    </div>

                    





                      <p><strong>{courseDetails.corequisites?.length > 0 ? "Corequisites for this class:" : ""}</strong></p>
                        {courseDetails.corequisites?.length > 0 &&(
                        <div className={"waitlist-info3" }>
                          <div className="course-header">
                              <span className="course-id">Course ID</span>
                              <span className="course-name">Course Name</span>
                              <span className="course-credits">Credits</span>
                              <span className="course-status">Status</span>
                              <span className="course-availability">Availability</span>
                              <span className="course-action">Action</span>
                            </div>
                            {
                              courseDetails.corequisites.map(coreqId => {
                                const coreqCourse = courses.find(c => c.id === coreqId);
                                const isCompleted = coreqCourse?.completed;
                                const isRegistered = registeredCourses.some(c => c.id === coreqId);

                                return (
                                  



                                <React.Fragment key={coreqCourse.id}>

                                  <div className="course-item" onClick={() => toggleCourseDetails2(coreqCourse.id)}>
                                    <span className="course-id">{coreqCourse.id}</span>
                                    <span className="course-name">
                                      {coreqCourse.name}
                                      {coreqCourse.required && <span className="required-badge">Required</span>}
                                      {coreqCourse.completed && <span className="completed-badge">Completed</span>}
                                    </span>
                                    <span className="course-credits">{coreqCourse.credits}</span>
                                    <span className={`course-status ${getStatusClass(coreqCourse.status, coreqCourse.completed)}`}>
                                      {coreqCourse.completed ? 'Complete': coreqCourse.status}
                                    </span>
                                    <span className="course-availability">
                                      {coreqCourse.seats - coreqCourse.enrolled} / {coreqCourse.seats} seats
                                      {coreqCourse.waitlist > 0 && <span> (Waitlist: {coreqCourse.waitlist})</span>}
                                    </span>
                                    <span className="course-action" onClick={(e) => e.stopPropagation()}>
                                      {coreqCourse.completed ? (
                                        <button disabled className="button-disabled">Completed</button>
                                      ) : registeredCourses.some(c => c.id === coreqCourse.id) ? (
                                        <button disabled className="button-disabled">Registered</button>
                                      ) : waitlistedCourses.some(c => c.id === coreqCourse.id) ? (
                                        <button disabled className="button-disabled">On Waitlist</button>
                                      ) : (
                                        <button 
                                          onClick={() => handleRegister(coreqCourse)}
                                          className={checkPrerequisites(coreqCourse) ? (coreqCourse.status === 'Available' ? 'button-register' : 'button-waitlist'): 'button-restricted'}
                                          disabled={!checkPrerequisites(coreqCourse)}
                                          title={!checkPrerequisites(coreqCourse) ? "Prerequisites not met" : ""}
                                        >
                                          {checkPrerequisites(coreqCourse) ? (coreqCourse.status === 'Available' ? 'Register' : 'Join Waitlist') : 'Restricted'}
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                  
                                  {expandedCourseId2 === coreqCourse.id && (
                                    <div className="course-details3">
                                      <div className="details-section">
                                        <h4>Course Details</h4>
                                        <p>{coreqCourse.description}</p>
                                        <p><strong>Day:</strong> {coreqCourse.block.day.charAt(0).toUpperCase() + coreqCourse.block.day.slice(1)}</p>
                                        <p><strong>Time:</strong> {format_time(coreqCourse.block.startTime)} - {format_time(coreqCourse.block.endTime)}</p>
                                        <p><strong>Location:</strong> {coreqCourse.location}</p>
                                        <p><strong>Department:</strong> {coreqCourse.department}</p>
                                        <p><strong>Prerequisites:</strong> {coreqCourse.prerequisites.length > 0 ? 
                                          coreqCourse.prerequisites.join(', ') : 'None'}
                                        </p>
                                        <div className="prerequisite-status">
                                          {coreqCourse.prerequisites.map(prereq => {
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
                                );
                              })}
                        </div>)}

























                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        <div className="course-summary">
          <span>Total Courses: {waitlistedCourses.length}</span>
          <span>Total Credits: {waitlistedCourses.reduce((sum, course) => sum + course.credits, 0)}</span>
        </div>
      </div>
      
    ) : (
      <div className="no-results">You aren't on any waitlists</div>
    )}
  </div>
)}
      
      <Pagination
        totalItems={getCurrentList().length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        initialPage={currentPage}
      />



      <div className="registration-legend">
        <h3 className="registration-heading">Status Legend</h3>
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
            <span>Full/Prerequisites not met</span>
          </div>
        </div>
      </div>
    </div>
  );
}