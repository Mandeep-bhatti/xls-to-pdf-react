"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Link href="/exl-to-pdf" className="text-blue-600 hover:underline">
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 cursor-pointer">
          Go Excel to Pdf Converter
        </button>

      </Link>
    </div>
  );
}
