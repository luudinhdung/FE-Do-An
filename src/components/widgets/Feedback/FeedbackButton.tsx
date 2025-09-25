"use client";

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import FeedbackForm from "./FeedbackForm";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Form Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1E1F26] p-6 rounded-2xl shadow-lg w-[90%] max-w-md relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <FeedbackForm onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
