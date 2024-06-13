import { useState, useEffect } from 'react';

function useImage(url) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!url) return;

    const img = new Image();
    img.src = url;
    img.onload = () => setImage(img);

    return () => {
      img.onload = null;
    };
  }, [url]);

  return [image];
}

export default useImage;
