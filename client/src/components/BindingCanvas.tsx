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
  const form = useFormContext<InsertBindingProfile>();
  const values = form.watch();

  useEffect(() => {
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
    const setback = ((values.setback || 0) * 10);

    // Function to draw a binding triangle
    const drawBinding = (x: number, y: number, angle: number) => {
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

    // Draw left binding (was previously right)
    drawBinding(stanceWidth/2 + setback, 0, values.frontAngle || 0);

    // Draw right binding (was previously left)
    drawBinding(-stanceWidth/2 + setback, 0, values.backAngle || 0);

    // Draw measurements
    ctx.save();
    ctx.rotate(Math.PI); // Rotate text back to be readable
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`${values.stanceWidth || 50}cm`, 0, BOARD_WIDTH);
    ctx.fillText(`${values.setback || 0}cm`, setback, -BOARD_WIDTH);
    ctx.restore();

    ctx.restore();
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