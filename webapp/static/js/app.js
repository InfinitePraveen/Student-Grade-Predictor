const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file');
const predictBtn = document.getElementById('predictBtn');
const noteEl = document.getElementById('note');
const toggleManual = document.getElementById('toggleManual');
const manualSection = document.getElementById('manual');
const manualInput = document.getElementById('manualInput');
const manualPredict = document.getElementById('manualPredict');
const manualClear = document.getElementById('manualClear');
const studentForm = document.getElementById('studentForm');
const formPredict = document.getElementById('formPredict');
const formReset = document.getElementById('formReset');
const gFg = document.querySelector('.g-fg');
const gText = document.querySelector('.g-text');
const resultCard = document.querySelector('.result-card');

let selectedFile = null;

dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => { selectedFile = e.target.files[0]; noteEl.textContent = selectedFile.name; });
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', (e) => {
    e.preventDefault(); dropzone.classList.remove('drag');
    const f = e.dataTransfer.files[0];
    if (f) { selectedFile = f; noteEl.textContent = f.name; }
});

predictBtn.addEventListener('click', async () => {
    if (!selectedFile) { noteEl.textContent = 'Please select a CSV first.'; return; }
    noteEl.textContent = 'Predicting from CSV...';

    const fd = new FormData();
    fd.append('file', selectedFile);
    try {
        const res = await fetch('/predict', { method: 'POST', body: fd });
        const json = await res.json();
        if (res.ok) {
            const val = json.predictions && json.predictions.length ? json.predictions[0] : null;
            animateGauge(val);
        } else {
            noteEl.textContent = json.error || 'Prediction failed';
        }
    } catch (err) {
        noteEl.textContent = 'Network error';
    }
});

toggleManual.addEventListener('click', () => { manualSection.classList.toggle('hidden'); });

manualClear.addEventListener('click', () => { manualInput.value = ''; });

manualPredict.addEventListener('click', async () => {
    let payloadRaw = manualInput.value.trim();
    if (!payloadRaw) { noteEl.textContent = 'Please enter JSON input'; return; }
    let payload;
    try { payload = JSON.parse(payloadRaw); } catch (e) { noteEl.textContent = 'Invalid JSON: ' + e.message; return; }

    noteEl.textContent = 'Predicting...';
    try {
        const res = await fetch('/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json = await res.json();
        if (res.ok) {
            const val = json.predictions && json.predictions.length ? json.predictions[0] : null;
            animateGauge(val);
        } else {
            noteEl.textContent = json.error || 'Prediction failed';
        }
    } catch (err) {
        noteEl.textContent = 'Network error';
    }
});

// Structured form submission
formPredict.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const form = studentForm;
    const data = {};
    new FormData(form).forEach((value, key) => {
        const el = form.elements[key];
        if (el && el.type === 'checkbox') data[key] = el.checked;
        else if (value !== '' && !isNaN(value)) data[key] = Number(value);
        else data[key] = value;
    });

    noteEl.textContent = 'Predicting...';
    try {
        const res = await fetch('/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const json = await res.json();
        if (res.ok) {
            const val = json.predictions && json.predictions.length ? json.predictions[0] : null;
            animateGauge(val);
        } else {
            noteEl.textContent = json.error || 'Prediction failed';
        }
    } catch (err) {
        noteEl.textContent = 'Network error';
    }
});

formReset.addEventListener('click', () => { studentForm.reset(); noteEl.textContent = 'Form reset'; });

function animateGauge(value) {
    if (value === null || value === undefined) { gText.textContent = '—'; noteEl.textContent = 'No prediction returned'; return; }
    const v = Math.round(value * 10) / 10;
    const percent = Math.max(0, Math.min(1, v / 20));
    const circumference = 2 * Math.PI * 50; // r=50
    const offset = Math.round(circumference * (1 - percent));
    gFg.style.strokeDashoffset = offset;
    gText.textContent = v.toFixed(1);
    noteEl.textContent = 'Estimated final grade';
}
