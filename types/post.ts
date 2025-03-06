export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishDate: string;
    author: string;
    coverImage: string;
    tags: string[];
    content?: React.ReactNode;
}
