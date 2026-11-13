import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { privacyMeta, termsMeta } from '@/seo/routes';

type LegalKind = 'privacy' | 'terms';

const copy = {
  privacy: {
    title: 'Privacy',
    intro:
      'KASANE is a static, browser-first publication. It does not require an account, and it does not collect personal information on a server.',
    sections: [
      {
        heading: 'What is stored',
        body: 'Your saved places, reading, collections and trips are stored in your browser’s localStorage under a single key. They never leave your device. Clearing site data or using a private window removes them.',
      },
      {
        heading: 'No accounts, no tracking',
        body: 'There is no sign-in, no email capture, no analytics script and no advertising. KASANE does not build a profile of you, and there is no server-side database of your activity.',
      },
      {
        heading: 'Third-party requests',
        body: 'The site loads typefaces from Google Fonts and vector map tiles from OpenFreeMap. Those services receive the normal technical information involved in serving a file, such as your IP address. Photographs and hero film are served from the site itself.',
      },
      {
        heading: 'Links and external pages',
        body: 'Some activities and credits link to external sites. Once you follow a link, the privacy policy of that site applies. KASANE does not control those pages.',
      },
      {
        heading: 'Contact',
        body: 'For questions about this project, open an issue in the repository where it is published. No personal data is held by KASANE to delete.',
      },
    ],
  },
  terms: {
    title: 'Terms',
    intro:
      'KASANE is an independent editorial project and a set of planning tools. By using it, you accept the following limits.',
    sections: [
      {
        heading: 'Editorial, not a booking service',
        body: 'Nothing on KASANE is a reservation, a price guarantee or a commercial offer. Places, activities and estimated costs are editorial suggestions. Bookings and travel arrangements are made directly with the relevant providers.',
      },
      {
        heading: 'Accuracy and change',
        body: 'Places change. Opening times, access, prices and local conditions are not verified in real time, and the editorials do not claim to be exhaustive. Check official sources before you travel.',
      },
      {
        heading: 'Your plans',
        body: 'Itineraries and collections are stored locally in your browser. KASANE cannot recover them if you clear your data or change devices. Export or print any itinerary you want to keep.',
      },
      {
        heading: 'Photography and map data',
        body: 'Photographs and film are licensed via Unsplash and Pexels and depict the places editorially. Map data and tiles are © OpenStreetMap contributors, rendered with OpenFreeMap; the fallback and globe use Natural Earth data. Attribution is maintained on the credits page.',
      },
      {
        heading: 'Use of the site',
        body: 'You may use the site for personal travel research and planning. Do not attempt to disrupt the service, scrape it at scale, or present its editorial content as your own.',
      },
      {
        heading: 'Liability',
        body: 'The site is provided as is, without warranties. KASANE is not liable for decisions made on the basis of editorial content, or for any loss arising from travel arrangements made elsewhere.',
      },
    ],
  },
} as const;

export const LegalPage = ({ kind }: { kind: LegalKind }) => {
  const content = copy[kind];

  usePageMeta(kind === 'privacy' ? privacyMeta : termsMeta);

  return (
    <article className="pb-[var(--spacing-section)] pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+5rem)]">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-[0.75rem] text-ink/45">{content.title}</p>
            <h1 className="display-lg mt-3">{content.title}, plainly.</h1>
            <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink/60">
              {content.intro}
            </p>
            <p className="mt-6 text-[0.75rem] text-ink/40">Last updated: November 2026</p>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            {content.sections.map((section) => (
              <section key={section.heading} className="border-t border-ink/12 py-6">
                <h2 className="display-sm">{section.heading}</h2>
                <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink/65">
                  {section.body}
                </p>
              </section>
            ))}
            <div className="border-t border-ink/12 pt-6">
              <Link to="/" className="link-quiet text-[0.875rem] text-ink">
                Back to the atlas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
