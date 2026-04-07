"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Upload,
  User,
  MapPin,
  Users,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5;

const SECTIONS: {
  id: Step;
  label: string;
  short: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    id: 1,
    label: "Personal",
    short: "Personal",
    description: "Identity and contact",
    icon: User,
  },
  {
    id: 2,
    label: "Address",
    short: "Address",
    description: "Where you live",
    icon: MapPin,
  },
  {
    id: 3,
    label: "Family",
    short: "Family",
    description: "Emergency contact",
    icon: Users,
  },
  {
    id: 4,
    label: "Bank",
    short: "Bank",
    description: "Payout details",
    icon: Landmark,
  },
  {
    id: 5,
    label: "Social",
    short: "Social",
    description: "Public handles",
    icon: Globe2,
  },
];

export function FormView() {
  const [step, setStep] = useState<Step>(1);
  const isDevMode = process.env.NODE_ENV === "development";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profilePicture: null as string | null,
    aadhaarPan: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    parentName: "",
    parentPhone: "",
    bankAccountName: "",
    accountNumber: "",
    ifscCode: "",
    swiftCode: "",
    linkedPhone: "",
    linkedin: "",
    xHandle: "",
    telegram: "",
    github: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      setStep((step + 1) as Step);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const stepProgressPct = (step / 5) * 100;

  const handleDevQuickFill = () => {
    setFormData({
      fullName: "Vikash Kumar",
      email: "vikash.kumar@example.com",
      phone: "+91 98765 43210",
      profilePicture: null,
      aadhaarPan: "ABCDE1234F",
      address: "12 Palm Residency, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
      parentName: "Rakesh Kumar",
      parentPhone: "+91 99887 77665",
      bankAccountName: "Vikash Kumar",
      accountNumber: "123456789012",
      ifscCode: "HDFC0001234",
      swiftCode: "HDFCINBB",
      linkedPhone: "+91 98765 43210",
      linkedin: "https://linkedin.com/in/vikashkumar",
      xHandle: "https://x.com/vikashkumar",
      telegram: "@vikashkumar",
      github: "https://github.com/vikashkumar",
    });
    setStep(1);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-4.25rem)] w-full flex-col items-center justify-center px-6 py-16 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Check className="h-8 w-8" />
            </div>
          </div>
          <h2 className="mb-3 font-serif text-3xl leading-tight text-foreground md:text-4xl">
            Onboarding complete
          </h2>
          <p className="mb-8 text-muted-foreground">
            Your details were submitted. HR may reach out if anything else is needed.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
            }}
            size="lg"
            className="rounded-xl"
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const current = SECTIONS.find((s) => s.id === step)!;

  return (
    <div className="flex min-h-[calc(100vh-4.25rem)] w-full flex-col lg:flex-row">
      {/* Sidebar — desktop */}
      <aside className="hidden shrink-0 border-b border-border/90 bg-muted/20 lg:w-64 lg:border-b-0 lg:border-r xl:w-72">
        <div className="sticky top-19 space-y-8 p-6 lg:max-h-[calc(100vh-4.75rem)] lg:overflow-y-auto lg:py-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Candidate onboarding
            </p>
            <h2 className="mt-1 font-serif text-2xl leading-tight text-foreground/95">
              Your workspace
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Complete each section. You can move between sections anytime.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Overall progress</span>
              <span className="font-medium tabular-nums text-foreground">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted/80">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          <nav className="space-y-1" aria-label="Onboarding sections">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = step === s.id;
              const done = step > s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    active
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/90"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold",
                      active && "border-primary/25 bg-primary/8 text-primary",
                      done && !active && "border-border bg-muted/50 text-muted-foreground",
                      !active && !done && "border-border bg-background/50"
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{s.label}</span>
                    <span className="block text-xs text-muted-foreground">{s.description}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile section switcher */}
        <div className="sticky top-17 z-10 -mx-px border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 lg:hidden">
          <div className="flex gap-1 overflow-x-auto p-3 scrollbar-none">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  step === s.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                {s.short}
              </button>
            ))}
          </div>
          <div className="h-0.5 bg-muted">
            <div
              className="h-full bg-primary/80 transition-all duration-300"
              style={{ width: `${stepProgressPct}%` }}
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 lg:max-w-none lg:px-10 lg:py-10 xl:px-14">
          <header className="mb-8 border-b border-border/80 pb-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Section {step} of 5
              </p>
              {isDevMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDevQuickFill}
                  className="h-8 cursor-pointer rounded-lg border-dashed text-xs font-semibold"
                >
                  Quick fill (dev)
                </Button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <h1 className="font-serif text-3xl tracking-tight text-foreground/95 md:text-4xl">
                {current.label}
              </h1>
              <span className="pb-1 text-sm text-muted-foreground">{current.description}</span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This is your main onboarding workspace. Information here is used by HR and payroll—keep it accurate and up to date.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-7 rounded-2xl border border-border/70 bg-card/70 p-5 sm:p-7 md:grid-cols-2">
              {step === 1 && (
                <>
                  <div className="md:col-span-2 flex flex-col gap-4 rounded-xl border border-border/80 bg-muted/20 p-5 sm:flex-row sm:items-center sm:gap-6">
                    <div className="relative shrink-0">
                      <div className="group relative h-20 w-20 overflow-hidden rounded-full border border-border bg-background">
                        {formData.profilePicture ? (
                          <Image
                            src={formData.profilePicture}
                            alt=""
                            width={80}
                            height={80}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Upload className="h-6 w-6 transition-colors group-hover:text-primary" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 cursor-pointer opacity-0"
                          aria-label="Upload profile photo"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">Profile photo</h3>
                      <p className="text-xs text-muted-foreground">JPG or PNG, max 2MB.</p>
                    </div>
                  </div>

                  <FormGroup
                    label="Full name"
                    placeholder="e.g. Jane Cooper"
                    value={formData.fullName}
                    onChange={(v) => setFormData({ ...formData, fullName: v })}
                  />
                  <FormGroup
                    label="Email"
                    type="email"
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(v) => setFormData({ ...formData, email: v })}
                  />
                  <FormGroup
                    label="Phone"
                    placeholder="+91 99999 00000"
                    value={formData.phone}
                    onChange={(v) => setFormData({ ...formData, phone: v })}
                  />
                  <FormGroup
                    label="Aadhaar / PAN"
                    placeholder="As on document"
                    value={formData.aadhaarPan}
                    onChange={(v) => setFormData({ ...formData, aadhaarPan: v })}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <div className="md:col-span-2">
                    <FormGroup
                      label="Full address"
                      placeholder="Apartment, street, locality"
                      value={formData.address}
                      onChange={(v) => setFormData({ ...formData, address: v })}
                    />
                  </div>
                  <FormGroup
                    label="City"
                    placeholder="City"
                    value={formData.city}
                    onChange={(v) => setFormData({ ...formData, city: v })}
                  />
                  <FormGroup
                    label="State"
                    placeholder="State"
                    value={formData.state}
                    onChange={(v) => setFormData({ ...formData, state: v })}
                  />
                  <FormGroup
                    label="ZIP / PIN"
                    placeholder="000000"
                    value={formData.zipCode}
                    onChange={(v) => setFormData({ ...formData, zipCode: v })}
                  />
                  <FormGroup
                    label="Country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(v) => setFormData({ ...formData, country: v })}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <FormGroup
                    label="Parent / guardian name"
                    placeholder="Full name"
                    value={formData.parentName}
                    onChange={(v) => setFormData({ ...formData, parentName: v })}
                  />
                  <FormGroup
                    label="Parent / guardian phone"
                    placeholder="+91 99999 00000"
                    value={formData.parentPhone}
                    onChange={(v) => setFormData({ ...formData, parentPhone: v })}
                  />
                </>
              )}

              {step === 4 && (
                <>
                  <div className="md:col-span-2">
                    <FormGroup
                      label="Name as per bank"
                      placeholder="As on passbook or cheque"
                      value={formData.bankAccountName}
                      onChange={(v) => setFormData({ ...formData, bankAccountName: v })}
                    />
                  </div>
                  <FormGroup
                    label="Account number"
                    placeholder="Account number"
                    value={formData.accountNumber}
                    onChange={(v) => setFormData({ ...formData, accountNumber: v })}
                  />
                  <FormGroup
                    label="IFSC"
                    placeholder="IFSC code"
                    value={formData.ifscCode}
                    onChange={(v) => setFormData({ ...formData, ifscCode: v })}
                  />
                  <FormGroup
                    label="SWIFT (if applicable)"
                    placeholder="SWIFT code"
                    value={formData.swiftCode}
                    onChange={(v) => setFormData({ ...formData, swiftCode: v })}
                  />
                  <FormGroup
                    label="Bank-linked phone"
                    placeholder="+91 99999 00000"
                    value={formData.linkedPhone}
                    onChange={(v) => setFormData({ ...formData, linkedPhone: v })}
                  />
                </>
              )}

              {step === 5 && (
                <>
                  <FormGroup
                    label="Telegram (required)"
                    placeholder="@username or phone"
                    value={formData.telegram}
                    onChange={(v) => setFormData({ ...formData, telegram: v })}
                    required
                  />
                  <FormGroup
                    label="LinkedIn (optional)"
                    placeholder="linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={(v) => setFormData({ ...formData, linkedin: v })}
                    required={false}
                  />
                  <FormGroup
                    label="X / Twitter (optional)"
                    placeholder="x.com/username"
                    value={formData.xHandle}
                    onChange={(v) => setFormData({ ...formData, xHandle: v })}
                    required={false}
                  />
                  <div className="md:col-span-2">
                    <FormGroup
                      label="GitHub (optional)"
                      placeholder="github.com/username"
                      value={formData.github}
                      onChange={(v) => setFormData({ ...formData, github: v })}
                      required={false}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="gap-1 cursor-pointer font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous section
                  </Button>
                )}
              </div>
              <Button type="submit" size="lg" className="gap-2 cursor-pointer rounded-xl sm:min-w-[200px]">
                {step === 5 ? "Submit onboarding" : "Save & continue"}
                {step < 5 && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormGroup({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      <Label className="pl-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <Input
        required={required}
        type={type}
        placeholder={placeholder}
        className="h-11 rounded-lg border-input bg-background px-3 text-sm font-medium shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring/35 md:h-12 md:rounded-xl md:px-4"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
