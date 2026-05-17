import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';

dotenv.config();

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const projects = [
      {
        projectNum: 'P.001',
        title: 'GeoTag Attendance System',
        description: 'A location-based attendance platform that uses GPS geo-tagging to verify students or employees are physically present on-site before marking attendance. Features an admin dashboard, real-time location validation, and attendance reports.',
        stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Geolocation API'],
        githubLink: '#',
        liveDemoLink: '#'
      },
      {
        projectNum: 'P.002',
        title: 'Event Management System',
        description: 'A full-featured platform for creating, managing, and registering for events. Supports role-based access for organizers and attendees, event scheduling, seat booking, and email notifications — all in one unified interface.',
        stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth'],
        githubLink: '#',
        liveDemoLink: '#'
      },
      {
        projectNum: 'P.003',
        title: 'ERP System',
        description: 'An enterprise resource planning web application covering core business modules — employee management, inventory tracking, task assignment, and reporting dashboards. Built to be modular and scalable for small-to-medium businesses.',
        stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux', 'Chart.js'],
        githubLink: '#',
        liveDemoLink: '#'
      }
    ];

    await Project.deleteMany({});
    await Project.insertMany(projects);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProjects();
