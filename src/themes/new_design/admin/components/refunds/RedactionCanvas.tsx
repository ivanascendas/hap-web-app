import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { Box } from "@mui/material";

export interface RedactionRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RedactionCanvasProps {
  imageUrl: string;
  rectangles: RedactionRect[];
  onRectanglesChange: (rects: RedactionRect[]) => void;
  selectedRectId: string | null;
  onSelectRect: (id: string | null) => void;
  zoom: number;
  onImageLoadError?: () => void;
}

export const RedactionCanvas: React.FC<RedactionCanvasProps> = ({
  imageUrl,
  rectangles,
  onRectanglesChange,
  selectedRectId,
  onSelectRect,
  zoom,
  onImageLoadError,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 900, height: 600 });
  const [loadError, setLoadError] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [draft, setDraft] = useState<Omit<RedactionRect, "id"> | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setImage(null);
      setLoadError(false);
      return;
    }

    setImage(null);
    setLoadError(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
      const maxW = 900;
      const maxH = 650;
      const ratio = img.width / img.height;
      let width = maxW;
      let height = width / ratio;
      if (height > maxH) {
        height = maxH;
        width = height * ratio;
      }
      setImageSize({ width, height });
    };
    img.onerror = () => {
      setLoadError(true);
      setImage(null);
      onImageLoadError?.();
    };
    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, onImageLoadError]);

  const scale = useMemo(() => {
    if (!image) return { x: 1, y: 1 };
    return {
      x: imageSize.width / image.width,
      y: imageSize.height / image.height,
    };
  }, [image, imageSize]);

  const getPointerInImage = (
    stage: Konva.Stage,
  ): { x: number; y: number } | null => {
    const p = stage.getPointerPosition();
    if (!p) return null;
    return { x: p.x / zoom / scale.x, y: p.y / zoom / scale.y };
  };

  const normalizeRect = (
    r: Omit<RedactionRect, "id">,
  ): Omit<RedactionRect, "id"> => ({
    x: Math.min(r.x, r.x + r.width),
    y: Math.min(r.y, r.y + r.height),
    width: Math.abs(r.width),
    height: Math.abs(r.height),
  });

  const toStageRect = (r: Omit<RedactionRect, "id">) => {
    const n = normalizeRect(r);
    return {
      x: n.x * scale.x * zoom,
      y: n.y * scale.y * zoom,
      width: n.width * scale.x * zoom,
      height: n.height * scale.y * zoom,
    };
  };

  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    // Start drawing only when clicking empty area/image
    const clickedRect = e.target.getClassName() === "Rect";
    if (clickedRect) return;

    const p = getPointerInImage(stage);
    if (!p) return;

    onSelectRect(null);
    setDrawing(true);
    setDraft({ x: p.x, y: p.y, width: 0, height: 0 });
  };

  const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!drawing || !draft) return;
    const stage = e.target.getStage();
    if (!stage) return;

    const p = getPointerInImage(stage);
    if (!p) return;

    setDraft({
      x: draft.x,
      y: draft.y,
      width: p.x - draft.x,
      height: p.y - draft.y,
    });
  };

  const onMouseUp = () => {
    if (!drawing || !draft) return;
    setDrawing(false);

    const normalized = normalizeRect(draft);
    if (normalized.width < 3 || normalized.height < 3) {
      setDraft(null);
      return;
    }

    onRectanglesChange([...rectangles, { id: uuidv4(), ...normalized }]);
    setDraft(null);
  };

  const onRectDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const next = rectangles.map((r) => {
      if (r.id !== id) return r;
      return {
        ...r,
        x: e.target.x() / zoom / scale.x,
        y: e.target.y() / zoom / scale.y,
      };
    });
    onRectanglesChange(next);
  };

  if (loadError) {
    return (
      <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
        Unable to load image.
      </Box>
    );
  }

  if (!image) {
    return (
      <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
        Loading image...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        overflow: "auto",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stage
        ref={stageRef}
        width={imageSize.width * zoom}
        height={imageSize.height * zoom}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ border: "1px solid #d0d0d0", background: "#fff" }}
      >
        <Layer>
          <KonvaImage
            image={image}
            width={imageSize.width * zoom}
            height={imageSize.height * zoom}
          />

          {rectangles.map((r) => {
            const sr = toStageRect(r);
            const selected = selectedRectId === r.id;
            return (
              <Rect
                key={r.id}
                x={sr.x}
                y={sr.y}
                width={sr.width}
                height={sr.height}
                fill="rgba(0, 84, 166, 0.18)"
                stroke={selected ? "#ff9800" : "#0054a6"}
                strokeWidth={selected ? 3 : 2}
                draggable
                onClick={() => onSelectRect(selected ? null : r.id)}
                onTap={() => onSelectRect(selected ? null : r.id)}
                onDragEnd={(e) => onRectDragEnd(r.id, e)}
              />
            );
          })}

          {draft &&
            (() => {
              const sr = toStageRect(draft);
              return (
                <Rect
                  x={sr.x}
                  y={sr.y}
                  width={sr.width}
                  height={sr.height}
                  fill="rgba(0, 84, 166, 0.12)"
                  stroke="#0054a6"
                  strokeWidth={2}
                  dash={[6, 4]}
                />
              );
            })()}
        </Layer>
      </Stage>
    </Box>
  );
};
