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
