type PageIntroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export function PageIntro({ eyebrow, title, subtitle }: PageIntroProps) {
  return (
    <header className="rounded-2xl border border-[#cfd9e8] bg-white p-5 md:p-6">
      <p className="text-xs font-semibold tracking-[0.14em] text-[#5f6f84]">{eyebrow}</p>
      <h1 className="font-heading mt-2 text-3xl leading-tight text-[#11294a] md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-[#5f6f84] md:text-base">{subtitle}</p>
    </header>
  );
}
