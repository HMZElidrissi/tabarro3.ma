import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import MdxComponents from '@/components/custom/mdx-components';
import { readFileSync } from 'fs';
import { join } from 'path';

export const metadata: Metadata = {
    title: 'Handbook for New Volunteers | tabarro3.ma',
    description:
        'A comprehensive guide for new volunteers joining tabarro3.ma - learn about our mission, values, and how to contribute effectively.',
    openGraph: {
        title: 'Handbook for New Volunteers | tabarro3.ma',
        description:
            'A comprehensive guide for new volunteers joining tabarro3.ma - learn about our mission, values, and how to contribute effectively.',
    },
};

export default function HandbookPage() {
    // Read the MDX file content
    const handbookPath = join(process.cwd(), 'app/handbook/handbook.mdx');
    const handbookContent = readFileSync(handbookPath, 'utf8');

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Handbook for New Volunteers
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        A comprehensive guide for new volunteers joining
                        tabarro3.ma - learn about our mission, values, and how
                        to contribute effectively.
                    </p>
                </div>

                {/* MDX Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-strong:text-foreground prose-li:text-muted-foreground">
                    <MDXRemote
                        source={handbookContent}
                        components={MdxComponents}
                        options={{
                            mdxOptions: {
                                remarkPlugins: [],
                                rehypePlugins: [],
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
