import React, { createContext, useState, useMemo, useEffect } from 'react';

// Default values for initial state
// const defaultCourses = [
//   { id: 'CS101', name: 'Introduction to Computer Science', credits: 3, status: 'Available', seats: 15, enrolled: 10, waitlist: 0, required: true, completed: false, department: 'CS', prerequisites: [], block: { id: '1', title: 'CS 101', day: 'monday', startTime: '09:00', endTime: '10:30', color: 'blue' }, location: "HIB 100", description: "Introduction to fundamental programming concepts, software engineering principles, and computational thinking." },
//   { id: 'CS201', name: 'Data Structures', credits: 4, status: 'Waitlisted', seats: 30, enrolled: 30, waitlist: 5, required: true, completed: false, department: 'CS', prerequisites: ['CS101'], block: { id: '2', title: 'CS 201', day: 'monday', startTime: '13:00', endTime: '14:30', color: 'green' }, location: "HIB 100", description: "Lab for basic data structures class CS101. Please Enroll whenever possible. For waitlisted studnents, contact admins" },
//   { id: 'CS301', name: 'Algorithms', credits: 4, status: 'Full', seats: 25, enrolled: 25, waitlist: 8, required: true, completed: false, department: 'CS', prerequisites: ['CS201'], block: { id: '3', title: 'CS 301', day: 'tuesday', startTime: '11:00', endTime: '12:30', color: 'purple' }, location: "HIB 100", description: "Design and analysis of algorithms, including sorting, searching, divide and conquer, dynamic programming, and greedy algorithms." },
//   { id: 'MATH101', name: 'Calculus I', credits: 4, status: 'Available', seats: 40, enrolled: 30, waitlist: 0, required: true, completed: true, department: 'MATH', prerequisites: [], block: { id: '4', title: 'MATH 101', day: 'wednesday', startTime: '09:00', endTime: '10:30', color: 'blue' }, location: "HIB 100", description: "Limits, derivatives, and integrals of functions of one variable, with applications." },
//   { id: 'MATH201', name: 'Calculus II', credits: 4, status: 'Available', seats: 35, enrolled: 20, waitlist: 0, required: true, completed: false, department: 'MATH', prerequisites: ['MATH101'], block: { id: '5', title: 'MATH 201', day: 'thursday', startTime: '15:00', endTime: '16:30', color: 'yellow' }, location: "HIB 100", description: "Techniques of integration, infinite series, and introduction to multivariable calculus." },
//   { id: 'PHYS101', name: 'Physics I', credits: 4, status: 'Available', seats: 35, enrolled: 20, waitlist: 0, required: false, completed: false, department: 'PHYS', prerequisites: ['MATH101'], block: { id: '6', title: 'PHYS 101', day: 'friday', startTime: '09:00', endTime: '10:30', color: 'red' }, location: "HIB 100", description: "Mechanics, kinematics, Newton's laws, energy, and momentum." },
//   { id: 'ENG101', name: 'English Composition', credits: 3, status: 'Available', seats: 25, enrolled: 15, waitlist: 0, required: true, completed: true, department: 'ENG', prerequisites: [], block: { id: '7', title: 'ENG 101', day: 'friday', startTime: '11:00', endTime: '12:30', color: 'pink' }, location: "HIB 100", description: "Development of academic writing skills through essays, research, and revision." },
//   { id: 'CS350', name: 'Operating Systems', credits: 4, status: 'Available', seats: 20, enrolled: 15, waitlist: 0, required: true, completed: false, department: 'CS', prerequisites: ['CS201', 'CS301'], block: { id: '8', title: 'CS 350', day: 'friday', startTime: '13:00', endTime: '14:30', color: 'green' }, location: "HIB 100", description: "Introduction to operating system principles: processes, memory management, file systems, and concurrency." },
//   { id: 'CS450', name: 'Networks', credits: 3, status: 'Available', seats: 30, enrolled: 25, waitlist: 0, required: false, completed: false, department: 'CS', prerequisites: ['CS201'], block: { id: '9', title: 'CS 450', day: 'friday', startTime: '15:00', endTime: '16:30', color: 'red' }, location: "HIB 100", description: "Fundamentals of computer networking including protocols, TCP/IP, LANs, WANs, and security." },
//   { 
//       id: 'CS215', name: 'Systems Programming', credits: 3, status: 'Registered', seats: 20, enrolled: 20, waitlist: 0, required: true, completed: false, department: 'CS', prerequisites: [], 
//       block: { id: '10', title: 'CS 215', day: 'tuesday', startTime: '14:00', endTime: '15:30', color: 'blue' }, 
//       location: "HIB 100", description: "Programming close to the hardware, covering memory management, system calls, and process control." 
//   },
// ];


const defaultCourses = [
  {
    id: 'CS101',
    name: 'Introduction to Computer Science',
    credits: 3,
    status: 'Available',
    seats: 15,
    enrolled: 10,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: [],
    corequisites: ["CS101-D1", "CS101-D2"],
    iscorequisite: false,
    block: [{
      id: '1',
      title: 'CS 101',
      day: 'monday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'blue',
      description: "Introduction to fundamental programming concepts, software engineering principles, and computational thinking.",
      location: "HIB 100", 
      locationCoords:{
        "lat": 33.64834506581709,
        "lng": -117.84352898597719,
        "address": "HIB 100",
        "address2": "Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
    }
    },
    {
        id: '41',
        title: 'CS 101',
        day: 'wednesday',
        startTime: '09:00',
        endTime: '10:30',
        color: 'blue',
        description: "Introduction to fundamental programming concepts, software engineering principles, and computational thinking.",
        location: "HIB 100", 
        locationCoords:{
          "lat": 33.64834506581709,
          "lng": -117.84352898597719,
          "address": "HIB 100",
          "address2": "Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
      }
      }
  
  
  ],
    location: "HIB 100",
    description: "Introduction to fundamental programming concepts, software engineering principles, and computational thinking."
  },
  {
    id: 'CS201',
    name: 'Intermediate Computer Science',
    credits: 2,
    status: 'Waitlisted',
    seats: 30,
    enrolled: 30,
    waitlist: 5,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: ['CS101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '2',
      title: 'CS201',
      day: 'monday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
      description: "Advanced data structures class.",
      location: "HIB 125",
      locationCoords:{
        "lat": 33.64834506581709,
        "lng": -117.84352898597719,
        "address": "HIB 125",
        "address2": "Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
    }
    },{
      id: '42',
      title: 'CS201',
      day: 'wednesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
      description: "Advanced data structures class.",
      location: "HIB 125",
      locationCoords:{
        "lat": 33.64834506581709,
        "lng": -117.84352898597719,
        "address": "HIB 125",
        "address2": "Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
    }
    }],
    location: "HIB 125",
    description: "Advanced data structures class."
  },
  {
    id: 'CS301',
    name: 'Algorithms',
    credits: 4,
    status: 'Full',
    seats: 25,
    enrolled: 25,
    waitlist: 8,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: ['CS201'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '3',
      title: 'CS 301',
      day: 'tuesday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'purple',
      description: "Design and analysis of algorithms, including sorting, searching, divide and conquer, dynamic programming, and greedy algorithms.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '43',
      title: 'CS 301',
      day: 'thursday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'purple',
      description: "Design and analysis of algorithms, including sorting, searching, divide and conquer, dynamic programming, and greedy algorithms.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "ICS 121",
    description: "Design and analysis of algorithms, including sorting, searching, divide and conquer, dynamic programming, and greedy algorithms."
  },
  {
    id: 'MATH101',
    name: 'Calculus I',
    credits: 4,
    status: 'Available',
    seats: 40,
    enrolled: 30,
    waitlist: 0,
    required: true,
    completed: true,
    department: 'MATH',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '4',
      title: 'MATH 101',
      day: 'wednesday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'blue',
      description: "Limits, derivatives, and integrals of functions of one variable, with applications.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '44',
      title: 'MATH 101',
      day: 'friday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'blue',
      description: "Limits, derivatives, and integrals of functions of one variable, with applications.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "RH 100",
    description: "Limits, derivatives, and integrals of functions of one variable, with applications."
  },
  {
    id: 'MATH201',
    name: 'Calculus II',
    credits: 4,
    status: 'Available',
    seats: 35,
    enrolled: 20,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'MATH',
    prerequisites: ['MATH101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '5',
      title: 'MATH 201',
      day: 'tuesday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'yellow',
      description: "Techniques of integration, infinite series, and introduction to multivariable calculus.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
      
    },
  {
      id: '45',
      title: 'MATH 201',
      day: 'thursday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'yellow',
      description: "Techniques of integration, infinite series, and introduction to multivariable calculus.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
      
    }],
    location: "RH 100",
    description: "Techniques of integration, infinite series, and introduction to multivariable calculus."
  },
  {
    id: 'PHYS101',
    name: 'Physics I',
    credits: 4,
    status: 'Available',
    seats: 35,
    enrolled: 20,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'PHYS',
    prerequisites: ['MATH101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '6',
      title: 'PHYS 101',
      day: 'wednesday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'red',
      description: "Mechanics, kinematics, Newton's laws, energy, and momentum.",
      location: "PSLH 100",
      locationCoords: {
    "lat": 33.64336323886249,
    "lng": -117.84402251243593,
    "address": "PSLH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  
  {
      id: '46',
      title: 'PHYS 101',
      day: 'friday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'red',
      description: "Mechanics, kinematics, Newton's laws, energy, and momentum.",
      location: "PSLH 100",
      locationCoords: {
    "lat": 33.64336323886249,
    "lng": -117.84402251243593,
    "address": "PSLH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "PSLH 100",
    description: "Mechanics, kinematics, Newton's laws, energy, and momentum."
  },
  {
    id: 'ENG101',
    name: 'English Composition',
    credits: 3,
    status: 'Available',
    seats: 25,
    enrolled: 15,
    waitlist: 0,
    required: true,
    completed: true,
    department: 'ENG',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '7',
      title: 'ENG 101',
      day: 'wednesday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'pink',
      description: "Development of academic writing skills through essays, research, and revision.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  {
      id: '47',
      title: 'ENG 101',
      day: 'friday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'pink',
      description: "Development of academic writing skills through essays, research, and revision.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }],
    location: "HH 100",
    description: "Development of academic writing skills through essays, research, and revision."
  },
  {
    id: 'CS350',
    name: 'Operating Systems',
    credits: 4,
    status: 'Available',
    seats: 20,
    enrolled: 15,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: ['CS201', 'CS301'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '8',
      title: 'CS 350',
      day: 'wednesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
      description: "Introduction to operating system principles: processes, memory management, file systems, and concurrency.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '48',
      title: 'CS 350',
      day: 'friday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
      description: "Introduction to operating system principles: processes, memory management, file systems, and concurrency.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Introduction to operating system principles: processes, memory management, file systems, and concurrency."
  },
  {
    id: 'CS450',
    name: 'Networks',
    credits: 3,
    status: 'Full',
    seats: 30,
    enrolled: 30,
    waitlist: 10,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: ['CS201'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '9',
      title: 'CS 450',
      day: 'wednesday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'red',
      description: "Fundamentals of computer networking including protocols, TCP/IP, LANs, WANs, and security.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "CS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '49',
      title: 'CS 450',
      day: 'friday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'red',
      description: "Fundamentals of computer networking including protocols, TCP/IP, LANs, WANs, and security.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "CS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Fundamentals of computer networking including protocols, TCP/IP, LANs, WANs, and security."
  },
  {
    id: 'CS215',
    name: 'Systems Programming',
    credits: 3,
    status: 'Waitlisted',
    seats: 20,
    enrolled: 20,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '10',
      title: 'CS 215',
      day: 'tuesday',
      startTime: '14:00',
      endTime: '15:30',
      color: 'blue',
      description: "Programming close to the hardware, covering memory management, system calls, and process control.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '50',
      title: 'CS 215',
      day: 'thursday',
      startTime: '14:00',
      endTime: '15:30',
      color: 'blue',
      description: "Programming close to the hardware, covering memory management, system calls, and process control.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "ICS 121",
    description: "Programming close to the hardware, covering memory management, system calls, and process control."
  },
  {
    id: 'CS122A',
    name: 'Introduction to Data Management',
    credits: 4,
    status: 'Available',
    seats: 40,
    enrolled: 35,
    waitlist: 0,
    required: true,
    completed: true,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '11',
      title: 'CS 122A',
      day: 'monday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'yellow',
      description: "Introduction to database systems, relational data model, SQL, and basic database design.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '51',
      title: 'CS 122A',
      day: 'wednesday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'yellow',
      description: "Introduction to database systems, relational data model, SQL, and basic database design.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "ICS 121",
    description: "Introduction to database systems, relational data model, SQL, and basic database design."
  },
  {
    id: 'CS143A',
    name: 'Compiler Construction',
    credits: 4,
    status: 'Waitlisted',
    seats: 25,
    enrolled: 25,
    waitlist: 3,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: ['CS20'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '12',
      title: 'CS 143A',
      day: 'wednesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
      description: "Design and implementation of compilers including lexical analysis, parsing, and code generation.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  
  {
      id: '52',
      title: 'CS 143A',
      day: 'friday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
      description: "Design and implementation of compilers including lexical analysis, parsing, and code generation.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "ICS 121",
    description: "Design and implementation of compilers including lexical analysis, parsing, and code generation."
  },
  {
    id: 'CS161',
    name: 'Introduction to Artificial Intelligence',
    credits: 4,
    status: 'Available',
    seats: 30,
    enrolled: 28,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '13',
      title: 'CS 161',
      day: 'tuesday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'purple',
      description: "Basic AI concepts including search, planning, reasoning, and machine learning.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '53',
      title: 'CS 161',
      day: 'thursday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'purple',
      description: "Basic AI concepts including search, planning, reasoning, and machine learning.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Basic AI concepts including search, planning, reasoning, and machine learning."
  },
  {
    id: 'CS178',
    name: 'Machine Learning and Data Mining',
    credits: 4,
    status: 'Full',
    seats: 30,
    enrolled: 30,
    waitlist: 15,
    required: false,
    completed: true,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '14',
      title: 'CS 178',
      day: 'tuesday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'blue',
      description: "Introduction to machine learning methods, data analysis techniques, and their applications.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '54',
      title: 'CS 178',
      day: 'thursday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'blue',
      description: "Introduction to machine learning methods, data analysis techniques, and their applications.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Introduction to machine learning methods, data analysis techniques, and their applications."
  },
  {
    id: 'CS122B',
    name: 'Projects in Databases and Web Applications',
    credits: 4,
    status: 'Waitlisted',
    seats: 20,
    enrolled: 20,
    waitlist: 2,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: ['CS122A'],
    corequisites: ["CS122B-D1", "CS122B-L"],
    iscorequisite: false,
    block: [{
      id: '15',
      title: 'CS 122B',
      day: 'wednesday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'blue',
      description: "Project-based course on full-stack development, focusing on databases and web technologies.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  
  {
      id: '55',
      title: 'CS 122B',
      day: 'friday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'blue',
      description: "Project-based course on full-stack development, focusing on databases and web technologies.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "ICS 121",
    description: "Project-based course on full-stack development, focusing on databases and web technologies."
  },
  {
    id: 'CS132',
    name: 'Computer Graphics',
    credits: 4,
    status: 'Available',
    seats: 30,
    enrolled: 25,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '16',
      title: 'CS 132',
      day: 'monday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'purple',
      description: "Fundamentals of computer graphics including transformations, modeling, rendering, and OpenGL.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '56',
      title: 'CS 132',
      day: 'wednesday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'purple',
      description: "Fundamentals of computer graphics including transformations, modeling, rendering, and OpenGL.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Fundamentals of computer graphics including transformations, modeling, rendering, and OpenGL."
  },
  {
    id: 'CS125',
    name: 'Computer Security',
    credits: 4,
    status: 'Available',
    seats: 35,
    enrolled: 33,
    waitlist: 0,
    required: false,
    completed: true,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '17',
      title: 'CS 125',
      day: 'wednesday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'red',
      description: "Introduction to computer security, including cryptography, access control, and network security.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '57',
      title: 'CS 125',
      day: 'friday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'red',
      description: "Introduction to computer security, including cryptography, access control, and network security.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Introduction to computer security, including cryptography, access control, and network security."
  },
  {
    id: 'CS145',
    name: 'Embedded Systems',
    credits: 4,
    status: 'Waitlisted',
    seats: 25,
    enrolled: 25,
    waitlist: 4,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: ['CS143A'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '18',
      title: 'CS 145',
      day: 'tuesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
      description: "Design and implementation of embedded systems with real-time constraints and hardware interactions.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '58',
      title: 'CS 145',
      day: 'thursday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'green',
      description: "Design and implementation of embedded systems with real-time constraints and hardware interactions.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Design and implementation of embedded systems with real-time constraints and hardware interactions."
  },
  {
    id: 'CS122C',
    name: 'Advanced Data Management',
    credits: 4,
    status: 'Available',
    seats: 20,
    enrolled: 18,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '19',
      title: 'CS 122C',
      day: 'wednesday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'yellow',
      description: "Advanced topics in data management including indexing, query optimization, and transactions.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '59',
      title: 'CS 122C',
      day: 'friday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'yellow',
      description: "Advanced topics in data management including indexing, query optimization, and transactions.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Advanced topics in data management including indexing, query optimization, and transactions."
  },
  {
    id: 'CS131',
    name: 'Programming Languages',
    credits: 4,
    status: 'Waitlisted',
    seats: 30,
    enrolled: 30,
    waitlist: 6,
    required: true,
    completed: true,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '20',
      title: 'CS 131',
      day: 'tuesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'red',
      description: "Concepts of programming languages including syntax, semantics, and implementation techniques.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '60',
      title: 'CS 131',
      day: 'thursday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'red',
      description: "Concepts of programming languages including syntax, semantics, and implementation techniques.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Concepts of programming languages including syntax, semantics, and implementation techniques."
  },
  {
    id: 'CS112',
    name: 'Computer Architecture',
    credits: 4,
    status: 'Full',
    seats: 25,
    enrolled: 25,
    waitlist: 10,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: ['CS301'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '21',
      title: 'CS 112',
      day: 'monday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'blue',
      description: "Study of computer organization and architecture, including instruction sets, pipelining, and memory hierarchies.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '61',
      title: 'CS 112',
      day: 'wednesday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'blue',
      description: "Study of computer organization and architecture, including instruction sets, pipelining, and memory hierarchies.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Study of computer organization and architecture, including instruction sets, pipelining, and memory hierarchies."
  },
  {
    id: 'CS134',
    name: 'Computer Vision',
    credits: 4,
    status: 'Available',
    seats: 30,
    enrolled: 27,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '22',
      title: 'CS 134',
      day: 'tuesday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'blue',
      description: "Techniques and applications of computer vision including image processing, feature extraction, and recognition.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '62',
      title: 'CS 134',
      day: 'thursday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'blue',
      description: "Techniques and applications of computer vision including image processing, feature extraction, and recognition.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Techniques and applications of computer vision including image processing, feature extraction, and recognition."
  },
  {
    id: 'CS121',
    name: 'Information Retrieval',
    credits: 4,
    status: 'Available',
    seats: 35,
    enrolled: 30,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'CS',
    prerequisites: ['ICS31'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '23',
      title: 'CS 121',
      day: 'wednesday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'green',
      description: "Principles of information retrieval including search engines, ranking, and evaluation.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '63',
      title: 'CS 121',
      day: 'friday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'green',
      description: "Principles of information retrieval including search engines, ranking, and evaluation.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "ICS 121",
    description: "Principles of information retrieval including search engines, ranking, and evaluation."
  },
    {
    id: 'MATH221',
    name: 'Linear Algebra',
    credits: 4,
    status: 'Available',
    seats: 40,
    enrolled: 35,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'MATH',
    prerequisites: ['MATH101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '24',
      title: 'MATH 221',
      day: 'monday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'blue',
      description: "Matrix theory, systems of linear equations, vector spaces, eigenvalues, and eigenvectors.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '64',
      title: 'MATH 221',
      day: 'wednesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'blue',
      description: "Matrix theory, systems of linear equations, vector spaces, eigenvalues, and eigenvectors.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "RH 100",
    description: "Matrix theory, systems of linear equations, vector spaces, eigenvalues, and eigenvectors."
  },
  {
    id: 'PHYS102',
    name: 'Electricity and Magnetism',
    credits: 4,
    status: 'Available',
    seats: 30,
    enrolled: 28,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'PHYS',
    prerequisites: ['PHYS101', 'MATH201', 'MATH333'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '25',
      title: 'PHYS 102',
      day: 'tuesday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'blue',
      description: "Introduction to electrostatics, electric fields, Gauss's Law, circuits, and magnetism.",
      location: "PSLH 100",
      locationCoords: {
    "lat": 33.64336323886249,
    "lng": -117.84402251243593,
    "address": "PSLH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '65',
      title: 'PHYS 102',
      day: 'thursday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'blue',
      description: "Introduction to electrostatics, electric fields, Gauss's Law, circuits, and magnetism.",
      location: "PSLH 100",
      locationCoords: {
    "lat": 33.64336323886249,
    "lng": -117.84402251243593,
    "address": "PSLH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "PSLH 100",
    description: "Introduction to electrostatics, electric fields, Gauss's Law, circuits, and magnetism."
  },
  {
    id: 'ENG201',
    name: 'Technical Writing',
    credits: 3,
    status: 'Available',
    seats: 25,
    enrolled: 20,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'ENG',
    prerequisites: ['ENG101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '26',
      title: 'ENG 201',
      day: 'wednesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'pink',
      description: "Focuses on writing in technical and scientific contexts including reports, proposals, and documentation.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  {
      id: '66',
      title: 'ENG 201',
      day: 'friday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'pink',
      description: "Focuses on writing in technical and scientific contexts including reports, proposals, and documentation.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }
  ],
    location: "HH 100",
    description: "Focuses on writing in technical and scientific contexts including reports, proposals, and documentation."
  },
  {
    id: 'BIO101',
    name: 'Molecular Biology',
    credits: 4,
    status: 'Available',
    seats: 35,
    enrolled: 29,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'BIO',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '27',
      title: 'BIO 101',
      day: 'tuesday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'green',
      description: "Cell structure and function, molecular genetics, and biochemical processes of life.",
      location: "BIO SCI III 112",
      locationCoords: {
    "lat": 33.64524997667189,
    "lng": -117.84616827964784,
    "address": "Biological Sciences III 112",
    "address2": "Biological Sciences III, 519, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  {
      id: '67',
      title: 'BIO 101',
      day: 'thursday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'green',
      description: "Cell structure and function, molecular genetics, and biochemical processes of life.",
      location: "BIO SCI III 112",
      locationCoords: {
    "lat": 33.64524997667189,
    "lng": -117.84616827964784,
    "address": "Biological Sciences III 112",
    "address2": "Biological Sciences III, 519, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }
  ],
    location: "BIO SCI III 112",
    description: "Cell structure and function, molecular genetics, and biochemical processes of life."
  },
  {
    id: 'PSYCH101',
    name: 'Introduction to Psychology',
    credits: 4,
    status: 'Available',
    seats: 50,
    enrolled: 45,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'PSYCH',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '28',
      title: 'PSYCH 101',
      day: 'wednesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'red',
      description: "Survey of major areas in psychology including development, cognition, behavior, and mental health.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  {
      id: '68',
      title: 'PSYCH 101',
      day: 'friday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'red',
      description: "Survey of major areas in psychology including development, cognition, behavior, and mental health.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }
  ],
    location: "HH 100",
    description: "Survey of major areas in psychology including development, cognition, behavior, and mental health."
  },
  {
    id: 'PHIL101',
    name: 'Introduction to Philosophy',
    credits: 4,
    status: 'Available',
    seats: 40,
    enrolled: 30,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'PHIL',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '29',
      title: 'PHIL 101',
      day: 'tuesday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'purple',
      description: "Introduction to philosophical reasoning, logic, ethics, metaphysics, and epistemology.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  {
      id: '69',
      title: 'PHIL 101',
      day: 'thursday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'purple',
      description: "Introduction to philosophical reasoning, logic, ethics, metaphysics, and epistemology.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }
  ],
    location: "HH 100",
    description: "Introduction to philosophical reasoning, logic, ethics, metaphysics, and epistemology."
  },
  {
    id: 'ECON101',
    name: 'Principles of Microeconomics',
    credits: 4,
    status: 'Available',
    seats: 50,
    enrolled: 47,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'ECON',
    prerequisites: [],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '30',
      title: 'ECON 101',
      day: 'monday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'pink',
      description: "Basic concepts of microeconomics: supply and demand, market structure, and consumer behavior.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  {
      id: '70',
      title: 'ECON 101',
      day: 'wednesday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'pink',
      description: "Basic concepts of microeconomics: supply and demand, market structure, and consumer behavior.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }
  ],
    location: "HH 100",
    description: "Basic concepts of microeconomics: supply and demand, market structure, and consumer behavior."
  },
    {
    id: 'ENG202',
    name: 'Advanced Composition',
    credits: 3,
    status: 'Available',
    seats: 25,
    enrolled: 18,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'ENG',
    prerequisites: ['ENG101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '31',
      title: 'ENG 202',
      day: 'tuesday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'pink',
      description: "Focus on argumentative and analytical writing, advanced research techniques, and revision.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  {
      id: '71',
      title: 'ENG 202',
      day: 'thursday',
      startTime: '13:00',
      endTime: '14:30',
      color: 'pink',
      description: "Focus on argumentative and analytical writing, advanced research techniques, and revision.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }
  ],
    location: "HH 100",
    description: "Focus on argumentative and analytical writing, advanced research techniques, and revision."
  },
  {
    id: 'MATH130A',
    name: 'Probability and Statistics I',
    credits: 4,
    status: 'Available',
    seats: 35,
    enrolled: 32,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'MATH',
    prerequisites: ['MATH201', 'MATH333'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '32',
      title: 'MATH 130A',
      day: 'wednesday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'purple',
      description: "Basic probability theory, random variables, distributions, expectation, and variance.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '72',
      title: 'MATH 130A',
      day: 'friday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'purple',
      description: "Basic probability theory, random variables, distributions, expectation, and variance.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "RH 100",
    description: "Basic probability theory, random variables, distributions, expectation, and variance."
  },
  {
    id: 'ENG203',
    name: 'Writing for the Humanities',
    credits: 3,
    status: 'Available',
    seats: 20,
    enrolled: 15,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'ENG',
    prerequisites: ['ENG101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '33',
      title: 'ENG 203',
      day: 'tuesday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'pink',
      description: "Practice in critical reading and writing about literature, philosophy, and arts.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  
  {
      id: '73',
      title: 'ENG 203',
      day: 'thursday',
      startTime: '10:00',
      endTime: '11:30',
      color: 'pink',
      description: "Practice in critical reading and writing about literature, philosophy, and arts.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }
  ],
    location: "HH 100",
    description: "Practice in critical reading and writing about literature, philosophy, and arts."
  },
  {
    id: 'MATH105',
    name: 'Mathematical Logic',
    credits: 4,
    status: 'Full',
    seats: 30,
    enrolled: 30,
    waitlist: 20,
    required: false,
    completed: false,
    department: 'MATH',
    prerequisites: ['MATH101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '34',
      title: 'MATH 105',
      day: 'wednesday',
      startTime: '14:00',
      endTime: '15:30',
      color: 'blue',
      description: "Formal logic, propositional and predicate calculus, completeness and compactness theorems.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '74',
      title: 'MATH 105',
      day: 'friday',
      startTime: '14:00',
      endTime: '15:30',
      color: 'blue',
      description: "Formal logic, propositional and predicate calculus, completeness and compactness theorems.",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "RH 100",
    description: "Formal logic, propositional and predicate calculus, completeness and compactness theorems."
  },
  {
    id: 'ENG204',
    name: 'Creative Writing: Fiction',
    credits: 3,
    status: 'Available',
    seats: 20,
    enrolled: 12,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'ENG',
    prerequisites: ['ENG101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '35',
      title: 'ENG 204',
      day: 'wednesday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'pink',
      description: "Workshop-based course in short story writing with peer critique and revision.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    },
  {
      id: '75',
      title: 'ENG 204',
      day: 'friday',
      startTime: '15:00',
      endTime: '16:30',
      color: 'pink',
      description: "Workshop-based course in short story writing with peer critique and revision.",
      location: "HH 100",
      locationCoords: {
    "lat": 33.64724397216237,
    "lng": -117.84400105476381,
    "address": "HH 100",
    "address2": "Humanities Hall, 514, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92617, United States"
}
    }
  ],
    location: "HH 100",
    description: "Workshop-based course in short story writing with peer critique and revision."
  },
  {
    id: 'MATH333',
    name: 'Multi variable calculus',
    credits: 4,
    status: 'Available',
    seats: 40,
    enrolled: 30,
    waitlist: 0,
    required: false,
    completed: false,
    department: 'MATH',
    prerequisites: ['MATH101'],
    corequisites: [],
    iscorequisite: false,
    block: [{
      id: '36',
      title: 'MATH 333',
      day: 'monday',
      startTime: '11:00',
      endTime: '12:00',
      color: 'blue',
      description: "Delve into calculus on a much larger scale",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },
  {
      id: '76',
      title: 'MATH 333',
      day: 'wednesday',
      startTime: '11:00',
      endTime: '12:00',
      color: 'blue',
      description: "Delve into calculus on a much larger scale",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    },

    {
      id: '77',
      title: 'MATH 333',
      day: 'friday',
      startTime: '11:00',
      endTime: '12:00',
      color: 'blue',
      description: "Delve into calculus on a much larger scale",
      location: "RH 100",
      locationCoords: {
    "lat": 33.64430784211032,
    "lng": -117.84415125846864,
    "address": "RH 100",
    "address2": "University of California, Irvine, Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }
  ],
    location: "RH 100",
    description: "Delve into calculus on a much larger scale"
  },

  {
    id: 'CS101-D1',
    name: 'Intro to Computer Science Discussion 1',
    credits: 0,
    status: 'Available',
    seats: 15,
    enrolled: 10,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: ['CS101'],
    corequisites: [],
    iscorequisite: true,
    block: [{
      id: '37',
      title: 'CS 101 Discussion 1',
      day: 'thursday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'green',
      description: "Discussion Section 1",
      location: "HIB 100", 
      locationCoords:{
        "lat": 33.64834506581709,
        "lng": -117.84352898597719,
        "address": "HIB 100",
        "address2": "Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
    }
    }],
    location: "HIB 100",
    description: "Discussion Section 1"
  },
  {
    id: 'CS101-D2',
    name: 'Intro to Computer Science Discussion 2',
    credits: 0,
    status: 'Available',
    seats: 15,
    enrolled: 10,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: ['CS101'],
    corequisites: [],
    iscorequisite: true,
    block: [{
      id: '38',
      title: 'CS 101 Discussion 2',
      day: 'friday',
      startTime: '09:00',
      endTime: '10:30',
      color: 'red',
      description: "Discussion Section 2",
      location: "HIB 100", 
      locationCoords:{
        "lat": 33.64834506581709,
        "lng": -117.84352898597719,
        "address": "HIB 100",
        "address2": "Ring Mall, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
    }
    }],
    location: "HIB 100",
    description: "Discussion Section 2"
  },


  {
    id: 'CS122B-L',
    name: '122B Projects Lab',
    credits: 2,
    status: 'Available',
    seats: 15,
    enrolled: 10,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: ['CS122B'],
    corequisites: [],
    iscorequisite: true,
    block: [{
      id: '39',
      title: 'CS 122B Projects Lab',
      day: 'monday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'blue',
      description: "Project-based course on full-stack development, focusing on databases and web technologies.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "ICS 121",
    description: "Project-based course on full-stack development, focusing on databases and web technologies."
  },


  {
    id: 'CS122B-D1',
    name: 'CS 122B discussion section 1',
    credits: 0,
    status: 'Available',
    seats: 15,
    enrolled: 10,
    waitlist: 0,
    required: true,
    completed: false,
    department: 'CS',
    prerequisites: ['CS122B'],
    corequisites: [],
    iscorequisite: true,
    block: [{
      id: '40',
      title: 'CS 122B discussion section 1',
      day: 'tuesday',
      startTime: '11:00',
      endTime: '12:30',
      color: 'blue',
      description: "Discussion Section for 122B.",
      location: "ICS 121",
      locationCoords: {
    "lat": 33.644175565131505,
    "lng": -117.84184455871583,
    "address": "ICS 121",
    "address2": "Information and Computer Science, 302, Inner Ring, University of California, Irvine, Irvine, Orange County, California, 92697, United States"
}
    }],
    location: "ICS 121",
    description: "Discussion Section for 122B."
  },



];


const defaultRegisteredCourses = [
  // {
  //   id: 'CS215',
  //   name: 'Systems Programming',
  //   credits: 3,
  //   status: 'Registered',
  //   section: '002',
  //   department: 'CS',
  //   block: {
  //     id: '10',
  //     title: 'CS 215',
  //     day: 'tuesday',
  //     startTime: '14:00',
  //     endTime: '15:30',
  //     color: 'blue',
  //   },
  //   location: "HIB 100",
  //   prerequisites: [],
  //   description:
  //     "Programming close to the hardware, covering memory management, system calls, and process control.",
  // },
];



const defaultWaitlistedCourses = [
  // {
  //   id: 'CS201',
  //   name: 'Data Structures',
  //   credits: 4,
  //   waitlistPosition: 2,
  //   section: '001',
  //   department: 'CS',
  //   block: {
  //     id: '2',
  //     title: 'CS 201',
  //     day: 'monday',
  //     startTime: '13:00',
  //     endTime: '14:30',
  //     color: 'green',
  //   },
  //   location: "HIB 100",
  //   prerequisites: ['CS101'],
  //   description:
  //     "Lab for basic data structures class CS101. Please Enroll whenever possible. For waitlisted studnents, contact admins",
  // },
];

const defaultBlocks = [
  // {
  //     id: '10',
  //     title: 'CS 215',
  //     day: 'tuesday',
  //     startTime: '14:00',
  //     endTime: '15:30',
  //     color: 'blue',
  //   },

  // {
  //     id: '2',
  //     title: 'CS 201',
  //     day: 'monday',
  //     startTime: '13:00',
  //     endTime: '14:30',
  //     color: 'green',
  //   },
];

const defaultCorequisites = [

];



// Option 1: Sort by course ID (alphabetical)
const sortedDefaultCourses = [...defaultCourses].sort((a, b) => a.id.localeCompare(b.id));

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
    localStorage.removeItem('corequisiteCourses');
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
// Update this line to use sorted courses:
  const [courses, setCourses] = useState(() => 
    getLocalStorageData('courses', sortedDefaultCourses) // Use sorted version
  );

  const [corequisiteCourses, setCorequisiteCourses] = useState(() =>
  getLocalStorageData('corequisiteCourses', defaultCorequisites)
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
  localStorage.setItem('corequisiteCourses', JSON.stringify(corequisiteCourses));
}, [corequisiteCourses]);


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
    setCorequisiteCourses(defaultCorequisites); 
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
    corequisiteCourses, // add this
    setCorequisiteCourses, // and this
    resetToDefaults // Exposing the reset function to consumers
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};