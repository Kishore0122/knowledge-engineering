// Hide loader when the page is fully loaded
window.addEventListener('load', function() {
    const loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
        loaderWrapper.style.opacity = '0';
        setTimeout(() => {
            loaderWrapper.style.display = 'none';
        }, 600);
    }
});

// Initialize Swiper
let swiper;
function initSwiper() {
    swiper = new Swiper('.slider-wrapper', {
        loop: true,
        grabCursor: true,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            }
        }
    });
}

// Initialize GSAP
function initGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.error('GSAP or ScrollTrigger is not loaded');
    }
}

// Count Up Animation for statistics
function initCountUpAnimation() {
    const counters = document.querySelectorAll('.count');
    counters.forEach(counter => {
        counter.innerText = '0';
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 200;
            if (count < target) {
                counter.innerText = `${Math.ceil(count + increment)}`;
                setTimeout(updateCounter, 10);
            } else {
                counter.innerText = target;
            }
        };
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: counter,
                start: "top 90%",
                onEnter: updateCounter
            });
        } else {
            updateCounter(); // Fallback if ScrollTrigger is not available
        }
    });
}

// Generic function to handle details functionality
function initDetailsToggle(btnSelector, infoSelector, btnTextShow, btnTextHide) {
    const detailsBtns = document.querySelectorAll(btnSelector);
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default button behavior
            e.stopPropagation();
            const id = this.getAttribute(`data-${btnSelector.split('-')[0]}`);
            const infoElement = document.getElementById(`${id}-info`);

            if (infoElement) {
                const isHidden = infoElement.style.display === 'none' || infoElement.style.display === '';
                infoElement.style.display = isHidden ? 'block' : 'none';
                this.textContent = isHidden ? btnTextHide : btnTextShow;

                document.querySelectorAll(infoSelector).forEach(div => {
                    if (div !== infoElement) {
                        div.style.display = 'none';
                        const relatedBtn = document.querySelector(`${btnSelector}[data-${btnSelector.split('-')[0]}="${div.id.replace('-info', '')}"]`);
                        if (relatedBtn) relatedBtn.textContent = btnTextShow;
                    }
                });
            }
        });
    });
}

// Function to show tables with animation
function showTablesWithAnimation(sectionId) {
    const tables = document.querySelectorAll(`#${sectionId} .custom-table`);
    tables.forEach((table, tableIndex) => {
        table.classList.add('show');
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
            setTimeout(() => {
                row.classList.add('show');
            }, (tableIndex * 500) + (rowIndex * 100));
        });
    });
}

// Show section function
function showSection(sectionId) {
    const sections = document.querySelectorAll('.info-section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initSwiper();
    initGSAP();
    initCountUpAnimation();
    initDetailsToggle('.faculty-details-btn', '.faculty-info', 'Faculty Details', 'Hide Details');
    initDetailsToggle('.authors-details-btn', '.authors-info', 'Authors Details', 'Hide Details');
    initDetailsToggle('.contact-details-btn', '.contact-info', 'Contact Details', 'Hide Details');
    initDetailsToggle('.iv-details-btn', '.iv-info', 'Industrial Visits Details', 'Hide Details');
    initDetailsToggle('.club-details-btn', '.club-info', 'Club Details', 'Hide Details');
    initDetailsToggle('.Hackathon-details-btn', '.Hackathon-info', 'Hackathon Details', 'Hide Details');
    initDetailsToggle('.Admin-details-btn', '.Admin-info', 'Admin Details', 'Hide Details');
    initDetailsToggle('.Publications-details-btn', '.Publications-info', 'Publications Details', 'Hide Details');
    initDetailsToggle('.Pongal-details-btn', '.Pongal-info', 'Pongal Details', 'Hide Details');

    const buttons = document.querySelectorAll('.animated-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.id.replace('-btn', '');
            showSection(sectionId);

            if (sectionId === 'scholars' || sectionId === 'students' || sectionId === 'Admin' || sectionId === 'Publications' || sectionId === 'studentscentric') {
                showTablesWithAnimation(sectionId);
            }
        });
    });

    const container = document.querySelector('.button-container');
    const containerButtons = container.querySelectorAll('button');
    containerButtons.forEach(button => {
        button.addEventListener('click', () => {
            container.classList.add('buttons-visible');
        });
    });

    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(videoContainer => {
        const video = videoContainer.querySelector('video');

        videoContainer.addEventListener('mouseenter', () => {
            video.play();
        });

        videoContainer.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0; // Optionally reset video to the start
        });
    });

    const scriptURL = 'https://script.google.com/macros/s/AKfycbydA7-R6Fk4a_WxlKbsQ9p4rNaLWsAxH6-D5_3eZZEV380W6Coa0UXgSaRtjnrNUzkRZQ/exec';
    const form = document.getElementById('contactForm');
    const popup = document.getElementById('popup');
    form.addEventListener('submit', e => {
        e.preventDefault();
        document.getElementById('submit').disabled = true;
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                showPopup("Message sent successfully!");
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                showPopup("Error sending message. Please try again.");
            })
            .finally(() => {
                document.getElementById('submit').disabled = false;
            });
    });
    function showPopup(message) {
        popup.textContent = message;
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 5000);
    }  
});
/*const typed = new Typed('.text', {
    strings: ['Department of ','Knowledge engineering'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});*/