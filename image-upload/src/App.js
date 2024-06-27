import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import axios from 'axios';
import useImage from './useImage';

const GRID_ROWS = 64;
const GRID_COLS = 64;
const GRID_WIDTH = 1024 / GRID_COLS;
const GRID_HEIGHT = 1024 / GRID_ROWS;

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [gridColors, setGridColors] = useState({});
  const [currentColor, setCurrentColor] = useState('red');
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef(null);

  // Load image using useImage hook
  const [image] = useImage(imageUrl);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files).filter(file => file.name.endsWith('.png'));
    const urls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(urls);
    setCurrentImageIndex(0);
    if (urls.length > 0) {
      setImageUrl(urls[0]);
    }
  };

  useEffect(() => {
    if (selectedImages.length > 0 && currentImageIndex < selectedImages.length) {
      setImageUrl(selectedImages[currentImageIndex]);
    }
  }, [selectedImages, currentImageIndex]);

  const handleGridClick = (row, col) => {
    const key = `${row}-${col}`;
    setGridColors((prevColors) => ({
      ...prevColors,
      [key]: currentColor === 'erase' ? null : currentColor,
    }));
  };

  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const row = Math.floor(pointerPosition.y / GRID_HEIGHT);
    const col = Math.floor(pointerPosition.x / GRID_WIDTH);
    handleGridClick(row, col);
  };

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < GRID_ROWS; i++) {
      for (let j = 0; j < GRID_COLS; j++) {
        const key = `${i}-${j}`;
        grid.push(
          <Rect
            key={key}
            x={j * GRID_WIDTH}
            y={i * GRID_HEIGHT}
            width={GRID_WIDTH}
            height={GRID_HEIGHT}
            fill={gridColors[key] || 'transparent'}
            stroke="black"
            strokeWidth={1}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          />
        );
      }
    }
    return grid;
  };

  const saveImage = async () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const formData = new FormData();
      formData.append('image', dataURItoBlob(uri), `edited_image_${currentImageIndex}.png`);

      try {
        await axios.post('http://localhost:8080/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Image saved successfully!');
      } catch (error) {
        console.error('Error saving image:', error);
      }
    } else {
      console.error('Stage is not initialized.');
    }
  };

  const nextImage = async () => {
    if (stageRef.current) {
      await saveImage();
      setGridColors({});
      if (currentImageIndex < selectedImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        alert('All images processed.');
      }
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="App">
      <h1>Upload Images</h1>
      <input type="file" accept="image/png" multiple onChange={handleImageChange} webkitdirectory="" />
      <div>
        <button onClick={() => setCurrentColor('red')}>Red</button>
        <button onClick={() => setCurrentColor('blue')}>Blue</button>
        <button onClick={() => setCurrentColor('erase')}>Erase</button>
        <button onClick={nextImage}>Next Image</button>
      </div>
      {selectedImages.length > 0 && image && (
        <Stage width={1024} height={1024} ref={stageRef}>
          <Layer>
            <KonvaImage
              image={image}
              x={0}
              y={0}
              width={1024}
              height={1024}
            />
            {renderGrid()}
          </Layer>
        </Stage>
      )}
    </div>
  );
}

export default App;
