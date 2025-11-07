const { animate, scroll, hover, press, inView, stagger } = Motion;

function HandleLandingAnimations() {
    let isInitial = true;
    inView('.slow-fade-in', (element) => {
        animate(element, { opacity: [0, 1], y: [-24, 0] }, { type: 'tween', duration: 0.45, ease: 'easeOut', delay: (isInitial ? 1.7 : 0) });

        return () => {
            isInitial = false;
            animate(element, { opacity: [1, 0], y: [-24, 0] }, { type: 'tween', duration: 0.45, ease: 'easeOut' });
        }
    })

    const el = document.querySelector(".title.highlight");

    // Sequence function using chained promises
    function swingSequence(element) {
        // Step 1: move right
        animate([
            [element, { x: [0, 400], y: -105, rotate: [0, 90], backgroundColor: ["#6BCB77", "#FF6B6B"], scaleY: [1, 0.7, 1], scaleX: [1, 1.2, 1] }, { type: 'spring', stiffness: 150, damping: 15 }],
            [element, { x: 250, y: 150, backgroundColor: "#FFD93D", rotate: [90, 360] }, { type: 'spring', stiffness: 155, damping: 55 }],
            [element, { x: 0, y: 0, backgroundColor: "#6BCB77", rotate: [360, 0] }, { type: 'spring', stiffness: 150, damping: 36 }],
        ],
            { repeat: Infinity }
        );
    }

    // Start sequence
    swingSequence(el);

    const paragraphs = document.querySelectorAll(".animated-paragraph");

    // Wrap every word in a span
    paragraphs.forEach(function (el) {
        el.innerHTML = el.textContent
            .split(" ")
            .map(word => `<span class="word" style="opacity:0; display:inline-block;">${word}</span>`)
            .join(" ");

        const words = el.querySelectorAll(".word");

        // Animate each word with a staggered delay
        words.forEach((word, index) => {
            animate(word,
                { opacity: [0, 1], y: [-8, 0] },
                {
                    duration: 0.6,
                    easing: "easeOut",
                    delay: index * 0.04 // stagger
                }
            );
        });
    });
}

HandleLandingAnimations();

// Global animation object for all examples
const Animations = {
    7: {
        play: () => {
            animate([
                ['#section7 .box', { x: [0, 150], rotate: [0, 180], backgroundColor: ['#8df0cc', '#d26565ff'] }, { type: "spring", stiffness: 250, damping: 15 }],
                ['#section7 .box', { y: 150, rotate: [0, 180], backgroundColor: ['#d26565ff', '#8df0cc'] }, { type: "spring", stiffness: 250, damping: 15 }],
                ['#section7 .box', { x: [150, 0], y: 150, rotate: [0, 180], backgroundColor: ['#8df0cc', '#d26565ff'] }, { type: "spring", stiffness: 250, damping: 15 }],
                ['#section7 .box', { x: 0, y: 0, rotate: [0, 180], backgroundColor: ['#d26565ff', '#8df0cc'] }, { type: "spring", stiffness: 250, damping: 15 }]
            ], { repeat: Infinity });
        },
    },
    10: {
        play: () => {
            animate("#section10 .box", { opacity: [0, 1], y: [150, 0] }, { delay: stagger(0.1), type: 'spring', damping: 15, stiffness: 200 })
        },
    },
    11: {
        play: () => {
            animate(0, 100, {
                duration: 0.7, // Animation duration in seconds
                ease: 'easeOut',
                onUpdate: (value) => {
                    // Value is float by default
                    document.querySelector('.number-display').textContent = Math.round(value); // Update the element's text content
                },
            });
        }
    },
    12: {
    play: () => {
        animate(0, 60, {
            duration: 0.7,
            onUpdate: (value) => {
                // Value is float by default
                document.querySelector('.prog-num').textContent = Math.round(value) + '%';
            },
        });

        animate('.prog-bar', { width: ['0%', '60%']},{ type: 'spring', damping: 13, stiffness: 100 })
    }
    }
};


// Play button
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const sectionID = btn.dataset.sectionId;
        if (Animations[sectionID]?.play) Animations[sectionID].play();
    });
});

// On click reduce the scale of the button
const button1 = document.querySelector('#section1 .example-btn');

button1.addEventListener('click', function() {
    animate(this, { scale: [0.75, 1] }, {
        type: 'spring',
        stiffness: 450,
        damping: 15,

    });
});

const button2 = document.querySelector('#section2 .example-btn');

button2.addEventListener('mouseenter', function() {
    animate(this, { scale: 1.5  }, {
        duration: 0.3,
        easing: 'ease-out',
    });
});

button2.addEventListener('mouseleave', function() {
    animate(this, { scale: 1  }, {
        type: 'spring',
        bounce: '0.5'
    });
});

// On mouse down reduce button size and infinitely rotate through colors
const button3 = document.querySelector('#section3 .example-btn');
let colorAnimation3 = null;
let baseColor3 = '#00e1ff';
button3.addEventListener('mousedown', function () {
    // Scale down
    animate(this, { scale: 0.9 }, { duration: 0.2 });

    // Start looping color animation
    colorAnimation3 = animate(this, {
        backgroundColor: [baseColor3,'#FF6B6B', '#6a65a8ff', '#88dfa1ff', baseColor3]
    }, {
        duration: 2,
        easing: 'ease-out',
        delay: 1.5,
        repeat: Infinity
    });
});

// Restore the size and stop the color animation
button3.addEventListener('mouseup', function () {
    if (colorAnimation3) {
        colorAnimation3.stop();
        colorAnimation3 = null;
    }

    animate(this, { scale: 1, backgroundColor: baseColor3 }, { duration: 0.2 });
});


// Run 3 animations at the same time
const button4 = document.querySelector('#section4 .example-btn');
button4.addEventListener('click', function() {
    animate(this, { backgroundColor: ['#2e49d0', '#d26565ff', '#2e49d0'] }, { duration: 0.4 });
    animate(this, { rotate: [0, 360] }, { type: 'spring', stiffness: 500, damping: 35 });
    animate(this, { scale: [0.7, 1] }, { type: 'tween', ease: 'easeOut', duration: 0.3 });
});


// Using motions press() function to handle mouse press and callback
press('#section5 .box', (element) => {
    animate(element, { rotate: [0, 180], backgroundColor: ['#8df0cc', '#d26565ff'] }, { type: "spring", stiffness: 200, damping: 45 })

    return () =>
        animate(element, { rotate: 0, backgroundColor: '#8df0cc' })
})


// Using motions press() function to handle mouse press and callback
hover('#section6 .box', (element) => {
    animate(element, { rotate: [0, 180], backgroundColor: ['#8df0cc', '#d26565ff'] }, { type: "spring", stiffness: 200, damping: 45 })

    return () =>
        animate(element, { rotate: 0, backgroundColor: '#8df0cc' })
})

// Fade in/out when in/out of view
inView('#section8 .box', (element) => {
    animate(element, { scale: [0.5, 1], opacity: [0, 1], y: [-75, 0]}, { type: "spring", stiffness: 200, damping: 45, delay: 0.1 })

    return () =>
        animate(element, { scale: [1, 0.5], opacity: [1, 0], y: [0, -75]}, {duration: 0})
})

let scrollElement = document.querySelector('.progress-bar');
document.querySelector('.toggleScroll').addEventListener('click', function() {
    if(scrollElement.classList.contains('hidden') ) {
        scrollElement.classList.remove('hidden');
    } else {
        scrollElement.classList.add('hidden');
    }

});

scroll(animate('.progress-bar', { width: [0, '100%'] }, { ease: "easeOut" }))