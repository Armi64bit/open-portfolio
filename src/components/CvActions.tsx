"use client";

export function CvActions() {
  return (
    <div className="cv__actions" data-od-id="cv-actions">
      <button
        type="button"
        className="btn"
        onClick={() => window.print()}
        data-od-id="cv-print"
      >
        Print / Save as PDF
        <span className="ico" aria-hidden="true">
          ↓
        </span>
      </button>
    </div>
  );
}