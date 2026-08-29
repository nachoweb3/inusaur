import Script from "next/script";
import { config, isPlaceholder } from "@/data/config";

/**
 * SOCIAL FEED — real X/Twitter content via the official oEmbed API.
 *
 * Embeds the pinned tweet configured in `config.twitterUrl` using
 * Twitter's own embed (publish.twitter.com oEmbed + widgets.js). This is
 * always REAL content — the component never invents posts or follower
 * counts. If the oEmbed call fails it renders nothing at all.
 *
 * With the static export this runs once at build time; the embed is
 * refreshed on every redeploy.
 */

type TweetEmbed = {
  html: string;
  author_name: string;
  author_url: string;
  url: string;
};

async function getTweetEmbed(): Promise<TweetEmbed | null> {
  if (isPlaceholder(config.twitterUrl)) return null;
  try {
    const res = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(config.twitterUrl)}&dnt=true&omit_script=false&align=center`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as TweetEmbed;
    if (!data?.html) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function SocialFeed() {
  const embed = await getTweetEmbed();
  if (!embed) return null;

  return (
    <section
      id="social"
      aria-labelledby="social-title"
      className="bg-paper py-24 sm:py-32"
    >
      <div className="container-x">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.28em] text-clay uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-clay" />
            From the feed
          </p>
          <h2
            id="social-title"
            className="display mt-5 text-[clamp(2.2rem,6vw,4rem)] uppercase"
          >
            The tribe, <em className="text-clay">out loud</em>
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-center">
          {/* Twitter's own embed — real post, refreshed hourly */}
          <div
            className="w-full max-w-lg"
            dangerouslySetInnerHTML={{ __html: embed.html }}
          />
          <a
            href={config.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 text-xs font-semibold tracking-[0.2em] text-clay uppercase transition-colors hover:text-ink"
          >
            View on X →
          </a>
        </div>
      </div>

      {/* Twitter's embed runtime; the html above is inert without it */}
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
      />
    </section>
  );
}