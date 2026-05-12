"use client";

import { Modal } from "@/components/ui/Modal";

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title ?? "Video Testimonial"}
      size="xl"
    >
      <div className="aspect-video rounded-xl overflow-hidden border border-border-light dark:border-border-dark bg-black">
        <video
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={posterUrl}
          className="w-full h-full"
        >
          <track kind="captions" />
          <source src={videoUrl} />
        </video>
      </div>
    </Modal>
  );
}
