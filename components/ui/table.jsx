import { cn } from "@/lib/utils";
export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}
export function TableHeader(props) {
  return (
    <thead
      className="border-b bg-muted/35 text-xs text-muted-foreground"
      {...props}
    />
  );
}
export function TableBody(props) {
  return <tbody className="divide-y" {...props} />;
}
export function TableRow(props) {
  return <tr className="transition-colors hover:bg-muted/30" {...props} />;
}
export function TableHead(props) {
  return <th className="h-12 px-5 text-left font-medium" {...props} />;
}
export function TableCell(props) {
  return <td className="px-5 py-4 align-middle" {...props} />;
}
