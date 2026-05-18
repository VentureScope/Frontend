type WizardStepIntroProps = {
  title: string;
  description?: string;
};

export function WizardStepIntro({ title, description }: WizardStepIntroProps) {
  return (
    <div className="mb-6 space-y-2">
      <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
      {description && (
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
