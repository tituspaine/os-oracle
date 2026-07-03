import type { KnownError } from "@/data/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ErrorList({ errors }: { errors: KnownError[] }) {
  if (errors.length === 0) {
    return <p className="text-sm text-muted-foreground">No known errors documented yet.</p>;
  }
  return (
    <Accordion type="multiple" className="w-full">
      {errors.map((e, i) => (
        <AccordionItem key={i} value={`e${i}`}>
          <AccordionTrigger className="text-left">
            <span className="mono text-sm text-destructive">{e.message}</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Cause: </span>
              <span>{e.cause}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Fix: </span>
              <span>{e.fix}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
