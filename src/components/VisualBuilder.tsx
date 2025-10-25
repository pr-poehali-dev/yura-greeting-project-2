import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Element {
  id: string;
  type: 'text' | 'link' | 'image';
  content: string;
  x: number;
  y: number;
  href?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
}

interface VisualBuilderProps {
  onSave: (html: string, css: string) => void;
  backgroundColor: string;
  onBackgroundChange: (color: string) => void;
}

export default function VisualBuilder({ onSave, backgroundColor, onBackgroundChange }: VisualBuilderProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [newElementType, setNewElementType] = useState<'text' | 'link' | 'image'>('text');
  const [newElementContent, setNewElementContent] = useState('');
  const [newElementHref, setNewElementHref] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === id);
    if (!element) return;

    setDraggingId(id);
    setSelectedElement(id);
    setDragOffset({
      x: e.clientX - element.x,
      y: e.clientY - element.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setElements(elements.map(el =>
      el.id === draggingId ? { ...el, x, y } : el
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const addElement = () => {
    if (!newElementContent) return;

    const newElement: Element = {
      id: Math.random().toString(36).substring(7),
      type: newElementType,
      content: newElementContent,
      x: 100,
      y: 100,
      fontSize: 16,
      color: '#ffffff',
      fontWeight: 400,
      ...(newElementType === 'link' && { href: newElementHref }),
    };

    setElements([...elements, newElement]);
    setShowAddDialog(false);
    setNewElementContent('');
    setNewElementHref('');
  };

  const updateElementStyle = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const generateCode = () => {
    let html = '<!DOCTYPE html>\n<html lang="ru">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '  <title>Plut Studio - Визуальный конструктор</title>\n';
    html += '</head>\n<body>\n';
    html += '  <div class="canvas">\n';

    elements.forEach(el => {
      const style = `left: ${el.x}px; top: ${el.y}px; font-size: ${el.fontSize || 16}px; color: ${el.color || '#fff'}; font-weight: ${el.fontWeight || 400};`;
      
      if (el.type === 'text') {
        html += `    <div class="element element-${el.id}" style="${style}">${el.content}</div>\n`;
      } else if (el.type === 'link') {
        html += `    <a href="${el.href || '#'}" class="element element-${el.id}" style="${style}">${el.content}</a>\n`;
      } else if (el.type === 'image') {
        html += `    <img src="${el.content}" class="element element-${el.id}" style="${style}" alt="Изображение" />\n`;
      }
    });

    html += '  </div>\n</body>\n</html>';

    const css = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Rubik', -apple-system, sans-serif;
  background: ${backgroundColor};
  min-height: 100vh;
  overflow: hidden;
}

.canvas {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.element {
  position: absolute;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(155, 135, 245, 0.3);
  border-radius: 8px;
  cursor: move;
  user-select: none;
  transition: all 0.2s ease;
}

.element:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px rgba(155, 135, 245, 0.4);
}

a.element {
  text-decoration: none;
}

img.element {
  max-width: 200px;
  height: auto;
  background: transparent;
  padding: 0;
}`;

    onSave(html, css);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon name="Paintbrush" size={18} className="text-primary" />
          <h3 className="font-semibold text-sm">Визуальный конструктор</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="bg-color" className="text-xs">Фон:</Label>
            <Input
              id="bg-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="w-12 h-8 p-1 cursor-pointer"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 h-8 text-xs"
            onClick={() => setShowAddDialog(true)}
          >
            <Icon name="Plus" size={14} />
            Добавить
          </Button>
          <Button
            size="sm"
            className="gap-1 h-8 text-xs bg-primary"
            onClick={generateCode}
          >
            <Icon name="Save" size={14} />
            Сохранить в код
          </Button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        style={{ background: backgroundColor }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => setSelectedElement(null)}
      >
        {elements.map(el => (
          <div
            key={el.id}
            className={`absolute p-3 bg-white/10 border rounded-lg cursor-move select-none hover:bg-white/15 transition-all ${
              selectedElement === el.id ? 'border-primary ring-2 ring-primary/50' : 'border-primary/30'
            }`}
            style={{ 
              left: el.x, 
              top: el.y,
              fontSize: `${el.fontSize || 16}px`,
              color: el.color || '#ffffff',
              fontWeight: el.fontWeight || 400,
            }}
            onMouseDown={(e) => handleMouseDown(el.id, e)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(el.id);
            }}
          >
            {el.type === 'text' && <span>{el.content}</span>}
            {el.type === 'link' && (
              <a href={el.href} className="hover:underline" onClick={(e) => e.preventDefault()}>
                {el.content}
              </a>
            )}
            {el.type === 'image' && (
              <img src={el.content} alt="Элемент" className="max-w-[200px] h-auto" />
            )}
            
            {selectedElement === el.id && el.type !== 'image' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -top-10 left-0 h-7 text-xs gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon name="Settings" size={12} />
                    Стили
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-card border-border" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Размер шрифта: {el.fontSize || 16}px</Label>
                      <Slider
                        value={[el.fontSize || 16]}
                        onValueChange={(v) => updateElementStyle(el.id, { fontSize: v[0] })}
                        min={8}
                        max={72}
                        step={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Цвет текста</Label>
                      <Input
                        type="color"
                        value={el.color || '#ffffff'}
                        onChange={(e) => updateElementStyle(el.id, { color: e.target.value })}
                        className="w-full h-10 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Жирность: {el.fontWeight || 400}</Label>
                      <Slider
                        value={[el.fontWeight || 400]}
                        onValueChange={(v) => updateElementStyle(el.id, { fontWeight: v[0] })}
                        min={100}
                        max={900}
                        step={100}
                      />
                    </div>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full gap-1"
                      onClick={() => deleteElement(el.id)}
                    >
                      <Icon name="Trash2" size={14} />
                      Удалить
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            {selectedElement === el.id && el.type === 'image' && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-10 left-0 h-7 text-xs gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(el.id);
                }}
              >
                <Icon name="Trash2" size={12} />
                Удалить
              </Button>
            )}
          </div>
        ))}

        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/50">
              <Icon name="MousePointerClick" size={48} className="mx-auto mb-4" />
              <p>Нажмите "Добавить" для создания элементов</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Добавить элемент</DialogTitle>
            <DialogDescription>Выберите тип элемента и заполните данные</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={newElementType === 'text' ? 'default' : 'outline'}
                onClick={() => setNewElementType('text')}
                className="gap-2"
              >
                <Icon name="Type" size={16} />
                Текст
              </Button>
              <Button
                variant={newElementType === 'link' ? 'default' : 'outline'}
                onClick={() => setNewElementType('link')}
                className="gap-2"
              >
                <Icon name="Link" size={16} />
                Ссылка
              </Button>
              <Button
                variant={newElementType === 'image' ? 'default' : 'outline'}
                onClick={() => setNewElementType('image')}
                className="gap-2"
              >
                <Icon name="Image" size={16} />
                Картинка
              </Button>
            </div>

            <div className="space-y-2">
              <Label>
                {newElementType === 'text' && 'Текст'}
                {newElementType === 'link' && 'Текст ссылки'}
                {newElementType === 'image' && 'URL изображения'}
              </Label>
              <Input
                value={newElementContent}
                onChange={(e) => setNewElementContent(e.target.value)}
                placeholder={
                  newElementType === 'text' ? 'Введите текст...' :
                  newElementType === 'link' ? 'Текст ссылки' :
                  'https://example.com/image.jpg'
                }
              />
            </div>

            {newElementType === 'link' && (
              <div className="space-y-2">
                <Label>URL ссылки</Label>
                <Input
                  value={newElementHref}
                  onChange={(e) => setNewElementHref(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={addElement} className="flex-1">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
