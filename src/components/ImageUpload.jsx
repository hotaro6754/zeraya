import { useState } from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';

export default function ImageUpload({ onUploadComplete }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setUploading(true);
    const storageRef = ref(storage, `profile-images/${Date.now()}_${image.name}`);

    try {
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      onUploadComplete(downloadURL);
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
        {preview ? (
          <img src={preview} alt="Preview" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: 120, height: 120, borderRadius: '50%', backgroundColor: 'var(--bg-surface)',
            border: '2px dashed var(--border-subtle)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'
          }}>
            Select Image
          </div>
        )}
      </label>

      {preview && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginTop: 20 }}>
          <button onClick={handleUpload} className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Photo'}
          </button>
        </motion.div>
      )}
    </div>
  );
}