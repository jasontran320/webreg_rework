import React, { createContext, useState, useMemo, useEffect } from 'react';

// Default values for initial state
const defaultCourses = [
  { id: 'CS101', name: 'Introduction to Computer Science', credits: 3, status: 'Available', seats: 15, enrolled: 10, waitlist: 0, required: true, completed: false, department: 'CS', prerequisites: [], block: { id: '1', title: 'CS 101', day: 'monday', startTime: '09:00', endTime: '10:30', color: 'blue' }, location: "HIB 100", description: "Introduction to fundamental programming concepts, software engineering principles, and computational thinking." },
  { id: 'CS201', name: 'Data Structures', credits: 4, status: 'Waitlisted', seats: 30, enrolled: 30, waitlist: 5, required: true, completed: false, department: 'CS', prerequisites: ['CS101'], block: { id: '2', title: 'CS 201', day: 'monday', startTime: '13:00', endTime: '14:30', color: 'green' }, location: "HIB 100", description: "Study of basic data structures such as lists, stacks, queues, trees, and graphs, and their use in algorithm development." },
  { id: 'CS301', name: 'Algorithms', credits: 4, status: 'Full', seats: 25, enrolled: 25, waitlist: 8, required: true, completed: false, department: 'CS', prerequisites: ['CS201'], block: { id: '3', title: 'CS 301', day: 'tuesday', startTime: '11:00', endTime: '12:30', color: 'purple' }, location: "HIB 100", description: "Design and analysis of algorithms, including sorting, searching, divide and conquer, dynamic programming, and greedy algorithms." },
  { id: 'MATH101', name: 'Calculus I', credits: 4, status: 'Available', seats: 40, enrolled: 30, waitlist: 0, required: true, completed: true, department: 'MATH', prerequisites: [], block: { id: '4', title: 'MATH 101', day: 'wednesday', startTime: '09:00', endTime: '10:30', color: 'blue' }, location: "HIB 100", description: "Limits, derivatives, and integrals of functions of one variable, with applications." },
  { id: 'MATH201', name: 'Calculus II', credits: 4, status: 'Available', seats: 35, enrolled: 20, waitlist: 0, required: true, completed: false, department: 'MATH', prerequisites: ['MATH101'], block: { id: '5', title: 'MATH 201', day: 'thursday', startTime: '15:00', endTime: '16:30', color: 'yellow' }, location: "HIB 100", description: "Techniques of integration, infinite series, and introduction to multivariable calculus." },
  { id: 'PHYS101', name: 'Physics I', credits: 4, status: 'Available', seats: 35, enrolled: 20, waitlist: 0, required: false, completed: false, department: 'PHYS', prerequisites: ['MATH101'], block: { id: '6', title: 'PHYS 101', day: 'friday', startTime: '09:00', endTime: '10:30', color: 'red' }, location: "HIB 100", description: "Mechanics, kinematics, Newton's laws, energy, and momentum." },
  { id: 'ENG101', name: 'English Composition', credits: 3, status: 'Available', seats: 25, enrolled: 15, waitlist: 0, required: true, completed: true, department: 'ENG', prerequisites: [], block: { id: '7', title: 'ENG 101', day: 'friday', startTime: '11:00', endTime: '12:30', color: 'pink' }, location: "HIB 100", description: "Development of academic writing skills through essays, research, and revision." },
  { id: 'CS350', name: 'Operating Systems', credits: 4, status: 'Available', seats: 20, enrolled: 15, waitlist: 0, required: true, completed: false, department: 'CS', prerequisites: ['CS201', 'CS301'], block: { id: '8', title: 'CS 350', day: 'friday', startTime: '13:00', endTime: '14:30', color: 'green' }, location: "HIB 100", description: "Introduction to operating system principles: processes, memory management, file systems, and concurrency." },
  { id: 'CS450', name: 'Networks', credits: 3, status: 'Available', seats: 30, enrolled: 25, waitlist: 0, required: false, completed: false, department: 'CS', prerequisites: ['CS201'], block: { id: '9', title: 'CS 450', day: 'friday', startTime: '15:00', endTime: '16:30', color: 'red' }, location: "HIB 100", description: "Fundamentals of computer networking including protocols, TCP/IP, LANs, WANs, and security." },
  { 
      id: 'CS215', name: 'Systems Programming', credits: 3, status: 'Registered', seats: 20, enrolled: 20, waitlist: 0, required: true, completed: false, department: 'CS', prerequisites: [], 
      block: { id: '10', title: 'CS 215', day: 'tuesday', startTime: '14:00', endTime: '15:30', color: 'blue' }, 
      location: "HIB 100", description: "Programming close to the hardware, covering memory management, system calls, and process control." 
  },
];

const defaultRegisteredCourses = [
  {
    id: 'CS215',
    name: 'Systems Programming',
    credits: 3,
    status: 'Registered',
    section: '002',
    department: 'CS',
    block: {
      id: '10',
      title: 'CS 215',
      day: 'tuesday',
      startTime: '14:00',
      endTime: '15:30',
      color: 'blue',
    },
    location: "HIB 100",
    prerequisites: [],
    description:
      "Programming close to the hardware, covering memory management, system calls, and process control.",
  },
];

const defaultWaitlistedCourses = [
  {
    id: 'CS201',
    name: 'Data Structures',
    credits: 4,
    waitlistPosition: 2,
    section: '001',
    department: 'CS',
    block: {
      id: '2',
      title: 'CS 201',
      day: 'monday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
    },
    location: "HIB 100",
    prerequisites: ['CS101'],
    description:
      "Study of basic data structures such as lists, stacks, queues, trees, and graphs, and their use in algorithm development.",
  },
];

const defaultBlocks = [
  {
      id: '10',
      title: 'CS 215',
      day: 'tuesday',
      startTime: '14:00',
      endTime: '15:30',
      color: 'blue',
    },

  {
      id: '2',
      title: 'CS 201',
      day: 'monday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
    },
  

  // { id: '1', title: 'CS 101', day: 'monday', startTime: '09:00', endTime: '10:30', color: 'blue' },
  // { id: '2', title: 'CS 201', day: 'monday', startTime: '13:00', endTime: '14:30', color: 'green' },
  // { id: '3', title: 'CS 301', day: 'tuesday', startTime: '11:00', endTime: '12:30', color: 'purple' },
  // { id: '4', title: 'MATH 101', day: 'wednesday', startTime: '09:00', endTime: '10:30', color: 'blue' },
  // { id: '5', title: 'MATH 201', day: 'thursday', startTime: '15:00', endTime: '16:30', color: 'yellow' },
  // { id: '6', title: 'PHYS 101', day: 'friday', startTime: '09:00', endTime: '10:30', color: 'red' },
  // { id: '7', title: 'ENG 101', day: 'friday', startTime: '11:00', endTime: '12:30', color: 'pink' },
  // { id: '8', title: 'CS 350', day: 'friday', startTime: '13:00', endTime: '14:30', color: 'green' },
  // { id: '9', title: 'CS 450', day: 'friday', startTime: '15:00', endTime: '16:30', color: 'red' },
  // { id: '10', title: 'CS 215', day: 'tuesday', startTime: '14:00', endTime: '15:30', color: 'blue' },
];

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  // Check if this is an app relaunch
  const checkForAppRelaunch = () => {
    // Option 1: Using session storage (clears when browser tab closes)
    const isNewSession = !sessionStorage.getItem('app_session_active');
    if (isNewSession) {
      sessionStorage.setItem('app_session_active', 'true');
      return true;
    }
    
    return false;
  };
  
  // Clear all course data from localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem('courses');
    localStorage.removeItem('registeredCourses');
    localStorage.removeItem('waitlistedCourses');
    localStorage.removeItem('blocks');
  };
  
  // Check for app relaunch and reset if needed
  const shouldReset = checkForAppRelaunch();
  if (shouldReset) {
    clearLocalStorage();
  }
  
  // Helper function to safely parse JSON from localStorage with fallback to defaults
  const getLocalStorageData = (key, defaultValue) => {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // Initialize states with data from localStorage or defaults
  const [courses, setCourses] = useState(() => 
    getLocalStorageData('courses', defaultCourses)
  );
  
  const [registeredCourses, setRegisteredCourses] = useState(() => 
    getLocalStorageData('registeredCourses', defaultRegisteredCourses)
  );
  
  const [waitlistedCourses, setWaitlistedCourses] = useState(() => 
    getLocalStorageData('waitlistedCourses', defaultWaitlistedCourses)
  );
  
  const [blocks, setBlocks] = useState(() => 
    getLocalStorageData('blocks', defaultBlocks)
  );

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('registeredCourses', JSON.stringify(registeredCourses));
  }, [registeredCourses]);

  useEffect(() => {
    localStorage.setItem('waitlistedCourses', JSON.stringify(waitlistedCourses));
  }, [waitlistedCourses]);

  useEffect(() => {
    localStorage.setItem('blocks', JSON.stringify(blocks));
  }, [blocks]);

  // Function to reset all data to defaults
  const resetToDefaults = () => {
    setCourses(defaultCourses);
    setRegisteredCourses(defaultRegisteredCourses);
    setWaitlistedCourses(defaultWaitlistedCourses);
    setBlocks(defaultBlocks);
  };

  // Calculate active blocks
  const activeBlocks = useMemo(() => {
    const usedBlockIds = new Set([
      ...registeredCourses.map((course) => course.block?.id),
      ...waitlistedCourses.map((course) => course.block?.id),
    ]);
    return blocks.filter((block) => usedBlockIds.has(block.id));
  }, [registeredCourses, waitlistedCourses, blocks]);

  // Context value with all state and functions
  const contextValue = {
    courses, 
    setCourses, 
    blocks, 
    setBlocks, 
    registeredCourses, 
    setRegisteredCourses,
    waitlistedCourses, 
    setWaitlistedCourses, 
    activeBlocks,
    resetToDefaults // Exposing the reset function to consumers
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};