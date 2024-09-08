import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImagesB = require.context('../../assets', true);

const InicioS = ({ setUserRole }) => { // Añadir setUserRole como prop

    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [claveUsuario, setClaveUsuario] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', {
                numeroDocumento: numeroDocumento,
                claveUsuario: claveUsuario
            });
            console.log('Respuesta de la API:', response.data); // Verifica la respuesta de la API
            const rol = response.data.rol; // Cambiado a 'rol' en lugar de 'role'
            console.log('Rol del usuario:', rol); // Verifica el rol
            setUserRole(rol);
    
            // Redirige según el rol
            if (rol === 1) {
                window.location.href = '/admin';
            } else if (rol === 4) {
                window.location.href = '/coordinador';
            } else {
                alert('Rol no reconocido.');
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            if (error.response && error.response.data) {
                const errorMessage = typeof error.response.data === 'object'
                    ? JSON.stringify(error.response.data)
                    : error.response.data;
                alert(errorMessage);
            } else {
                alert('Error al iniciar sesión. Inténtalo de nuevo.');
            }
        }
    };
    
    return (
        <div className="regisyini inicios">
            <div>
                <nav className="navbar nnni">
                    <img src={ImagesB('./logosena.png')} width="90" height="90" />
                    <img src={ImagesB('./logobienestech.png')} />
                </nav>

                <div className="container">
                    <div className="form-container">
                        <h2 className="h2r">Iniciar Sesión</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="numeroDocumento" className="form-label">Número de Documento</label>
                                <input
                                    type="text"
                                    value={numeroDocumento}
                                    className="form-controll"
                                    id="numeroDocumento"
                                    required
                                    onChange={(e) => setNumeroDocumento(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="claveUsuario" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    value={claveUsuario}
                                    className="form-controll"
                                    id="claveUsuario"
                                    required
                                    onChange={(e) => setClaveUsuario(e.target.value)}
                                />
                            </div>
                            <div className="row mt-4">
                                <div className="col-12 text-center">
                                    <button type="submit" className="btn btn-success submit-btn">
                                        Iniciar Sesión
                                    </button>
                                </div>
                            </div>
                        </form>

                        <br />
                        <p className="p">¿Aún no está registrado? <Link to="/registro">Registrarme</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InicioS;
