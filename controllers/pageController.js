const Project = require('../models/Project');

const RESUME_URL = 'https://drive.google.com/file/d/19YiFEwg62HodTVeVrcENoG29oVP4nRap/view?usp=sharing';

const FEATURED_PROJECTS = [
    {
        title: 'IntervueX',
        description: 'An AI-powered interview preparation platform that runs realistic mock interviews, personalizes questions from resumes, and delivers detailed performance feedback.',
        techStack: ['Node.js', 'Express', 'MongoDB', 'Groq API', 'Three.js'],
        repoLink: 'https://github.com/jeet143143/IntervueX',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop'
    },
    {
        title: 'DayPlanner',
        description: 'A full-stack day planner with JWT authentication, MongoDB persistence, task scheduling, and a polished neon glassmorphism dashboard for daily productivity.',
        techStack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'GSAP'],
        repoLink: 'https://github.com/jeet143143/dayplanner',
        imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop'
    },
    {
        title: 'AI Review Summarizer',
        description: 'An AI-powered application leveraging Large Language Models to automatically extract and summarize actionable insights from massive data pools.',
        techStack: ['Python', 'OpenAI', 'LLMs', 'NLP'],
        repoLink: 'https://github.com/jeet143143/ai-review-llm.git',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop'
    },
    {
        title: 'Agentic AI Learning Platform',
        description: 'A personalized learning pathway generator that uses autonomous AI agents to curate educational content and adapt to user mastery.',
        techStack: ['Python', 'AI Agents', 'React', 'Node.js'],
        repoLink: 'https://github.com/jeet143143/agentic_ai_learing_paths.git',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop'
    },
    {
        title: 'Real-Time Chat Application',
        description: 'A highly-responsive, full-stack real-time communication platform built on pure WebSockets ensuring zero-latency messaging.',
        techStack: ['Node.js', 'Express', 'Socket.io', 'MongoDB'],
        repoLink: 'https://github.com/jeet143143/real-time-chat-app.git',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop'
    }
];

const normalizeProject = (project) => ({
    title: project.title,
    description: project.description,
    techStack: Array.isArray(project.techStack) ? project.techStack : [],
    repoLink: project.repoLink || '#',
    liveDemo: project.liveDemo || '',
    imageUrl: project.imageUrl || project.thumbnail || ''
});

const mergeProjects = (projects) => {
    const seen = new Set();

    return [...FEATURED_PROJECTS, ...projects].filter((project) => {
        const key = (project.repoLink || project.title || '').toLowerCase();

        if (!key || seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
};

const renderHome = async (req, res) => {
    try {
        let dbProjects = [];

        try {
            dbProjects = await Project.find().sort({ createdAt: -1 });
        } catch (err) {
            console.log('No DB connection for projects yet.');
        }

        const projects = mergeProjects(dbProjects.map(normalizeProject));

        res.render('index', {
            title: 'Jeet Senapati | Full Stack & AI Developer',
            projects,
            resumeUrl: RESUME_URL
        });
    } catch (error) {
        console.error('Home Render Error:', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    renderHome
};
