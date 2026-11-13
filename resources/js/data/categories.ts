export interface SubcategoryItem {
    id: string;
    name: string;
    slug: string;
    url: string;
    icon: string;
    description?: string;
}

export interface CategoryGroup {
    id: string;
    chip: string;
    name: string;
    slug: string;
    viewAllUrl: string;
    subcategories: SubcategoryItem[];
}

import categoriesData from './categories.json';

export const CATEGORIES_DATA: CategoryGroup[] = categoriesData as CategoryGroup[];

export const CATEGORY_CHIPS = [
    'Semua',
    'Coffee',
    'Brewing Gear',
    'Grinders',
    'Espresso & Machines',
    'Ingredients',
    'Merchandise',
] as const;

