from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from .database import Base
import enum


class Usuario(Base):
    __tablename__ = "usuarios"

    idUsuario = Column(Integer, primary_key=True, index=True)
    tipoDocumento = Column(String(50))
    numeroDocumento = Column(String(15), unique=True)
    nombres = Column(String(100))
    apellidos = Column(String(100))
    correoUsuario = Column(String(250))
    claveUsuario = Column(String(60))
    idRol = Column(Integer)


class Rol(Base):
    __tablename__ = "rol"

    idRol = Column(Integer, primary_key=True, index=True)
    tipoRol = Column(String(20))
