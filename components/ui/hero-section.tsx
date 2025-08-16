export default function HeroSection() {
  return (
    <div className="bg-background relative overflow-hidden rounded-md px-4 py-12 text-center sm:py-16">
      {/* Background gradient */}
      <div className="via-background absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-50/30 dark:from-blue-950/20 dark:to-blue-900/10"></div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-1/4 h-12 w-12 animate-pulse rounded-full bg-blue-200/40 opacity-60 sm:h-16 sm:w-16 dark:bg-blue-500/20"></div>
      <div className="absolute right-1/3 bottom-8 h-8 w-8 animate-pulse rounded-full bg-blue-300/30 opacity-70 delay-300 sm:h-12 sm:w-12 dark:bg-blue-400/15"></div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
          <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
          Always Online & Free
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-[clamp(2rem,5vw,5rem)] leading-tight font-bold tracking-tight">
          <span className="from-foreground bg-gradient-to-r via-blue-600 to-blue-800 bg-clip-text text-transparent dark:via-blue-400 dark:to-blue-300">
            Free Fake JSON
          </span>
          <br className="hidden sm:block" />
          <span className="text-blue-600 dark:text-blue-400">
            Placeholder API
          </span>
        </h1>

        {/* Enhanced description */}
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          A lightning-fast, reliable, and completely free JSON API for testing,
          prototyping, and building your applications.
          <span className="text-foreground mt-2 block font-medium">
            No authentication required • RESTful endpoints • Docs
          </span>
        </p>
      </div>

      {/* Subtle bottom fade (light + dark mode) */}
      <div className="from-background dark:from-background-dark absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t to-transparent"></div>
    </div>
  );
}
