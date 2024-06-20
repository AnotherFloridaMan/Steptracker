const totalSteps = [0, 0, 0, 0, 0];
const todaySteps = [0, 0, 0, 0, 0];
let lastUpdateDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });

document.addEventListener("DOMContentLoaded", function() {
    displayRandomTitleImage();
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

function submitSteps(personId) {
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
    } else {
        alert('You can only enter steps once a day.');
    }
}

function resetDailySteps() {
    for (let i = 0; i < todaySteps.length; i++) {
        todaySteps[i] = 0;
        document.getElementById(`today${i + 1}`).textContent = '0';
