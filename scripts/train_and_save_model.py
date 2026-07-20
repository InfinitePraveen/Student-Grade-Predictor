#!/usr/bin/env python3
"""Train a simple model on the student data and save it as a pickle.

Usage:
  python scripts/train_and_save_model.py --data data/raw/student-mat.csv --out models/model.pkl
"""
import argparse
import os
import pickle
import sys

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor


def load_dataframe(path):
    # Try common separators; fallback to pandas autodetect
    try:
        return pd.read_csv(path, sep=";")
    except Exception:
        return pd.read_csv(path)


def prepare_features(df, target="G3"):
    if target not in df.columns:
        raise ValueError(f"Target column '{target}' not found in data")
    y = df[target]
    X = df.drop(columns=[target])
    # One-hot encode categorical variables
    X = pd.get_dummies(X, drop_first=True)
    return X, y


def train_model(X, y):
    X_train, X_val, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    return model


def save_pickle(obj, out_path):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        pickle.dump(obj, f, protocol=4)


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    parser = argparse.ArgumentParser(description="Train and save model")
    parser.add_argument(
        "--data", default="data/raw/student-mat.csv", help="Path to CSV data"
    )
    parser.add_argument("--out", default="models/model.pkl", help="Output pickle path")
    parser.add_argument("--target", default="G3", help="Target column name")
    args = parser.parse_args(argv)

    df = load_dataframe(args.data)
    X, y = prepare_features(df, target=args.target)
    model = train_model(X, y)
    save_pickle(model, args.out)
    print(f"Saved model to: {os.path.abspath(args.out)}")


if __name__ == "__main__":
    main()
