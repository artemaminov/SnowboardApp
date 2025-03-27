import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { InsertBindingProfile } from "@shared/schema";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const BOARD_LENGTH = 600;
const BOARD_WIDTH = 160;
const BINDING_WIDTH = 100;
const BINDING_LENGTH = 120;

export default function BindingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bindingImageRef = useRef<HTMLImageElement | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const form = useFormContext<InsertBindingProfile>();
  const values = form.watch();

  // Import binding image directly with Vite (handled at build time)
  useEffect(() => {
    try {
      const img = new Image();
      img.src = './binding.png';
      img.onload = () => {
        bindingImageRef.current = img;
        isInitializedRef.current = true;
        // Redraw canvas when image loads
        updateCanvas();
      };
      img.onerror = (error) => {
        console.error("Failed to load binding image", error);
        isInitializedRef.current = true; // Still mark as initialized to show fallback
        updateCanvas();
      };
    } catch (error) {
      console.error("Error loading binding image", error);
      isInitializedRef.current = true; // Still mark as initialized to show fallback
      updateCanvas();
    }
  }, []);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Transform to center and rotate 180 degrees
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.rotate(Math.PI); // Rotate 180 degrees

    // Draw board
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(-BOARD_LENGTH/2, -BOARD_WIDTH/2, BOARD_LENGTH, BOARD_WIDTH);

    // Calculate binding positions
    const stanceWidth = (values.stanceWidth || 50) * 4;
    // For goofy: increasing setback moves bindings to the left (-X direction)
    // For regular: increasing setback moves bindings to the right (+X direction)
    const setbackDirection = values.stance === "goofy" ? -1 : 1;
    const setback = ((values.setback || 0) * setbackDirection); // In mm, multiply by direction

    // Function to draw a binding triangle (used for left binding)
    const drawTriangleBinding = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      // Add 90 degrees to make 0 perpendicular to board
      ctx.rotate((angle + 90) * Math.PI / 180);

      // Draw binding triangle
      ctx.beginPath();
      ctx.moveTo(-BINDING_LENGTH/2, -BINDING_WIDTH/2); // Back left
      ctx.lineTo(BINDING_LENGTH/2, 0); // Front center (toe)
      ctx.lineTo(-BINDING_LENGTH/2, BINDING_WIDTH/2); // Back right
      ctx.closePath();
      ctx.fillStyle = "#dc2626";
      ctx.fill();

      // Add toe indicator
      ctx.beginPath();
      ctx.moveTo(BINDING_LENGTH/2 - 20, -10);
      ctx.lineTo(BINDING_LENGTH/2, 0);
      ctx.lineTo(BINDING_LENGTH/2 - 20, 10);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    };

    // Function to draw the image binding (used for right binding)
    const drawImageBinding = (x: number, y: number, angle: number, mirror: boolean = false) => {
      ctx.save();
      ctx.translate(x, y);

      // If image is available, use it; otherwise fall back to a triangle with different color
      if (bindingImageRef.current && isInitializedRef.current) {
        // Rotate to make binding perpendicular to board
        ctx.rotate(angle * Math.PI / 180);

        // Apply mirroring if needed
        if (mirror) {
          ctx.scale(-1, 1);
        }

        // Scale and draw the image to fit binding dimensions
        const scaleWidth = BINDING_WIDTH;
        const scaleHeight = BINDING_LENGTH;

        ctx.drawImage(
          bindingImageRef.current,
          -scaleWidth/2,
          -scaleHeight/2,
          scaleWidth,
          scaleHeight
        );
      } else {
        // Fallback to colored triangle if image is not available
        // Add 90 degrees to make 0 perpendicular to board
        ctx.rotate((angle + 90) * Math.PI / 180);

        // Draw binding triangle
        ctx.beginPath();
        ctx.moveTo(-BINDING_LENGTH/2, -BINDING_WIDTH/2); // Back left
        ctx.lineTo(BINDING_LENGTH/2, 0); // Front center (toe)
        ctx.lineTo(-BINDING_LENGTH/2, BINDING_WIDTH/2); // Back right
        ctx.closePath();
        ctx.fillStyle = "#3b82f6"; // Different color for right binding
        ctx.fill();

        // Add toe indicator
        ctx.beginPath();
        ctx.moveTo(BINDING_LENGTH/2 - 20, -10);
        ctx.lineTo(BINDING_LENGTH/2, 0);
        ctx.lineTo(BINDING_LENGTH/2 - 20, 10);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
    };

    // Draw left binding
    drawImageBinding(stanceWidth/2 + setback, 0, values.frontAngle || 0, true);

    // Draw right binding
    drawImageBinding(-stanceWidth/2 + setback, 0, values.backAngle || 0, false);

    // Draw measurements
    ctx.save();
    ctx.rotate(Math.PI); // Rotate text back to be readable
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`${values.stanceWidth || 50}cm`, 0, BOARD_WIDTH);
    ctx.fillText(`${values.setback || 0}mm`, setback, -BOARD_WIDTH);
    ctx.restore();

    ctx.restore();
  };

  useEffect(() => {
    updateCanvas();
  }, [values]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="w-full h-auto border rounded-lg bg-white"
    />
  );
}