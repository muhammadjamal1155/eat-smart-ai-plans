
import AIRecommendations from './AIRecommendations';
import GroceryListGenerator from './GroceryListGenerator';

const InsightsSection = () => {
  return (
    <section
      id="insights"
      className="relative scroll-mt-24 md:scroll-mt-28 py-20 bg-gradient-to-br from-forest-50/80 via-forest-100/70 to-background dark:from-forest-900/60 dark:via-forest-800/50 dark:to-background w-full overflow-x-hidden animate-fade-in"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(111,123,27,0.25),_transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            AI-Powered Insights & Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Smart recommendations and automated grocery planning to optimize your nutrition journey
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <AIRecommendations />
          <GroceryListGenerator />
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
