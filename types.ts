export interface Star {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface CollectedStar extends Star {
  categoryId: string; // どのセクターで発見されたか
  obtainedTaskTitle?: string; // どのタスクで入手したか
}

export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface Category {
  id: string;
  label: string;
  count: number;
  isArchived?: boolean; // アーカイブ済みかどうか
}
