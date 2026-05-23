'use client';

import {
  LayoutDashboard, Users, BarChart3, Wrench, Users2,
  Database, User, Sparkles, Shield, Heart,
  BookOpen, Briefcase, Megaphone, ArrowLeft, Search,
  type LucideIcon,
} from 'lucide-react';

const registry: Record<string, LucideIcon> = {
  LayoutDashboard, Users, BarChart3, Wrench, Users2,
  Database, User, Sparkles, Shield, Heart,
  BookOpen, Briefcase, Megaphone, ArrowLeft, Search,
};

export function SidebarIcon({ name, className }: { name: string; className?: string }) {
  const Icon = registry[name];
  if (!Icon) return null;
  return (
    <span className="inline-flex items-center justify-center h-[18px] w-[18px] shrink-0 overflow-hidden">
      <Icon className={className ?? ''} strokeWidth={1.5} absoluteStrokeWidth />
    </span>
  );
}
