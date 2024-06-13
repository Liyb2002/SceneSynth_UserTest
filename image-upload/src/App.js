import React, { useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import useImage from './useImage';

const GRID_ROWS = 256;
const GRID_COLS = 256;
const GRID_WIDTH = 1024 / GRID_COLS;
const GRID_HEIGHT = 1024 / GRID_ROWS;

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [image] = useImage(selectedImage);
  const [gridColors, setGridColors] = useState({});
  const [currentColor, setCurrentColor] = useState('red');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleGridClick = (row, col) => {
    const key = `${row}-${col}`;
    setGridColors((prevColors) => ({
      ...prevColors,
      [key]: prevColors[key] === currentColor ? null : currentColor,
    }));
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
            onClick={() => handleGridClick(i, j)}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="App">
      <h1>Upload an Image</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div>
        <button onClick={() => setCurrentColor('red')}>Red</button>
        <button onClick={() => setCurrentColor('blue')}>Blue</button>
      </div>
      {selectedImage && image && (
        <Stage width={1024} height={1024}>
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
