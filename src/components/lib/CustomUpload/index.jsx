import { useState, useEffect } from "react";
import PropTypes, { string } from "prop-types";
import { CustomUploaderWrapper } from "./index.styles";
import { IoMdAdd } from "react-icons/io";

export function CustomUpload({ setFile, initialImage, editable, title, clearImage,setClearImg }) {
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(initialImage || null);

  useEffect(() => {
    if (clearImage) {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc); 
      }
      setImageSrc(null);
      setFile(null); 
      setClearImg(false);
    }
  }, [clearImage]);
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileName = selectedFile.name.toLowerCase();
      if (["image/svg+xml", "image/png", "image/jpeg"].includes(fileType)) {
        if (fileName.endsWith(".jfif")) {
          setError("JFIF files are not supported. Please upload a JPG, JPEG, PNG, or SVG file.");
          setFile(null);
          return;
        }
        const img = new Image();
        img.onload = function () {
          if (img.width > 3000 || img.height > 3000) {
            setError("Image dimensions exceed the maximum allowed size of 3000x3000 pixels.");
            setFile(null);
            setImageSrc(null);
          } else {
            setError(null);
            setImageSrc(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
          }
        };
        img.onerror = function () {
          setError("Error loading image.");
          setFile(null);
          setImageSrc(null);
        };
        img.src = URL.createObjectURL(selectedFile);
      } else {
        setError("Invalid file type. Please select an SVG, PNG, or JPG file.");
        setFile(null);
      }
    }
  };

  return (
    <CustomUploaderWrapper>
      {title && <p className="upload__title">{title}</p>}
      <div
        className="upload__container"
        style={{
          backgroundColor: editable ? "rgba(0, 0, 0, 0.5)" : "transparent",
          borderStyle: editable ? "solid" : "dashed",
        }}
      >
        {editable && (
          <input
            type="file"
            id="fileInput"
            className="upload__input"
            accept="image/svg+xml, image/png, image/jpeg"
            onChange={handleFileChange}
            aria-label="Upload image"
          />
        )}
        {imageSrc ? (
          <img id="previewImage" className="upload__image" src={imageSrc} alt="Image Preview" />
        ) : (
          <div className="placeholder__container">
            <IoMdAdd />
            <p className="main__text">Upload Image</p>
          </div>
        )}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </CustomUploaderWrapper>
  );
}

CustomUpload.defaultProps = {
  editable: false,
  title: "",
  initialImage: null,
};

CustomUpload.propTypes = {
  setFile: PropTypes.func.isRequired,
  initialImage: PropTypes.string,
  editable: PropTypes.bool,
  title: PropTypes.string,
};
