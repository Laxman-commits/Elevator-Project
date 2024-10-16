const callBtns = document.querySelectorAll('.btn-call');
const liftImages = document.querySelectorAll('.lift-image');
const arrivalSound = document.querySelector('#arrival-sound');

let liftStates = Array(liftImages.length).fill('idle');
let liftCurrentPositions = Array.from(liftImages).map(lift => lift.getBoundingClientRect().top);

callBtns.forEach((btn, floorIndex) => {
    btn.addEventListener("click", () => {
        btn.classList.add('btn-waiting');
        btn.innerHTML = 'waiting';

        const buttonRect = btn.getBoundingClientRect();
        const btnY = buttonRect.top + window.scrollY;

        const nearestLiftIndex = findNearestAvailableLift(btnY);

        if (nearestLiftIndex !== -1) {
            moveLift(nearestLiftIndex, btnY, btn);
        } else {
            console.log('All lifts are currently busy');
            btn.innerHTML = 'Busy';
        }
    });
});

function findNearestAvailableLift(targetY) {
    let nearestLiftIndex = -1;
    let shortestDistance = Infinity;

    liftCurrentPositions.forEach((liftY, index) => {
        if (liftStates[index] === 'idle') {
            const distance = Math.abs(targetY - liftY); 
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestLiftIndex = index; 
            }
        }
    });

    return nearestLiftIndex;
}

function moveLift(liftIndex, targetY, btn) {
    const lift = liftImages[liftIndex];
    lift.style.position = 'absolute'; 
    lift.style.transition = 'top 4s ease'; 

    const currentLiftY = liftCurrentPositions[liftIndex];

    lift.style.top = `${targetY}px`;

    liftCurrentPositions[liftIndex] = targetY;

    liftStates[liftIndex] = 'moving'; 

    setTimeout(() => {
        btn.classList.remove('btn-waiting');
        btn.classList.add('btn-arrived');
        btn.innerHTML = 'Arrived';
        arrivalSound.play(); 
    }, 4000);

    setTimeout(() => {
        resetButtonAndLift(liftIndex, btn);
    }, 6000);
}

function resetButtonAndLift(liftIndex, btn) {
    btn.classList.remove('btn-arrived');
    btn.classList.add('btn-call');
    btn.innerHTML = 'call';
    liftStates[liftIndex] = 'idle'; 
}
