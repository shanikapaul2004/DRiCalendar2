let nav = 0;
let clicked = null;
let sobrietyDays = localStorage.getItem('sobrietyDays') ? JSON.parse(localStorage.getItem('sobrietyDays')) : [];
let journalEntries = localStorage.getItem('journalEntries') ? JSON.parse(localStorage.getItem('journalEntries')) : {};

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');
const soberButton = document.getElementById('soberButton');
const notSoberButton = document.getElementById('notSoberButton');
const clearButton = document.getElementById('clearButton');
const journalThoughts = document.getElementById('journalThoughts');
const journalSymptoms = document.getElementById('journalSymptoms');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openModal(date) {
    clicked = date;
    const dayIsSober = sobrietyDays.includes(clicked);
    const dayIsNotSober = journalEntries[clicked] && journalEntries[clicked].status === 'not_sober';

    soberButton.classList.toggle('active', dayIsSober);
    notSoberButton.classList.toggle('active', dayIsNotSober);
    clearButton.classList.toggle('active', !dayIsSober && !dayIsNotSober);

    if (journalEntries[clicked]) {
        journalThoughts.value = journalEntries[clicked].thoughts;
        journalSymptoms.value = journalEntries[clicked].symptoms;
    } else {
        journalThoughts.value = '';
        journalSymptoms.value = '';
    }

    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

function closeModal() {
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    clicked = null;
    load();
}

function saveStatus() {
    const status = soberButton.classList.contains('active') ? 'sober' : notSoberButton.classList.contains('active') ? 'not_sober' : null;

    if (status === 'sober') {
        if (!sobrietyDays.includes(clicked)) {
            sobrietyDays.push(clicked);
        }
        delete journalEntries[clicked];
    } else if (status === 'not_sober') {
        sobrietyDays = sobrietyDays.filter(date => date !== clicked);
        journalEntries[clicked] = {
            thoughts: journalThoughts.value,
            symptoms: journalSymptoms.value,
            status: status
        };
    } else {
        sobrietyDays = sobrietyDays.filter(date => date !== clicked);
        delete journalEntries[clicked];
    }

    localStorage.setItem('sobrietyDays', JSON.stringify(sobrietyDays));
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    closeModal();
}

function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText = 
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            const isSober = sobrietyDays.includes(dayString);
            const isNotSober = journalEntries[dayString] && journalEntries[dayString].status === 'not_sober';

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            if (isSober) {
                daySquare.classList.add('sober');
                if (isMilestone(dayString)) {
                    daySquare.classList.add('milestone');
                }
            } else if (isNotSober) {
                daySquare.classList.add('not_sober');
            }

            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);    
    }
}

function isMilestone(date) {
    const streaks = calculateStreaks();
    return streaks[date] && (streaks[date] === 7 || streaks[date] === 30 || streaks[date] === 90);
}

function calculateStreaks() {
    const streaks = {};
    let currentStreak = 0;

    sobrietyDays.sort((a, b) => new Date(a) - new Date(b)).forEach((date, index, array) => {
        if (index === 0 || new Date(date) - new Date(array[index - 1]) === 86400000) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        streaks[date] = currentStreak;
    });

    return streaks;
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });
    
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    soberButton.addEventListener('click', () => {
        soberButton.classList.add('active');
        notSoberButton.classList.remove('active');
        clearButton.classList.remove('active');
    });

    notSoberButton.addEventListener('click', () => {
        notSoberButton.classList.add('active');
        soberButton.classList.remove('active');
        clearButton.classList.remove('active');
    });

    clearButton.addEventListener('click', () => {
        soberButton.classList.remove('active');
        notSoberButton.classList.remove('active');
        clearButton.classList.add('active');
    });

    document.getElementById('saveButton').addEventListener('click', saveStatus);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', saveStatus);
    document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();
