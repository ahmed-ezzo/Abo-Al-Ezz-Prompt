import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreview: string | null;
  translations: {
    uploadAreaTitle: string;
    uploadAreaSubtitle: string;
    uploadAreaButton: string;
  };
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreview, translations }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  if (imagePreview) {
    return (
      <div className="group relative">
        <img 
            src={imagePreview} 
            alt="Selected preview" 
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg border-2 border-zinc-200 dark:border-zinc-700" 
        />
         <button 
            onClick={handleAreaClick} 
            className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
        >
          Change Image
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleAreaClick}
      className={`mt-8 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-[#0017f1] bg-blue-500/10 scale-105' : 'border-zinc-300 dark:border-zinc-700 hover:border-[#0017f1] hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
        <UploadIcon className="w-12 h-12 mb-4 text-zinc-400 dark:text-zinc-500" />
        <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{translations.uploadAreaTitle}</p>
        <p className="text-sm">{translations.uploadAreaSubtitle}</p>
      </div>
    </div>
  );
};

export default ImageUploader;