const Project = require('../models/Project');
const Message = require('../models/Message');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const submitContact = async (req, res) => {
    try {
        const { name, email, content } = req.body;
        const newMessage = new Message({ name, email, content });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error("Contact Error:", error);
        res.status(500).json({ success: false, error: 'Server error saving message.' });
    }
};

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const systemPrompt = `You are an AI assistant embodied in the digital portfolio of Jeet Senapati. 
Jeet is a Full Stack Developer & AI/ML Enthusiast. 
Education: B.Tech in Computer Science and Information Technology, University of Engineering and Management, Kolkata, CGPA: 8.01.
Skills: HTML5, CSS3, JavaScript, Node.js, Express.js, MongoDB, Three.js, EJS, GSAP.
Goal: Speak concisely and enthusiastically. Help the recruiter/user learn about Jeet.
Do not hallucinate facts. If asked something unknown, politely pivot back to Jeet's capabilities.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 150,
            temperature: 0.7
        });

        res.json({ success: true, reply: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ success: false, error: 'Failed to communicate with AI.' });
    }
};

module.exports = {
    submitContact,
    chatWithAI
};
