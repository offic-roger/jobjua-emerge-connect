import { useState } from 'react';
import { Search, Clock, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchHistoryProps {
  isVisible: boolean;
  onClose: () => void;
  onSearchSelect: (query: string) => void;
}

const recentSearches = [
  'Frontend Developer',
  'Product Manager',
  'UI/UX Designer',
  'Data Scientist',
  'Marketing Manager'
];

const trendingSearches = [
  { term: 'Remote Jobs', growth: '+25%' },
  { term: 'AI Engineer', growth: '+40%' },
  { term: 'DevOps', growth: '+18%' },
  { term: 'Mobile Developer', growth: '+12%' },
];

const popularFilters = [
  { label: 'Full-time', count: 245 },
  { label: 'Remote', count: 189 },
  { label: 'Lagos', count: 156 },
  { label: 'Nairobi', count: 134 },
  { label: '₦200k+', count: 98 },
];

export const SearchHistory = ({ isVisible, onClose, onSearchSelect }: SearchHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isVisible) return null;

  const handleSearch = (query: string) => {
    onSearchSelect(query);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1">
      <Card className="shadow-elevated max-h-96 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Quick Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleSearch(searchQuery);
                }
              }}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h4>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-8 px-2 text-sm"
                    onClick={() => handleSearch(search)}
                  >
                    <Search className="w-3 h-3 mr-2 text-muted-foreground" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending This Week
            </h4>
            <div className="space-y-1">
              {trendingSearches.map((trend, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-between h-8 px-2 text-sm"
                  onClick={() => handleSearch(trend.term)}
                >
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-2 text-green-500" />
                    {trend.term}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {trend.growth}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Popular Filters */}
          <div>
            <h4 className="text-sm font-medium mb-2">Popular Filters</h4>
            <div className="flex flex-wrap gap-2">
              {popularFilters.map((filter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleSearch(filter.label)}
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};