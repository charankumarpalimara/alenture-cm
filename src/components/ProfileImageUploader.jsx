import React, { useRef, useState } from "react";
import { Avatar, Modal, Button } from "antd";
import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  const cropWidth = mediaWidth * 0.9;
  const cropHeight = cropWidth / aspect;
  const cropX = (mediaWidth - cropWidth) / 2;
  const cropY = (mediaHeight - cropHeight) / 2;
  return {
    unit: "%",
    x: (cropX / mediaWidth) * 100,
    y: (cropY / mediaHeight) * 100,
    width: (cropWidth / mediaWidth) * 100,
    height: (cropHeight / mediaHeight) * 100,
  };
}

const ProfileImageUploader = React.memo(function ProfileImageUploader({
  imageUrl,
  onImageChange,
  avatarSize = 96,
  loading = false,
}) {
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setCropModalVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  const handleCropComplete = (c) => {
    setCompletedCrop(c);
  };

  const handleSaveCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    canvas.toBlob((blob) => {
      if (blob) {
        onImageChange(blob);
        setCropModalVisible(false);
      }
    }, "image/jpeg");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <Avatar
        src={imageUrl}
        size={avatarSize}
        icon={<CameraOutlined />}
        style={{ cursor: loading ? "not-allowed" : "pointer" }}
        onClick={loading ? undefined : triggerFileInput}
      />
      <Modal
        open={cropModalVisible}
        onCancel={() => setCropModalVisible(false)}
        footer={null}
        destroyOnClose
        title="Crop Image"
      >
        {originalImage && (
          <>
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              onComplete={handleCropComplete}
              aspect={1}
            >
              <img
                ref={imgRef}
                src={originalImage}
                alt="Crop"
                style={{ maxWidth: "100%" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Button
                icon={<CloseOutlined />}
                onClick={() => setCropModalVisible(false)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={handleSaveCroppedImage}>
                Save
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
});

export default ProfileImageUploader; 