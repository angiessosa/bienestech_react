import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImagesB = require.context('../../assets', true);

const InicioS = ({ setUserRole }) => { // Añadir setUserRole como prop

    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [claveUsuario, setClaveUsuario] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', {
                document_number: numeroDocumento,
                password: claveUsuario
            });
            console.log(response.data); // Verifica la respuesta de la API
            const rol = response.data.role;
            setUserRole(rol);
    
            // Redirige según el rol
            if (rol === 'Administrador') {
                navigate('/admin');
            } else if (rol === 'Coordinador') {
                navigate('/coordinador');
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            if (error.response && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert('Error al iniciar sesión. Inténtalo de nuevo.');
            }
        }
    };
    

    // Comprobar si hay una sesión activa al montar el componente
    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const storedName = localStorage.getItem('userName');
        // Podrías hacer algo con estos valores si es necesario
    }, []);

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
                        <form onSubmit={handleSubmit}>
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
