# Student Grade Predictor — Web App

This repository predicts final student grades using a Random Forest model trained on the UCI student performance dataset. I added a lightweight, animated web application (Flask + simple JS/CSS) so you can upload a CSV and get predictions interactively.

**What I added**
- A Flask webapp at `webapp/app.py` that loads `models/model.pkl` and serves prediction endpoints.
- An animated, mobile-friendly frontend at `webapp/templates/index.html` and `webapp/static/` with CSS and JS.
- Updated `requirements.txt` with `flask`.

Getting started
1. (Optional) Create and activate a virtual environment.

	On Windows (PowerShell):
	```powershell
	python -m venv .venv
	.\.venv\Scripts\Activate.ps1
	```

2. Install dependencies:

	```bash
	pip install -r requirements.txt
	```

3. Ensure the trained model exists at `models/model.pkl`. If you haven't trained it yet, run the training script:

	```bash
	python scripts/train_and_save_model.py --data data/raw/student-mat.csv --out models/model.pkl
	```

4. Run the webapp from the project root:

	```bash
	python webapp/app.py
	```

5. Open your browser at `http://127.0.0.1:5000/` and upload `student-mat.csv` (or a single-row CSV of features) to get predicted `G3` values.

Notes on the UI and API
- The frontend is intentionally simple and animated: an upload dropzone and a result card that animates the predicted grade.
- API endpoint: `POST /predict` accepts multipart form-data with `file` (CSV). Returns JSON `{ "predictions": [ ... ] }`.
- API endpoint: `POST /api/predict` accepts JSON payload (single sample or list) and returns predictions.

Extending the app
- Save preprocessing objects (encoder/feature list) during training to make the API robust to schema drift.
- Add input validation, logging, and tests for production readiness.

If you'd like, I can wire the app into `notebooks/EDA.ipynb`, containerize it with Docker, or add a simple deploy script — which would you prefer next?
