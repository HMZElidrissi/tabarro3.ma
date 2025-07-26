/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    /**
     * the headers function allows you to set custom headers for your pages and API routes.
     * @returns {Promise<[{headers: [{value: string, key: string},{value: string, key: string}], source: string}]>}
     */
    headers: async () => {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;
