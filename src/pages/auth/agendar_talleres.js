import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Navbar from '../../components/navbar';
import PiePagina from '../../components/piePagina';
import "./admin.css";

const AgendarTaller = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [taller, setTaller] = useState({
        centroFormacion: '',
        jornada: '',
        coordinacion: '',
        ficha: '',
        horaDisponible: '',
        tema: '',
        profesional: '',
        observaciones: '',
    });
    const [error, setError] = useState('');
    const [horariosFicha, setHorariosFicha] = useState({});
    const [datos, setDatos] = useState([]);

    
    const navigate = useNavigate();

    useEffect(() => {
        axios.all([
            axios.get('http://localhost:8000/coordinaciones'),
            axios.get('http://localhost:8000/fichas'),
            axios.get('http://localhost:8000/temas'),
            axios.get('http://localhost:8000/profesionales'),
            axios.get('http://localhost:8000/horarios')
        ]).then(axios.spread((coordinaciones, fichas, temas, profesionales, horarios) => {
            console.log('Datos recibidos:', {
                coordinaciones: coordinaciones.data,
                fichas: fichas.data,
                temas: temas.data,
                profesionales: profesionales.data,
                horarios: horarios.data
            });
            
            setDatos({
                coordinaciones: coordinaciones.data,
                fichas: fichas.data,
                temas: temas.data,
                profesionales: profesionales.data,
            });
            setHorariosFicha(horarios.data);
        })).catch(error => {
            console.error('Error al obtener datos', error);
        });
    }, []);
    

    const handleInputChange = (e) => {
        setTaller({ ...taller, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const horaDisponible = taller.horaDisponible;
        const fechaTaller = selectedDate;
        const fechaHora = `${horaDisponible}:00`;

        if (!fechaTaller || !horaDisponible) {
            setError('Por favor, seleccione todos los campos necesarios.');
            return;
        }

        const { horaInicio, horaFin } = horariosFicha[taller.ficha] || {};

        if (!horaInicio || !horaFin) {
            setError('Horario de ficha no definido.');
            return;
        }

        const validateTimeSlot = (horaInicio, horaFin, fechaHora) => {
            const start = new Date(`1970-01-01T${horaInicio}:00`);
            const end = new Date(`1970-01-01T${horaFin}:00`);
            const tallerStart = new Date(`1970-01-01T${fechaHora}:00`);
            const tallerEnd = new Date(tallerStart.getTime() + 30 * 60000); // Añadir 30 minutos

            return tallerStart >= start && tallerEnd <= end;
        };

        if (!validateTimeSlot(horaInicio, horaFin, fechaHora)) {
            setError('La hora del taller no está dentro del rango permitido o se solapa con otro taller.');
            return;
        }

        const data = {
            ...taller,
            fechaTaller: fechaTaller.toLocaleDateString('es-CO'),
            horaInicio: fechaHora,
            horaFin: new Date(new Date(fechaHora).getTime() + 30 * 60000).toTimeString().substr(0, 5), // Hora fin + 30 minutos
        };

        axios.post('http://localhost:8000/talleres/', data)
            .then(response => {
                navigate('/agendado', { state: { taller: data } });
            })
            .catch(error => {
                console.error('Hubo un error al guardar el taller', error);
            });
    };

    const handleLogout = () => {
        // Eliminar los datos de sesión almacenados en localStorage
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');

        // Redirigir al usuario a la página de inicio de sesión
        navigate('/', { replace: true });
    };

    return (
        <div className='agd-container'>
            <Navbar handleLogout={handleLogout} />
            <div className="container mt-4">
                <h2 className="mb-4 text-center h2A">Agendar Taller</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit} className='agendamiento'>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="centroFormacion">
                            <Form.Label>1. Centro de Formación</Form.Label>
                            <Form.Select className='opcion' name="centroFormacion" onChange={handleInputChange} required>
                                <option value="">Seleccione el Centro de Formación</option>
                                <option value="calle52">Sede Calle 52</option>
                                <option value="calle64">Sede Calle 64</option>
                                <option value="fontibon">Sede Fontibón</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="jornada">
                            <Form.Label>2. Jornada</Form.Label>
                            <Form.Select className='opcion' name="jornada" onChange={handleInputChange} required>
                                <option value="">Seleccione la Jornada</option>
                                <option value="manana">Mañana</option>
                                <option value="diurna">Diurna</option>
                                <option value="noche">Noche</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="coordinacion">
                            <Form.Label>3. Coordinación</Form.Label>
                            <Form.Select className='opcion' name="coordinacion" onChange={handleInputChange} required>
                                <option value="">Seleccione Coordinación</option>
                                {datos.coordinaciones && datos.coordinaciones.length > 0 ? (
                                    datos.coordinaciones.map(coord => (
                                        <option key={coord.id} value={coord.id}>{coord.nombre}</option>
                                    ))
                                ) : (
                                    <option value="">No hay coordinaciones disponibles</option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="ficha">
                            <Form.Label>4. Ficha</Form.Label>
                            <Form.Select className='opcion' name="ficha" onChange={handleInputChange} required>
                                <option value="">Seleccione Ficha</option>
                                {datos.fichas && datos.fichas.length > 0 ? (
                                    datos.fichas.map(ficha => (
                                        <option key={ficha.id} value={ficha.id}>{ficha.numero}</option>
                                    ))
                                ) : (
                                    <option value="">No hay fichas disponibles</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="horaDisponible">
                            <Form.Label>5. Hora Disponible</Form.Label>
                            <Form.Select className='opcion' name="horaDisponible" onChange={handleInputChange} required>
                                <option value="">Seleccione Hora</option>
                                {/* Aquí debes proporcionar las horas disponibles como opciones */}
                                {datos.horas.map(hora => (
                                    <option key={hora} value={hora}>{hora}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="tema">
                            <Form.Label>6. Tema</Form.Label>
                            <Form.Select className='opcion' name="tema" onChange={handleInputChange} required>
                                <option value="">Seleccione Tema</option>
                                {datos.temas && datos.temas.length > 0 ? (
                                    datos.temas.map(tema => (
                                        <option key={tema.id} value={tema.id}>{tema.nombre}</option>
                                    ))
                                ) : (
                                    <option value="">No hay temas disponibles</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="profesional">
                        <Form.Select className='opcion' name="profesional" onChange={handleInputChange} required>
                            <option value="">Seleccione Profesional</option>
                            {datos.profesionales && datos.profesionales.length > 0 ? (
                                datos.profesionales.map(prof => (
                                    <option key={prof.id} value={prof.id}>{prof.nombre}</option>
                                ))
                            ) : (
                                <option value="">No hay profesionales disponibles</option>
                            )}
                        </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="fechaTaller">
                            <Form.Label>8. Fecha</Form.Label>
                            <br></br>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                className="form-control opcion"
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="observaciones">
                        <Form.Label>9. Observaciones</Form.Label>
                        <Form.Control className='opcion'
                            type="text"
                            name="observaciones"
                            value={taller.observaciones}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Button variant="success" type="submit" className="w-100">Guardar Taller</Button>
                </Form>
            </div>
            <PiePagina />
        </div>
    );
};

export default AgendarTaller;
