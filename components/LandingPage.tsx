"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { WaitlistModal, type FlowType } from "@/components/WaitlistModal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const vendorSteps = [
  [
    "01",
    "List in Seconds",
    "Upload surplus or near-expiry (spoilage) products, set your discount, and publish in under a minute."
  ],
  [
    "02",
    "Reach Nearby Buyers Instantly",
    "Nearby buyers see your listing instantly and order before the clock runs out."
  ],
  [
    "03",
    "Recover Lost Revenue",
    "Sell before spoilage, reduce waste, and earn from stock that would otherwise be discarded."
  ]
];

const buyerSteps = [
  [
    "01",
    "Discover Deals Nearby",
    "Browse discounted food and edible products from trusted vendors around you."
  ],
  [
    "02",
    "Grab Them Before They're Gone",
    "Every listing is time-sensitive. The best deals move fast."
  ],
  [
    "03",
    "Save More Every Day",
    "Buy quality products at significantly reduced prices simply because you're buying at the right time."
  ]
];

export function LandingPage() {
  const [flow, setFlow] = useState<FlowType | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();

  const openFlow = (nextFlow: FlowType, trigger: HTMLButtonElement | null) => {
    lastTriggerRef.current = trigger;
    setFlow(nextFlow);
  };

  const closeFlow = () => {
    setFlow(null);
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };

  const wordAnimation = reduceMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: false, amount: 0.45 },
        variants: {
          visible: {
            transition: { staggerChildren: 0.12 }
          }
        }
      };

  return (
    <main className="min-h-dvh bg-surplus-black text-surplus-white">
      <section
        className="relative flex min-h-dvh flex-col overflow-hidden bg-cover bg-center px-6 pb-16 pt-5 md:px-10 lg:px-16"
        style={{ backgroundImage: "url('/hero-market.jpg')" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--surplus-black) 90%, transparent)"
          }}
          aria-hidden="true"
        />
        <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center">
          <div className="font-display text-xl font-bold tracking-[-0.03em] md:text-2xl">
            Surplus
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center py-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 inline-flex w-fit rounded-full border border-surplus-orange px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-surplus-orange"
          >
            Sell before e waste, Recover profits.
          </motion.div>

          <motion.h1
            {...wordAnimation}
            className="max-w-5xl font-display text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em] md:text-6xl lg:text-7xl"
          >
            <motion.span variants={fadeUp} className="inline-block">
              Good
            </motion.span>{" "}
            <motion.span variants={fadeUp} className="inline-block">
              Food
            </motion.span>{" "}
            <motion.span variants={fadeUp} className="inline-block">
              Shouldn&apos;t
            </motion.span>{" "}
            <motion.span variants={fadeUp} className="inline-block">
              Go
            </motion.span>{" "}
            <motion.span variants={fadeUp} className="inline-block">
              to
            </motion.span>{" "}
            <motion.span
              variants={fadeUp}
              transition={{ delay: 0.2 }}
              className="inline-block text-surplus-grey-text line-through decoration-surplus-grey-text decoration-2"
            >
              Waste
            </motion.span>{" "}
            <motion.span variants={fadeUp} className="inline-block">
              but
            </motion.span>{" "}
            <motion.span
              variants={fadeUp}
              transition={{ delay: 0.2 }}
              className="inline-block text-surplus-orange"
            >
              Sold.
            </motion.span>
          </motion.h1>

          <p
            className="mt-6 max-w-3xl text-base leading-7 md:text-xl md:leading-8"
            style={{
              color:
                "color-mix(in srgb, var(--surplus-white) 85%, transparent)"
            }}
          >
            Surplus helps vendors turn near-expiry or spoilage items
            into revenue by connecting them with nearby buyers looking for great
            deals before time runs out.
          </p>

          <a
            href="#how-it-works"
            className="mt-9 inline-flex min-h-12 w-fit items-center font-medium text-surplus-white transition-colors hover:text-surplus-orange"
          >
            How it Works →
          </a>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-5xl border-l-4 border-surplus-orange pl-6 md:pl-8">
          <p className="font-display text-2xl font-semibold leading-snug tracking-[-0.03em] text-surplus-white md:text-4xl md:leading-tight">
            “40% of food & edible supplies in Nigeria are wasted. Not because
            people aren&apos;t hungry, but because the right buyers never find it
            in time.”
          </p>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <StepGroup
            accent="green"
            label="For Vendors"
            heading="Turn Excess Stock Into Revenue"
            steps={vendorSteps}
          />
          <StepGroup
            accent="orange"
            label="For Buyers"
            heading="Access Quality Products for Less"
            steps={buyerSteps}
          />
        </div>
      </section>

      <section className="px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-surplus-grey-text">
            Built For
          </p>
          <p className="mt-6 max-w-5xl text-[15px] leading-[1.8] text-surplus-white md:text-base">
            Restaurants • Bakeries • Supermarkets • Pharmacies • Caterers • Food
            Vendors Cold Rooms • Farm Produce Sellers • Suya Spots • Bole Stands
            • Shawarma Spots Street Food • Pastry Shops • Tigernut & Zobo
            Vendors • And More
          </p>
          <p className="mt-7 max-w-3xl text-sm leading-7 text-surplus-grey-text">
            If you sell food, beverages, groceries, pharmaceuticals, or edible
            supplies and occasionally deal with excess inventory — Surplus was
            built for you.
          </p>
        </div>
      </section>

      <section className="bg-surplus-grey px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-surplus-white md:text-5xl">
            Join Before We Launch
          </h2>
          <p className="mt-5 text-base leading-7 text-surplus-grey-text md:text-lg">
            Launching July 2026.
            <br />
            Early waitlist members receive:
          </p>
          <div className="mt-8 space-y-5 text-base font-medium text-surplus-white md:text-lg">
            <p>
              <span className="text-surplus-orange">✓</span> 6 Months Free
              Vendor Subscription
            </p>
            <p>
              <span className="text-surplus-orange">✓</span> Exclusive Early
              Access
            </p>
            <p>
              <span className="text-surplus-orange">✓</span> Additional 25%
              Discount on Buyer Purchase
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          <FinalCard
            flow="vendor"
            label="Vendors"
            accent="green"
            title="Stop Losing Stock. Start Recovering Revenue."
            body="Transform surplus and near-expiry inventory into sales before it becomes waste."
            button="Join as a Vendor →"
            openFlow={openFlow}
          />
          <FinalCard
            flow="buyer"
            label="Buyers"
            accent="green"
            title="More Value. Less Spending."
            body="Discover last-minute deals on food and everyday essentials from vendors near you."
            button="Join as a Buyer →"
            openFlow={openFlow}
          />
        </div>
        <p className="mt-8 text-center text-sm text-surplus-grey-text">
          424 vendors and buyers already on the waitlist.
        </p>
      </section>

      <footer className="px-6 pb-10 text-center text-sm text-surplus-white">
        © 2026 Surplus · Food shouldn&apos;t go to waste · Built with ❤️ in Nigeria
      </footer>

      {flow ? <WaitlistModal flow={flow} onClose={closeFlow} /> : null}
    </main>
  );
}

function StepGroup({
  accent,
  label,
  heading,
  steps
}: {
  accent: "green" | "orange";
  label: string;
  heading: string;
  steps: string[][];
}) {
  const reduceMotion = useReducedMotion();
  const accentClass =
    accent === "green" ? "text-surplus-green" : "text-surplus-orange";

  return (
    <div>
      <p
        className={`mb-4 font-mono text-[11px] uppercase tracking-[0.16em] ${accentClass}`}
      >
        {label}
      </p>
      <h2 className="mb-6 font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-surplus-white md:text-4xl">
        {heading}
      </h2>
      <div className="space-y-4">
        {steps.map(([number, title, body], index) => (
          <motion.article
            key={title}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="rounded-lg border border-surplus-green bg-surplus-grey p-6 shadow-card"
          >
            <p className={`font-mono text-xs ${accentClass}`}>{number}</p>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.03em]">
              {title}
            </h3>
            <p className="mt-3 text-[15px] leading-7 text-surplus-grey-text">
              {body}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function FinalCard({
  flow,
  label,
  accent,
  title,
  body,
  button,
  openFlow
}: {
  flow: FlowType;
  label: string;
  accent: "green" | "orange";
  title: string;
  body: string;
  button: string;
  openFlow: (flow: FlowType, trigger: HTMLButtonElement | null) => void;
}) {
  const color =
    accent === "green"
      ? {
          label: "text-surplus-green",
          border: "border-surplus-green",
          button: "bg-surplus-orange-dim hover:bg-[#23663F]"
        }
      : {
          label: "text-surplus-orange",
          border: "border-surplus-orange",
          button: "bg-surplus-orange hover:bg-surplus-orange-dim"
        };

  return (
    <article
      className={`rounded-lg border ${color.border} bg-surplus-grey p-6 shadow-card md:p-8`}
    >
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.16em] ${color.label}`}
      >
        {label}
      </p>
      <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-[-0.03em]">
        {title}
      </h2>
      <p className="mt-5 min-h-[84px] text-[15px] leading-7 text-surplus-grey-text">
        {body}
      </p>
      <button
        type="button"
        onClick={(event) => openFlow(flow, event.currentTarget)}
        className={`mt-7 min-h-12 w-full rounded-full px-6 font-medium text-white transition-colors ${color.button}`}
      >
        {button}
      </button>
    </article>
  );
}
