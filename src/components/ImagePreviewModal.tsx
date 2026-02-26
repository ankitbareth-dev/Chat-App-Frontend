import { X } from "lucide-react";

type ImagePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  userName: string;
};

const ImagePreviewModal = ({
  isOpen,
  onClose,
  imageUrl,
  userName,
}: ImagePreviewModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in-up"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image */}
      <img
        src={imageUrl}
        alt={userName}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImagePreviewModal;
