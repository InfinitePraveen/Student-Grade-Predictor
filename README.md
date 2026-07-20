# Student Grade Predictor — Web App

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0%2B-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)

A machine learning web application that predicts final student grades (`G3`) using a Random Forest model. The model is trained on the **UCI Student Performance Dataset** and served through a modern, animated Flask web interface.

## ✨ Features

- **Predictive Modeling**: Random Forest classifier/regressor trained on student performance data
- **Interactive Web Interface**: Animated, mobile-friendly frontend with drag-and-drop CSV upload
- **Multiple Prediction Modes**:
  - Upload CSV files for batch predictions
  - JSON API for single or batch predictions
- **Pre-trained Model**: Ready-to-use `model.pkl` included
- **Educational Value**: Complete EDA and model selection process documented in notebooks

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, Vanilla JS (animated UI)
- **Machine Learning**: Scikit-learn (Random Forest)
- **Data Processing**: Pandas, NumPy
- **Environment**: Python 3.8+ with virtual environment support

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/InfinitePraveen/Student-Grade-Predictor.git
   cd Student-Grade-Predictor
   ```

2. **Create and activate a virtual environment** (recommended)

   Windows (PowerShell):
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

   macOS/Linux:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the model** (if model.pkl is not present)
   ```bash
   python scripts/train_and_save_model.py --data data/raw/student-mat.csv --out models/model.pkl
   ```

5. **Run the web application**
   ```bash
   python webapp/app.py
   ```

6. **Open your browser** at `http://127.0.0.1:5000/`

## 📊 Usage Guide

### Web Interface
1. Navigate to the homepage
2. Upload a CSV file using the dropzone or file picker
3. The CSV should contain the same features as the training data
4. View predictions displayed in an animated result card

### API Endpoints

#### POST `/predict`
Upload a CSV file for batch predictions
- **Request**: `multipart/form-data` with `file` field
- **Response**: JSON with `predictions` array

#### POST `/api/predict`
Send JSON payload for single or batch predictions
- **Request**:
  ```json
  {
    "features": [[feature1, feature2, ...]]
  }
  ```
  or for multiple samples:
  ```json
  {
    "features": [[sample1], [sample2], ...]
  }
  ```
- **Response**: JSON with `predictions` array

## 📁 Project Structure

```
Student-Grade-Predictor/
├── data/
│   └── raw/
│       └── student-mat.csv        # Dataset
├── models/
│   └── model.pkl                  # Pre-trained Random Forest model
├── notebooks/
│   └── EDA.ipynb                  # Exploratory Data Analysis
├── scripts/
│   └── train_and_save_model.py    # Training script
├── webapp/
│   ├── app.py                     # Flask application
│   ├── static/                    # CSS, JS, assets
│   └── templates/
│       └── index.html             # Main UI
├── .gitignore
├── README.md
└── requirements.txt
```

## 🔍 Model Details

- **Algorithm**: Random Forest Regressor/Classifier
- **Dataset**: UCI Student Performance (student-mat.csv)
- **Target Variable**: G3 (final grade, 0-20 scale)
- **Features**: 30+ attributes including demographic, social, and academic factors
- **Performance**: Refer to `notebooks/EDA.ipynb` for detailed metrics

## 🧪 Extending the App

Want to customize or improve the application? Here are some ideas:

1. **Enhance preprocessing**: Save feature lists and encoders during training for robust API
2. **Add validation**: Implement input validation and error handling
3. **Containerize**: Wrap the app in a Docker container
4. **Add tests**: Write unit and integration tests
5. **Improve UI**: Add charts, comparisons, or prediction explanations
6. **Deploy**: Use services like Heroku, Render, or AWS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📫 Contact

**Praveen Kumar** - [GitHub](https://github.com/InfinitePraveen)

Project Link: [https://github.com/InfinitePraveen/Student-Grade-Predictor](https://github.com/InfinitePraveen/Student-Grade-Predictor)

---

**Note**: This project is for educational purposes. The model's predictions should be used as guidance, not as absolute academic assessments.