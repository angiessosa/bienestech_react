from sqlalchemy import Column, Integer, String, DateTime, Time, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

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


class Taller(Base):
    __tablename__ = "taller"

    idTaller = Column(Integer, primary_key=True, index=True)
    fechaYHora = Column(DateTime)
    numFicha = Column(String(11))
    tema = Column(String(50))
    observaciones = Column(String(1000))


class Tematicas(Base):
    __tablename__ = "tematicas"

    idTematicas = Column(Integer, primary_key=True, index=True)
    tema = Column(String(50))


class Fichas(Base):
    __tablename__ = "fichas"

    idFicha = Column(Integer, primary_key=True, index=True)
    numFicha = Column(String(11), unique=True)
    programaFormacion = Column(String(100))
    nombreCoordinacion = Column(String(100))


class Coordinacion(Base):
    __tablename__ = "coordinacion"

    idCoordinacion = Column(Integer, primary_key=True, index=True)
    nombreCoordinacion = Column(String(100))


class HorarioFicha(Base):
    __tablename__ = "horarioFicha"

    idHorarioFicha = Column(Integer, primary_key=True, index=True)
    trimestre = Column(Integer)
    numAmbiente = Column(String(11))
    dia = Column(String(10))
    horaInicio = Column(Time)
    horaFin =  Column(Time)
    jornadaFicha = Column(String(10))
    sede = Column(String(30))
    idFicha = Column(Integer)


class UsuarioTaller(Base):
    __tablename__ = "usuario_taller"
    id = Column(Integer, primary_key=True, index=True)
    idTaller = Column(Integer, ForeignKey('talleres.idTaller'))
    idUsuario = Column(Integer, ForeignKey('usuario.idProfesional'))

    taller = relationship("Taller")
    Usuario = relationship("Usuario")



class Horarios(Base):
    __tablename__ = "horarios"

    idHorarios = Column(Integer, primary_key=True, index=True)
    fichas = Column(String(11))
    areaEncargada =  Column(String(20))
    coordinacion = Column(String(30))
    idUsuario = Column(Integer)

