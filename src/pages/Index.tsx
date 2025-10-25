import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [html, setHtml] = useState('<h1>Привет, мир!</h1>\n<p>Начни создавать свой сайт здесь</p>');
  const [css, setCss] = useState('body {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n  background: #f0f0f0;\n}\n\nh1 {\n  color: #9b87f5;\n}');
  const [js, setJs] = useState('console.log("Сайт загружен!");');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const generatePreview = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  const handlePublish = () => {
    const randomId = Math.random().toString(36).substring(7);
    const publishedUrl = `https://plut.studio/${randomId}`;
    
    toast({
      title: "Сайт опубликован! 🚀",
      description: publishedUrl,
      duration: 5000,
    });

    navigator.clipboard.writeText(publishedUrl);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center gamer-glow">
              <span className="text-primary-foreground font-bold text-sm">PS</span>
            </div>
            <h1 className="text-xl font-bold text-glow hidden md:block">Plut Studio</h1>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-primary/50 hover:border-primary transition-all"
              onClick={() => window.open('https://t.me/plutstudio', '_blank')}
            >
              <Icon name="Send" size={16} />
              Telegram
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 gamer-glow-blue animate-glow-pulse"
              onClick={handlePublish}
            >
              <Icon name="Rocket" size={16} />
              Опубликовать
            </Button>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-card border-border">
              <div className="flex flex-col gap-3 mt-8">
                <Button
                  variant="outline"
                  className="w-full gap-2 justify-start border-primary/50"
                  onClick={() => {
                    window.open('https://t.me/plutstudio', '_blank');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon name="Send" size={16} />
                  Telegram
                </Button>
                <Button
                  className="w-full gap-2 justify-start bg-primary hover:bg-primary/90"
                  onClick={() => {
                    handlePublish();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon name="Rocket" size={16} />
                  Опубликовать
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4 animate-fade-in">
          <div className="bg-card rounded-lg border border-border overflow-hidden gamer-glow">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-muted/30 p-0">
                <TabsTrigger 
                  value="html" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-r border-border transition-all"
                >
                  <Icon name="FileCode" size={16} className="mr-2" />
                  HTML
                </TabsTrigger>
                <TabsTrigger 
                  value="css"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-r border-border transition-all"
                >
                  <Icon name="Palette" size={16} className="mr-2" />
                  CSS
                </TabsTrigger>
                <TabsTrigger 
                  value="js"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none transition-all"
                >
                  <Icon name="Zap" size={16} className="mr-2" />
                  JS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="m-0 p-0">
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-[500px] bg-background text-foreground font-mono text-sm p-4 resize-none focus:outline-none border-0"
                  spellCheck={false}
                />
              </TabsContent>

              <TabsContent value="css" className="m-0 p-0">
                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  className="w-full h-[500px] bg-background text-foreground font-mono text-sm p-4 resize-none focus:outline-none border-0"
                  spellCheck={false}
                />
              </TabsContent>

              <TabsContent value="js" className="m-0 p-0">
                <textarea
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  className="w-full h-[500px] bg-background text-foreground font-mono text-sm p-4 resize-none focus:outline-none border-0"
                  spellCheck={false}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 gamer-glow">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="FolderTree" size={18} className="text-primary" />
              <h3 className="font-semibold">Файловый менеджер</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer transition-all">
                <Icon name="FileCode" size={16} className="text-secondary" />
                <span>index.html</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer transition-all">
                <Icon name="Palette" size={16} className="text-secondary" />
                <span>styles.css</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer transition-all">
                <Icon name="Zap" size={16} className="text-secondary" />
                <span>script.js</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bg-card rounded-lg border border-border overflow-hidden gamer-glow-blue">
            <div className="bg-muted/30 p-3 border-b border-border flex items-center gap-2">
              <Icon name="Eye" size={18} className="text-secondary" />
              <h3 className="font-semibold">Превью</h3>
            </div>
            <div className="bg-white">
              <iframe
                srcDoc={generatePreview()}
                className="w-full h-[600px] border-0"
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
