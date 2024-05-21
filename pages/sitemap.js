import { MetadataRoute } from 'next';

export default function sitemap() {
    return [
        MetadataRoute.create('/sitemap.xml', {
            headers: {
                'Content-Type': 'application/xml',
            },
        }),
        MetadataRoute.create('/robots.txt', {
            headers: {
                'Content-Type': 'text/plain',
            },
        }),
        MetadataRoute.create('/favicon.ico'),
        MetadataRoute.create('/manifest.json'),

    ]
}