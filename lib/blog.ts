import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { BlogPost } from '@/types/post';

const contentDirectory = path.join(process.cwd(), 'blog');

// Get all blog posts for a specific locale
export const getBlogPosts = cache(
    async (locale: string = 'fr'): Promise<BlogPost[]> => {
        try {
            const localeDir = path.join(contentDirectory, locale);

            if (!fs.existsSync(localeDir)) {
                console.warn(
                    `Blog directory for locale ${locale} does not exist`,
                );
                return [];
            }

            const files = fs.readdirSync(localeDir);
            const mdxFiles = files.filter(file => file.endsWith('.mdx'));

            const posts = mdxFiles
                .map(fileName => {
                    const slug = fileName.replace('.mdx', '');
                    const filePath = path.join(localeDir, fileName);
                    const fileContents = fs.readFileSync(filePath, 'utf8');
                    const { data, content } = matter(fileContents);

                    return {
                        id: slug,
                        title: data.title || 'Untitled',
                        slug,
                        excerpt: data.excerpt || '',
                        publishDate:
                            data.publishDate || new Date().toISOString(),
                        author: data.author || 'tabarro3 Team',
                        coverImage: data.coverImage || '/blog-placeholder.jpg',
                        tags: data.tags || [],
                        content: content,
                    } as BlogPost;
                })
                .filter(post => post.title !== 'Untitled') // Filter out drafts
                .sort(
                    (a, b) =>
                        new Date(b.publishDate).getTime() -
                        new Date(a.publishDate).getTime(),
                );

            return posts;
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    },
);

// Get a single blog post by slug
export const getBlogPost = cache(
    async (slug: string, locale: string = 'fr'): Promise<BlogPost | null> => {
        try {
            const localeDir = path.join(contentDirectory, locale);
            const filePath = path.join(localeDir, `${slug}.mdx`);

            if (!fs.existsSync(filePath)) {
                return null;
            }

            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                id: slug,
                title: data.title || 'Untitled',
                slug,
                excerpt: data.excerpt || '',
                publishDate: data.publishDate || new Date().toISOString(),
                author: data.author || 'tabarro3 Team',
                coverImage: data.coverImage || '/blog-placeholder.jpg',
                tags: data.tags || [],
                content: content,
            } as BlogPost;
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

        const relatedPosts = allPosts
            .filter(post => post.slug !== currentSlug)
            .filter(post => post.tags.some(tag => tags.includes(tag)))
            .slice(0, limit);

        return relatedPosts;
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return [];
    }
}

// Get all blog slugs for static generation
export async function getAllBlogSlugs(
    locale: string = 'fr',
): Promise<string[]> {
    try {
        const localeDir = path.join(contentDirectory, locale);

        if (!fs.existsSync(localeDir)) {
            return [];
        }

        const files = fs.readdirSync(localeDir);
        return files
            .filter(file => file.endsWith('.mdx'))
            .map(file => file.replace('.mdx', ''));
    } catch (error) {
        console.error('Error fetching blog slugs:', error);
        return [];
    }
}
