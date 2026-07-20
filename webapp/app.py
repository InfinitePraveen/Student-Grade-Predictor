from flask import Flask, render_template, request, jsonify
import os
import pickle
import pandas as pd

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.path.join(ROOT, "models", "model.pkl")
DATA_PATH = os.path.join(ROOT, "data", "raw", "student-mat.csv")

app = Flask(__name__, static_folder="static", template_folder="templates")


def load_model_and_schema():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    # Derive training columns from the original CSV to reproduce one-hot schema
    df = (
        pd.read_csv(DATA_PATH, sep=";")
        if os.path.exists(DATA_PATH)
        else pd.read_csv(DATA_PATH)
    )
    target = "G3"
    X_train = pd.get_dummies(df.drop(columns=[target]), drop_first=True)
    train_columns = X_train.columns.tolist()
    return model, train_columns


model, TRAIN_COLUMNS = load_model_and_schema()


def transform_input(df_input):
    X = pd.get_dummies(df_input, drop_first=True)
    # Reindex to training columns, missing columns filled with 0
    X = X.reindex(columns=TRAIN_COLUMNS, fill_value=0)
    return X


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    # Accepts a CSV file upload (one or more rows) under form key 'file'
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        df = pd.read_csv(f)
    except Exception:
        try:
            df = pd.read_csv(f, sep=";")
        except Exception as e:
            return jsonify({"error": f"Failed to parse CSV: {e}"}), 400

    if df.empty:
        return jsonify({"error": "Empty CSV"}), 400

    X = transform_input(df)
    preds = model.predict(X)
    # Return predictions as list
    return jsonify({"predictions": preds.tolist()})


@app.route("/api/predict", methods=["POST"])
def api_predict():
    # Accepts JSON payload representing a single sample or list of samples
    payload = request.get_json()
    if payload is None:
        return jsonify({"error": "Invalid JSON"}), 400

    if isinstance(payload, dict):
        df = pd.DataFrame([payload])
    else:
        df = pd.DataFrame(payload)

    X = transform_input(df)
    preds = model.predict(X)
    return jsonify({"predictions": preds.tolist()})


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
