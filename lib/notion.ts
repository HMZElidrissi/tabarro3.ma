import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { cache } from 'react';
import { BlogPost } from '@/types/post';

export interface NotionProperties {
    Title: {
        title: Array<{
            plain_text: string;
        }>;
    };
    Slug: {
        rich_text: Array<{
            plain_text: string;
        }>;
    };
    Excerpt: {
        rich_text: Array<{
            plain_text: string;
        }>;
    };
    Published: {
        date: {
            start: string;
        };
    };
    Author?: {
        rich_text: Array<{
            plain_text: string;
        }>;
    };
    Cover?: {
        files: Array<{
            file?: {
                url: string;
            };
            external?: {
                url: string;
            };
        }>;
    };
    Tags?: {
        multi_select: Array<{
            name: string;
        }>;
    };
}

export const notionClient = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const n2m = new NotionToMarkdown({ notionClient });

// Cache the blog posts data to improve performance
export const getBlogPosts = cache(
    async (locale: string = 'fr'): Promise<BlogPost[]> => {
        try {
            const databaseId = process.env.NOTION_DATABASE_ID as string;

            const response = await notionClient.databases.query({
                database_id: databaseId,
                filter: {
                    property: 'Language',
                    select: {
                        equals: locale,
                    },
                },
                sorts: [
                    {
                        property: 'Published',
                        direction: 'descending',
                    },
                ],
            });

            return response.results.map((page: any) => {
                const properties = page.properties as NotionProperties;

                return {
                    id: page.id,
                    title: properties.Title.title[0]?.plain_text || 'Untitled',
                    slug: properties.Slug.rich_text[0]?.plain_text || '',
                    excerpt: properties.Excerpt.rich_text[0]?.plain_text || '',
                    publishDate:
                        properties.Published.date?.start ||
                        new Date().toISOString(),
                    author:
                        properties.Author?.rich_text[0]?.plain_text ||
                        'Tabarro3 Team',
                    coverImage:
                        properties.Cover?.files[0]?.file?.url ||
                        properties.Cover?.files[0]?.external?.url ||
                        '/blog-placeholder.jpg',
                    tags:
                        properties.Tags?.multi_select?.map(
                            (tag: any) => tag.name,
                        ) || [],
                };
            });
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    },
);

export const getBlogPost = cache(
    async (slug: string, locale: string = 'fr'): Promise<BlogPost | null> => {
        try {
            const databaseId = process.env.NOTION_DATABASE_ID as string;

            const response = await notionClient.databases.query({
                database_id: databaseId,
                filter: {
                    and: [
                        {
                            property: 'Slug',
                            rich_text: {
                                equals: slug,
                            },
                        },
                        {
                            property: 'Language',
                            select: {
                                equals: locale,
                            },
                        },
                    ],
                },
            });

            if (!response.results[0]) {
                return null;
            }

            const page = response.results[0];
            const mdBlocks = await n2m.pageToMarkdown(page.id);
            const mdString = n2m.toMarkdownString(mdBlocks);

            const properties = (page as any).properties as NotionProperties;

            return {
                id: page.id,
                title: properties.Title.title[0]?.plain_text || 'Untitled',
                slug: properties.Slug.rich_text[0]?.plain_text || '',
                excerpt: properties.Excerpt.rich_text[0]?.plain_text || '',
                publishDate:
                    properties.Published.date?.start ||
                    new Date().toISOString(),
                author:
                    properties.Author?.rich_text[0]?.plain_text ||
                    'Tabarro3 Team',
                coverImage:
                    properties.Cover?.files[0]?.file?.url ||
                    properties.Cover?.files[0]?.external?.url ||
                    '/blog-placeholder.jpg',
                tags:
                    properties.Tags?.multi_select?.map(
                        (tag: { name: string }) => tag.name,
                    ) || [],
                content: mdString.parent,
            };
        } catch (error) {
            console.error('Error fetching blog post:', error);
            return null;
        }
    },
);

// Get related posts based on tags
export async function getRelatedPosts(
    currentSlug: string,
    tags: string[],
    locale: string,
    limit: number = 3,
): Promise<BlogPost[]> {
    try {
        const allPosts = await getBlogPosts(locale);

        // Filter out the current post and sort by tag relevance
        return allPosts
            .filter(post => post.slug !== currentSlug)
            .sort((a, b) => {
                const aRelevance = a.tags.filter(tag =>
                    tags.includes(tag),
                ).length;
                const bRelevance = b.tags.filter(tag =>
                    tags.includes(tag),
                ).length;
                return bRelevance - aRelevance;
            })
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return [];
    }
}
