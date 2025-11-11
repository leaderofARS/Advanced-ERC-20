'use client';

import dynamic from 'next/dynamic';

const Particles = dynamic(() => import('./Particles'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-transparent" />
});

export default function ParticlesBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Particles
        particleColors={['#3b82f6', '#60a5fa', '#93c5fd']}
        particleCount={150}
        particleSpread={12}
        speed={0.05}
        particleBaseSize={80}
        moveParticlesOnHover={true}
        particleHoverFactor={0.5}
        alphaParticles={true}
        disableRotation={false}
        sizeRandomness={0.8}
        cameraDistance={18}
      />
    </div>
  );
}
