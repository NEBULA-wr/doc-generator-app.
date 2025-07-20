import React, { useEffect } from 'react';
import { Gradient } from 'whatamesh';
import './GradientMeshBackground.css';

const GradientMeshBackground = () => {
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
  }, []);

  return <canvas id="gradient-canvas" style={{ position: 'fixed', zIndex: -1, top: 0, left: 0, width: '100vw', height: '100vh' }} />;
};

export default GradientMeshBackground;