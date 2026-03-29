const Project = require('../models/Project');

const renderHome = async (req, res) => {
    try {
        let projects = [];
        try {
            projects = await Project.find().sort({ createdAt: -1 });
            
        } catch (err) {
            console.log("No DB connection for projects yet.");
        }

        // If DB is empty or disconnected, use the provided fallback projects
        if (projects.length === 0) {
            projects = [
                { 
                    title: "AI Review Summarizer", 
                    description: "An AI-powered application leveraging Large Language Models to automatically extract and summarize actionable insights from massive data pools.", 
                    techStack: ["Python", "OpenAI", "LLMs", "NLP"], 
                    repoLink: "https://github.com/jeet143143/ai-review-llm.git",
                    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
                },
                { 
                    title: "Agentic AI Learning Platform", 
                    description: "A personalized learning pathway generator that uses autonomous AI agents to curate educational content and adapt to user mastery.", 
                    techStack: ["Python", "AI Agents", "React", "Node.js"], 
                    repoLink: "https://github.com/jeet143143/agentic_ai_learing_paths.git",
                    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
                },
                { 
                    title: "Real-Time Chat Application", 
                    description: "A highly-responsive, full-stack real-time communication platform built on pure WebSockets ensuring zero-latency messaging.", 
                    techStack: ["Node.js", "Express", "Socket.io", "MongoDB"], 
                    repoLink: "https://github.com/jeet143143/real-time-chat-app.git",
                    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop"
                }
            ];
        }

        res.render('index', { 
            title: 'Jeet Senapati | Full Stack & AI Developer',
            projects
        });
    } catch (error) {
        console.error("Home Render Error:", error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    renderHome
};
