"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";

export function VideoTestimonial({
  isOpen,
  onClose,
  videoUrl,
  posterUrl,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  posterUrl?: string;
  title?: string;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title ?? "Video Testimonial"}
      size="xl"
    >
      <div className="aspect-video rounded-xl overflow-hidden border border-border-light dark:border-border-dark bg-black relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <Spinner size="lg" />
          </div>
        )}
        <video
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={posterUrl}
          className="w-full h-full relative z-0"
          onCanPlay={() => setLoading(false)}
        >
          <track kind="captions" />
          <source src={videoUrl} />
        </video>
      </div>
    </Modal>
  );
}
