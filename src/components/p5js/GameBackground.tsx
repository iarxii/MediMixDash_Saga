import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

interface GameBackgroundProps {
  width?: number;
  height?: number;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ width = window.innerWidth, height = window.innerHeight }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let currentMode = 0;
      let transitionProgress = 0;
      let transitionDuration = 300; // frames for transition
      let modeDuration = 1800; // frames per mode
      let frameCounter = 0;

      // Color schemes for three modes - defined inside sketch function
      let colorSchemes: Array<{colors: p5.Color[], animation: string}>;

      let graphicsBuffer: p5.Graphics;

      p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        graphicsBuffer = p.createGraphics(width, height, p.P2D);
        graphicsBuffer.pixelDensity(1); // Better performance

        // Define colors after p5 is initialized
        colorSchemes = [
          // Mode 1: Pharmacy Blues (calm, professional)
          {
            colors: [
              p.color('#E3F2FD'), // Light blue
              p.color('#2196F3'), // Blue
              p.color('#0D47A1'), // Dark blue
            ],
            animation: 'horizontal_flow'
          },
          // Mode 2: Health Greens (vitality, growth)
          {
            colors: [
              p.color('#E8F5E8'), // Light green
              p.color('#4CAF50'), // Green
              p.color('#1B5E20'), // Dark green
            ],
            animation: 'vertical_wave'
          },
          // Mode 3: Candy Pinks (fun, energetic)
          {
            colors: [
              p.color('#FCE4EC'), // Light pink
              p.color('#E91E63'), // Pink
              p.color('#880E4F'), // Dark pink
            ],
            animation: 'radial_pulse'
          }
        ];
      };

      p.draw = () => {
        if (!colorSchemes) return; // Wait for setup to complete

        frameCounter++;

        // Check for mode transition
        if (frameCounter % modeDuration === 0) {
          transitionProgress = 0;
          currentMode = (currentMode + 1) % colorSchemes.length;
        }

        // Update transition progress
        if (transitionProgress < transitionDuration) {
          transitionProgress++;
        }

        const t = p.min(transitionProgress / transitionDuration, 1);
        const easedT = easeInOutCubic(t);

        // Get current and next colors
        const currentScheme = colorSchemes[currentMode];
        const nextScheme = colorSchemes[(currentMode + 1) % colorSchemes.length];

        // Interpolate colors
        const interpolatedColors = currentScheme.colors.map((color, i) => {
          const nextColor = nextScheme.colors[i];
          return p.lerpColor(color, nextColor, easedT);
        });

        // Draw gradient based on animation type
        drawAnimatedGradient(p, graphicsBuffer, interpolatedColors, currentScheme.animation, frameCounter);

        // Display the buffer
        p.image(graphicsBuffer, -width/2, -height/2);
      };

      const drawAnimatedGradient = (p: p5, buffer: p5.Graphics, colors: p5.Color[], animation: string, frame: number) => {
        buffer.clear();

        switch (animation) {
          case 'horizontal_flow':
            // Smooth horizontal flowing gradient
            const flowOffset = (frame * 0.5) % width;
            for (let x = 0; x < width; x += 2) { // Step by 2 for performance
              const inter = ((x + flowOffset) % width) / width;
              const c = p.lerpColor(colors[0], colors[1], inter);
              buffer.stroke(c);
              buffer.strokeWeight(2);
              buffer.line(x, 0, x, height);
            }
            break;

          case 'vertical_wave':
            // Vertical wave gradient
            const waveOffset = frame * 0.02;
            for (let y = 0; y < height; y += 2) {
              const inter = (p.sin((y * 0.01) + waveOffset) + 1) / 2;
              const c = p.lerpColor(colors[1], colors[2], inter);
              buffer.stroke(c);
              buffer.strokeWeight(2);
              buffer.line(0, y, width, y);
            }
            break;

          case 'radial_pulse':
            // Radial pulsing gradient
            const pulseScale = 1 + p.sin(frame * 0.05) * 0.3;
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = p.max(width, height) * pulseScale;

            for (let r = 0; r < maxRadius; r += 5) { // Step by 5 for performance
              const inter = r / maxRadius;
              const c = p.lerpColor(colors[2], colors[0], inter);
              buffer.stroke(c);
              buffer.strokeWeight(5);
              buffer.noFill();
              buffer.circle(centerX, centerY, r * 2);
            }
            break;
        }
      };

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        if (graphicsBuffer) {
          graphicsBuffer.resizeCanvas(p.windowWidth, p.windowHeight);
        }
      };
    };

    if (sketchRef.current && !p5InstanceRef.current) {
      p5InstanceRef.current = new p5(sketch, sketchRef.current);
    }

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [width, height]);

  return <div ref={sketchRef} className="game-background" />;
};

export default GameBackground;