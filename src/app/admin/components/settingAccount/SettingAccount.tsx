"use client";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function SettingAccount({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        {/* overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-60 z-[1001]"
          onClick={onClose}
        />
        {/* content */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full shadow-lg z-[1002] overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  
