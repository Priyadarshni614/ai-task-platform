FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

USER appuser

CMD ["python", "worker.py"]