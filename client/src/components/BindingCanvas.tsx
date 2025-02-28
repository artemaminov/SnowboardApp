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

    // Transform to center
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    // Draw board
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(-BOARD_LENGTH/2, -BOARD_WIDTH/2, BOARD_LENGTH, BOARD_WIDTH);

    // Calculate binding positions
    const stanceWidth = (values.stanceWidth || 50) * 4;
    const setback = ((values.setback || 0) * 10);
    
    // Draw bindings
    ctx.save();
    
    // Front binding
    ctx.translate(-stanceWidth/2 + setback, 0);
    ctx.rotate((values.frontAngle || 0) * Math.PI / 180);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(-BINDING_LENGTH/2, -BINDING_WIDTH/2, BINDING_LENGTH, BINDING_WIDTH);
    ctx.restore();

    // Back binding
    ctx.save();
    ctx.translate(stanceWidth/2 + setback, 0);
    ctx.rotate((values.backAngle || 0) * Math.PI / 180);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(-BINDING_LENGTH/2, -BINDING_WIDTH/2, BINDING_LENGTH, BINDING_WIDTH);
    ctx.restore();

    // Draw measurements
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`${values.stanceWidth || 50}cm`, 0, BOARD_WIDTH);
    ctx.fillText(`${values.setback || 0}cm`, setback, -BOARD_WIDTH);

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
