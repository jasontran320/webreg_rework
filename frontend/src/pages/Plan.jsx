import React, { useState, useEffect, useContext, useRef } from 'react';
import { X, 
  Calendar, 
  AlertCircle,
  Check,
  Palette,
  Clock, 
  MapPin,        // New: for location
  Save,          // New: for edit action (not Edit2)
  Trash } from 'lucide-react';
import styles from '../styles/plan.module.css'
import { CourseContext } from '../data/CourseContext.jsx'
import {LocationPicker} from '../components/LocationDemo.jsx'

// Sample data for class blocks

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 8; // Starting from 8 AM
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function Planner() {
  const { courses, 
          setCourses, 
          blocks, 
          setBlocks, 
          registeredCourses, 
          setRegisteredCourses,
          waitlistedCourses, 
          setWaitlistedCourses } = useContext(CourseContext);

  const [newBlock, setNewBlock] = useState({
    title: '',
    day: 'monday',
    startTime: '08:00',
    endTime: '09:00',
    color: 'random',
    duration: 1
  });
  const [showForm, setShowForm] = useState(false);

  const [validTitle, setvalidTitle] = useState(true);
  const [validStart, setvalidStart] = useState(true);
  const [validDay, setvalidDay] = useState(true);
  const [validDuration, setvalidDuration] = useState(true);
  const [validClick, setvalidClick] = useState(false);
  const [defaultStart, setdefaultStart] = useState(true);
  const [defaultDay, setdefaultDay] = useState(true);
  const [validSubmit, setvalidSubmit] = useState(false);



  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const [success, setSuccess] = useState('');
  const [success2, setSuccess2] = useState('');
  useEffect(() => {
    setError('')
    if (!showForm) {
      setNewBlock({
        title: '',
        day: 'monday',
        startTime: '08:00',
        endTime: '09:00',
        color: 'random',
        duration: 1
      });
      setvalidTitle(false)
    }
    setvalidDuration(true)
    if (!validClick)  {
          setvalidStart(false)
          setvalidDay(false)
          setdefaultStart(true)
          setdefaultDay(true)
        }
      else {
        setvalidStart(true)
        setvalidDay(true)
        setvalidClick(false)
        setdefaultStart(false)
        setdefaultDay(false)
      }

      if (showForm) {
        if (convertTimeToMinutes(newBlock.endTime) > convertTimeToMinutes("23:00")) {
      setError('End time must be within bounds');
      setvalidDuration(false);
      setvalidStart(false);
      setvalidSubmit(false);
    } 
    
    else if (checkOverlap(newBlock)) {
      setError('This block overlaps with an existing block');
      setvalidDuration(false);
      setvalidStart(false);
      setvalidDay(false);
      setvalidSubmit(false);
    }
    
    
    else if (!newBlock.title) {setvalidSubmit(false); setError('Title Cannot Be Empty');}
      }
     
      
  }, [showForm]); 

  
  // Color options for blocks
  const colorOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' },
    { value: 'pink', label: 'Pink' },
    {value: 'random', label: 'Random'}
  ];

  // Generate time options for dropdown selects
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 8; i <= 22; i++) { // 8 AM to 8 PM
      options.push(`${i.toString().padStart(2, '0')}:00`);
      options.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  
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
  

  const handleDrop = (courseId) => {
  const course = courses.find(course => course.id === courseId);
  let deleted_courses = [];

  // Find all courses to delete
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

  if (!deletedString) {
    const confirm = window.confirm(
      `Are you sure you want to drop ${courseId}? This is a registered class, you may not re-register in the future depending on enrollment status`
    );
    if (!confirm) return false;
  }

  if (confirmed) {
    // Remove affected courses
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

    // ✅ Flatten all block IDs to remove
    const blockIdsToRemove = deleted_courses
      .flatMap(course => Array.isArray(course.block) ? course.block : [])
      .map(block => block.id);

    const courseIdsToUpdate = deleted_courses.map(course => course.id);

    // Remove blocks
    setBlocks(prevBlocks =>
      prevBlocks.filter(block => !blockIdsToRemove.includes(block.id))
    );

    // Update course enrollment/waitlist
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

    setSuccess(deletedString ? 'Blocks deleted successfully' : 'Block deleted successfully');
    setTimeout(() => setSuccess(''), 3000);
    return true;
  } else {
    setSuccess('Deletion Cancelled');
    setTimeout(() => setSuccess(''), 3000);
    return false;
  }
};


  const handleInputChange = (e, dur=null) => {
    let { name, value } = e.target;
    let previous = true;
   
    // Check if the value for 'duration' is a valid integer
    if ((name === 'duration' || name === 'duration1' || name === 'duration2') && isNaN(Number(value))) {
      setError('Invalid input: duration must be an integer');
      setTimeout(() => setError(''), 3000);
      return; // Stop further execution if invalid
    }

    if (name === 'title') {
        if (value) {setvalidTitle(true); setvalidSubmit(true);}
        else {setvalidTitle(false)}
    }
    
    if (name === 'duration1' || name === 'duration2') {
      dur = Number(dur)
      value = Number(value)
      if (name === 'duration1') {
        name = 'duration';
        value = dur / 60 + value
      }
      else {
        if (value >= 60) {
          setError('Value in minutes cannot exceed 60');
          setvalidDuration(false);
          return;
        }
        else {
           setError('');
           setvalidDuration(true);
        }
        
        name = 'duration'; value = dur + value / 60
      }
      if (value < 0.5) {
          setError('Duration should be at least 30 minutes');
          setvalidDuration(false);
          setvalidSubmit(false);
          previous = false;
      }
      else {
        setError('');
           setvalidDuration(true);
      }
    }
    
    const updatedBlock = {
  ...newBlock,
  [name]: value,
  ...(name === 'duration' && {
    endTime: addHoursToTime(newBlock.startTime, value),
  }),
  ...(name === 'startTime' && {
    endTime: addHoursToTime(value, newBlock.duration),
  }),
};

setNewBlock(updatedBlock);

// Now use `updatedBlock`, not `newBlock`, for validation

if (!updatedBlock.title) {
  setError('Title Cannot Be Empty');
}

if (convertTimeToMinutes(updatedBlock.endTime) > convertTimeToMinutes("23:00")) {
  setError('End time must be within bounds');
  setvalidDuration(false);
  setvalidStart(false);
  setvalidSubmit(false);
} else if (checkOverlap(updatedBlock)) {
  setError('This block overlaps with an existing block');
  setvalidDuration(false);
  setvalidDay(false);
  setvalidStart(false);
  setvalidSubmit(false);
} else {
  if (previous) {if (updatedBlock.title) setError('');
  setvalidDuration(true);
  setvalidSubmit(true);}
  if (!defaultStart) 
    setvalidStart(true);
  if (!defaultDay) 
    setvalidDay(true)
  
}
if (!updatedBlock.title) {
  //setError('Title Cannot Be Empty');
  setvalidSubmit(false)
}

};

  // Check if blocks overlap
  const checkOverlap = (newBlock) => {
    return blocks.some(block => {
      if (block.day !== newBlock.day) return false;
      
      const blockStart = convertTimeToMinutes(block.startTime);
      const blockEnd = convertTimeToMinutes(block.endTime);
      const newStart = convertTimeToMinutes(newBlock.startTime);
      const newEnd = convertTimeToMinutes(newBlock.endTime);
      
      return (newStart < blockEnd && newEnd > blockStart);
    });
  };

  // Convert time to minutes for easier comparison
  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const addHoursToTime = (startTime, decimalHours) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startInMinutes = hours * 60 + minutes;
    const addedMinutes = Math.round(decimalHours * 60);
    const totalMinutes = startInMinutes + addedMinutes;
  
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
  
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };  

  const formatDuration = (duration) => {
      const hours = Math.floor(duration);
      const minutes = Math.round((duration - hours) * 60);
      return { hours, minutes };
  }

  function combineDuration(hours, minutes) {
    return hours + minutes / 60;
  }


  const handleClick = (day, time) => {
    const updatedBlock = {
      ...newBlock, // assuming you're in a place where newBlock is available
      startTime: time,
      day: day,
      endTime: addHoursToTime(time, newBlock.duration), // use current duration
    };

    setNewBlock(updatedBlock);

if (!updatedBlock.title) {
  setError('Title Cannot Be Empty');
}


if (convertTimeToMinutes(updatedBlock.endTime) > convertTimeToMinutes("23:00")) {
  setError('End time must be within bounds');
  setvalidDuration(false);
  setvalidStart(false);
  setvalidSubmit(false);
} else if (checkOverlap(updatedBlock)) {
  setError('This block overlaps with an existing block');
  setvalidDuration(false);
  setvalidDay(false);
  setvalidStart(false);
  setvalidSubmit(false);
} else {
  if (updatedBlock.title) setError('');
  setvalidDuration(true); 
    setvalidStart(true);
    setvalidDay(true)
    setvalidSubmit(true);
}
if (!updatedBlock.title) {
  setvalidSubmit(false); 
  //setError('Title Cannot Be Empty');
}


    setvalidClick(true)
    setdefaultStart(false)
    setdefaultDay(false)
    
    setShowForm(true)

    setTimeout(() => {
    const courseList = document.querySelector(`.${styles['form_container']}`);

    if (courseList) {
      const offset = 0; // scroll 100px *above* the element
      const top = courseList.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }, 25);


    //setTimeout(window.scrollTo({ top: 85, behavior: "smooth" }, 50));
  }

  // Handle form submission
  const handleSubmit = () => {

    if (newBlock.title.trim() === '') {
      setError('Please enter a title for the block');
      setTimeout(() => setError(''), 3000);
      setvalidTitle(false)
      return;
    }

    

    if (!newBlock.duration) {
      handleInputChange({ 
        target: { name: 'duration', value: '1' } 
      });
      setError('Please enter a valid duration');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (newBlock.duration < 0.5) {
        setError('Invalid input: duration must be at least 30 minutes');
        setTimeout(() => setError(''), 3000);
        setvalidDuration(false)
        return;
      }
    
    if (convertTimeToMinutes(newBlock.startTime) >= convertTimeToMinutes(newBlock.endTime)) {
      setError('End time must be after start time');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (convertTimeToMinutes(newBlock.endTime) > convertTimeToMinutes("23:00")) {
      setError('End time must be within bounds');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (checkOverlap(newBlock)) {
      setError('This block overlaps with an existing block');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    const id = (
      Math.max(
        100, // So first ID will be 101
        ...blocks
          .map(block => parseInt(block.id, 10))
          .filter(id => !isNaN(id))
      ) + 1
    ).toString();



    if (newBlock.color == 'random') {
      const filtered = colorOptions.filter(opt => opt.value !== 'random');
      const randomIndex = Math.floor(Math.random() * filtered.length);
      newBlock.color = filtered[randomIndex].value;
    }
    setBlocks([...blocks, { ...newBlock, id }]);
    setNewBlock({
      title: '',
      day: 'monday',
      startTime: '08:00',
      endTime: '09:00',
      color: 'random',
      duration: 1
    });
    setSuccess('Block added successfully');
    setShowForm(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Delete a block
  const handleDeleteBlock = (blockId) => {
  // Helper to find a course that contains the block
  const findCourseContainingBlock = (courses) => {
    return courses.find(course =>
      Array.isArray(course.block)
        ? course.block.some(b => b.id === blockId)
        : course.block?.id === blockId
    );
  };

  const courseInRegistered = findCourseContainingBlock(registeredCourses);
  const courseInWaitlisted = findCourseContainingBlock(waitlistedCourses);

  // Case 1: Block belongs to a registered course
  if (courseInRegistered) {
    const dropSucceeded = handleDrop(courseInRegistered.id);
    if (!dropSucceeded) return true; // user cancelled drop
  }

  // Case 2: Block belongs to a waitlisted course
  else if (courseInWaitlisted) {
    const blockIdsToRemove = Array.isArray(courseInWaitlisted.block)
      ? courseInWaitlisted.block.map(b => b.id)
      : [courseInWaitlisted.block?.id].filter(Boolean);

    // Remove course from waitlist and associated blocks
    setWaitlistedCourses(waitlistedCourses =>
      waitlistedCourses.filter(course => course.id !== courseInWaitlisted.id)
    );

    setBlocks(blocks =>
      blocks.filter(block => !blockIdsToRemove.includes(block.id))
    );

    setSuccess('All associated blocks deleted successfully');
    setTimeout(() => setSuccess(''), 3000);
  }

  // Case 3: Block is standalone
  else {
    setBlocks(blocks => blocks.filter(block => block.id !== blockId));
    setSuccess('Block deleted successfully');
    setTimeout(() => setSuccess(''), 3000);
  }

  // Re-run form validation logic
  if (checkOverlap(newBlock)) {
    setError('');
    setvalidDuration(true);
    if (defaultStart) setvalidStart(true);
    if (defaultDay) setvalidDay(true);
    setvalidSubmit(true);
  }
};



  // Position a block in the grid
  const getBlockPosition = (block) => {
    const startTime = convertTimeToMinutes(block.startTime);
    const endTime = convertTimeToMinutes(block.endTime);
    const startHour = 8 * 60; // 8 AM in minutes
    
    const top = ((startTime - startHour) / 30) * 20; // 12px per 30 min
    const height = ((endTime - startTime) / 30) * 20; // 12px per 30 min
    
    return { top: `${top}px`, height: `${height}px` };
  };

  const [selectedBlock, setSelectedBlock] = useState({
    title: '',
    day: 'monday',
    startTime: '08:00',
    endTime: '09:00',
    color: 'random',
    duration: 1
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
  if (showPopup) {
      setShowForm(false)
      document.body.classList.add('no-scroll');
      if (selectedBlock.description) setIsEditingDescription(false);
      else setIsEditingDescription(true);
    } else {
      document.body.classList.remove('no-scroll');
      let idToFind = selectedBlock.id;
      if (idToFind) {
        const block = blocks.find(block => block.id === idToFind);  
        if (block) {

            setIsEditingTitle(false);
            setIsEditingColor(false);
            setError2('')

            //setSelectedBlock(block);
          }
      }
    }
  }, [showPopup]);


  const handleBlockClick = (event, block) => {
    event.stopPropagation(); // Prevent triggering parent div click events
    //setSelectedBlock(block);
    let default_description = block.description ? block.description : '';
    let default_location = block.location ? block.location: "No Location set"
    setSelectedBlock({ ...block, description: default_description, location: default_location });

    setShowPopup(true);
  };
  
  const closePopup = (button=true) => {
    if (button || !isEditingDescription || !isfromClick) setShowPopup(false);
  };


  /* Helper function to use in your component */
  function getColorForBlock(color) {
    const colorMap = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      pink: '#ec4899',
      // Add more colors as needed
    };
    
    return colorMap[color] || '#6b7280';  // Default to gray if no match
  }

const handleSave = () => {
  if (!selectedBlock.title) {
    setSuccess2('')
    setError2('Title cannot be empty, please try again');
  }
  else {
    // Handle random color if needed
    let updatedBlock = { ...selectedBlock };
    
    // Helper function to find course by block ID
    const findCourseByBlockId = (courses, blockId) => {
      return courses.find(course =>
        Array.isArray(course.block) &&
        course.block.some(block => block.id === blockId)
      );
    };
    
    // Check if this block belongs to a registered or waitlisted course
    const courseInRegistered = findCourseByBlockId(registeredCourses, selectedBlock.id);
    const courseInWaitlisted = findCourseByBlockId(waitlistedCourses, selectedBlock.id);
    
    if (courseInRegistered || courseInWaitlisted) {
      // Get the course that contains this block
      const targetCourse = courseInRegistered || courseInWaitlisted;
      
      // Get all block IDs from this course
      const courseBlockIds = targetCourse.block.map(block => block.id);
      
      // Update all blocks that belong to this course
      setBlocks(prevBlocks =>
        prevBlocks.map(block => {
          if (courseBlockIds.includes(block.id)) {
            // Apply the same changes to all blocks in the course
            return {
              ...block,
              title: updatedBlock.title,
              description: updatedBlock.description,
              color: updatedBlock.color,
              location: updatedBlock.location,
              locationCoords: updatedBlock.locationCoords
              // Add any other properties that should be propagated
            };
          }
          return block;
        })
      );
    } else {
      // This is an orphaned block or from other courses, update only the specific block
      setBlocks(prevBlocks =>
        prevBlocks.map(block =>
          block.id === selectedBlock.id ? updatedBlock : block
        )
      );
    }
    
    setSuccess('Block Saved')
    setTimeout(() => setSuccess(''), 3000);
    closePopup(true);
  }
};
    
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingColor, setIsEditingColor] = useState(false);
    let isfromColorClick = false;
    const [isfromClick, setisfromClick] = useState(false);

    // useEffect(() => {
    //   if (selectedBlock) {
    //     setEditedTitle(selectedBlock.title || '');
    //     setEditedDescription(selectedBlock.description || '');
    //     setEditedLocation(selectedBlock.location || '');
    //     setEditedColor(selectedBlock.color || '');
    //     setEditedTime(selectedBlock.time || '');
    //   }
    // }, [selectedBlock]);


  const handleInputChange2 = (e) => {
      let { name, value } = e.target;
    
      // Check if the value for 'duration' is a valid integer
      if ((name === 'duration') && isNaN(Number(value))) {
        setSuccess2('')
        setError2('Invalid input: duration must be an integer');
        setTimeout(() => setError2(''), 3000);
        return; // Stop further execution if invalid
      }

      if (name === 'description') {
        value = value.replace(/^\s+/, ''); }

      if (name === 'title') {
        value = value.replace(/^\s+/, '');
      if (value) {
          setError2('');
      } else {
          setSuccess2('')
          setError2('Title Cannot Be Empty');
      }
}
      
      const updatedBlock = {
    ...selectedBlock,
    [name]: value,
    ...(name === 'duration' && {
      endTime: addHoursToTime(newBlock.startTime, value),
    }),
    ...(name === 'startTime' && {
      endTime: addHoursToTime(value, newBlock.duration),
    }),
  };
  setSelectedBlock(updatedBlock);
  };




  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditingDescription && isfromClick && inputRef.current) {
    const textarea = inputRef.current;

    const timeoutId = setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selectedBlock.description.length,
        selectedBlock.description.length
      );
    }, 0); // no delay or small delay is often better for cursor control

    return () => clearTimeout(timeoutId);
  }
  }, [isEditingDescription]);


const [isMapOpen, setIsMapOpen] = useState(false);


const parseLocationToCoords = (locationString) => {
  // If you stored coordinates as a string like "33.6405, -117.8443"
  if (locationString && locationString.includes(',')) {
    const [lat, lng] = locationString.split(',').map(s => parseFloat(s.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng, address: locationString };
    }
  }
  return null;
};



  return (
    <div className={styles.planner_container}>
      <div className={styles.planner_header}>
        <h1 className={styles.planner_title}>Class Schedule Planner</h1>
        <button 
          className={`${styles.button} ${showForm ? styles.button_red : styles.button_blue}`}
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {setTimeout(() => {
              const courseList = document.querySelector(`.${styles['form_container']}`);

              if (courseList) {
                const offset = 0; // scroll 100px *above* the element
                const top = courseList.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                  top,
                  behavior: 'smooth',
                });
              }
            }, 25);}
          }}
        >
          {showForm ? <X size={16} /> : <Calendar size={16} />}
          {showForm ? 'Close Form' : 'Add New Block'}
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className= {`${styles.message_container} ${styles.success_message}`}>
          <Check size={16} />
          <span>{success}</span>
        </div>
      )}




      {showForm && (
      <div className={styles.form_container}>
        <h2 className={styles.form_title}>Add New Class or Event Block</h2>
      
        {error && (
          <div className={`${styles.message_container} ${styles.error_message}`}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      
        <div className={styles.form_layout}>
          <div className={styles.input_group}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur(); // This removes focus from the input
                }
              }}
              name="title"
              value={newBlock.title}
              onChange={handleInputChange}
              className={validTitle ? styles.input : `${styles.input} ${styles.required}`}
              placeholder="e.g., MATH 101"
            />
          </div>

          <div className={styles.input_group}>
            <label className={styles.label}>Day of Week</label>
            <select
              name="day"
              onClick={() => {
                if (!checkOverlap(newBlock) && defaultDay) {setvalidDay(true); setdefaultDay(false)}
              }}
              value={newBlock.day}
              onChange={handleInputChange}
              className={validDay ? styles.select : `${styles.select} ${styles.required}`}
            >
              {days.map(day => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.input_group}>
            <label className={styles.label}>Start Time</label>
            <select
              name="startTime"
              onClick={() => {
                if (!checkOverlap(newBlock) && defaultStart) {setvalidStart(true); setdefaultStart(false)}
              }}
              value={newBlock.startTime}
              onChange={handleInputChange}
              className={validStart ? styles.select_small : `${styles.select_small} ${styles.required}`}
            >
              {timeOptions.map(time => (
                <option key={`start-${time}`} value={time}>{format_time(time)}</option>
              ))}
            </select>
          </div>

          <div className={styles.input_group}>
            <label className={styles.label}>Block Color</label>
            <select
              name="color"
              value={newBlock.color}
              onChange={handleInputChange}
              className={styles.select}
            >
              {colorOptions.map(color => (
                <option key={color.value} value={color.value}>{color.label}</option>
              ))}
            </select>
          </div>

          <div className={`${styles.input_group} ${styles.duration_field}`}>
            <label className={styles.label}>Duration</label>
            <div className={styles.duration_container}>
              <div className={styles.duration_input_wrapper}>
                <input
                  type="number"
                  name="duration1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.target.blur(); // This removes focus from the input
                    }
                  }}
                  onBlur={(e) => {
                  e.target.value = Number(e.target.value); // This strips leading 0s on blur
                }}
                  value={formatDuration(newBlock.duration).hours.toString()}
                  onChange={(e) => handleInputChange(e, formatDuration(newBlock.duration).minutes)}
                  className={validDuration ? styles.input_small : `${styles.input_small} ${styles.required}`}
                  placeholder="1.5"
                />
                <span className={styles.duration_text}>hours</span>

                <input
                  type="number"
                  name="duration2"
                  onBlur={(e) => {
                  e.target.value = Number(e.target.value); // This strips leading 0s on blur
                }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.target.blur(); // This removes focus from the input
                    }
                  }}
                  value={formatDuration(newBlock.duration).minutes.toString()}
                  onChange={(e) => handleInputChange(e, formatDuration(newBlock.duration).hours)}
                  className={validDuration ? styles.input_small : `${styles.input_small} ${styles.required}`}
                  placeholder="1.5"
                />
                <span className={styles.duration_text}>minutes</span>
              </div>
              <input
                type="range"
                name="duration"
                min="0.5"
                max="8"
                step="0.5"
                value={newBlock.duration}
                onChange={handleInputChange}
                className={validDuration ? styles.slider : `${styles.slider} ${styles.required}`}
              />
            </div>
          </div>
        </div>

        <div className={styles.form_buttons}>
          <button
            onClick={handleSubmit}
            className={validSubmit ? `${styles.button} ${styles.button_green}`: `${styles.button} ${styles.disabled}`}
          >
            <Check size={16} />
            Add Block
          </button>
        </div>
      </div>
    )}








      {/* Calendar view */}
      <div className={styles.calendar_container}>
        <div className={styles.calendar_grid}>
          {/* Time column */}
          <div className={styles.time_column}>
            <div className={styles.day_header}>
              <Clock size={18} style={{marginRight: '4px'}} />
              Time
            </div>
            {timeSlots.map(time => (
              <div key={time} className={styles.time_slot}>
                {format_time(time)}
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {days.map(day => (
            <div key={day} className={styles.day_column}>
              <div className={styles.day_header}>
                {day}
              </div>
              
              {/* Time grid */}
              <div className={styles.time_grid}>
                {timeSlots.map((time, index) => (
                  <div 
                    key={`${day}-${time}`} 
                    className={styles.time_slot_day}
                    onClick={() => {handleClick(day, time)}}
                  ></div>
                ))}
                
                {/* Blocks */}
                {blocks
                  .filter(block => block.day === day)
                  .map(block => {
                    const { top, height } = getBlockPosition(block);
                    return (
                      <div
                        key={block.id || `block-${day}-${index}`}
                        className={`${styles.block} ${styles[`block_${block.color}`]}`}
                        style={{ top, height }}
                        onClick={(e) => handleBlockClick(e, block)}
                      >
                        <div className={styles.block_header}>
                          <div className={styles.block_title}>
                            {block.title}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlock(block.id)
                            }}
                            className={styles.delete_button}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className={styles.block_time}>
                          {format_time(block.startTime)} - {format_time(block.endTime)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && selectedBlock && (
        <React.Fragment key={`popup-${selectedBlock.id}`}>
          <div 
            className={styles.popup_overlay} 
            onClick={() => closePopup(false)}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          >
            <div 
              className={`${styles.popup_content} ${styles[`block_${selectedBlock.color}`]}`} 
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: 'slideInFromLeft 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformOrigin: 'left center',
                borderLeft: `6px solid ${getColorForBlock(selectedBlock.color)}`,
              }}
            >
              {error2 && (
                <div className= {`${styles.message_container} ${styles.error_message}`}>
                  <AlertCircle size={16} />
                  <span>{error2}</span>
                </div>
              )}

              {success2 && (
                <div className= {`${styles.message_container} ${styles.success_message}`}>
                  <Check size={16} />
                  <span>{success2}</span>
                </div>
              )}
              <React.Fragment key={`content-${selectedBlock.id}`}>
                <div className={styles.popup_header}>


                  <div
                    onClick={() => setIsEditingTitle(true)}
                    className={`${styles.editableWrapper} ${styles[selectedBlock.color]}`}
                  >
                    {isEditingTitle ? (
                      <input
                        type="text"
                        name="title"
                        value={selectedBlock.title}
                        onChange={handleInputChange2}
                        onBlur={() => 
                        {
                          if (selectedBlock.title) {
                                setIsEditingTitle(false);
                                setError2('');

                                const updatedBlock = {
                                    ...selectedBlock,
                                    title: selectedBlock.title.trim()
                                };

                                setSelectedBlock(updatedBlock);
                            }

                            else {setSuccess2(''); setError2("Title cannot be empty, please try again"); }
                        }
                        } // Exit edit mode when focus is lost
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();

                            if (selectedBlock.title) {
                                setIsEditingTitle(false);
                                setError2('');

                                const updatedBlock = {
                                    ...selectedBlock,
                                    title: selectedBlock.title.trim()
                                };

                                setSelectedBlock(updatedBlock);
                            }

                            else {setSuccess2(''); setError2("Title cannot be empty, please try again");}
                            // optionally call a save function here
                          }
                        }}
                        className={`${styles.input_title} ${styles[selectedBlock.color]}`}
                        autoFocus
                      />
                    ) : (
                      <h2 className={styles.popup_title}>{
                        //editedTitle
                        selectedBlock.title
                        }</h2>
                    )}
                  </div>
  
                    <button
                      onClick={() => closePopup(true)}
                      className={styles.popup_close_button}
                      aria-label="Close details"
                    >
                      <X size={20} />
                    </button>
                </div>
                
                <div className={styles.popup_details}>

                  <React.Fragment key={`details-${selectedBlock.id}`}>
                    <div className={styles.popup_detail_item}>
                      <Calendar size={19} className={styles.icon} />
                      <span className={styles.popup_info}>{selectedBlock.day.charAt(0).toUpperCase() + selectedBlock.day.slice(1)}</span>
                    </div>
                    <div className={styles.popup_detail_item}>
                      <Clock size={19} className={styles.icon} />
                      <span className={styles.popup_info}>{format_time(selectedBlock.startTime)} - {format_time(selectedBlock.endTime)}</span>
                    </div>

                  {/* These next two are currently not integrated into the database for block. */ }
                    <div
                      onClick={() => {
                      setSuccess2('')
                      setIsMapOpen(true); // Add this state
                    }}
                      className={`${styles.editableWrapper} ${styles[selectedBlock.color]}`}
                    >
                      {selectedBlock.location && (
                        <div className={styles.popup_detail_item}>
                          <MapPin
                        style={{ width: 19, height: 19, flexShrink: 0, flexGrow: 0 }}
                        className="mapIcon"
                      />
                          <span className={styles.popup_info}>{selectedBlock.location}</span>
                        </div>
                      )}
                    </div>
                    <LocationPicker
                      isOpen={isMapOpen}
                      onClose={() => setIsMapOpen(false)}
                      onLocationSelect={(location, submit) => {
                        setError2('')
                        setSuccess2('Location Successfully Saved');
                        setTimeout(() => setSuccess2(''), 3000);
                        if (submit) {
                          setSelectedBlock(prev => ({
                            ...prev,
                            location: location.address,
                            locationCoords: { lat: location.lat, lng: location.lng, address: location.address, address2: location.address2} // Store coords separately
                        }));
                      }
                      else {
                        setError2('')
                        setSuccess2('Location Successfully Deleted');
                        setTimeout(() => setSuccess2(''), 3000);
                        setSelectedBlock(prev => ({
                            ...prev,
                            location: 'No Location set',
                            locationCoords: null // Store coords separately
                        }));
                      }
                        
                      }}

                      // Then use:
                      initialLocation={selectedBlock.locationCoords || null}
                    />



                    <div
                      onClick={() => {setIsEditingColor(true);}}
                      className={`${styles.editableWrapper} ${styles[selectedBlock.color]}`}
                    >
                      { selectedBlock.color && (
                        <div className={styles.popup_detail_item}>
                          <Palette size={19} className={styles.icon} />
                          <span className={styles.popup_info}>{selectedBlock.color.charAt(0).toUpperCase() + selectedBlock.color.slice(1)}</span>
                        </div>
                      ) } 
                      
                      { isEditingColor &&(
                        <select
                          name="color"
                          value={selectedBlock.color}
                          onChange={(e) => {
                          handleInputChange2(e);
                          if (isfromColorClick) {setIsEditingColor(false); isfromColorClick = false} // Close after selection
                        }}
                          className={`${styles.select_popup} ${styles[selectedBlock.color]}`}
                          autoFocus
                          onMouseDown={() => {isfromColorClick = true}}
                          size={colorOptions.length - 1}
                          onBlur={() => setIsEditingColor(false)} // close on blur
                          onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.target.blur();
                          }
                          }
                        }
                        >
                          {colorOptions
                            .filter(color => color.value !== 'random')
                            .map(color => (
                              <option key={color.value} value={color.value}>
                                {color.label}
                              </option>
                            ))}
                        </select>


                      )
                    
                    }
                    </div>

                    {!isEditingDescription && selectedBlock.description ? (

                    <React.Fragment>
                      
                      {(
                        <div className={`${styles.description_details} ${styles[selectedBlock.color]}`} onClick={() => {setIsEditingDescription(true); setisfromClick(true);}}>
                          <div className={styles.details_section}>
                            <h4>Description</h4>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{selectedBlock.description}</p>
                          </div>
                        </div>
                      )} 
                    </React.Fragment>
                  ) : (
                    <textarea 
                      className={`${styles.popup_description_input} ${styles[selectedBlock.color]}`} 
                      placeholder="Optional additional details" 
                      ref={inputRef}
                      name="description"
                      value={selectedBlock.description} 
                      rows="5" 
                      cols="50"
                      onBlur={() => {
                        setIsEditingDescription(false); 
                        setisfromClick(false);
                        if (selectedBlock.description) {
                                const updatedBlock = {
                                    ...selectedBlock,
                                    description: selectedBlock.description.trim()
                                };

                                setSelectedBlock(updatedBlock);
                              }
                      }     
                    }
                      onClick={(e) => {e.stopPropagation(); setIsEditingDescription(true); setisfromClick(true);}}
                      onChange={handleInputChange2}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            setIsEditingDescription(false)
                            setisfromClick(false)
                            if (selectedBlock.description) {
                                const updatedBlock = {
                                    ...selectedBlock,
                                    description: selectedBlock.description.trim()
                                };

                                setSelectedBlock(updatedBlock);
                            }
                            
                            
                            // optionally call a save function here
                          }
                          else if (e.key === 'Tab') {
                            e.preventDefault();
                            const textarea = inputRef.current;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const value = selectedBlock.description;

                            const newValue = value.substring(0, start) + '\t' + value.substring(end);
                            if (newValue.trim()) {
                              setSelectedBlock(prev => ({
                                ...prev,
                                description: newValue
                              }));
                              // Update cursor position after the inserted tab
                              setTimeout(() => {
                                textarea.selectionStart = textarea.selectionEnd = start + 1;
                              }, 0);
                            }

                            
                          }

                        }}
                    />
                  )}
                  </React.Fragment>
                </div>
                
                <div className={styles.popup_actions}>
                  <button className={`${styles.action_button} ${styles.submit}`} onClick={(e)=>{handleSave()}}>
                    <Check size={16} />
                    <span>Save</span>
                  </button>
                  <button className={`${styles.action_button} ${styles.delete}`} onClick={(e) => {     
                              if (handleDeleteBlock(selectedBlock.id) === undefined) {
                                closePopup(true);
                              }
                            }}>
                    <Trash size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </React.Fragment>
            </div>
          </div>
        </React.Fragment>
      )}




    </div>
  );
}