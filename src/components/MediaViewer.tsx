import { X } from "lucide-react";

type MediaViewerProps = {
  url: string;
  type: "IMAGE" | "VIDEO" | "PDF";
  onClose: () => void;
};

const MediaViewer = ({ url, type, onClose }: MediaViewerProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onClose}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
        {type === "IMAGE" && (
          <img
            src={url}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            alt="Preview"
          />
        )}
        {type === "VIDEO" && (
          <video
            src={url}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
        )}
        {type === "PDF" && (
          <iframe
            src={url}
            className="w-full h-full md:w-4/5 md:h-5/6 bg-white rounded-lg shadow-2xl"
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  );
};

export default MediaViewer;
