"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print-btn"
    >
      Print Invoice
    </button>
  );
}