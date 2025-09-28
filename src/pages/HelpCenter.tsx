import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const HelpCenter = () => {
  const faqs = [
    {
      question: "What is NutriGuide AI?",
      answer: "NutriGuide AI is a personalized nutrition platform that uses artificial intelligence to create meal plans and provide recommendations based on your unique health goals, dietary preferences, and lifestyle."
    },
    {
      question: "How does the AI work?",
      answer: "Our AI analyzes your health data, including age, weight, height, activity level, and health goals. It then cross-references this information with a vast database of nutritional information and scientific research to generate a plan that is optimized for you."
    },
    {
      question: "Is my data safe?",
      answer: "Yes, we take data privacy and security very seriously. All your personal information is encrypted and stored securely. We will never share your data with third parties without your consent. For more details, please see our Privacy Policy."
    },
    {
      question: "Can I customize my meal plan?",
      answer: "Absolutely! You can customize your meal plan by swapping meals, excluding ingredients, and adjusting your dietary preferences at any time. Our AI will learn from your choices and adapt future recommendations accordingly."
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 md:mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold">Help Center</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Find answers to frequently asked questions.
              </p>
            </header>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-12">
              <p className="text-muted-foreground">
                Can't find the answer you're looking for?{' '}
                <a href="/contact" className="text-primary hover:underline">
                  Contact our support team
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;