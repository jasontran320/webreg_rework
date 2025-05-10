import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, AlertCircle, Check, X } from 'lucide-react';
import styles from '../styles/plan.module.css'
import { CourseContext } from '../data/CourseContext.jsx'

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    setError('')
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

   const confirmed = !deletedString || window.confirm(`Are you sure you want to delete ${course.id}? This is a prerequisite to these classes which will also be all deleted: ${deletedString}`);
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
      if (deletedString) setSuccess('Blocks deleted successfully'); else setSuccess('Block deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    }
    else {
      setSuccess('Deletion Cancelled');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the value for 'duration' is a valid integer
    if (name === 'duration' && isNaN(Number(value))) {
      setError('Invalid input: duration must be an integer');
      setTimeout(() => setError(''), 3000);
      return; // Stop further execution if invalid
    }
    setNewBlock(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'duration' && {
        endTime: addHoursToTime(prev.startTime, value),
      }),
      ...(name === 'startTime' && {
        endTime: addHoursToTime(value, prev.duration),
      }),
    }));
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

  const handleClick = (day, time) => {
    setNewBlock(prev => ({
      ...prev,
      ["startTime"]: time,
      ["day"]: day,
      ["endTime"]: addHoursToTime(time, prev.duration)
    }));
    setShowForm(true)
    window.scrollTo({ top: 85, behavior: "smooth" });
  }
  

  // Handle form submission
  const handleSubmit = () => {

    if (newBlock.title.trim() === '') {
      setError('Please enter a title for the block');
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
    
    if (convertTimeToMinutes(newBlock.startTime) >= convertTimeToMinutes(newBlock.endTime)) {
      setError('End time must be after start time');
      return;
    }

    if (convertTimeToMinutes(newBlock.endTime) > convertTimeToMinutes("23:00")) {
      setError('End time must be within bounds');
      return;
    }
    
    if (checkOverlap(newBlock)) {
      setError('This block overlaps with an existing block');
      return;
    }
    
    const id = (
      Math.max(...blocks.map(block => parseInt(block.id, 10))) + 1
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
    // Find the course that contains the block with the given blockId
    const findCourseByBlockId = (courses) => {
      return courses.find(course => course.block?.id === blockId);
    };

    // Search for the block in both registeredCourses and waitlistedCourses
    const courseInRegistered = findCourseByBlockId(registeredCourses);
    const courseInWaitlisted = findCourseByBlockId(waitlistedCourses);

    // If the course is found in registeredCourses, filter it out
    if (courseInRegistered) {
      handleDrop(courseInRegistered.id);
    }

    // If the course is found in waitlistedCourses, filter it out
     else if (courseInWaitlisted) {
      setWaitlistedCourses(waitlistedCourses.filter(course => course.id !== courseInWaitlisted.id));
      setBlocks(blocks.filter(block => block.id !== blockId));
      setSuccess('Block deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    }
    else {
      setBlocks(blocks.filter(block => block.id !== blockId));
      setSuccess('Block deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
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

  return (
    <div className={styles.planner_container}>
      <div className={styles.planner_header}>
        <h1 className={styles.planner_title}>Class Schedule Planner</h1>
        <button 
          className={`${styles.button} ${showForm ? styles.button_red : styles.button_blue}`}
          onClick={() => setShowForm(!showForm)}
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
        <div className= {styles.form_container}>
          <h2 className={styles.form_title}>Add New Class or Event Block</h2>
          
          {error && (
            <div className= {`${styles.message_container} ${styles.error_message}`}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className={styles.form_layout}>
            <div className={styles.input_group}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                name="title"
                value={newBlock.title}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., MATH 101"
              />
            </div>

            
            <div className={styles.input_group}>
              <label className={styles.label}>Day of Week</label>
              <select
                name="day"
                value={newBlock.day}
                onChange={handleInputChange}
                className={styles.select}
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
                  value={newBlock.startTime}
                  onChange={handleInputChange}
                  className={styles.select_small}
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


            
            <div className={styles.input_group}>
              <label className={styles.label}>
                Duration: {
                  <input
                    type="text"
                    name="duration"
                    value={newBlock.duration}
                    onChange={handleInputChange}
                    className={styles.input_small}
                    placeholder="e.g., 1.5"
                  
                  />
                } hrs 
              </label>
              <input
                type="range"
                name="duration"
                min="0.5"
                max="8"
                step="0.5"
                value={newBlock.duration}
                onChange={handleInputChange}
                className={styles.slider} // define this in your CSS if needed
              />
            </div>










            

            <div className={styles.form_buttons}>
              <button 
                onClick={handleSubmit} 
                className={`${styles.button} ${styles.button_green}`}
              >
                <Check size={16} />
                Add Block
              </button>
            </div>
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
                        key={block.id}
                        className={`${styles.block} ${styles[`block_${block.color}`]}`}
                        style={{ top, height }}
                      >
                        <div className={styles.block_header}>
                          <div className={styles.block_title}>
                            {block.title}
                          </div>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
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
    </div>
  );
}