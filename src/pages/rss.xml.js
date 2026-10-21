import rss from '@astrojs/rss';
import { BLOG_DESCRIPTION, BLOG_TITLE } from '../consts';
import { getPublishedPosts } from '../utils/blog';

export async function GET(context) {
	const posts = await getPublishedPosts();
	const sortedPosts = posts.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);

	return rss({
		trailingSlash: false,
		title: BLOG_TITLE,
		description: BLOG_DESCRIPTION,
		site: context.site || 'https://mb.madeinchile.tech',
		items: sortedPosts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}`,
			categories: post.data.tags || [],
			author: 'hi@matiasblanc.dev (Matías Blanc)',
		})),
		customData: `<language>es</language>`,
	});
}
