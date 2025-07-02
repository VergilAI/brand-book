"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Search, BarChart3, Bookmark, 
  ChevronLeft, ChevronRight, History,
  Hash, Type, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scrollarea";
import { useTextEditor2Store } from "@/stores/text-editor2-store";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { 
    wordCount, charCount, charCountNoSpaces, 
    paragraphCount, readingTime, content 
  } = useTextEditor2Store();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  // Extract headings from content
  const headings = extractHeadings(content);
  const bookmarks: string[] = []; // Would be populated from store

  if (collapsed) {
    return (
      <div className="w-16 bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-4 m-2 rounded-xl shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="mb-4 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col gap-4">
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-cosmic-purple transition-colors" />
          <Search className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-cosmic-purple transition-colors" />
          <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-cosmic-purple transition-colors" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 flex flex-col m-2 rounded-xl shadow-lg">
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200">Tools & Navigation</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="structure" className="flex-1">
        <TabsList className="w-full justify-start rounded-lg mx-4 bg-white dark:bg-gray-800 h-10">
          <TabsTrigger value="structure" className="gap-2">
            <FileText className="h-4 w-4" />
            Structure
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="p-4 m-0 transition-all duration-200">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Document Outline
              </h4>
              <ScrollArea className="h-64 rounded-lg border-0 bg-white dark:bg-gray-800 shadow-sm">
                <div className="p-2">
                  {headings.length > 0 ? (
                    headings.map((heading, index) => (
                      <button
                        key={index}
                        className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                          heading.level > 1 ? `ml-${(heading.level - 1) * 4}` : ''
                        }`}
                        style={{ paddingLeft: `${(heading.level - 1) * 16 + 8}px` }}
                      >
                        {heading.text}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">No headings found</p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Bookmarks
              </h4>
              <ScrollArea className="h-32 rounded-lg border-0 bg-white dark:bg-gray-800 shadow-sm">
                <div className="p-2">
                  {bookmarks.length > 0 ? (
                    bookmarks.map((bookmark, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {bookmark}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">No bookmarks</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="p-4 m-0 transition-all duration-200">
          <div className="space-y-4">
            <div>
              <Label htmlFor="search-input" className="text-sm">Find</Label>
              <Input
                id="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search text..."
                className="mt-1 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="replace-input" className="text-sm">Replace</Label>
              <Input
                id="replace-input"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="Replace with..."
                className="mt-1 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="case-sensitive" className="text-sm">Case sensitive</Label>
                <Switch
                  id="case-sensitive"
                  checked={caseSensitive}
                  onCheckedChange={setCaseSensitive}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whole-word" className="text-sm">Whole word</Label>
                <Switch
                  id="whole-word"
                  checked={wholeWord}
                  onCheckedChange={setWholeWord}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="use-regex" className="text-sm">Regular expression</Label>
                <Switch
                  id="use-regex"
                  checked={useRegex}
                  onCheckedChange={setUseRegex}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">Find All</Button>
              <Button size="sm" variant="outline" className="flex-1">Replace All</Button>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <History className="h-4 w-4" />
                Search History
              </h4>
              <ScrollArea className="h-32 rounded-lg border-0 bg-white dark:bg-gray-800 shadow-sm">
                <div className="p-2">
                  <p className="text-sm text-muted-foreground">No recent searches</p>
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="p-4 m-0 transition-all duration-200">
          <div className="space-y-4">
            <StatItem icon={Type} label="Words" value={wordCount.toLocaleString()} />
            <StatItem icon={Hash} label="Characters" value={charCount.toLocaleString()} />
            <StatItem 
              icon={Hash} 
              label="Characters (no spaces)" 
              value={charCountNoSpaces.toLocaleString()} 
            />
            <StatItem icon={FileText} label="Paragraphs" value={paragraphCount.toLocaleString()} />
            <StatItem 
              icon={Clock} 
              label="Reading time" 
              value={`${readingTime} ${readingTime === 1 ? 'minute' : 'minutes'}`} 
            />
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Selection Statistics</h4>
              <p className="text-sm text-muted-foreground">Select text to view stats</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function extractHeadings(content: string): { level: number; text: string }[] {
  const lines = content.split('\n');
  const headings: { level: number; text: string }[] = [];
  
  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2]
      });
    }
  });
  
  return headings;
}