import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import  axios from "axios";
import './registro.css';

const ImagesB = require.context('../../assets', true);

const Registro = () => {
    const [form, setForm] = useState({
        tipoDocumento: '',
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        correoUsuario: '',
        claveUsuario: '',
        idRol: ''
    });
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // Estado para controlar si ya se ha enviado el formulario

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Enviar datos al backend
        axios.post('http://localhost:8000/registro', form)
            .then(response => {
                alert('Usuario registrado exitosamente');
                setForm({
                    tipoDocumento: '',
                    numeroDocumento: '',
                    nombres: '',
                    apellidos: '',
                    correoUsuario: '',
                    claveUsuario: '',
                    idRol: ''
                });
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                    setError(`Error: ${error.response.data.detail}`);
                } else {
                    setError('Error al registrar usuario');
                }
            });
    };
    

    return (
        <div className="regisyini">
            <div>
                <nav className="navbar nnn">
                    <img src={ImagesB('./logosena.png')} width="90" height="90" alt="Logo SENA" />
                    <img src={ImagesB('./logobienestech.png')} alt="Logo BienesTech" />
                </nav>

                <div className="container">
                    <div className="form-container">
                        <h2 className="h2r">Regístrate</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="document-type" className="form-label">Tipo de Documento</label>
                                    <select className="tp form-selectt" name="tipoDocumento" onChange={handleInputChange} required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="cc">Cédula de Ciudadania</option>
                                        <option value="ce">Cédula de Extranjeria</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="document-number" className="form-label">Número de Documento</label>
                                    <input
                                        type="text"
                                        name="numeroDocumento"
                                        className="form-controll"
                                        id="document-number"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="first-name" className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        className="form-controll"
                                        id="first-name"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="last-name" className="form-label">Apellidos</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        className="form-controll"
                                        id="last-name"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="email" className="form-label">Correo</label>
                                    <input
                                        type="email"
                                        name="correoUsuario"
                                        className="form-controll"
                                        id="email"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        name="claveUsuario"
                                        className="form-controll"
                                        id="password"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="document-type" className="form-label">Rol</label>
                                    <select className="tp form-selectt" name="idRol" onChange={handleInputChange} required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="1">Administrador</option>
                                        <option value="4">Coordinador</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-12 text-center">
                                    <button type="submit" className="btn btn-success submit-btn" disabled={isSubmitted}>
                                        {isSubmitted ? 'Enviando...' : 'Registrarme'}
                                    </button>
                                    {error && <p>{error}</p>}
                                </div>
                            </div>

                        </form>

                        <br />
                        <p className="p">¿Ya está registrado? <Link to="/inicioSesion">Iniciar sesión</Link></p>
                    </div>
                </div>

            </div>

            {/* Modal */}
            <div className="modal fade" id="registroModal" tabIndex="-1" aria-labelledby="registroModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="registroModalLabel">¡Registro exitoso!</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Se ha registrado correctamente. Solicitud en proceso...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registro;

