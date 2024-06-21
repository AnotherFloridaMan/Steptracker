// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaRdXq_QfLnRw6gbNFwHf5t02ztPbA0ME",
  authDomain: "stepsdatabase.firebaseapp.com",
  projectId: "stepsdatabase",
  storageBucket: "stepsdatabase.appspot.com",
  messagingSenderId: "400313891338",
  appId: "1:400313891338:web:4d2b9da9c9e7ee3be8fdf3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const totalSteps = [0, 0, 0, 0, 0];
const todaySteps = [0, 0, 0, 0, 0];
let lastUpdateDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });

document.addEventListener("DOMContentLoaded", function() {
    displayRandomTitleImage();
    loadSteps();
    createFlyingImages();
    setInterval(createFlyingImages, 3000); // Add new flying image every 3 seconds
});

function displayRandomTitleImage() {
    const titleImages = [
        'Title/image1.jpg',
        'Title/image2.jpg',
        'Title/image3.jpg',
        'Title/image4.jpg',
        'Title/image5.jpg'
    ];

    const randomIndex = Math.floor(Math.random() * titleImages.length);
    const randomImage = titleImages[randomIndex];

    const titleImageContainer = document.getElementById('title-image');
    const imgElement = document.createElement('img');
    imgElement.src = randomImage;
    imgElement.alt = 'Title Image';
    titleImageContainer.appendChild(imgElement);
}

function createFlyingImages() {
    const imagePaths = [
        'random/image1.jpg',
        'random/image2.jpg',
        'random/image3.jpg',
        'random/image4.jpg',
        'random/image5.jpg'
    ];

    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    const randomImage = imagePaths[randomIndex];

    const flyingImage = document.createElement('img');
    flyingImage.src = randomImage;
    flyingImage.className = 'flying-image';
    document.body.appendChild(flyingImage);

    console.log(`Created flying image: ${randomImage}`); // Log image creation

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const endX = Math.random() * window.innerWidth;
    const endY = Math.random() * window.innerHeight;
    const duration = Math.random() * 5 + 2; // 2 to 7 seconds

    flyingImage.style.left = `${startX}px`;
    flyingImage.style.top = `${startY}px`;

    flyingImage.animate([
        { transform: `translate(${endX - startX}px, ${endY - startY}px)` }
    ], {
        duration: duration * 1000,
        easing: 'linear',
        iterations: 1,
        fill: 'forwards'
    });

    setTimeout(() => {
        flyingImage.remove();
    }, duration * 1000);
}

function submitSteps(personId, personName) {
    const stepsInput = document.getElementById(`steps${personId}`).value;
    if (!stepsInput) return;

    const currentDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });

    if (currentDate !== lastUpdateDate) {
        resetDailySteps();
        lastUpdateDate = currentDate;
    }

    if (todaySteps[personId - 1] === 0) {
        todaySteps[personId - 1] = parseInt(stepsInput);
        totalSteps[personId - 1] += parseInt(stepsInput);
        updateDisplay(personId);
        saveStepsToDatabase(personName, todaySteps[personId - 1], totalSteps[personId - 1]);
    } else {
        alert('You can only enter steps once a day.');
    }
}

function resetDailySteps() {
    for (let i = 0; i < todaySteps.length; i++) {
        todaySteps[i] = 0;
        document.getElementById(`today${i + 1}`).textContent = '0';
    }
}

function updateDisplay(personId) {
    document.getElementById(`today${personId}`).textContent = todaySteps[personId - 1].toLocaleString();
    document.getElementById(`total${personId}`).textContent = totalSteps[personId - 1].toLocaleString();
}

function saveStepsToDatabase(personName, todaySteps, totalSteps) {
    db.ref('steps/' + personName).set({
        todaySteps: todaySteps,
        totalSteps: totalSteps,
        date: lastUpdateDate
    });
}

function loadSteps() {
    db.ref('steps').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const personName = childSnapshot.key;
            const personId = getPersonId(personName);

            if (personId !== -1) {
                if (data.date === lastUpdateDate) {
                    todaySteps[personId - 1] = data.todaySteps;
                }
                totalSteps[personId - 1] = data.totalSteps;
                updateDisplay(personId);
            }
        });
    });
}

function getPersonId(personName) {
    switch (personName) {
        case 'David':
            return 1;
        case 'Joe':
            return 2;
        case 'Lili':
            return 3;
        case 'Jenn':
            return 4;
        case 'Jordyn':
            return 5;
        default:
            return -1;
    }
}
