// Replace with your Firebase configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    databaseURL: "your-database-url",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
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
