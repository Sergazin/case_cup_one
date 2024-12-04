import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from "lucide-react";
import { GarbageTruckResolved } from "@/ts_client";
import { useState } from "react";

interface GarbageTruckListProps {
  trucks: GarbageTruckResolved[];
  onSelect: (truck: GarbageTruckResolved) => void;
  current_uuid: string;
}

export function GarbageTruckList({ trucks, onSelect, current_uuid }: GarbageTruckListProps) {
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(current_uuid);

  const handleSelect = (uuid: string) => {
    setSelectedTruckId(uuid);
    const selectedTruck = trucks.find((truck) => truck.uuid === uuid);
    if (selectedTruck) {
      onSelect(selectedTruck);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {trucks.map((truck) => (
        <GarbageTruckCard
          key={truck.uuid}
          truck={truck}
          selected={selectedTruckId === truck.uuid}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

interface GarbageTruckCardProps {
  truck: GarbageTruckResolved;
  selected: boolean;
  onSelect: (uuid: string) => void;
}

export function GarbageTruckCard({ truck, selected, onSelect }: GarbageTruckCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${selected ? "border-primary" : ""}`}
      onClick={() => onSelect(truck.uuid)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{truck.plate_no}</CardTitle>
        <Box className={`h-4 w-4 ${selected ? "text-primary" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent className="m-0 p-2"></CardContent>
    </Card>
  );
}
