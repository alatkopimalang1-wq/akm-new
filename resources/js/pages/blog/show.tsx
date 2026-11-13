import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import DynamicCategoryIcon from '@/components/dynamic-category-icon';
import FlipBookSlider, { type FlipBookPageItem } from '@/components/flipbook-slider';
import type { Post } from '@/types/sanubari';
import { ScrollProgress, ScrollProgressProvider } from '@animate-ui/react/primitives/scroll-progress';

interface BlogShowProps {
    post: Post;
    contentHtml?: string | null;
    relatedPosts: Post[];
}

const resolveImageUrl = (img?: string | null) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const clean = img.replace(/^\/?(public\/|storage\/)?/, '');
    return `/storage/${clean}`;
};

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
        const clean = dateString.replace(/Z$/, '').replace(/([+-]\d{2}:\d{2})$/, '');
        const date = new Date(clean);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
};

const getContentAspectClass = (aspect?: string) => {
    switch (aspect) {
        case 'aspect-16/9':
            return 'aspect-16/9';
        case 'aspect-4/3':
            return 'aspect-4/3';
        case 'aspect-square':
            return 'aspect-square';
        case 'auto':
        default:
            return 'aspect-auto min-h-[220px]';
    }
};

export default function BlogShow({ post, contentHtml, relatedPosts = [] }: BlogShowProps) {
    const title = typeof post.title === 'string' ? post.title : (post.title as any)?.id || '';
    const body = typeof post.body === 'string' ? post.body : (post.body as any)?.id || '';
    const meta = (post.meta as Record<string, any>) || {};

    const articleIcon = meta.icon || 'newspaper';
    const isFeatured = Boolean(meta.is_featured);
    const badgeLabel = meta.badge_label;
    const coverCaption = meta.cover_caption;

    // Gallery settings
    const galleryImages: string[] = Array.isArray(meta.gallery_images) ? meta.gallery_images : [];
    const galleryColsRaw = meta.gallery_columns;
    const isGalleryFlipbook = galleryColsRaw === 'flipbook_3d';
    const galleryCols = Number(galleryColsRaw) || 3;
    const galleryTitle = meta.gallery_title || 'Galeri Gambar Artikel';
    const galleryPosition = meta.gallery_position || 'after_content';

    // Dedicated 3D Page-Flip Book Slider settings
    const flipbookEnabled = Boolean(meta.flipbook_enabled);
    const flipbookPages: FlipBookPageItem[] = Array.isArray(meta.flipbook_pages) ? meta.flipbook_pages : [];
    const flipbookTitle = meta.flipbook_title || '';
    const flipbookSubtitle = meta.flipbook_subtitle || '';
    const flipbookPosition = meta.flipbook_position || 'after_cover';
    const flipbookTheme = meta.flipbook_theme || 'midnight';
    const flipbookAutoplay = Boolean(meta.flipbook_autoplay);

    // In-content image & grid settings (Desktop & Mobile)
    const contentImages: string[] = Array.isArray(meta.content_images) ? meta.content_images : [];
    const contentImageLayout = meta.content_image_layout || 'grid';
    const contentGridCols = Number(meta.content_grid_cols_desktop) || 2;
    const contentAspect = meta.content_image_aspect || 'aspect-16/9';
    const contentMobileMode = meta.content_mobile_mode || 'stacked_full';
    const contentMobileOrder = meta.content_mobile_order || 'image_first';
    const contentPosition = meta.content_image_position || 'before_text';
    const contentCaption = meta.content_image_caption;
    const contentBlocks: any[] = Array.isArray(meta.content_blocks) ? meta.content_blocks : [];

    const tags: string[] = Array.isArray(meta.tags) ? meta.tags : [];

    const galleryColsClass = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    }[galleryCols] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

    const renderDedicatedFlipbook = () => {
        if (!flipbookEnabled || !flipbookPages || flipbookPages.length === 0) return null;

        return (
            <FlipBookSlider
                pages={flipbookPages}
                title={flipbookTitle}
                subtitle={flipbookSubtitle}
                theme={flipbookTheme}
                autoplay={flipbookAutoplay}
            />
        );
    };

    const renderGallery = () => {
        if (!galleryImages || galleryImages.length === 0) return null;

        if (isGalleryFlipbook) {
            const pagesFromGallery: FlipBookPageItem[] = galleryImages.map((img, idx) => ({
                image: img,
                page_number: String(idx + 1).padStart(2, '0'),
                title: galleryTitle || title,
                caption: coverCaption || `Dokumentasi visual #${idx + 1} — ${title}`,
                text_style: idx % 2 === 0 ? 'quote_italic' : 'regular',
            }));

            return (
                <FlipBookSlider
                    pages={pagesFromGallery}
                    title={galleryTitle}
                    theme={flipbookTheme}
                />
            );
        }

        return (
            <div className="py-6 space-y-4">
                {galleryTitle && (
                    <h3 className="text-lg font-bold text-brand-950 border-b border-sand-200 pb-2">
                        {galleryTitle}
                    </h3>
                )}
                <div className={`grid ${galleryColsClass} gap-4`}>
                    {galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className="aspect-4/3 rounded-2xl overflow-hidden bg-cream-50 border border-sand-200 shadow-xs hover:shadow-md transition-shadow group"
                        >
                            <img
                                src={resolveImageUrl(img) || img}
                                alt={`${title} - foto ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderInContentImages = () => {
        if (!contentImages || contentImages.length === 0) return null;

        if (contentImageLayout === 'flipbook_3d') {
            const pagesFromContent: FlipBookPageItem[] = contentImages.map((img, idx) => ({
                image: img,
                page_number: String(idx + 1).padStart(2, '0'),
                title: title,
                caption: contentCaption || `Lembar visual #${idx + 1} — ${title}`,
                text_style: idx % 2 === 0 ? 'quote_italic' : 'regular',
            }));

            return (
                <FlipBookSlider
                    pages={pagesFromContent}
                    subtitle={contentCaption}
                    theme={flipbookTheme}
                />
            );
        }

        const desktopColsClass = {
            1: 'md:grid-cols-1',
            2: 'md:grid-cols-2',
            3: 'md:grid-cols-3',
            4: 'md:grid-cols-4',
        }[contentGridCols] || 'md:grid-cols-2';

        const isSwipe = contentMobileMode === 'carousel_swipe';
        const isHiddenMobile = contentMobileMode === 'hidden_mobile';
        const isGrid2Mobile = contentMobileMode === 'grid_2';

        let containerClass = '';
        let itemClass = '';

        if (isHiddenMobile) {
            containerClass = `hidden md:grid ${desktopColsClass} gap-4 my-6`;
            itemClass = 'w-full';
        } else if (isSwipe) {
            containerClass = `flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar pb-3 md:grid ${desktopColsClass} md:gap-4 my-6`;
            itemClass = 'shrink-0 w-[82vw] sm:w-[60vw] snap-center md:w-full';
        } else if (isGrid2Mobile) {
            containerClass = `grid grid-cols-2 ${desktopColsClass} gap-3 md:gap-4 my-6`;
            itemClass = 'w-full';
        } else {
            // stacked_full
            containerClass = `grid grid-cols-1 ${desktopColsClass} gap-4 my-6`;
            itemClass = 'w-full';
        }

        const aspectClass = getContentAspectClass(contentAspect);

        return (
            <div className="space-y-2">
                <div className={containerClass}>
                    {contentImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`${itemClass} ${aspectClass} rounded-2xl overflow-hidden bg-sand-200 border border-sand-200 shadow-xs hover:shadow-md transition-shadow group`}
                        >
                            <img
                                src={resolveImageUrl(img) || img}
                                alt={`${title} - ilustrasi ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>
                {contentCaption && (
                    <p className="text-xs text-center text-brand-500 italic pb-2">
                        {contentCaption}
                    </p>
                )}
            </div>
        );
    };

    const renderTextContent = () => {
        if (contentHtml) {
            return (
                <div
                    className="layup-content-wrapper text-brand-900 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            );
        }

        if (/<[a-z][\s\S]*>/i.test(body)) {
            return (
                <div
                    className="article-content max-w-none text-brand-800 text-sm sm:text-base leading-relaxed space-y-6"
                    dangerouslySetInnerHTML={{ __html: body }}
                />
            );
        }

        return (
            <div className="article-content max-w-none text-brand-800 text-sm sm:text-base leading-relaxed space-y-6">
                {(typeof body === 'string' ? body : '').split('\n\n').map((paragraph: string, i: number) => (
                    <p key={i} className="leading-relaxed">
                        {paragraph}
                    </p>
                ))}
            </div>
        );
    };

    const renderContentBlocks = () => {
        if (!contentBlocks || contentBlocks.length === 0) return null;

        return (
            <div className="space-y-8 my-8">
                {contentBlocks.map((block: any, idx: number) => {
                    const blockType = block?.type;
                    const data = block?.data || {};

                    if (blockType === 'table') {
                        const headers: string[] = Array.isArray(data.headers) ? data.headers : [];
                        const rows: any[] = Array.isArray(data.rows) ? data.rows : [];
                        const blockTitle = data.title || '';
                        const subtitle = data.subtitle || '';
                        const layoutDesktop = data.layout_desktop || 'striped';
                        const layoutTablet = data.layout_tablet || 'responsive';
                        const layoutMobile = data.layout_mobile || 'cards';

                        const tableBorderClass = layoutDesktop === 'bordered'
                            ? 'border border-sand-300 [&_th]:border [&_th]:border-sand-300 [&_td]:border [&_td]:border-sand-200'
                            : layoutDesktop === 'clean'
                            ? 'border-0 [&_th]:border-b-2 [&_th]:border-sand-200 [&_td]:border-b [&_td]:border-sand-100'
                            : 'border border-sand-200 [&_tr:nth-child(even)]:bg-[#fcfaf7]';

                        return (
                            <div key={idx} className="my-8 space-y-3">
                                {blockTitle && (
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-brand-950">{blockTitle}</h3>
                                        {subtitle && <p className="text-xs text-brand-500 mt-0.5">{subtitle}</p>}
                                    </div>
                                )}

                                {/* Mobile Cards Mode (layoutMobile === 'cards') */}
                                {layoutMobile === 'cards' && (
                                    <div className="block md:hidden space-y-3">
                                        {rows.map((rowItem: any, rIdx: number) => {
                                            const cells: string[] = Array.isArray(rowItem?.cells)
                                                ? rowItem.cells
                                                : typeof rowItem?.cells === 'string'
                                                ? [rowItem.cells]
                                                : [];
                                            return (
                                                <div
                                                    key={rIdx}
                                                    className="bg-white rounded-xl border border-sand-200 p-4 shadow-2xs space-y-2 hover:border-sand-300 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between border-b border-sand-100 pb-1.5 mb-1.5">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-copper">
                                                            Data #{rIdx + 1}
                                                        </span>
                                                    </div>
                                                    {headers.map((h: string, hIdx: number) => (
                                                        <div
                                                            key={hIdx}
                                                            className="flex justify-between items-baseline gap-3 text-xs border-b border-sand-50 last:border-b-0 pb-1.5 last:pb-0"
                                                        >
                                                            <span className="font-semibold text-brand-600 shrink-0">{h}</span>
                                                            <span className="font-medium text-brand-950 text-right">{cells[hIdx] ?? '-'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Regular Table Mode (Desktop/Tablet, and Mobile if not cards) */}
                                <div
                                    className={`${
                                        layoutMobile === 'cards' ? 'hidden md:block' : 'block'
                                    } ${
                                        layoutMobile === 'scroll' || layoutTablet === 'scroll'
                                            ? 'overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0'
                                            : 'overflow-hidden'
                                    } rounded-xl border border-sand-200 bg-white shadow-2xs`}
                                >
                                    <table className={`w-full text-left text-brand-800 ${layoutMobile === 'compact' ? 'text-xs' : 'text-xs sm:text-sm'} ${tableBorderClass}`}>
                                        {headers.length > 0 && (
                                            <thead className="bg-[#f8f9fa] border-b border-sand-200 text-brand-950 font-bold uppercase tracking-wider text-[11px]">
                                                <tr>
                                                    {headers.map((h: string, hIdx: number) => (
                                                        <th key={hIdx} className={`${layoutMobile === 'compact' ? 'px-3 py-2' : 'px-4 py-3 sm:px-5 sm:py-3.5'}`}>
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                        )}
                                        <tbody className="divide-y divide-sand-200">
                                            {rows.map((rowItem: any, rIdx: number) => {
                                                const cells: string[] = Array.isArray(rowItem?.cells)
                                                    ? rowItem.cells
                                                    : typeof rowItem?.cells === 'string'
                                                    ? [rowItem.cells]
                                                    : [];
                                                return (
                                                    <tr key={rIdx} className="hover:bg-sand-100/50 transition-colors">
                                                        {headers.map((_: string, hIdx: number) => (
                                                            <td key={hIdx} className={`${layoutMobile === 'compact' ? 'px-3 py-2' : 'px-4 py-3 sm:px-5 sm:py-3.5'}`}>
                                                                {cells[hIdx] ?? '-'}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    }

                    if (blockType === 'icon_callout') {
                        const iconName = data.icon || 'coffee';
                        const blockTitle = data.title || '';
                        const text = data.text || '';
                        const color = data.color || 'copper';
                        const layoutDesktop = data.layout_desktop || 'banner';
                        const layoutMobile = data.layout_mobile || 'stacked';

                        const colorClasses: Record<string, { container: string; iconBox: string; title: string; text: string }> = {
                            copper: {
                                container: 'bg-[#fbf7f4] border-accent-copper/40',
                                iconBox: 'bg-accent-copper text-white',
                                title: 'text-brand-950',
                                text: 'text-brand-800',
                            },
                            amber: {
                                container: 'bg-amber-50/70 border-amber-300',
                                iconBox: 'bg-amber-500 text-white',
                                title: 'text-amber-950',
                                text: 'text-amber-900',
                            },
                            emerald: {
                                container: 'bg-emerald-50/70 border-emerald-300',
                                iconBox: 'bg-emerald-600 text-white',
                                title: 'text-emerald-950',
                                text: 'text-emerald-900',
                            },
                            blue: {
                                container: 'bg-sky-50/70 border-sky-300',
                                iconBox: 'bg-sky-600 text-white',
                                title: 'text-sky-950',
                                text: 'text-sky-900',
                            },
                            slate: {
                                container: 'bg-sand-100/70 border-sand-300',
                                iconBox: 'bg-brand-900 text-white',
                                title: 'text-brand-950',
                                text: 'text-brand-800',
                            },
                        };

                        const activeColors = colorClasses[color] || colorClasses.copper;

                        const desktopWidthClass = {
                            banner: 'w-full',
                            centered: 'w-full md:max-w-2xl md:mx-auto',
                            compact_side: 'w-full md:max-w-lg md:mx-auto',
                        }[layoutDesktop] || 'w-full';

                        const mobileLayoutClass = layoutMobile === 'inline'
                            ? 'flex flex-row items-start gap-3.5'
                            : 'flex flex-col sm:flex-row items-start gap-3.5';

                        return (
                            <div
                                key={idx}
                                className={`my-6 rounded-2xl border p-5 sm:p-6 shadow-2xs ${activeColors.container} ${desktopWidthClass}`}
                            >
                                <div className={mobileLayoutClass}>
                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${activeColors.iconBox}`}>
                                        <DynamicCategoryIcon icon={iconName} className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5">
                                        {blockTitle && <h4 className={`text-base font-bold tracking-tight ${activeColors.title}`}>{blockTitle}</h4>}
                                        <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${activeColors.text}`}>{text}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    if (blockType === 'image_grid') {
                        const images: string[] = Array.isArray(data.images) ? data.images : [];
                        const caption = data.caption || '';
                        const layoutDesktop = Number(data.layout_desktop) || 2;
                        const layoutTablet = Number(data.layout_tablet) || 2;
                        const layoutMobile = data.layout_mobile || 'stacked';
                        const aspect = data.aspect_ratio || 'aspect-16/9';
                        const aspectClass = getContentAspectClass(aspect);

                        const desktopColsClass = {
                            1: 'md:grid-cols-1',
                            2: 'md:grid-cols-2',
                            3: 'md:grid-cols-3',
                            4: 'md:grid-cols-4',
                        }[layoutDesktop] || 'md:grid-cols-2';

                        const tabletColsClass = {
                            1: 'sm:grid-cols-1',
                            2: 'sm:grid-cols-2',
                            3: 'sm:grid-cols-3',
                        }[layoutTablet] || 'sm:grid-cols-2';

                        let containerClass = '';
                        let itemClass = '';

                        if (layoutMobile === 'swipe') {
                            containerClass = `flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar pb-3 sm:grid ${tabletColsClass} ${desktopColsClass} sm:gap-4 my-6`;
                            itemClass = 'shrink-0 w-[82vw] sm:w-full snap-center';
                        } else if (layoutMobile === 'grid_2') {
                            containerClass = `grid grid-cols-2 ${tabletColsClass} ${desktopColsClass} gap-3 sm:gap-4 my-6`;
                            itemClass = 'w-full';
                        } else {
                            containerClass = `grid grid-cols-1 ${tabletColsClass} ${desktopColsClass} gap-4 my-6`;
                            itemClass = 'w-full';
                        }

                        return (
                            <div key={idx} className="my-6 space-y-2">
                                <div className={containerClass}>
                                    {images.map((img: string, iIdx: number) => (
                                        <div
                                            key={iIdx}
                                            className={`${itemClass} ${aspectClass} rounded-2xl overflow-hidden bg-sand-200 border border-sand-200 shadow-xs hover:shadow-md transition-shadow group`}
                                        >
                                            <img
                                                src={resolveImageUrl(img) || img}
                                                alt={`${title} - foto sisipan ${iIdx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {caption && (
                                    <p className="text-xs text-center text-brand-500 italic pb-1">
                                        {caption}
                                    </p>
                                )}
                            </div>
                        );
                    }

                    if (blockType === 'text') {
                        const content = data.content || '';
                        const layoutDesktop = data.layout_desktop || 'standard';

                        if (layoutDesktop === 'lead') {
                            return (
                                <div
                                    key={idx}
                                    className="my-6 pl-5 border-l-4 border-accent-copper text-brand-900 text-base sm:text-lg font-medium leading-relaxed italic bg-accent-copper/5 py-3 rounded-r-xl"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            );
                        }

                        return (
                            <div
                                key={idx}
                                className="article-content max-w-none text-brand-800 text-sm sm:text-base leading-relaxed space-y-4 my-6"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        );
                    }

                    if (blockType === 'flipbook_3d') {
                        const pages: FlipBookPageItem[] = Array.isArray(data.pages) ? data.pages : [];
                        return (
                            <FlipBookSlider
                                key={idx}
                                pages={pages}
                                title={data.title}
                                subtitle={data.subtitle}
                                theme={data.theme || 'midnight'}
                            />
                        );
                    }

                    return null;
                })}
            </div>
        );
    };

    const renderArticleBodyWithImages = () => {
        const hasContentImages = contentImages && contentImages.length > 0;

        if (!hasContentImages) {
            return (
                <div className="pt-4 border-t border-sand-200">
                    {renderTextContent()}
                    {renderContentBlocks()}
                </div>
            );
        }

        // Split 50:50 side-by-side layout on desktop
        if (contentImageLayout === 'split_right') {
            return (
                <div className="pt-4 border-t border-sand-200 space-y-6">
                    <div
                        className={`flex flex-col md:flex-row gap-8 items-start ${
                            contentMobileOrder === 'text_first' ? 'flex-col-reverse' : ''
                        }`}
                    >
                        <div className="w-full md:w-1/2">{renderTextContent()}</div>
                        <div className="w-full md:w-1/2">{renderInContentImages()}</div>
                    </div>
                    {renderContentBlocks()}
                </div>
            );
        }

        if (contentImageLayout === 'split_left') {
            return (
                <div className="pt-4 border-t border-sand-200 space-y-6">
                    <div
                        className={`flex flex-col md:flex-row-reverse gap-8 items-start ${
                            contentMobileOrder === 'text_first' ? 'flex-col-reverse' : ''
                        }`}
                    >
                        <div className="w-full md:w-1/2">{renderTextContent()}</div>
                        <div className="w-full md:w-1/2">{renderInContentImages()}</div>
                    </div>
                    {renderContentBlocks()}
                </div>
            );
        }

        // Top banner or before_text
        if (contentImageLayout === 'banner_top' || contentPosition === 'before_text') {
            return (
                <div className="pt-4 border-t border-sand-200 space-y-6">
                    {renderInContentImages()}
                    {renderTextContent()}
                    {renderContentBlocks()}
                </div>
            );
        }

        // Default: after_text or banner_bottom
        return (
            <div className="pt-4 border-t border-sand-200 space-y-6">
                {renderTextContent()}
                {renderInContentImages()}
                {renderContentBlocks()}
            </div>
        );
    };

    return (
        <PublicLayout title={title}>
            <ScrollProgressProvider global>
                {/* Real-time reading scroll progress indicator */}
                <ScrollProgress
                    mode="scaleX"
                    className="fixed top-0 left-0 right-0 h-1 bg-accent-copper z-50 origin-left"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-900 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Journal & Blog</span>
                    </Link>

                    {/* Article Header */}
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-brand-500">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-accent-copper text-white text-[11px] shadow-xs">
                                <DynamicCategoryIcon icon={articleIcon} className="w-3.5 h-3.5" />
                                <span>{post.category}</span>
                            </span>

                            {isFeatured && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30">
                                    ★ Sorotan
                                </span>
                            )}

                            {badgeLabel && badgeLabel.toLowerCase() !== 'catatan roaster' && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sand-200 text-brand-800">
                                    {badgeLabel}
                                </span>
                            )}

                            {post.author_name && (
                                <>
                                    <span>•</span>
                                    <span>Oleh {post.author_name}</span>
                                </>
                            )}

                            {post.published_at && (
                                <>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(post.published_at)}</span>
                                    </span>
                                </>
                            )}

                            {post.read_time_minutes > 0 && (
                                <>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{post.read_time_minutes} menit baca</span>
                                    </span>
                                </>
                            )}
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-950 tracking-tight leading-tight">
                            {title}
                        </h1>
                    </div>

                    {/* Cover Image */}
                    {post.cover_image && (
                        <div className="space-y-2">
                            <div className="aspect-16/9 rounded-3xl overflow-hidden bg-brand-900 shadow-md">
                                <img
                                    src={resolveImageUrl(post.cover_image) || post.cover_image}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {coverCaption && (
                                <p className="text-xs text-center text-brand-500 italic pt-1">
                                    {coverCaption}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Dedicated 3D Flipbook if position is after_cover */}
                    {flipbookPosition === 'after_cover' && renderDedicatedFlipbook()}

                    {/* Gallery if position is after_cover */}
                    {galleryPosition === 'after_cover' && renderGallery()}

                    {/* Dedicated 3D Flipbook if position is before_content */}
                    {flipbookPosition === 'before_content' && renderDedicatedFlipbook()}

                    {/* Article Content with In-Content Images & Responsive Grid */}
                    {renderArticleBodyWithImages()}

                    {/* Dedicated 3D Flipbook if position is after_content */}
                    {flipbookPosition === 'after_content' && renderDedicatedFlipbook()}

                    {/* Gallery if position is after_content */}
                    {galleryPosition === 'after_content' && renderGallery()}

                    {/* Topic Tags */}
                    {tags.length > 0 && (
                        <div className="pt-6 border-t border-sand-200 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-brand-500 flex items-center gap-1 mr-1">
                                <Tag className="w-3.5 h-3.5" />
                                <span>Topik:</span>
                            </span>
                            {tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-sand-200 text-brand-800 hover:bg-sand-300 transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="pt-16 border-t border-sand-200 space-y-6">
                            <h2 className="text-2xl font-bold text-brand-950">Artikel Lainnya</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {relatedPosts.map((p) => {
                                    const relTitle = typeof p.title === 'string' ? p.title : (p.title as any)?.id || '';
                                    return (
                                        <Link
                                            key={p.id}
                                            href={`/blog/${p.slug}`}
                                            className="group bg-white rounded-2xl overflow-hidden border border-sand-200 p-5 sm:p-6 space-y-2.5 hover:shadow-md transition-all"
                                        >
                                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent-copper block">
                                                {p.category}
                                            </span>
                                            <h3 className="text-base sm:text-lg font-bold text-brand-950 group-hover:text-brand-700 leading-snug line-clamp-2">
                                                {relTitle}
                                            </h3>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollProgressProvider>
        </PublicLayout>
    );
}
