from datetime import datetime
from pydantic import BaseModel
from typing import Optional

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


class HorarioFichaBase(BaseModel):
    trimestre: int
    numAmbiente: str
    dia: str
    horaInicio: datetime
    horaFin: datetime
    jornadaFicha: str
    sede: str
    idFicha: int

class TallerCreate(BaseModel):
    fechaYHora: datetime
    idCentro: int
    idJornada: int
    idCoordinacion: int
    idFicha: int
    idTematica: int
    idUsuario: int
    observaciones: str

class Coordinacion(BaseModel):
    id: int
    nombre: str

class Ficha(BaseModel):
    numero: str

class Tema(BaseModel):
    id: int
    nombre: str

class Horario(BaseModel):
    ficha: str
    horaInicio: str
    horaFin: str
