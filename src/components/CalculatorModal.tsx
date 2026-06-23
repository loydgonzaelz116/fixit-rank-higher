import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  TradeCalculator,
  formatUSD,
  isValidZip,
  regionForZip,
} from "@/lib/calculator-config";

interface Props {
  trade: TradeCalculator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CalculatorModal({ trade, open, onOpenChange }: Props) {
  const [zip, setZip] = useState("");
  const [values, setValues] = useState<Record<string, any>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const zipOk = isValidZip(zip);
  const region = useMemo(() => (zipOk ? regionForZip(zip) : null), [zip, zipOk]);

  const base = useMemo(() => (trade && zipOk ? trade.compute(values) : null), [trade, values, zipOk]);
  const final = useMemo<[number, number] | null>(() => {
    if (!base || !region) return null;
    return [Math.round(base[0] * region.modifier), Math.round(base[1] * region.modifier)];
  }, [base, region]);

  const reset = () => {
    setZip(""); setValues({}); setEmail(""); setName("");
  };

  const handleSave = async () => {
    if (!trade || !final || !base || !region) return;
    setSubmitting(true);
    const { error } = await supabase.from("industry_calculator_leads").insert({
      trade: trade.slug,
      zip_code: zip,
      region_tier: region.tier,
      modifier: region.modifier,
      base_low: base[0],
      base_high: base[1],
      estimate_low: final[0],
      estimate_high: final[1],
      selections: values,
      name: name || null,
      email: email || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send estimate", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Estimate sent", description: "We'll be in touch with next steps." });
    reset();
    onOpenChange(false);
  };

  if (!trade) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{trade.name} Cost Estimator</DialogTitle>
          <DialogDescription>
            Enter your ZIP code and project details for an instant regional estimate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code <span className="text-destructive">*</span></Label>
            <Input
              id="zip"
              inputMode="numeric"
              maxLength={5}
              placeholder="e.g. 99201"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            />
            {zip.length > 0 && !zipOk && (
              <p className="text-xs text-destructive">Enter a valid 5-digit US ZIP.</p>
            )}
            {region && (
              <p className="text-xs text-muted-foreground">{region.label}</p>
            )}
          </div>

          <Separator />

          {!zipOk ? (
            <p className="text-sm text-muted-foreground">Enter a valid ZIP to unlock the calculator.</p>
          ) : (
            <div className="space-y-4">
              {trade.fields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.type === "select" && f.options && (
                    <Select
                      value={values[f.key] ?? ""}
                      onValueChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
                    >
                      <SelectTrigger id={f.key}><SelectValue placeholder="Choose..." /></SelectTrigger>
                      <SelectContent>
                        {f.options.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {f.type === "number" && (
                    <Input
                      id={f.key}
                      type="number"
                      min={f.min}
                      max={f.max}
                      step={f.step ?? 1}
                      placeholder={f.placeholder}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                    />
                  )}
                  {f.type === "toggle" && (
                    <div className="flex items-center gap-3">
                      <Switch
                        id={f.key}
                        checked={!!values[f.key]}
                        onCheckedChange={(c) => setValues((s) => ({ ...s, [f.key]: c }))}
                      />
                      <span className="text-sm text-muted-foreground">Toggle to include</span>
                    </div>
                  )}
                  {f.helper && <p className="text-xs text-muted-foreground">{f.helper}</p>}
                </div>
              ))}
              {trade.note && <p className="text-xs text-muted-foreground">{trade.note}</p>}
            </div>
          )}

          {final && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Estimated range</div>
              <div className="text-3xl font-extrabold text-card-foreground">
                {formatUSD(final[0])} – {formatUSD(final[1])}
              </div>
              <p className="text-xs text-muted-foreground">
                Estimate adjusted for regional labor variables in zip code {zip}.
              </p>
            </div>
          )}

          {final && (
            <>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cname">Name (optional)</Label>
                  <Input id="cname" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cemail">Email (optional)</Label>
                  <Input id="cemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <Button className="w-full" onClick={handleSave} disabled={submitting}>
                {submitting ? "Sending..." : "Send me this estimate"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
