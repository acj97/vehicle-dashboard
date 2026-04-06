"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Input from "@/components/ui/Input";
import { useVehicleStore } from "@/lib/store/vehicleStore";

export default function MakesToolbar() {
  const { setSearchQuery } = useVehicleStore();
  const [value, setValue] = useState("");
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const timer = setTimeout(() => setSearchQuery(value), 300);
    return () => clearTimeout(timer);
  }, [value, setSearchQuery]);

  return (
    <Input
      leftIcon={<Search size={14} />}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search makes..."
    />
  );
}
