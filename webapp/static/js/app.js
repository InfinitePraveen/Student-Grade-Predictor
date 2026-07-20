const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file');
const predictBtn = document.getElementById('predictBtn');
const noteEl = document.getElementById('note');
const studentForm = document.getElementById('studentForm');
const formPredict = document.getElementById('formPredict');
const formReset = document.getElementById('formReset');
const gFg = document.querySelector('.g-fg');
const gText = document.querySelector('.g-text');
const gradeValue = document.getElementById('gradeValue');
const statusPill = document.querySelector('.status-pill');

let selectedFile = null;
const checkboxNames = ['activities', 'paid', 'higher', 'internet'];

function setStatus(text, color, background) {
    if (!statusPill) return;
    statusPill.textContent = text;
    statusPill.style.color = color;
    statusPill.style.background = background;
}

function updateNote(message) {
    if (noteEl) {
        noteEl.textContent = message;
    }
}

function buildRequestData() {
    const data = {};
    const formData = new FormData(studentForm);

    for (const [key, value] of formData.entries()) {
        const el = studentForm.elements[key];
        if (el && el.type === 'checkbox') {
            data[key] = el.checked ? 'yes' : 'no';
        } else if (value !== '' && !isNaN(value)) {
            data[key] = Number(value);
        } else {
            data[key] = value;
        }
    }

    checkboxNames.forEach((name) => {
        if (!(name in data)) {
            data[name] = 'no';
        }
    });

    return data;
}

function updateResult(value) {
    if (!gradeValue || !gText) {
        updateNote('Result display not available');
        return;
    }

    if (value === null || value === undefined || Number.isNaN(value)) {
        gradeValue.textContent = '—';
        gText.textContent = '—';
        updateNote('No prediction returned');
        setStatus('Error', '#fda4af', 'rgba(248, 113, 113, 0.16)');
        return;
    }

    const v = Math.round(Number(value) * 10) / 10;
    const percent = Math.max(0, Math.min(1, v / 20));
    const circumference = 2 * Math.PI * 50;
    const offset = Math.round(circumference * (1 - percent));

    if (gFg) {
        gFg.style.strokeDashoffset = offset;
    }

    gText.textContent = v.toFixed(1);
    gradeValue.textContent = v.toFixed(1);
    updateNote('Grade forecast generated successfully.');
    setStatus('Predicted', '#a5f3fc', 'rgba(34, 211, 238, 0.16)');
}

function resetGauge() {
    if (!gFg) return;
    const circumference = 2 * Math.PI * 50;
    gFg.style.strokeDashoffset = circumference;
}

async function predictCSV() {
    if (!selectedFile) {
        updateNote('Please select a CSV file first.');
        return;
    }

    updateNote('Predicting from CSV...');
    const fd = new FormData();
    fd.append('file', selectedFile);

    try {
        const res = await fetch('/predict', { method: 'POST', body: fd });
        const json = await res.json();

        if (!res.ok) {
            updateNote(json.error || 'CSV prediction failed');
            setStatus('Error', '#fda4af', 'rgba(248, 113, 113, 0.16)');
            return;
        }

        const val = Array.isArray(json.predictions) ? json.predictions[0] : null;
        updateResult(val);
    } catch (err) {
        console.error(err);
        updateNote('Network error while predicting CSV');
        setStatus('Error', '#fda4af', 'rgba(248, 113, 113, 0.16)');
    }
}

async function predictStudent() {
    const data = buildRequestData();
    updateNote('Predicting...');

    try {
        const res = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const json = await res.json();

        if (!res.ok) {
            updateNote(json.error || 'Prediction failed');
            setStatus('Error', '#fda4af', 'rgba(248, 113, 113, 0.16)');
            return;
        }

        const val = Array.isArray(json.predictions) ? json.predictions[0] : null;
        updateResult(val);
    } catch (err) {
        console.error(err);
        updateNote('Network error while predicting');
        setStatus('Error', '#fda4af', 'rgba(248, 113, 113, 0.16)');
    }
}

function init() {
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            selectedFile = e.target.files[0];
            updateNote(selectedFile ? selectedFile.name : 'Choose a CSV file');
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag');
        });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag');
            const f = e.dataTransfer.files[0];
            if (f) {
                selectedFile = f;
                updateNote(f.name);
            }
        });
    }

    if (predictBtn) {
        predictBtn.addEventListener('click', predictCSV);
    }

    if (formPredict) {
        formPredict.addEventListener('click', (ev) => {
            ev.preventDefault();
            predictStudent();
        });
    }

    if (studentForm) {
        studentForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
            predictStudent();
        });
    }

    if (formReset) {
        formReset.addEventListener('click', () => {
            studentForm.reset();
            gradeValue.textContent = '—';
            gText.textContent = '—';
            resetGauge();
            updateNote('Form reset');
            setStatus('Ready', '#d8c5ff', 'rgba(124, 58, 237, 0.14)');
        });
    }

    resetGauge();
    setStatus('Ready', '#d8c5ff', 'rgba(124, 58, 237, 0.14)');
}

init();
