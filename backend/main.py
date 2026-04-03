from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import pandas as pd
import os

app = FastAPI()

# 📦 Serve React build
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

FILE = "mydb.csv"

# Ensure file exists
if not os.path.exists(FILE):
    df = pd.DataFrame(columns=["id", "name", "price"])
    df.to_csv(FILE, index=False)


@app.get("/api/products")
def get_products():
    df = pd.read_csv(FILE)
    return df.to_dict(orient="records")


@app.post("/api/products")
def add_product(product: dict):
    df = pd.read_csv(FILE)

    new_id = df["id"].max() + 1 if not df.empty else 1

    new_row = {
        "id": new_id,
        "name": product["name"],
        "price": product["price"]
    }

    df = pd.concat([df, pd.DataFrame([new_row])])
    df.to_csv(FILE, index=False)

    return new_row


@app.delete("/api/products/{id}")
def delete_product(id: int):
    df = pd.read_csv(FILE)
    df = df[df["id"] != id]
    df.to_csv(FILE, index=False)

    return {"message": "Deleted"}