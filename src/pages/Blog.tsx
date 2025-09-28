import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Blog = () => {
  const blogPosts = [
    {
      title: "The Top 5 AI-Powered Nutrition Trends to Watch in 2026",
      author: "Dr. Jane Doe",
      date: "November 10, 2025",
      tags: ["AI", "Nutrition", "Trends"],
      excerpt: "Artificial intelligence is reshaping the nutrition landscape. Here are the top 5 trends you need to know about for the coming year.",
      image: "/placeholder.svg",
    },
    {
      title: "Debunking Common Nutrition Myths with Science",
      author: "John Smith, RD",
      date: "November 3, 2025",
      tags: ["Myth-busting", "Science", "Health"],
      excerpt: "From 'carbs are bad' to 'you need to detox,' we're tackling the most persistent nutrition myths with cold, hard science.",
      image: "/placeholder.svg",
    },
    {
      title: "A Day in the Life: How Our AI Crafts Your Perfect Meal Plan",
      author: "The NutriGuide AI Team",
      date: "October 27, 2025",
      tags: ["Behind the Scenes", "AI", "Meal Planning"],
      excerpt: "Ever wondered how our AI creates a personalized meal plan just for you? We're pulling back the curtain to show you the magic.",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 md:mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold">The NutriGuide AI Blog</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Your source for the latest in nutrition science, AI technology, and healthy living.
              </p>
            </header>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <Card key={index} className="overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <div className="flex gap-2 pt-2">
                      {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="text-sm text-muted-foreground">
                      <span>By {post.author}</span> &bull; <span>{post.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;