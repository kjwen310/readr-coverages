import { Component, Host, State, h } from '@stencil/core';

const TEMP_OLD_PROJECTS_SLUGS = [
  'china-company',
  'unitedfront',
  'food-delivery',
  'extra-curriculum',
  'election-2020',
  'formosaincident',
  'the-third-force',
  'maskmap',
  'ncov2019search',
  'backtoformosa',
  'covid19-disinformation-vis',
  'covid19-disinformation',
  'eid',
]

const DATA_URL = 'https://www.readr.tw/api/public/posts?type={"$in":[1,4]}&sort=-published_at&max_result=3'
const NEWS_URL = 'https://www.readr.tw/post'
const REPORT_URL = 'https://www.readr.tw/project/3'
const OLD_REPORT_URL = 'https://www.readr.tw/project'

type Post = {
  title: string,
  type: number,
  slug: string,
  id: number,
  hero_image: string,
  og_image: string,
  published_at: string
}

type Coverage = {
  title: string,
  href: string,
  image: string,
  publishedAt: string
}

function format(datatimeString: string): string {
  const MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
  const date = new Date(datatimeString)
  return `${MONTHS[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}`
}

function restructureData(data: Post): Object {
  return ({
    title: data.title,
    href: data.type === 4 ? getReportHref(data.slug) : `${NEWS_URL}/${data.id}`,
    image: data.og_image || data.hero_image,
    publishedAt: format(data.published_at),
  })
}

function getReportHref(slug) {
  return TEMP_OLD_PROJECTS_SLUGS.some((ele) => ele === slug) ? `${OLD_REPORT_URL}/${slug}` : `${REPORT_URL}/${slug}`
}

async function fetchData(url: string) {
  try {
    const response = await fetch(url)
    const { _items = [] } = await response.json()
    return _items
  } catch (error) {
    console.error('fetchData error:', error)
    return []
  }
}


@Component({
  tag: 'latest-coverages',
  styleUrl: 'latest-coverages.css',
  shadow: true,
})

export class LatestCoverages {
  @State() coverages: Coverage[];

  async componentWillLoad() {
    const items = await fetchData(DATA_URL)
    this.coverages = items.map((item) => restructureData(item))
  }

  render() {
    return (
      <Host>
        {this.coverages.map((coverage) => 
          <div class="coverage">
            <a class="coverage__image" href={coverage.href} target="_blank">
              <img src={coverage.image} alt={coverage.title} />
            </a>
            <a class="coverage__info" href={coverage.href} target="_blank">
              <h3>{ coverage.title }</h3>
              <p>{ coverage.publishedAt }</p>
            </a>
          </div>
        )}
      </Host>
    );
  }

}
