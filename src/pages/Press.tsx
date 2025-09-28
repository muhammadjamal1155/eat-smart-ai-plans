import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Press = () => {
  const pressReleases = [
    {
      date: "October 26, 2025",
      title: "NutriGuide AI Launches Personalized Nutrition Platform to Combat Chronic Disease",
      outlet: "TechCrunch",
    },
    {
      date: "October 28, 2025",
      title: "The Future of Food is AI: A Look Inside NutriGuide's Groundbreaking Technology",
      outlet: "WIRED",
    },
    {
      date: "November 5, 2025",
      title: "NutriGuide AI Secures $15M in Series A Funding to Expand its AI-Powered Nutrition Coaching",
      outlet: "Forbes",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 md:mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold">Press & Media</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Read the latest news and announcements from NutriGuide AI.
              </p>
            </header>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">In the News</h2>
              <div className="space-y-4">
                {pressReleases.map((release, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{release.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        <span className="font-semibold">{release.outlet}</span> - {release.date}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">For press inquiries, please contact us at <a href="mailto:press@nutriguide.ai" className="text-primary hover:underline">press@nutriguide.ai</a>.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Press;