/* ============================================
   CONSULTORÍAS INTEGRALES - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Initialize AOS ----
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
    });

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

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

    window.addEventListener('scroll', handleScroll);
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
                const duration = 2000;
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

    window.addEventListener('scroll', animateStats);
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
            const mensaje = document.getElementById('mensaje');

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

            if (!mensaje.value.trim()) {
                showError(mensaje, 'mensajeError', 'Ingrese su mensaje');
                isValid = false;
            }

            if (isValid) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

                // Enviar formulario vía Formspree
                const formData = new FormData(contactForm);

                fetch('https://formspree.io/f/TU_FORM_ID', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                })
                .then(response => {
                    if (response.ok) {
                        contactForm.style.display = 'none';
                        formSuccess.classList.add('show');
                    } else {
                        alert('Hubo un error al enviar el mensaje. Intente nuevamente.');
                    }
                })
                .catch(() => {
                    alert('Error de conexión. Intente nuevamente.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
                });
            }
        });

        // Real-time validation on blur
        ['nombre', 'email', 'telefono', 'mensaje'].forEach(id => {
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
        document.querySelectorAll('.contact-form__group input, .contact-form__group textarea')
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

});
