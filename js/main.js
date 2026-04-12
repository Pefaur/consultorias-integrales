/* ============================================
   CONSULTORÍAS INTEGRALES - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Initialize AOS ----
    AOS.init({
        duration: 500,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
    });

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    // ---- Active Navigation Link ----
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar solid background
        if (scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active nav link based on section
        updateActiveLink();
    }

    // Throttled scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                animateStats();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    handleScroll(); // Run on load

    // ---- Back to Top ----
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Mobile Menu Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ---- Stats Counter Animation ----
    const statNumbers = document.querySelectorAll('.stats__number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 1200;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target;
                    }
                };
                updateCounter();
            });
        }
    }

    animateStats(); // Check on load

    // ---- Contact Form Validation & Handle ----
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            clearErrors();

            // Validate
            let isValid = true;

            const nombre = document.getElementById('nombre');
            const email = document.getElementById('email');
            const telefono = document.getElementById('telefono');
            const servicio = document.getElementById('servicio');

            if (!nombre.value.trim()) {
                showError(nombre, 'nombreError', 'Ingrese su nombre');
                isValid = false;
            }

            if (!email.value.trim()) {
                showError(email, 'emailError', 'Ingrese su correo electrónico');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                showError(email, 'emailError', 'Ingrese un correo válido');
                isValid = false;
            }

            if (!telefono.value.trim()) {
                showError(telefono, 'telefonoError', 'Ingrese su teléfono');
                isValid = false;
            }

            if (isValid) {
                const formError = document.getElementById('formError');
                formError.classList.remove('show');

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

                const formData = new FormData(contactForm);

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        contactForm.style.display = 'none';
                        formSuccess.classList.add('show');
                    } else {
                        formError.querySelector('p').textContent =
                            'Hubo un error al enviar el mensaje. Por favor intente nuevamente o contáctenos por WhatsApp al +56 9 2241 8352.';
                        formError.classList.add('show');
                    }
                })
                .catch(() => {
                    formError.querySelector('p').textContent =
                        'Error de conexión. Verifique su internet e intente nuevamente, o contáctenos por WhatsApp al +56 9 2241 8352.';
                    formError.classList.add('show');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
                });
            }
        });

        // Real-time validation on blur
        ['nombre', 'email', 'telefono'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('blur', () => {
                    if (el.value.trim()) {
                        el.classList.remove('error');
                        const errorEl = document.getElementById(id + 'Error');
                        if (errorEl) errorEl.textContent = '';
                    }
                });
            }
        });
    }

    function showError(input, errorId, message) {
        input.classList.add('error');
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll('.contact-form__error').forEach(el => el.textContent = '');
        document.querySelectorAll('.contact-form__group input, .contact-form__group textarea, .contact-form__group select')
            .forEach(el => el.classList.remove('error'));
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Testimonials Slider ----
    const slider = document.querySelector('.testimonials__slider');
    const prevBtn = document.querySelector('.testimonials__arrow--prev');
    const nextBtn = document.querySelector('.testimonials__arrow--next');

    if (slider && prevBtn && nextBtn) {
        let currentIndex = 0;

        function getCardsPerView() {
            const width = window.innerWidth;
            if (width <= 768) return 1;
            if (width <= 1024) return 2;
            return 3;
        }

        function getCardWidth() {
            const card = slider.querySelector('.testimonial-card');
            if (!card) return 0;
            const style = getComputedStyle(slider);
            const gap = parseInt(style.gap) || 24;
            return card.offsetWidth + gap;
        }

        function getMaxIndex() {
            const totalCards = slider.querySelectorAll('.testimonial-card').length;
            return Math.max(0, totalCards - getCardsPerView());
        }

        function updateSlider() {
            const offset = currentIndex * getCardWidth();
            slider.style.transform = `translateX(-${offset}px)`;
            prevBtn.disabled = currentIndex <= 0;
            nextBtn.disabled = currentIndex >= getMaxIndex();
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < getMaxIndex()) {
                currentIndex++;
                updateSlider();
            }
        });

        window.addEventListener('resize', () => {
            currentIndex = Math.min(currentIndex, getMaxIndex());
            updateSlider();
        });

        updateSlider();
    }

});
