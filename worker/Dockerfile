FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install redis pymongo

CMD ["python", "worker.py"]