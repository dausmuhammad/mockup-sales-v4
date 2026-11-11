import { UsersRound, ClipboardList, CheckCheck, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
const icons = [UsersRound, ClipboardList, CheckCheck, Send];
export function MetricCards({ cards }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4 xl:gap-4">
      {cards.map(([label, value], i) => {
        const Icon = icons[i];
        return (
          <Card
            key={label}
            className="rounded-[17px] p-3.5 shadow-[0_12px_30px_rgba(25,43,87,.08)]"
          >
            <span className="float-right flex size-7 items-center justify-center rounded-[10px] bg-secondary text-primary">
              <Icon className="size-3.5" />
            </span>
            <h2 className="pr-8 text-[11px] text-muted-foreground">{label}</h2>
            <strong className="mt-2 mb-1 block text-[25px]">{value}</strong>
            <small className="text-[10px] text-[#16a477]">
              {i === 1 ? "Perlu perhatian" : "Data simulasi"}
            </small>
          </Card>
        );
      })}
    </div>
  );
}
