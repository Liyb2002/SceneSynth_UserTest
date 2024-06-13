import React, { useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import useImage from './useImage';

const GRID_SIZE = 256;

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
    if (!image) return null;
    const grid = [];
    const rows = Math.ceil(window.innerHeight / GRID_SIZE);
    const cols = Math.ceil(window.innerWidth / GRID_SIZE);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const key = `${i}-${j}`;
        grid.push(
          <Rect
            key={key}
            x={j * GRID_SIZE}
            y={i * GRID_SIZE}
            width={GRID_SIZE}
            height={GRID_SIZE}
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
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <KonvaImage
              image={image}
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
            />
            {renderGrid()}
          </Layer>
        </Stage>
      )}
    </div>
  );
}

export default App;
