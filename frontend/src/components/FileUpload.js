import React, { useState } from 'react';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const FileUpload = ({ onFileSelect, className = '' }) => {
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setError('');

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('File size should be less than 1MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onFileSelect(reader.result);
            };
            reader.onerror = () => {
                setError('Error reading file');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {preview ? (
                        <div className="relative w-full h-full">
                            <img
                                src={preview}
                                alt="Preview"
                                className="absolute inset-0 w-full h-full object-contain p-2"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or GIF (max 1MB)</p>
                        </div>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                </label>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FileUpload;