// src/components/CartaoSwitcher.jsx
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import CartaoMembros from './CartaoMembros';          // estilo 1 (padrão)
import CartaoMembrosEstilo2 from './CartaoMembrosEstilo2'; // estilo 2
import CartaoMembrosEstilo3 from './CartaoMembrosEstilo3'; // estilo 3

export default function CartaoSwitcher({ membro, onClose }) {
  const [estiloAtivo, setEstiloAtivo] = useState(0);

  const estilos = [
    <CartaoMembros key="est1" membro={membro} onClose={onClose} />,
    <CartaoMembrosEstilo2 key="est2" membro={membro} onClose={onClose} />,
    <CartaoMembrosEstilo3 key="est3" membro={membro} onClose={onClose} />,
  ];

  return (
    <>
      {/* Slider para escolher estilo */}
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        onSlideChange={(swiper) => setEstiloAtivo(swiper.activeIndex)}
        style={{ marginBottom: 20 }}
      >
        {estilos.map((_, idx) => (
          <SwiperSlide key={idx}>
            <div
              style={{
                padding: 8,
                border: estiloAtivo === idx ? '2px solid #1e3a8a' : '1px solid #ccc',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: 14,
                background: '#f8faff'
              }}
            >
              Estilo {idx + 1}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Cartão com o estilo selecionado */}
      {estilos[estiloAtivo]}
    </>
  );
}
