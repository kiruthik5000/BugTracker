FROM python:3.13-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr for cleaner logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

# Install CPU-only PyTorch AND all requirements in one layer without overwriting CPU wheels
RUN pip install --no-cache-dir --root-user-action=ignore \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]