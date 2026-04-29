import rss from '@astrojs/rss'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts'

export async function GET(context) {
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: [],
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl'
  })
}
