import { Button } from "@/components/ui/Button";

export default function ResearchNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-7xl font-black text-brand-primary">404</h1>
        <h2 className="text-3xl font-bold">Research Not Found</h2>
        <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
          The research document you are looking for could not be located. Please
          browse the research archive below.
        </p>
        <Button href="/research" size="lg">
          Browse Research
        </Button>
      </div>
    </div>
  );
}
