from fastapi import FastAPI, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, time, timedelta
from app.database import get_db
from typing import List
from app.models import Usuario, Taller, Tematicas, Fichas, Coordinacion, HorarioFicha, UsuarioTaller, Horarios

from app.schemas import UsuarioCreate, UsuarioLogin, TallerCreate
import bcrypt

router = APIRouter()
app = FastAPI()

# Registro de usuarios
@router.post("/registro")
def registrer_user(user: UsuarioCreate, db: Session = Depends(get_db)):

    # Verificar si el usuario ya existe
    user_existence = db.query(Usuario).filter(Usuario.numeroDocumento == user.numeroDocumento).first()
    if user_existence:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    # Encriptar contraseña
    hashed_password = bcrypt.hashpw(user.claveUsuario.encode('utf-8'), bcrypt.gensalt())
    
    # Crear un nuevo usuario
    nuevo_usuario = Usuario(
        tipoDocumento=user.tipoDocumento,
        numeroDocumento=user.numeroDocumento,
        nombres=user.nombres,
        apellidos=user.apellidos,
        correoUsuario=user.correoUsuario,  # Usar correoUsuario
        claveUsuario=hashed_password.decode('utf-8'),  # Guardar la contraseña encriptada
        idRol=user.idRol
    )

    # Guardar el nuevo usuario en la base de datos
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {"message": "Usuario registrado exitosamente"}


# Login de usuarios

@router.post("/login")
def login_user(user: UsuarioLogin, db: Session = Depends(get_db)):
    
    # Buscar al usuario por número de documento
    db_user = db.query(Usuario).filter(Usuario.numeroDocumento == user.numeroDocumento).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar la contraseña utilizando bcrypt
    if not bcrypt.checkpw(user.claveUsuario.encode('utf-8'), db_user.claveUsuario.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    return {"message": "Login exitoso", "rol": db_user.idRol, "nombres": db_user.nombres}  # Incluye los nombres




#Agendamiento de taller

@app.post("/talleres/")
def create_taller(taller: TallerCreate, db: Session = Depends(get_db)):
    horario = db.query(HorarioFicha).filter(HorarioFicha.idFicha == taller.idFicha).first()
    
    if not horario:
        raise HTTPException(status_code=400, detail="Ficha no encontrada.")
    
    hora_inicio = horario.horaInicio
    hora_fin = horario.horaFin
    fecha_hora = taller.fechaYHora.time()
    fecha_hora_fin = (datetime.combine(datetime.min, fecha_hora) + timedelta(minutes=30)).time()  # Taller de 30 min
    
    # Comprobar si el profesional tiene otro taller en el rango horario
    conflicting_taller = db.query(Taller).filter(
        Taller.idUsuario == taller.idUsuario,
        Taller.fechaYHora.between(
            datetime.combine(taller.fechaYHora.date(), hora_inicio),
            datetime.combine(taller.fechaYHora.date(), hora_fin)
        )
    ).first()
    
    if conflicting_taller:
        raise HTTPException(status_code=400, detail="El profesional ya tiene un taller en ese horario.")
    
    if fecha_hora < time(7, 0) or fecha_hora_fin > time(22, 0):
        raise HTTPException(status_code=400, detail="El horario del taller está fuera del horario laboral del profesional.")

    nuevo_taller = Taller(
        fechaYHora=taller.fechaYHora,
        idCentro=taller.idCentro,
        idJornada=taller.idJornada,
        idCoordinacion=taller.idCoordinacion,
        idFicha=taller.idFicha,
        idTematica=taller.idTematica,
        idUsuario=taller.idUsuario,
        observaciones=taller.observaciones
    )
    db.add(nuevo_taller)
    db.commit()
    db.refresh(nuevo_taller)
    
    return {"message": "Taller creado exitosamente", "taller_id": nuevo_taller.idTaller}

@app.get("/profesionales", response_model=List[Coordinacion])  # Asegúrate de que Coordinacion esté definido
async def get_profesionales(db: Session = Depends(get_db)):
    result = db.execute("SELECT * FROM coordinacion WHERE idRol = 3")
    return [dict(row) for row in result]

@app.get("/coordinaciones", response_model=List[Coordinacion])
async def get_coordinaciones(db: Session = Depends(get_db)):
    result = db.execute("SELECT * FROM coordinacion")
    return [dict(row) for row in result]

@app.get("/fichas", response_model=List[Ficha])
async def get_fichas(db: Session = Depends(get_db)):
    result = db.execute("SELECT * FROM ficha")
    return [dict(row) for row in result]

@app.get("/temas", response_model=List[Tema])
async def get_temas(db: Session = Depends(get_db)):
    result = db.execute("SELECT * FROM tematicas")
    return [dict(row) for row in result]

@app.get("/horarios", response_model=List[HorarioFicha])
async def get_horarios(db: Session = Depends(get_db)):
    result = db.execute("SELECT * FROM horarioficha")
    return [dict(row) for row in result]
