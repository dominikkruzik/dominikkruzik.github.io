// CUSTOM CURSOR
const cursor = document.querySelector(".custom-cursor");
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector(".custom-cursor");
    // cursor is lerped, mouse is realtime
    let cursorX = 0, mouseX = 0;
    let cursorY = 0, mouseY = 0;

    let isStuck = false; // if it's on a button

    // for X seconds after leaving button to prevent a cursor jump
    let onCooldown = false;
    let cooldownTimerDuration = 500; // in miliseconds
    let cooldownTimer = null;

    // Set automatically
    let originalCursorWidth = cursor.style.width;
    let originalCursorHeight = cursor.style.height;

    // When moving the mouse
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // When over a button
    document.addEventListener("mouseover", (e) => {
        const targetMorph = e.target.closest(".cursor-morph");
        if (targetMorph) {
            /* MORPHING */
            const rect = targetMorph.getBoundingClientRect();
            const styles = window.getComputedStyle(targetMorph);

            isStuck = true;
            onCooldown = false;

            if (cooldownTimer) {
                clearTimeout(cooldownTimer);
                cooldownTimer = null;
            }

            cursor.classList.add("is-morphed");
            cursor.style.width = `${rect.width}px`;
            cursor.style.height = `${rect.height}px`;
            cursor.style.borderRadius = styles.borderRadius;

            // Move smoothly to center of button
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            cursor.style.transform = `translate(${centerX}px, ${centerY}px) translate(-50%, -50%)`;

            // Remember position for lerping out
            cursorX = centerX;
            cursorY = centerY;
        }
        
        /* HOVERING */
        const targetHover = e.target.closest(".cursor-hover");
        if (!targetHover) return;

        cursor.classList.add("hovering");
    });
    
    // When leaving a button
    document.addEventListener("mouseout", (e) => {
        const targetMorph = e.target.closest(".cursor-morph");
        if (targetMorph) {
            /* MORPHING */
            const rect = targetMorph.getBoundingClientRect();

            isStuck = false;
            onCooldown = true;

            if (cooldownTimer) clearTimeout(cooldownTimer);
            cooldownTimer = setTimeout(() => {
                onCooldown = false;
                cooldownTimer = null;
            }, cooldownTimerDuration); // in miliseconds

            cursor.classList.remove("is-morphed");
            cursor.style.width = originalCursorWidth;
            cursor.style.height = originalCursorHeight;
            cursor.style.borderRadius = "50%"
        };

        /* HOVERING */
        const targetHover = e.target.closest(".cursor-hover");
        if (!targetHover) return;

        cursor.classList.remove("hovering");
    });

    // Runs every frame
    function updateCursor() {
        if (!isStuck) {
            const lerpAmount = onCooldown ? .3 : .8;

            cursorX += (mouseX - cursorX) * lerpAmount;
            cursorY += (mouseY - cursorY) * lerpAmount;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        }
        requestAnimationFrame(updateCursor);
    }

    requestAnimationFrame(updateCursor); 
});


function enableCursor() {
    cursor.style.display = "inherit";
    document.documentElement.classList.add("no-cursor");
}

function disableCursor() {
    cursor.style.display = "none";
    document.body.style.cursor = "default";
    document.documentElement.classList.remove("no-cursor");
}

enableCursor();

// CAROUSEL
document.querySelectorAll('.carousel-container').forEach(container => {
    const carousel = container.querySelector('.carousel');
    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(track.children);
    const prevBtn = carousel.querySelector('.carousel-button.prev');
    const nextBtn = carousel.querySelector('.carousel-button.next');
    const dotsContainer = carousel.querySelector('.dots');

    const carouselSubtext = container.querySelector('.carousel-subtext');

    let currentIndex = 0;

    // Create dots
    items.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot', 'cursor-hover');
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => moveToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');

        if (carouselSubtext) {
            carouselSubtext.style.opacity = '0';
            setTimeout(() => {
                carouselSubtext.textContent =
                    items[currentIndex].getAttribute('data-subtext') || '';
                carouselSubtext.style.opacity = '1';
            }, 200);
        }
    }

    function moveToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();

        prevBtn.classList.add('animated');
        setTimeout(() => prevBtn.classList.remove('animated'), 200);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();

        nextBtn.classList.add('animated');
        setTimeout(() => nextBtn.classList.remove('animated'), 200);
    });

    updateCarousel();
});