from fastapi import FastAPI
from app import routes # Debería usarse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permitir todas las conexiones
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas definidas en routes.py
app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"message": "API de Bienestech está funcionando"}
