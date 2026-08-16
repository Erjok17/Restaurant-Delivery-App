"use client";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-100">
      <p className="text-sm text-neutral-500">Loading map...</p>
    </div>
  ),
});

export default DeliveryMap;