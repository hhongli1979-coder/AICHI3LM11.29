import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Notebook, 
  Plus, 
  Trash, 
  MagnifyingGlass, 
  Star, 
  ChatCircle, 
  FileText, 
  Lightning,
  BookOpen,
  Clock,
  Tag,
  PencilSimple
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { formatTimeAgo } from '@/lib/mock-data';
import { v4 as uuidv4 } from 'uuid';

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'transaction' | 'wallet' | 'defi' | 'research' | 'general';
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AIInsight {
  id: string;
  noteId: string;
  type: 'summary' | 'action' | 'question' | 'connection';
  content: string;
  createdAt: number;
}

const MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'ETH Staking Strategy Analysis',
    content: 'After reviewing multiple staking providers, Lido offers 4.2% APY with liquid staking tokens (stETH). Consider allocating 30% of ETH holdings to diversify yield sources. Key risks: smart contract vulnerability, slashing penalties.',
    category: 'defi',
    tags: ['staking', 'eth', 'yield'],
    isFavorite: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'note-2',
    title: 'Multi-sig Wallet Setup Checklist',
    content: '1. Define signing threshold (2/3 recommended for treasury)\n2. Identify trusted signers with hardware wallets\n3. Test with small transaction first\n4. Document recovery procedures\n5. Set up monitoring alerts',
    category: 'wallet',
    tags: ['security', 'setup', 'multisig'],
    isFavorite: true,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'note-3',
    title: 'Q4 Treasury Report Notes',
    content: 'Total holdings: $2.4M across 5 wallets. Monthly operating costs: $45K. DeFi yield generated: $12K. Need to review Arbitrum bridge fees - seems excessive. Schedule review with team.',
    category: 'general',
    tags: ['treasury', 'quarterly', 'finance'],
    isFavorite: false,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'note-4',
    title: 'Vendor Payment Process',
    content: 'New payment workflow: 1. Vendor submits invoice via portal. 2. Finance reviews within 48hrs. 3. Treasury creates transaction. 4. Requires 2/3 signatures for amounts >$5000. 5. Auto-execute after threshold met.',
    category: 'transaction',
    tags: ['process', 'payments', 'workflow'],
    isFavorite: false,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'note-5',
    title: 'Layer 2 Research: Optimism vs Arbitrum',
    content: 'Arbitrum: More TVL, larger ecosystem, better for DeFi. Optimism: Stronger governance, retroactive funding, good for DAOs. Both have similar security (optimistic rollups). Transaction costs: Arbitrum ~$0.10, Optimism ~$0.08.',
    category: 'research',
    tags: ['l2', 'research', 'comparison'],
    isFavorite: false,
    createdAt: Date.now() - 21 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
  },
];

const MOCK_INSIGHTS: AIInsight[] = [
  {
    id: 'insight-1',
    noteId: 'note-1',
    type: 'action',
    content: 'Consider setting up a DCA strategy to gradually stake ETH over the next 4 weeks to reduce timing risk.',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'insight-2',
    noteId: 'note-3',
    type: 'summary',
    content: 'Treasury is healthy with 53 months of runway at current burn rate. DeFi yield covers 27% of monthly costs.',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'insight-3',
    noteId: 'note-5',
    type: 'question',
    content: "Based on your DeFi focus, have you evaluated Arbitrum's Aave deployment for your lending strategies?",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

const CATEGORY_CONFIG = {
  transaction: { label: 'Transaction', color: 'text-blue-600', bg: 'bg-blue-100' },
  wallet: { label: 'Wallet', color: 'text-green-600', bg: 'bg-green-100' },
  defi: { label: 'DeFi', color: 'text-purple-600', bg: 'bg-purple-100' },
  research: { label: 'Research', color: 'text-orange-600', bg: 'bg-orange-100' },
  general: { label: 'General', color: 'text-gray-600', bg: 'bg-gray-100' },
};

export function NotebookAssistant() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [insights] = useState<AIInsight[]>(MOCK_INSIGHTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  // New note form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Note['category']>('general');

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || 
      (filterCategory === 'favorites' && note.isFavorite) ||
      note.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddNote = () => {
    if (!newTitle || !newContent) {
      toast.error('Please fill in title and content');
      return;
    }

    const newNote: Note = {
      id: `note-${uuidv4()}`,
      title: newTitle,
      content: newContent,
      category: newCategory,
      tags: [],
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes([newNote, ...notes]);
    toast.success('Note created successfully');
    
    // Reset form
    setNewTitle('');
    setNewContent('');
    setNewCategory('general');
    setAddDialogOpen(false);
  };

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
    toast.success(`"${noteTitle}" deleted`);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const handleToggleFavorite = (noteId: string) => {
    setNotes(notes.map(n => 
      n.id === noteId ? { ...n, isFavorite: !n.isFavorite } : n
    ));
  };

  const handleAskAssistant = () => {
    if (!chatQuery.trim()) {
      toast.error('Please enter a question');
      return;
    }
    toast.success('AI is analyzing your notes...', {
      description: 'Response will appear shortly'
    });
    setChatQuery('');
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'summary': return <FileText size={16} weight="duotone" className="text-blue-600" />;
      case 'action': return <Lightning size={16} weight="duotone" className="text-yellow-600" />;
      case 'question': return <ChatCircle size={16} weight="duotone" className="text-purple-600" />;
      case 'connection': return <BookOpen size={16} weight="duotone" className="text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Notebook size={24} weight="duotone" className="text-primary" />
                Notebook Assistant
              </CardTitle>
              <CardDescription>AI-powered notes and insights for your crypto operations</CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} weight="bold" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                  <DialogDescription>
                    Add a new note to your notebook. AI will automatically generate insights.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., DeFi Strategy Analysis"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newCategory} onValueChange={(v) => setNewCategory(v as Note['category'])}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${config.bg}`} />
                              <span>{config.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your notes here..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleAddNote}>
                      Create Note
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notes" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notes" className="gap-2">
                <FileText size={16} weight="duotone" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2">
                <Lightning size={16} weight="duotone" />
                AI Insights
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <ChatCircle size={16} weight="duotone" />
                Ask Assistant
              </TabsTrigger>
            </TabsList>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notes</SelectItem>
                    <SelectItem value="favorites">⭐ Favorites</SelectItem>
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes List */}
              <div className="grid gap-4 md:grid-cols-2">
                {filteredNotes.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    <Notebook size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
                    <p>No notes found</p>
                  </div>
                ) : (
                  filteredNotes.map((note) => {
                    const categoryConfig = CATEGORY_CONFIG[note.category];
                    return (
                      <Card
                        key={note.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedNote(note)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-base">{note.title}</CardTitle>
                                {note.isFavorite && (
                                  <Star size={16} weight="fill" className="text-yellow-500" />
                                )}
                              </div>
                              <Badge variant="outline" className={`${categoryConfig.color} text-xs`}>
                                {categoryConfig.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(note.id);
                                }}
                              >
                                <Star 
                                  size={16} 
                                  weight={note.isFavorite ? 'fill' : 'regular'}
                                  className={note.isFavorite ? 'text-yellow-500' : ''}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id, note.title);
                                }}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                            {note.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 flex-wrap">
                              {note.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag size={10} className="mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock size={12} />
                              {formatTimeAgo(note.updatedAt)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{notes.length}</div>
                  <div className="text-sm text-muted-foreground">Total Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{notes.filter(n => n.isFavorite).length}</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{allTags.length}</div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{insights.length}</div>
                  <div className="text-sm text-muted-foreground">AI Insights</div>
                </div>
              </div>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lightning size={16} weight="duotone" className="text-primary" />
                  AI-generated insights from your notes
                </div>
                
                {insights.map((insight) => {
                  const relatedNote = notes.find(n => n.id === insight.noteId);
                  return (
                    <Card key={insight.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {insight.type}
                              </Badge>
                              {relatedNote && (
                                <span className="text-xs text-muted-foreground">
                                  from "{relatedNote.title}"
                                </span>
                              )}
                            </div>
                            <p className="text-sm">{insight.content}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Clock size={12} />
                              {formatTimeAgo(insight.createdAt)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {insights.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Lightning size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
                    <p>No insights generated yet</p>
                    <p className="text-sm">Add more notes to get AI-powered insights</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4">
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ChatCircle size={20} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Notebook Assistant</h4>
                      <p className="text-sm text-muted-foreground">
                        Ask me anything about your notes. I can summarize, find connections, 
                        suggest actions, and answer questions based on your saved information.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question about your notes..."
                        value={chatQuery}
                        onChange={(e) => setChatQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
                        className="flex-1"
                      />
                      <Button onClick={handleAskAssistant} className="gap-2">
                        <ChatCircle size={16} weight="bold" />
                        Ask
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs justify-start gap-2"
                        onClick={() => {
                          setChatQuery('Summarize my DeFi-related notes');
                          toast.info('Question set - click Ask to submit');
                        }}
                      >
                        <FileText size={14} />
                        Summarize DeFi notes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs justify-start gap-2"
                        onClick={() => {
                          setChatQuery('What action items do I have pending?');
                          toast.info('Question set - click Ask to submit');
                        }}
                      >
                        <Lightning size={14} />
                        Find action items
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs justify-start gap-2"
                        onClick={() => {
                          setChatQuery('What are my staking opportunities?');
                          toast.info('Question set - click Ask to submit');
                        }}
                      >
                        <BookOpen size={14} />
                        Staking opportunities
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs justify-start gap-2"
                        onClick={() => {
                          setChatQuery('Generate a weekly summary report');
                          toast.info('Question set - click Ask to submit');
                        }}
                      >
                        <PencilSimple size={14} />
                        Weekly summary
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-muted-foreground">
                <p>💡 Tip: The assistant analyzes all your notes to provide contextual answers</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Note Detail Dialog */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNote && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selectedNote.title}</DialogTitle>
                  {selectedNote.isFavorite && (
                    <Star size={18} weight="fill" className="text-yellow-500" />
                  )}
                </div>
                <DialogDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={CATEGORY_CONFIG[selectedNote.category].color}>
                      {CATEGORY_CONFIG[selectedNote.category].label}
                    </Badge>
                    <span className="text-xs">
                      Created {formatTimeAgo(selectedNote.createdAt)} • Updated {formatTimeAgo(selectedNote.updatedAt)}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{selectedNote.content}</p>
                </div>
                
                {selectedNote.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-4 border-t">
                    <Tag size={16} className="text-muted-foreground" />
                    {selectedNote.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Related Insights */}
                {insights.filter(i => i.noteId === selectedNote.id).length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Lightning size={16} weight="duotone" className="text-primary" />
                      AI Insights for this note
                    </h4>
                    <div className="space-y-2">
                      {insights.filter(i => i.noteId === selectedNote.id).map(insight => (
                        <div key={insight.id} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          {getInsightIcon(insight.type)}
                          <p className="text-sm">{insight.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
