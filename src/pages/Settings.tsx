import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <main className="max-w-4xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8 lg:pt-32 lg:pb-16 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-lg text-muted-foreground">Customise your NutriGuide experience.</p>
        </header>

        <Card className="glass-panel shadow-medium">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose how NutriGuide adapts to light or dark environments.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                >
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
