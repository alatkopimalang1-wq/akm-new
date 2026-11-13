export interface MegaSubcategory {
    id: string;
    name: string;
    url: string;
    icon: string;
    image?: string | null;
    visual_type?: 'icon' | 'image';
    is_active?: boolean;
}

export interface MegaMainCategory {
    id: string;
    name: string;
    slug: string;
    url: string;
    subcategories: MegaSubcategory[];
}

export const DESKTOP_MEGA_MENU_CATEGORIES: MegaMainCategory[] = [
    {
        id: 'coffee',
        name: 'Coffee',
        slug: 'coffee',
        url: '/shop?category=coffee',
        subcategories: [
            { id: 'coffee-beans', name: 'Coffee Beans', url: '/shop?category=filter-beans', icon: 'coffee-beans' },
            { id: 'capsules', name: 'Capsules', url: '/shop?category=capsule', icon: 'coffee-capsule' },
            { id: 'drip-coffee', name: 'Drip Coffee', url: '/shop?category=drip-bag', icon: 'drip-bag' },
            { id: 'cold-brew', name: 'Cold Brew', url: '/shop?category=cold-brew', icon: 'cold-brew' },
            { id: 'ready-to-drink', name: 'Ready to Drink', url: '/shop?category=cold-brew', icon: 'cold-brew' },
            { id: 'kopi-luwak', name: 'Kopi Luwak', url: '/shop?category=co-ferment', icon: 'specialty-ferment' },
            { id: 'green-bean', name: 'Green Bean', url: '/shop?category=green-bean', icon: 'green-bean' },
            { id: 'specialty-microlot', name: 'Specialty Micro-lot', url: '/shop?category=experimental', icon: 'coffee-beans' },
        ],
    },
    {
        id: 'tea-beverages',
        name: 'Tea & Beverages',
        slug: 'tea-beverages',
        url: '/shop?category=tea',
        subcategories: [
            { id: 'artisan-tea', name: 'Specialty Artisan Tea', url: '/shop?category=tea', icon: 'tea' },
            { id: 'matcha-green-tea', name: 'Matcha & Green Tea', url: '/shop?category=powder', icon: 'powder' },
            { id: 'cascara-tea', name: 'Cascara Coffee Cherry Tea', url: '/shop?category=tea', icon: 'tea' },
            { id: 'artisan-chocolate', name: 'Artisan Chocolate & Cocoa', url: '/shop?category=powder', icon: 'powder' },
            { id: 'chai-spiced', name: 'Chai & Spiced Tea', url: '/shop?category=tea', icon: 'tea' },
            { id: 'herbal-tisane', name: 'Herbal & Floral Tisane', url: '/shop?category=tea', icon: 'tea' },
            { id: 'fruit-infusions', name: 'Fruit Infusions', url: '/shop?category=tea', icon: 'tea' },
            { id: 'kombucha-brew', name: 'Kombucha Culture & Brew', url: '/shop?category=cold-brew', icon: 'cold-brew' },
        ],
    },
    {
        id: 'grinders',
        name: 'Grinders',
        slug: 'grinders',
        url: '/shop?category=grinders',
        subcategories: [
            { id: 'manual-grinder', name: 'Manual Hand Grinder', url: '/shop?category=hand-grinder', icon: 'manual-grinder' },
            { id: 'flat-burr-grinder', name: 'Electric Flat Burr Grinder', url: '/shop?category=electric-grinder', icon: 'electric-grinder' },
            { id: 'conical-grinder', name: 'Conical Burr Grinder', url: '/shop?category=conical-grinder', icon: 'electric-grinder' },
            { id: 'commercial-grinder', name: 'Commercial Espresso Grinder', url: '/shop?category=espresso-grinder', icon: 'electric-grinder' },
            { id: 'single-dose', name: 'Single Dose Grinder', url: '/shop?category=electric-grinder', icon: 'electric-grinder' },
            { id: 'burr-replacement', name: 'Burr Replacement & Upgrade', url: '/shop?category=grinder-tools', icon: 'barista-tools' },
            { id: 'grinder-cleaner', name: 'Grinder Cleaner & Brush', url: '/shop?category=grinder-tools', icon: 'barista-tools' },
            { id: 'bellows-hoppers', name: 'Anti-Popcorn Bellows & Hoppers', url: '/shop?category=grinder-tools', icon: 'barista-tools' },
        ],
    },
    {
        id: 'coffee-machines',
        name: 'Coffee Machines',
        slug: 'coffee-machines',
        url: '/shop?category=espresso-machines',
        subcategories: [
            { id: 'home-espresso', name: 'Home Espresso Machine', url: '/shop?category=home-espresso', icon: 'espresso-home' },
            { id: 'commercial-espresso', name: 'Commercial Espresso Machine', url: '/shop?category=commercial-espresso', icon: 'espresso-commercial' },
            { id: 'lever-espresso', name: 'Lever Espresso Machine', url: '/shop?category=home-espresso', icon: 'espresso-home' },
            { id: 'automatic-bean-to-cup', name: 'Automatic Bean to Cup', url: '/shop?category=home-espresso', icon: 'espresso-commercial' },
            { id: 'capsule-machine', name: 'Capsule Espresso Machine', url: '/shop?category=home-espresso', icon: 'espresso-home' },
            { id: 'cold-drip-tower', name: 'Cold Brew Drip Tower', url: '/shop?category=cold-brew', icon: 'server' },
            { id: 'milk-steamer', name: 'Dedicated Milk Steamer Unit', url: '/shop?category=espresso-machines', icon: 'espresso-home' },
            { id: 'machine-care', name: 'Machine Care & Descaler', url: '/shop?category=barista-tools', icon: 'barista-tools' },
        ],
    },
    {
        id: 'manual-brewers',
        name: 'Manual Brewers',
        slug: 'manual-brewers',
        url: '/shop?category=manual-brew',
        subcategories: [
            { id: 'dripper-v60', name: 'Dripper & Pour Over (V60)', url: '/shop?category=dripper', icon: 'dripper' },
            { id: 'french-press', name: 'French Press & Immersion', url: '/shop?category=server', icon: 'server' },
            { id: 'aeropress', name: 'AeroPress & Accessories', url: '/shop?category=manual-brew', icon: 'dripper' },
            { id: 'syphon-brewer', name: 'Syphon & Vacuum Brewer', url: '/shop?category=manual-brew', icon: 'specialty-ferment' },
            { id: 'chemex-woodneck', name: 'Chemex & Woodneck Carafe', url: '/shop?category=server', icon: 'server' },
            { id: 'moka-pot', name: 'Moka Pot & Stovetop Espresso', url: '/shop?category=manual-brew', icon: 'espresso-home' },
            { id: 'cold-brew-maker', name: 'Cold Brew Bottle & Maker', url: '/shop?category=cold-brew', icon: 'cold-brew' },
            { id: 'vietnamese-phin', name: 'Vietnamese Coffee Phin Drip', url: '/shop?category=dripper', icon: 'dripper' },
        ],
    },
    {
        id: 'coffee-tools',
        name: 'Coffee Tools',
        slug: 'coffee-tools',
        url: '/shop?category=coffee-tools',
        subcategories: [
            { id: 'digital-scale', name: 'Digital Coffee Scale & Timer', url: '/shop?category=scale', icon: 'scale' },
            { id: 'gooseneck-kettle', name: 'Variable Gooseneck Kettle', url: '/shop?category=kettle', icon: 'kettle' },
            { id: 'coffee-server', name: 'Coffee Glass Server & Carafe', url: '/shop?category=server', icon: 'server' },
            { id: 'paper-filter-cone', name: 'Paper & Cloth Coffee Filters', url: '/shop?category=paper-filter', icon: 'paper-filter' },
            { id: 'cupping-gear', name: 'SCA Cupping Bowls & Spoons', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'coffee-canister', name: 'Vacuum Storage Coffee Canister', url: '/shop?category=tumbler', icon: 'tumbler' },
            { id: 'thermometer-tds', name: 'Digital Thermometer & TDS Meter', url: '/shop?category=scale', icon: 'scale' },
            { id: 'flow-monitor', name: 'Flow Rate Monitor & Stand', url: '/shop?category=scale', icon: 'scale' },
        ],
    },
    {
        id: 'barista-tools',
        name: 'Barista Tools',
        slug: 'barista-tools',
        url: '/shop?category=barista-tools',
        subcategories: [
            { id: 'tamper-palm', name: 'Precision Tamper & Palm Tamper', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'coffee-distributor', name: 'Distribution & Leveler Tool', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'wdt-needle', name: 'WDT Needle Distribution Tool', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'bottomless-portafilter', name: 'Bottomless Naked Portafilter', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'milk-pitcher', name: 'Latte Art Milk Pitcher / Jug', url: '/shop?category=server', icon: 'server' },
            { id: 'tamping-mat', name: 'Silicone Tamping Mat & Station', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'knockbox-tube', name: 'Espresso Knockbox & Tube', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'puck-screen', name: 'Precision Puck Screen Mesh', url: '/shop?category=paper-filter', icon: 'paper-filter' },
        ],
    },
    {
        id: 'syrups-powders',
        name: 'Syrups & Powders',
        slug: 'syrups-powders',
        url: '/shop?category=ingredients',
        subcategories: [
            { id: 'gourmet-syrups', name: 'Artisan Gourmet Coffee Syrups', url: '/shop?category=syrups', icon: 'syrups' },
            { id: 'sauce-drizzle', name: 'Caramel & Dark Chocolate Sauce', url: '/shop?category=syrups', icon: 'syrups' },
            { id: 'frappe-base', name: 'Frappe & Non-Dairy Creamer', url: '/shop?category=powder', icon: 'powder' },
            { id: 'flavored-powders', name: 'Taro, Red Velvet & Chai Powder', url: '/shop?category=powder', icon: 'powder' },
            { id: 'liquid-cane-sugar', name: 'Liquid Cane Sugar & Sweetener', url: '/shop?category=syrups', icon: 'syrups' },
            { id: 'plant-based-dairy', name: 'Oat Milk & Barista Almond Dairy', url: '/shop?category=dairy', icon: 'milk' },
            { id: 'fresh-milk', name: 'Fresh Milk & Heavy Cream', url: '/shop?category=dairy', icon: 'milk' },
            { id: 'cocktail-purees', name: 'Mocktail & Fruit Purees', url: '/shop?category=syrups', icon: 'syrups' },
        ],
    },
    {
        id: 'roastery-supplies',
        name: 'Roastery Supplies',
        slug: 'roastery-supplies',
        url: '/shop?category=roastery-supplies',
        subcategories: [
            { id: 'green-coffee-sacks', name: 'Jute & GrainPro Coffee Sacks', url: '/shop?category=green-bean', icon: 'green-bean' },
            { id: 'degassing-bags', name: 'Degassing Valve Coffee Bags', url: '/shop?category=merchandise', icon: 'gift' },
            { id: 'kraft-pouch', name: 'Eco Kraft Pouch & Tin Tie', url: '/shop?category=merchandise', icon: 'gift' },
            { id: 'nitrogen-flusher', name: 'Nitrogen Flusher & Packaging', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'sample-roaster', name: 'Mini Electric Sample Roaster', url: '/shop?category=espresso-machines', icon: 'espresso-commercial' },
            { id: 'cupping-trays', name: 'Green Bean Sample Cupping Trays', url: '/shop?category=barista-tools', icon: 'barista-tools' },
            { id: 'moisture-meter', name: 'Coffee Moisture & Density Meter', url: '/shop?category=scale', icon: 'scale' },
            { id: 'bag-sealer', name: 'Continuous Band Heat Sealer', url: '/shop?category=barista-tools', icon: 'barista-tools' },
        ],
    },
];

