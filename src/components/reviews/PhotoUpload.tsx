"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

interface PhotoUploadProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export default function PhotoUpload({ onFileSelect, error }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      onFileSelect(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError("Only JPEG, PNG, and WebP images are accepted.");
      setPreview(null);
      onFileSelect(null);
      return;
    }

    if (file.size > MAX_SIZE) {
      setLocalError("File must be 5 MB or less.");
      setPreview(null);
      onFileSelect(null);
      return;
    }

    setLocalError(null);
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  }

  function handleRemove() {
    setPreview(null);
    setLocalError(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const displayError = error || localError;

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <Image
            src={preview}
            alt="Preview"
            width={200}
            height={200}
            className="rounded-xl object-cover w-[200px] h-[200px]"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            aria-label="Remove photo"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[#d4d4d4] rounded-xl p-8 w-full text-center hover:border-[#4cbb17] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-4xl text-[#78716c] mb-2 block">
            add_a_photo
          </span>
          <p className="text-sm text-[#78716c]">Click to upload a photo (optional)</p>
          <p className="text-xs text-[#a8a29e] mt-1">JPEG, PNG, or WebP — max 5 MB</p>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        aria-label="Upload photo"
      />
      {displayError && (
        <p className="text-red-500 text-sm mt-2">{displayError}</p>
      )}
    </div>
  );
}
