import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    query: string;
    type: string;
    distance: number;
    sortBy: string;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

export default function SearchFilters({ filters, onFilterChange, onClearFilters }: SearchFiltersProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Search Query */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search services, providers..."
          value={filters.query}
          onChange={(e) => onFilterChange('query', e.target.value)}
        />
      </div>

      {/* Service Type */}
      <div className="space-y-2">
        <Label>Service Type</Label>
        <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="grooming">✂️ Grooming</SelectItem>
            <SelectItem value="health">🏥 Health</SelectItem>
            <SelectItem value="care">❤️ Care & Sitting</SelectItem>
            <SelectItem value="training">🎓 Training</SelectItem>
            <SelectItem value="daycare">🏠 Daycare</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Distance */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Distance</Label>
          <span className="text-sm text-gray-500">{filters.distance} miles</span>
        </div>
        <Slider
          value={[filters.distance]}
          onValueChange={(value) => onFilterChange('distance', value[0])}
          min={1}
          max={25}
          step={1}
        />
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Filters */}
      <div className="space-y-2">
        <Label>Quick Filters</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">24/7 Available</Button>
          <Button variant="outline" size="sm">Top Rated</Button>
          <Button variant="outline" size="sm">Emergency</Button>
        </div>
      </div>
    </Card>
  );
}
