import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Careers = () => {
  const jobOpenings = [
    {
      title: "Senior Frontend Engineer",
      location: "Remote",
      department: "Engineering",
    },
    {
      title: "AI/ML Research Scientist",
      location: "San Francisco, CA",
      department: "Research",
    },
    {
      title: "Product Manager, Mobile",
      location: "Remote",
      department: "Product",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 md:mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold">Join Our Mission</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                We're looking for passionate people to help us revolutionize the future of nutrition.
              </p>
            </header>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Current Openings</h2>
              {jobOpenings.length > 0 ? (
                <div className="space-y-4">
                  {jobOpenings.map((job, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-between items-center">
                        <div>
                          <p className="text-muted-foreground">{job.location}</p>
                          <p className="text-sm text-muted-foreground">{job.department}</p>
                        </div>
                        <Button>Apply Now</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>There are no open positions at this time. Please check back later.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;