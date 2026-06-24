"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export type FlowType = "vendor" | "buyer";

type FormValues = {
  name: string;
  business: string;
  location: string;
  phone: string;
};

type StepConfig = {
  field: keyof FormValues;
  question: string;
  placeholder: string;
  helper?: string;
  type?: string;
};

const vendorSteps: StepConfig[] = [
  {
    field: "name",
    question: "What's your name?",
    placeholder: "Your full name"
  },
  {
    field: "business",
    question: "What kind of food or edible supply business do you run?",
    placeholder: "e.g. Bakery, Pharmacy, Suya spot, Supermarket...",
    helper: "Be specific — it helps us match you with the right buyers."
  },
  {
    field: "phone",
    question: "What's your WhatsApp number?",
    placeholder: "080XXXXXXXX",
    type: "tel"
  },
  {
    field: "location",
    question: "What city or area are you in?",
    placeholder: "e.g. Lagos, Abuja, Port Harcourt, Calabar...",
    helper: "We'll notify buyers in your area."
  }
];

const buyerSteps: StepConfig[] = [
  {
    field: "name",
    question: "What's your first name?",
    placeholder: "Your name"
  },
  {
    field: "location",
    question: "What city or area are you in?",
    placeholder: "e.g. Lagos, Abuja, Port Harcourt, Calabar...",
    helper: "We'll notify you when vendors in your area go live."
  },
  {
    field: "phone",
    question: "What's your WhatsApp number?",
    placeholder: "080XXXXXXXX",
    type: "tel"
  }
];

export function WaitlistModal({
  flow,
  onClose
}: {
  flow: FlowType;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [direction, setDirection] = useState(1);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const isVendor = flow === "vendor";
  const steps = isVendor ? vendorSteps : buyerSteps;
  const accent = isVendor ? "green" : "orange";
  const accentText = isVendor ? "text-surplus-green" : "text-surplus-orange";
  const accentBg = isVendor ? "bg-surplus-green" : "bg-surplus-orange";
  const accentHover = isVendor ? "hover:bg-[#23663F]" : "hover:bg-surplus-orange-dim";
  const telegramUrl = isVendor
    ? process.env.NEXT_PUBLIC_TELEGRAM_VENDOR_URL
    : process.env.NEXT_PUBLIC_TELEGRAM_BUYER_URL;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { name: "", business: "", location: "", phone: "" }
  });

  const current = steps[step];
  const currentValue = watch(current.field);
  const isCurrentValid = currentValue?.trim().length >= 2;
  const isLastStep = step === steps.length - 1;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const slideVariants: Variants = useMemo(
    () => ({
      enter: (customDirection: number) => ({
        x: reduceMotion ? 0 : customDirection * 48,
        opacity: 0
      }),
      center: { x: 0, opacity: 1 },
      exit: (customDirection: number) => ({
        x: reduceMotion ? 0 : customDirection * -48,
        opacity: 0
      })
    }),
    [reduceMotion]
  );

  const goNext = async () => {
    const valid = await trigger(current.field);
    if (!valid) return;
    setApiError(false);
    setDirection(1);
    setStep((value) => Math.min(value + 1, steps.length - 1));
  };

  const goBack = () => {
    setApiError(false);
    setDirection(-1);
    setStep((value) => Math.max(value - 1, 0));
  };

  const submit = handleSubmit(async (values) => {
    setApiError(false);
    const payload = isVendor
      ? {
          name: values.name,
          business: values.business,
          phone: values.phone,
          type: "vendor",
          timestamp: new Date().toISOString()
        }
      : {
          name: values.name,
          location: values.location,
          phone: values.phone,
          type: "buyer",
          timestamp: new Date().toISOString()
        };

    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setApiError(true);
      return;
    }

    const result = (await response.json()) as { success?: boolean };
    if (!result.success) {
      setApiError(true);
      return;
    }

    setSuccess(true);
  });

  const continueToTelegram = () => {
    if (telegramUrl) {
      window.open(telegramUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex h-dvh items-stretch justify-center md:items-center md:p-6"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--surplus-black) 95%, transparent)"
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isVendor ? "Vendor waitlist form" : "Buyer waitlist form"}
    >
      <motion.div
        ref={modalRef}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
        className="relative flex h-dvh w-full flex-col bg-surplus-black px-6 py-5 md:h-auto md:max-h-[92dvh] md:max-w-[480px] md:rounded-2xl md:border md:border-surplus-line md:bg-surplus-grey md:p-8 md:shadow-card"
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close waitlist form"
          onClick={onClose}
          className="absolute right-5 top-5 flex min-h-12 min-w-12 items-center justify-center text-2xl font-light text-white"
        >
          ×
        </button>

        {!success && step > 0 ? (
          <button
            type="button"
            aria-label="Go back"
            onClick={goBack}
            className="absolute left-5 top-5 flex min-h-12 min-w-12 items-center justify-center text-2xl text-white"
          >
            ←
          </button>
        ) : null}

        <div className="flex flex-1 flex-col justify-center pt-14">
          {success ? (
            <SuccessScreen
              flow={flow}
              accent={accent}
              onContinue={continueToTelegram}
              reduceMotion={Boolean(reduceMotion)}
            />
          ) : (
            <form onSubmit={submit} className="flex min-h-[520px] flex-col justify-center">
              <div className="mb-10 text-center">
                <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${accentText}`}>
                  {isVendor ? "VENDOR WAITLIST" : "BUYER WAITLIST"}
                </p>
                <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
                  {steps.map((item, index) => (
                    <span
                      key={item.field}
                      className={[
                        "h-2.5 w-2.5 rounded-full",
                        index <= step ? accentBg : "bg-surplus-line"
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.field}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                >
                  <label
                    htmlFor={current.field}
                    className="block font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-surplus-white"
                  >
                    {current.question}
                  </label>
                  <div className="relative mt-7">
                    {current.type === "tel" ? (
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-surplus-white">
                        🇳🇬 +234
                      </span>
                    ) : null}
                    <input
                      id={current.field}
                      type={current.type ?? "text"}
                      aria-label={current.question}
                      placeholder={current.placeholder}
                      autoComplete={current.type === "tel" ? "tel" : "off"}
                      className={[
                        "min-h-12 w-full rounded-lg border border-surplus-line bg-surplus-grey px-4 text-base text-surplus-white placeholder:text-surplus-grey-text md:bg-surplus-black",
                        current.type === "tel" ? "pl-24" : ""
                      ].join(" ")}
                      {...register(current.field, {
                        required: true,
                        minLength: current.type === "tel" ? 8 : 2
                      })}
                    />
                  </div>
                  {current.helper ? (
                    <p className="mt-3 text-sm leading-6 text-surplus-grey-text">
                      {current.helper}
                    </p>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              <button
                type={isLastStep ? "submit" : "button"}
                onClick={isLastStep ? undefined : goNext}
                disabled={!isCurrentValid || isSubmitting}
                className={[
                  "mt-9 inline-flex min-h-12 w-fit items-center justify-start font-medium text-white transition-colors disabled:cursor-not-allowed disabled:text-surplus-grey-text",
                  isVendor
                    ? "hover:text-surplus-green"
                    : "hover:text-surplus-orange"
                ].join(" ")}
              >
                {isSubmitting ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : isLastStep ? (
                  "Submit →"
                ) : (
                  "Next →"
                )}
              </button>

              {apiError ? (
                <p className="mt-4 text-center text-sm text-surplus-orange">
                  Something went wrong. Please try again.
                </p>
              ) : null}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SuccessScreen({
  flow,
  accent,
  onContinue,
  reduceMotion
}: {
  flow: FlowType;
  accent: "green" | "orange";
  onContinue: () => void;
  reduceMotion: boolean;
}) {
  const isVendor = flow === "vendor";
  const stroke = accent === "green" ? "#2A7A4B" : "#F4622A";
  const hoverClass =
    accent === "green" ? "hover:text-surplus-green" : "hover:text-surplus-orange";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      className="text-center"
    >
      <svg
        className="mx-auto h-16 w-16"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="29" stroke={stroke} strokeWidth="2" />
        <motion.path
          d="M20 33.5L28 41L45 23"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={reduceMotion ? undefined : { pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        />
      </svg>

      <h2 className="mt-8 font-display text-3xl font-bold leading-tight tracking-[-0.03em]">
        {isVendor ? "You're on the vendor list." : "You're on the list."}
      </h2>
      <p className="mx-auto mt-4 max-w-sm whitespace-pre-line text-[15px] leading-7 text-surplus-grey-text">
        {isVendor
          ? "We'll reach out before July launch with your\nearly access details and onboarding gift."
          : "We'll notify you the moment Surplus goes live\nin your area with your launch gift ready."}
      </p>

      <div className="my-8 h-px bg-surplus-line" />

      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-surplus-grey-text">
        {isVendor ? "JOIN THE VENDOR COMMUNITY" : "JOIN THE SURPLUS COMMUNITY"}
      </p>
      <p className="mx-auto mt-4 max-w-sm whitespace-pre-line text-sm leading-6 text-white">
        {isVendor
          ? "Connect with other food vendors on Surplus.\nGet updates, tips, and be first to go live."
          : "Get early deal alerts, launch updates, and your\ngift from the Surplus team when we go live in July."}
      </p>
      <p className="mx-auto mt-5 max-w-sm whitespace-pre-line text-xs leading-5 text-surplus-grey-text">
        {isVendor
          ? "You are about to be redirected to the Surplus Vendors\nTelegram channel, a private group for listed vendors only."
          : "You are about to be redirected to the Surplus\nTelegram channel so you will be amongst the first\nto know and receive your gift when we launch in July."}
      </p>

      <button
        type="button"
        onClick={onContinue}
        className={`mt-7 min-h-12 font-medium text-white transition-colors ${hoverClass}`}
      >
        Continue →
      </button>
    </motion.div>
  );
}
