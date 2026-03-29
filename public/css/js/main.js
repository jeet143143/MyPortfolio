document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Logic
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            progressBar.style.width = '100%';
            progressText.innerText = '100%';
            
            // Fade out preloader
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.visibility = 'hidden';
                    
                    // Trigger initial hero animations after load
                    gsap.fromTo('.hero-title span', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' });
                    gsap.fromTo('.hero-subtitle', { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5 });
                }, 1000);
            }, 500);
        } else {
            progressBar.style.width = progress + '%';
            progressText.innerText = progress + '%';
        }
    }, 150);

    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update ScrollTrigger to use Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Magnetic Cursor Logic
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const magneticElements = document.querySelectorAll('.magnetic-element');

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
        });

        magneticElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 1.5, backgroundColor: 'transparent', border: '1px solid var(--neon-purple)', duration: 0.3 });
                gsap.to(follower, { scale: 1.5, borderColor: 'var(--neon-purple)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, backgroundColor: 'var(--neon-blue)', border: 'none', duration: 0.3 });
                gsap.to(follower, { scale: 1, borderColor: 'var(--neon-blue)', duration: 0.3 });
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
            });
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
            });
        });
    }

    // 3. GSAP Scroll Animations
    const fadeElements = document.querySelectorAll('.scroll-fade');
    fadeElements.forEach((el) => {
        gsap.fromTo(el, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: {
                trigger: el, start: 'top 85%', toggleActions: 'play none none reverse'
            }}
        );
    });

    // Staggered text reveal for About Section
    const staggerTextNodes = document.querySelectorAll('.stagger-text');
    staggerTextNodes.forEach(node => {
        const text = node.innerText;
        node.innerHTML = '';
        text.split(' ').forEach(word => {
            if (word.trim() === '') return;
            const span = document.createElement('span');
            span.innerText = word;
            span.style.display = 'inline-block';
            span.style.marginRight = '0.25em'; // Properly spaces the words apart
            node.appendChild(span);
        });

        gsap.from(node.querySelectorAll('span'), {
            scrollTrigger: { trigger: node, start: 'top 90%' },
            y: 20, opacity: 0, duration: 0.5, stagger: 0.02, ease: 'power2.out'
        });
    });

    // 4. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const statusText = document.getElementById('contact-status');
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const content = document.getElementById('contact-content').value;

            btn.innerHTML = '<span>TRANSMITTING...</span>';
            
            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, content })
                });
                const data = await res.json();
                
                if (data.success) {
                    statusText.innerText = "SUCCESS: Message logged to system.";
                    statusText.style.color = "var(--neon-blue)";
                    contactForm.reset();
                } else {
                    throw new Error("Failed");
                }
            } catch (err) {
                statusText.innerText = "ERROR: Transmission failed.";
                statusText.style.color = "red";
            } finally {
                btn.innerHTML = '<span>TRANSMIT_</span>';
            }
        });
    }
});
