
import AIRecommendations from './AIRecommendations';
import GroceryListGenerator from './GroceryListGenerator';

const InsightsSection = () => {
  return (
    <section id="insights" className="scroll-mt-24 md:scroll-mt-28 py-20 bg-gray-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            AI-Powered Insights & Tools
          </h2>
          <p className="text-xl text-gray-600">
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
