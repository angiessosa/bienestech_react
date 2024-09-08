from datetime import datetime
from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    tipoDocumento: str
    numeroDocumento: str
    nombres: str
    apellidos: str
    correoUsuario: str  # Cambiado a correoUsuario
    claveUsuario: str    # Cambiado a claveUsuario
    idRol: int

class UsuarioLogin(BaseModel):
    numeroDocumento: str
    claveUsuario: str  # Cambiado a claveUsuario

class TallerCreate(BaseModel):
    fechaYHora: datetime
    numFicha: str
    tema: str
    observaciones: str
    idUsuario: int # Añadido para asociar al profesional

class Taller(TallerCreate):
    id: int

    class Config:
        orm_mode = True

