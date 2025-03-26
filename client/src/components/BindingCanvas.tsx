import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { InsertBindingProfile } from "@shared/schema";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const BOARD_LENGTH = 600;
const BOARD_WIDTH = 160;
const BINDING_WIDTH = 100;
const BINDING_LENGTH = 120;

// Base64 encoded binding image
const BINDING_IMAGE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF4WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpwcGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpzZEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDMtMjZUMTI6MjU6NDQtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDMtMjZUMTI6MjU6NDQtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAzLTI2VDEyOjI1OjQ0LTA0OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkzNzZkZDg1LWE2ZTAtNDA0Yi05ZWNiLTY2NjY2NjY2NjY2NiIgeG1wTU06RG9jdW1lbnRJRD0i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";

export default function BindingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bindingImageRef = useRef<HTMLImageElement | null>(null);
  const form = useFormContext<InsertBindingProfile>();
  const values = form.watch();

  // Load binding image
  useEffect(() => {
    const img = new Image();
    img.src = BINDING_IMAGE_URL;
    img.onload = () => {
      bindingImageRef.current = img;
      // Redraw canvas when image loads
      updateCanvas();
    };
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
    const setbackDirection = values.stance === "goofy" ? 1 : -1; // Positive for goofy (right), negative for regular (left)
    const setback = ((values.setback || 0) * setbackDirection); // Already in mm, multiply by direction

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
    const drawImageBinding = (x: number, y: number, angle: number) => {
      if (!bindingImageRef.current) return;

      ctx.save();
      ctx.translate(x, y);
      // Add 90 degrees to make 0 perpendicular to board, plus 180 to flip image right side up
      ctx.rotate((angle + 270) * Math.PI / 180);

      // Scale and draw the image
      const scale = 0.5; // Adjust scale as needed
      ctx.drawImage(
        bindingImageRef.current,
        -BINDING_LENGTH/2 * scale,
        -BINDING_WIDTH/2 * scale,
        BINDING_LENGTH * scale,
        BINDING_WIDTH * scale
      );

      ctx.restore();
    };

    // Draw left binding (was previously right)
    drawTriangleBinding(stanceWidth/2 + setback, 0, values.frontAngle || 0);

    // Draw right binding (was previously left)
    drawImageBinding(-stanceWidth/2 + setback, 0, values.backAngle || 0);

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