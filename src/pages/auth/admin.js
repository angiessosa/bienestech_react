import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Navbar from '../../components/navbar';
import PiePagina from '../../components/piePagina';
import "./admin.css";



const ImagesB = require.context('../../assets', true);

const Admin = () => {

    return (

        <div className="admin-container">
            <Navbar/>

            <div className='container'>
                <h2 className='h2A'>Talleres de hoy</h2>
                <div className="row talleres">
                    <p>aqui van los talleres</p>
                </div>
            </div>
            <PiePagina />
        </div>
    );
};

export default Admin;

