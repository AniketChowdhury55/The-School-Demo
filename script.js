/* =============================================
   PATNA HERITAGE ACADEMY — MAIN SCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Cache DOM elements
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    const enquiryForm = document.getElementById('enquiryForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const visitDateInput = document.getElementById('visitDate');

    // =========================================
    // 1. HEADER — Scroll shadow effect
    // =========================================
    const handleScroll = () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on load


    // =========================================
    // 2. MOBILE NAVIGATION
    // =========================================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('open');
        document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mainNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
        if (
            mainNav.classList.contains('open') &&
            !mainNav.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            hamburger.classList.remove('active');
            mainNav.classList.remove('open');
            document.body.style.overflow = '';
        }
    });


    // =========================================
    // 3. SMOOTH SCROLL for anchor links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // =========================================
    // 4. TESTIMONIAL CAROUSEL
    // =========================================
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;
    let carouselInterval;

    /**
     * Go to a specific slide index
     * @param {number} index - Slide index (0-based)
     */
    const goToSlide = (index) => {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    // Dot click handlers
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index, 10);
            goToSlide(index);
            restartAutoAdvance();
        });
    });

    /**
     * Auto-advance the carousel every 5 seconds
     */
    const startAutoAdvance = () => {
        carouselInterval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % totalSlides;
            goToSlide(nextSlide);
        }, 5000);
    };

    const restartAutoAdvance = () => {
        clearInterval(carouselInterval);
        startAutoAdvance();
    };

    startAutoAdvance();


    // =========================================
    // 5. SCROLL REVEAL (IntersectionObserver)
    // =========================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show everything
        revealElements.forEach(el => el.classList.add('visible'));
    }


    // =========================================
    // 6. ENQUIRY FORM HANDLING
    // =========================================

    // Set minimum date to today for the visit date picker
    if (visitDateInput) {
        const today = new Date().toISOString().split('T')[0];
        visitDateInput.setAttribute('min', today);
    }

    /**
     * Handle form submission
     * Prevents default, validates, shows success state.
     * Structured so form data can easily be sent to a backend API.
     */
    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate required fields
        if (!enquiryForm.checkValidity()) {
            enquiryForm.reportValidity();
            return;
        }

        // Collect form data (ready for API integration)
        const formData = {
            parentName: document.getElementById('parentName').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            childGrade: document.getElementById('childGrade').value,
            visitDate: document.getElementById('visitDate').value,
            questions: document.getElementById('questions').value.trim(),
            submittedAt: new Date().toISOString()
        };

        // ---------------------------------------------------
        // INTEGRATION POINT:
        // Replace the block below with an actual API call, e.g.:
        //
        // fetch('/api/leads', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // })
        // .then(res => res.json())
        // .then(data => showSuccess())
        // .catch(err => showError(err));
        // ---------------------------------------------------

        console.log('[Enquiry Form] Submitted data:', formData);

        // Show success state
        enquiryForm.style.display = 'none';
        formSuccess.style.display = 'block';

        // Re-initialize Lucide icons for the success state
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Reset form handler
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            enquiryForm.reset();
            enquiryForm.style.display = 'block';
            formSuccess.style.display = 'none';
        });
    }
});
