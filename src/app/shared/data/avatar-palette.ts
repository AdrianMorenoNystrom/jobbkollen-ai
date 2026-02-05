export interface AvatarColorOption {
  id: string;
  hex: string;
  labelKey: string;
}

export const AVATAR_COLORS: AvatarColorOption[] = [
  { id: 'sunset', hex: '#f97316', labelKey: 'color.sunset' },
  { id: 'coral', hex: '#fb7185', labelKey: 'color.coral' },
  { id: 'rose', hex: '#f43f5e', labelKey: 'color.rose' },
  { id: 'plum', hex: '#a855f7', labelKey: 'color.plum' },
  { id: 'indigo', hex: '#6366f1', labelKey: 'color.indigo' },
  { id: 'sky', hex: '#38bdf8', labelKey: 'color.sky' },
  { id: 'teal', hex: '#14b8a6', labelKey: 'color.teal' },
  { id: 'emerald', hex: '#22c55e', labelKey: 'color.emerald' },
  { id: 'lime', hex: '#84cc16', labelKey: 'color.lime' },
  { id: 'amber', hex: '#f59e0b', labelKey: 'color.amber' },
  { id: 'slate', hex: '#64748b', labelKey: 'color.slate' },
  { id: 'chocolate', hex: '#b45309', labelKey: 'color.chocolate' }
];
