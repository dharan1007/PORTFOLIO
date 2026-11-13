import { lazy, Suspense } from "react";
const sources = import.meta.glob([
  "./components/**/rolling-blinds*.{tsx,jsx}",
  "./components/**/RollingBlinds*.{tsx,jsx}",
]);
const source = Object.values(sources)[0];
const LicensedBlinds = source
  ? lazy(() =>
      source().then((module) => ({
        default: module.default || module.RollingBlinds,
      })),
    )
  : null;
export default function PremiumBackdrop({ paused }) {
  return (
    <div
      className={`ambient-backdrop ${paused ? "ambient-paused" : ""}`}
      aria-hidden="true"
      data-background={
        LicensedBlinds
          ? "reactbits-rolling-blinds"
          : "original-ambient-fallback"
      }
    >
      {LicensedBlinds ? (
        <Suspense fallback={null}>
          <LicensedBlinds
            color="#dceaf4"
            hotColor="#bb8292"
            backgroundColor="transparent"
            opacity={0.55}
            paused={paused}
            grain={0.025}
          />
        </Suspense>
      ) : (
        <div className="ambient-bands" />
      )}
    </div>
  );
}
