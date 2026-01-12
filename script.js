// CUSTOM CURSOR
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

// SCROLLING
function getScrollPercent() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
    return Math.min(100, Math.max(0, scrolled));
}

// CAROUSEL
let carouselSlides = document.querySelectorAll('.carousel_slide');
let progressBar = document.querySelector('.progress');
let currentIndex = 0;

const slideInterval = 3000;

let slideTimer;
let startTime = 0;
let remainingTime = slideInterval;

function showSlide(index, duration = slideInterval) {
    // Moves the carousel images left
    const slidesContainer = document.querySelector('.carousel_slides');
    slidesContainer.style.transform = `translateX(-${index * 100}%)`; // Move the slides div left

    // Reset progress animation
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    setTimeout(() => {
        startTime = Date.now();
        remainingTime = duration;

        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '100%';
    }, 50);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % carouselSlides.length;
    remainingTime = slideInterval;
    showSlide(currentIndex);
    startCarousel();
}

function startCarousel() {
    startTime = Date.now();

    progressBar.offsetWidth;

    // Animate to 100% by remainingTime
    progressBar.style.transition = `width ${remainingTime}ms linear`;
    progressBar.style.width = '100%';

    slideTimer = setTimeout(nextSlide, remainingTime);
}


function stopCarousel() {
    clearTimeout(slideTimer);

    const elapsed = Date.now() - startTime;
    remainingTime -= elapsed;

    const progress = ((slideInterval - remainingTime) / slideInterval) * 100;
    progressBar.style.transition = 'none';
    progressBar.style.width = `${progress}%`;
}

showSlide(currentIndex);
startCarousel();