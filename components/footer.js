// components/Footer.js

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Sobre Nós</h5>
            <p>Informações sobre a empresa, missão e valores.</p>
          </div>
          <div className="col-md-4">
            <h5>Links Úteis</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contato</h5>
            <p>Email: contato@empresa.com</p>
            <p>Telefone: (11) 1234-5678</p>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <p>&copy; 2024 Guilherme Sampaio </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
