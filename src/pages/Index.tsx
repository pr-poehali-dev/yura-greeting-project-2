import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import VisualBuilder from '@/components/VisualBuilder';

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plut Studio Devs | Site Default</title>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 Plut Studio Devs</h1>
            <p class="subtitle">Создаём сайты будущего</p>
        </header>
        
        <main>
            <div class="card">
                <h2>Добро пожаловать!</h2>
                <p>Начни создавать свой сайт прямо сейчас. Редактируй HTML, CSS и JavaScript в реальном времени.</p>
            </div>
            
            <div class="features">
                <div class="feature">
                    <span class="icon">💻</span>
                    <h3>HTML</h3>
                    <p>Структура</p>
                </div>
                <div class="feature">
                    <span class="icon">🎨</span>
                    <h3>CSS</h3>
                    <p>Стили</p>
                </div>
                <div class="feature">
                    <span class="icon">⚡</span>
                    <h3>JavaScript</h3>
                    <p>Интерактив</p>
                </div>
            </div>
        </main>
        
        <footer>
            <p>Site Default Template • Plut Studio Devs</p>
        </footer>
    </div>
</body>
</html>`;

const DEFAULT_CSS = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Rubik', -apple-system, sans-serif;
    background: linear-gradient(135deg, #1a1f2c 0%, #2d1b4e 100%);
    color: #fff;
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

header {
    text-align: center;
    padding: 60px 20px;
    animation: fadeIn 1s ease-out;
}

h1 {
    font-size: 3rem;
    background: linear-gradient(135deg, #9b87f5 0%, #0ea5e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
    text-shadow: 0 0 30px rgba(155, 135, 245, 0.5);
}

.subtitle {
    font-size: 1.2rem;
    color: #a0aec0;
}

.card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(155, 135, 245, 0.3);
    border-radius: 16px;
    padding: 40px;
    margin: 40px 0;
    box-shadow: 0 0 30px rgba(155, 135, 245, 0.2);
    animation: slideUp 0.8s ease-out;
}

.card h2 {
    color: #9b87f5;
    margin-bottom: 15px;
    font-size: 2rem;
}

.card p {
    color: #cbd5e0;
    line-height: 1.6;
    font-size: 1.1rem;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 40px 0;
}

.feature {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(14, 165, 233, 0.3);
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    transition: all 0.3s ease;
    animation: fadeIn 1s ease-out;
}

.feature:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 25px rgba(14, 165, 233, 0.4);
    border-color: #0ea5e9;
}

.icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 15px;
}

.feature h3 {
    color: #0ea5e9;
    margin-bottom: 10px;
}

.feature p {
    color: #a0aec0;
}

footer {
    text-align: center;
    padding: 40px 20px;
    color: #718096;
    border-top: 1px solid rgba(155, 135, 245, 0.2);
    margin-top: 60px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    h1 {
        font-size: 2rem;
    }
    
    .card {
        padding: 25px;
    }
    
    .features {
        grid-template-columns: 1fr;
    }
}`;

const DEFAULT_JS = `console.log('🚀 Plut Studio Devs - Site загружен!');

document.addEventListener('DOMContentLoaded', () => {
    const features = document.querySelectorAll('.feature');
    
    features.forEach((feature, index) => {
        feature.style.animationDelay = \`\${index * 0.2}s\`;
    });
    
    console.log('✨ Интерактивные элементы активированы');
});`;

export default function Index() {
  const [html, setHtml] = useState(() => localStorage.getItem('plut-html') || DEFAULT_HTML);
  const [css, setCss] = useState(() => localStorage.getItem('plut-css') || DEFAULT_CSS);
  const [js, setJs] = useState(() => localStorage.getItem('plut-js') || DEFAULT_JS);
  const [favicon, setFavicon] = useState(() => localStorage.getItem('plut-favicon') || '');
  const [backgroundColor, setBackgroundColor] = useState(() => localStorage.getItem('plut-bg-color') || '#1a1f2c');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'builder'>('code');
  const { toast } = useToast();
  
  const htmlInputRef = useRef<HTMLInputElement>(null);
  const cssInputRef = useRef<HTMLInputElement>(null);
  const jsInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('plut-html', html);
    localStorage.setItem('plut-css', css);
    localStorage.setItem('plut-js', js);
    localStorage.setItem('plut-favicon', favicon);
    localStorage.setItem('plut-bg-color', backgroundColor);
  }, [html, css, js, favicon, backgroundColor]);

  useEffect(() => {
    if (favicon) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [favicon]);

  const generatePreview = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          ${favicon ? `<link rel="icon" type="image/x-icon" href="${favicon}">` : ''}
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

  const handleExportZip = async () => {
    const zip = new JSZip();
    
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${favicon ? `<link rel="icon" type="image/x-icon" href="${favicon}">` : ''}
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${html}
<script src="script.js"></script>
</body>
</html>`;
    
    zip.file('index.html', fullHtml);
    zip.file('styles.css', css);
    zip.file('script.js', js);
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plut-studio-project.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Проект экспортирован! 📦",
      description: "ZIP архив успешно скачан",
    });
  };

  const handleFaviconUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFavicon(dataUrl);
      toast({
        title: "Favicon обновлен! ✅",
        description: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileImport = (type: 'html' | 'css' | 'js', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (type === 'html') setHtml(content);
      if (type === 'css') setCss(content);
      if (type === 'js') setJs(content);
      
      toast({
        title: "Файл импортирован! ✅",
        description: `${file.name} успешно загружен`,
      });
    };
    reader.readAsText(file);
  };

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <input
        ref={htmlInputRef}
        type="file"
        accept=".html,.htm"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileImport('html', e.target.files[0])}
      />
      <input
        ref={cssInputRef}
        type="file"
        accept=".css"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileImport('css', e.target.files[0])}
      />
      <input
        ref={jsInputRef}
        type="file"
        accept=".js"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileImport('js', e.target.files[0])}
      />
      <input
        ref={faviconInputRef}
        type="file"
        accept=".ico,.png,.jpg,.svg"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFaviconUpload(e.target.files[0])}
      />

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
              onClick={() => triggerFileInput(faviconInputRef)}
            >
              <Icon name="Image" size={16} />
              Favicon
            </Button>
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
              variant="outline"
              size="sm"
              className="gap-2 border-secondary/50 hover:border-secondary transition-all"
              onClick={handleExportZip}
            >
              <Icon name="Download" size={16} />
              Экспорт ZIP
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
                    triggerFileInput(faviconInputRef);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon name="Image" size={16} />
                  Favicon
                </Button>
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
                  variant="outline"
                  className="w-full gap-2 justify-start border-secondary/50"
                  onClick={() => {
                    handleExportZip();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon name="Download" size={16} />
                  Экспорт ZIP
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
              <TabsList className="w-full justify-between rounded-none border-b border-border bg-muted/30 p-0">
                <div className="flex">
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
                </div>
              </TabsList>

              <TabsContent value="html" className="m-0 p-0">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10 gap-1 text-xs h-7 bg-background/80 hover:bg-background"
                    onClick={() => triggerFileInput(htmlInputRef)}
                  >
                    <Icon name="Upload" size={14} />
                    Импорт HTML
                  </Button>
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="w-full h-[500px] bg-background text-foreground font-mono text-sm p-4 resize-none focus:outline-none border-0"
                    spellCheck={false}
                  />
                </div>
              </TabsContent>

              <TabsContent value="css" className="m-0 p-0">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10 gap-1 text-xs h-7 bg-background/80 hover:bg-background"
                    onClick={() => triggerFileInput(cssInputRef)}
                  >
                    <Icon name="Upload" size={14} />
                    Импорт CSS
                  </Button>
                  <textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    className="w-full h-[500px] bg-background text-foreground font-mono text-sm p-4 resize-none focus:outline-none border-0"
                    spellCheck={false}
                  />
                </div>
              </TabsContent>

              <TabsContent value="js" className="m-0 p-0">
                <div className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10 gap-1 text-xs h-7 bg-background/80 hover:bg-background"
                    onClick={() => triggerFileInput(jsInputRef)}
                  >
                    <Icon name="Upload" size={14} />
                    Импорт JS
                  </Button>
                  <textarea
                    value={js}
                    onChange={(e) => setJs(e.target.value)}
                    className="w-full h-[500px] bg-background text-foreground font-mono text-sm p-4 resize-none focus:outline-none border-0"
                    spellCheck={false}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 gamer-glow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="FolderTree" size={18} className="text-primary" />
                <h3 className="font-semibold">Файловый менеджер</h3>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2 h-7 text-xs border-primary/50"
              >
                <Icon name="Upload" size={14} />
                Импорт
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div 
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-all group"
                onClick={() => triggerFileInput(htmlInputRef)}
              >
                <div className="flex items-center gap-2">
                  <Icon name="FileCode" size={16} className="text-secondary" />
                  <span>index.html</span>
                </div>
                <Icon name="Upload" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div 
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-all group"
                onClick={() => triggerFileInput(cssInputRef)}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Palette" size={16} className="text-secondary" />
                  <span>styles.css</span>
                </div>
                <Icon name="Upload" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div 
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-all group"
                onClick={() => triggerFileInput(jsInputRef)}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={16} className="text-secondary" />
                  <span>script.js</span>
                </div>
                <Icon name="Upload" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bg-card rounded-lg border border-border overflow-hidden gamer-glow-blue">
            <div className="bg-muted/30 p-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Eye" size={18} className="text-secondary" />
                <h3 className="font-semibold">Превью</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={activeTab === 'code' ? 'default' : 'outline'}
                  className="h-7 text-xs"
                  onClick={() => setActiveTab('code')}
                >
                  Код
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'builder' ? 'default' : 'outline'}
                  className="h-7 text-xs"
                  onClick={() => setActiveTab('builder')}
                >
                  Конструктор
                </Button>
              </div>
            </div>
            {activeTab === 'code' ? (
              <div className="bg-white">
                <iframe
                  srcDoc={generatePreview()}
                  className="w-full h-[600px] border-0"
                  title="Preview"
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <VisualBuilder
                onSave={(newHtml, newCss) => {
                  setHtml(newHtml);
                  setCss(newCss);
                  setActiveTab('code');
                  toast({
                    title: "Код обновлен! ✅",
                    description: "Конструктор сохранил изменения в код",
                  });
                }}
                backgroundColor={backgroundColor}
                onBackgroundChange={setBackgroundColor}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}