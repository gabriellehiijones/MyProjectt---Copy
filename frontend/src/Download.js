// Client-side (React)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageDownload = () => {
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);

  // Fetch the list of images from the server when the component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://marketplace-shop-listing.com/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  // Handle image download
  const handleDownload = async () => {
    if (selectedImageId) {
      try {
        // Request image data from the server
        const response = await axios.get(`https://marketplace-shop-listing.com/download/${selectedImageId}`, {
          responseType: 'arraybuffer',
        });

        // Create a blob from the image data
        const blob = new Blob([response.data], { type: 'image/*' });

        // Create a download link and trigger the download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `downloaded_image_${selectedImageId}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    } else {
      alert('Selectează o imagine înainte de a descărca!');
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (imageId) => {
    setSelectedImageId(imageId);
  };

  // Render UI
  return (
    <div>
      <h2>Selectează o imagine pentru descărcare</h2>
      {images.map((image) => (
        <div key={image.id}>
          <input
            type="checkbox"
            id={`image_${image.id}`}
            onChange={() => handleCheckboxChange(image.id)}
            checked={selectedImageId === image.id}
          />
          <label htmlFor={`image_${image.id}`}>{image.original_filename}</label>
        </div>
      ))}
      <button onClick={handleDownload}>Descarcă Imagine</button>
    </div>
  );
};

export default ImageDownload;
