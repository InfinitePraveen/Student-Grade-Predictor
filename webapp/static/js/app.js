const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file');
const predictBtn = document.getElementById('predictBtn');
const resultSection = document.getElementById('result');
const scoreEl = document.getElementById('score');
const noteEl = document.getElementById('note');
const pulse = document.getElementById('pulse');
const toggleManual = document.getElementById('toggleManual');
const manualSection = document.getElementById('manual');
const manualInput = document.getElementById('manualInput');
const manualPredict = document.getElementById('manualPredict');
const manualClear = document.getElementById('manualClear');

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
    resultSection.classList.remove('hidden');
    scoreEl.textContent = '—';
    pulse.style.opacity = 1;

    const fd = new FormData();
    fd.append('file', selectedFile);
    try {
        const res = await fetch('/predict', { method: 'POST', body: fd });
        const json = await res.json();
        if (res.ok) {
            const val = json.predictions && json.predictions.length ? json.predictions[0] : null;
            animateScore(val);
        } else {
            noteEl.textContent = json.error || 'Prediction failed';
            pulse.style.opacity = 0;
        }
    } catch (err) {
        noteEl.textContent = 'Network error';
        pulse.style.opacity = 0;
    }
});

toggleManual.addEventListener('click', () => {
    manualSection.classList.toggle('hidden');
});

manualClear.addEventListener('click', () => { manualInput.value = ''; });

manualPredict.addEventListener('click', async () => {
    let payloadRaw = manualInput.value.trim();
    if (!payloadRaw) { noteEl.textContent = 'Please enter JSON input'; return; }
    let payload;
    try { payload = JSON.parse(payloadRaw); } catch (e) { noteEl.textContent = 'Invalid JSON: ' + e.message; return; }

    resultSection.classList.remove('hidden');
    scoreEl.textContent = '—';
    pulse.style.opacity = 1;

    try {
        const res = await fetch('/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json = await res.json();
        if (res.ok) {
            const val = json.predictions && json.predictions.length ? json.predictions[0] : null;
            animateScore(val);
        } else {
            noteEl.textContent = json.error || 'Prediction failed';
            pulse.style.opacity = 0;
        }
    } catch (err) {
        noteEl.textContent = 'Network error';
        pulse.style.opacity = 0;
    }
});

function animateScore(value) {
    pulse.style.opacity = 1;
    if (value === null || value === undefined) { scoreEl.textContent = '—'; noteEl.textContent = 'No prediction returned'; pulse.style.opacity = 0; return; }
    noteEl.textContent = 'Confidence: visual estimate';
    // animate counting up
    const start = 0; const end = Math.round(value * 10) / 10; let cur = start; const step = Math.max((end - start) / 30, 0.1);
    const iv = setInterval(() => {
        cur = Math.min(cur + step, end);
        scoreEl.textContent = cur.toFixed(1);
        if (cur >= end) { clearInterval(iv); pulse.style.opacity = 0; }
    }, 25);
}
